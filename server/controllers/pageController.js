import Page from "../models/Page.js";
import { DEFAULT_PAGES } from "../utils/pageDefaults.js";
import { slugify } from "../utils/slugify.js";

const ensureDefaults = async () => {
    await Page.bulkWrite(DEFAULT_PAGES.map((p) => ({
        updateOne: { filter: { slug: p.slug }, update: { $setOnInsert: p }, upsert: true },
    })));
};

const cleanBlocks = (content) => (Array.isArray(content) ? content : [])
    .map((b) => (b?.type === 'list'
        ? { type: 'list', items: (Array.isArray(b.items) ? b.items : []).map((s) => String(s).trim()).filter(Boolean) }
        : { type: ['heading', 'paragraph'].includes(b?.type) ? b.type : 'paragraph', text: String(b?.text || '').trim() }))
    .filter((b) => (b.type === 'list' ? b.items.length > 0 : b.text.length > 0));

// GET /api/pages/:slug - public
export const getPublicPage = async (req, res) => {
    try {
        if ((await Page.estimatedDocumentCount()) === 0) await ensureDefaults();
        const page = await Page.findOne({ slug: req.params.slug, published: true }).select('slug title description content updatedAt');
        if (!page) return res.status(404).json({ message: 'Page not found' });
        return res.status(200).json({ page });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// ---------- Admin ----------

export const getPagesAdmin = async (req, res) => {
    try {
        if ((await Page.estimatedDocumentCount()) === 0) await ensureDefaults();
        const pages = await Page.find({}).select('slug title published system updatedAt').sort({ system: -1, title: 1 });
        return res.status(200).json({ pages });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getPageByIdAdmin = async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        if (!page) return res.status(404).json({ message: 'Page not found' });
        return res.status(200).json({ page });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createPage = async (req, res) => {
    try {
        const { title, description, content, published } = req.body;
        if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });
        const slug = slugify(req.body.slug) || slugify(title);
        if (!slug) return res.status(400).json({ message: 'Could not generate a URL - set one manually' });
        if (await Page.findOne({ slug })) return res.status(400).json({ message: 'A page with this URL already exists' });
        const page = await Page.create({
            slug, title: title.trim(), description: description || '',
            content: cleanBlocks(content), published: published !== undefined ? Boolean(published) : true,
        });
        return res.status(201).json({ message: 'Page created', page });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const updatePage = async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        if (!page) return res.status(404).json({ message: 'Page not found' });
        const { title, description, content, published } = req.body;
        if (title !== undefined) {
            if (!title.trim()) return res.status(400).json({ message: 'Title is required' });
            page.title = title.trim();
        }
        if (description !== undefined) page.description = description;
        if (content !== undefined) page.content = cleanBlocks(content);
        if (published !== undefined && !page.system) page.published = Boolean(published); // built-in pages stay live
        // The address of a custom page can change; built-in pages keep theirs.
        if (!page.system && req.body.slug !== undefined) {
            const slug = slugify(req.body.slug) || slugify(page.title);
            if (slug !== page.slug) {
                if (await Page.findOne({ slug, _id: { $ne: page._id } })) return res.status(400).json({ message: 'A page with this URL already exists' });
                page.slug = slug;
            }
        }
        await page.save();
        return res.status(200).json({ message: 'Page saved', page });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// POST /api/admin/pages/:id/reset - put a built-in page back to its original text
export const resetPage = async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        if (!page) return res.status(404).json({ message: 'Page not found' });
        const original = DEFAULT_PAGES.find((p) => p.slug === page.slug);
        if (!original) return res.status(400).json({ message: 'Only built-in pages can be reset' });
        page.title = original.title;
        page.description = original.description;
        page.content = original.content;
        await page.save();
        return res.status(200).json({ message: 'Page reset to the original text', page });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const deletePage = async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        if (!page) return res.status(404).json({ message: 'Page not found' });
        if (page.system) return res.status(400).json({ message: "Built-in pages can't be deleted" });
        await page.deleteOne();
        return res.status(200).json({ message: 'Page deleted' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
