import StatusBadge from './StatusBadge.jsx';

export const STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected'];

// `job` and `onStatusChange` are props. The card does not own the data; it only shows it and reports clicks.
export default function JobCard({ job, onStatusChange }) {
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
