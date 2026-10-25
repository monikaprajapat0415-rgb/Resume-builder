import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { logger } from './middleware/logger.js';
import { notFound, errorHandler } from './middleware/error.js';
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(logger);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'not connected' }));
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);

app.use(notFound);
app.use(errorHandler);

try {
  await connectDB();
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
} catch (err) {
  console.error('Could not start:', err.message);
  process.exit(1);
}
