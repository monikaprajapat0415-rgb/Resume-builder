import LessonFeedback from "../models/LessonFeedback.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PAGE = 10;

// Find a published lesson from /:course/:lesson slugs.
const findLesson = async (courseSlug, lessonSlug) => {
    const course = await Course.findOne({ slug: courseSlug, published: true });
    if (!course) return null;
    const lesson = await Lesson.findOne({ course: course._id, slug: lessonSlug, published: true }).select('_id course');
    return lesson ? { course, lesson } : null;
};

const publicView = (f, userId) => ({
    _id: f._id, name: f.name, rating: f.rating || null, text: f.text, createdAt: f.createdAt,
    mine: !!userId && String(f.user) === String(userId),
});

// GET /api/learn/:course/:lesson/feedback?page= - public
export const listFeedback = async (req, res) => {
    try {
        const found = await findLesson(req.params.course, req.params.lesson);
        if (!found) return res.status(404).json({ message: 'Lesson not found' });
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const filter = { lesson: found.lesson._id, status: 'visible' };
        const [items, total, stats] = await Promise.all([
            LessonFeedback.find(filter).sort({ createdAt: -1 }).skip((page - 1) * PAGE).limit(PAGE),
            LessonFeedback.countDocuments(filter),
            LessonFeedback.find({ ...filter, rating: { $gte: 1 } }).select('rating').limit(5000).lean(),
        ]);
        return res.status(200).json({
            items: items.map((f) => publicView(f, req.userId)),
            total, page, pages: Math.max(1, Math.ceil(total / PAGE)),
            average: stats.length ? Math.round((stats.reduce((sum, x) => sum + x.rating, 0) / stats.length) * 10) / 10 : null,
            ratings: stats.length,
        });
    } catch (e) { console.error('[feedback] list failed:', e.message); return res.status(500).json({ message: 'Could not load feedback.' }); }
};

// POST /api/learn/:course/:lesson/feedback - signed in. { text, rating?, website? }
export const createFeedback = async (req, res) => {
    try {
        const { text, rating, website } = req.body || {};
        if (website) return res.status(201).json({ message: 'Thanks for your feedback!' }); // honeypot
        const t = typeof text === 'string' ? text.trim() : '';
        if (t.length < 3) return res.status(400).json({ message: 'Please write at least a few words.' });
        if (t.length > 1000) return res.status(400).json({ message: 'Please keep your feedback under 1000 characters.' });
        let r;
        if (rating !== undefined && rating !== null && rating !== '') {
            r = Number(rating);
            if (!Number.isInteger(r) || r < 1 || r > 5) return res.status(400).json({ message: 'Rating must be from 1 to 5.' });
        }
        const found = await findLesson(req.params.course, req.params.lesson);
        if (!found) return res.status(404).json({ message: 'Lesson not found' });
        const user = await User.findById(req.userId).select('name');
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        // Show only the first name publicly.
        const name = String(user.name || '').trim().split(/\s+/)[0].slice(0, 60) || 'Reader';
        const f = await LessonFeedback.create({ lesson: found.lesson._id, course: found.course._id, user: user._id, name, rating: r, text: t });
        return res.status(201).json({ message: 'Thanks for your feedback!', item: publicView(f, req.userId) });
    } catch (e) { return res.status(500).json({ message: 'Could not save your feedback. Please try again.' }); }
};

// DELETE /api/learn/:course/:lesson/feedback/:id - the author removes their own comment
export const deleteOwnFeedback = async (req, res) => {
    try {
        const f = await LessonFeedback.findById(req.params.id);
        if (!f || String(f.user) !== String(req.userId)) return res.status(404).json({ message: 'Comment not found' });
        await f.deleteOne();
        return res.status(200).json({ message: 'Deleted' });
    } catch (e) { return res.status(404).json({ message: 'Comment not found' }); }
};

// ---------- Admin ----------

// GET /api/admin/feedback?status=all|visible|hidden&q=&page=
export const getFeedbackAdmin = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = 25;
        const filter = {};
        if (req.query.status === 'visible' || req.query.status === 'hidden') filter.status = req.query.status;
        if (req.query.q) {
            const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i');
            filter.$or = [{ name: rx }, { text: rx }];
        }
        const [items, total, hidden] = await Promise.all([
            LessonFeedback.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
                .populate('lesson', 'title slug').populate('course', 'slug title').populate('user', 'email'),
            LessonFeedback.countDocuments(filter),
            LessonFeedback.countDocuments({ status: 'hidden' }),
        ]);
        return res.status(200).json({ items, total, hidden, page, pages: Math.max(1, Math.ceil(total / limit)) });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// PATCH /api/admin/feedback/:id { status }
export const updateFeedbackAdmin = async (req, res) => {
    try {
        const { status } = req.body || {};
        if (!['visible', 'hidden'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
        const f = await LessonFeedback.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!f) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json({ item: f });
    } catch (e) { return res.status(404).json({ message: 'Not found' }); }
};

// DELETE /api/admin/feedback/:id
export const deleteFeedbackAdmin = async (req, res) => {
    try {
        const f = await LessonFeedback.findByIdAndDelete(req.params.id);
        if (!f) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json({ message: 'Deleted' });
    } catch (e) { return res.status(404).json({ message: 'Not found' }); }
};
