import SignupNudge from '../models/SignupNudge.js';

// Settings for the small sign-up card. If the settings cannot be read, the card stays hidden.
const DEFAULTS = { enabled: true, onHome: true, onContent: false, delaySeconds: 20, hideDays: 14, title: 'Save your resume for free', body: 'Create a free account to keep your resume, come back to edit it any time, and download it when it is ready.', button: 'Create free account', shown: 0, clicked: 0, dismissed: 0, statsSince: null };
let cache = null, at = 0;

export const getNudge = async () => {
    if (cache && Date.now() - at < 10000) return cache;
    try {
        const doc = await SignupNudge.findOne({ key: 'main' }).lean();
        cache = { ...DEFAULTS, ...Object.fromEntries(Object.keys(DEFAULTS).filter((k) => doc && doc[k] !== undefined && doc[k] !== null).map((k) => [k, doc[k]])) };
    } catch { cache = { ...DEFAULTS, enabled: false }; }
    at = Date.now();
    return cache;
};

// GET /api/nudge/config (public): only what the page needs
export const publicNudge = async (req, res) => {
    const s = await getNudge();
    res.set('Cache-Control', 'no-store');
    return res.status(200).json({ enabled: s.enabled, onHome: s.onHome, onContent: s.onContent, delaySeconds: s.delaySeconds, hideDays: s.hideDays, title: s.title, body: s.body, button: s.button });
};

// POST /api/nudge/event { type: 'shown' | 'clicked' | 'dismissed' }: counts only, nothing about the visitor is stored
export const nudgeEvent = async (req, res) => {
    const type = String(req.body?.type || '');
    if (!['shown', 'clicked', 'dismissed'].includes(type)) return res.status(400).json({ message: 'Unknown event' });
    try { await SignupNudge.updateOne({ key: 'main' }, { $inc: { [type]: 1 }, $setOnInsert: { key: 'main' } }, { upsert: true }); } catch { /* counting must never break a page */ }
    return res.status(204).end();
};

// GET /api/admin/nudge
export const adminGetNudge = async (req, res) => {
    try { cache = null; return res.status(200).json({ settings: await getNudge() }); } catch (e) { return res.status(500).json({ message: e.message }); }
};

// PUT /api/admin/nudge { any setting, or resetStats: true }
export const adminSaveNudge = async (req, res) => {
    try {
        const b = req.body || {}, set = {};
        for (const k of ['enabled', 'onHome', 'onContent']) if (typeof b[k] === 'boolean') set[k] = b[k];
        const num = (k, lo, hi, msg) => { if (b[k] === undefined) return null; const n = Number(b[k]); if (!Number.isInteger(n) || n < lo || n > hi) return msg; set[k] = n; return null; };
        const err = num('delaySeconds', 3, 300, 'Delay must be a whole number of seconds from 3 to 300.') || num('hideDays', 1, 365, 'Hide days must be a whole number from 1 to 365.');
        if (err) return res.status(400).json({ message: err });
        const text = (k, max, label) => { if (b[k] === undefined) return null; const v = String(b[k]).trim(); if (!v || v.length > max || /[<>]/.test(v)) return `${label} is required, up to ${max} characters, no HTML.`; set[k] = v; return null; };
        const terr = text('title', 70, 'Title') || text('body', 220, 'Text') || text('button', 30, 'Button label');
        if (terr) return res.status(400).json({ message: terr });
        if (b.resetStats === true) Object.assign(set, { shown: 0, clicked: 0, dismissed: 0, statsSince: new Date() });
        await SignupNudge.updateOne({ key: 'main' }, { $set: set, $setOnInsert: { key: 'main' } }, { upsert: true });
        cache = null;
        return res.status(200).json({ message: 'Saved.', settings: await getNudge() });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
