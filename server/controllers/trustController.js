import TrustItem from "../models/TrustItem.js";
import User from "../models/User.js";
import Resume from "../models/Resume.js";

const str = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const safeUrl = (v) => { const s = str(v, 500); return /^https?:\/\/[^\s]+$/i.test(s) || /^\/[^\s/][^\s]*$/.test(s) ? s : ''; };

const clean = (b, kind) => {
    const out = { kind };
    out.name = str(b.name, 80);
    if (!out.name) throw new Error(kind === 'client' ? 'Company name is required.' : 'Name is required.');
    out.logoUrl = safeUrl(b.logoUrl);
    out.url = safeUrl(b.url);
    out.location = str(b.location, 60);
    out.proof = str(b.proof, 300);
    out.order = Number.isFinite(Number(b.order)) ? Number(b.order) : 0;
    out.published = !!b.published;
    out.permission = !!b.permission;
    if (kind === 'review') {
        out.role = str(b.role, 80); out.company = str(b.company, 80);
        out.quote = String(b.quote ?? '').replace(/\s+/g, ' ').trim().slice(0, 500);
        if (!out.quote) throw new Error('The review text is required.');
        out.rating = Math.min(5, Math.max(0, Math.round(Number(b.rating) || 0)));
        out.reviewerType = ['job seeker', 'employer', 'client'].includes(b.reviewerType) ? b.reviewerType : 'job seeker';
        if (out.published && !out.permission) throw new Error('Tick "I have permission to show this" before publishing a review.');
    }
    return out;
};

// ---- public: GET /api/home/trust ----
let statsCache = { at: 0, value: null };
const stats = async () => {
    if (statsCache.value && Date.now() - statsCache.at < 10 * 60 * 1000) return statsCache.value;
    const [users, resumes] = await Promise.all([User.countDocuments({}), Resume.countDocuments({})]);
    statsCache = { at: Date.now(), value: { users, resumes } };
    return statsCache.value;
};

export const getHomeTrust = async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=0, s-maxage=60, must-revalidate');
        const [items, counts] = await Promise.all([
            TrustItem.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean(),
            stats().catch(() => ({ users: 0, resumes: 0 })),
        ]);
        const reviews = items.filter((i) => i.kind === 'review' && i.permission).slice(0, 12)
            .map(({ _id, name, role, company, location, quote, rating, logoUrl, reviewerType }) => ({ id: String(_id), name, role, company, location, quote, rating, logoUrl, reviewerType }));
        const clients = items.filter((i) => i.kind === 'client').slice(0, 30)
            .map(({ _id, name, logoUrl, url }) => ({ id: String(_id), name, logoUrl, url }));
        return res.status(200).json({ reviews, clients, stats: counts });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ---- admin ----
export const adminListTrust = async (req, res) => {
    try {
        const kind = req.query.kind === 'client' ? 'client' : 'review';
        const items = await TrustItem.find({ kind }).sort({ order: 1, createdAt: -1 }).lean();
        return res.status(200).json({ items });
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const adminCreateTrust = async (req, res) => {
    try {
        const kind = req.body?.kind === 'client' ? 'client' : 'review';
        const item = await TrustItem.create(clean(req.body || {}, kind));
        return res.status(201).json({ item });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

export const adminUpdateTrust = async (req, res) => {
    try {
        const current = await TrustItem.findById(req.params.id);
        if (!current) return res.status(404).json({ message: 'Not found' });
        Object.assign(current, clean({ ...current.toObject(), ...(req.body || {}) }, current.kind));
        await current.save();
        return res.status(200).json({ item: current });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

export const adminDeleteTrust = async (req, res) => {
    try {
        const gone = await TrustItem.findByIdAndDelete(req.params.id);
        if (!gone) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json({ message: 'Deleted' });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};
