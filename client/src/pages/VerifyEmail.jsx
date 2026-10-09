import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../configs/api'
import SEO from '../components/SEO'
import { LuCircleCheck, LuCircleX, LuLoader } from 'react-icons/lu'

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await api.get(`/api/users/verify-email/${token}`);
        setStatus('success');
        setMessage(data.message || 'Email verified successfully.');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'This verification link is invalid or has expired.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4'>
      <SEO title="Verify Email" noindex />
      <div className='sm:w-[420px] w-full text-center border border-gray-300/60 rounded-2xl p-8 bg-white shadow-sm'>
        {status === 'verifying' && (
          <>
            <LuLoader className='mx-auto size-10 text-green-500 animate-spin mb-4' />
            <h1 className='text-xl font-medium text-gray-900'>Verifying your email...</h1>
          </>
        )}
        {status === 'success' && (
          <>
            <LuCircleCheck className='mx-auto size-10 text-green-500 mb-4' />
            <h1 className='text-xl font-medium text-gray-900'>Email verified!</h1>
            <p className='text-gray-500 text-sm mt-2'>{message}</p>
            <Link to='/app' className='inline-block mt-6 bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2 text-sm transition-colors'>
              Go to Dashboard
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <LuCircleX className='mx-auto size-10 text-red-500 mb-4' />
            <h1 className='text-xl font-medium text-gray-900'>Verification failed</h1>
            <p className='text-gray-500 text-sm mt-2'>{message}</p>
            <Link to='/app' className='inline-block mt-6 bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2 text-sm transition-colors'>
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
