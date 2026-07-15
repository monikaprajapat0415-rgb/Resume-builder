// components/SEO.jsx
// Centralized, reusable SEO tag manager. Renders <title>, meta description/keywords,
// canonical link, robots directives, Open Graph + Twitter Card tags, and optional
// JSON-LD structured data. Mount one <SEO /> per page/route with props specific to
// that page - more specific tags (rendered later in the tree) win over the app-level
// default set in App.jsx, since react-helmet-async merges tags in render order.
import { Helmet } from "react-helmet-async";

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
}) => {
  const currentPath =
    path ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const canonicalUrl = `${SITE_URL}${currentPath === "/" ? "" : currentPath}`;
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
        content={noindex ? "noindex, nofollow" : "index, follow"}
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

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />

      {structuredDataList.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
