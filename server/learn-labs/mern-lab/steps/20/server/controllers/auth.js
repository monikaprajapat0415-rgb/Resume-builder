// Lesson 20: sign up with a hashed password. (Login arrives in lesson 21.)
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { HttpError } from '../utils/HttpError.js';

const COST = 12; // how slow hashing is on purpose. Higher = safer but slower; 10 to 12 is common today

export const register = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (typeof password !== 'string' || password.length < 8) {
    throw new HttpError(400, 'Please fix the highlighted fields', { password: 'password must be at least 8 characters' });
  }
  if (password.length > 72) { // bcrypt only reads the first 72 bytes
    throw new HttpError(400, 'Please fix the highlighted fields', { password: 'password must be 72 characters or fewer' });
  }
  const passwordHash = await bcrypt.hash(password, COST);
  const user = await User.create({ name, email, passwordHash }); // a duplicate email is a 409 thanks to the error handler
  res.status(201).json({ user });
};
