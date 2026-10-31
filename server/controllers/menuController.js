import MenuItem from "../models/MenuItem.js";
import { DEFAULT_MENU, MENU_LOCATIONS, MENU_ICONS } from "../utils/menuDefaults.js";
import { isSafeUrl } from "../utils/slugify.js";

// Insert any built-in item whose key isn't in the database yet. Existing rows are
// never overwritten, so renames/hides/reorders made by the admin survive.
const ensureDefaults = async (only = null) => {
    const wanted = only ? DEFAULT_MENU.filter((d) => only.includes(d.key)) : DEFAULT_MENU;
    const rows = wanted.map(({ parentKey, ...item }) => item);
    // which built-ins are missing right now (only those get inserted, and only those get a parent below)
    const have = new Set((await MenuItem.find({ key: { $in: rows.map((r) => r.key) } }).select('key')).map((m) => m.key));
    const fresh = new Set(rows.filter((r) => !have.has(r.key)).map((r) => r.key));
    await MenuItem.bulkWrite(rows.map((item) => ({
        updateOne: { filter: { key: item.key }, update: { $setOnInsert: item }, upsert: true },
    })));
    // Attach sub-menu links to their parent. Only links inserted just now, so a link the admin moved
    // to the top level on purpose is not pulled back under its parent.
    if (!fresh.size) return;
    const parents = Object.fromEntries((await MenuItem.find({ key: { $in: wanted.filter((d) => d.parentKey).map((d) => d.parentKey) } }).select('key')).map((m) => [m.key, m._id]));
    const ops = wanted.filter((d) => d.parentKey && fresh.has(d.key) && parents[d.parentKey])
        .map((d) => ({ updateOne: { filter: { key: d.key }, update: { $set: { parent: parents[d.parentKey] } } } }));
    if (ops.length) await MenuItem.bulkWrite(ops);
};

// Sites seeded before the Features page existed still have "Features -> /#feature".
// Point it at /features once, but only if the admin never changed that link.
let migrated = false;
const migrateFeaturesLink = async () => {
    if (migrated) return;
    await MenuItem.updateOne({ key: 'h-features', url: '/#feature' }, { $set: { url: '/features' } });
    migrated = true;
};

// Sites that existed before sub-menus get the Learn and Jobs sub-links once, automatically, so the
// dropdowns work without pressing "Restore defaults". A hidden marker record remembers it ran, so
// links the admin deletes afterwards stay deleted.
const MARKER = 'migrated-submenus-v1';
let submenusDone = false;
const migrateSubmenus = async () => {
    if (submenusDone) return;
    if (!(await MenuItem.exists({ key: MARKER }))) {
        await ensureDefaults();
        await MenuItem.updateOne({ key: MARKER }, { $setOnInsert: { key: MARKER, location: 'footer_legal', label: 'marker', url: '/', visible: false, order: 9999 } }, { upsert: true });
    }
    submenusDone = true;
};

// The Builder menu (with its two sub-links) and the footer link to the examples page arrive on existing sites once,
// automatically. "Builder" is placed just before "Templates". A hidden marker remembers it ran.
const BUILDER_MARKER = 'migrated-builder-v1';
const BUILDER_KEYS = ['h-builder', 'h-builder-app', 'h-builder-examples', 'fr-examples'];
let builderDone = false;
const migrateBuilder = async () => {
    if (builderDone) return;
    if (!(await MenuItem.exists({ key: BUILDER_MARKER }))) {
        await ensureDefaults(BUILDER_KEYS);
        // put the new links where they belong, whatever order numbers the admin's menu already has
        const place = async (key, nextToKey, gap) => {
            const near = await MenuItem.findOne({ key: nextToKey }).select('order');
            if (near) await MenuItem.updateOne({ key }, { $set: { order: near.order + gap } });
        };
        await place('h-builder', 'h-templates', -0.5);
        await place('fr-examples', 'fr-cv', 0.5);
        await MenuItem.updateOne({ key: BUILDER_MARKER }, { $setOnInsert: { key: BUILDER_MARKER, location: 'footer_legal', label: 'marker', url: '/', visible: false, order: 9999 } }, { upsert: true });
    }
    builderDone = true;
};

// The tools sub-menu under Products arrives on existing sites once, automatically (a hidden marker remembers it ran,
// so links the admin deletes afterwards stay deleted). The links sit right after "Products".
const PRODUCTS_MARKER = 'migrated-products-v1';
const PRODUCTS_KEYS = DEFAULT_MENU.filter((d) => d.parentKey === 'h-products').map((d) => d.key);
let productsDone = false;
const migrateProductsMenu = async () => {
    if (productsDone) return;
    if (!(await MenuItem.exists({ key: PRODUCTS_MARKER }))) {
        await ensureDefaults(PRODUCTS_KEYS);
        const near = await MenuItem.findOne({ key: 'h-products' }).select('order');
        if (near) await Promise.all(PRODUCTS_KEYS.map((key, i) => MenuItem.updateOne({ key }, { $set: { order: near.order + 0.01 * (i + 1) } })));
        await MenuItem.updateOne({ key: PRODUCTS_MARKER }, { $setOnInsert: { key: PRODUCTS_MARKER, location: 'footer_legal', label: 'marker', url: '/', visible: false, order: 9999 } }, { upsert: true });
    }
    productsDone = true;
};

// One-time add of later Products links to sites that already ran v1 (admin edits stay as they are).
const PRODUCTS2_MARKER = 'migrated-products-v2';
const PRODUCTS2_KEYS = ['h-products-playground'];
let products2Done = false;
const migrateProducts2 = async () => {
    if (products2Done) return;
    if (!(await MenuItem.exists({ key: PRODUCTS2_MARKER }))) {
        await ensureDefaults(PRODUCTS2_KEYS);
        const near = await MenuItem.findOne({ key: 'h-products' }).select('order');
        if (near) await MenuItem.updateOne({ key: PRODUCTS2_KEYS[0] }, { $set: { order: near.order + 0.005 } });
        await MenuItem.updateOne({ key: PRODUCTS2_MARKER }, { $setOnInsert: { key: PRODUCTS2_MARKER, location: 'footer_legal', label: 'marker', url: '/', visible: false, order: 9999 } }, { upsert: true });
    }
    products2Done = true;
};

const HIDDEN = [MARKER, BUILDER_MARKER, PRODUCTS_MARKER, PRODUCTS2_MARKER];
const group = (items) => {
    items = items.filter((i) => !HIDDEN.includes(i.key));
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
        await migrateFeaturesLink();
        await migrateSubmenus();
        await migrateBuilder();
        await migrateProductsMenu();
        await migrateProducts2();
        const items = await MenuItem.find({ visible: true }).sort({ order: 1, createdAt: 1 })
            .select('label url location newTab parent icon description');
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
        await migrateFeaturesLink();
        await migrateSubmenus();
        await migrateBuilder();
        await migrateProductsMenu();
        await migrateProducts2();
        const items = await MenuItem.find({}).sort({ order: 1, createdAt: 1 });
        return res.status(200).json({ menu: group(items) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const check = ({ label, url, location, icon, description }, partial = false) => {
    if (icon !== undefined && icon !== '' && icon !== null && !MENU_ICONS.includes(icon)) return 'Unknown icon';
    if (description !== undefined && description !== null && String(description).length > 90) return 'Description must be 90 characters or fewer';
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

// A sub-menu link hangs off a top-level link in the same (header) menu; no deeper than one level.
const checkParent = async (parent, location, selfId) => {
    if (!parent) return { ok: true, id: null };
    if (location !== 'header') return { error: 'Only the top menu can have sub-menus' };
    if (selfId && String(parent) === String(selfId)) return { error: 'A link cannot be its own parent' };
    const p = await MenuItem.findById(parent);
    if (!p || p.location !== 'header') return { error: 'Parent link not found' };
    if (p.parent) return { error: 'Sub-menus can only be one level deep' };
    return { ok: true, id: p._id };
};

export const createMenuItem = async (req, res) => {
    try {
        const { label, url, location, newTab, parent, icon, description } = req.body;
        const problem = check({ label, url, location: location ?? '', icon, description });
        if (problem) return res.status(400).json({ message: problem });
        const par = await checkParent(parent, location);
        if (par.error) return res.status(400).json({ message: par.error });
        const last = await MenuItem.findOne({ location }).sort({ order: -1 });
        const item = await MenuItem.create({
            label: label.trim(), url: url.trim(), location, newTab: Boolean(newTab), parent: par.id, icon: icon || '', description: String(description || '').trim(),
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
        const { label, url, location, newTab, visible, parent, icon, description } = req.body;
        const problem = check({ label, url, location, icon, description }, true);
        if (problem) return res.status(400).json({ message: problem });
        if (parent !== undefined) {
            const par = await checkParent(parent, location ?? item.location, item._id);
            if (par.error) return res.status(400).json({ message: par.error });
            // a link that has sub-links of its own cannot itself become a sub-link
            if (par.id && (await MenuItem.exists({ parent: item._id }))) return res.status(400).json({ message: 'This link has sub-links, so it cannot go under another link' });
            item.parent = par.id;
        }
        if (label !== undefined) item.label = label.trim();
        if (url !== undefined) item.url = url.trim();
        if (newTab !== undefined) item.newTab = Boolean(newTab);
        if (icon !== undefined) item.icon = icon || '';
        if (description !== undefined) item.description = String(description || '').trim();
        if (visible !== undefined) item.visible = Boolean(visible);
        if (location !== undefined && location !== item.location) {
            const last = await MenuItem.findOne({ location }).sort({ order: -1 });
            item.location = location;
            item.order = last ? last.order + 1 : 0;
            if (location !== 'header') item.parent = null;
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
        await MenuItem.updateMany({ parent: item._id }, { $set: { parent: null } }); // its sub-links become top-level
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
        const before = await MenuItem.countDocuments({ key: { $nin: HIDDEN } });
        await ensureDefaults();
        const restored = (await MenuItem.countDocuments({ key: { $nin: HIDDEN } })) - before;
        return res.status(200).json({ message: restored ? `Restored ${restored} item(s)` : 'Nothing to restore', restored });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
