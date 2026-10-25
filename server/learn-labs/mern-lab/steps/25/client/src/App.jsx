import Header from './components/Header.jsx';
import JobCard from './components/JobCard.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <h1>My jobs</h1>
        <JobCard />
        <JobCard />
      </main>
    </>
  );
}
