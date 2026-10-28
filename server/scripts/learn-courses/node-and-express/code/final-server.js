import { createApp } from './app.js';

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 16) {
  console.error('Set JWT_SECRET (at least 16 characters) before starting.');
  process.exit(1);
}

const app = createApp({
  secret,
  dataFile: process.env.DATA_FILE || './data/tasks.json',
  allowedOrigin: process.env.CLIENT_ORIGIN,
});

const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => console.log(`API listening on port ${port}`));

process.on('SIGTERM', () => {
  console.log('Shutting down');
  server.close(() => process.exit(0));
});
