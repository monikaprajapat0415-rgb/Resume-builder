// components/SEO.jsx
// Centralized, reusable SEO tag manager. Renders <title>, meta description/keywords,
// canonical link, robots directives, Open Graph + Twitter Card tags, and optional
// JSON-LD structured data. Mount one <SEO /> per page/route with props specific to
// that page - more specific tags (rendered later in the tree) win over the app-level
// default set in App.jsx, since react-helmet-async merges tags in render order.
import { useEffect, useId, useLayoutEffect, useSyncExternalStore } from "react";
import { Helmet } from "react-helmet-async";

// ---- one set of SEO tags at a time -------------------------------------------------------
// The page used to end up with several <title>, meta description, canonical and og: tags in <head>:
// the static ones from index.html, the app-wide fallback from App.jsx, and the page's own. Crawlers
// that read the first one (and every social-card scraper) then saw the home page's text on every URL.
// Now only the most recently mounted <SEO /> (the page's own) renders its tags; the app-wide fallback
// returns when a page has none; and the static index.html tags are removed once a page takes over.
const stack = [];
const subs = new Set();
const emit = () => subs.forEach((f) => f());
const subscribe = (f) => { subs.add(f); return () => subs.delete(f); };
const topId = () => (stack.length ? stack[stack.length - 1] : null);
const STATIC_SELECTOR = 'title, meta[name="description"], meta[name="robots"], meta[name="keywords"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"]';
if (typeof document !== "undefined") {
  // mark what index.html shipped, before React adds anything of its own
  document.head.querySelectorAll(STATIC_SELECTOR).forEach((el) => el.setAttribute("data-static-seo", ""));
}

const SITE_NAME = "Prime Resume AI";
const SITE_URL = "https://primeresumeai.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const SEO = ({
  title,
  description,
  keywords,
  // Path relative to the site root, e.g. "/contact-us". Defaults to the current
  // browser path so canonical/OG URLs are always correct without passing it everywhere.
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  // Set true for private, duplicate, or utility pages (dashboard, builder, auth,
  // password reset links, etc.) that shouldn't be indexed or followed by crawlers.
  noindex = false,
  // Optional JSON-LD structured data object (or array of objects) for rich results.
  structuredData,
  // Optional extras (used by blog posts): a canonical URL that differs from the page URL,
  // an explicit robots value, alt text for the social image, and article metadata.
  canonical,
  robots,
  imageAlt,
  article,
}) => {
  const id = useId();
  useLayoutEffect(() => {
    stack.push(id); emit();
    return () => { const i = stack.indexOf(id); if (i > -1) stack.splice(i, 1); emit(); };
  }, [id]);
  const activeId = useSyncExternalStore(subscribe, topId, () => null);
  const isActive = activeId === id;
  useEffect(() => {
    if (isActive) document.head.querySelectorAll("[data-static-seo]").forEach((el) => el.remove());
  }, [isActive]);
  if (!isActive) return null;

  const currentPath =
    path ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const canonicalUrl = canonical || `${SITE_URL}${currentPath === "/" ? "" : currentPath}`;
  const fullTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - Free AI Resume Builder & CV Maker`;
  const metaDescription =
    description ||
    "Create professional, ATS-friendly resumes in minutes with AI. Free resume builder with modern templates - download your CV instantly.";

  const structuredDataList = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta
        name="robots"
        content={robots || (noindex ? "noindex, nofollow" : "index, follow")}
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      {article?.published && <meta property="article:published_time" content={new Date(article.published).toISOString()} />}
      {article?.modified && <meta property="article:modified_time" content={new Date(article.modified).toISOString()} />}
      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.section && <meta property="article:section" content={article.section} />}
      {(article?.tags || []).map((t) => <meta key={t} property="article:tag" content={t} />)}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

      {structuredDataList.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
