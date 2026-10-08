import MenuItem from "../models/MenuItem.js";
import { DEFAULT_MENU, MENU_LOCATIONS } from "../utils/menuDefaults.js";
import { isSafeUrl } from "../utils/slugify.js";

// Insert any built-in item whose key isn't in the database yet. Existing rows are
// never overwritten, so renames/hides/reorders made by the admin survive.
const ensureDefaults = async () => {
    await MenuItem.bulkWrite(DEFAULT_MENU.map((item) => ({
        updateOne: { filter: { key: item.key }, update: { $setOnInsert: item }, upsert: true },
    })));
};

const group = (items) => {
    const out = Object.fromEntries(MENU_LOCATIONS.map((l) => [l, []]));
    items.forEach((i) => out[i.location]?.push(i));
    return out;
};

// GET /api/menu - visible items only, grouped by location
export const getMenu = async (req, res) => {
    try {
        // First ever request: seed the built-ins. After that the admin owns the menu,
        // so an item they deleted does not silently come back.
        if ((await MenuItem.estimatedDocumentCount()) === 0) await ensureDefaults();
        const items = await MenuItem.find({ visible: true }).sort({ order: 1, createdAt: 1 })
            .select('label url location newTab');
        res.set('Cache-Control', 'public, max-age=0, s-maxage=30, must-revalidate');
        return res.status(200).json({ menu: group(items) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// ---------- Admin ----------

export const getMenuAdmin = async (req, res) => {
    try {
        if ((await MenuItem.estimatedDocumentCount()) === 0) await ensureDefaults();
        const items = await MenuItem.find({}).sort({ order: 1, createdAt: 1 });
        return res.status(200).json({ menu: group(items) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const check = ({ label, url, location }, partial = false) => {
    if (!partial || label !== undefined) {
        if (!label || !label.trim()) return 'Label is required';
        if (label.trim().length > 40) return 'Label must be 40 characters or fewer';
    }
    if (!partial || url !== undefined) {
        if (!url || !url.trim()) return 'Link is required';
        if (!isSafeUrl(url)) return 'Link must start with /, https://, http://, mailto: or tel:';
    }
    if (location !== undefined && !MENU_LOCATIONS.includes(location)) return 'Unknown menu location';
    return null;
};

export const createMenuItem = async (req, res) => {
    try {
        const { label, url, location, newTab } = req.body;
        const problem = check({ label, url, location: location ?? '' });
        if (problem) return res.status(400).json({ message: problem });
        const last = await MenuItem.findOne({ location }).sort({ order: -1 });
        const item = await MenuItem.create({
            label: label.trim(), url: url.trim(), location, newTab: Boolean(newTab),
            order: last ? last.order + 1 : 0,
        });
        return res.status(201).json({ message: 'Menu item added', item });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Menu item not found' });
        const { label, url, location, newTab, visible } = req.body;
        const problem = check({ label, url, location }, true);
        if (problem) return res.status(400).json({ message: problem });
        if (label !== undefined) item.label = label.trim();
        if (url !== undefined) item.url = url.trim();
        if (newTab !== undefined) item.newTab = Boolean(newTab);
        if (visible !== undefined) item.visible = Boolean(visible);
        if (location !== undefined && location !== item.location) {
            const last = await MenuItem.findOne({ location }).sort({ order: -1 });
            item.location = location;
            item.order = last ? last.order + 1 : 0;
        }
        await item.save();
        return res.status(200).json({ message: 'Menu item updated', item });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Menu item not found' });
        return res.status(200).json({ message: 'Menu item removed' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// PUT /api/admin/menu/reorder  { location, ids: [id, id, ...] } - new order for one location
export const reorderMenu = async (req, res) => {
    try {
        const { location, ids } = req.body;
        if (!MENU_LOCATIONS.includes(location) || !Array.isArray(ids)) {
            return res.status(400).json({ message: 'location and ids are required' });
        }
        await MenuItem.bulkWrite(ids.map((id, order) => ({
            updateOne: { filter: { _id: id, location }, update: { $set: { order } } },
        })));
        return res.status(200).json({ message: 'Order saved' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// POST /api/admin/menu/restore - bring back any built-in item that was deleted
export const restoreMenuDefaults = async (req, res) => {
    try {
        const before = await MenuItem.countDocuments({});
        await ensureDefaults();
        const restored = (await MenuItem.countDocuments({})) - before;
        return res.status(200).json({ message: restored ? `Restored ${restored} item(s)` : 'Nothing to restore', restored });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
