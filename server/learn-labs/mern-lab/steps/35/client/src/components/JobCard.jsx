import { memo } from 'react';
import StatusBadge from './StatusBadge.jsx';

export const STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected'];

// memo: skip drawing this card again when its props did not change. With 8 to 50 cards on the page,
// changing one job's status then redraws one card instead of all of them.
// (It works because `job` objects are replaced only when they change, and onStatusChange is a stable function.)
function JobCard({ job, onStatusChange }) {
  return (
    <article className="card">
      <h2>{job.role}</h2>
      <p>{job.company}{job.location ? ` · ${job.location}` : ''}</p>
      <StatusBadge status={job.status} />
      <div className="row">
        <label className="muted" htmlFor={`status-${job.id}`}>Move to</label>
        <select id={`status-${job.id}`} value={job.status} onChange={(e) => onStatusChange(job.id, e.target.value)}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </article>
  );
}

export default memo(JobCard);
