// import { Lock, Mail, MailIcon, User2Icon, Users2Icon } from 'lucide-react'
import { FaLock, FaEnvelope, FaUser } from 'react-icons/fa'
import api from '../configs/api'
import React from 'react'
import { useDispatch } from 'react-redux';
import { login } from '../app/features/authSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const dispatch = useDispatch();

    const queryParams = new URLSearchParams(window.location.search);
    const urlState = queryParams.get('state');

    const [state, setState] = useState(urlState || "login")

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [show, setShow] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post(`/api/users/${state}`, formData)
            dispatch(login(data))
            localStorage.setItem('token', data.token);
            toast.success(data.message)
            navigate('/'); // Navigate to dashboard upon success
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "An error occurred. Please try again.")
        }
    }

    const handleForgetPasswordSubmit = () => {
        navigate("/forgot-password");
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { data } = await api.post('/api/users/google-auth', {
                credential: credentialResponse.credential
            })
            dispatch(login(data))
            localStorage.setItem('token', data.token);
            toast.success(data.message)
            navigate('/'); // Navigate to dashboard upon success
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Google sign-in failed. Please try again.")
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <form onSubmit={handleSubmit} className="sm:w-[450px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white m-4">
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">{state === "login" ? "Login" : "Sign up"}</h1>
                <p className="text-gray-500 text-sm mt-2">Please {state === "login" ? "log" : "sign"} in to continue</p>

                <div className="flex justify-center mt-6">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => toast.error("Google sign-in failed. Please try again.")}
                        text={state === "login" ? "signin_with" : "signup_with"}
                        shape="pill"
                        width="300"
                    />
                </div>

                <div className="flex items-center gap-3 mt-6">
                    <div className="h-px flex-1 bg-gray-300/80" />
                    <span className="text-xs text-gray-400">or</span>
                    <div className="h-px flex-1 bg-gray-300/80" />
                </div>

                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-6 gap-2">
                        <FaUser size={16} className="text-gray-500 flex-shrink-0" />
                        <input type="text" name="name" placeholder="Name" className="w-full border-none outline-none ring-0 bg-transparent" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-6 gap-2">
                    <FaEnvelope size={13} className="text-gray-500 flex-shrink-0" />
                    <input type="email" name="email" placeholder="Email id" className="w-full border-none outline-none ring-0 bg-transparent" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="relative flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-6 gap-2 pr-10">
                    <FaLock size={13} className="text-gray-500 flex-shrink-0" />
                    <input type={show ? "text" : "password"} name="password" placeholder="Password" className="w-full border-none outline-none ring-0 bg-transparent" value={formData.password} onChange={handleChange} required />
                    <span
                        onClick={() => setShow(!show)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
                        {show ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <div className="mt-4 text-left text-green-500 pl-2">
                    <button onClick={handleForgetPasswordSubmit} className="text-sm font-medium hover:underline" type="button">Forget password?</button>
                </div>
                
                <button type="submit" className="mt-4 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity font-medium">
                    {state === "login" ? "Login" : "Sign up"}
                </button>
                
                <p className="text-gray-500 text-sm mt-4 mb-11">
                    {state === "login" ? "Don't have an account?" : "Already have an account?"}{' '}
                    <span 
                        onClick={() => setState(prev => prev === "login" ? "register" : "login")} 
                        className="text-green-500 hover:underline cursor-pointer font-medium"
                    >
                        click here
                    </span>
                </p>
            </form>
        </div>
    )
}

export default Login
