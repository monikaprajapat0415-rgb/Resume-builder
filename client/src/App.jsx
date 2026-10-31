import { StandalonePageNav } from './components/PageNav';
import React, { use, useEffect, lazy, Suspense } from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import Home from "./pages/Home";
import Analytics from "./components/Analytics";
const Dashboard = lazy(() => import("./pages/Dashboard"));
// import Login from "./pages/Login";
const Logout = lazy(() => import("./pages/Logout"));
const Preview = lazy(() => import("./pages/Preview"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const Layouts = lazy(() => import("./pages/Layouts"));
import { useDispatch } from "react-redux";
import api from "./configs/api";
import { login, setLoading } from "./app/features/authSlice";
import{Toaster} from 'react-hot-toast'
const ResetPassword = lazy(() => import("./pages/ResetPasswordPage"));
const ForgotPassword = lazy(() => import("./pages/ForgetPassword"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const AdminRoadmaps = lazy(() => import("./pages/admin/AdminRoadmaps"));
const AdminRoadmapEditor = lazy(() => import("./pages/admin/AdminRoadmapEditor"));
const InterviewQuestions = lazy(() => import("./pages/community/InterviewQuestions"));
const InterviewQuestionView = lazy(() => import("./pages/community/InterviewQuestionView"));
const Salaries = lazy(() => import("./pages/community/Salaries"));
const SalaryRole = lazy(() => import("./pages/community/SalaryRole"));
const CompanyReviews = lazy(() => import("./pages/community/CompanyReviews"));
const CompanyView = lazy(() => import("./pages/community/CompanyView"));
const AdminCommunity = lazy(() => import("./pages/admin/AdminCommunity"));
const AdminInbox = lazy(() => import("./pages/admin/AdminInbox"));
const RoadmapIndex = lazy(() => import("./pages/RoadmapIndex"));
const RoadmapView = lazy(() => import("./pages/RoadmapView"));
const LearnIndex = lazy(() => import("./pages/LearnIndex"));
const Jobs = lazy(() => import("./pages/Jobs"));
const HireLanding = lazy(() => import("./pages/HireLanding"));
const OpenToWork = lazy(() => import("./pages/OpenToWork"));
const Hire = lazy(() => import("./pages/Hire"));
const AdminHiring = lazy(() => import("./pages/admin/AdminHiring"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const AdminJobs = lazy(() => import("./pages/admin/AdminJobs"));
const LearnCourse = lazy(() => import("./pages/LearnCourse"));
const LearnLesson = lazy(() => import("./pages/LearnLesson"));
const LearnCertificate = lazy(() => import('./pages/LearnCertificate'));
const TemplatesIndex = lazy(() => import("./pages/TemplatesIndex"));
const ExamplesIndex = lazy(() => import('./pages/ExamplesIndex'));
const ExampleDetail = lazy(() => import('./pages/ExampleDetail'));
const TemplateLanding = lazy(() => import("./pages/TemplateLanding"));
const AdminSeo = lazy(() => import('./pages/admin/AdminSeo'));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminFeedback = lazy(() => import("./pages/admin/AdminFeedback"));
const AdminBlogList = lazy(() => import("./pages/admin/AdminBlogList"));
const AdminBlogEditor = lazy(() => import("./pages/admin/AdminBlogEditor"));
const AdminCourses = lazy(() => import("./pages/admin/AdminCourses"));
const AdminCourseEditor = lazy(() => import("./pages/admin/AdminCourseEditor"));
const AdminCourseLessons = lazy(() => import("./pages/admin/AdminCourseLessons"));
const AdminLessonEditor = lazy(() => import("./pages/admin/AdminLessonEditor"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminProductList = lazy(() => import("./pages/admin/AdminProductList"));
const AdminProductEditor = lazy(() => import("./pages/admin/AdminProductEditor"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminMenus = lazy(() => import("./pages/admin/AdminMenus"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages"));
const AdminPageEditor = lazy(() => import("./pages/admin/AdminPageEditor"));
const AdminSiteContent = lazy(() => import("./pages/admin/AdminSiteContent"));
const AdminTrust = lazy(() => import("./pages/admin/AdminTrust"));
const AdminTools = lazy(() => import("./pages/admin/AdminTools"));
const AdminPlan = lazy(() => import("./pages/admin/AdminPlan"));
const Pricing = lazy(() => import("./pages/Pricing"));
const CustomPage = lazy(() => import("./pages/CustomPage"));
const Features = lazy(() => import("./pages/Features"));
const AtsChecker = lazy(() => import("./pages/AtsChecker"));
const CvLanding = lazy(() => import("./pages/CvLanding"));
const JdMatcher = lazy(() => import("./pages/JdMatcher"));
const CvBuilder = lazy(() => import("./pages/CvBuilder"));
const ImageEnhancer = lazy(() => import("./pages/ImageEnhancer"));
const ImageConverter = lazy(() => import("./pages/ImageConverter"));
const CareerTool = lazy(() => import("./pages/tools/CareerTool"));
import CAREER_TOOLS from "./content/careerTools.json";
// The career tools used to live at /tools/<name>; old links go to /products/<name>.
const OldToolRedirect = () => { const { slug } = useParams(); return <Navigate to={CAREER_TOOLS.tools.some((t) => t.slug === slug) ? `/products/${slug}` : '/products'} replace /> };
const ProductsIndex = lazy(() => import("./pages/ProductsIndex"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
import SEO from "./components/SEO";
import { Helmet } from "react-helmet-async";
const AdminAppearance = lazy(() => import("./pages/admin/AdminAppearance"));
import { useSiteContent, DEFAULT_SITE } from "./utils/siteContent";
import { applyTheme } from "./utils/theme";
// Pages load on demand so the first visit downloads only what it needs. While a page's code loads, the server-rendered
// text that was already in the page (if any) stays visible, so there is no blank flash and search/AI crawlers are unaffected.
const RouteFallback = () => (window.__ssrHtml && !window.__appReady
  ? <div data-ssr-keep dangerouslySetInnerHTML={{ __html: window.__ssrHtml }} />
  : <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Loading"><span className="size-8 rounded-full border-2 border-slate-300 border-t-brand-500 animate-spin" /></div>);
const ReadyMark = () => { useEffect(() => { window.__appReady = true }, []); return null };

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
      description="Create professional resumes in minutes with AI. Choose ATS-friendly templates and download your CV. Free resume builder for freshers and professionals."
    />
    {/* site-wide structured data stays on every page even though a page's own <SEO /> replaces the fallback tags */}
    <Helmet>
      {siteStructuredData.map((d, i) => <script key={i} type="application/ld+json">{JSON.stringify(d)}</script>)}
    </Helmet>
    <Toaster />
    <Analytics />
      <StandalonePageNav />
      <Suspense fallback={<RouteFallback />}>
      <ReadyMark />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/category/:slug" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/in/:country" element={<Jobs landing />} />
        <Route path="/jobs/in/:country/:kind" element={<Jobs landing />} />
        <Route path="/jobs/interview-questions" element={<InterviewQuestions />} />
        <Route path="/jobs/interview-questions/fresher" element={<InterviewQuestions level="fresher" />} />
        <Route path="/jobs/interview-questions/experienced" element={<InterviewQuestions level="experienced" />} />
        <Route path="/jobs/interview-questions/:slug" element={<InterviewQuestionView />} />
        <Route path="/jobs/salaries" element={<Salaries />} />
        <Route path="/jobs/salaries/:slug" element={<SalaryRole />} />
        <Route path="/jobs/company-reviews" element={<CompanyReviews />} />
        <Route path="/jobs/company-reviews/:slug" element={<CompanyView />} />
        <Route path="/jobs/:slug" element={<JobDetail />} />
        <Route path="/hire" element={<HireLanding />} />
        <Route path="/learn" element={<LearnIndex />} />
        <Route path="/learn/:course" element={<LearnCourse />} />
        <Route path="/learn/:course/certificate" element={<LearnCertificate />} />
        <Route path="/learn/:course/:lesson" element={<LearnLesson />} />
        <Route path="/roadmaps" element={<RoadmapIndex />} />
        <Route path="/roadmaps/:slug" element={<RoadmapView />} />
        <Route path="/features" element={<Features />} />
        <Route path="/features/ats-checker" element={<AtsChecker />} />
        <Route path="/cv-builder" element={<CvLanding />} />
        <Route path="/resume-job-description-matcher" element={<JdMatcher />} />
        <Route path="/products" element={<ProductsIndex />} />
        <Route path="/products/image-enhancer" element={<ImageEnhancer />} />
        <Route path="/products/image-converter" element={<ImageConverter />} />
        {CAREER_TOOLS.tools.map((t) => <Route key={t.slug} path={t.path} element={<CareerTool slug={t.slug} />} />)}
        <Route path="/tools" element={<Navigate to="/products" replace />} />
        <Route path="/tools/:slug" element={<OldToolRedirect />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/examples" element={<ExamplesIndex />} />
        <Route path="/examples/:slug" element={<ExampleDetail />} />
        <Route path="/pricing" element={<Pricing />} />
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
          <Route path="hiring" element={<AdminHiring />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="pages/new" element={<AdminPageEditor />} />
          <Route path="pages/:id/edit" element={<AdminPageEditor />} />
          <Route path="site-content" element={<AdminSiteContent />} />
          <Route path="trust" element={<AdminTrust />} />
          <Route path="plan" element={<AdminPlan />} />
          <Route path="tools" element={<AdminTools />} />
          <Route path="appearance" element={<AdminAppearance />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="seo" element={<AdminSeo />} />
          <Route path="blogs" element={<AdminBlogList />} />
          <Route path="blogs/new" element={<AdminBlogEditor />} />
          <Route path="blogs/:id/edit" element={<AdminBlogEditor />} />
          <Route path="community" element={<AdminCommunity />} />
          <Route path="inbox" element={<AdminInbox />} />
          <Route path="roadmaps" element={<AdminRoadmaps />} />
          <Route path="roadmaps/new" element={<AdminRoadmapEditor />} />
          <Route path="roadmaps/:id/edit" element={<AdminRoadmapEditor />} />
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
          <Route path="cv/:cvId" element={<CvBuilder />} />
          <Route path="open-to-work" element={<OpenToWork />} />
          <Route path="hire" element={<Hire />} />
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
      </Suspense>
    </>
  );
};

export default App;