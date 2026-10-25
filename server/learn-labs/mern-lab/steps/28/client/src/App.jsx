import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import JobCard from './components/JobCard.jsx';
import JobForm from './components/JobForm.jsx';
import { api, setToken } from './api.js';

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect runs AFTER the screen is drawn. The [] means "only once, when the component first appears".
  useEffect(() => {
    const controller = new AbortController(); // lets us cancel the request if the component goes away
    async function load() {
      try {
        // TEMPORARY: sign in as the demo user from `npm run seed` so we have a token.
        // Lesson 32 replaces this with a real sign-in page.
        const login = await api('/auth/login', { method: 'POST', body: { email: 'demo@example.com', password: 'Demo12345' }, signal: controller.signal });
        setToken(login.token);
        const page = await api('/jobs?limit=50', { signal: controller.signal });
        setJobs(page.items);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort(); // cleanup function: runs when the component is removed
  }, []);

  const changeStatus = (id, status) => setJobs((cur) => cur.map((j) => (j.id === id ? { ...j, status } : j)));
  // The form still only changes the screen here. Lesson 31 saves jobs on the server.
  const addJob = (values) => setJobs((cur) => [{ ...values, id: `local-${Date.now()}` }, ...cur]);

  return (
    <>
      <Header />
      <main className="container">
        <h1>My jobs ({jobs.length})</h1>
        <JobForm onSubmit={addJob} />
        {loading && <p className="muted">Loading your jobs…</p>}
        {error && <p className="error" role="alert">{error} (is the server running, and did you run npm run seed?)</p>}
        {!loading && !error && jobs.length === 0 && <p className="muted">No jobs yet. Add your first one above.</p>}
        {jobs.map((job) => <JobCard key={job.id} job={job} onStatusChange={changeStatus} />)}
      </main>
    </>
  );
}
