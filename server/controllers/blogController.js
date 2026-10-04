import Blog from "../models/Blog.js";

const slugify = (str) =>
    (str || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

// ---------- Public ----------

// GET /api/blogs - list published posts for the /blog index page
export const getPublishedBlogs = async (req, res) => {
    try {
        const posts = await Blog.find({ published: true })
            .select('title slug description excerpt date readTime keywords')
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
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ post });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/blogs/sitemap/slugs - just the slugs + lastmod, for the backend-generated
// sitemap entries so new admin posts get discovered without a frontend rebuild.
export const getPublishedBlogSlugs = async (req, res) => {
    try {
        const posts = await Blog.find({ published: true }).select('slug updatedAt');
        return res.status(200).json({ posts });
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
        const { title, slug, description, keywords, excerpt, content, date, readTime, published } = req.body;
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
        const { title, slug, description, keywords, excerpt, content, date, readTime, published } = req.body;
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
