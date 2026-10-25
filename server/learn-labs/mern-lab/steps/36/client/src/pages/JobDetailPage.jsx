import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import JobForm from '../components/JobForm.jsx';
import ResumeFile from '../components/ResumeFile.jsx';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ready } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;
    const controller = new AbortController();
    api(`/jobs/${id}`, { signal: controller.signal })
      .then(setJob)
      .catch((err) => err.name !== 'AbortError' && setError(err.status === 404 ? 'That job was not found.' : err.message));
    return () => controller.abort();
  }, [id, ready]);

  async function save(values) {
    const updated = await api(`/jobs/${id}`, { method: 'PUT', body: values });
    setJob(updated);
    setSaved(true);
  }

  async function remove() {
    if (!window.confirm('Delete this job?')) return;
    await api(`/jobs/${id}`, { method: 'DELETE' });
    navigate('/'); // go back to the list
  }

  if (error) return <p className="error" role="alert">{error} <Link to="/">Back to my jobs</Link></p>;
  if (!job) return <p className="muted">Loading…</p>;
  return (
    <>
      <h1>{job.role} at {job.company}</h1>
      {/* key={job.updatedAt} makes React build a fresh form when the saved job changes */}
      <JobForm key={job.updatedAt} initial={job} onSubmit={save} submitLabel="Save changes" resetAfter={false} />
      {saved && <p role="status" className="ok">Saved.</p>}
      <ResumeFile job={job} onChange={setJob} />
      <p className="muted">
        <Link to="/">← Back to my jobs</Link>{' · '}
        <button className="link-btn danger" onClick={remove}>Delete this job</button>
      </p>
    </>
  );
}
