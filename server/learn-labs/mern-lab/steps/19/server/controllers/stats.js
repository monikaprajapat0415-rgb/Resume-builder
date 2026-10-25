// Lesson 19: an aggregation pipeline groups documents and counts them inside the database.
import Job, { STATUSES } from '../models/Job.js';

export const jobStats = async (req, res) => {
  const rows = await Job.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Make sure every status appears, even with zero jobs, so the screen never has holes.
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  for (const r of rows) byStatus[r._id] = r.count;

  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  const applied = total - byStatus.saved;
  // Share of applications that reached an interview or better. Only meaningful once there are applications.
  const interviewRate = applied ? Math.round(((byStatus.interview + byStatus.offer) / applied) * 100) : null;

  res.json({ total, byStatus, interviewRate });
};
