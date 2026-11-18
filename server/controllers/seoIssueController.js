import mongoose from 'mongoose';
import SeoIssue from '../models/SeoIssue.js';

const STATUS = ['open', 'fixing', 'validating', 'fixed', 'ignore'];
const clean = (b = {}, partial = false) => {
    const out = {};
    if (!partial || b.title !== undefined) {
        const t = String(b.title ?? '').trim();
        if (!t || t.length > 140 || /[<>]/.test(t)) return { error: 'Title is required, up to 140 characters, no HTML.' };
        out.title = t;
    }
    if (b.count !== undefined) { const n = Number(b.count); if (!Number.isInteger(n) || n < 0 || n > 10000000) return { error: 'Count must be a whole number of 0 or more.' }; out.count = n; }
    if (b.status !== undefined) { if (!STATUS.includes(b.status)) return { error: 'Unknown status.' }; out.status = b.status; }
    if (b.note !== undefined) { const n = String(b.note).trim(); if (n.length > 600 || /[<>]/.test(n)) return { error: 'Note: up to 600 characters, no HTML.' }; out.note = n; }
    if (b.examples !== undefined) {
        const ex = (Array.isArray(b.examples) ? b.examples : String(b.examples).split(/\r?\n/)).map((x) => String(x).trim()).filter(Boolean).slice(0, 10);
        if (ex.some((x) => x.length > 200 || /[<>\s]/.test(x))) return { error: 'Example URLs: up to 10, no spaces or HTML.' };
        out.examples = ex;
    }
    if (b.checkedAt !== undefined) { const d = new Date(b.checkedAt); if (Number.isNaN(+d)) return { error: 'Checked date is not valid.' }; out.checkedAt = d; }
    return { set: out };
};

// The issues Search Console showed in November 2026 (read from screenshots the site owner shared).
const STARTER = [
    { title: 'Google chose different canonical than user', count: 157, note: 'Check which URL Google prefers for these pages and make our canonical agree. Needs example URLs.' },
    { title: 'Not found (404)', count: 378, note: 'Mostly closed job pages. Decide: keep a closed page with a link to similar jobs, or return 404.' },
    { title: 'Alternate page with proper canonical tag', count: 208, note: 'Usually fine. Only check if important pages are listed.' },
    { title: 'Excluded by noindex tag', count: 509, note: 'Expected for filtered and private pages. Check no important page is listed.' },
    { title: 'Crawled or discovered, currently not indexed', count: 48, note: 'Look for thin or near-duplicate pages. Improve or remove.' },
    { title: 'Duplicate without user-selected canonical', count: 6, note: 'Needs example URLs from Search Console.' },
    { title: 'Job postings: invalid items (missing jobLocation)', count: 0, status: 'validating', note: 'Fixed in code on Nov 16 (JobPosting data left out when a job has no location and is not remote). Press Validate fix in Search Console.' },
];

export const listIssues = async (req, res) => {
    try { return res.status(200).json({ issues: await SeoIssue.find({}).sort({ status: 1, count: -1, createdAt: 1 }).lean() }); } catch (e) { return res.status(500).json({ message: e.message }); }
};
export const createIssue = async (req, res) => {
    try {
        if (req.body?.starter === true) {
            if (await SeoIssue.countDocuments({})) return res.status(400).json({ message: 'The list is not empty, so the starter list was not added.' });
            await SeoIssue.insertMany(STARTER);
            return res.status(201).json({ message: 'Starter list added.' });
        }
        const { error, set } = clean(req.body);
        if (error) return res.status(400).json({ message: error });
        return res.status(201).json({ issue: await SeoIssue.create(set) });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
export const updateIssue = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Not found' });
        const { error, set } = clean(req.body, true);
        if (error) return res.status(400).json({ message: error });
        const issue = await SeoIssue.findByIdAndUpdate(req.params.id, { $set: set }, { new: true }).lean();
        return issue ? res.status(200).json({ issue }) : res.status(404).json({ message: 'Not found' });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
export const deleteIssue = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Not found' });
        await SeoIssue.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: 'Deleted' });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
