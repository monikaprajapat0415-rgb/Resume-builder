import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp, loadEnv, signToken, verifyToken } from './sec32-hardening.js';

const SECRET = 'a-long-random-secret-with-32-chars!!';

test('helmet headers and no x-powered-by', async () => {
  const res = await request(createApp()).get('/');
  assert.equal(res.headers['x-powered-by'], undefined);
  assert.equal(res.headers['x-content-type-options'], 'nosniff');
  assert.ok(res.headers['strict-transport-security']);
  assert.ok(res.headers['content-security-policy']);
});

test('environment is checked at start', () => {
  assert.throws(() => loadEnv({ JWT_SECRET: 'short' }), /at least 32/);
  assert.equal(loadEnv({ JWT_SECRET: SECRET, PORT: '4000' }).PORT, 4000);
});

test('token checks: alg none, wrong audience and wrong secret are refused', () => {
  const good = signToken({ sub: 1 }, SECRET);
  assert.equal(verifyToken(good, SECRET).sub, 1);

  const none = Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url') + '.' + Buffer.from('{"sub":1,"iss":"my-api","aud":"my-app"}').toString('base64url') + '.';
  assert.throws(() => verifyToken(none, SECRET));

  const otherAudience = jwt.sign({ sub: 1 }, SECRET, { issuer: 'my-api', audience: 'other-app' });
  assert.throws(() => verifyToken(otherAudience, SECRET));
  assert.throws(() => verifyToken(good, 'a-different-secret-with-32-characters!'));
});
