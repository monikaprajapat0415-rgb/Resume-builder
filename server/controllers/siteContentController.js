import SiteContent from "../models/SiteContent.js";
import { SITE_FIELDS, SITE_DEFAULTS } from "../utils/siteContentDefaults.js";
import { recordChange } from "../utils/settingsHistory.js";

export const merged = async () => {
    const rows = await SiteContent.find({});
    const values = { ...SITE_DEFAULTS };
    rows.forEach((r) => { if (r.key in SITE_DEFAULTS && r.value !== '') values[r.key] = r.value; });
    return values;
};

// GET /api/site-content - public, { values: { key: text } } with defaults filled in
export const getSiteContent = async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=0, s-maxage=30, must-revalidate');
        return res.status(200).json({ values: await merged() });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/admin/site-content - fields (with their defaults) plus the current values
export const getSiteContentAdmin = async (req, res) => {
    try {
        return res.status(200).json({ fields: SITE_FIELDS, values: await merged() });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Validates and saves { key: text }; used by the save route and by "restore".
const putValues = async (values, admin, restoredFrom = false) => {
    if (!values || typeof values !== 'object') return { error: 'values is required' };
    const ops = [];
    for (const [key, raw] of Object.entries(values)) {
        if (!(key in SITE_DEFAULTS)) return { error: `Unknown field: ${key}` };
        const value = String(raw ?? '').trim();
        if (key === 'theme_primary' && value && !/^#[0-9a-f]{6}$/i.test(value)) return { error: 'Colour must look like #16a34a' };
        if (key === 'session_mode' && value && !['tab', 'remember'].includes(value)) return { error: '"Sign-in lasts" must be tab or remember' };
        if (key.startsWith('feature_') && value && !['true', 'false'].includes(value)) return { error: `"${key}" must be true or false` };
        if (value.length > 400) return { error: `"${key}" is too long (max 400 characters)` };
        if (value === '' || value === SITE_DEFAULTS[key]) ops.push({ deleteOne: { filter: { key } } });
        else ops.push({ updateOne: { filter: { key }, update: { $set: { key, value } }, upsert: true } });
    }
    const keys = Object.keys(values);
    const before = await merged();
    if (ops.length) await SiteContent.bulkWrite(ops);
    const after = await merged();
    await recordChange('site', admin, before, after, { keys, restoredFrom });
    return { values: after };
};
export const restoreSite = (old, admin) => putValues(old, admin, true);

// PUT /api/admin/site-content { values: { key: text } }
// A value equal to the default (or empty) deletes the override, i.e. "reset".
export const saveSiteContent = async (req, res) => {
    try {
        const out = await putValues(req.body?.values, req.adminUser);
        if (out.error) return res.status(400).json({ message: out.error });
        return res.status(200).json({ message: 'Saved', values: out.values });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
