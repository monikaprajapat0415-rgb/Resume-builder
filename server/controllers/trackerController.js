import JobApplication, { TRACKER_STATUSES } from "../models/JobApplication.js";
import { getToolSettings } from "./toolSettingsController.js";

const str = (v, max) => String(v ?? '').replace(/[ \t]+/g, ' ').trim().slice(0, max);
const day = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : d;
};

// Only web addresses may be saved: a card link must never be javascript: or data:
export const cleanUrl = (v) => {
    const s = str(v, 500);
    if (!s) return '';
    try {
        const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
        return /^https?:$/.test(u.protocol) && u.hostname.includes('.') ? u.toString() : null;
    } catch { return null; }
};

export const cleanCard = (b, partial = false) => {
    const out = {};
    const has = (k) => b[k] !== undefined;
    if (!partial || has('company')) { out.company = str(b.company, 120); if (!out.company) throw new Error('Enter the company name.'); }
    if (!partial || has('role')) { out.role = str(b.role, 120); if (!out.role) throw new Error('Enter the job title.'); }
    if (has('location')) out.location = str(b.location, 120);
    if (has('notes')) out.notes = String(b.notes ?? '').replace(/\r\n/g, '\n').trim().slice(0, 2000);
    if (has('status')) { if (!TRACKER_STATUSES.includes(b.status)) throw new Error('Unknown column.'); out.status = b.status; }
    if (has('jobUrl')) { const u = cleanUrl(b.jobUrl); if (u === null) throw new Error('The job link must be a web address such as https://example.com/job.'); out.jobUrl = u; }
    for (const k of ['appliedOn', 'followUpOn']) if (has(k)) { const d = day(b[k]); if (d === undefined) throw new Error('One of the dates is not valid.'); out[k] = d; }
    return out;
};

const gate = async (res) => {
    const s = await getToolSettings();
    if (!s.trackerTool) { res.status(403).json({ message: 'The job tracker is not available right now.' }); return null; }
    return s;
};

// GET /api/tracker  -> { items, limit }
export const listCards = async (req, res) => {
    try {
        const s = await gate(res); if (!s) return;
        const items = await JobApplication.find({ userId: req.userId }).sort({ updatedAt: -1 }).limit(s.trackerMaxPerUser + 50).lean();
        return res.status(200).json({ items, limit: s.trackerMaxPerUser });
    } catch (error) { return res.status(500).json({ message: 'Could not load your jobs.' }); }
};

export const createCard = async (req, res) => {
    try {
        const s = await gate(res); if (!s) return;
        const data = cleanCard(req.body || {});
        const count = await JobApplication.countDocuments({ userId: req.userId });
        if (count >= s.trackerMaxPerUser) return res.status(409).json({ message: `You can keep up to ${s.trackerMaxPerUser} jobs on the board. Delete some old ones to add more.` });
        const item = await JobApplication.create({ ...data, userId: req.userId });
        return res.status(201).json({ item });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

export const updateCard = async (req, res) => {
    try {
        const s = await gate(res); if (!s) return;
        const data = cleanCard(req.body || {}, true);
        // userId in the filter: nobody can change a card that is not theirs
        const item = await JobApplication.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { $set: data }, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ message: 'Not found.' });
        return res.status(200).json({ item });
    } catch (error) { return res.status(400).json({ message: error.name === 'CastError' ? 'Not found.' : error.message }); }
};

export const deleteCard = async (req, res) => {
    try {
        const gone = await JobApplication.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!gone) return res.status(404).json({ message: 'Not found.' });
        return res.status(200).json({ message: 'Deleted.' });
    } catch (error) { return res.status(400).json({ message: 'Not found.' }); }
};
