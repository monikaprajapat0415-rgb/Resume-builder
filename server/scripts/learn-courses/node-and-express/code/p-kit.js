// Small helpers shared by projects 2 to 9: errors, tokens, auth middleware, and the error handler.
import jwt from 'jsonwebtoken';

export class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

export const SECRET = process.env.JWT_SECRET ?? 'dev-only-secret-change-me-please-32chars';

export const signToken = (user, secret = SECRET) =>
  jwt.sign({ sub: user.id, role: user.role, name: user.name }, secret, { expiresIn: '1h' });

export const requireAuth = (secret = SECRET) => (req, res, next) => {
  try {
    const payload = jwt.verify((req.get('authorization') ?? '').replace(/^Bearer /, ''), secret);
    req.user = { id: payload.sub, role: payload.role, name: payload.name };
    next();
  } catch {
    next(new AppError('Log in first', 401));
  }
};

export const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : next(new AppError('You are not allowed to do this', 403));

// Wrap a handler so a thrown AppError goes to the error handler (Express 5 does this for async handlers already).
export const handle = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const notFoundHandler = (req, res) => res.status(404).json({ error: 'Not found' });

export const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Body is not valid JSON' });
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status < 500 ? err.message : 'Something went wrong' });
};
