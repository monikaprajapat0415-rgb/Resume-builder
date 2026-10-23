import { loadTemplate } from '../utils/seoShell.js';
import { SITE_NAME, siteUrl, seoTitle } from '../utils/blogSeo.js';
import { getExample } from '../utils/exampleResumes.js';
import { exampleView, exampleHtml, examplesIndexHtml, examplesIndexJsonLd, EXAMPLES_TITLE, EXAMPLES_DESC } from '../utils/exampleSeo.js';
import { sendShell } from './blogSeoController.js';

const notFound = (path) => ({
    fullTitle: `Page not found | ${SITE_NAME}`, description: 'This page could not be found.', canonical: `${siteUrl()}${path}`, robots: 'noindex, nofollow',
    body: '<section class="ssr-article"><h1>Page not found</h1><p><a href="/examples">Back to the resume and CV examples</a></p></section>', jsonLd: [],
});

// GET /examples
export const renderExamplesIndex = (req, res, next) => {
    try {
        if (!loadTemplate()) return next();
        sendShell(res, 200, {
            fullTitle: seoTitle(EXAMPLES_TITLE), description: EXAMPLES_DESC, canonical: `${siteUrl()}/examples`, robots: 'index, follow, max-image-preview:large', type: 'website',
            keywords: 'resume examples, cv examples, ats friendly resume example, 100 ats score resume',
            jsonLd: examplesIndexJsonLd(), body: examplesIndexHtml(),
        });
    } catch (e) {
        console.error('[seo] examples render failed:', e.message);
        next();
    }
};

// GET /examples/:slug
export const renderExample = (req, res, next) => {
    try {
        if (!loadTemplate()) return next();
        const ex = getExample(req.params.slug);
        if (!ex) return sendShell(res, 404, notFound(req.path)) || next();
        const v = exampleView(ex);
        sendShell(res, 200, { ...v.seo, body: exampleHtml(ex), jsonLd: v.jsonLd });
    } catch (e) {
        console.error('[seo] example render failed:', e.message);
        next();
    }
};
