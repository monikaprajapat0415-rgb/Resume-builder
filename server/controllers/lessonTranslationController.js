import mongoose from "mongoose";
import Lesson from "../models/Lesson.js";
import { LESSON_LANGS, applyUnits, draftWithAi, hashOf, isStale, rowsFor, unitsOf } from "../utils/lessonTranslate.js";
import { defaultRouter } from "../utils/aiRouter.js";

const find = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id) || !LESSON_LANGS[req.params.lang]) { res.status(404).json({ message: 'Not found' }); return null; }
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) { res.status(404).json({ message: 'Lesson not found' }); return null; }
    return lesson;
};
const save = async (lesson, lang, value, extra) => {
    lesson.set(`translations.${lang}`, { ...value, ...extra, sourceHash: hashOf(lesson), at: new Date() });
    lesson.markModified('translations');
    await lesson.save({ timestamps: false });
};

// GET /api/admin/learn/lessons/:id/translations  -> a summary of every language
export const listTranslations = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Lesson not found' });
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        const total = unitsOf(lesson).length;
        const langs = Object.entries(LESSON_LANGS).map(([code, name]) => {
            const t = lesson.translations?.[code];
            const done = t ? rowsFor(lesson, code).filter((r) => r.tr).length : 0;
            return { code, name, exists: Boolean(t), done, total, published: Boolean(t?.published), status: t?.status || '', stale: isStale(lesson, code) };
        });
        return res.status(200).json({ langs });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// GET .../translations/:lang -> side by side rows
export const getTranslation = async (req, res) => {
    try {
        const lesson = await find(req, res); if (!lesson) return;
        const t = lesson.translations?.[req.params.lang];
        return res.status(200).json({ rows: rowsFor(lesson, req.params.lang), published: Boolean(t?.published), status: t?.status || '', stale: isStale(lesson, req.params.lang) });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// PUT .../translations/:lang { units: { key: text }, published, status }
export const saveTranslation = async (req, res) => {
    try {
        const lesson = await find(req, res); if (!lesson) return;
        const { value, rejected, done } = applyUnits(lesson, req.body?.units || {});
        if (rejected.length) return res.status(400).json({ message: `${rejected.length} line(s) cannot be saved: ${rejected.slice(0, 3).map((r) => `${r.k} (${r.why})`).join('; ')}`, rejected });
        const publish = req.body?.published === true;
        if (publish && done === 0) return res.status(400).json({ message: 'Translate at least one line before you publish.' });
        await save(lesson, req.params.lang, value, { published: publish, status: req.body?.status === 'machine' ? 'machine' : 'reviewed' });
        return res.status(200).json({ message: publish ? 'Saved and visible to readers.' : 'Saved as a draft.', done });
    } catch (e) { return res.status(400).json({ message: e.message }); }
};

// DELETE .../translations/:lang
export const deleteTranslation = async (req, res) => {
    try {
        const lesson = await find(req, res); if (!lesson) return;
        lesson.set(`translations.${req.params.lang}`, undefined);
        lesson.markModified('translations');
        await lesson.save({ timestamps: false });
        return res.status(200).json({ message: 'Translation removed. Readers see English again.' });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// POST .../translations/:lang/draft  -> machine draft, never published automatically
export const draftTranslation = async (req, res) => {
    try {
        const lesson = await find(req, res); if (!lesson) return;
        const r = await draftWithAi(lesson, req.params.lang, (s, u, o) => (req.app?.locals?.aiCall || defaultRouter().call)(s, u, o));
        const { value } = applyUnits(lesson, r.map);
        await save(lesson, req.params.lang, value, { published: false, status: 'machine' });
        return res.status(200).json({ message: `Draft made: ${r.translated} lines translated, ${r.skipped.length} left in English. Review it, then publish.`, translated: r.translated, skipped: r.skipped.length });
    } catch (e) { return res.status(e.allFailed ? 503 : 500).json({ message: e.allFailed ? 'No AI provider answered. Check the AI keys, or translate by hand.' : e.message }); }
};
