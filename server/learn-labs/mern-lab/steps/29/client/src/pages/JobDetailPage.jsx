import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import StatusBadge from '../components/StatusBadge.jsx';

export default function JobDetailPage() {
  const { id } = useParams(); // the :id from the URL /jobs/:id
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    api(`/jobs/${id}`, { signal: controller.signal })
      .then(setJob)
      .catch((err) => err.name !== 'AbortError' && setError(err.status === 404 ? 'That job was not found.' : err.message));
    return () => controller.abort();
  }, [id]); // run again if the id in the URL changes

  if (error) return <p className="error" role="alert">{error} <Link to="/">Back to my jobs</Link></p>;
  if (!job) return <p className="muted">Loading…</p>;
  return (
    <article className="card">
      <h1>{job.role}</h1>
      <p>{job.company}{job.location ? ` · ${job.location}` : ''}</p>
      <StatusBadge status={job.status} />
      {job.notes && <p>{job.notes}</p>}
      <p><Link to="/">← Back to my jobs</Link></p>
    </article>
  );
}
