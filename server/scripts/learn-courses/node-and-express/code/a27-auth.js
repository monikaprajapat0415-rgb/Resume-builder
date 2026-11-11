import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const ACCESS_SECONDS = 15 * 60;
const REFRESH_DAYS = 7;
const hash = (token) => crypto.createHash('sha256').update(token).digest('hex');

export function createApp({ secret }) {
  const app = express();
  app.use(express.json());

  const users = new Map();           // email -> { id, email, passwordHash, role }
  const refreshTokens = new Map();   // hash(token) -> { userId, expiresAt, revoked }

  const signAccess = (user) => jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn: ACCESS_SECONDS });

  // The refresh token is a long random string. We keep only its hash, like a password.
  function issueRefresh(user) {
    const token = crypto.randomBytes(48).toString('base64url');
    refreshTokens.set(hash(token), { userId: user.id, expiresAt: Date.now() + REFRESH_DAYS * 86_400_000, revoked: false });
    return token;
  }

  // Authentication middleware: who is calling?
  const requireAuth = (req, res, next) => {
    const header = req.get('authorization') ?? '';
    try {
      req.user = jwt.verify(header.replace(/^Bearer /, ''), secret);
      next();
    } catch {
      res.status(401).json({ error: 'Log in again' });
    }
  };

  // Authorization middleware: are they allowed? (role-based access control)
  const requireRole = (...roles) => (req, res, next) =>
    roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'You are not allowed to do this' });

  app.post('/register', async (req, res) => {
    const { email, password, role } = req.body ?? {};
    if (!email || !password || password.length < 8) return res.status(422).json({ error: 'Email and a password of 8+ characters are required' });
    if (users.has(email)) return res.status(409).json({ error: 'Email already registered' });
    // The role is NEVER taken from the request: new users are always plain users.
    const user = { id: users.size + 1, email, passwordHash: await bcrypt.hash(password, 10), role: users.size === 0 ? 'admin' : 'user' };
    users.set(email, user);
    res.status(201).json({ id: user.id, email, role: user.role });
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body ?? {};
    const user = users.get(email);
    const ok = user && (await bcrypt.compare(password ?? '', user.passwordHash));
    if (!ok) return res.status(401).json({ error: 'Wrong email or password' });   // same message for both cases
    res.json({ accessToken: signAccess(user), refreshToken: issueRefresh(user) });
  });

  // Refresh: swap a valid refresh token for new tokens. The old one is revoked (rotation).
  app.post('/refresh', (req, res) => {
    const record = refreshTokens.get(hash(String(req.body?.refreshToken ?? '')));
    if (!record || record.revoked || record.expiresAt < Date.now()) {
      return res.status(401).json({ error: 'Log in again' });
    }
    record.revoked = true;
    const user = [...users.values()].find((u) => u.id === record.userId);
    res.json({ accessToken: signAccess(user), refreshToken: issueRefresh(user) });
  });

  // Logout: revoke the refresh token. The short-lived access token simply expires.
  app.post('/logout', (req, res) => {
    const record = refreshTokens.get(hash(String(req.body?.refreshToken ?? '')));
    if (record) record.revoked = true;
    res.status(204).end();
  });

  app.get('/me', requireAuth, (req, res) => res.json({ id: req.user.sub, role: req.user.role }));
  app.get('/admin/stats', requireAuth, requireRole('admin'), (req, res) => res.json({ users: users.size }));

  return app;
}
