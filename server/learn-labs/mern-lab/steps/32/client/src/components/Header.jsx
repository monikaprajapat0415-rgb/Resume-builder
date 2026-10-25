import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="site-header">
      <strong>Job Tracker</strong>
      <nav className="nav">
        {user ? (
          <NavLink to="/" end>My jobs</NavLink>
        ) : (
          <>
            <NavLink to="/login">Sign in</NavLink>
            <NavLink to="/register">Create account</NavLink>
          </>
        )}
      </nav>
      {user && (
        <span className="push muted">
          {user.name}{' · '}
          <button className="link-btn" onClick={() => { signOut(); navigate('/login'); }}>Sign out</button>
        </span>
      )}
    </header>
  );
}
