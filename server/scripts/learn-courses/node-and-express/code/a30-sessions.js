import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';

// Session-based login: the browser holds only a random id in a cookie. The data stays on the server.
export function createApp({ cookieSecret, demoPassword }) {
  const app = express();
  app.use(express.json());
  app.use(cookieParser(cookieSecret));          // signed cookies can be checked for tampering

  const sessions = new Map();                    // sessionId -> { user, createdAt }  (use Redis in production)

  app.post('/login', (req, res) => {
    if (req.body?.password !== demoPassword) return res.status(401).json({ error: 'Wrong login' });
    const id = crypto.randomBytes(32).toString('base64url');
    sessions.set(id, { user: req.body.name, createdAt: Date.now() });
    res.cookie('sid', id, {
      httpOnly: true,                 // JavaScript in the page cannot read it (helps against XSS theft)
      secure: false,                  // set true in production so it is sent only over HTTPS
      sameSite: 'lax',                // not sent on most cross-site requests (helps against CSRF)
      signed: true,
      maxAge: 60 * 60 * 1000,
    });
    res.json({ message: 'Logged in' });
  });

  app.get('/me', (req, res) => {
    const session = sessions.get(req.signedCookies.sid);
    if (!session) return res.status(401).json({ error: 'Not logged in' });
    res.json({ user: session.user });
  });

  app.post('/logout', (req, res) => {
    sessions.delete(req.signedCookies.sid);     // the server forgets the session at once, unlike a JWT
    res.clearCookie('sid');
    res.status(204).end();
  });
  return app;
}
