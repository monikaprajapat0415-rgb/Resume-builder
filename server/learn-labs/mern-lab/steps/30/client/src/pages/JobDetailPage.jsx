import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function JobDetailPage() {
  const { id } = useParams();
  const { ready } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return undefined; // wait until the temporary sign-in has finished
    const controller = new AbortController();
    api(`/jobs/${id}`, { signal: controller.signal })
      .then(setJob)
      .catch((err) => err.name !== 'AbortError' && setError(err.status === 404 ? 'That job was not found.' : err.message));
    return () => controller.abort();
  }, [id, ready]);

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
