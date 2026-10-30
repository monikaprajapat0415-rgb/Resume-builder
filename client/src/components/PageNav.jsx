// Breadcrumb trail + Back button shown under the site header on every page except the home page.
// The trail is worked out from the URL, so a new page gets one without extra code.
//  - Pages that already draw their own breadcrumb (blog, jobs, learn) get the Back button only,
//    so there is never a double trail and their own JSON-LD stays the single source of truth.
//  - Public pages with no breadcrumb of their own also get a BreadcrumbList JSON-LD block.
//  - Private pages (app, admin, auth links) show the trail but no structured data.
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://primeresumeai.com';

// Readable names for fixed URL parts. Anything not listed is made readable from the slug itself.
const LABELS = {
  'contact-us': 'Contact Us',
  features: 'Features',
  pricing: 'Pricing',
  'ats-checker': 'ATS Checker',
  'cv-builder': 'CV Builder',
  'resume-job-description-matcher': 'Job Match Tool',
  products: 'Products',
  templates: 'Templates',
  examples: 'Examples',
  'nurse-cv-example': 'Nurse CV Example',
  'production-supervisor-cv-example': 'Production Supervisor CV Example',
  'teacher-cv-example': 'Teacher CV Example',
  'fresher-engineer-cv-example': 'Fresher Engineer CV Example',
  hire: 'Hire',
  blog: 'Blog',
  jobs: 'Jobs',
  learn: 'Learn',
  roadmaps: 'Roadmaps',
  category: 'Category',
  'terms-and-conditions': 'Terms & Conditions',
  'privacy-policy': 'Privacy Policy',
  'forgot-password': 'Forgot Password',
  'reset-password': 'Reset Password',
  'verify-email': 'Verify Email',
  app: 'Dashboard',
  builder: 'Resume Builder',
  cv: 'CV Builder',
  'open-to-work': 'Open to Work',
  admin: 'Admin',
  'site-content': 'Site Content',
};

// Real pages, so a crumb only becomes a link when it goes somewhere that exists.
const LINKABLE = [
  /^\/$/, /^\/contact-us$/, /^\/blog$/, /^\/jobs$/, /^\/roadmaps$/, /^\/hire$/, /^\/learn$/, /^\/learn\/[^/]+$/,
  /^\/features$/, /^\/products$/, /^\/templates$/, /^\/examples$/, /^\/app$/, /^\/admin$/,
  /^\/admin\/(community|inbox|roadmaps|products|categories|menus|messages|feedback|jobs|hiring|pages|site-content|trust|plan|tools|appearance|users|seo|blogs|learn)$/,
  /^\/admin\/learn\/[^/]+$/,
];

// Pages that print their own breadcrumb trail.
const OWN_TRAIL = /^\/(blog|jobs|learn)(\/|$)/;
// Pages whose own <SEO /> already carries the BreadcrumbList (the visible trail still comes from here).
const OWN_LD = /^\/(blog|jobs|learn|roadmaps)(\/|$)/;
// Pages with no site header of their own: App.jsx mounts the bar for these.
export const STANDALONE = /^\/(contact-us|terms-and-conditions|privacy-policy|forgot-password|reset-password|verify-email)(\/|$)/;
// Nothing to navigate back to, or a full-screen view.
const HIDDEN = /^\/(logout|view)(\/|$)|^\/app\/(builder|cv)\//;
const PRIVATE = /^\/(app|admin|forgot-password|reset-password|verify-email|logout|view)(\/|$)/;

const pretty = (slug) => {
  let s = decodeURIComponent(slug).replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  if (s.length > 48) s = s.slice(0, 45).trimEnd() + '...';
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
};
const label = (seg) => LABELS[seg] || pretty(seg);

// The Back button / breadcrumb row lines up with the page below it: wide list and lesson pages use more of a big screen.
const WIDE = 'max-w-page xl:px-10'
export function navWidth(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (/^\/learn\/[^/]+\/(?!certificate$)[^/]+$/.test(p)) return 'max-w-[1680px] xl:px-10'
  if (/^\/learn\/[^/]+$/.test(p)) return 'max-w-5xl md:px-10'
  if (/^\/(learn|blog|roadmaps|products|templates|examples)$/.test(p)) return WIDE
  if (p === '/jobs') return 'max-w-7xl md:px-10'
  return 'max-w-6xl md:px-10'
}

export function trailFor(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const parts = clean.split('/').filter(Boolean);
  const out = [{ name: 'Home', to: '/' }];
  let acc = '';
  parts.forEach((seg, i) => {
    acc += '/' + seg;
    // "/jobs/in/india" reads as Jobs > India. "/p/slug" is a custom page: just the slug.
    if ((seg === 'in' && parts[i - 1] === 'jobs') || (seg === 'p' && i === 0)) return;
    const last = i === parts.length - 1;
    out.push({ name: label(seg), to: last ? null : LINKABLE.some((r) => r.test(acc)) ? acc : null });
  });
  return out;
}

export function StandalonePageNav() {
  const { pathname } = useLocation();
  return STANDALONE.test(pathname) ? <PageNav className="pt-4" /> : null;
}

export default function PageNav({ className = '' }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // Hooks must run on every render, so the "nothing to show" return comes after the useEffect below.
  const hidden = pathname === '/' || HIDDEN.test(pathname);

  const trail = trailFor(pathname);
  const own = OWN_TRAIL.test(pathname);
  // the closest page above this one that exists, used when there is no browser history to go back to
  const parent = [...trail].reverse().find((c, i) => i > 0 && c.to)?.to || '/';

  const goBack = () => {
    // React Router keeps a position counter: above 0 means there is a previous page inside this site.
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate(parent);
  };

  const jsonLd = !hidden && !OWN_LD.test(pathname) && !PRIVATE.test(pathname) && trail.length > 1 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: SITE_URL + (c.to || (pathname.replace(/\/+$/, '') || '/')),
    })),
  } : null;

  // The server already put this breadcrumb in the page; drop its copy once this one draws so it is not listed twice.
  useEffect(() => {
    if (!jsonLd) return;
    document.head.querySelectorAll('script[data-seo-ssr]').forEach((el) => { if (/"@type":"BreadcrumbList"/.test(el.textContent.replace(/\s/g, ''))) el.remove(); });
  }, [jsonLd?.itemListElement?.length, pathname]);

  if (hidden) return null;

  return (
    <div className={`${navWidth(pathname)} mx-auto px-4 sm:px-6 pt-2 pb-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm print:hidden ${className}`} data-pagenav>
      {jsonLd && <Helmet><script type="application/ld+json">{JSON.stringify(jsonLd)}</script></Helmet>}
      <button
        type="button"
        onClick={goBack}
        aria-label="Go back"
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 active:scale-95 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back
      </button>
      {!own && (
        <nav aria-label="Breadcrumb" className="min-w-0 text-slate-500">
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            {trail.map((c, i) => (
              <li key={i} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && <span aria-hidden="true" className="text-slate-300">›</span>}
                {c.to ? (
                  <Link to={c.to} className="hover:text-brand-600 transition">{c.name}</Link>
                ) : (
                  <span className={`truncate max-w-[60vw] sm:max-w-xs ${i === trail.length - 1 ? 'text-slate-800 font-medium' : ''}`} aria-current={i === trail.length - 1 ? 'page' : undefined}>{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
}
