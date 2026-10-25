// Lesson 18: search, filter, sort and pagination.
import Job, { STATUSES } from '../models/Job.js';
import { HttpError } from '../utils/HttpError.js';
import { pickJobFields } from '../middleware/validate.js';

const mustFind = (job) => {
  if (!job) throw new HttpError(404, 'Job not found');
  return job;
};

// Make user text safe to use inside a regular expression ("C++" must not break the search).
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORTS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  company: { company: 1, createdAt: -1 },
};

// GET /api/jobs?q=bank&status=applied&sort=company&page=2&limit=10
export const listJobs = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10)); // never let a client ask for 1 million rows

  const filter = {};
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

export const getJob = async (req, res) => res.json(mustFind(await Job.findById(req.params.id)));

export const createJob = async (req, res) => {
  const job = await Job.create(pickJobFields(req.body));
  res.status(201).json(job);
};

export const updateJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, pickJobFields(req.body), { new: true, runValidators: true });
  res.json(mustFind(job));
};

export const deleteJob = async (req, res) => {
  mustFind(await Job.findByIdAndDelete(req.params.id));
  res.status(204).end();
};
