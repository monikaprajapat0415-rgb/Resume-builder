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


        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "An error occurred. Please try again.")
            //  console.log("Error logging in:", error.message);
        }

    }

    const handleForgetPasswordSubmit = async () => {
        navigate("/forgot-password");

    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <form onSubmit={handleSubmit} className="sm:w-[450px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">{state === "login" ? "Login" : "Sign up"}</h1>
                <p className="text-gray-500 text-sm mt-2">Please {state} in to continue</p>
                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <FaUser size={16} color='6B7280' />
                        <input type="text" name="name" placeholder="Name" className="border-none outline-none ring-0" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <FaEnvelope size={13} color='6B7280' />
                    <input type="email" name="email" placeholder="Email id" className="border-none outline-none ring-0" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="relative flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <FaLock size={13} color='6B7280' />
                    <input type={show ? "text" : "password"} name="password" placeholder="Password" className="border-none outline-none ring-0" value={formData.password} onChange={handleChange} required />
                    <span
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        {show ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                {/* <div className="mt-4 text-left text-green-500">
                    <button onClick={handleForgetPasswordSubmit} className="text-sm" type="reset">Forget password?</button>
                </div> */}
                <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity">
                    {state === "login" ? "Login" : "Sign up"}
                </button>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11">{state === "login" ? "Don't have an account?" : "Already have an account?"} <a href="#" className="text-green-500 hover:underline">click here</a></p>
            </form>
        </div>
    )
}

export default Login