import mongoose from "mongoose";
import Roadmap from "../models/Roadmap.js";
import { slugify } from "../utils/slugify.js";
import { cleanRoadmapFields, roadmapCard, roadmapView } from "../utils/roadmapSeo.js";
import { searchRoadmaps } from "../utils/roadmapSearch.js";
import { collectProfile, coverage, fitScore } from "../utils/roadmapProfile.js";

const validId = (id) => mongoose.isValidObjectId(id);

// ---------- shared loaders (also used by the server-rendered pages) ----------
export const loadRoadmapView = async (slug) => {
    const r = await Roadmap.findOne({ slug, published: true });
    return r ? roadmapView(r) : null;
};
export const listPublishedRoadmaps = async ({ q = '', kind = '' } = {}) =>
    searchRoadmaps(await Roadmap.find({ published: true }).sort({ order: 1, createdAt: 1 }), { q: String(q).slice(0, 80), kind }).map(roadmapCard);

// ---------- Public ----------
// GET /api/roadmaps
export const getRoadmaps = async (req, res) => {
    try { return res.status(200).json({ roadmaps: await listPublishedRoadmaps({ q: req.query.q, kind: ['career', 'role', 'technology'].includes(req.query.kind) ? req.query.kind : '' }) }); }
    catch (e) { return res.status(500).json({ message: e.message }); }
};

// GET /api/roadmaps/:slug
export const getRoadmap = async (req, res) => {
    try {
        const v = await loadRoadmapView(req.params.slug);
        if (!v) return res.status(404).json({ message: 'Roadmap not found' });
        return res.status(200).json(v);
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// ---------- Personalised (signed-in user, own data only) ----------
// GET /api/roadmaps/for-me : every roadmap ranked by how well it fits the user's resumes, CVs and open-to-work profile
export const getRoadmapsForMe = async (req, res) => {
    try {
        res.set('Cache-Control', 'private, no-store');
        const profile = await collectProfile(req.userId);
        if (!profile.hasData) return res.status(200).json({ hasData: false, sources: [], recommended: [] });
        const rows = await Roadmap.find({ published: true }).sort({ order: 1, createdAt: 1 });
        const ranked = rows.map((r) => {
            const fit = fitScore(profile, r);
            return { ...roadmapCard(r), score: fit.score, matched: fit.matched, total: fit.total, percent: fit.percent };
        }).sort((a, b) => b.score - a.score);
        // only call a roadmap "recommended" when something actually matched
        return res.status(200).json({ hasData: true, sources: profile.sources, recommended: ranked.filter((r) => r.score > 0).slice(0, 3), all: ranked });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// GET /api/roadmaps/:slug/for-me : which skills in this roadmap the user already shows, and where to start
export const getRoadmapForMe = async (req, res) => {
    try {
        res.set('Cache-Control', 'private, no-store');
        const r = await Roadmap.findOne({ slug: req.params.slug, published: true });
        if (!r) return res.status(404).json({ message: 'Roadmap not found' });
        const profile = await collectProfile(req.userId);
        if (!profile.hasData) return res.status(200).json({ hasData: false, sources: [] });
        return res.status(200).json({ hasData: true, sources: profile.sources, ...coverage(profile, r.steps) });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// ---------- Admin ----------
export const getRoadmapsAdmin = async (req, res) => {
    try {
        const rows = await Roadmap.find().sort({ order: 1, createdAt: 1 }).select('title slug summary audience kind published order steps updatedAt');
        return res.status(200).json({ roadmaps: rows.map((r) => ({ _id: r._id, title: r.title, slug: r.slug, audience: r.audience, kind: r.kind || 'career', published: r.published, order: r.order, stepCount: r.steps.length, updatedAt: r.updatedAt })) });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

export const getRoadmapAdmin = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Roadmap not found' });
        const r = await Roadmap.findById(req.params.id);
        if (!r) return res.status(404).json({ message: 'Roadmap not found' });
        return res.status(200).json({ roadmap: r });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

export const createRoadmap = async (req, res) => {
    try {
        const title = String(req.body.title || '').trim().slice(0, 120);
        if (!title) return res.status(400).json({ message: 'A title is required.' });
        const slug = slugify(req.body.slug || title);
        if (!slug) return res.status(400).json({ message: 'Could not make a URL from that title.' });
        if (await Roadmap.exists({ slug })) return res.status(409).json({ message: 'A roadmap with this URL already exists.' });
        const r = await Roadmap.create({ ...cleanRoadmapFields(req.body), title, slug, modifiedAt: new Date() });
        return res.status(201).json({ roadmap: r });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

export const updateRoadmap = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Roadmap not found' });
        const r = await Roadmap.findById(req.params.id);
        if (!r) return res.status(404).json({ message: 'Roadmap not found' });
        const patch = cleanRoadmapFields(req.body);
        if (req.body.title !== undefined) {
            const title = String(req.body.title).trim().slice(0, 120);
            if (!title) return res.status(400).json({ message: 'A title is required.' });
            patch.title = title;
        }
        if (req.body.slug !== undefined && slugify(req.body.slug) !== r.slug) {
            const slug = slugify(req.body.slug);
            if (!slug) return res.status(400).json({ message: 'That URL is not valid.' });
            if (await Roadmap.exists({ slug, _id: { $ne: r._id } })) return res.status(409).json({ message: 'A roadmap with this URL already exists.' });
            patch.slug = slug;
        }
        Object.assign(r, patch, { modifiedAt: new Date() });
        await r.save();
        return res.status(200).json({ roadmap: r });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

export const deleteRoadmap = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Roadmap not found' });
        await Roadmap.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Roadmap deleted.' });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
