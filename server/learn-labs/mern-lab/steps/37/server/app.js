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
app.use(compression()); // gzip JSON and text answers: much smaller on slow mobile connections
if (process.env.NODE_ENV !== 'test') app.use(logger);
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',') }));
app.use(express.json({ limit: '100kb' }));
app.use(rejectOperators);

// Used by load balancers, uptime monitors and pm2. 503 tells them "do not send traffic here yet".
app.get('/api/health', (req, res) => {
  const db = mongoose.connection.readyState === 1;
  res.status(db ? 200 : 503).json({ ok: db, db: db ? 'connected' : 'not connected', uptimeSeconds: Math.round(process.uptime()) });
});
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/jobs', jobsRouter);

app.use(notFound);
app.use(errorHandler);
