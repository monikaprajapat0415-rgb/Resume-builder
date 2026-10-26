import { loadTemplate } from '../utils/seoShell.js';
import { SITE_NAME, siteUrl } from '../utils/blogSeo.js';
import { merged } from './siteContentController.js';
import { sendShell } from './blogSeoController.js';
import { homePage, featuresPage, atsCheckerPage, cvBuilderPage, matcherPage, templatesIndexPage, templatePage, hirePage } from '../utils/staticPages.js';

// Server-rendered HTML for the public pages that live in the client code (see utils/staticPages.js).
// Each handler falls through (next) when the client has not been built here or anything fails, so the site still works.
const send = (build) => async (req, res, next) => {
    try {
        if (!loadTemplate()) return next();
        const pg = await build(req);
        if (!pg) {
            return sendShell(res, 404, {
                fullTitle: `Page not found | ${SITE_NAME}`, description: 'This page could not be found.', canonical: `${siteUrl()}${req.path}`, robots: 'noindex, nofollow',
                body: '<main class="ssr-article"><h1>Page not found</h1><p><a href="/templates">Back to the resume templates</a></p></main>', jsonLd: [],
            }) || next();
        }
        sendShell(res, 200, pg);
    } catch (e) {
        console.error('[seo] static page failed:', e.message);
        next();
    }
};

export const renderHome = send(async () => homePage(await merged()));
export const renderFeatures = send(() => featuresPage());
export const renderAtsChecker = send(() => atsCheckerPage());
export const renderCvBuilder = send(() => cvBuilderPage());
export const renderMatcher = send(() => matcherPage());
export const renderTemplatesIndex = send(() => templatesIndexPage());
export const renderTemplate = send((req) => templatePage(req.params.slug));
export const renderHire = send(() => hirePage());
