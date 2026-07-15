import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Login from './Login'
import SEO from '../components/SEO'

const Layouts = () => {

  const { user, loading } = useSelector(state => state.auth)

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      {
        user ? (
        <div className='min-h-screen bg-gray-50'>
          <Navbar />
          <Outlet />
        </div>)
          : (
            <>
              <SEO title="Login or Sign Up" description="Log in or create your free Prime Resume AI account to start building your resume." noindex />
              <Login />
            </>
          )
      }

    </div>

  )
}

export default Layouts