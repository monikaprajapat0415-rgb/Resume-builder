import React from 'react'
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LuArrowLeft } from 'react-icons/lu'
import SEO from '../../components/SEO'
import Loader from '../../components/Loader'

const AdminLayout = () => {
  const { user, loading } = useSelector(state => state.auth)
  const location = useLocation()

  if (loading) return <Loader />
  // Not logged in at all - send to login, remembering nothing special since
  // /admin isn't linkable without an account anyway.
  if (!user) return <Navigate to='/app?state=login' replace />
  // Logged in but not an admin - quietly redirect rather than show a 403 page.
  if (user.role !== 'admin') return <Navigate to='/app' replace />

  return (
    <div className='min-h-screen bg-slate-50'>
      <SEO title="Admin" noindex />
      <div className='border-b border-slate-200 bg-white'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <span className='font-semibold text-slate-800'>Admin</span>
            <Link
              to='/admin/blogs'
              className={`text-sm transition ${location.pathname.startsWith('/admin/blogs') ? 'text-green-600 font-medium' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Blog Posts
            </Link>
          </div>
          <Link to='/app' className='inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition'>
            <LuArrowLeft className='size-4' /> Back to app
          </Link>
        </div>
      </div>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
