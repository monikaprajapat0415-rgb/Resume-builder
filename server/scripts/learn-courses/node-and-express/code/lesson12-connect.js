import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Set MONGODB_URI in your .env file.');
  process.exit(1);
}

await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
console.log('Connected to MongoDB');
