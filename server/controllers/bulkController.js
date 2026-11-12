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

// POST /api/admin/bulk { resource, action, ids: [] }  (up to 200 ids)
export const bulkAction = async (req, res) => {
    try {
        const { resource, action } = req.body || {};
        const cfg = RESOURCES[resource];
        if (!cfg || !cfg.actions.includes(action)) return res.status(400).json({ message: 'That bulk action is not available for this list.' });
        const ids = [...new Set(Array.isArray(req.body.ids) ? req.body.ids.map(String) : [])].filter((x) => mongoose.isValidObjectId(x));
        if (!ids.length) return res.status(400).json({ message: 'Select at least one item.' });
        if (ids.length > 200) return res.status(400).json({ message: 'Select 200 items or fewer at a time.' });
        let done = 0;
        if (action === 'delete') {
            if (resource === 'questions') await InterviewAnswer.deleteMany({ question: { $in: ids } });
            done = (await cfg.model.deleteMany({ _id: { $in: ids } })).deletedCount || 0;
        } else {
            done = (await cfg.model.updateMany({ _id: { $in: ids } }, { $set: { published: action === 'publish' } })).modifiedCount || 0;
        }
        if (res.locals) res.locals.auditMeta = { count: done, resource };
        return res.status(200).json({ done, requested: ids.length });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
