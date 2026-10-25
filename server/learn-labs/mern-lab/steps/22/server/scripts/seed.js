// Creates a demo account with sample jobs.   Run:  npm run seed
// Then sign in with demo@example.com / Demo12345
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

const roles = ['Teller', 'Dispatcher', 'Line Supervisor', 'Electrician', 'Accounts Clerk', 'Delivery Driver', 'Warehouse Associate', 'Customer Support'];
const companies = ['Northwind Bank', 'Acme Logistics', 'Greenfield Foods', 'Sunrise Electricals', 'Lakeside Hospital', 'Metro Retail'];
const statuses = ['saved', 'applied', 'interview', 'offer', 'rejected'];

await connectDB();
let user = await User.findOne({ email: 'demo@example.com' });
if (!user) user = await User.create({ name: 'Demo User', email: 'demo@example.com', passwordHash: await bcrypt.hash('Demo12345', 12) });
await Job.deleteMany({ user: user._id });

const docs = Array.from({ length: 30 }, (_, i) => ({
  user: user._id,
  company: companies[i % companies.length],
  role: roles[i % roles.length],
  location: ['Pune', 'Lagos', 'Toronto', 'Leeds', 'Nairobi'][i % 5],
  status: statuses[i % statuses.length],
}));
await Job.insertMany(docs);
console.log(`Demo user ready (demo@example.com / Demo12345) with ${docs.length} jobs`);
await mongoose.disconnect();
