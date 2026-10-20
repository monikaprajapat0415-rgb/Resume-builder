import mongoose from "mongoose";
import InterviewQuestion from "../models/InterviewQuestion.js";
import InterviewAnswer from "../models/InterviewAnswer.js";
import SalaryReport from "../models/SalaryReport.js";
import CompanyReview from "../models/CompanyReview.js";
import User from "../models/User.js";
import { slugify } from "../utils/slugify.js";
import {
    str, para, hasLink, companySlug, displayNameFor, aggregateSalaries, COUNTRIES, CURRENCIES, PERIODS, SALARY_LEVELS,
    RESERVED_QUESTION_SLUGS, REVIEW_MIN,
} from "../utils/communityCore.js";
import {
    questionsIndexView, questionView, salariesIndexView, salaryRoleView, companiesIndexView, companyView,
} from "../utils/communitySeo.js";

const validId = (id) => mongoose.isValidObjectId(id);
const fail = (res, e) => res.status(500).json({ message: e.message });
const AUTO_HIDE_REPORTS = 3;   // this many different users flagging an approved item sends it back to review

// ================= shared loaders (also used by the server-rendered pages) =================
const levelFilter = (level) => (level === 'fresher' || level === 'experienced' ? { level: { $in: [level, 'both'] } } : {});

export const loadQuestionsIndex = async (level) => {
    const questions = await InterviewQuestion.find({ published: true, ...levelFilter(level) }).sort({ category: 1, order: 1, createdAt: 1 }).limit(500)
        .select('question slug category level').lean();
    const counts = await InterviewAnswer.aggregate([{ $match: { status: 'approved' } }, { $group: { _id: '$question', n: { $sum: 1 } } }]);
    const byQ = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
    const withCounts = questions.map((q) => ({ ...q, answerCount: byQ[String(q._id)] || 0 }));
    return { questions: withCounts, ...questionsIndexView({ questions, level }) };
};

export const loadQuestion = async (slug) => {
    const q = await InterviewQuestion.findOne({ slug, published: true }).lean();
    if (!q) return null;
    const answers = await InterviewAnswer.find({ question: q._id, status: 'approved' }).sort({ createdAt: -1 }).limit(50).select('body displayName createdAt').lean();
    const related = await InterviewQuestion.find({ published: true, category: q.category, _id: { $ne: q._id } }).sort({ order: 1 }).limit(6).select('question slug').lean();
    return { question: { question: q.question, slug: q.slug, category: q.category, level: q.level, modelAnswer: q.modelAnswer, tips: q.tips, tags: q.tags, createdAt: q.createdAt }, answers, ...questionView({ q, answers, related }) };
};

const approvedSalaries = (match = {}) => SalaryReport.find({ status: 'approved', ...match }).lean();

export const loadSalariesIndex = async () => {
    const reports = await SalaryReport.find({ status: 'approved' }).select('roleSlug roleTitle country currency period amount').limit(20000).lean();
    const by = new Map();
    for (const r of reports) by.set(r.roleSlug, [...(by.get(r.roleSlug) || []), r]);
    const roles = [...by.entries()].map(([slug, rows]) => ({ slug, title: rows[0].roleTitle, count: rows.length, countries: [...new Set(rows.map((x) => x.country))], ready: aggregateSalaries(rows).some((g) => g.enough) }))
        .sort((x, y) => y.count - x.count || x.title.localeCompare(y.title)).slice(0, 300);
    return { roles, ...salariesIndexView({ roles, ready: roles.some((r) => r.ready) }) };
};

export const loadSalaryRole = async (slug) => {
    const reports = await approvedSalaries({ roleSlug: slug });
    if (!reports.length) return null;
    const title = reports[0].roleTitle;
    const groups = aggregateSalaries(reports);
    const recent = reports.sort((a, b) => b.createdAt - a.createdAt).slice(0, 20)
        .map((r) => ({ _id: r._id, company: r.company, country: r.country, city: r.city, level: r.level, experienceYears: r.experienceYears, amount: r.amount, currency: r.currency, period: r.period, createdAt: r.createdAt }));
    return { title, slug, groups, recent, ...salaryRoleView({ title, slug, groups, recent }) };
};

// group approved reviews by company in code (keeps the database queries simple)
const companyStats = async () => {
    const rows = await CompanyReview.find({ status: 'approved' }).select('company companySlug rating updatedAt').limit(20000).lean();
    const by = new Map();
    for (const r of rows) {
        const c = by.get(r.companySlug) || { slug: r.companySlug, company: r.company, sum: 0, count: 0, at: 0 };
        c.sum += r.rating; c.count += 1; c.at = Math.max(c.at, +r.updatedAt);
        by.set(r.companySlug, c);
    }
    return [...by.values()].map((c) => ({ ...c, avg: c.sum / c.count })).sort((x, y) => y.count - x.count || x.company.localeCompare(y.company));
};

export const loadCompaniesIndex = async () => {
    const companies = (await companyStats()).slice(0, 300).map(({ slug, company, avg, count }) => ({ slug, company, avg, count }));
    return { companies, ...companiesIndexView({ companies, ready: companies.some((c) => c.count >= REVIEW_MIN) }) };
};

export const loadCompany = async (slug) => {
    const reviews = await CompanyReview.find({ companySlug: slug, status: 'approved' }).sort({ createdAt: -1 }).limit(50)
        .select('company rating title pros cons jobTitle employment displayName createdAt').lean();
    if (!reviews.length) return null;
    const count = reviews.length;
    const avg = reviews.reduce((n, r) => n + r.rating, 0) / count;
    const company = reviews[0].company;
    return { company, slug, avg, count, reviews, ...companyView({ company, slug, avg, count, reviews }) };
};

// Pages that may go in the sitemap (enough content to be worth indexing)
export const communitySitemapEntries = async () => {
    const [questions, salaryRows, companyRows] = await Promise.all([
        InterviewQuestion.find({ published: true }).select('slug updatedAt modifiedAt').lean(),
        SalaryReport.find({ status: 'approved' }).select('roleSlug country currency period amount updatedAt').limit(20000).lean(),
        companyStats(),
    ]);
    const bySlug = new Map();
    for (const r of salaryRows) bySlug.set(r.roleSlug, [...(bySlug.get(r.roleSlug) || []), r]);
    const salaries = [...bySlug.entries()].filter(([, rows]) => aggregateSalaries(rows).some((g) => g.enough))
        .map(([slug, rows]) => ({ slug, at: rows.reduce((m, r) => Math.max(m, +r.updatedAt), 0) }));
    return {
        questions: questions.map((q) => ({ slug: q.slug, at: q.modifiedAt || q.updatedAt })),
        salaries, companies: companyRows.filter((c) => c.count >= REVIEW_MIN).map((c) => ({ slug: c.slug, at: c.at })),
    };
};

// ================= public API =================
export const getMeta = (req, res) => res.status(200).json({ countries: Object.keys(COUNTRIES), countryCurrency: COUNTRIES, currencies: CURRENCIES, periods: PERIODS, levels: SALARY_LEVELS });

export const getQuestions = async (req, res) => {
    try {
        const level = ['fresher', 'experienced'].includes(req.query.level) ? req.query.level : '';
        const { questions, seo, jsonLd } = await loadQuestionsIndex(level);
        return res.status(200).json({ questions, categories: [...new Set(questions.map((q) => q.category))], seo, jsonLd });
    } catch (e) { return fail(res, e); }
};
export const getQuestion = async (req, res) => {
    try {
        const v = await loadQuestion(req.params.slug);
        if (!v) return res.status(404).json({ message: 'Question not found' });
        InterviewQuestion.updateOne({ slug: req.params.slug }, { $inc: { views: 1 } }).catch(() => {});
        return res.status(200).json(v);
    } catch (e) { return fail(res, e); }
};
export const getSalaries = async (req, res) => { try { return res.status(200).json(await loadSalariesIndex()); } catch (e) { return fail(res, e); } };
export const getSalaryRole = async (req, res) => {
    try {
        const v = await loadSalaryRole(req.params.slug);
        if (!v) return res.status(404).json({ message: 'No salary reports for this role yet' });
        return res.status(200).json(v);
    } catch (e) { return fail(res, e); }
};
export const getCompanies = async (req, res) => { try { return res.status(200).json(await loadCompaniesIndex()); } catch (e) { return fail(res, e); } };
export const getCompany = async (req, res) => {
    try {
        const v = await loadCompany(req.params.slug);
        if (!v) return res.status(404).json({ message: 'No reviews for this company yet' });
        return res.status(200).json(v);
    } catch (e) { return fail(res, e); }
};

// ================= signed-in contributions (always held for approval) =================
const PENDING_MSG = 'Thanks! It will appear after a quick review.';
const authorOf = async (req) => User.findById(req.userId).select('name');

// POST /api/community/questions/:slug/answers  { body, anonymous }
export const addAnswer = async (req, res) => {
    try {
        const q = await InterviewQuestion.findOne({ slug: req.params.slug, published: true }).select('_id');
        if (!q) return res.status(404).json({ message: 'Question not found' });
        const body = para(req.body.body, 3000);
        if (body.length < 40) return res.status(400).json({ message: 'Please write at least a couple of sentences (40 characters).' });
        if (hasLink(body)) return res.status(400).json({ message: 'Links are not allowed in answers.' });
        if (await InterviewAnswer.exists({ question: q._id, user: req.userId })) return res.status(409).json({ message: 'You already answered this question. Your answer is waiting for or has passed review.' });
        const user = await authorOf(req);
        await InterviewAnswer.create({ question: q._id, user: req.userId, body, displayName: displayNameFor(user, Boolean(req.body.anonymous)) });
        return res.status(201).json({ message: PENDING_MSG });
    } catch (e) { return fail(res, e); }
};

// POST /api/community/salaries
export const addSalary = async (req, res) => {
    try {
        const b = req.body || {};
        const roleTitle = str(b.roleTitle, 80);
        const roleSlug = slugify(roleTitle).slice(0, 80);
        const country = Object.keys(COUNTRIES).includes(b.country) ? b.country : '';
        const amount = Number(b.amount);
        const currency = CURRENCIES.includes(b.currency) ? b.currency : '';
        const period = PERIODS.includes(b.period) ? b.period : '';
        if (roleTitle.length < 3 || !roleSlug) return res.status(400).json({ message: 'Enter the job title.' });
        if (!country || !currency || !period) return res.status(400).json({ message: 'Choose the country, currency and how often you are paid.' });
        if (!Number.isFinite(amount) || amount <= 0 || amount > 1e9) return res.status(400).json({ message: 'Enter the pay as a number.' });
        const years = Math.min(50, Math.max(0, Number(b.experienceYears) || 0));
        if (hasLink(roleTitle) || hasLink(b.company) || hasLink(b.city)) return res.status(400).json({ message: 'Links are not allowed.' });
        await SalaryReport.create({
            user: req.userId, roleTitle, roleSlug, company: str(b.company, 80), country, city: str(b.city, 60),
            level: SALARY_LEVELS.includes(b.level) ? b.level : 'mid', experienceYears: years, amount, currency, period,
        });
        return res.status(201).json({ message: PENDING_MSG });
    } catch (e) { return fail(res, e); }
};

// POST /api/community/reviews
export const addReview = async (req, res) => {
    try {
        const b = req.body || {};
        const company = str(b.company, 80);
        const slug = companySlug(company);
        const rating = Math.round(Number(b.rating));
        const title = str(b.title, 120);
        const pros = para(b.pros, 1500);
        const cons = para(b.cons, 1500);
        if (company.length < 2 || !slug) return res.status(400).json({ message: 'Enter the company name.' });
        if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ message: 'Choose a rating from 1 to 5.' });
        if (title.length < 5) return res.status(400).json({ message: 'Add a short headline for your review.' });
        if (pros.length < 20 && cons.length < 20) return res.status(400).json({ message: 'Tell us what was good or what was not (at least a sentence).' });
        if ([company, title, pros, cons, b.jobTitle].some(hasLink)) return res.status(400).json({ message: 'Links are not allowed in reviews.' });
        if (await CompanyReview.exists({ companySlug: slug, user: req.userId })) return res.status(409).json({ message: 'You have already reviewed this company.' });
        const user = await authorOf(req);
        await CompanyReview.create({
            user: req.userId, company, companySlug: slug, rating, title, pros, cons, jobTitle: str(b.jobTitle, 80),
            employment: ['current', 'former', 'candidate'].includes(b.employment) ? b.employment : 'former', displayName: displayNameFor(user, Boolean(b.anonymous)),
        });
        return res.status(201).json({ message: PENDING_MSG });
    } catch (e) { return fail(res, e); }
};

const TYPES = { answers: InterviewAnswer, salaries: SalaryReport, reviews: CompanyReview };

// POST /api/community/report/:type/:id : flag something for the admin; enough flags hide it until reviewed
export const reportItem = async (req, res) => {
    try {
        const Model = TYPES[req.params.type];
        if (!Model || !validId(req.params.id)) return res.status(404).json({ message: 'Not found' });
        const item = await Model.findById(req.params.id);
        if (!item || item.status !== 'approved') return res.status(404).json({ message: 'Not found' });
        if (String(item.user) === String(req.userId)) return res.status(400).json({ message: 'You cannot report your own post.' });
        if (!item.reports.some((u) => String(u) === String(req.userId))) item.reports.push(req.userId);
        if (item.reports.length >= AUTO_HIDE_REPORTS) item.status = 'pending';
        await item.save();
        return res.status(200).json({ message: 'Thanks, we will take a look.' });
    } catch (e) { return fail(res, e); }
};

// GET /api/community/mine : the signed-in user's own contributions and where each stands
export const getMine = async (req, res) => {
    try {
        res.set('Cache-Control', 'private, no-store');
        const [answers, salaries, reviews] = await Promise.all([
            InterviewAnswer.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50).populate('question', 'question slug').lean(),
            SalaryReport.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50).lean(),
            CompanyReview.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50).lean(),
        ]);
        const pick = (o, keys) => Object.fromEntries(keys.map((k) => [k, o[k]]));
        return res.status(200).json({
            answers: answers.map((a) => ({ ...pick(a, ['_id', 'body', 'status', 'createdAt']), question: a.question ? { question: a.question.question, slug: a.question.slug } : null })),
            salaries: salaries.map((s) => pick(s, ['_id', 'roleTitle', 'country', 'amount', 'currency', 'period', 'status', 'createdAt'])),
            reviews: reviews.map((r) => pick(r, ['_id', 'company', 'rating', 'title', 'status', 'createdAt'])),
        });
    } catch (e) { return fail(res, e); }
};

// ================= admin =================
const cleanQuestion = (b, existing) => {
    const out = {};
    const has = (k) => b[k] !== undefined;
    if (has('question')) out.question = str(b.question, 240);
    if (has('category')) out.category = str(b.category, 60) || 'General';
    if (has('level')) out.level = ['fresher', 'experienced', 'both'].includes(b.level) ? b.level : 'both';
    if (has('modelAnswer')) out.modelAnswer = para(b.modelAnswer, 6000);
    if (has('tips')) out.tips = (Array.isArray(b.tips) ? b.tips : String(b.tips || '').split('\n')).map((t) => str(t, 300)).filter(Boolean).slice(0, 8);
    if (has('tags')) out.tags = [...new Set((Array.isArray(b.tags) ? b.tags : String(b.tags || '').split(',')).map((t) => str(t, 30).toLowerCase()).filter(Boolean))].slice(0, 10);
    if (has('order')) out.order = Number.isFinite(Number(b.order)) ? Math.trunc(Number(b.order)) : 0;
    if (has('published')) out.published = Boolean(b.published);
    return out;
};

export const adminSummary = async (req, res) => {
    try {
        const [qs, ap, sp, rp, af, sf, rf] = await Promise.all([
            InterviewQuestion.countDocuments({}),
            InterviewAnswer.countDocuments({ status: 'pending' }), SalaryReport.countDocuments({ status: 'pending' }), CompanyReview.countDocuments({ status: 'pending' }),
            InterviewAnswer.countDocuments({ 'reports.0': { $exists: true } }), SalaryReport.countDocuments({ 'reports.0': { $exists: true } }), CompanyReview.countDocuments({ 'reports.0': { $exists: true } }),
        ]);
        return res.status(200).json({ questions: qs, pending: { answers: ap, salaries: sp, reviews: rp }, reported: { answers: af, salaries: sf, reviews: rf } });
    } catch (e) { return fail(res, e); }
};

export const adminListQuestions = async (req, res) => {
    try {
        const questions = await InterviewQuestion.find({}).sort({ category: 1, order: 1, createdAt: 1 }).limit(1000).lean();
        const counts = await InterviewAnswer.aggregate([{ $group: { _id: '$question', n: { $sum: 1 } } }]);
        const byQ = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
        return res.status(200).json({ questions: questions.map((q) => ({ ...q, answerCount: byQ[String(q._id)] || 0 })) });
    } catch (e) { return fail(res, e); }
};
export const adminGetQuestion = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Not found' });
        const q = await InterviewQuestion.findById(req.params.id).lean();
        return q ? res.status(200).json({ question: q }) : res.status(404).json({ message: 'Not found' });
    } catch (e) { return fail(res, e); }
};
export const adminCreateQuestion = async (req, res) => {
    try {
        const data = cleanQuestion(req.body || {});
        if (!data.question || data.question.length < 8) return res.status(400).json({ message: 'Write the question.' });
        let slug = slugify(str(req.body.slug, 120) || data.question).slice(0, 90);
        if (!slug || RESERVED_QUESTION_SLUGS.includes(slug)) slug = `${slug || 'question'}-q`;
        if (await InterviewQuestion.exists({ slug })) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
        const q = await InterviewQuestion.create({ ...data, slug, modifiedAt: new Date() });
        return res.status(201).json({ question: q });
    } catch (e) { return fail(res, e); }
};
export const adminUpdateQuestion = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Not found' });
        const q = await InterviewQuestion.findById(req.params.id);
        if (!q) return res.status(404).json({ message: 'Not found' });
        const data = cleanQuestion(req.body || {});
        if (data.question !== undefined && data.question.length < 8) return res.status(400).json({ message: 'Write the question.' });
        Object.assign(q, data, { modifiedAt: new Date() });
        await q.save();
        return res.status(200).json({ question: q });
    } catch (e) { return fail(res, e); }
};
export const adminDeleteQuestion = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Not found' });
        const q = await InterviewQuestion.findByIdAndDelete(req.params.id);
        if (!q) return res.status(404).json({ message: 'Not found' });
        await InterviewAnswer.deleteMany({ question: q._id });
        return res.status(200).json({ message: 'Deleted' });
    } catch (e) { return fail(res, e); }
};

// moderation of user submissions: answers, salaries, reviews
const EDITABLE = {
    answers: (b) => ({ ...(b.body !== undefined && { body: para(b.body, 3000) }) }),
    reviews: (b) => ({
        ...(b.title !== undefined && { title: str(b.title, 120) }), ...(b.pros !== undefined && { pros: para(b.pros, 1500) }), ...(b.cons !== undefined && { cons: para(b.cons, 1500) }),
        ...(b.rating !== undefined && Number(b.rating) >= 1 && Number(b.rating) <= 5 && { rating: Math.round(Number(b.rating)) }),
    }),
    salaries: (b) => ({
        ...(b.amount !== undefined && Number(b.amount) > 0 && { amount: Number(b.amount) }), ...(b.company !== undefined && { company: str(b.company, 80) }),
        ...(b.roleTitle !== undefined && str(b.roleTitle, 80).length >= 3 && { roleTitle: str(b.roleTitle, 80), roleSlug: slugify(str(b.roleTitle, 80)).slice(0, 80) }),
    }),
};

export const adminListSubmissions = async (req, res) => {
    try {
        const Model = TYPES[req.params.type];
        if (!Model) return res.status(404).json({ message: 'Not found' });
        const filter = {};
        if (['pending', 'approved', 'rejected'].includes(req.query.status)) filter.status = req.query.status;
        if (req.query.reported === '1') filter['reports.0'] = { $exists: true };
        let query = Model.find(filter).sort({ updatedAt: -1 }).limit(200).populate('user', 'name email');
        if (req.params.type === 'answers') query = query.populate('question', 'question slug');
        const items = (await query.lean()).map((i) => ({ ...i, reportCount: (i.reports || []).length, reports: undefined }));
        return res.status(200).json({ items });
    } catch (e) { return fail(res, e); }
};
export const adminUpdateSubmission = async (req, res) => {
    try {
        const Model = TYPES[req.params.type];
        if (!Model || !validId(req.params.id)) return res.status(404).json({ message: 'Not found' });
        const item = await Model.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        const b = req.body || {};
        Object.assign(item, EDITABLE[req.params.type](b));
        if (['pending', 'approved', 'rejected'].includes(b.status)) {
            item.status = b.status;
            if (b.status === 'approved') item.reports = [];      // reviewed: clear the flags
        }
        if (b.adminNote !== undefined) item.adminNote = str(b.adminNote, 300);
        await item.save();
        return res.status(200).json({ message: 'Saved' });
    } catch (e) { return fail(res, e); }
};
export const adminDeleteSubmission = async (req, res) => {
    try {
        const Model = TYPES[req.params.type];
        if (!Model || !validId(req.params.id)) return res.status(404).json({ message: 'Not found' });
        const item = await Model.findByIdAndDelete(req.params.id);
        return item ? res.status(200).json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' });
    } catch (e) { return fail(res, e); }
};

// GET /api/admin/inbox : everything waiting for a decision, newest first, across all three kinds
export const adminInbox = async (req, res) => {
    try {
        const only = ['answers', 'salaries', 'reviews'].includes(req.query.type) ? [req.query.type] : Object.keys(TYPES);
        const reportedOnly = req.query.reported === '1';
        const lists = await Promise.all(only.map(async (type) => {
            const filter = reportedOnly ? { 'reports.0': { $exists: true } } : { $or: [{ status: 'pending' }, { 'reports.0': { $exists: true } }] };
            let q = TYPES[type].find(filter).sort({ createdAt: -1 }).limit(100).populate('user', 'name email');
            if (type === 'answers') q = q.populate('question', 'question slug');
            return (await q.lean()).map((i) => ({ ...i, type, reportCount: (i.reports || []).length, reports: undefined }));
        }));
        const items = lists.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 200);
        return res.status(200).json({ items });
    } catch (e) { return fail(res, e); }
};

// POST /api/admin/inbox/bulk { action: 'approve'|'reject'|'delete', items: [{ type, id }] }
export const adminInboxBulk = async (req, res) => {
    try {
        const { action, items } = req.body || {};
        if (!['approve', 'reject', 'delete'].includes(action) || !Array.isArray(items) || !items.length) return res.status(400).json({ message: 'action and items are required' });
        if (items.length > 100) return res.status(400).json({ message: 'Select at most 100 items at a time.' });
        let done = 0;
        for (const it of items) {
            const Model = TYPES[it?.type];
            if (!Model || !validId(it.id)) continue;
            if (action === 'delete') { if (await Model.findByIdAndDelete(it.id)) done++; continue; }
            const doc = await Model.findById(it.id);
            if (!doc) continue;
            doc.status = action === 'approve' ? 'approved' : 'rejected';
            if (action === 'approve') doc.reports = [];
            await doc.save();
            done++;
        }
        return res.status(200).json({ done });
    } catch (e) { return fail(res, e); }
};
