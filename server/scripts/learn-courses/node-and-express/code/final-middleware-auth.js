import jwt from 'jsonwebtoken';

export function requireAuth(secret) {
  return (req, res, next) => {
    const header = req.get('Authorization') || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Log in first' });
    try {
      const payload = jwt.verify(token, secret);
      req.user = { id: payload.sub, email: payload.email };
      next();
    } catch {
      res.status(401).json({ error: 'Token is invalid or expired' });
    }
  };
}
