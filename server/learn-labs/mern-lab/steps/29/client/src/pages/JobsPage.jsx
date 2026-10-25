import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import JobForm from '../components/JobForm.jsx';
import { api, setToken } from '../api.js';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        // TEMPORARY sign-in as the demo user (see lesson 28). Lesson 30 moves it into a context; lesson 32 removes it.
        const login = await api('/auth/login', { method: 'POST', body: { email: 'demo@example.com', password: 'Demo12345' }, signal: controller.signal });
        setToken(login.token);
        const page = await api('/jobs?limit=50', { signal: controller.signal });
        setJobs(page.items);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const changeStatus = (id, status) => setJobs((cur) => cur.map((j) => (j.id === id ? { ...j, status } : j)));
  const addJob = (values) => setJobs((cur) => [{ ...values, id: `local-${Date.now()}` }, ...cur]);

  return (
    <>
      <h1>My jobs ({jobs.length})</h1>
      <JobForm onSubmit={addJob} />
      {loading && <p className="muted">Loading your jobs…</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {jobs.map((job) => (
        <div key={job.id}>
          <JobCard job={job} onStatusChange={changeStatus} />
          <p className="muted"><Link to={`/jobs/${job.id}`}>Open details</Link></p>
        </div>
      ))}
    </>
  );
}
