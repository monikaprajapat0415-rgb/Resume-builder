import mongoose from "mongoose";

// A tutorial series (e.g. "Angular Tutorial"). Its lessons live in the Lesson collection
// and are grouped on the course page by each lesson's `section`.
const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },      // meta description + intro on the course page
    summary: { type: String, default: '' },          // short line for the cards on /learn
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All levels'], default: 'All levels' },
    topic: { type: String, default: '' },            // e.g. "Frontend", "Backend", "AI" (used to group cards)
    badge: { type: String, default: '' },            // 1-3 letters shown on the card when there is no cover, e.g. "NG"
    coverImage: { type: String, default: '' },
    coverAlt: { type: String, default: '' },
    tags: { type: [String], default: [] },
    author: { type: String, default: 'Prime Resume AI Team' },
    order: { type: Number, default: 0 },             // position on /learn (lower first)
    published: { type: Boolean, default: false },
    metaTitle: { type: String, default: '' },
    keywords: { type: String, default: '' },
    noindex: { type: Boolean, default: false },
    modifiedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("Course", CourseSchema);
