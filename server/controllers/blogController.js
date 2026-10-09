import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Page from "../models/Page.js";
import { slugify } from "../utils/slugify.js";
import { cleanBlogBlocks, cleanSeoFields, siteUrl, absUrl, listItem } from "../utils/blogSeo.js";
import { loadPostView } from "./blogSeoController.js";


// ---------- Public ----------

// GET /api/blogs - list published posts for the /blog index page
export const getPublishedBlogs = async (req, res) => {
    try {
        const filter = { published: true };
        if (req.query.category) filter.category = String(req.query.category);
        const [posts, cats] = await Promise.all([
            Blog.find(filter).select('title slug description excerpt date readTime keywords category coverImage coverAlt author').sort({ date: -1 }),
            Category.find({ type: 'blog' }),
        ]);
        const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
        return res.status(200).json({ posts: posts.map((p) => listItem(p, names[p.category] || '')) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/blogs/:slug - a single published post, with its SEO data, table of contents,
// related posts and structured data (JSON-LD) ready to use.
export const getPublishedBlogBySlug = async (req, res) => {
    try {
        const post = await loadPostView(req.params.slug, { count: true });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ post });
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
        const [posts, products, pages, cats] = await Promise.all([
            Blog.find({ published: true, noindex: { $ne: true } }).select('slug updatedAt date modifiedAt coverImage coverAlt title category'),
            Product.find({ published: true }).select('slug updatedAt'),
            Page.find({ published: true, system: false }).select('slug updatedAt'),
            Category.find({ type: 'blog' }),
        ]);
        const base = siteUrl();
        const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const day = (d) => new Date(d).toISOString().slice(0, 10);

        const entry = (path, when, freq, extra = '') =>
            `  <url>\n    <loc>${esc(base + path)}</loc>\n    <lastmod>${day(when)}</lastmod>\n    <changefreq>${freq}</changefreq>${extra}\n  </url>`;

        // Category pages: lastmod = newest post in the category.
        const newest = {};
        posts.forEach((p) => { const t = +new Date(p.modifiedAt || p.date); if (p.category && (!newest[p.category] || t > newest[p.category])) newest[p.category] = t; });

        const urls = [
            ...posts.map((post) => {
                const img = absUrl(post.coverImage);
                return entry(`/blog/${post.slug}`, post.modifiedAt || post.date, 'monthly',
                    img ? `\n    <image:image><image:loc>${esc(img)}</image:loc><image:title>${esc(post.title)}</image:title></image:image>` : '');
            }),
            ...cats.filter((c) => newest[c.slug]).map((c) => entry(`/blog/category/${c.slug}`, newest[c.slug], 'weekly')),
            ...products.map((product) => entry(`/products/${product.slug}`, product.updatedAt, 'weekly')),
            ...pages.map((page) => entry(`/p/${page.slug}`, page.updatedAt, 'monthly')),
        ].join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>`;

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
        const { title, slug, excerpt, content, date, readTime, published, category } = req.body;
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
            excerpt: excerpt || '',
            content: cleanBlogBlocks(content),
            date: date || Date.now(),
            modifiedAt: new Date(),
            readTime: readTime || '',
            category: category || '',
            published: published !== undefined ? published : true,
            ...cleanSeoFields(req.body),
        });

        return res.status(201).json({ message: 'Post created', post });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// PUT /api/admin/blogs/:id
export const updateBlog = async (req, res) => {
    try {
        const { title, slug, excerpt, content, date, readTime, published, category } = req.body;
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
        if (excerpt !== undefined) post.excerpt = excerpt;
        if (Array.isArray(content)) post.content = cleanBlogBlocks(content);
        if (date !== undefined) post.date = date;
        if (readTime !== undefined) post.readTime = readTime;
        if (category !== undefined) post.category = category;
        if (published !== undefined) post.published = published;
        Object.assign(post, cleanSeoFields(req.body));
        post.modifiedAt = new Date();

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
