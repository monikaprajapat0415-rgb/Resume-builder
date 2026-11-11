import express from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');

// `mailer.send({ to, subject, text })` is the only thing we need from an email service.
// In production it wraps Nodemailer. In tests it is a fake that records messages.
export function createApp({ mailer, now = () => Date.now() }) {
  const app = express();
  app.use(express.json());
  const users = new Map();     // email -> { email, passwordHash, verified, resetHash, resetExpires, otpHash, otpExpires, otpTries }

  app.post('/register', async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password || password.length < 8) return res.status(422).json({ error: 'Invalid input' });
    const token = crypto.randomBytes(32).toString('base64url');
    users.set(email, { email, passwordHash: await bcrypt.hash(password, 10), verified: false, verifyHash: sha(token) });
    await mailer.send({ to: email, subject: 'Verify your email', text: `https://example.com/verify?email=${email}&token=${token}` });
    res.status(201).json({ message: 'Check your email' });
  });

  app.post('/verify', (req, res) => {
    const user = users.get(req.body?.email);
    if (!user || user.verifyHash !== sha(String(req.body?.token ?? ''))) return res.status(400).json({ error: 'Invalid or used link' });
    user.verified = true;
    user.verifyHash = null;
    res.json({ message: 'Email verified' });
  });

  // Forgot password: ALWAYS answer the same way, so nobody can find out which emails are registered.
  app.post('/forgot-password', async (req, res) => {
    const user = users.get(req.body?.email);
    if (user) {
      const token = crypto.randomBytes(32).toString('base64url');
      user.resetHash = sha(token);                       // store only the hash
      user.resetExpires = now() + 15 * 60_000;           // 15 minutes
      await mailer.send({ to: user.email, subject: 'Reset your password', text: `https://example.com/reset?email=${user.email}&token=${token}` });
    }
    res.json({ message: 'If that email is registered, a reset link has been sent' });
  });

  app.post('/reset-password', async (req, res) => {
    const { email, token, password } = req.body ?? {};
    const user = users.get(email);
    if (!user || !user.resetHash || user.resetExpires < now() || user.resetHash !== sha(String(token ?? '')) || !password || password.length < 8) {
      return res.status(400).json({ error: 'Invalid or expired link' });
    }
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetHash = null;                               // one use only
    res.json({ message: 'Password changed' });
  });

  // OTP: a 6 digit code with a short life and a limit on guesses.
  app.post('/otp/request', async (req, res) => {
    const user = users.get(req.body?.email);
    if (user) {
      const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
      Object.assign(user, { otpHash: sha(code), otpExpires: now() + 5 * 60_000, otpTries: 0 });
      await mailer.send({ to: user.email, subject: 'Your login code', text: code });
    }
    res.json({ message: 'If that email is registered, a code has been sent' });
  });

  app.post('/otp/verify', (req, res) => {
    const user = users.get(req.body?.email);
    if (!user || !user.otpHash || user.otpExpires < now() || user.otpTries >= 5) return res.status(400).json({ error: 'Invalid or expired code' });
    user.otpTries += 1;
    if (user.otpHash !== sha(String(req.body?.code ?? ''))) return res.status(400).json({ error: 'Invalid or expired code' });
    user.otpHash = null;
    res.json({ message: 'Code accepted' });
  });

  return app;
}
