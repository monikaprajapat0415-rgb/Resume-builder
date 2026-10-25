import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import JobForm from '../components/JobForm.jsx';
import { useJobs } from '../hooks/useJobs.js';

export default function JobsPage() {
  const { jobs, loading, error, createJob, changeStatus, removeJob } = useJobs();

  return (
    <>
      <h1>My jobs ({jobs.length})</h1>
      <JobForm onSubmit={createJob} />
      {loading && <p className="muted">Loading your jobs…</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!loading && !error && jobs.length === 0 && <p className="muted">No jobs yet. Add your first one above.</p>}
      {jobs.map((job) => (
        <div key={job.id}>
          <JobCard job={job} onStatusChange={changeStatus} />
          <p className="muted">
            <Link to={`/jobs/${job.id}`}>Open details</Link>{' · '}
            <button className="link-btn" onClick={() => { if (window.confirm(`Delete ${job.role} at ${job.company}?`)) removeJob(job.id); }}>Delete</button>
          </p>
        </div>
      ))}
    </>
  );
}
