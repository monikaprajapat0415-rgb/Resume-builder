import { useState } from 'react';
import Header from './components/Header.jsx';
import JobCard from './components/JobCard.jsx';

const SAMPLE = [
  { id: 1, company: 'Northwind Bank', role: 'Teller', location: 'Leeds', status: 'applied' },
  { id: 2, company: 'Acme Logistics', role: 'Dispatcher', location: 'Pune', status: 'interview' },
];

export default function App() {
  // State is data that changes over time. When you call setJobs, React draws the screen again.
  const [jobs, setJobs] = useState(SAMPLE);

  function changeStatus(id, status) {
    // Never change state in place. Make a new array with a new object for the one job that changed.
    setJobs((current) => current.map((j) => (j.id === id ? { ...j, status } : j)));
  }

  return (
    <>
      <Header />
      <main className="container">
        <h1>My jobs ({jobs.length})</h1>
        {jobs.map((job) => <JobCard key={job.id} job={job} onStatusChange={changeStatus} />)}
      </main>
    </>
  );
}
