// Creates (and removes outdated) indexes to match the models.   Run after a deploy that changed an index:  npm run indexes
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

await connectDB();
for (const model of [User, Job]) {
  const dropped = await model.syncIndexes();
  console.log(`${model.modelName}: indexes in sync${dropped.length ? ` (removed ${dropped.join(', ')})` : ''}`);
}
await mongoose.disconnect();
