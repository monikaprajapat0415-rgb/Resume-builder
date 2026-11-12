import AdminLog from "../models/AdminLog.js";

// Plain-language names for the admin routes that change things. First match wins; routes that
// are not listed are still recorded, with a label made from the path.
const LABELS = [
    [/^\/users\/[^/]+\/plan$/, 'Changed a user\'s paid plan'],
    [/^\/users\/[^/]+\/role$/, 'Changed a user\'s role'],
    [/^\/users\/[^/]+\/ats/, 'Changed a user\'s ATS allowance'],
    [/^\/users\/[^/]+$/, 'Deleted a user'],
    [/^\/seo-audit\/apply$/, 'Applied SEO fixes'],
    [/^\/seo-audit\/undo$/, 'Undid SEO fixes'],
    [/^\/bulk$/, 'Bulk action'],
    [/^\/blogs/, 'Blog post'],
    [/^\/learn\/lessons\/[^/]+\/translations/, 'Lesson translation'],
    [/^\/learn\/courses\/[^/]+\/lessons/, 'Course lesson'],
    [/^\/learn\/lessons/, 'Course lesson'],
    [/^\/learn\/courses/, 'Course'],
    [/^\/learn\/import/, 'Imported a course'],
    [/^\/plan\/events/, 'Payment event'],
    [/^\/plan$/, 'Paid plan settings'],
    [/^\/tools$/, 'Free tools settings'],
    [/^\/inbox\/bulk$/, 'Moderation inbox bulk action'],
    [/^\/community/, 'Community content'],
    [/^\/hiring/, 'Hiring review'],
    [/^\/products/, 'Product'],
    [/^\/categories/, 'Category'],
    [/^\/menu/, 'Menu'],
    [/^\/pages/, 'Page'],
    [/^\/site-content/, 'Homepage text'],
    [/^\/trust/, 'Reviews and clients'],
    [/^\/messages/, 'Message'],
    [/^\/roadmaps/, 'Roadmap'],
    [/^\/job-sources/, 'Job source'],
    [/^\/feedback/, 'Lesson feedback'],
];
const VERB = { POST: 'Created or ran', PUT: 'Edited', PATCH: 'Edited', DELETE: 'Deleted' };

export const describe = (method, path) => {
    const hit = LABELS.find(([rx]) => rx.test(path));
    const name = hit ? hit[1] : path.split('/').filter(Boolean)[0] || 'admin';
    // Labels that already read as a sentence are used as they are.
    if (/^(Changed|Deleted|Applied|Undid|Imported|Bulk|Moderation)/.test(name)) return name;
    return `${VERB[method] || method} · ${name}`;
};

// Only these fields are ever copied from the request body, and only small values. Nothing
// else (passwords, tokens, post bodies, lesson text) is stored.
const SAFE = ['published', 'role', 'days', 'lifetime', 'enabled', 'action', 'resource', 'status', 'active', 'amount', 'credits', 'disabled'];
export const safeMeta = (req) => {
    const out = {};
    const b = req.body && typeof req.body === 'object' ? req.body : {};
    for (const k of SAFE) if (['string', 'number', 'boolean'].includes(typeof b[k])) out[k] = typeof b[k] === 'string' ? b[k].slice(0, 60) : b[k];
    for (const k of ['ids', 'postIds', 'changes', 'items']) if (Array.isArray(b[k])) out[`${k}Count`] = b[k].length;
    if (typeof b.title === 'string') out.title = b.title.slice(0, 90);
    return out;
};

// Best effort: a logging failure must never break the admin action itself.
export const logAdmin = async ({ admin, action, method = 'SYSTEM', path = '', meta = {} }) => {
    try {
        await AdminLog.create({ adminId: String(admin?._id || ''), adminEmail: admin?.email || (admin ? '' : 'system'), action, method, path: String(path).slice(0, 200), meta });
    } catch (e) { console.error('admin log failed:', e.message); }
};

// Mounted once on the admin router. Records every change that went through (status below 400).
export const auditAdmin = (req, res, next) => {
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
    res.on('finish', () => {
        if (res.statusCode >= 400) return;
        const path = req.path;
        if (/^\/(ai-status\/test|job-sources\/[^/]+\/run|job-sources\/sync-all|messages\/mark-all-read)/.test(path)) return; // routine runs, not changes
        const meta = safeMeta(req);
        if (res.locals?.auditMeta) Object.assign(meta, res.locals.auditMeta);
        logAdmin({ admin: req.adminUser, action: describe(req.method, path), method: req.method, path, meta });
    });
    next();
};
