import mongoose from "mongoose";

// A block mirrors the simple structure the frontend already renders:
// heading/paragraph use `text`, list uses `items`. Kept as Mixed-ish subdocuments
// rather than a strict union so the admin editor can save either shape freely.
const BlogBlockSchema = new mongoose.Schema({
    type: { type: String, enum: ['heading', 'paragraph', 'list', 'olist', 'image', 'code', 'note'], required: true },
    text: { type: String },
    items: { type: [String], default: undefined },
    // image blocks
    url: { type: String },
    alt: { type: String },
    caption: { type: String },
    // code blocks (used by Learn lessons)
    lang: { type: String },
}, { _id: false });

const FaqSchema = new mongoose.Schema({ q: { type: String, required: true }, a: { type: String, required: true } }, { _id: false });
const SourceSchema = new mongoose.Schema({ title: { type: String, required: true }, url: { type: String, required: true } }, { _id: false });

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    keywords: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    content: { type: [BlogBlockSchema], default: [] },
    date: { type: Date, default: Date.now },
    readTime: { type: String, default: '' },
    // Category.slug (type: blog). Empty string = uncategorised.
    category: { type: String, default: '' },
    author: { type: String, default: 'Prime Resume AI Team' },
    // Drafts (published: false) are returned to the admin portal only, never to
    // the public /api/blogs endpoints or the sitemap.
    published: { type: Boolean, default: true },
    views: { type: Number, default: 0 },

    // ---- SEO / GEO ----
    metaTitle: { type: String, default: '' },          // <title> override (aim for <= 60 chars)
    focusKeyword: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    coverAlt: { type: String, default: '' },
    takeaways: { type: [String], default: [] },        // "Key takeaways" - short, quotable answers shown at the top
    faqs: { type: [FaqSchema], default: [] },          // rendered on the page AND emitted as FAQPage schema
    sources: { type: [SourceSchema], default: [] },    // references / citations
    tags: { type: [String], default: [] },
    authorBio: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    noindex: { type: Boolean, default: false },
    // Real "last edited" date. Not `updatedAt`: that also changes on every page view
    // (view counter), which would make search engines think the post changes constantly.
    modifiedAt: { type: Date },
}, { timestamps: true });

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
