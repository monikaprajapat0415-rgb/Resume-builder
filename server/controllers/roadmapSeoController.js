import { loadTemplate } from '../utils/seoShell.js';
import { SITE_NAME, siteUrl, seoTitle } from '../utils/blogSeo.js';
import { roadmapHtml, roadmapIndexHtml, roadmapIndexJsonLd } from '../utils/roadmapSeo.js';
import { loadRoadmapView, listPublishedRoadmaps } from './roadmapController.js';
import { sendShell } from './blogSeoController.js';

const notFound = (path) => ({
    fullTitle: `Page not found | ${SITE_NAME}`, description: 'This page could not be found.', canonical: `${siteUrl()}${path}`, robots: 'noindex, nofollow',
    body: '<section class="ssr-article"><h1>Page not found</h1><p><a href="/roadmaps">Back to the career roadmaps</a></p></section>', jsonLd: [],
});
const unavailable = (path) => ({ ...notFound(path), robots: 'noindex', fullTitle: SITE_NAME, description: 'Temporarily unavailable.', body: '' });

const guard = (fn) => async (req, res, next) => {
    try {
        if (!loadTemplate()) return next();
        await fn(req, res, next);
    } catch (e) {
        console.error('[seo] roadmap render failed:', e.message);
        res.set('Retry-After', '120');
        if (!sendShell(res, 503, unavailable(req.path))) next();
    }
};

const DESC = 'Step-by-step career roadmaps for job seekers: what to learn, in what order, and which tools to use to get from your first job to the next one.';

// GET /roadmaps
export const renderRoadmapIndex = guard(async (req, res) => {
    const roadmaps = await listPublishedRoadmaps();
    sendShell(res, 200, {
        fullTitle: seoTitle('Career roadmaps: step-by-step plans for job seekers'), description: DESC, canonical: `${siteUrl()}/roadmaps`,
        robots: roadmaps.length ? 'index, follow' : 'noindex, follow', type: 'website', keywords: 'career roadmap, career path, how to get promoted, job seeker guide',
        jsonLd: roadmapIndexJsonLd(roadmaps), body: roadmapIndexHtml({ roadmaps }),
    });
});

// GET /roadmaps/:slug
export const renderRoadmap = guard(async (req, res, next) => {
    const v = await loadRoadmapView(req.params.slug);
    if (!v) return sendShell(res, 404, notFound(req.path)) || next();
    sendShell(res, 200, { ...v.seo, body: roadmapHtml(v), jsonLd: v.jsonLd });
});
