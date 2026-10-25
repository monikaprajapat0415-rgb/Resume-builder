import { useState } from 'react';
import Header from './components/Header.jsx';
import JobCard from './components/JobCard.jsx';
import JobForm from './components/JobForm.jsx';

const SAMPLE = [
  { id: 1, company: 'Northwind Bank', role: 'Teller', location: 'Leeds', status: 'applied' },
  { id: 2, company: 'Acme Logistics', role: 'Dispatcher', location: 'Pune', status: 'interview' },
];

export default function App() {
  const [jobs, setJobs] = useState(SAMPLE);

  const changeStatus = (id, status) => setJobs((cur) => cur.map((j) => (j.id === id ? { ...j, status } : j)));
  // The form hands us the values; we add a job with a made-up id. Lesson 31 saves it on the server instead.
  const addJob = (values) => setJobs((cur) => [{ ...values, id: Date.now() }, ...cur]);

  return (
    <>
      <Header />
      <main className="container">
        <h1>My jobs ({jobs.length})</h1>
        <JobForm onSubmit={addJob} />
        {jobs.length === 0 && <p className="muted">No jobs yet. Add your first one above.</p>}
        {/* A list needs a stable key so React can tell the items apart when the list changes. */}
        {jobs.map((job) => <JobCard key={job.id} job={job} onStatusChange={changeStatus} />)}
      </main>
    </>
  );
}
