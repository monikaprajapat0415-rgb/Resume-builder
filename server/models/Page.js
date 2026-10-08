import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema({
    type: { type: String, enum: ['heading', 'paragraph', 'list'], required: true },
    text: { type: String },
    items: { type: [String], default: undefined },
}, { _id: false });

// Editable site pages. `system` pages (privacy policy, terms) keep their original
// URL and can't be deleted; every other page is served at /p/<slug>.
const PageSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    content: { type: [BlockSchema], default: [] },
    published: { type: Boolean, default: true },
    system: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Page", PageSchema);
