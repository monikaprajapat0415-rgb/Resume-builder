import path from 'node:path';
import Job from '../models/Job.js';
import { HttpError } from '../utils/HttpError.js';
import { UPLOAD_DIR, looksLikeAllowedFile, removeFile } from '../middleware/upload.js';

const ownJob = async (req) => {
  const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
  if (!job) throw new HttpError(404, 'Job not found');
  return job;
};

export const uploadResume = async (req, res) => {
  if (!req.file) throw new HttpError(400, 'Choose a file to upload (form field "resume")');
  const saved = path.join(UPLOAD_DIR, req.file.filename);
  try {
    const job = await ownJob(req);
    if (!looksLikeAllowedFile(saved)) throw new HttpError(400, 'That file does not look like a real PDF or Word document');
    removeFile(job.resume?.storedName); // replace the old file
    job.resume = { originalName: path.basename(req.file.originalname).slice(0, 120), storedName: req.file.filename, size: req.file.size };
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    removeFile(req.file.filename); // do not leave orphan files behind
    throw err;
  }
};

export const downloadResume = async (req, res) => {
  const job = await ownJob(req);
  if (!job.resume) throw new HttpError(404, 'No resume attached');
  // download() sets Content-Disposition so the browser saves it with the original name
  res.download(path.join(UPLOAD_DIR, job.resume.storedName), job.resume.originalName);
};

export const deleteResume = async (req, res) => {
  const job = await ownJob(req);
  if (job.resume) {
    removeFile(job.resume.storedName);
    job.resume = undefined;
    await job.save();
  }
  res.status(204).end();
};
