import { jobInsights } from '../utils/jobInsights.js';
import mongoose from "mongoose";
import Job from "../models/Job.js";
import JobSource from "../models/JobSource.js";
import { syncSource, syncAll, isSyncRunning } from "../services/jobSync.js";
import { STARTER_SOURCES, TOKEN_RX } from "../utils/jobFeeds.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PAGE_SIZE = 20;
const SOURCE_NAMES = { greenhouse: 'Greenhouse', lever: 'Lever', ashby: 'Ashby', arbeitnow: 'Arbeitnow', adzuna: 'Adzuna' };
const validId = (id) => mongoose.Types.ObjectId.isValid(id);

export const jobCard = (j) => ({
    slug: j.slug, title: j.title, company: j.company, location: j.location, remote: j.remote,
    employmentType: j.employmentType, department: j.department, salary: j.salary, postedAt: j.postedAt || j.createdAt,
    snippet: String(j.description || '').replace(/\s+/g, ' ').slice(0, 220),
});

export const liveFilter = () => ({ active: true, hidden: { $ne: true } });

// GET /api/jobs?q=&location=&company=&type=&remote=1&page=
export const listJobs = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const filter = liveFilter();
        const rx = (v) => new RegExp(escapeRegex(String(v).trim().slice(0, 60)), 'i');
        if (req.query.q && String(req.query.q).trim()) {
            const words = String(req.query.q).trim().split(/\s+/).slice(0, 5);
            filter.$and = words.map((w) => ({ $or: [{ title: rx(w) }, { company: rx(w) }, { department: rx(w) }] }));
        }
        if (req.query.location && String(req.query.location).trim()) filter.location = rx(req.query.location);
        if (req.query.company && String(req.query.company).trim()) filter.company = String(req.query.company).trim().slice(0, 150);
        if (req.query.type && String(req.query.type).trim()) filter.employmentType = String(req.query.type).trim().slice(0, 40);
        if (req.query.remote === '1' || req.query.remote === 'true') filter.remote = true;
        const [jobs, total] = await Promise.all([
            Job.find(filter).sort({ postedAt: -1, createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).select('-description').lean(),
            Job.countDocuments(filter),
        ]);
        // description is excluded for speed, so the card snippet is read separately for just this page
        const withText = await Job.find({ _id: { $in: jobs.map((j) => j._id) } }).select('description').lean();
        const text = Object.fromEntries(withText.map((d) => [String(d._id), d.description]));
        return res.status(200).json({
            jobs: jobs.map((j) => jobCard({ ...j, description: text[String(j._id)] })),
            total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
        });
    } catch (e) { return res.status(500).json({ message: 'Could not load jobs.' }); }
};

// GET /api/jobs/facets - values for the filter dropdowns
export const jobFacets = async (req, res) => {
    try {
        const f = liveFilter();
        const [companies, types, total] = await Promise.all([
            Job.distinct('company', f), Job.distinct('employmentType', f), Job.countDocuments(f),
        ]);
        return res.status(200).json({
            total,
            companies: companies.filter(Boolean).sort((a, b) => a.localeCompare(b)).slice(0, 300),
            types: types.filter(Boolean).sort(),
        });
    } catch (e) { return res.status(500).json({ message: 'Could not load filters.' }); }
};

export const loadJobView = async (slug) => {
    const job = await Job.findOne({ slug: String(slug).slice(0, 160), ...liveFilter() }).lean();
    if (!job) return null;
    const more = await Job.find({ ...liveFilter(), company: job.company, _id: { $ne: job._id } }).sort({ postedAt: -1 }).limit(5).select('slug title location').lean();
    return { job, more, sourceName: SOURCE_NAMES[job.sourceType] || '' };
};

// GET /api/jobs/:slug
export const getJob = async (req, res) => {
    try {
        const v = await loadJobView(req.params.slug);
        if (!v) return res.status(404).json({ message: 'Job not found' });
        const { job } = v;
        return res.status(200).json({
            job: { ...jobCard(job), description: job.description, applyUrl: job.applyUrl, country: job.country, sourceType: job.sourceType, updatedAt: job.updatedAt },
            more: v.more, sourceName: v.sourceName, insights: jobInsights(job),
        });
    } catch (e) { return res.status(500).json({ message: 'Could not load the job.' }); }
};

// ---------- Admin ----------

const sourceView = (s, counts) => ({ ...s.toObject(), activeJobs: counts[String(s._id)] || 0, label: SOURCE_NAMES[s.type] });

// GET /api/admin/job-sources
export const getSources = async (req, res) => {
    try {
        const sources = await JobSource.find({}).sort({ createdAt: 1 });
        const counts = {};
        await Promise.all(sources.map(async (s) => { counts[String(s._id)] = await Job.countDocuments({ sourceId: s._id, active: true }); }));
        const total = await Job.countDocuments(liveFilter());
        return res.status(200).json({ sources: sources.map((s) => sourceView(s, counts)), activeJobs: total, syncing: isSyncRunning(), adzunaConfigured: Boolean(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY) });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// POST /api/admin/job-sources { type, company, token, query }
export const createSource = async (req, res) => {
    try {
        const { type } = req.body || {};
        const company = String(req.body?.company || '').trim().slice(0, 100);
        const token = String(req.body?.token || '').trim().slice(0, 80);
        const query = String(req.body?.query || '').trim().slice(0, 80);
        if (!SOURCE_NAMES[type]) return res.status(400).json({ message: 'Choose a source type.' });
        if (['greenhouse', 'lever', 'ashby'].includes(type)) {
            if (!TOKEN_RX.test(token)) return res.status(400).json({ message: 'Enter the company\'s board name, e.g. "stripe" from boards.greenhouse.io/stripe.' });
            if (!company) return res.status(400).json({ message: 'Enter the company name to show on its jobs.' });
        }
        if (type === 'adzuna' && !/^[A-Za-z]{2}$/.test(token)) return res.status(400).json({ message: 'For Adzuna, enter a 2-letter country code such as "in".' });
        const doc = await JobSource.create({ type, company, token: type === 'arbeitnow' ? '' : (type === 'adzuna' ? token.toLowerCase() : token), query });
        return res.status(201).json({ source: doc });
    } catch (e) {
        if (e.code === 11000) return res.status(409).json({ message: 'That source is already added.' });
        return res.status(400).json({ message: e.message });
    }
};

// PATCH /api/admin/job-sources/:id { enabled?, company?, query? }
export const updateSource = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Source not found' });
        const set = {};
        if (req.body?.enabled !== undefined) set.enabled = Boolean(req.body.enabled);
        if (typeof req.body?.company === 'string') set.company = req.body.company.trim().slice(0, 100);
        if (typeof req.body?.query === 'string') set.query = req.body.query.trim().slice(0, 80);
        const s = await JobSource.findByIdAndUpdate(req.params.id, { $set: set }, { new: true });
        if (!s) return res.status(404).json({ message: 'Source not found' });
        return res.status(200).json({ source: s });
    } catch (e) { return res.status(400).json({ message: e.message }); }
};

// DELETE /api/admin/job-sources/:id - also removes the jobs it imported
export const deleteSource = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Source not found' });
        const s = await JobSource.findByIdAndDelete(req.params.id);
        if (!s) return res.status(404).json({ message: 'Source not found' });
        const { deletedCount } = await Job.deleteMany({ sourceId: s._id });
        return res.status(200).json({ message: 'Source deleted', jobsDeleted: deletedCount });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// POST /api/admin/job-sources/:id/run - fetch this source now
export const runSource = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Source not found' });
        const s = await JobSource.findById(req.params.id);
        if (!s) return res.status(404).json({ message: 'Source not found' });
        const result = await syncSource(s);
        return res.status(result.ok ? 200 : 502).json(result.ok ? result : { message: result.error });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// POST /api/admin/job-sources/sync-all - runs in the background, the page polls GET /job-sources
export const runAll = async (req, res) => {
    if (isSyncRunning()) return res.status(202).json({ message: 'A sync is already running.' });
    syncAll().catch((e) => console.error('[jobs] manual sync failed:', e.message));
    return res.status(202).json({ message: 'Sync started.' });
};

// POST /api/admin/job-sources/seed - adds the checked starter boards that are not there yet
export const seedSources = async (req, res) => {
    try {
        let added = 0;
        for (const s of STARTER_SOURCES) {
            const exists = await JobSource.findOne({ type: s.type, token: s.token, query: '' });
            if (!exists) { await JobSource.create(s); added++; }
        }
        return res.status(200).json({ added });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
