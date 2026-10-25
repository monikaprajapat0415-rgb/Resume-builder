import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import JobForm from '../components/JobForm.jsx';
import { useJobs } from '../hooks/useJobs.js';

export default function JobsPage() {
  const { jobs, setJobs, loading, error } = useJobs();

  const changeStatus = (id, status) => setJobs((cur) => cur.map((j) => (j.id === id ? { ...j, status } : j)));
  const addJob = (values) => setJobs((cur) => [{ ...values, id: `local-${Date.now()}` }, ...cur]);

  return (
    <>
      <h1>My jobs ({jobs.length})</h1>
      <JobForm onSubmit={addJob} />
      {loading && <p className="muted">Loading your jobs…</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {jobs.map((job) => (
        <div key={job.id}>
          <JobCard job={job} onStatusChange={changeStatus} />
          <p className="muted"><Link to={`/jobs/${job.id}`}>Open details</Link></p>
        </div>
      ))}
    </>
  );
}
