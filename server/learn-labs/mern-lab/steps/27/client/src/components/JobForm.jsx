import { useState } from 'react';
import { STATUSES } from './JobCard.jsx';

const EMPTY = { company: '', role: '', location: '', status: 'saved' };

// A controlled form: every input's value comes from state, and every change goes back into state.
export default function JobForm({ onSubmit, initial = EMPTY, submitLabel = 'Add job' }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const change = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  function submit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    const found = {};
    if (!values.company.trim()) found.company = 'Company is required';
    if (!values.role.trim()) found.role = 'Role is required';
    setErrors(found);
    if (Object.keys(found).length) return;
    onSubmit(values);
    setValues(EMPTY);
  }

  return (
    <form className="card form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" value={values.company} onChange={change} aria-invalid={Boolean(errors.company)} />
        {errors.company && <p className="error">{errors.company}</p>}
      </div>
      <div className="field">
        <label htmlFor="role">Role</label>
        <input id="role" name="role" value={values.role} onChange={change} aria-invalid={Boolean(errors.role)} />
        {errors.role && <p className="error">{errors.role}</p>}
      </div>
      <div className="field">
        <label htmlFor="location">Location</label>
        <input id="location" name="location" value={values.location} onChange={change} />
      </div>
      <div className="field">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={values.status} onChange={change}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <button className="btn" type="submit">{submitLabel}</button>
    </form>
  );
}
