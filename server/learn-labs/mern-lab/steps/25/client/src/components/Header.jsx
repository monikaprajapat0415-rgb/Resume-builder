// A component is a function that returns JSX: HTML-like markup written inside JavaScript.
export default function Header() {
  const year = new Date().getFullYear(); // any JavaScript expression goes inside { }
  return (
    <header className="site-header">
      <strong>Job Tracker</strong>
      <span className="muted">Your search, in one place · {year}</span>
    </header>
  );
}
