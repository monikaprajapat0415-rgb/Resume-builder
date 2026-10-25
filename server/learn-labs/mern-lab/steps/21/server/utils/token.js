import jwt from 'jsonwebtoken';

const secret = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing. Set it in .env');
  return process.env.JWT_SECRET;
};

// A JWT has three parts: a header, a payload (we put the user id in `sub`) and a signature made with our secret.
// Anyone can READ the payload, so never put passwords or private data in it. Only we can SIGN it.
export const signToken = (userId) => jwt.sign({ sub: String(userId) }, secret(), { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// Throws if the token is forged, tampered with or expired.
export const verifyToken = (token) => jwt.verify(token, secret());
