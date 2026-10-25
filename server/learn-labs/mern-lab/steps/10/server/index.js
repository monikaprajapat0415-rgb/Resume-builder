// Lesson 10: middleware, JSON bodies and CORS.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(logger);                                                     // 1. log every request
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' })); // 2. let our React app call us
app.use(express.json({ limit: '100kb' }));                           // 3. turn a JSON body into req.body

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/echo', (req, res) => {
  // req.body exists only because of express.json() above
  res.status(201).json({ youSent: req.body });
});

app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
