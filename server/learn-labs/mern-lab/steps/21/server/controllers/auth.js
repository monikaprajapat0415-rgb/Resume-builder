// Lesson 21: log in and get a token.
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { HttpError } from '../utils/HttpError.js';
import { signToken } from '../utils/token.js';

const COST = 12;
// A real hash of nothing in particular. We compare against it when the email is unknown so that
// "wrong email" and "wrong password" take the same time and look the same to an attacker.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', COST);

const passwordProblem = (password) => {
  if (typeof password !== 'string' || password.length < 8) return 'password must be at least 8 characters';
  if (password.length > 72) return 'password must be 72 characters or fewer'; // bcrypt reads only 72 bytes
  return null;
};

export const register = async (req, res) => {
  const { name, email, password } = req.body || {};
  const problem = passwordProblem(password);
  if (problem) throw new HttpError(400, 'Please fix the highlighted fields', { password: problem });
  const passwordHash = await bcrypt.hash(password, COST);
  const user = await User.create({ name, email, passwordHash });
  res.status(201).json({ token: signToken(user.id), user });
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};
  const user = typeof email === 'string' && typeof password === 'string'
    ? await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash')
    : null;
  const ok = await bcrypt.compare(typeof password === 'string' ? password : '', user?.passwordHash || DUMMY_HASH);
  if (!user || !ok) throw new HttpError(401, 'Email or password is wrong'); // same message for both cases on purpose
  res.json({ token: signToken(user.id), user });
};
