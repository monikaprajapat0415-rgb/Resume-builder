// Shows validation and defaults without starting the web server.   Run:  node scripts/model-demo.js
import 'dotenv/config';
import mongoose from 'mongoose';
import Job from '../models/Job.js';

const bad = new Job({ company: '', status: 'maybe' });
const error = bad.validateSync(); // checks the rules without touching the database
console.log('Validation problems:');
for (const [field, e] of Object.entries(error.errors)) console.log(` - ${field}: ${e.message}`);

const good = new Job({ company: '  Acme Logistics  ', role: 'Dispatcher' });
console.log('\nTrimmed and defaulted:', good.toJSON());
await mongoose.disconnect();
