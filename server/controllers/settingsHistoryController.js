import mongoose from 'mongoose';
import SettingsHistory from '../models/SettingsHistory.js';
import { restoreAds } from './adsController.js';
import { restoreNudge } from './nudgeController.js';
import { restoreSite } from './siteContentController.js';

const RESTORERS = { ads: restoreAds, nudge: restoreNudge, site: restoreSite };

// GET /api/admin/settings-history?key=ads&prefix=theme_  (newest first, 20 rows)
export const listHistory = async (req, res) => {
    try {
        const key = String(req.query.key || '');
        if (!RESTORERS[key]) return res.status(400).json({ message: 'Unknown settings key.' });
        const f = { key };
        const prefix = String(req.query.prefix || '').slice(0, 20);
        let rows = await SettingsHistory.find({ key }).sort({ at: -1 }).limit(prefix ? 100 : 20).lean();
        if (prefix) rows = rows.filter((r) => Object.keys(r.after || {}).some((k) => k.startsWith(prefix))).slice(0, 20);
        return res.status(200).json({ rows });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// POST /api/admin/settings-history/:id/restore  - puts the OLD values of that change back (through the normal save rules)
export const restoreHistory = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Not found' });
        const row = await SettingsHistory.findById(req.params.id).lean();
        const restore = row && RESTORERS[row.key];
        if (!restore) return res.status(404).json({ message: 'That history entry no longer exists.' });
        const out = await restore(row.before, req.adminUser);
        if (out.error) return res.status(400).json({ message: out.error });
        if (res.locals) res.locals.auditMeta = { resource: row.key, action: 'restore' };
        return res.status(200).json({ message: 'Restored the earlier values.' });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
