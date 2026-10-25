import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <>
      <h1>Page not found</h1>
      <p>That address does not exist. <Link to="/">Go to my jobs</Link>.</p>
    </>
  );
}
