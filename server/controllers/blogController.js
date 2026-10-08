import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Page from "../models/Page.js";
import { slugify } from "../utils/slugify.js";


// ---------- Public ----------

// GET /api/blogs - list published posts for the /blog index page
export const getPublishedBlogs = async (req, res) => {
    try {
        const filter = { published: true };
        if (req.query.category) filter.category = String(req.query.category);
        const posts = await Blog.find(filter)
            .select('title slug description excerpt date readTime keywords category')
            .sort({ date: -1 });
        return res.status(200).json({ posts });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/blogs/:slug - a single published post
export const getPublishedBlogBySlug = async (req, res) => {
    try {
        const post = await Blog.findOneAndUpdate(
            { slug: req.params.slug, published: true },
            { $inc: { views: 1 } },
            { returnDocument: 'after' }
        );
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const cat = post.category ? await Category.findOne({ type: 'blog', slug: post.category }) : null;
        return res.status(200).json({ post: { ...post.toObject(), categoryName: cat?.name || '' } });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/blogs/categories - blog categories that have at least one published post
export const getBlogCategories = async (req, res) => {
    try {
        const counts = await Blog.aggregate([
            { $match: { published: true, category: { $ne: '' } } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);
        const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));
        const categories = (await Category.find({ type: 'blog' }).sort({ name: 1 }))
            .filter((c) => countMap[c.slug])
            .map((c) => ({ name: c.name, slug: c.slug, description: c.description, count: countMap[c.slug] }));
        return res.status(200).json({ categories });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/blogs/sitemap/slugs - just the slugs + lastmod, as JSON (kept for any
// other tooling that wants the raw list rather than XML).
export const getPublishedBlogSlugs = async (req, res) => {
    try {
        const posts = await Blog.find({ published: true }).select('slug updatedAt');
        return res.status(200).json({ posts });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/blogs/sitemap.xml - a real XML sitemap covering every published post.
// The frontend's build-time sitemap.xml can't list these (they're created live
// through /admin/blogs, long after the last `npm run build`), so this one is
// generated fresh on every request straight from the database instead. Referenced
// as a second Sitemap: line in client/public/robots.txt.
export const getBlogSitemapXml = async (req, res) => {
    try {
        const [posts, products, pages] = await Promise.all([
            Blog.find({ published: true }).select('slug updatedAt date'),
            Product.find({ published: true }).select('slug updatedAt'),
            Page.find({ published: true, system: false }).select('slug updatedAt'),
        ]);
        const siteUrl = process.env.CLIENT_URL || 'https://primeresumeai.com';

        const entry = (path, when, freq) =>
            `  <url>\n    <loc>${siteUrl}${path}</loc>\n    <lastmod>${new Date(when).toISOString().slice(0, 10)}</lastmod>\n    <changefreq>${freq}</changefreq>\n  </url>`;

        const urls = [
            ...posts.map((post) => entry(`/blog/${post.slug}`, post.updatedAt || post.date, 'monthly')),
            ...products.map((product) => entry(`/products/${product.slug}`, product.updatedAt, 'weekly')),
            ...pages.map((page) => entry(`/p/${page.slug}`, page.updatedAt, 'monthly')),
        ].join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        res.set('Content-Type', 'application/xml');
        return res.status(200).send(xml);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// ---------- Admin (protect + isAdmin applied in the router) ----------

// GET /api/admin/blogs - every post, drafts included
export const getAllBlogsAdmin = async (req, res) => {
    try {
        const posts = await Blog.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ posts });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/admin/blogs/:id - for loading the editor form
export const getBlogByIdAdmin = async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ post });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// POST /api/admin/blogs
export const createBlog = async (req, res) => {
    try {
        const { title, slug, description, keywords, excerpt, content, date, readTime, published, category } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const finalSlug = slugify(slug) || slugify(title);
        if (!finalSlug) {
            return res.status(400).json({ message: 'Could not generate a URL slug from the title - try setting one manually' });
        }

        const existing = await Blog.findOne({ slug: finalSlug });
        if (existing) {
            return res.status(400).json({ message: 'A post with this URL slug already exists' });
        }

        const post = await Blog.create({
            title: title.trim(),
            slug: finalSlug,
            description: description || '',
            keywords: keywords || '',
            excerpt: excerpt || '',
            content: Array.isArray(content) ? content : [],
            date: date || Date.now(),
            readTime: readTime || '',
            category: category || '',
            published: published !== undefined ? published : true,
        });

        return res.status(201).json({ message: 'Post created', post });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// PUT /api/admin/blogs/:id
export const updateBlog = async (req, res) => {
    try {
        const { title, slug, description, keywords, excerpt, content, date, readTime, published, category } = req.body;
        const post = await Blog.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (slug !== undefined) {
            const newSlug = slugify(slug) || slugify(title || post.title);
            if (newSlug !== post.slug) {
                const existing = await Blog.findOne({ slug: newSlug, _id: { $ne: post._id } });
                if (existing) {
                    return res.status(400).json({ message: 'A post with this URL slug already exists' });
                }
                post.slug = newSlug;
            }
        }

        if (title !== undefined) post.title = title.trim();
        if (description !== undefined) post.description = description;
        if (keywords !== undefined) post.keywords = keywords;
        if (excerpt !== undefined) post.excerpt = excerpt;
        if (Array.isArray(content)) post.content = content;
        if (date !== undefined) post.date = date;
        if (readTime !== undefined) post.readTime = readTime;
        if (category !== undefined) post.category = category;
        if (published !== undefined) post.published = published;

        await post.save();
        return res.status(200).json({ message: 'Post updated', post });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// DELETE /api/admin/blogs/:id
export const deleteBlog = async (req, res) => {
    try {
        const post = await Blog.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
