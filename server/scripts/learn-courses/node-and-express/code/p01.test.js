import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './p01-users.js';

test('project 1: users CRUD', async () => {
  const app = createApp();

  const created = await request(app).post('/api/users').send({ name: ' Asha ', email: 'ASHA@Example.com', age: 29 });
  assert.equal(created.status, 201);
  assert.equal(created.body.email, 'asha@example.com');
  assert.equal(created.headers.location, '/api/users/1');

  assert.equal((await request(app).post('/api/users').send({ name: 'Other', email: 'asha@example.com' })).status, 409);
  assert.equal((await request(app).post('/api/users').send({ name: 'A', email: 'x' })).status, 422);

  await request(app).post('/api/users').send({ name: 'Ravi', email: 'ravi@example.com' });
  const list = await request(app).get('/api/users?q=rav');
  assert.deepEqual(list.body.data.map((u) => u.name), ['Ravi']);
  assert.equal((await request(app).get('/api/users?limit=1&page=2')).body.data[0].name, 'Ravi');

  const patched = await request(app).patch('/api/users/1').send({ name: 'Asha K' });
  assert.equal(patched.body.name, 'Asha K');
  assert.equal(patched.body.age, 29);                 // PATCH keeps what you did not send

  const put = await request(app).put('/api/users/1').send({ name: 'Asha K', email: 'asha@example.com' });
  assert.equal(put.body.age, undefined);              // PUT replaced the whole user

  assert.equal((await request(app).delete('/api/users/1')).status, 204);
  assert.equal((await request(app).get('/api/users/1')).status, 404);
  assert.equal((await request(app).post('/api/users').set('Content-Type', 'application/json').send('{bad')).status, 400);
});
