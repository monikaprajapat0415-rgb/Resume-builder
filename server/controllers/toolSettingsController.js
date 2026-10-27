import ToolSettings from '../models/ToolSettings.js';
import ToolUsage from '../models/ToolUsage.js';

// Admin on/off switches for the free tools. Everything is ON unless an admin turns it off, and if the settings cannot be
// read the tool stays ON (a database hiccup must not hide a working tool). Cached for 10 seconds, cleared on save.
export const TOOLS = { imageEnhancer: 'Image Enhancer' };
const DEFAULTS = { imageEnhancer: true };
let cache = null, at = 0;
export const getToolSettings = async () => {
    if (cache && Date.now() - at < 10000) return cache;
    try {
        const doc = await ToolSettings.findOne({ key: 'main' }).lean();
        cache = { ...DEFAULTS, ...Object.fromEntries(Object.keys(TOOLS).map((k) => [k, doc?.[k] !== false])) };
    } catch { cache = { ...DEFAULTS }; }
    at = Date.now();
    return cache;
};
export const isToolOn = async (name) => Boolean((await getToolSettings())[name]);

// GET /api/tools/settings (public): which tools are visible
export const publicToolSettings = async (req, res) => {
    const s = await getToolSettings();
    res.set('Cache-Control', 'no-store');
    return res.status(200).json({ imageEnhancer: s.imageEnhancer });
};

// GET /api/admin/tools
export const adminGetTools = async (req, res) => {
    try {
        const day = new Date().toISOString().slice(0, 10);
        const rows = await ToolUsage.find({ tool: 'image-enhance', day }).select('count').lean();
        return res.status(200).json({ settings: await getToolSettings(), labels: TOOLS, usage: { imageEnhancer: { today: rows.reduce((n, r) => n + (r.count || 0), 0), usersToday: rows.length } } });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// PUT /api/admin/tools   { imageEnhancer: true|false }
export const adminSaveTools = async (req, res) => {
    try {
        const set = {};
        for (const k of Object.keys(TOOLS)) if (typeof req.body?.[k] === 'boolean') set[k] = req.body[k];
        if (!Object.keys(set).length) return res.status(400).json({ message: 'Nothing to save: send imageEnhancer as true or false.' });
        await ToolSettings.findOneAndUpdate({ key: 'main' }, { $set: set }, { upsert: true, setDefaultsOnInsert: true });
        cache = null;
        return res.status(200).json({ settings: await getToolSettings(), message: set.imageEnhancer ? 'Saved. The Image Enhancer is visible to visitors.' : 'The Image Enhancer is now hidden from visitors.' });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
