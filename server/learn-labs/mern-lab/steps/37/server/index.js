import 'dotenv/config';
import mongoose from 'mongoose';
import { checkEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import { log } from './utils/logger.js';
import { app } from './app.js';

const port = Number(process.env.PORT) || 5000;
let server;

// Graceful shutdown: when pm2 or the host says "stop", finish the requests in progress, close the database, then exit.
async function shutdown(signal) {
  log.info(`${signal} received, shutting down`);
  const force = setTimeout(() => { log.error('Forced exit after 10 seconds'); process.exit(1); }, 10_000);
  force.unref();
  try {
    await new Promise((resolve) => (server ? server.close(resolve) : resolve()));
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    log.error('Error while shutting down', { error: err.message });
    process.exit(1);
  }
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
// A promise nobody caught is a bug. Log it; pm2 restarts the process if we exit.
process.on('unhandledRejection', (reason) => { log.error('Unhandled rejection', { reason: String(reason) }); process.exit(1); });

try {
  checkEnv();
  await connectDB();
  server = app.listen(port, () => log.info(`API listening on port ${port}`, { env: process.env.NODE_ENV || 'development' }));
} catch (err) {
  log.error(`Could not start: ${err.message}`);
  process.exit(1);
}
