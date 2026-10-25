// Lesson 38: in production, the same Express app also serves the built React app.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import { logger } from './middleware/logger.js';
import { authLimiter, rejectOperators } from './middleware/security.js';
import { notFound, errorHandler } from './middleware/error.js';
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';

export const app = express();

if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);

app.use(helmet());
app.use(compression());
if (process.env.NODE_ENV !== 'test') app.use(logger);
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',') }));
app.use(express.json({ limit: '100kb' }));
app.use(rejectOperators);

app.get('/api/health', (req, res) => {
  const db = mongoose.connection.readyState === 1;
  res.status(db ? 200 : 503).json({ ok: db, db: db ? 'connected' : 'not connected', uptimeSeconds: Math.round(process.uptime()) });
});
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api', notFound); // an unknown /api path is a JSON 404, never the React page

// ---- the React build (client/dist), if it exists ----
const dist = process.env.CLIENT_DIST || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'client', 'dist');
if (fs.existsSync(path.join(dist, 'index.html'))) {
  // Files in /assets have a hash in their name, so they can be cached for a year. index.html must never be cached,
  // or visitors would keep an old page that points at files you have deleted.
  app.use(express.static(dist, {
    index: false,
    setHeaders: (res, file) => res.setHeader('Cache-Control', file.includes(`${path.sep}assets${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache'),
  }));
  // React Router handles paths like /jobs/123 in the browser, so any other GET gets index.html.
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);
