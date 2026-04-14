import { useState } from "react";
import toast from 'react-hot-toast';
// import { Lock, Mailbox } from 'lucide-react';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import api from '../configs/api'

const ForgotPassword = () => {
  const [userEmail, setEmail] = useState({
    email: ''
  });
//  const [formData, setFormData] = React.useState({
//         name: '',
//         email: '',
//         password: ''
//     })

    // const navigate = useNavigate();
   const handleForgetPasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/users/forgot-password", userEmail);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "An error occurred. Please try again.");
        }
        toast.success("Password reset link sent to your email!");
    };

    //  const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     try {
    //         const {data} = await api.post(`/api/users/${state}`, formData)
    //         dispatch(login(data))
    //         localStorage.setItem('token', data.token);
    //         toast.success(data.message)

            
    //     } catch (error) {
    //         toast.error(error.response?.data?.message || error.message || "An error occurred. Please try again.")
    //       //  console.log("Error logging in:", error.message);
    //     }

    // }
     const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

  return (
    // <div>
    //   <h2>Forgot Password</h2>
    //   <input
    //     type="email"
    //     placeholder="Enter email"
    //     onChange={(e) => setEmail(e.target.value)}
    //   />
    //   <button onClick={handleForgetPasswordSubmit}>Send Link</button>
    // </div>

    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
       <form className="sm:w-[450px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">Forgot Password</h1>
                <p className="text-gray-500 text-sm mt-2">Please enter your email to continue</p>
                <div className="flex items-center w-full mt-4 mb-2 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <FaEnvelope size={13} color='6B7280'/>
                    <input type="email" name="email" placeholder="Email id" className="border-none outline-none ring-0" value={userEmail.email}  onChange={(e) => setEmail({ ...userEmail, email: e.target.value })}required />
                </div>

                <button type="submit" onClick={handleForgetPasswordSubmit} className="mt-2 mb-11 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity">
                    Send Link
                </button>
                {/* <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11">{state === "login" ? "Don't have an account?" : "Already have an account?"} <a href="#" className="text-green-500 hover:underline">click here</a></p> */}
            </form>
    </div>
  );
}

export default ForgotPassword;