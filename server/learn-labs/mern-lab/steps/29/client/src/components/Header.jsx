import { NavLink } from 'react-router-dom';

// NavLink is a link that does not reload the page, and gets the class "active" on the current page.
export default function Header() {
  return (
    <header className="site-header">
      <strong>Job Tracker</strong>
      <nav className="nav">
        <NavLink to="/" end>My jobs</NavLink>
      </nav>
    </header>
  );
}
