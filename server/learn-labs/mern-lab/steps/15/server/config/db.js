import mongoose from 'mongoose';

export async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) throw new Error('MONGODB_URI is missing. Copy .env.example to .env and set it.');
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
  // serverSelectionTimeoutMS: fail in 8 seconds with a clear error instead of hanging for 30
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
