// Shared rules for the jobs community: interview questions, answers, salary reports and company reviews.
import { slugify } from './slugify.js';

export const SALARY_MIN = 3;   // approved reports needed before a pay range is shown (or a page is indexed)
export const REVIEW_MIN = 3;   // approved reviews needed before a company page is indexed / rated in structured data
export const RESERVED_QUESTION_SLUGS = ['fresher', 'experienced'];

export const COUNTRIES = {
    India: 'INR', 'United Kingdom': 'GBP', Canada: 'CAD', Nigeria: 'NGN', Kenya: 'KES', 'South Africa': 'ZAR',
    Ghana: 'GHS', Uganda: 'UGX', Tanzania: 'TZS', 'United Arab Emirates': 'AED', 'United States': 'USD', Other: 'USD',
};
export const CURRENCIES = ['INR', 'GBP', 'CAD', 'USD', 'EUR', 'NGN', 'KES', 'ZAR', 'GHS', 'UGX', 'TZS', 'AED'];
export const PERIODS = ['hour', 'day', 'month', 'year'];
export const SALARY_LEVELS = ['fresher', 'junior', 'mid', 'senior', 'lead'];

export const str = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
// keeps paragraph breaks (used for long answers)
// Like para, but keeps the spacing inside ```code``` blocks (used for model answers that contain code).
export const richText = (v, max) => {
  const t = String(v ?? '').replace(/\r/g, '');
  const parts = t.split(/(```[\w-]*\n[\s\S]*?\n?```)/g);
  const out = parts.map((x, i) => (i % 2 ? x.replace(/[ \t]+\n/g, '\n') : x.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n'))).join('').trim();
  return out.slice(0, max);
};
export const para = (v, max) => String(v ?? '').replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, max);
export const hasLink = (t) => /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|in|co|uk|ng|ke|za)\b)/i.test(String(t || ''));
export const companySlug = (name) => slugify(name).slice(0, 80);

// "Monika Prajapat" -> "Monika P."; anonymous or unnamed -> "Anonymous"
export const displayNameFor = (user, anonymous) => {
    if (anonymous) return 'Anonymous';
    const parts = String(user?.name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'Anonymous';
    return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.` : parts[0];
};

// ---- tiny in-memory rate limiter, per user (resets on restart; enough to slow spam) ----
const hits = new Map();
export const rateLimit = ({ max, windowMs, name }) => (req, res, next) => {
    const key = `${name}:${req.userId || req.ip}`;
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (recent.length >= max) return res.status(429).json({ message: 'You are posting too quickly. Please try again later.' });
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
    next();
};

const median = (a) => {
    const s = [...a].sort((x, y) => x - y);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// Per country: use the most common currency + period among approved reports (amounts are never
// converted), and show min / median / max only when there are enough of them.
export const aggregateSalaries = (reports) => {
    const byCountry = new Map();
    for (const r of reports) {
        if (!byCountry.has(r.country)) byCountry.set(r.country, []);
        byCountry.get(r.country).push(r);
    }
    return [...byCountry.entries()].map(([country, rows]) => {
        const combos = new Map();
        for (const r of rows) {
            const k = `${r.currency}|${r.period}`;
            combos.set(k, [...(combos.get(k) || []), r]);
        }
        const [best] = [...combos.values()].sort((a, b) => b.length - a.length);
        const amounts = best.map((r) => r.amount);
        const enough = best.length >= SALARY_MIN;
        return {
            country, currency: best[0].currency, period: best[0].period, count: best.length, totalReports: rows.length, enough,
            ...(enough ? { min: Math.min(...amounts), median: Math.round(median(amounts)), max: Math.max(...amounts) } : {}),
        };
    }).sort((a, b) => b.count - a.count);
};

export const money = (amount, currency) => {
    try { return new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount); }
    catch { return `${currency} ${Math.round(amount)}`; }
};
export const PERIOD_LABEL = { hour: 'per hour', day: 'per day', month: 'per month', year: 'per year' };
