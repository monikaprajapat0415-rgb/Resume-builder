import { loadTemplate } from '../utils/seoShell.js';
import { SITE_NAME, siteUrl } from '../utils/blogSeo.js';
import { questionsIndexHtml, questionHtml, salariesIndexHtml, salaryRoleHtml, companiesIndexHtml, companyHtml } from '../utils/communitySeo.js';
import { loadQuestionsIndex, loadQuestion, loadSalariesIndex, loadSalaryRole, loadCompaniesIndex, loadCompany } from './communityController.js';
import { sendShell } from './blogSeoController.js';

const notFound = (path, back = '/jobs') => ({
    fullTitle: `Page not found | ${SITE_NAME}`, description: 'This page could not be found.', canonical: `${siteUrl()}${path}`, robots: 'noindex, nofollow',
    body: `<section class="ssr-article"><h1>Page not found</h1><p><a href="${back}">Back to jobs</a></p></section>`, jsonLd: [],
});
const unavailable = (path) => ({ ...notFound(path), robots: 'noindex', fullTitle: SITE_NAME, description: 'Temporarily unavailable.', body: '' });

const guard = (fn) => async (req, res, next) => {
    try {
        if (!loadTemplate()) return next();
        await fn(req, res, next);
    } catch (e) {
        console.error('[seo] community render failed:', e.message);
        res.set('Retry-After', '120');
        if (!sendShell(res, 503, unavailable(req.path))) next();
    }
};
const send = (res, v, body) => sendShell(res, 200, { ...v.seo, body, jsonLd: v.jsonLd });

export const renderQuestionsIndex = guard(async (req, res) => {
    const level = req.path.endsWith('/fresher') ? 'fresher' : req.path.endsWith('/experienced') ? 'experienced' : '';
    const v = await loadQuestionsIndex(level);
    send(res, v, questionsIndexHtml({ questions: v.questions, level }));
});
export const renderQuestion = guard(async (req, res, next) => {
    const v = await loadQuestion(req.params.slug);
    if (!v) return sendShell(res, 404, notFound(req.path, '/jobs/interview-questions')) || next();
    send(res, v, questionHtml({ q: v.question, answers: v.answers, related: v.related }));
});
export const renderSalariesIndex = guard(async (req, res) => {
    const v = await loadSalariesIndex();
    send(res, v, salariesIndexHtml(v));
});
export const renderSalaryRole = guard(async (req, res, next) => {
    const v = await loadSalaryRole(req.params.slug);
    if (!v) return sendShell(res, 404, notFound(req.path, '/jobs/salaries')) || next();
    send(res, v, salaryRoleHtml(v));
});
export const renderCompaniesIndex = guard(async (req, res) => {
    const v = await loadCompaniesIndex();
    send(res, v, companiesIndexHtml(v));
});
export const renderCompany = guard(async (req, res, next) => {
    const v = await loadCompany(req.params.slug);
    if (!v) return sendShell(res, 404, notFound(req.path, '/jobs/company-reviews')) || next();
    send(res, v, companyHtml(v));
});
