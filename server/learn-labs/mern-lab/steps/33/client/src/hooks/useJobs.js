import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';

const EMPTY = { items: [], total: 0, page: 1, pages: 1 };

// Lesson 33: the list now follows the filters in the address bar (q, status, sort, page), and the stats come with it.
export function useJobs({ q = '', status = '', sort = 'newest', page = 1, limit = 8 } = {}) {
  const [data, setData] = useState(EMPTY);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0); // bump this number to load again

  // Build the query string once; the effect below re-runs only when it really changes.
  const query = new URLSearchParams({ ...(q && { q }), ...(status && { status }), sort, page: String(page), limit: String(limit) }).toString();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    Promise.all([api(`/jobs?${query}`, { signal: controller.signal }), api('/jobs/stats', { signal: controller.signal })])
      .then(([list, s]) => { setData(list); setStats(s); })
      .catch((err) => { if (err.name !== 'AbortError') setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  const createJob = useCallback(async (values) => {
    const saved = await api('/jobs', { method: 'POST', body: values });
    reload();
    return saved;
  }, [reload]);

  const changeStatus = useCallback(async (id, next) => {
    let before;
    setData((d) => ({ ...d, items: d.items.map((j) => { if (j.id === id) before = j; return j.id === id ? { ...j, status: next } : j; }) }));
    try {
      await api(`/jobs/${id}`, { method: 'PUT', body: { status: next } });
      reload(); // the counts and the active filter may have changed
    } catch (err) {
      setData((d) => ({ ...d, items: d.items.map((j) => (j.id === id ? before : j)) }));
      setError(`Could not change the status: ${err.message}`);
    }
  }, [reload]);

  const removeJob = useCallback(async (id) => {
    await api(`/jobs/${id}`, { method: 'DELETE' });
    reload();
  }, [reload]);

  return { ...data, stats, loading, error, createJob, changeStatus, removeJob, reload };
}
