import { loadTemplate } from '../utils/seoShell.js';
import { SITE_NAME, siteUrl, seoTitle } from '../utils/blogSeo.js';
import { courseHtml, lessonHtml, learnIndexHtml, learnIndexJsonLd } from '../utils/learnSeo.js';
import { loadCourseView, loadLessonView, listPublishedCourses } from './learnController.js';
import { sendShell } from './blogSeoController.js';

const notFound = (path) => ({
    fullTitle: `Page not found | ${SITE_NAME}`, description: 'This page could not be found.', canonical: `${siteUrl()}${path}`, robots: 'noindex, nofollow',
    body: '<section class="ssr-article"><h1>Page not found</h1><p><a href="/learn">Back to the tutorials</a></p></section>', jsonLd: [],
});
const unavailable = (path) => ({ ...notFound(path), robots: 'noindex', fullTitle: SITE_NAME, description: 'Temporarily unavailable.', body: '' });

const guard = (fn) => async (req, res, next) => {
    try {
        if (!loadTemplate()) return next();
        await fn(req, res, next);
    } catch (e) {
        console.error('[seo] learn render failed:', e.message);
        res.set('Retry-After', '120');
        if (!sendShell(res, 503, unavailable(req.path))) next();
    }
};

const LEARN_DESC = 'Free, step-by-step tutorials for new technologies, with clear explanations and working code examples.';

// GET /learn
export const renderLearnIndex = guard(async (req, res) => {
    const courses = await listPublishedCourses();
    sendShell(res, 200, {
        fullTitle: seoTitle('Learn new technologies: free step-by-step tutorials'), description: LEARN_DESC, canonical: `${siteUrl()}/learn`,
        robots: 'index, follow', type: 'website', keywords: 'tutorials, learn programming, free courses, web development tutorials',
        jsonLd: learnIndexJsonLd(courses), body: learnIndexHtml({ courses }),
    });
});

// GET /learn/:course
export const renderCourse = guard(async (req, res, next) => {
    const v = await loadCourseView(req.params.course);
    if (!v) return sendShell(res, 404, notFound(req.path)) || next();
    sendShell(res, 200, { ...v.seo, body: courseHtml(v), jsonLd: v.jsonLd });
});

// GET /learn/:course/:lesson
export const renderLesson = guard(async (req, res, next) => {
    const v = await loadLessonView(req.params.course, req.params.lesson);
    if (!v) return sendShell(res, 404, notFound(req.path)) || next();
    sendShell(res, 200, { ...v.seo, body: lessonHtml(v), jsonLd: v.jsonLd });
});
