// Public, indexable pages that are not stored in the database.
// Keep in sync with `staticRoutes` in client/vite.config.js and client/src/content/templateSlugs.js.
export const STATIC_ROUTES = [
    '/', '/contact-us', '/privacy-policy', '/terms-and-conditions', '/blog', '/learn', '/jobs',
    '/features', '/features/ats-checker', '/cv-builder', '/hire', '/resume-job-description-matcher', '/templates', '/products', '/products/image-enhancer', '/products/image-converter', '/products/cover-letter-generator', '/products/resume-bullet-improver', '/products/mock-interview-practice', '/products/job-offer-comparison', '/products/linkedin-headline-about-generator', '/products/code-playground', '/products/timed-interview-round', '/products/swift-code-reader',
    '/templates/classic-resume-template', '/templates/modern-resume-template',
    '/templates/minimal-resume-template', '/templates/resume-template-with-photo',
    '/templates/executive-resume-template', '/templates/compact-resume-template',
    '/templates/bold-header-resume-template', '/templates/timeline-resume-template', '/templates/graduate-resume-template',
    '/templates/professional-resume-template', '/templates/corporate-resume-template', '/templates/elegant-resume-template', '/templates/sidebar-resume-template', '/templates/two-column-resume-template', '/templates/developer-resume-template', '/templates/skilled-trades-resume-template', '/templates/career-change-resume-template', '/templates/leadership-resume-template', '/templates/two-tone-resume-template',
    '/examples', '/examples/software-developer-resume-example', '/examples/fresher-resume-example', '/examples/customer-service-resume-example', '/examples/electrician-resume-example', '/examples/sales-manager-resume-example', '/examples/accountant-resume-example', '/examples/nurse-cv-example', '/examples/production-supervisor-cv-example', '/examples/teacher-cv-example', '/examples/fresher-engineer-cv-example',
];
export const STATIC_LASTMOD = new Date().toISOString().slice(0, 10); // day this server started
