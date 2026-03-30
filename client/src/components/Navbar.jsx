import React, { use } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { logout } from '../app/features/authSlice';
const Navbar = () => {
    const {user} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    
    const handleLogout = () => {
        // Implement logout logic here (e.g., clear user session, redirect to login page)
        console.log("User logged out");
        navigate('/'); // Redirect to home page after logout
       dispatch(logout());
    }
  return (
    <div className='shadow bg-white'>
        <nav className='flex items-center justify-between max-w-7xl mx-auto py-3.5 px-4 text-slate-800 transition-all'>
        <Link to="/">
        <img src={logo} alt="logo" className='h-11 w-auto' />
        </Link>
        <div className='flex items-center gap-4 text-sm'>
            <p className='max-sm:hidden'>Hi, {user?.name}</p>
            <button className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all' onClick={handleLogout}>
                Logout
            </button>
        </div>
        </nav>

    </div>
  )
}

export default Navbar