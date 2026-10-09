import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { slugify, isSafeUrl } from "../utils/slugify.js";

const CARD_FIELDS = 'title slug tagline description images category price compareAtPrice currency stockStatus featured buttonLabel';

// Clean and validate everything an admin can submit, so create and update share rules.
const sanitize = (body) => {
    const out = {};
    const str = (v) => (typeof v === 'string' ? v.trim() : '');
    if (body.title !== undefined) out.title = str(body.title);
    if (body.tagline !== undefined) out.tagline = str(body.tagline);
    if (body.description !== undefined) out.description = str(body.description);
    if (body.keywords !== undefined) out.keywords = str(body.keywords);
    if (body.category !== undefined) out.category = str(body.category);
    if (body.currency !== undefined) out.currency = str(body.currency).toUpperCase() || 'INR';
    if (body.buttonLabel !== undefined) out.buttonLabel = str(body.buttonLabel) || 'Buy now';
    if (body.price !== undefined) out.price = Math.max(0, Number(body.price) || 0);
    if (body.compareAtPrice !== undefined) out.compareAtPrice = Math.max(0, Number(body.compareAtPrice) || 0);
    if (body.stockStatus !== undefined && ['in_stock', 'out_of_stock', 'coming_soon'].includes(body.stockStatus)) out.stockStatus = body.stockStatus;
    if (body.featured !== undefined) out.featured = Boolean(body.featured);
    if (body.published !== undefined) out.published = Boolean(body.published);
    if (Array.isArray(body.features)) out.features = body.features.map(str).filter(Boolean);
    if (Array.isArray(body.images)) out.images = body.images.map(str).filter((u) => /^(https?:\/\/|\/)/i.test(u));
    if (Array.isArray(body.content)) out.content = body.content;
    if (body.buyUrl !== undefined) {
        const url = str(body.buyUrl);
        if (url && !isSafeUrl(url)) throw new Error('Buy link must start with https://, http://, mailto: or tel:');
        out.buyUrl = url;
    }
    return out;
};

// ---------- Public ----------

// GET /api/products?category=&featured=1
export const getPublishedProducts = async (req, res) => {
    try {
        const filter = { published: true };
        if (req.query.category) filter.category = String(req.query.category);
        if (req.query.featured) filter.featured = true;
        const products = await Product.find(filter).select(CARD_FIELDS).sort({ featured: -1, createdAt: -1 });
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/products/categories - only categories that contain a published product
export const getProductCategories = async (req, res) => {
    try {
        const counts = await Product.aggregate([
            { $match: { published: true, category: { $ne: '' } } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);
        const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));
        const categories = (await Category.find({ type: 'product' }).sort({ name: 1 }))
            .filter((c) => countMap[c.slug])
            .map((c) => ({ name: c.name, slug: c.slug, count: countMap[c.slug] }));
        return res.status(200).json({ categories });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/products/:slug
export const getPublishedProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { slug: req.params.slug, published: true },
            { $inc: { views: 1 } },
            { returnDocument: 'after' }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.status(200).json({ product });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// POST /api/products/:slug/click - counts "Buy" button clicks for the admin stats
export const trackProductClick = async (req, res) => {
    try {
        await Product.updateOne({ slug: req.params.slug, published: true }, { $inc: { clicks: 1 } });
        return res.status(204).end();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// ---------- Admin ----------

export const getAllProductsAdmin = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getProductByIdAdmin = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.status(200).json({ product });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createProduct = async (req, res) => {
    try {
        const data = sanitize(req.body);
        if (!data.title) return res.status(400).json({ message: 'Title is required' });

        const slug = slugify(req.body.slug) || slugify(data.title);
        if (!slug) return res.status(400).json({ message: 'Could not generate a URL slug - set one manually' });
        if (await Product.findOne({ slug })) return res.status(400).json({ message: 'A product with this URL slug already exists' });

        const product = await Product.create({ ...data, slug });
        return res.status(201).json({ message: 'Product created', product });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const data = sanitize(req.body);
        if (data.title === '') return res.status(400).json({ message: 'Title is required' });

        if (req.body.slug !== undefined) {
            const slug = slugify(req.body.slug) || slugify(data.title || product.title);
            if (slug !== product.slug) {
                if (await Product.findOne({ slug, _id: { $ne: product._id } })) {
                    return res.status(400).json({ message: 'A product with this URL slug already exists' });
                }
                product.slug = slug;
            }
        }

        Object.assign(product, data);
        await product.save();
        return res.status(200).json({ message: 'Product updated', product });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
