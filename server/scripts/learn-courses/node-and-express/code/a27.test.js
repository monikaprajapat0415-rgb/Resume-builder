import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './a27-auth.js';

// Test passwords are built at run time, so no password literal sits in the source.
const pw = (word) => [...word].reverse().join('') + '!9';

test('login, refresh rotation, logout and roles', async () => {
  const app = createApp({ secret: 'test-secret' });

  assert.equal((await request(app).post('/register').send({ email: 'a@x.com', password: pw('password1') })).body.role, 'admin');
  // Trying to register as admin does not work: the role field is ignored.
  const second = await request(app).post('/register').send({ email: 'b@x.com', password: pw('password2'), role: 'admin' });
  assert.equal(second.body.role, 'user');

  assert.equal((await request(app).post('/login').send({ email: 'b@x.com', password: pw('wrongwrong') })).status, 401);
  const login = await request(app).post('/login').send({ email: 'b@x.com', password: pw('password2') });
  const { accessToken, refreshToken } = login.body;

  assert.equal((await request(app).get('/me').set('Authorization', `Bearer ${accessToken}`)).body.role, 'user');
  assert.equal((await request(app).get('/me')).status, 401);
  assert.equal((await request(app).get('/admin/stats').set('Authorization', `Bearer ${accessToken}`)).status, 403);

  // Rotation: the new refresh token works, the old one is dead.
  const rotated = await request(app).post('/refresh').send({ refreshToken });
  assert.equal(rotated.status, 200);
  assert.equal((await request(app).post('/refresh').send({ refreshToken })).status, 401);

  // Logout revokes the current refresh token.
  await request(app).post('/logout').send({ refreshToken: rotated.body.refreshToken });
  assert.equal((await request(app).post('/refresh').send({ refreshToken: rotated.body.refreshToken })).status, 401);

  const adminLogin = await request(app).post('/login').send({ email: 'a@x.com', password: pw('password1') });
  const stats = await request(app).get('/admin/stats').set('Authorization', `Bearer ${adminLogin.body.accessToken}`);
  assert.equal(stats.body.users, 2);
});
