import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './a30-sessions.js';

test('cookie session lifecycle', async () => {
  const app = createApp({ cookieSecret: 'cookie-secret' });
  const agent = request.agent(app);          // an agent keeps cookies, like a browser

  assert.equal((await agent.get('/me')).status, 401);
  const login = await agent.post('/login').send({ name: 'Asha', password: 'letmein' });
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
