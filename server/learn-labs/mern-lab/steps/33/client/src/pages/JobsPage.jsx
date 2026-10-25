import { Link, useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import JobForm from '../components/JobForm.jsx';
import StatsBar from '../components/StatsBar.jsx';
import Filters from '../components/Filters.jsx';
import Pagination from '../components/Pagination.jsx';
import { useJobs } from '../hooks/useJobs.js';

export default function JobsPage() {
  // The address bar is the state: ?q=&status=&sort=&page=
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const status = params.get('status') || '';
  const sort = params.get('sort') || 'newest';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const { items, total, pages, stats, loading, error, createJob, changeStatus, removeJob } = useJobs({ q, status, sort, page });

  // Change one filter, drop the page back to 1, and keep the others. `replace` avoids a history entry per keystroke.
  const setFilter = (change) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(change)) (v ? next.set(k, v) : next.delete(k));
    next.delete('page');
    setParams(next, { replace: true });
  };
  const setPage = (p) => { const next = new URLSearchParams(params); next.set('page', String(p)); setParams(next); };

  const filtered = Boolean(q || status);
  return (
    <>
      <h1>My jobs</h1>
      <StatsBar stats={stats} />
      <details className="card">
        <summary>Add a job</summary>
        <JobForm onSubmit={createJob} />
      </details>
      <Filters q={q} status={status} sort={sort} onChange={setFilter} />
      {error && <p className="error" role="alert">{error}</p>}
      <p className="muted" aria-live="polite">{loading ? 'Loading…' : `${total} ${total === 1 ? 'job' : 'jobs'}${filtered ? ' match' : ''}`}</p>
      {!loading && !error && items.length === 0 && (
        <p>{filtered ? 'No job matches these filters.' : 'No jobs yet. Open "Add a job" to start.'}</p>
      )}
      {items.map((job) => (
        <div key={job.id}>
          <JobCard job={job} onStatusChange={changeStatus} />
          <p className="muted">
            <Link to={`/jobs/${job.id}`}>Open details</Link>{' · '}
            <button className="link-btn danger" onClick={() => { if (window.confirm(`Delete ${job.role} at ${job.company}?`)) removeJob(job.id); }}>Delete</button>
          </p>
        </div>
      ))}
      <Pagination page={page} pages={pages} onPage={setPage} />
    </>
  );
}
