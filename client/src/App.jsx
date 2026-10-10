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
import LearnIndex from "./pages/LearnIndex";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import AdminJobs from "./pages/admin/AdminJobs";
import LearnCourse from "./pages/LearnCourse";
import LearnLesson from "./pages/LearnLesson";
import TemplatesIndex from "./pages/TemplatesIndex";
import TemplateLanding from "./pages/TemplateLanding";
import AdminSeo from './pages/admin/AdminSeo'
import AdminLayout from "./pages/admin/AdminLayout";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminBlogList from "./pages/admin/AdminBlogList";
import AdminBlogEditor from "./pages/admin/AdminBlogEditor";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCourseEditor from "./pages/admin/AdminCourseEditor";
import AdminCourseLessons from "./pages/admin/AdminCourseLessons";
import AdminLessonEditor from "./pages/admin/AdminLessonEditor";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProductList from "./pages/admin/AdminProductList";
import AdminProductEditor from "./pages/admin/AdminProductEditor";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMenus from "./pages/admin/AdminMenus";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminPages from "./pages/admin/AdminPages";
import AdminPageEditor from "./pages/admin/AdminPageEditor";
import AdminSiteContent from "./pages/admin/AdminSiteContent";
import CustomPage from "./pages/CustomPage";
import Features from "./pages/Features";
import AtsChecker from "./pages/AtsChecker";
import ProductsIndex from "./pages/ProductsIndex";
import ProductDetail from "./pages/ProductDetail";
import SEO from "./components/SEO";
import AdminAppearance from "./pages/admin/AdminAppearance";
import { useSiteContent, DEFAULT_SITE } from "./utils/siteContent";
import { applyTheme } from "./utils/theme";
const App = () => {
  // Apply the admin's chosen theme colour once the site settings arrive. Until then the
  // colour saved in this browser by the previous visit is already applied (see index.html).
  const site = useSiteContent();
  useEffect(() => { if (site !== DEFAULT_SITE) applyTheme(site.theme_primary) }, [site]);

  const dispatch = useDispatch();
  const getUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(setLoading(false));
      return;
    }
    try {
      // The timeout matters: if the API is down or hanging, the app must still reach
      // the login page instead of showing the loading spinner forever.
      const { data } = await api.get('/api/users/data', { headers: { Authorization: token }, timeout: 8000 });
      if (data.user) {
        dispatch(login({ token, user: data.user }));
      }
    } catch (error) {
      // 401/403/404 = the saved token is expired or belongs to a deleted user: drop it.
      // Network errors and timeouts keep the token so a brief outage doesn't log people out.
      if ([401, 403, 404].includes(error.response?.status)) {
        localStorage.removeItem('token');
      }
      console.log("Error fetching user data:", error.message);
    } finally {
      dispatch(setLoading(false));
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
        <Route path="/blog/category/:slug" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:slug" element={<JobDetail />} />
        <Route path="/learn" element={<LearnIndex />} />
        <Route path="/learn/:course" element={<LearnCourse />} />
        <Route path="/learn/:course/:lesson" element={<LearnLesson />} />
        <Route path="/features" element={<Features />} />
        <Route path="/features/ats-checker" element={<AtsChecker />} />
        <Route path="/products" element={<ProductsIndex />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/templates" element={<TemplatesIndex />} />
        <Route path="/templates/:slug" element={<TemplateLanding />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="products/new" element={<AdminProductEditor />} />
          <Route path="products/:id/edit" element={<AdminProductEditor />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="menus" element={<AdminMenus />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="pages/new" element={<AdminPageEditor />} />
          <Route path="pages/:id/edit" element={<AdminPageEditor />} />
          <Route path="site-content" element={<AdminSiteContent />} />
          <Route path="appearance" element={<AdminAppearance />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="seo" element={<AdminSeo />} />
          <Route path="blogs" element={<AdminBlogList />} />
          <Route path="blogs/new" element={<AdminBlogEditor />} />
          <Route path="blogs/:id/edit" element={<AdminBlogEditor />} />
          <Route path="learn" element={<AdminCourses />} />
          <Route path="learn/new" element={<AdminCourseEditor />} />
          <Route path="learn/:id/edit" element={<AdminCourseEditor />} />
          <Route path="learn/:id/lessons/new" element={<AdminLessonEditor />} />
          <Route path="learn/lessons/:lessonId/edit" element={<AdminLessonEditor />} />
          <Route path="learn/:id" element={<AdminCourseLessons />} />
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
        <Route path="/p/:slug" element={<CustomPage />} />

      </Routes>
    </>
  );
};

export default App;