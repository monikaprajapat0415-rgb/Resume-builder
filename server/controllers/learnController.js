import fs from "node:fs";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import LessonFeedback from "../models/LessonFeedback.js";
import InterviewQuestion from "../models/InterviewQuestion.js";
import { slugify } from "../utils/slugify.js";
import { cleanBlogBlocks } from "../utils/blogSeo.js";
import { downloadPath, isZip, safeName, saveUpload, removeUpload } from "../utils/learnFiles.js";
import { cleanAnimation } from "../utils/lessonAnimation.js";
import { LESSON_LANGS, publishedLangs } from "../utils/lessonTranslate.js";
import { cleanCourseFields, cleanLessonFields, courseCard, courseView, lessonView } from "../utils/learnSeo.js";

const validId = (id) => mongoose.isValidObjectId(id);
const LESSON_LIST_FIELDS = 'title slug section order description readTime';
const byOrder = { order: 1, createdAt: 1 };

// ---------- shared loaders (also used by the server-rendered pages) ----------

export const loadCourseView = async (slug) => {
    const course = await Course.findOne({ slug, published: true });
    if (!course) return null;
    const lessons = await Lesson.find({ course: course._id, published: true }).select(LESSON_LIST_FIELDS).sort(byOrder);
    return courseView(course, lessons);
};

// Published interview questions that Admin linked to this course or lesson (Admin > Interview questions > "Course to link" and "Lesson to link").
// Questions linked to this very lesson come first, then others from the same course. Shown on the lesson page and in its server-rendered HTML as plain links.
const interviewLinks = async (courseSlug, lessonSlug) => {
    try {
        const qs = await InterviewQuestion.find({ published: true, learnCourse: courseSlug }).sort({ order: 1 }).select('question slug level learnLesson').lean();
        const mine = qs.filter((q) => q.learnLesson === lessonSlug);
        const rest = qs.filter((q) => q.learnLesson !== lessonSlug);
        return [...mine, ...rest].slice(0, 5).map((q) => ({ question: q.question, slug: q.slug, level: q.level }));
    } catch { return []; }
};

export const loadLessonView = async (courseSlug, lessonSlug, { count = false, lang = '' } = {}) => {
    const course = await Course.findOne({ slug: courseSlug, published: true });
    if (!course) return null;
    const lessons = await Lesson.find({ course: course._id, published: true }).select(`${LESSON_LIST_FIELDS} _id`).sort(byOrder);
    const q = { course: course._id, slug: lessonSlug, published: true };
    const lesson = count
        ? await Lesson.findOneAndUpdate(q, { $inc: { views: 1 } }, { returnDocument: 'after', timestamps: false })
        : await Lesson.findOne(q);
    if (!lesson) return null;
    const v = lessonView(course, lesson, lessons);
    const interviewQuestions = await interviewLinks(courseSlug, lessonSlug);
    // Reader language: use a published translation when there is one. SEO data, canonical and the
    // server-rendered page stay English, so search engines still see one original.
    const languages = publishedLangs(lesson);
    const t = lang && lang !== 'en' && LESSON_LANGS[lang] ? lesson.translations?.[lang] : null;
    if (t && t.published) {
        const base = typeof lesson.toObject === 'function' ? lesson.toObject() : lesson;
        const vt = lessonView(course, { ...base, title: t.title || base.title, description: t.description || base.description, content: t.content || base.content, faqs: t.faqs || base.faqs, quiz: t.quiz || base.quiz, notes: t.notes || base.notes }, lessons);
        return { ...vt, interviewQuestions, seo: v.seo, jsonLd: v.jsonLd, breadcrumbs: v.breadcrumbs, translation: { lang, status: t.status || 'reviewed' }, languages };
    }
    return { ...v, interviewQuestions, translation: null, languages };
};

export const listPublishedCourses = async () => {
    const [courses, counts] = await Promise.all([
        Course.find({ published: true }).sort({ order: 1, createdAt: 1 }),
        Lesson.aggregate([{ $match: { published: true } }, { $group: { _id: '$course', n: { $sum: 1 } } }]),
    ]);
    const map = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
    return courses.filter((c) => map[String(c._id)]).map((c) => courseCard(c, map[String(c._id)]));
};

// ---------- Public ----------

// GET /api/learn
export const getCourses = async (req, res) => {
    try {
        return res.status(200).json({ courses: await listPublishedCourses() });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// GET /api/learn/:course
export const getCourse = async (req, res) => {
    try {
        const v = await loadCourseView(req.params.course);
        if (!v) return res.status(404).json({ message: 'Course not found' });
        return res.status(200).json(v);
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// GET /api/learn/:course/:lesson
export const getLesson = async (req, res) => {
    try {
        const v = await loadLessonView(req.params.course, req.params.lesson, { count: true, lang: String(req.query.lang || '').slice(0, 5) });
        if (!v) return res.status(404).json({ message: 'Lesson not found' });
        return res.status(200).json(v);
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// ---------- Admin: courses ----------

export const getCoursesAdmin = async (req, res) => {
    try {
        const [courses, totals, lives] = await Promise.all([
            Course.find({}).sort({ order: 1, createdAt: 1 }),
            Lesson.aggregate([{ $group: { _id: '$course', n: { $sum: 1 } } }]),
            Lesson.aggregate([{ $match: { published: true } }, { $group: { _id: '$course', n: { $sum: 1 } } }]),
        ]);
        const total = Object.fromEntries(totals.map((c) => [String(c._id), c.n]));
        const live = Object.fromEntries(lives.map((c) => [String(c._id), c.n]));
        return res.status(200).json({
            courses: courses.map((c) => ({ ...c.toObject(), lessonCount: total[String(c._id)] || 0, publishedLessons: live[String(c._id)] || 0 })),
        });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

export const getCourseAdmin = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Course not found' });
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        return res.status(200).json({ course });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

export const createCourse = async (req, res) => {
    try {
        const { title, slug } = req.body;
        if (!title || !String(title).trim()) return res.status(400).json({ message: 'Title is required' });
        const finalSlug = slugify(slug) || slugify(title);
        if (!finalSlug) return res.status(400).json({ message: 'Could not generate a URL slug from the title - try setting one manually' });
        if (await Course.findOne({ slug: finalSlug })) return res.status(400).json({ message: 'A course with this URL slug already exists' });
        const course = await Course.create({ title: String(title).trim().slice(0, 150), slug: finalSlug, modifiedAt: new Date(), ...cleanCourseFields(req.body) });
        return res.status(201).json({ message: 'Course created', course });
    } catch (e) { return res.status(400).json({ message: e.message }); }
};

export const updateCourse = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Course not found' });
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        const { title, slug } = req.body;
        if (slug !== undefined) {
            const next = slugify(slug) || slugify(title || course.title);
            if (next !== course.slug) {
                if (await Course.findOne({ slug: next, _id: { $ne: course._id } })) return res.status(400).json({ message: 'A course with this URL slug already exists' });
                course.slug = next;
            }
        }
        if (title !== undefined) {
            if (!String(title).trim()) return res.status(400).json({ message: 'Title is required' });
            course.title = String(title).trim().slice(0, 150);
        }
        Object.assign(course, cleanCourseFields(req.body));
        course.modifiedAt = new Date();
        await course.save();
        return res.status(200).json({ message: 'Course updated', course });
    } catch (e) { return res.status(400).json({ message: e.message }); }
};

export const deleteCourse = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Course not found' });
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        const withFiles = await Lesson.find({ course: course._id, 'download.builtin': false }).select('download');
        for (const l of withFiles) removeUpload(l.download?.file);
        const { deletedCount } = await Lesson.deleteMany({ course: course._id });
        await LessonFeedback.deleteMany({ course: course._id });
        return res.status(200).json({ message: 'Course deleted', lessonsDeleted: deletedCount });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// ---------- Admin: lessons ----------

export const getLessonsAdmin = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Course not found' });
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        const lessons = await Lesson.find({ course: course._id }).select('title slug section order published description readTime views updatedAt').sort(byOrder);
        return res.status(200).json({ course, lessons });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

export const getLessonAdmin = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Lesson not found' });
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        const course = await Course.findById(lesson.course).select('title slug');
        return res.status(200).json({ lesson, course });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

export const createLesson = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Course not found' });
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        const { title, slug, content } = req.body;
        if (!title || !String(title).trim()) return res.status(400).json({ message: 'Title is required' });
        const finalSlug = slugify(slug) || slugify(title);
        if (!finalSlug) return res.status(400).json({ message: 'Could not generate a URL slug from the title - try setting one manually' });
        if (await Lesson.findOne({ course: course._id, slug: finalSlug })) return res.status(400).json({ message: 'A lesson with this URL slug already exists in this course' });
        const last = await Lesson.findOne({ course: course._id }).sort({ order: -1 }).select('order');
        const lesson = await Lesson.create({
            course: course._id, title: String(title).trim().slice(0, 200), slug: finalSlug,
            order: last ? last.order + 1 : 0, content: cleanBlogBlocks(content), modifiedAt: new Date(), ...cleanLessonFields(req.body),
        });
        return res.status(201).json({ message: 'Lesson created', lesson });
    } catch (e) { return res.status(400).json({ message: e.message }); }
};

export const updateLesson = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Lesson not found' });
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        const { title, slug, content } = req.body;
        if (slug !== undefined) {
            const next = slugify(slug) || slugify(title || lesson.title);
            if (next !== lesson.slug) {
                if (await Lesson.findOne({ course: lesson.course, slug: next, _id: { $ne: lesson._id } })) return res.status(400).json({ message: 'A lesson with this URL slug already exists in this course' });
                lesson.slug = next;
            }
        }
        if (title !== undefined) {
            if (!String(title).trim()) return res.status(400).json({ message: 'Title is required' });
            lesson.title = String(title).trim().slice(0, 200);
        }
        if (Array.isArray(content)) lesson.content = cleanBlogBlocks(content);
        Object.assign(lesson, cleanLessonFields(req.body));
        lesson.modifiedAt = new Date();
        await lesson.save();
        return res.status(200).json({ message: 'Lesson updated', lesson });
    } catch (e) { return res.status(400).json({ message: e.message }); }
};

export const deleteLesson = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Lesson not found' });
        const lesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        await LessonFeedback.deleteMany({ lesson: lesson._id });
        if (lesson.download && !lesson.download.builtin) removeUpload(lesson.download.file);
        return res.status(200).json({ message: 'Lesson deleted' });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// PUT /api/admin/learn/courses/:id/reorder  { items: [{ id, section }] } - the new order, top to bottom
export const reorderLessons = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Course not found' });
        const items = Array.isArray(req.body.items) ? req.body.items : [];
        const ids = items.map((i) => String(i?.id));
        if (!ids.length || ids.some((i) => !validId(i)) || new Set(ids).size !== ids.length) return res.status(400).json({ message: 'Invalid order' });
        const owned = await Lesson.countDocuments({ course: req.params.id, _id: { $in: ids } });
        if (owned !== ids.length) return res.status(400).json({ message: 'Some lessons do not belong to this course' });
        await Lesson.bulkWrite(items.map((it, index) => ({
            updateOne: { filter: { _id: it.id, course: req.params.id }, update: { $set: { order: index, ...(it.section !== undefined ? { section: String(it.section).trim().slice(0, 80) } : {}) } } },
        })), { timestamps: false });
        return res.status(200).json({ message: 'Order saved' });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// POST /api/admin/learn/import  { course: {...}, lessons: [{...}], replace?: boolean }
// Creates a whole course (settings + every lesson, in the order given) in one go.
// With replace: true an existing course with the same slug is updated and its lessons are replaced.
export const importCourse = async (req, res) => {
    try {
        const { course: c, lessons, replace } = req.body || {};
        if (!c || typeof c !== 'object' || !String(c.title || '').trim()) return res.status(400).json({ message: 'The file needs a course with a title.' });
        if (!Array.isArray(lessons) || !lessons.length) return res.status(400).json({ message: 'The file needs at least one lesson.' });
        if (lessons.length > 300) return res.status(400).json({ message: 'Too many lessons (300 max).' });

        const slug = slugify(c.slug) || slugify(c.title);
        if (!slug) return res.status(400).json({ message: 'Could not make a URL slug for the course.' });

        const seen = new Set();
        const prepared = [];
        for (const [i, l] of lessons.entries()) {
            if (!l || !String(l.title || '').trim()) return res.status(400).json({ message: `Lesson ${i + 1} has no title.` });
            const lslug = slugify(l.slug) || slugify(l.title);
            if (!lslug) return res.status(400).json({ message: `Lesson ${i + 1} ("${l.title}") has no usable URL slug.` });
            if (seen.has(lslug)) return res.status(400).json({ message: `Two lessons share the URL slug "${lslug}".` });
            seen.add(lslug);
            prepared.push({ title: String(l.title).trim().slice(0, 200), slug: lslug, order: i, content: cleanBlogBlocks(l.content), ...cleanLessonFields(l) });
        }

        let course = await Course.findOne({ slug });
        let oldSlugOf = null;
        let oldDownloads = {};
        if (course && !replace) return res.status(409).json({ message: `A course with the URL slug "${slug}" already exists. Tick "replace" to overwrite it.`, exists: true });
        if (course) {
            course.title = String(c.title).trim().slice(0, 150);
            Object.assign(course, cleanCourseFields(c));
            course.modifiedAt = new Date();
            await course.save();
            // Readers' comments belong to a lesson id; keep them across a re-import by matching on slug.
            const oldLessons = await Lesson.find({ course: course._id }).select('slug download');
            oldSlugOf = Object.fromEntries(oldLessons.map((l) => [String(l._id), l.slug]));
            oldDownloads = Object.fromEntries(oldLessons.filter((l) => l.download?.file).map((l) => [l.slug, l.download.toObject()]));
            await Lesson.deleteMany({ course: course._id });
        } else {
            course = await Course.create({ title: String(c.title).trim().slice(0, 150), slug, modifiedAt: new Date(), ...cleanCourseFields(c) });
        }
        const now = new Date();
        const created = await Lesson.insertMany(prepared.map((l) => ({ ...l, ...(oldDownloads[l.slug] ? { download: oldDownloads[l.slug] } : {}), course: course._id, modifiedAt: now })));
        // Uploaded zips of lessons that no longer exist are deleted; the rest moved to the new lesson rows above.
        for (const [lslug, d] of Object.entries(oldDownloads)) if (!d.builtin && !seen.has(lslug)) removeUpload(d.file);
        if (oldSlugOf) {
            const newIdOf = Object.fromEntries(created.map((l) => [l.slug, l._id]));
            for (const [oldId, lessonSlug] of Object.entries(oldSlugOf)) {
                if (newIdOf[lessonSlug]) await LessonFeedback.updateMany({ lesson: oldId }, { lesson: newIdOf[lessonSlug] });
                else await LessonFeedback.deleteMany({ lesson: oldId });
            }
        }
        return res.status(201).json({ message: 'Course imported', course, lessons: prepared.length });
    } catch (e) { return res.status(400).json({ message: e.message }); }
};

// ---------- solution zip: admin upload / remove, public download ----------

export const uploadLessonDownload = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Lesson not found' });
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        const f = req.file;
        if (!f) return res.status(400).json({ message: 'Choose a .zip file to upload.' });
        if (!isZip(f.buffer)) return res.status(400).json({ message: 'That file is not a valid .zip archive.' });
        const old = lesson.download;
        const name = safeName(req.body?.name || f.originalname);
        const file = saveUpload(f.buffer);
        lesson.download = { name, file, size: f.buffer.length, builtin: false, uploadedAt: new Date() };
        lesson.modifiedAt = new Date();
        await lesson.save();
        if (old && !old.builtin) removeUpload(old.file);
        return res.status(200).json({ message: 'Solution uploaded', download: lesson.download });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

export const removeLessonDownload = async (req, res) => {
    try {
        if (!validId(req.params.id)) return res.status(404).json({ message: 'Lesson not found' });
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        const old = lesson.download;
        lesson.download = undefined;
        lesson.modifiedAt = new Date();
        await lesson.save();
        if (old && !old.builtin) removeUpload(old.file);
        return res.status(200).json({ message: 'Solution removed' });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

export const downloadLessonFile = async (req, res) => {
    try {
        const course = await Course.findOne({ slug: String(req.params.course), published: true }).select('_id');
        if (!course) return res.status(404).json({ message: 'Not found' });
        const lesson = await Lesson.findOne({ course: course._id, slug: String(req.params.lesson), published: true }).select('download');
        const full = downloadPath(lesson?.download);
        if (!full || !fs.existsSync(full)) return res.status(404).json({ message: 'Not found' });
        res.setHeader('Cache-Control', 'private, no-cache');
        res.setHeader('X-Robots-Tag', 'noindex');
        return res.download(full, lesson.download.name || 'solution.zip');
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// POST /api/admin/learn/animation/preview  { animation } - the cleaned animation, or the reason it is not valid
export const previewAnimation = (req, res) => {
    try {
        const animation = cleanAnimation(req.body?.animation);
        if (!animation) return res.status(400).json({ message: 'Animation: nothing to show yet.' });
        return res.status(200).json({ animation });
    } catch (e) { return res.status(400).json({ message: e.message }); }
};
