import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './p02-auth.js';

test('project 2: register, login, refresh, reset', async () => {
  const sent = [];
  let time = 0;
  const app = createApp({ mailer: { send: async (m) => { sent.push(m); } }, now: () => time });

  assert.equal((await request(app).post('/auth/register').send({ name: 'Asha', email: 'a@x.com', password: 'short' })).status, 422);
  assert.equal((await request(app).post('/auth/register').send({ name: 'Asha', email: 'a@x.com', password: 'password1' })).status, 201);
  assert.equal((await request(app).post('/auth/register').send({ name: 'Asha', email: 'A@x.com', password: 'password1' })).status, 409);

  assert.equal((await request(app).post('/auth/login').send({ email: 'a@x.com', password: 'nope-nope' })).status, 401);
  const login = await request(app).post('/auth/login').send({ email: 'a@x.com', password: 'password1' });
  const me = await request(app).get('/me').set('Authorization', `Bearer ${login.body.accessToken}`);
  assert.equal(me.body.name, 'Asha');
  assert.equal((await request(app).get('/me')).status, 401);

  const again = await request(app).post('/auth/refresh').send({ refreshToken: login.body.refreshToken });
  assert.equal(again.status, 200);
  assert.equal((await request(app).post('/auth/refresh').send({ refreshToken: login.body.refreshToken })).status, 401);

  await request(app).post('/auth/forgot-password').send({ email: 'a@x.com' });
  await request(app).post('/auth/forgot-password').send({ email: 'ghost@x.com' });
  assert.equal(sent.length, 1);
  const reset = await request(app).post('/auth/reset-password').send({ email: 'a@x.com', token: sent[0].token, password: 'brandnew123' });
  assert.equal(reset.status, 200);
  assert.equal((await request(app).post('/auth/login').send({ email: 'a@x.com', password: 'password1' })).status, 401);
  assert.equal((await request(app).post('/auth/login').send({ email: 'a@x.com', password: 'brandnew123' })).status, 200);
  assert.equal((await request(app).post('/auth/reset-password').send({ email: 'a@x.com', token: sent[0].token, password: 'again12345' })).status, 400);
});
