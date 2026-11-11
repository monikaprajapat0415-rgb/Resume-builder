import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createBroker, startUsers, startOrders, startNotifications, startGateway } from './p10-microservices.js';
import { signToken } from './p-kit.js';

const as = (id) => ({ Authorization: `Bearer ${signToken({ id, role: 'user', name: `u${id}` })}` });

test('project 10: gateway, services and events', async () => {
  const broker = createBroker();
  const users = await startUsers();
  const orders = await startOrders({ usersUrl: users.url, broker });
  const notifications = startNotifications({ broker });
  const gateway = await startGateway({ usersUrl: users.url, ordersUrl: orders.url });

  assert.equal((await request(gateway.url).get('/api/orders')).status, 401);              // the gateway checks the token

  const me = await request(gateway.url).get('/api/users/me').set(as(1));
  assert.equal(me.body.name, 'Asha');

  // The client tries to order as another user: the gateway overwrites userId from the token.
  const order = await request(gateway.url).post('/api/orders').set(as(1)).send({ item: 'Keyboard', userId: 2 });
  assert.equal(order.status, 201);
  assert.equal(order.body.userId, 1);

  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.deepEqual(notifications.sent, ['Thanks Asha, we got your order for Keyboard']);   // another service reacted to the event

  assert.equal((await request(gateway.url).get('/api/orders').set(as(1))).body.length, 1);
  assert.equal((await request(gateway.url).get('/api/orders').set(as(2))).body.length, 0);
  assert.equal((await request(gateway.url).post('/api/orders').set(as(99)).send({ item: 'X' })).status, 422);    // unknown user

  // Take the users service down: orders fail clearly with 503 instead of hanging or crashing.
  users.server.close();
  users.server.closeAllConnections();
  assert.equal((await request(gateway.url).post('/api/orders').set(as(1)).send({ item: 'Mouse' })).status, 503);

  for (const s of [orders, gateway]) { s.server.close(); s.server.closeAllConnections(); }
});
