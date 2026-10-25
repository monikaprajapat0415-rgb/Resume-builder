import mongoose from 'mongoose';
import { log } from '../utils/logger.js';

export async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) throw new Error('MONGODB_URI is missing. Copy .env.example to .env and set it.');
  mongoose.connection.on('disconnected', () => log.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => log.info('MongoDB reconnected'));
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    // In production, build indexes on purpose with `npm run indexes`, not on every start of a busy server.
    autoIndex: process.env.NODE_ENV !== 'production',
  });
  log.info(`MongoDB connected: ${mongoose.connection.name}`);
}
