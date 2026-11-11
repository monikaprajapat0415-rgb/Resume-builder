import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './r20-api.js';

const app = createApp();

test('paging', async () => {
  const res = await request(app).get('/api/v1/products?page=2&limit=10');
  assert.equal(res.body.data.length, 10);
  assert.equal(res.body.data[0].id, 11);
  assert.deepEqual(res.body.meta, { page: 2, limit: 10, total: 45, totalPages: 5 });
});

test('limit is capped and bad numbers fall back', async () => {
  const res = await request(app).get('/api/v1/products?limit=9999&page=abc');
  assert.equal(res.body.meta.limit, 50);
  assert.equal(res.body.meta.page, 1);
});

test('filter, sort and search', async () => {
  const cheap = await request(app).get('/api/v1/products?category=books&maxPrice=200&sort=price&order=desc');
  assert.ok(cheap.body.data.length > 0);
  assert.ok(cheap.body.data.every((p) => p.category === 'books' && p.price <= 200));
  const prices = cheap.body.data.map((p) => p.price);
  assert.deepEqual(prices, [...prices].sort((a, b) => b - a));

  const found = await request(app).get('/api/v1/products?q=item 07');
  assert.deepEqual(found.body.data.map((p) => p.id), [7]);
});

test('status codes', async () => {
  const created = await request(app).post('/api/v1/products').send({ name: 'Lamp', price: 250 });
  assert.equal(created.status, 201);
  assert.equal(created.headers.location, `/api/v1/products/${created.body.id}`);
  assert.equal((await request(app).post('/api/v1/products').send({ name: 'lamp', price: 1 })).status, 409);
  assert.equal((await request(app).post('/api/v1/products').send({ name: '', price: 1 })).status, 422);
});

test('version 2 has its own shape', async () => {
  const res = await request(app).get('/api/v2/products');
  assert.equal(res.body.items[0].priceInr > 0, true);
});
