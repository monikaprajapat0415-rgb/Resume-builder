import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export function authRouter({ secret, users }) {
  const router = Router();
  const sign = (user) => jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '1h' });
  const emailOk = (e) => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  router.post('/register', async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!emailOk(email)) return res.status(400).json({ error: 'Enter a valid email' });
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    const key = email.toLowerCase();
    if (users.has(key)) return res.status(409).json({ error: 'That email is already registered' });
    const user = { id: users.size + 1, email: key, passwordHash: await bcrypt.hash(password, 10) };
    users.set(key, user);
    res.status(201).json({ token: sign(user) });
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body ?? {};
    const user = typeof email === 'string' ? users.get(email.toLowerCase()) : undefined;
    const ok = user && typeof password === 'string' && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) return res.status(401).json({ error: 'Wrong email or password' });
    res.json({ token: sign(user) });
  });

  return router;
}
