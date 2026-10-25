import { HttpError } from '../utils/HttpError.js';

export const STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected'];

const text = (v) => (typeof v === 'string' ? v.trim() : '');

// Check and clean the body of a job. `partial` is true for updates, where every field is optional.
export function cleanJob(body = {}, { partial = false } = {}) {
  const problems = {};
  const out = {};

  for (const field of ['company', 'role']) {
    if (body[field] === undefined && partial) continue;
    const v = text(body[field]);
    if (!v) problems[field] = `${field} is required`;
    else if (v.length > 120) problems[field] = `${field} must be 120 characters or fewer`;
    else out[field] = v;
  }
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) problems.status = `status must be one of: ${STATUSES.join(', ')}`;
    else out.status = body.status;
  } else if (!partial) out.status = 'saved';

  if (Object.keys(problems).length) throw new HttpError(400, 'Please fix the highlighted fields', problems);
  return out;
}
