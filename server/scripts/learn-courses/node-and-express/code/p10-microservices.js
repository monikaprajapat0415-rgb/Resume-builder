// Project 10: three small services and a gateway, running in one process so you can test them.
//   users service      owns user data
//   orders service     owns orders, asks the users service who the customer is, publishes "order.created"
//   notifications      listens to events from the broker (a queue between services)
//   gateway            the ONLY public door: checks the token, then forwards to a service
import express from 'express';
import http from 'node:http';
import { EventEmitter } from 'node:events';
import { requireAuth, errorHandler, notFoundHandler, AppError } from './p-kit.js';

const listen = (app) => new Promise((resolve) => { const server = http.createServer(app).listen(0, () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` })); });

// A message broker in miniature. In production this is Redis (BullMQ), RabbitMQ or Kafka.
export function createBroker() {
  const bus = new EventEmitter();
  return { publish: (topic, message) => setImmediate(() => bus.emit(topic, message)), subscribe: (topic, handler) => bus.on(topic, handler) };
}

export async function startUsers() {
  const app = express();
  const users = new Map([[1, { id: 1, name: 'Asha' }], [2, { id: 2, name: 'Ravi' }]]);
  app.get('/users/:id', (req, res) => (users.has(Number(req.params.id)) ? res.json(users.get(Number(req.params.id))) : res.status(404).json({ error: 'User not found' })));
  app.get('/health', (req, res) => res.json({ ok: true }));
  return listen(app);
}

export async function startOrders({ usersUrl, broker }) {
  const app = express();
  app.use(express.json());
  const orders = [];

  app.post('/orders', async (req, res) => {
    // Service-to-service call with a time limit: never wait forever for another service.
    let customer;
    try {
      const reply = await fetch(`${usersUrl}/users/${req.body.userId}`, { signal: AbortSignal.timeout(1000) });
      if (reply.status === 404) return res.status(422).json({ error: 'Unknown user' });
      customer = await reply.json();
    } catch {
      return res.status(503).json({ error: 'User service is not available, try again later' });   // fail clearly, do not crash
    }
    const order = { id: orders.length + 1, userId: customer.id, item: String(req.body.item ?? ''), status: 'created' };
    orders.push(order);
    broker.publish('order.created', { orderId: order.id, userName: customer.name, item: order.item });    // others react later
    res.status(201).json(order);
  });

  app.get('/orders', (req, res) => res.json(orders.filter((o) => o.userId === Number(req.query.userId))));
  app.get('/health', (req, res) => res.json({ ok: true }));
  return listen(app);
}

export function startNotifications({ broker }) {
  const sent = [];
  broker.subscribe('order.created', (event) => sent.push(`Thanks ${event.userName}, we got your order for ${event.item}`));
  return { sent };
}

export async function startGateway({ usersUrl, ordersUrl }) {
  const app = express();
  app.use(express.json());
  const auth = requireAuth();

  const forward = (base) => async (req, res) => {
    const reply = await fetch(base + req.originalUrl.replace(/^\/api/, ''), {
      method: req.method,
      headers: { 'content-type': 'application/json' },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify({ ...req.body, userId: req.user.id }),   // the user id comes from the TOKEN, never from the client
      signal: AbortSignal.timeout(2000),
    });
    res.status(reply.status).json(await reply.json());
  };

  app.get('/api/users/me', auth, (req, res, next) => { req.url = `/users/${req.user.id}`; req.originalUrl = req.url; next(); }, forward(usersUrl));
  app.post('/api/orders', auth, forward(ordersUrl));
  app.get('/api/orders', auth, (req, res, next) => { req.originalUrl = `/orders?userId=${req.user.id}`; next(); }, forward(ordersUrl));
  app.get('/health', (req, res) => res.json({ ok: true }));

  app.use(notFoundHandler);
  app.use((err, req, res, next) => (err.name === 'TimeoutError' ? res.status(504).json({ error: 'Service timed out' }) : errorHandler(err, req, res, next)));
  return { ...(await listen(app)), app };
}
