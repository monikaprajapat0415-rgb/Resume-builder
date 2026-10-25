import { useState } from 'react';
import { api, downloadFile } from '../api.js';

const MAX = 2 * 1024 * 1024;

// Attach, download or remove the resume you sent for one job.
export default function ResumeFile({ job, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function pick(e) {
    const file = e.target.files[0];
    e.target.value = ''; // so choosing the same file again still fires onChange
    if (!file) return;
    if (file.size > MAX) { setError('That file is larger than 2 MB.'); return; } // check early to save the upload
    setBusy(true);
    setError('');
    try {
      const body = new FormData();
      body.append('resume', file); // the field name must match upload.single('resume') on the server
      onChange(await api(`/jobs/${job.id}/resume`, { method: 'POST', body }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await api(`/jobs/${job.id}/resume`, { method: 'DELETE' });
      onChange({ ...job, resume: undefined });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card" aria-labelledby="resume-heading">
      <h2 id="resume-heading">Resume you sent</h2>
      {job.resume ? (
        <p>
          <button className="link-btn" onClick={() => downloadFile(`/jobs/${job.id}/resume`, job.resume.name).catch((e) => setError(e.message))}>{job.resume.name}</button>
          {' '}<span className="muted">({Math.max(1, Math.round(job.resume.size / 1024))} KB)</span>{' · '}
          <button className="link-btn danger" onClick={remove} disabled={busy}>Remove</button>
        </p>
      ) : <p className="muted">Nothing attached yet.</p>}
      <div className="field">
        <label htmlFor="resume-file">{job.resume ? 'Replace with another file' : 'Attach a PDF or Word file (2 MB at most)'}</label>
        <input id="resume-file" type="file" accept=".pdf,.doc,.docx" onChange={pick} disabled={busy} />
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  );
}
