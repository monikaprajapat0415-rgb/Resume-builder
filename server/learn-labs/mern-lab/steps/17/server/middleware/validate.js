import mongoose from 'mongoose';
import { HttpError } from '../utils/HttpError.js';

// router.param('id', checkId): runs for every route that has :id and stops bad ids early.
export const checkId = (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) return next(new HttpError(404, 'Job not found'));
  next();
};

// Only copy the fields we allow. If a client sends { "user": "someone else", "isAdmin": true }, they are ignored.
const JOB_FIELDS = ['company', 'role', 'location', 'status', 'salaryNote', 'notes', 'appliedOn'];
export const pickJobFields = (body = {}) =>
  Object.fromEntries(JOB_FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]));
