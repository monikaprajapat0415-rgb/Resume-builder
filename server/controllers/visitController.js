import crypto from 'crypto';
import VisitDay from '../models/VisitDay.js';
import VisitPage from '../models/VisitPage.js';
import VisitorHash from '../models/VisitorHash.js';

const IST = 5.5 * 36e5; // day buckets use India time, matching the rest of the admin
const DAY = 864e5;
export const istDay = (t = Date.now()) => new Date(t + IST).toISOString().slice(0, 10);

const PRIVATE = /^\/(admin|app|view|logout|forgot-password|reset-password|verify-email|api)(\/|$)/;
const BOT = /bot|crawl|spider|slurp|headless|preview|monitor|uptime|lighthouse|curl|wget|python|axios|node-fetch|go-http|java\/|httpclient|facebookexternalhit|embedly|scrapy/i;

// Keeps only a clean path: no query string, no odd characters, a sane length and depth.
export const cleanPath = (raw) => {
    if (typeof raw !== 'string') return null;
    let p = raw.split('?')[0].split('#')[0].trim();
    if (!p.startsWith('/') || p.length > 120) return null;
    if (!/^[A-Za-z0-9/_\-.~%]+$/.test(p)) return null;
    p = p.replace(/\/{2,}/g, '/');
    if (p.length > 1) p = p.replace(/\/+$/, '');
    if (p.split('/').length > 6) return null;
    if (PRIVATE.test(p)) return null;
    return p.toLowerCase();
};

// POST /api/stats/hit  { path }  - counts one page view. Never sets a cookie, never stores an IP.
export const recordHit = async (req, res) => {
    try {
        const ua = String(req.get('user-agent') || '');
        if (req.get('dnt') === '1' || !ua || BOT.test(ua)) return res.status(204).end();
        const path = cleanPath(req.body?.path);
        if (!path) return res.status(204).end();

        const day = istDay();
        const salt = `${process.env.JWT_SECRET || 'visits'}|${day}`;
        const h = crypto.createHmac('sha256', salt).update(`${req.ip}|${ua}`).digest('hex').slice(0, 32);

        const seen = await VisitorHash.updateOne({ day, h }, { $setOnInsert: { day, h } }, { upsert: true });
        const isNew = seen.upsertedCount > 0;

        await Promise.all([
            VisitDay.updateOne({ day }, { $inc: { views: 1, visitors: isNew ? 1 : 0 } }, { upsert: true }),
            VisitPage.updateOne({ day, path }, { $inc: { views: 1 } }, { upsert: true }),
        ]);
        return res.status(204).end();
    } catch {
        return res.status(204).end(); // counting must never break a page
    }
};

// GET /api/admin/visits - totals, 14-day series and top pages
export const getVisits = async (req, res) => {
    try {
        const now = Date.now();
        const days = Array.from({ length: 30 }, (_, i) => istDay(now - (29 - i) * DAY));
        const rows = await VisitDay.find({ day: { $in: days } }).lean();
        const byDay = Object.fromEntries(rows.map((r) => [r.day, r]));
        const series = days.map((d) => ({ date: d, views: byDay[d]?.views || 0, visitors: byDay[d]?.visitors || 0 }));
        const sum = (arr, k) => arr.reduce((n, d) => n + d[k], 0);
        const last7 = series.slice(-7);
        const top = await VisitPage.aggregate([
            { $match: { day: { $in: last7.map((d) => d.date) } } },
            { $group: { _id: '$path', views: { $sum: '$views' } } },
            { $sort: { views: -1 } },
            { $limit: 10 },
        ]);
        return res.status(200).json({
            today: series[29],
            last7: { views: sum(last7, 'views'), visitors: sum(last7, 'visitors') },
            last30: { views: sum(series, 'views'), visitors: sum(series, 'visitors') },
            series: series.slice(-14),
            topPages: top.map((t) => ({ path: t._id, views: t.views })),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
