import { HttpError } from '../utils/HttpError.js';
import { cleanJob } from '../middleware/validate.js';

let nextId = 3;
const jobs = [
  { id: 1, company: 'Northwind Bank', role: 'Teller', status: 'applied' },
  { id: 2, company: 'Acme Logistics', role: 'Dispatcher', status: 'interview' },
];

const find = (id) => {
  const job = jobs.find((j) => j.id === Number(id));
  if (!job) throw new HttpError(404, 'Job not found');
  return job;
};

export const listJobs = (req, res) => res.json(jobs);
export const getJob = (req, res) => res.json(find(req.params.id));

export const createJob = (req, res) => {
  const job = { id: nextId++, ...cleanJob(req.body) };
  jobs.push(job);
  res.status(201).json(job);
};

export const updateJob = (req, res) => {
  const job = find(req.params.id);
  Object.assign(job, cleanJob(req.body, { partial: true }));
  res.json(job);
};

export const deleteJob = (req, res) => {
  const job = find(req.params.id);
  jobs.splice(jobs.indexOf(job), 1);
  res.status(204).end();
};
