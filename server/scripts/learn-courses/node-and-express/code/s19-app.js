import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBookStore } from './s19-store.js';
import { bookController } from './s19-controller.js';
import { bookRoutes } from './s19-routes.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  // Application settings
  app.disable('x-powered-by');
  app.set('trust proxy', 1);          // we will sit behind nginx later
  app.set('json spaces', 2);

  app.use(express.json());
  app.use(express.static(path.join(here, 's19-public')));   // serves index.html at /

  app.use('/api/books', bookRoutes(bookController(createBookStore())));

  // 404 for anything that did not match, then one error handler at the end.
  app.use((req, res) => res.status(404).json({ error: 'Not found' }));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  });
  return app;
}
