// Lesson 12: validation and error handling.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { notFound, errorHandler } from './middleware/error.js';
import jobsRouter from './routes/jobs.js';

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(logger);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/jobs', jobsRouter);

app.use(notFound);     // after all routes
app.use(errorHandler); // last of all

app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
