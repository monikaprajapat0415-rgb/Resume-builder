import Job from '../models/Job.js';
import { loadTemplate } from '../utils/seoShell.js';
import { SITE_NAME } from '../utils/blogSeo.js';
import { jobHtml, jobsIndexHtml, jobSeo, jobsIndexSeo, jobNotFound } from '../utils/jobSeo.js';
import { loadJobView, liveFilter } from './jobController.js';
import { sendShell } from './blogSeoController.js';

const guard = (fn) => async (req, res, next) => {
    try {
        if (!loadTemplate()) return next();
        await fn(req, res, next);
    } catch (e) {
        console.error('[seo] jobs render failed:', e.message);
        res.set('Retry-After', '120');
        if (!sendShell(res, 503, { ...jobNotFound(req.path), robots: 'noindex', fullTitle: SITE_NAME, description: 'Temporarily unavailable.', body: '' })) next();
    }
};

// GET /jobs
export const renderJobsIndex = guard(async (req, res) => {
    const f = liveFilter();
    const [jobs, total] = await Promise.all([Job.find(f).sort({ postedAt: -1, createdAt: -1 }).limit(50).select('slug title company location remote employmentType').lean(), Job.countDocuments(f)]);
    sendShell(res, 200, { ...jobsIndexSeo(), body: jobsIndexHtml({ jobs, total }) });
});

// GET /jobs/:slug - a closed job answers 404 so Google drops it
export const renderJob = guard(async (req, res, next) => {
    const v = await loadJobView(req.params.slug);
    if (!v) return sendShell(res, 404, jobNotFound(req.path)) || next();
    sendShell(res, 200, { ...jobSeo(v.job), body: jobHtml(v) });
});
