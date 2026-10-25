// Lesson 17: the same routes, now backed by MongoDB.
// Express 5 passes errors from async functions to the error handler, so we do not need try/catch everywhere.
import Job from '../models/Job.js';
import { HttpError } from '../utils/HttpError.js';
import { pickJobFields } from '../middleware/validate.js';

const mustFind = (job) => {
  if (!job) throw new HttpError(404, 'Job not found');
  return job;
};

export const listJobs = async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
};

export const getJob = async (req, res) => res.json(mustFind(await Job.findById(req.params.id)));

export const createJob = async (req, res) => {
  const job = await Job.create(pickJobFields(req.body)); // Create: validation runs automatically
  res.status(201).json(job);
};

export const updateJob = async (req, res) => {
  // new: true returns the changed document; runValidators applies the schema rules to the update too
  const job = await Job.findByIdAndUpdate(req.params.id, pickJobFields(req.body), { new: true, runValidators: true });
  res.json(mustFind(job));
};

export const deleteJob = async (req, res) => {
  mustFind(await Job.findByIdAndDelete(req.params.id));
  res.status(204).end();
};
