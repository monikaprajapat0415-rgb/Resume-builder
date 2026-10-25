// Lesson 23: security basics.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { checkEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './middleware/logger.js';
import { authLimiter, rejectOperators } from './middleware/security.js';
import { notFound, errorHandler } from './middleware/error.js';
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';

const app = express();
const port = Number(process.env.PORT) || 5000;

// Behind nginx or a host's load balancer, set TRUST_PROXY=1 so the rate limiter sees the real visitor IP.
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);

app.use(helmet());   // sets safe HTTP headers (and removes X-Powered-By)
app.use(logger);
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',') })); // comma separated list
app.use(express.json({ limit: '100kb' }));
app.use(rejectOperators);

app.get('/api/health', (req, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'not connected' }));
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/jobs', jobsRouter);

app.use(notFound);
app.use(errorHandler);

try {
  checkEnv();
  await connectDB();
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
} catch (err) {
  console.error('Could not start:', err.message);
  process.exit(1);
}
