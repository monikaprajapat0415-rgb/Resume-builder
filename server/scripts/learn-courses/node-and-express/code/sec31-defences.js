import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';

// 1. XSS: escape user text before it goes into HTML.
export const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// 2. NoSQL injection: a body like {"email": {"$ne": null}} would match every user in MongoDB.
//    Remove any key that starts with $ or contains a dot, at any depth.
export function stripOperators(value) {
  if (Array.isArray(value)) return value.map(stripOperators);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).filter(([key]) => !key.startsWith('$') && !key.includes('.')).map(([key, v]) => [key, stripOperators(v)]),
    );
  }
  return value;
}
export const sanitizeBody = (req, res, next) => { req.body = stripOperators(req.body); next(); };

// 3. CSRF (double-submit cookie): the page must copy the cookie value into a header.
//    A site on another domain can make the browser SEND the cookie but cannot READ it to copy it.
export function csrf() {
  return (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      if (!req.cookies.csrf) res.cookie('csrf', crypto.randomBytes(24).toString('hex'), { sameSite: 'strict' });
      return next();
    }
    const header = req.get('x-csrf-token');
    if (!header || header !== req.cookies.csrf) return res.status(403).json({ error: 'Bad CSRF token' });
    next();
  };
}

// 4. Brute force: count failed logins per account AND per IP, and lock for a while.
export function loginGuard({ maxFails = 5, lockMs = 15 * 60_000, now = () => Date.now() } = {}) {
  const fails = new Map();   // key -> { count, lockedUntil }
  return {
    isLocked(key) { const f = fails.get(key); return Boolean(f && f.lockedUntil > now()); },
    fail(key) {
      const f = fails.get(key) ?? { count: 0, lockedUntil: 0 };
      f.count += 1;
      if (f.count >= maxFails) { f.lockedUntil = now() + lockMs; f.count = 0; }
      fails.set(key, f);
    },
    success(key) { fails.delete(key); },
  };
}

export function createApp() {
  const app = express();
  app.use(express.json(), cookieParser(), sanitizeBody, csrf());
  app.get('/token', (req, res) => res.json({ ok: true }));
  app.post('/search', (req, res) => res.json({ received: req.body }));
  app.get('/greet', (req, res) => res.type('html').send(`<p>Hello ${escapeHtml(req.query.name ?? 'guest')}</p>`));
  return app;
}
