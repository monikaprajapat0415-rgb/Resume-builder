import mongoose from "mongoose";

// A block mirrors the simple structure the frontend already renders:
// heading/paragraph use `text`, list uses `items`. Kept as Mixed-ish subdocuments
// rather than a strict union so the admin editor can save either shape freely.
const BlogBlockSchema = new mongoose.Schema({
    type: { type: String, enum: ['heading', 'paragraph', 'list'], required: true },
    text: { type: String },
    items: { type: [String], default: undefined },
}, { _id: false });

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    keywords: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    content: { type: [BlogBlockSchema], default: [] },
    date: { type: Date, default: Date.now },
    readTime: { type: String, default: '' },
    author: { type: String, default: 'Prime Resume AI Team' },
    // Drafts (published: false) are returned to the admin portal only, never to
    // the public /api/blogs endpoints or the sitemap.
    published: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
}, { timestamps: true });

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
