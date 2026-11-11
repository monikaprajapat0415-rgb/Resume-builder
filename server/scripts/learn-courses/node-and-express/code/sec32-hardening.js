import express from 'express';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Read and check the settings once, at start. Crash early with a clear message, not later with a mystery.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
});
export const loadEnv = (source = process.env) => envSchema.parse(source);

// JWT best practice: fix the algorithm, issuer and audience when you SIGN and when you VERIFY.
export const signToken = (payload, secret) =>
  jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15m', issuer: 'my-api', audience: 'my-app' });

export const verifyToken = (token, secret) =>
  jwt.verify(token, secret, { algorithms: ['HS256'], issuer: 'my-api', audience: 'my-app' });

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());          // sets many security headers at once
  app.get('/', (req, res) => res.json({ ok: true }));
  return app;
}
