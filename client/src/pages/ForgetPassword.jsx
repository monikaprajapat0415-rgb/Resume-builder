import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';
import { FaEnvelope } from 'react-icons/fa';
import api from '../configs/api'
import SEO from '../components/SEO'

const ForgotPassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/users/forgot-password", { email: email.trim() });
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send the link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4'>
      <SEO title="Forgot Password" noindex />
      <form onSubmit={handleSubmit} className="sm:w-[450px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Forgot Password</h1>
        {sent ? (
          <div className="mt-6 mb-10">
            <p className="text-gray-700 text-sm">If an account exists for <strong>{email}</strong>, we have sent a reset link. It works for 15 minutes.</p>
            <p className="text-gray-500 text-xs mt-3">Not there? Check your spam folder, or try again in a few minutes.</p>
            <button type="button" onClick={() => setSent(false)} className="mt-4 text-sm text-brand-500 hover:underline">Use a different email</button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mt-2">Enter your email and we will send you a link to set a new password.</p>
            <div className="flex items-center w-full mt-4 mb-2 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <FaEnvelope size={13} color='6B7280' />
              <input type="email" name="email" placeholder="Email id" autoComplete="email" className="flex-1 min-w-0 h-full pr-6 bg-transparent border-none outline-none ring-0" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="mt-2 w-full h-11 rounded-full text-white bg-brand-500 hover:opacity-90 transition-opacity disabled:opacity-60">
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </>
        )}
        <p className="text-gray-500 text-sm mt-4 mb-10"><Link to="/app" className="text-brand-500 hover:underline">Back to login</Link></p>
      </form>
    </div>
  );
}

export default ForgotPassword;
