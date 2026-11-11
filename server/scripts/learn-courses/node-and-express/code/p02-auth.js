// Project 2: accounts. Register, log in, refresh, reset password, and a protected route.
import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { AppError, SECRET, signToken, requireAuth, errorHandler, notFoundHandler } from './p-kit.js';

const sha = (v) => crypto.createHash('sha256').update(v).digest('hex');

export function createApp({ mailer = { send: async () => {} }, now = () => Date.now() } = {}) {
  const app = express();
  app.use(express.json());
  const users = new Map();          // email -> user
  const refresh = new Map();        // hash -> { email, expiresAt, used }

  const tokens = (user) => {
    const refreshToken = crypto.randomBytes(40).toString('base64url');
    refresh.set(sha(refreshToken), { email: user.email, expiresAt: now() + 7 * 86_400_000, used: false });
    return { accessToken: signToken(user), refreshToken };
  };

  app.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body ?? {};
    if (!name || !/^[^\s@]+@[^\s@]+$/.test(email ?? '') || (password ?? '').length < 8) throw new AppError('name, a valid email and an 8+ character password are required', 422);
    if (users.has(email.toLowerCase())) throw new AppError('Email already registered', 409);
    const user = { id: users.size + 1, name, email: email.toLowerCase(), role: 'user', passwordHash: await bcrypt.hash(password, 10) };
    users.set(user.email, user);
    res.status(201).json({ id: user.id, name, email: user.email });
  });

  app.post('/auth/login', async (req, res) => {
    const user = users.get(String(req.body?.email ?? '').toLowerCase());
    if (!user || !(await bcrypt.compare(String(req.body?.password ?? ''), user.passwordHash))) throw new AppError('Wrong email or password', 401);
    res.json(tokens(user));
  });

  app.post('/auth/refresh', (req, res) => {
    const record = refresh.get(sha(String(req.body?.refreshToken ?? '')));
    if (!record || record.used || record.expiresAt < now()) throw new AppError('Log in again', 401);
    record.used = true;                                  // each refresh token works once
    res.json(tokens(users.get(record.email)));
  });

  app.post('/auth/forgot-password', async (req, res) => {
    const user = users.get(String(req.body?.email ?? '').toLowerCase());
    if (user) {
      const token = crypto.randomBytes(32).toString('base64url');
      Object.assign(user, { resetHash: sha(token), resetExpires: now() + 15 * 60_000 });
      await mailer.send({ to: user.email, subject: 'Reset your password', token });
    }
    res.json({ message: 'If that email is registered, a reset link has been sent' });
  });

  app.post('/auth/reset-password', async (req, res) => {
    const { email, token, password } = req.body ?? {};
    const user = users.get(String(email ?? '').toLowerCase());
    if (!user?.resetHash || user.resetExpires < now() || user.resetHash !== sha(String(token ?? '')) || (password ?? '').length < 8) throw new AppError('Invalid or expired link', 400);
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetHash = null;
    res.json({ message: 'Password changed' });
  });

  app.get('/me', requireAuth(SECRET), (req, res) => res.json(req.user));

  app.use(notFoundHandler, errorHandler);
  return app;
}
