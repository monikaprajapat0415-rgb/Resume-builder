import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createStore } from './store.js';
import { authRouter } from './routes/auth.js';
import { tasksRouter } from './routes/tasks.js';
import { requireAuth } from './middleware/auth.js';

export function createApp({ secret, dataFile, allowedOrigin } = {}) {
  if (!secret) throw new Error('A JWT secret is required');
  const app = express();
  const store = createStore(dataFile);
  const users = new Map();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: allowedOrigin || false }));
  app.use(express.json({ limit: '10kb' }));

  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      if (process.env.NODE_ENV !== 'test') console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
    });
    next();
  });

  app.get('/api/health', (req, res) => res.json({ ok: true }));

  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false });
  app.use('/api/auth', authLimiter, authRouter({ secret, users }));
  app.use('/api/tasks', requireAuth(secret), tasksRouter(store));

  app.use((req, res) => res.status(404).json({ error: 'Not found' }));

  // Error handler: four arguments. Express 5 sends rejected promises here too.
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Body is not valid JSON' });
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Body is too large' });
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  });

  return app;
}
