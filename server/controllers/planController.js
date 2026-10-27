import PlanSettings from "../models/PlanSettings.js";
import User from "../models/User.js";

export const GATES = {
    ai_writing: 'AI writing help (summary and bullet points)',
    cover_letter: 'AI cover letters',
    cv_generate: 'AI CV builder',
    image_8k: 'Image enhancer: 8K output (4K stays free)',
};
const DEFAULTS = {
    enabled: false, planName: 'Pro', price: 0, currency: 'INR', period: 'month', tagline: '',
    features: ['AI writing help for your summary and bullet points', 'AI cover letters', 'AI CV builder'],
    freeFeatures: ['Resume builder with ATS-friendly templates', 'Download as PDF', 'Free ATS resume checker', 'All learning courses'],
    paymentLink: '', payInstructions: '', gates: { ai_writing: false, cover_letter: false, cv_generate: false },
};

let cache = null, cachedAt = 0;
export const getPlanSettings = async () => {
    if (cache && Date.now() - cachedAt < 30000) return cache;
    const doc = await PlanSettings.findOne({ key: 'main' }).lean();
    cache = { ...DEFAULTS, ...(doc || {}), gates: { ...DEFAULTS.gates, ...(doc?.gates || {}) } };
    cachedAt = Date.now();
    return cache;
};
const bust = () => { cache = null; };
export const isPlanEnabled = async () => { try { return Boolean((await getPlanSettings()).enabled); } catch { return false; } };
export const isPaidUser = (u) => Boolean(u && (u.role === 'admin' || (u.planUntil && new Date(u.planUntil) > new Date())));

const pub = (s) => ({
    enabled: true, planName: s.planName, price: s.price, currency: s.currency, period: s.period, tagline: s.tagline,
    features: s.features, freeFeatures: s.freeFeatures, paymentLink: s.paymentLink, payInstructions: s.payInstructions,
    gates: s.gates,
});

// GET /api/plan - public. While the plan is off, it says only that, so nothing about prices leaks or shows.
export const getPublicPlan = async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=0, s-maxage=30, must-revalidate');
        const s = await getPlanSettings();
        return res.status(200).json(s.enabled ? { plan: pub(s) } : { plan: { enabled: false } });
    } catch (e) { return res.status(200).json({ plan: { enabled: false } }); } // on any error the site stays free
};

export const adminGetPlan = async (req, res) => {
    try { return res.status(200).json({ settings: await getPlanSettings(), gateLabels: GATES }); }
    catch (e) { return res.status(500).json({ message: e.message }); }
};

const str = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const list = (v, max, n) => (Array.isArray(v) ? v : []).map((x) => str(x, max)).filter(Boolean).slice(0, n);

// PUT /api/admin/plan
export const adminSavePlan = async (req, res) => {
    try {
        const b = req.body || {};
        const out = {
            enabled: b.enabled === true,
            planName: str(b.planName, 40) || 'Pro',
            price: Math.max(0, Math.min(10000000, Number(b.price) || 0)),
            currency: str(b.currency, 6).toUpperCase() || 'INR',
            period: ['month', 'year', 'once'].includes(b.period) ? b.period : 'month',
            tagline: str(b.tagline, 160),
            features: list(b.features, 100, 10),
            freeFeatures: list(b.freeFeatures, 100, 10),
            payInstructions: str(b.payInstructions, 300),
            gates: Object.fromEntries(Object.keys(GATES).map((k) => [k, b.gates?.[k] === true])),
        };
        if (!/^[A-Z]{3}$/.test(out.currency)) return res.status(400).json({ message: 'Currency must be a 3-letter code such as INR, USD, GBP, CAD or NGN.' });
        const link = str(b.paymentLink, 500);
        if (link && !/^https:\/\/[^\s]+$/i.test(link)) return res.status(400).json({ message: 'The payment link must start with https://' });
        out.paymentLink = link;
        if (out.enabled) {
            if (!(out.price > 0)) return res.status(400).json({ message: 'Set a price above 0 before turning the paid plan on.' });
            if (!out.paymentLink && !out.payInstructions) return res.status(400).json({ message: 'Add a payment link or payment instructions first, so people know how to pay.' });
            if (!Object.values(out.gates).some(Boolean)) return res.status(400).json({ message: 'Tick at least one feature that needs the paid plan, or leave the plan off.' });
        }
        await PlanSettings.findOneAndUpdate({ key: 'main' }, { $set: out }, { upsert: true, new: true });
        bust();
        return res.status(200).json({ message: out.enabled ? 'Paid plan is ON.' : 'Saved. The paid plan is OFF, everything is free.', settings: await getPlanSettings() });
    } catch (e) { return res.status(400).json({ message: e.message }); }
};

// POST /api/admin/users/:id/plan { days } | { lifetime: true } | { days: 0 } to remove
export const adminSetUserPlan = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const b = req.body || {};
        if (b.lifetime === true) user.planUntil = new Date('2999-12-31');
        else {
            const days = Math.floor(Number(b.days));
            if (!Number.isFinite(days) || days < 0 || days > 3650) return res.status(400).json({ message: 'Days must be between 0 and 3650.' });
            if (days === 0) user.planUntil = null;
            else {
                const from = user.planUntil && user.planUntil > new Date() ? user.planUntil : new Date(); // extend, do not shorten
                user.planUntil = new Date(from.getTime() + days * 86400000);
            }
        }
        await user.save();
        return res.status(200).json({ planUntil: user.planUntil });
    } catch (e) { return res.status(400).json({ message: e.message }); }
};
