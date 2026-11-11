import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './p04-shop.js';
import { signToken } from './p-kit.js';

const as = (id, role = 'user') => ({ Authorization: `Bearer ${signToken({ id, role, name: `u${id}` })}` });

test('project 4: cart, stock and checkout', async () => {
  const charges = [];
  let paymentOk = true;
  const app = createApp({ payments: { charge: async (c) => { charges.push(c); return { ok: paymentOk, id: 'pay_1' }; } } });
  const admin = as(1, 'admin');

  assert.equal((await request(app).post('/api/products').set(as(2)).send({ name: 'Pen', priceCents: 1500, stock: 5 })).status, 403);
  await request(app).post('/api/products').set(admin).send({ name: 'Pen', priceCents: 1500, stock: 5 });
  await request(app).post('/api/products').set(admin).send({ name: 'Book', priceCents: 49900, stock: 1 });
  assert.equal((await request(app).post('/api/products').set(admin).send({ name: 'Bad', priceCents: 9.99, stock: 1 })).status, 422);

  const buyer = as(2);
  assert.equal((await request(app).put('/api/cart/1').set(buyer).send({ qty: 9 })).status, 409);          // more than the stock
  await request(app).put('/api/cart/1').set(buyer).send({ qty: 3 });
  await request(app).put('/api/cart/2').set(buyer).send({ qty: 1 });

  paymentOk = false;
  assert.equal((await request(app).post('/api/orders').set(buyer)).status, 402);
  assert.equal((await request(app).get('/api/products')).body.find((p) => p.id === 1).stock, 5);          // no stock lost when payment failed

  paymentOk = true;
  const order = await request(app).post('/api/orders').set(buyer);
  assert.equal(order.status, 201);
  assert.equal(order.body.totalCents, 3 * 1500 + 49900);
  assert.equal(charges.at(-1).amountCents, 54400);

  const left = (await request(app).get('/api/products')).body;
  assert.deepEqual(left.map((p) => [p.name, p.stock]), [['Pen', 2]]);                                       // Book is sold out and hidden
  assert.equal((await request(app).post('/api/orders').set(buyer)).status, 409);                            // cart is now empty
  assert.equal((await request(app).get('/api/orders').set(buyer)).body.length, 1);
  assert.equal((await request(app).get('/api/orders').set(as(3))).body.length, 0);                         // others cannot see it
});
