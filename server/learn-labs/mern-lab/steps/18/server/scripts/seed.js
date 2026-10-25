// Adds sample jobs so you have something to search.   Run:  npm run seed
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Job from '../models/Job.js';

const roles = ['Teller', 'Dispatcher', 'Line Supervisor', 'Electrician', 'Accounts Clerk', 'Delivery Driver', 'Warehouse Associate', 'Customer Support'];
const companies = ['Northwind Bank', 'Acme Logistics', 'Greenfield Foods', 'Sunrise Electricals', 'Lakeside Hospital', 'Metro Retail'];
const statuses = ['saved', 'applied', 'interview', 'offer', 'rejected'];

await connectDB();
const docs = Array.from({ length: 30 }, (_, i) => ({
  company: companies[i % companies.length],
  role: roles[i % roles.length],
  location: ['Pune', 'Lagos', 'Toronto', 'Leeds', 'Nairobi'][i % 5],
  status: statuses[i % statuses.length],
}));
await Job.insertMany(docs);
console.log(`Added ${docs.length} sample jobs`);
await mongoose.disconnect();
