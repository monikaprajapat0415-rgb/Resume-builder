import mongoose from "mongoose";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import { slugify } from "../utils/slugify.js";
import { cleanBlogBlocks } from "../utils/blogSeo.js";
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

export const loadLessonView = async (courseSlug, lessonSlug, { count = false } = {}) => {
    const course = await Course.findOne({ slug: courseSlug, published: true });
    if (!course) return null;
    const lessons = await Lesson.find({ course: course._id, published: true }).select(`${LESSON_LIST_FIELDS} _id`).sort(byOrder);
    const q = { course: course._id, slug: lessonSlug, published: true };
    const lesson = count
        ? await Lesson.findOneAndUpdate(q, { $inc: { views: 1 } }, { returnDocument: 'after', timestamps: false })
        : await Lesson.findOne(q);
    if (!lesson) return null;
    return lessonView(course, lesson, lessons);
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
        const v = await loadLessonView(req.params.course, req.params.lesson, { count: true });
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
        const { deletedCount } = await Lesson.deleteMany({ course: course._id });
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
