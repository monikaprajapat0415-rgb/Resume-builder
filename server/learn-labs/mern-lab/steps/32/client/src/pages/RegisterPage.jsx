import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;
  const change = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');
    try {
      await register(values.name, values.email, values.password);
      navigate('/', { replace: true });
    } catch (err) {
      setErrors(err.details || {});
      setMessage(err.message);
      setBusy(false);
    }
  }

  return (
    <form className="card form narrow" onSubmit={submit} noValidate>
      <h1 className="wide">Create your account</h1>
      {[
        ['name', 'Name', 'text', 'name'],
        ['email', 'Email', 'email', 'email'],
        ['password', 'Password (8 or more characters)', 'password', 'new-password'],
      ].map(([key, label, type, auto]) => (
        <div className="field wide" key={key}>
          <label htmlFor={key}>{label}</label>
          <input id={key} name={key} type={type} autoComplete={auto} value={values[key]} onChange={change} aria-invalid={Boolean(errors[key])} />
          {errors[key] && <p className="error">{errors[key]}</p>}
        </div>
      ))}
      <div className="wide">
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        {message && <p className="error" role="alert">{message}</p>}
      </div>
      <p className="wide muted">Already have an account? <Link to="/login">Sign in</Link></p>
    </form>
  );
}
