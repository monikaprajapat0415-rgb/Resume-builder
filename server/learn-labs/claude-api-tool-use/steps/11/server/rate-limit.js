// A tiny in-memory rate limiter: at most "max" requests per "windowMs" for each IP.
// For a real product with several servers, use a shared store such as Redis.
export function rateLimit({ max = 10, windowMs = 60_000 } = {}) {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      return res.status(429).json({ error: { message: 'You are going too fast. Please wait a minute.' } });
    }
    recent.push(now);
    hits.set(key, recent);
    next();
  };
}
