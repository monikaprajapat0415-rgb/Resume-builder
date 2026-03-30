import React, { use, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Preview from "./pages/Preview";
import ResumeBuilder from "./pages/ResumeBuilder";
import Layouts from "./pages/Layouts";

import { useDispatch } from "react-redux";
import api from "./configs/api";
import { login, setLoading } from "./app/features/authSlice";
import{Toaster} from 'react-hot-toast'
const App = () => {

  const dispatch = useDispatch();
  const getUserData = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', { headers: { Authorization: token } });
        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log("Error fetching user data:", error.messsage);
    }
  }

  useEffect(() => {
    getUserData();
  }, [])


  return (
    <>
    <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="app" element={<Layouts />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>
        <Route path="view/:resumeId" element={<Preview />} />

        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
};

export default App;