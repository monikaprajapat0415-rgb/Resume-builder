import fs from 'fs';
import User from "../models/User.js";
import Resume from "../models/Resume.js";
import Blog from "../models/Blog.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Message from "../models/Message.js";
import imagekit from "../configs/imageKit.js";
import { slugify } from "../utils/slugify.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/admin/stats - everything the overview page shows, in one round trip
export const getStats = async (req, res) => {
    try {
        const DAY = 864e5;
        const IST = 5.5 * 36e5; // day buckets use India time, matching how you read the dashboard
        const now = Date.now();
        const since = new Date(now - 15 * DAY);
        const week = new Date(now - 7 * DAY);

        const [
            totalUsers, verifiedUsers, adminUsers, newUsers7d, recentSignups, totalResumes,
            blogs, products, topPosts, topProducts, recentUsers, unreadMessages, totalMessages,
        ] = await Promise.all([
            User.countDocuments({}),
            User.countDocuments({ isVerified: true }),
            User.countDocuments({ role: 'admin' }),
            User.countDocuments({ createdAt: { $gte: week } }),
            User.find({ createdAt: { $gte: since } }).select('createdAt'),
            Resume.countDocuments({}),
            Blog.find({}).select('published views'),
            Product.find({}).select('published views clicks'),
            Blog.find({ published: true }).select('title slug views').sort({ views: -1 }).limit(5),
            Product.find({}).select('title slug views clicks published').sort({ clicks: -1, views: -1 }).limit(5),
            User.find({}).select('name email role createdAt authProvider').sort({ createdAt: -1 }).limit(5),
            Message.countDocuments({ read: false, archived: false }),
            Message.countDocuments({}),
        ]);

        // 14 day buckets ending today, so days with no sign-ups still show as empty bars.
        const dayKey = (t) => new Date(t + IST).toISOString().slice(0, 10);
        const counts = {};
        recentSignups.forEach((u) => { const k = dayKey(new Date(u.createdAt).getTime()); counts[k] = (counts[k] || 0) + 1; });
        const signupsByDay = [];
        for (let i = 13; i >= 0; i--) {
            const d = dayKey(now - i * DAY);
            signupsByDay.push({ date: d, count: counts[d] || 0 });
        }

        const sum = (rows, f) => rows.reduce((n, r) => n + (r[f] || 0), 0);
        return res.status(200).json({
            users: { total: totalUsers, verified: verifiedUsers, admins: adminUsers, new7d: newUsers7d },
            resumes: totalResumes,
            blogs: { published: blogs.filter((b) => b.published).length, drafts: blogs.filter((b) => !b.published).length, views: sum(blogs, 'views') },
            products: {
                published: products.filter((p) => p.published).length, drafts: products.filter((p) => !p.published).length,
                views: sum(products, 'views'), clicks: sum(products, 'clicks'),
            },
            messages: { unread: unreadMessages, total: totalMessages },
            signupsByDay, topPosts, topProducts, recentUsers,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// ---------- Users ----------

// GET /api/admin/users?search=&role=&page=
export const getUsers = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = 20;
        const filter = {};
        if (req.query.role === 'admin' || req.query.role === 'user') filter.role = req.query.role;
        if (req.query.search) {
            const rx = new RegExp(escapeRegex(String(req.query.search).slice(0, 60)), 'i');
            filter.$or = [{ name: rx }, { email: rx }];
        }
        const [users, total] = await Promise.all([
            User.find(filter).select('name email role isVerified authProvider createdAt').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            User.countDocuments(filter),
        ]);
        return res.status(200).json({ users, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// PATCH /api/admin/users/:id/role  { role: 'admin' | 'user' }
export const setUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['admin', 'user'].includes(role)) return res.status(400).json({ message: 'Role must be admin or user' });
        if (String(req.params.id) === String(req.userId)) {
            return res.status(400).json({ message: "You can't change your own role" });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (role === 'admin' && !user.isVerified) {
            return res.status(400).json({ message: "This user hasn't verified their email yet" });
        }
        if (user.role === 'admin' && role === 'user' && (await User.countDocuments({ role: 'admin' })) <= 1) {
            return res.status(400).json({ message: "Can't remove the last admin" });
        }
        user.role = role;
        await user.save();
        return res.status(200).json({ message: 'Role updated', user: { _id: user._id, role: user.role } });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// ---------- Categories ----------

// GET /api/admin/categories?type=blog|product  - with usage counts
export const getCategories = async (req, res) => {
    try {
        const filter = ['blog', 'product'].includes(req.query.type) ? { type: req.query.type } : {};
        const [categories, blogCounts, productCounts] = await Promise.all([
            Category.find(filter).sort({ type: 1, name: 1 }),
            Blog.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
            Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
        ]);
        const counts = { blog: Object.fromEntries(blogCounts.map((c) => [c._id, c.count])), product: Object.fromEntries(productCounts.map((c) => [c._id, c.count])) };
        return res.status(200).json({
            categories: categories.map((c) => ({ ...c.toObject(), count: counts[c.type][c.slug] || 0 })),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createCategory = async (req, res) => {
    try {
        const { name, type, description } = req.body;
        if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
        if (!['blog', 'product'].includes(type)) return res.status(400).json({ message: 'Type must be blog or product' });
        const slug = slugify(req.body.slug) || slugify(name);
        if (!slug) return res.status(400).json({ message: 'Could not generate a slug' });
        if (await Category.findOne({ type, slug })) return res.status(400).json({ message: 'That category already exists' });
        const category = await Category.create({ name: name.trim(), slug, type, description: description || '' });
        return res.status(201).json({ message: 'Category created', category });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Renaming changes only the display name/description. The slug stays fixed so
// existing posts/products and public URLs keep working.
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        if (req.body.name !== undefined) {
            if (!req.body.name.trim()) return res.status(400).json({ message: 'Name is required' });
            category.name = req.body.name.trim();
        }
        if (req.body.description !== undefined) category.description = req.body.description;
        await category.save();
        return res.status(200).json({ message: 'Category updated', category });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Deleting a category un-categorises its posts/products instead of deleting them.
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        const Model = category.type === 'blog' ? Blog : Product;
        await Model.updateMany({ category: category.slug }, { category: '' });
        return res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// ---------- Image upload ----------

// POST /api/admin/upload (multipart, field "image") -> { url }
export const uploadImage = async (req, res) => {
    const file = req.file;
    try {
        if (!file) return res.status(400).json({ message: 'No image received' });
        const response = await imagekit.files.upload({
            file: fs.createReadStream(file.path),
            fileName: file.originalname || 'upload.jpg',
            folder: 'site-images',
        });
        return res.status(201).json({ url: response.url });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Upload failed' });
    } finally {
        if (file?.path) fs.unlink(file.path, () => {});
    }
}
