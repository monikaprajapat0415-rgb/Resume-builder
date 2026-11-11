import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp, sign } from './p09-saas.js';
import { signToken } from './p-kit.js';

const SECRET = 'whsec_saas';
const as = (id) => ({ Authorization: `Bearer ${signToken({ id, role: 'user', name: `u${id}` })}` });
const hook = (app, event) => {
  const raw = JSON.stringify(event);
  return request(app).post('/webhooks/billing').set('Content-Type', 'application/json').set('x-signature', sign(raw, SECRET)).send(raw);
};

test('project 9: limits follow the plan and the webhook', async () => {
  const app = createApp({ billing: { createCheckout: async ({ plan }) => ({ url: `https://pay.example/${plan}` }) }, webhookSecret: SECRET });

  assert.equal((await request(app).post('/api/projects').set(as(1)).send({ name: 'A' })).status, 201);
  assert.equal((await request(app).post('/api/projects').set(as(1)).send({ name: 'B' })).status, 403);       // free plan: 1 project

  assert.equal((await request(app).post('/api/subscribe').set(as(1)).send({ plan: 'free' })).status, 422);
  const checkout = await request(app).post('/api/subscribe').set(as(1)).send({ plan: 'pro' });
  assert.equal(checkout.body.checkoutUrl, 'https://pay.example/pro');
  assert.equal((await request(app).get('/api/account').set(as(1))).body.plan, 'free');                       // not active until paid

  assert.equal((await request(app).post('/webhooks/billing').set('Content-Type', 'application/json').set('x-signature', 'bad').send('{}')).status, 400);
  await hook(app, { id: 'e1', type: 'subscription.paid', userId: 1, plan: 'pro' });
  assert.equal((await request(app).get('/api/account').set(as(1))).body.plan, 'pro');
  assert.equal((await request(app).post('/api/projects').set(as(1)).send({ name: 'B' })).status, 201);

  assert.equal((await hook(app, { id: 'e1', type: 'subscription.paid', userId: 1, plan: 'team' })).body.duplicate, true);   // same event again
  assert.equal((await request(app).get('/api/account').set(as(1))).body.plan, 'pro');

  await hook(app, { id: 'e2', type: 'subscription.payment_failed', userId: 1 });
  assert.equal((await request(app).post('/api/projects').set(as(1)).send({ name: 'C' })).status, 402);

  await hook(app, { id: 'e3', type: 'subscription.cancelled', userId: 1 });
  assert.equal((await request(app).get('/api/account').set(as(1))).body.plan, 'free');
});
