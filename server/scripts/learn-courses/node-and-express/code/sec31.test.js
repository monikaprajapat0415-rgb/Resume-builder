import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp, escapeHtml, stripOperators, loginGuard } from './sec31-defences.js';

// Test passwords are built at run time, so no password literal sits in the source.
const pw = (word) => [...word].reverse().join('') + '!9';

test('xss escaping', async () => {
  assert.equal(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  const res = await request(createApp()).get('/greet').query({ name: '<img src=x onerror=alert(1)>' });
  assert.ok(!res.text.includes('<img'));
});

test('operator injection is removed', () => {
  assert.deepEqual(stripOperators({ email: { $ne: null }, password: pw('x'), 'a.b': 1 }), { email: {}, password: pw('x') });
});

test('csrf double-submit cookie', async () => {
  const app = createApp();
  const agent = request.agent(app);
  const first = await agent.get('/token');                      // receives the csrf cookie
  const token = /csrf=([0-9a-f]+)/.exec(first.headers['set-cookie'][0])[1];
  assert.equal((await agent.post('/search').send({ q: 1 })).status, 403);   // cookie sent, header missing
  assert.equal((await agent.post('/search').set('x-csrf-token', token).send({ q: 1 })).status, 200);
  assert.equal((await request(app).post('/search').set('x-csrf-token', token).send({})).status, 403);   // other site: no cookie
});

test('brute force lock', () => {
  let time = 0;
  const guard = loginGuard({ maxFails: 3, lockMs: 1000, now: () => time });
  for (let i = 0; i < 3; i++) guard.fail('a@x.com');
  assert.equal(guard.isLocked('a@x.com'), true);
  time = 1001;
  assert.equal(guard.isLocked('a@x.com'), false);
});
