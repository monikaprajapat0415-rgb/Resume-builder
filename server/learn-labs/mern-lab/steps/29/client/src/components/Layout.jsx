import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';

// Every page is drawn inside <Outlet />, under the same header.
export default function Layout() {
  return (
    <>
      <Header />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
