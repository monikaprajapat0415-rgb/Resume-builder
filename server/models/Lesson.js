import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema({
    type: { type: String, enum: ['heading', 'paragraph', 'list', 'olist', 'image', 'code', 'note'], required: true },
    text: { type: String },
    items: { type: [String], default: undefined },
    url: { type: String },
    alt: { type: String },
    caption: { type: String },
    lang: { type: String },
}, { _id: false });

const FaqSchema = new mongoose.Schema({ q: { type: String, required: true }, a: { type: String, required: true } }, { _id: false });

// Optional solution zip. builtin = shipped in the repo (learn-labs/<lab>/zips); otherwise uploaded by an admin.
const DownloadSchema = new mongoose.Schema({
    name: { type: String, default: '' },      // file name the reader gets
    file: { type: String, default: '' },      // stored file name (uploads) or "<lab>/<file>" (builtin)
    size: { type: Number, default: 0 },
    builtin: { type: Boolean, default: false },
    uploadedAt: { type: Date },
}, { _id: false });

const LessonSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },          // unique within its course
    section: { type: String, default: '' },          // chapter heading shown in the course menu, e.g. "Components"
    order: { type: Number, default: 0 },             // position inside the whole course (lower first)
    description: { type: String, default: '' },      // meta description / lesson summary
    content: { type: [BlockSchema], default: [] },
    faqs: { type: [FaqSchema], default: [] },
    readTime: { type: String, default: '' },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    metaTitle: { type: String, default: '' },
    keywords: { type: String, default: '' },
    noindex: { type: Boolean, default: false },
    download: { type: DownloadSchema, default: undefined },
    modifiedAt: { type: Date },
}, { timestamps: true });

LessonSchema.index({ course: 1, slug: 1 }, { unique: true });

export default mongoose.model("Lesson", LessonSchema);
