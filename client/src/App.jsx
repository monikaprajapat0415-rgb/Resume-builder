import React, { use, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
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
import ResetPassword from "./pages/ResetPasswordPage";
import ForgotPassword from "./pages/ForgetPassword";
import ContactUs from "./pages/ContactUs";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import VerifyEmail from "./pages/VerifyEmail";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import TemplatesIndex from "./pages/TemplatesIndex";
import TemplateLanding from "./pages/TemplateLanding";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminBlogList from "./pages/admin/AdminBlogList";
import AdminBlogEditor from "./pages/admin/AdminBlogEditor";
import SEO from "./components/SEO";
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


  const siteStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Prime Resume AI",
      url: "https://primeresumeai.com",
      logo: "https://primeresumeai.com/logo.svg",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Prime Resume AI",
      url: "https://primeresumeai.com",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Create professional resumes in minutes with AI. Choose modern, ATS-friendly templates and download your CV instantly.",
    },
  ];

  return (
    <>
    <SEO
      title="Prime Resume AI - AI-Powered Resume Builder for Job Seekers"
      description="Create professional resumes in minutes with AI. Choose modern, ATS-friendly templates and download your CV instantly. Free resume builder for freshers and professionals. Stand out with Prime Resume AI!"
      structuredData={siteStructuredData}
    />
    <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/templates" element={<TemplatesIndex />} />
        <Route path="/templates/:slug" element={<TemplateLanding />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/blogs" replace />} />
          <Route path="blogs" element={<AdminBlogList />} />
          <Route path="blogs/new" element={<AdminBlogEditor />} />
          <Route path="blogs/:id/edit" element={<AdminBlogEditor />} />
        </Route>

        <Route path="app" element={<Layouts />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>
        <Route path="view/:resumeId" element={<Preview />} />

        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      </Routes>
    </>
  );
};

export default App;