import SiteContent from "../models/SiteContent.js";
import { SITE_FIELDS, SITE_DEFAULTS } from "../utils/siteContentDefaults.js";

const merged = async () => {
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

// PUT /api/admin/site-content { values: { key: text } }
// A value equal to the default (or empty) deletes the override, i.e. "reset".
export const saveSiteContent = async (req, res) => {
    try {
        const values = req.body?.values;
        if (!values || typeof values !== 'object') return res.status(400).json({ message: 'values is required' });
        const ops = [];
        for (const [key, raw] of Object.entries(values)) {
            if (!(key in SITE_DEFAULTS)) return res.status(400).json({ message: `Unknown field: ${key}` });
            const value = String(raw ?? '').trim();
            if (value.length > 400) return res.status(400).json({ message: `"${key}" is too long (max 400 characters)` });
            if (value === '' || value === SITE_DEFAULTS[key]) ops.push({ deleteOne: { filter: { key } } });
            else ops.push({ updateOne: { filter: { key }, update: { $set: { key, value } }, upsert: true } });
        }
        if (ops.length) await SiteContent.bulkWrite(ops);
        return res.status(200).json({ message: 'Saved', values: await merged() });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
