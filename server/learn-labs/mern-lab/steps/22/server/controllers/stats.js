import Job, { STATUSES } from '../models/Job.js';

export const jobStats = async (req, res) => {
  const rows = await Job.aggregate([
    { $match: { user: req.user._id } }, // aggregate does not cast ids for you, so we pass the ObjectId itself
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  for (const r of rows) byStatus[r._id] = r.count;

  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  const applied = total - byStatus.saved;
  const interviewRate = applied ? Math.round(((byStatus.interview + byStatus.offer) / applied) * 100) : null;

  res.json({ total, byStatus, interviewRate });
};
