// Public, indexable pages that are not stored in the database.
// Keep in sync with `staticRoutes` in client/vite.config.js and client/src/content/templateSlugs.js.
export const STATIC_ROUTES = [
    '/', '/contact-us', '/privacy-policy', '/terms-and-conditions', '/blog', '/learn', '/jobs',
    '/features', '/features/ats-checker', '/templates', '/products',
    '/templates/classic-resume-template', '/templates/modern-resume-template',
    '/templates/minimal-resume-template', '/templates/resume-template-with-photo',
    '/templates/executive-resume-template', '/templates/compact-resume-template',
    '/templates/bold-header-resume-template', '/templates/timeline-resume-template', '/templates/graduate-resume-template',
];
export const STATIC_LASTMOD = new Date().toISOString().slice(0, 10); // day this server started
