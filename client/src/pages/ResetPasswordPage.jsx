// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";
// import toast from 'react-hot-toast';


// const ResetPassword = () => {
//   const { token } = useParams();
//   const [password, setPassword] = useState("");

//   const handleReset = async (e) => {
//     e.preventDefault();
//     try {
//          await axios.post(`/api/users/reset-password/${token}`, { password });
//         toast.success("Password updated!");
//     } catch (error) {
//         toast.error("Error updating password");
//     }

//     toast.success("Password updated!");
//   };

//   return (
//     <div>
//       <h2>Reset Password</h2>
//       <input
//         type="password"
//         placeholder="New password"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleReset}>Reset</button>
//     </div>
//   );
// }   

// export default ResetPassword;

import { useState } from "react";
import toast from 'react-hot-toast';
// import { Mail } from 'lucide-react';
import { FaEnvelope } from 'react-icons/fa';
// import api from '../configs/api'
import { useParams } from "react-router-dom";
import axios from "axios";
const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

   const handleFResetPasswordSubmit = async (e) => {
           e.preventDefault();
    try {
         await axios.post(`/api/users/reset-password/${token}`, { password });
        toast.success("Password updated!");
    } catch (error) {
        toast.error("Error updating password");
    }

    toast.success("Password updated!");
    };
    //  const handleChange = (e) => {
    //     const { name, value } = e.target
    //     setFormData(prev => ({ ...prev, [name]: value }))
    // }

  return (
<div className='flex items-center justify-center min-h-screen bg-gray-50'>
       <form className="sm:w-[450px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">Reset Password</h1>
                <p className="text-gray-500 text-sm mt-2">Please enter your new password</p>
                <div className="flex items-center w-full mt-4 mb-2 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <FaEnvelope size={13} color='6B7280'/>
                    <input type="password" name="password" placeholder="New Password" className="border-none outline-none ring-0" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <button type="submit" onClick={handleFResetPasswordSubmit} className="mt-7 mb-11 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity">
                    Reset Password
                </button>
                {/* <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11">{state === "login" ? "Don't have an account?" : "Already have an account?"} <a href="#" className="text-green-500 hover:underline">click here</a></p> */}
            </form>
    </div>
  );
}

export default ResetPassword;
