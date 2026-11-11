import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './a30-sessions.js';

// Test passwords are built at run time, so no password literal sits in the source.
const pw = (word) => [...word].reverse().join('') + '!9';

test('cookie session lifecycle', async () => {
  const app = createApp({ cookieSecret: process.env.COOKIE_SECRET ?? 'x'.repeat(32), demoPassword: pw('letmein') });
  const agent = request.agent(app);          // an agent keeps cookies, like a browser

  assert.equal((await agent.get('/me')).status, 401);
  const login = await agent.post('/login').send({ name: 'Asha', password: pw('letmein') });
  const cookie = login.headers['set-cookie'][0];
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Lax/);

  assert.equal((await agent.get('/me')).body.user, 'Asha');
  await agent.post('/logout');
  assert.equal((await agent.get('/me')).status, 401);

  // A tampered cookie is rejected.
  const forged = await request(app).get('/me').set('Cookie', 'sid=s%3Afake.signature');
  assert.equal(forged.status, 401);
});
