import rateLimit from 'express-rate-limit';

// Slow down password guessing: at most 20 sign-in or sign-up calls per IP address every 15 minutes.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT) || 20,
  standardHeaders: 'draft-7', // sends RateLimit headers so a client can see how many calls are left
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
});

// MongoDB treats an object like { "$gt": "" } as a query operator. If a client sends one where we expect
// text, an attacker can change the meaning of our query ("NoSQL injection"). We refuse any key that starts
// with "$" or contains ".", at any depth, in the JSON body.
const hasOperatorKeys = (value) =>
  value !== null && typeof value === 'object' &&
  Object.entries(value).some(([k, v]) => k.startsWith('$') || k.includes('.') || hasOperatorKeys(v));

export function rejectOperators(req, res, next) {
  if (hasOperatorKeys(req.body)) return res.status(400).json({ message: 'Field names cannot start with $ or contain a dot' });
  next();
}
