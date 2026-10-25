import { STATUSES } from './JobCard.jsx';

// Numbers from GET /api/jobs/stats. interviewRate is null until there is at least one application.
export default function StatsBar({ stats }) {
  if (!stats) return null;
  return (
    <section aria-label="Your numbers" className="stats">
      <div className="stat"><strong>{stats.total}</strong><span>total</span></div>
      {STATUSES.map((s) => <div className="stat" key={s}><strong>{stats.byStatus[s]}</strong><span>{s}</span></div>)}
      <div className="stat"><strong>{stats.interviewRate === null ? '–' : `${stats.interviewRate}%`}</strong><span>reached interview</span></div>
    </section>
  );
}
