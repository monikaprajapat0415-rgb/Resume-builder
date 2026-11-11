import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp, sign } from './pay38-payments.js';

const provider = { createPayment: async ({ orderId }) => ({ url: `https://pay.example/checkout/${orderId}` }) };
const catalog = { pen: { priceCents: 1500 }, book: { priceCents: 49900 } };
const SECRET = 'whsec_test';

function webhook(app, event, secret = SECRET) {
  const raw = JSON.stringify(event);
  return request(app).post('/webhooks/payments').set('Content-Type', 'application/json').set('x-signature', sign(raw, secret)).send(raw);
}

test('server computes the price and only a signed webhook marks it paid', async () => {
  const app = createApp({ provider, webhookSecret: SECRET, catalog });

  // The client tries to send its own price: it is ignored.
  const created = await request(app).post('/orders').send({ items: [{ sku: 'pen', qty: 2, priceCents: 1 }, { sku: 'book', qty: 1 }] });
  assert.equal(created.status, 201);
  assert.equal(created.body.totalCents, 52900);
  assert.equal(created.body.status, 'pending');

  // Unsigned or wrongly signed: refused, order unchanged.
  assert.equal((await webhook(app, { id: 'e1', type: 'payment.succeeded', orderId: 1, amountCents: 52900 }, 'wrong')).status, 400);
  assert.equal((await request(app).get('/orders/1')).body.status, 'pending');

  // Wrong amount: ignored.
  await webhook(app, { id: 'e2', type: 'payment.succeeded', orderId: 1, amountCents: 100 });
  assert.equal((await request(app).get('/orders/1')).body.status, 'pending');

  // Correct: paid. Sending it again is harmless.
  await webhook(app, { id: 'e3', type: 'payment.succeeded', orderId: 1, amountCents: 52900 });
  assert.equal((await request(app).get('/orders/1')).body.status, 'paid');
  const again = await webhook(app, { id: 'e3', type: 'payment.succeeded', orderId: 1, amountCents: 52900 });
  assert.equal(again.body.duplicate, true);
});
