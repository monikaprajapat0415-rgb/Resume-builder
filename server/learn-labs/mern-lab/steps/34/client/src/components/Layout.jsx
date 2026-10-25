import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';

export default function Layout() {
  const main = useRef(null);
  const { pathname } = useLocation();

  // After a page change, move keyboard and screen reader focus to the new content (a single-page app does not reload).
  useEffect(() => { main.current?.focus({ preventScroll: true }); }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1} ref={main} className="container">
        <Outlet />
      </main>
    </>
  );
}
