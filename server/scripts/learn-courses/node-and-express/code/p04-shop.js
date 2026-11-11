// Project 4: e-commerce back end. Products, cart, orders, stock, and a payment provider behind an interface.
import express from 'express';
import { AppError, requireAuth, requireRole, errorHandler, notFoundHandler } from './p-kit.js';

export function createApp({ payments = { charge: async () => ({ ok: true, id: 'pay_demo' }) } } = {}) {
  const app = express();
  app.use(express.json());
  const auth = requireAuth();
  const products = new Map();
  const carts = new Map();     // userId -> Map(productId -> qty)
  const orders = [];

  app.get('/api/products', (req, res) => res.json([...products.values()].filter((p) => p.stock > 0)));

  app.post('/api/products', auth, requireRole('admin'), (req, res) => {
    const { name, priceCents, stock } = req.body ?? {};
    if (!name || !Number.isInteger(priceCents) || priceCents < 1 || !Number.isInteger(stock) || stock < 0) throw new AppError('name, priceCents (whole number) and stock are required', 422);
    const product = { id: products.size + 1, name, priceCents, stock };
    products.set(product.id, product);
    res.status(201).json(product);
  });

  const cartOf = (userId) => carts.get(userId) ?? carts.set(userId, new Map()).get(userId);

  app.put('/api/cart/:productId', auth, (req, res) => {
    const product = products.get(Number(req.params.productId));
    const qty = req.body?.qty;
    if (!product) throw new AppError('Product not found', 404);
    if (!Number.isInteger(qty) || qty < 0) throw new AppError('qty must be 0 or more', 422);
    if (qty > product.stock) throw new AppError(`Only ${product.stock} in stock`, 409);
    const cart = cartOf(req.user.id);
    if (qty === 0) cart.delete(product.id); else cart.set(product.id, qty);
    res.json({ items: [...cart].map(([id, q]) => ({ productId: id, qty: q })) });
  });

  // Checkout: price from OUR data, stock checked again, stock reduced only after payment works.
  app.post('/api/orders', auth, async (req, res) => {
    const cart = cartOf(req.user.id);
    if (!cart.size) throw new AppError('Your cart is empty', 409);
    let totalCents = 0;
    const lines = [];
    for (const [id, qty] of cart) {
      const product = products.get(id);
      if (qty > product.stock) throw new AppError(`Not enough stock for ${product.name}`, 409);
      totalCents += product.priceCents * qty;
      lines.push({ productId: id, name: product.name, qty, priceCents: product.priceCents });
    }
    const payment = await payments.charge({ userId: req.user.id, amountCents: totalCents });
    if (!payment.ok) throw new AppError('Payment failed', 402);
    for (const line of lines) products.get(line.productId).stock -= line.qty;
    cart.clear();
    const order = { id: orders.length + 1, userId: req.user.id, lines, totalCents, paymentId: payment.id, status: 'paid' };
    orders.push(order);
    res.status(201).json(order);
  });

  app.get('/api/orders', auth, (req, res) => res.json(orders.filter((o) => o.userId === req.user.id)));

  app.use(notFoundHandler, errorHandler);
  return app;
}
