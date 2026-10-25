import { STATUSES } from './JobCard.jsx';

// The filters live in the URL (/?status=applied&q=bank), so a page can be bookmarked, shared and reloaded.
export default function Filters({ q, status, sort, onChange }) {
  return (
    <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor="q">Search</label>
        <input id="q" type="search" placeholder="Company, role or place" value={q} onChange={(e) => onChange({ q: e.target.value })} />
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
