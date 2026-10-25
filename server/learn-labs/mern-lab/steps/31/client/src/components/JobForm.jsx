import { useState } from 'react';
import { STATUSES } from './JobCard.jsx';

const EMPTY = { company: '', role: '', location: '', status: 'saved', salaryNote: '', notes: '' };

// Used for adding AND for editing: `initial` fills the fields, `onSubmit` returns a promise.
export default function JobForm({ onSubmit, initial = EMPTY, submitLabel = 'Add job', resetAfter = true }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const change = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const found = {};
    if (!values.company.trim()) found.company = 'Company is required';
    if (!values.role.trim()) found.role = 'Role is required';
    setErrors(found);
    setMessage('');
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      await onSubmit(values);
      if (resetAfter) setValues(EMPTY);
    } catch (err) {
      setErrors(err.details || {});          // field errors the server found
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
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
      <div className="field">
        <label htmlFor="salaryNote">Pay (as advertised)</label>
        <input id="salaryNote" name="salaryNote" value={values.salaryNote} onChange={change} />
      </div>
      <div className="field wide">
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" rows="3" value={values.notes} onChange={change} />
      </div>
      <div className="wide">
        <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving…' : submitLabel}</button>
        {message && <p className="error" role="alert">{message}</p>}
      </div>
    </form>
  );
}
