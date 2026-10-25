import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

// Lesson 31: the hook now also changes data on the server (create, update, delete).
export function useJobs() {
  const { ready, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      const page = await api('/jobs?limit=50', { signal });
      setJobs(page.items);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    if (!user) { setLoading(false); setError('Could not sign in. Is the server running, and did you run npm run seed?'); return undefined; }
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [ready, user, load]);

  // Create: wait for the server's answer (it adds the real id), then put the saved job at the top.
  const createJob = useCallback(async (values) => {
    const saved = await api('/jobs', { method: 'POST', body: values });
    setJobs((cur) => [saved, ...cur]);
    return saved;
  }, []);

  // Update with an "optimistic" screen: change it at once, and undo if the server says no.
  const changeStatus = useCallback(async (id, status) => {
    let before;
    setJobs((cur) => cur.map((j) => { if (j.id === id) before = j; return j.id === id ? { ...j, status } : j; }));
    try {
      await api(`/jobs/${id}`, { method: 'PUT', body: { status } });
    } catch (err) {
      setJobs((cur) => cur.map((j) => (j.id === id ? before : j)));
      setError(`Could not change the status: ${err.message}`);
    }
  }, []);

  const removeJob = useCallback(async (id) => {
    await api(`/jobs/${id}`, { method: 'DELETE' });
    setJobs((cur) => cur.filter((j) => j.id !== id));
  }, []);

  return { jobs, loading, error, setError, createJob, changeStatus, removeJob, reload: () => load() };
}
