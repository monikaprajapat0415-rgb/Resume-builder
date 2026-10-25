import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

// All the "load a list from the API" logic in one place, so a page only says what it wants to show.
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

  return { jobs, setJobs, loading, error, reload: () => load() };
}
