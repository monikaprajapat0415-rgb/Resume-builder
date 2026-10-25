import { useEffect, useState } from 'react';
import { STATUSES } from './JobCard.jsx';
import { useDebounce } from '../hooks/useDebounce.js';

export default function Filters({ q, status, sort, onChange }) {
  // The box shows what the person types at once; the URL (and the server request) follow 350 ms after they stop.
  const [text, setText] = useState(q);
  const debounced = useDebounce(text, 350);

  useEffect(() => { if (debounced !== q) onChange({ q: debounced }); }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (q !== debounced) setText(q); }, [q]); // eslint-disable-line react-hooks/exhaustive-deps -- back button or "clear"

  return (
    <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor="q">Search</label>
        <input id="q" type="search" placeholder="Company, role or place" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="filter-status">Status</label>
        <select id="filter-status" value={status} onChange={(e) => onChange({ status: e.target.value })}>
          <option value="">All</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={sort} onChange={(e) => onChange({ sort: e.target.value })}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="company">Company A to Z</option>
        </select>
      </div>
    </form>
  );
}
