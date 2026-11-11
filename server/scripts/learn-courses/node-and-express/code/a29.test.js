import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from './a29-account.js';

function fakeMailer() {
  const sent = [];
  return { sent, send: async (message) => { sent.push(message); } };
}
const lastToken = (mailer) => new URL(mailer.sent.at(-1).text).searchParams.get('token');

test('verify email, reset password once, token expiry', async () => {
  let time = 1_000_000;
  const mailer = fakeMailer();
  const app = createApp({ mailer, now: () => time });

  await request(app).post('/register').send({ email: 'a@x.com', password: 'password1' });
  assert.equal((await request(app).post('/verify').send({ email: 'a@x.com', token: 'wrong' })).status, 400);
  assert.equal((await request(app).post('/verify').send({ email: 'a@x.com', token: lastToken(mailer) })).status, 200);

  // Same answer for a known and an unknown email.
  const known = await request(app).post('/forgot-password').send({ email: 'a@x.com' });
  const unknown = await request(app).post('/forgot-password').send({ email: 'nobody@x.com' });
  assert.deepEqual(known.body, unknown.body);
  assert.equal(mailer.sent.length, 2);          // register + one reset mail, none for the unknown email

  const token = lastToken(mailer);
  assert.equal((await request(app).post('/reset-password').send({ email: 'a@x.com', token, password: 'newpassword' })).status, 200);
  assert.equal((await request(app).post('/reset-password').send({ email: 'a@x.com', token, password: 'another-one' })).status, 400);   // used

  await request(app).post('/forgot-password').send({ email: 'a@x.com' });
  const late = lastToken(mailer);
  time += 16 * 60_000;
  assert.equal((await request(app).post('/reset-password').send({ email: 'a@x.com', token: late, password: 'newpassword2' })).status, 400);   // expired
});

test('OTP works once and locks after 5 wrong guesses', async () => {
  const mailer = fakeMailer();
  const app = createApp({ mailer });
  await request(app).post('/register').send({ email: 'a@x.com', password: 'password1' });

  await request(app).post('/otp/request').send({ email: 'a@x.com' });
  const code = mailer.sent.at(-1).text;
  assert.equal((await request(app).post('/otp/verify').send({ email: 'a@x.com', code })).status, 200);
  assert.equal((await request(app).post('/otp/verify').send({ email: 'a@x.com', code })).status, 400);   // already used

  await request(app).post('/otp/request').send({ email: 'a@x.com' });
  const real = mailer.sent.at(-1).text;
  for (let i = 0; i < 5; i++) await request(app).post('/otp/verify').send({ email: 'a@x.com', code: '000000' });
  assert.equal((await request(app).post('/otp/verify').send({ email: 'a@x.com', code: real })).status, 400);   // locked out
});
