import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const LOG = path.join(here, 'runtime', 'usage.jsonl');

// ---- 1. Response cache: the same question within 10 minutes costs nothing. ----
const cache = new Map();
const TTL = 10 * 60 * 1000;
const MAX_ENTRIES = 200;
export const cacheKey = (...parts) => parts.map((p) => String(p).toLowerCase().replace(/\s+/g, ' ').trim()).join('|');
export const cacheGet = (key) => {
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expires < Date.now()) { cache.delete(key); return null; }
  return hit.value;
};
export const cacheSet = (key, value) => {
  cache.set(key, { value, expires: Date.now() + TTL });
  if (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value); // drop the oldest
};

// ---- 2. Rate limit: at most `limit` calls per client per minute. ----
const windows = new Map();
export function rateLimit({ limit = 10, windowMs = 60_000 } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || 'unknown';
    const w = windows.get(ip);
    if (!w || w.reset < now) {
      windows.set(ip, { count: 1, reset: now + windowMs });
      return next();
    }
    if (++w.count > limit) {
      res.setHeader('Retry-After', Math.ceil((w.reset - now) / 1000));
      return res.status(429).json({ error: { message: 'Too many requests. Please wait a minute and try again.', status: 429 } });
    }
    next();
  };
}

// ---- 3. Metrics and a usage log. ----
const m = { requests: 0, cacheHits: 0, fallbacks: 0, errors: 0, inputTokens: 0, outputTokens: 0, totalMs: 0 };

const price = () => ({
  input: Number(process.env.PRICE_INPUT_PER_MTOK) || 0,
  output: Number(process.env.PRICE_OUTPUT_PER_MTOK) || 0,
  currency: process.env.PRICE_CURRENCY || 'USD',
});

export function record({ route, ms, usage = { input: 0, output: 0 }, cached = false, fallback = false, error = false }) {
  m.requests++;
  m.totalMs += ms;
  if (cached) m.cacheHits++;
  if (fallback) m.fallbacks++;
  if (error) m.errors++;
  m.inputTokens += usage.input;
  m.outputTokens += usage.output;
  try {
    fs.mkdirSync(path.dirname(LOG), { recursive: true });
    // Log numbers only. Never write the user's text to a log file.
    fs.appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), route, ms, cached, fallback, error, ...usage }) + '\n');
  } catch { /* logging must never break a request */ }
}

export function metrics() {
  const p = price();
  const cost = (m.inputTokens * p.input + m.outputTokens * p.output) / 1_000_000;
  return {
    ...m,
    avgMs: m.requests ? Math.round(m.totalMs / m.requests) : 0,
    cacheHitRate: m.requests ? Number((m.cacheHits / m.requests).toFixed(2)) : 0,
    estimatedCost: p.input || p.output ? Number(cost.toFixed(4)) : null,
    currency: p.currency,
  };
}
