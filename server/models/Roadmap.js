import mongoose from "mongoose";

// A career roadmap for job seekers (e.g. "Warehouse worker to supervisor"): an ordered list of steps,
// each with what to learn, a suggested pace, tips and links to pages on this site.
const StepSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    pace: { type: String, default: '' },               // suggested pace, e.g. "First month"
    skills: { type: [String], default: [] },
    tips: { type: [String], default: [] },
    links: { type: [{ label: String, url: String }], default: [] },
}, { _id: false });

const RoadmapSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, default: '' },            // short line for the cards on /roadmaps
    description: { type: String, default: '' },        // meta description + intro on the page
    audience: { type: String, default: '' },           // e.g. "Factory & warehouse", used to group cards
    badge: { type: String, default: '' },              // 1-3 letters on the card
    steps: { type: [StepSchema], default: [] },
    faqs: { type: [{ q: String, a: String }], default: [] },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    metaTitle: { type: String, default: '' },
    keywords: { type: String, default: '' },
    noindex: { type: Boolean, default: false },
    modifiedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("Roadmap", RoadmapSchema);
