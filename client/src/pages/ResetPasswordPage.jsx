import { useState } from "react";
import toast from 'react-hot-toast';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate, useParams } from "react-router-dom";
import api from '../configs/api'
import SEO from '../components/SEO'

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters.");
    if (password !== confirm) return toast.error("The two passwords do not match.");
    setLoading(true);
    try {
      const { data } = await api.post(`/api/users/reset-password/${token}`, { password });
      toast.success(data?.message || "Password updated.");
      navigate("/app", { replace: true });
    } catch (error) {
      if (error.response?.status === 400 && /invalid or has expired/i.test(error.response?.data?.message || "")) setExpired(true);
      toast.error(error.response?.data?.message || "Could not update the password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4'>
      {/* noindex: this URL contains a one-time password reset token and must never be indexed */}
      <SEO title="Reset Password" noindex />
      <form onSubmit={handleSubmit} className="sm:w-[450px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Reset Password</h1>
        {expired ? (
          <div className="mt-6 mb-10">
            <p className="text-gray-700 text-sm">This reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="inline-block mt-4 text-sm text-brand-500 hover:underline">Get a new link</Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mt-2">Choose a new password (at least 8 characters).</p>
            <div className="relative flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <FaLock size={13} color='6B7280' />
              <input type={show ? "text" : "password"} name="password" placeholder="New password" autoComplete="new-password" minLength={8} maxLength={128} className="flex-1 min-w-0 h-full pr-10 bg-transparent border-none outline-none ring-0" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <span onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" aria-label={show ? "Hide password" : "Show password"}>{show ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
            <div className="flex items-center w-full mt-4 mb-2 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <FaLock size={13} color='6B7280' />
              <input type={show ? "text" : "password"} name="confirm" placeholder="Confirm new password" autoComplete="new-password" minLength={8} maxLength={128} className="flex-1 min-w-0 h-full pr-6 bg-transparent border-none outline-none ring-0" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="mt-5 mb-11 w-full h-11 rounded-full text-white bg-brand-500 hover:opacity-90 transition-opacity disabled:opacity-60">
              {loading ? "Saving..." : "Reset password"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default ResetPassword;
