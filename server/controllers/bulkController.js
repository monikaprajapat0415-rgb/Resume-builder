import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import Lesson from "../models/Lesson.js";
import InterviewQuestion from "../models/InterviewQuestion.js";
import InterviewAnswer from "../models/InterviewAnswer.js";

// What each list may do in bulk. Deleting a lesson is left out on purpose: it also removes
// uploaded files and reader feedback, so it stays a one-by-one action.
const RESOURCES = {
    blogs: { model: Blog, actions: ['publish', 'unpublish', 'delete'] },
    questions: { model: InterviewQuestion, actions: ['publish', 'unpublish', 'delete'] },
    lessons: { model: Lesson, actions: ['publish', 'unpublish'] },
};

// Fields an admin can change on many questions at once: category, level, and the technology tag (the FIRST tag).
const LEVELS = ['fresher', 'experienced', 'both'];
const setQuestions = async (ids, field, rawValue) => {
    const value = String(rawValue ?? '').trim();
    if (field === 'category') {
        if (value.length < 2 || value.length > 60 || /[<>]/.test(value)) throw Object.assign(new Error('Category must be 2 to 60 characters, no HTML.'), { code: 400 });
        return (await InterviewQuestion.updateMany({ _id: { $in: ids } }, { $set: { category: value } })).modifiedCount || 0;
    }
    if (field === 'level') {
        if (!LEVELS.includes(value)) throw Object.assign(new Error('Level must be fresher, experienced or both.'), { code: 400 });
        return (await InterviewQuestion.updateMany({ _id: { $in: ids } }, { $set: { level: value } })).modifiedCount || 0;
    }
    if (field === 'tag') {
        const tag = value.toLowerCase();
        if (!/^[a-z0-9][a-z0-9 .+#-]{0,29}$/.test(tag)) throw Object.assign(new Error('Technology tag: 1 to 30 letters, numbers, spaces, dots, dashes (for example angular or node-js).'), { code: 400 });
        // replaces the first tag and keeps the rest
        return (await InterviewQuestion.updateMany({ _id: { $in: ids } }, [{ $set: { tags: { $concatArrays: [[tag], { $slice: [{ $ifNull: ['$tags', []] }, 1, 50] }] } } }])).modifiedCount || 0;
    }
    throw Object.assign(new Error('That field cannot be changed in bulk.'), { code: 400 });
};

// POST /api/admin/bulk { resource, action, ids: [] }  (up to 200 ids). action 'set' also takes { field, value } (questions only).

export const bulkAction = async (req, res) => {
    try {
        const { resource, action } = req.body || {};
        const cfg = RESOURCES[resource];
        const isSet = action === 'set' && resource === 'questions';
        if (!cfg || (!isSet && !cfg.actions.includes(action))) return res.status(400).json({ message: 'That bulk action is not available for this list.' });
        const ids = [...new Set(Array.isArray(req.body.ids) ? req.body.ids.map(String) : [])].filter((x) => mongoose.isValidObjectId(x));
        if (!ids.length) return res.status(400).json({ message: 'Select at least one item.' });
        if (ids.length > 200) return res.status(400).json({ message: 'Select 200 items or fewer at a time.' });
        let done = 0;
        if (isSet) {
            done = await setQuestions(ids, req.body.field, req.body.value);
            if (res.locals) res.locals.auditMeta = { count: done, resource, field: String(req.body.field).slice(0, 20), value: String(req.body.value ?? '').slice(0, 40) };
            return res.status(200).json({ done, requested: ids.length });
        }
        if (action === 'delete') {
            if (resource === 'questions') await InterviewAnswer.deleteMany({ question: { $in: ids } });
            done = (await cfg.model.deleteMany({ _id: { $in: ids } })).deletedCount || 0;
        } else {
            done = (await cfg.model.updateMany({ _id: { $in: ids } }, { $set: { published: action === 'publish' } })).modifiedCount || 0;
        }
        if (res.locals) res.locals.auditMeta = { count: done, resource };
        return res.status(200).json({ done, requested: ids.length });
    } catch (e) { return res.status(e.code === 400 ? 400 : 500).json({ message: e.message }); }
};
