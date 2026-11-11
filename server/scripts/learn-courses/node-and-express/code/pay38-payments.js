import express from 'express';
import crypto from 'node:crypto';

// Rules for payments: money is in whole cents, the SERVER decides the price, the PROVIDER takes the card,
// and the order becomes "paid" only when a signed webhook from the provider says so.
export const sign = (raw, secret) => crypto.createHmac('sha256', secret).update(raw).digest('hex');

export function createApp({ provider, webhookSecret, catalog }) {
  const app = express();
  const orders = new Map();
  const seenEvents = new Set();      // idempotency: the provider may send the same event twice

  // IMPORTANT: the webhook needs the RAW body to check the signature, so it comes before express.json().
  app.post('/webhooks/payments', express.raw({ type: 'application/json' }), (req, res) => {
    const signature = req.get('x-signature') ?? '';
    const expected = sign(req.body, webhookSecret);
    const ok = signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!ok) return res.status(400).json({ error: 'Bad signature' });

    const event = JSON.parse(req.body.toString('utf8'));
    if (seenEvents.has(event.id)) return res.json({ received: true, duplicate: true });
    seenEvents.add(event.id);

    const order = orders.get(event.orderId);
    if (order && event.type === 'payment.succeeded' && event.amountCents === order.totalCents) order.status = 'paid';
    if (order && event.type === 'payment.failed') order.status = 'failed';
    res.json({ received: true });
  });

  app.use(express.json());

  app.post('/orders', async (req, res) => {
    const items = req.body?.items;
    if (!Array.isArray(items) || !items.length) return res.status(422).json({ error: 'items are required' });
    let totalCents = 0;
    for (const { sku, qty } of items) {
      const product = catalog[sku];
      if (!product || !Number.isInteger(qty) || qty < 1) return res.status(422).json({ error: `Bad item ${sku}` });
      totalCents += product.priceCents * qty;            // the price comes from OUR catalog, never from the client
    }
    const order = { id: orders.size + 1, totalCents, status: 'pending' };
    orders.set(order.id, order);
    const payment = await provider.createPayment({ orderId: order.id, amountCents: totalCents });
    res.status(201).json({ ...order, paymentUrl: payment.url });
  });

  app.get('/orders/:id', (req, res) => {
    const order = orders.get(Number(req.params.id));
    return order ? res.json(order) : res.status(404).json({ error: 'Not found' });
  });
  return app;
}
