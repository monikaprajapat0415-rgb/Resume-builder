// Lesson 24: the Express app lives here, and index.js only starts it. Tests can import `app` without opening a port or a database.
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { logger } from './middleware/logger.js';
import { authLimiter, rejectOperators } from './middleware/security.js';
import { notFound, errorHandler } from './middleware/error.js';
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';

export const app = express();

if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);

app.use(helmet());
if (process.env.NODE_ENV !== 'test') app.use(logger);
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',') }));
app.use(express.json({ limit: '100kb' }));
app.use(rejectOperators);

app.get('/api/health', (req, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'not connected' }));
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/jobs', jobsRouter);

app.use(notFound);
app.use(errorHandler);
