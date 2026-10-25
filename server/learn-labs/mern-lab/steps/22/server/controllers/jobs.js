// Lesson 22: every query is limited to the signed-in person's own jobs.
import Job, { STATUSES } from '../models/Job.js';
import { HttpError } from '../utils/HttpError.js';
import { pickJobFields } from '../middleware/validate.js';

// Someone else's job answers 404, not 403, so we do not even confirm that the id exists.
const mustFind = (job) => {
  if (!job) throw new HttpError(404, 'Job not found');
  return job;
};
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SORTS = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, company: { company: 1, createdAt: -1 } };

export const listJobs = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

  const filter = { user: req.user._id }; // <- the line that keeps people apart
  if (STATUSES.includes(req.query.status)) filter.status = req.query.status;
  const q = String(req.query.q || '').trim().slice(0, 80);
  if (q) {
    const re = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ company: re }, { role: re }, { location: re }];
  }

  const [items, total] = await Promise.all([
    Job.find(filter).sort(SORTS[req.query.sort] || SORTS.newest).skip((page - 1) * limit).limit(limit),
    Job.countDocuments(filter),
  ]);
  res.json({ items, page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) });
};

export const getJob = async (req, res) => res.json(mustFind(await Job.findOne({ _id: req.params.id, user: req.user._id })));

export const createJob = async (req, res) => {
  // user comes from the token, never from the request body
  const job = await Job.create({ ...pickJobFields(req.body), user: req.user._id });
  res.status(201).json(job);
};

export const updateJob = async (req, res) => {
  const job = await Job.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, pickJobFields(req.body), { new: true, runValidators: true });
  res.json(mustFind(job));
};

export const deleteJob = async (req, res) => {
  mustFind(await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id }));
  res.status(204).end();
};
