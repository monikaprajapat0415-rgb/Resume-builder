// Lesson 22: protect routes. Put this in front of any route that needs a signed-in person.
import User from '../models/User.js';
import { HttpError } from '../utils/HttpError.js';
import { verifyToken } from '../utils/token.js';

export const protect = async (req, res, next) => {
  // The client sends:  Authorization: Bearer <token>
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) throw new HttpError(401, 'Please sign in');

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new HttpError(401, 'Your session has expired. Please sign in again');
  }
  const user = await User.findById(payload.sub);
  if (!user) throw new HttpError(401, 'Please sign in'); // account was deleted after the token was issued
  req.user = user; // controllers read the signed-in person from here
  next();
};
