import AdSettings from '../models/AdSettings.js';
import { recordChange } from '../utils/settingsHistory.js';

// Admin-controlled ad settings. Everything is OFF unless an admin turns it on; if the settings cannot be read, ads stay off.
const DEFAULTS = { enabled: false, publisherId: '', adsTxt: '', onBlog: true, onLessons: true, onInterview: true, slotBlog: '', slotLessons: '', slotInterview: '', hideInEurope: true, cookieBanner: true };
const BOOLS = ['enabled', 'onBlog', 'onLessons', 'onInterview', 'hideInEurope', 'cookieBanner'];
const SLOTS = ['slotBlog', 'slotLessons', 'slotInterview'];
const PUB = /^pub-\d{10,20}$/;
let cache = null, at = 0;

export const getAdSettings = async () => {
    if (cache && Date.now() - at < 10000) return cache;
    try {
        const doc = await AdSettings.findOne({ key: 'main' }).lean();
        cache = { ...DEFAULTS, ...Object.fromEntries(Object.keys(DEFAULTS).filter((k) => doc && doc[k] !== undefined).map((k) => [k, doc[k]])) };
    } catch { cache = { ...DEFAULTS, cookieBanner: false }; }
    at = Date.now();
    return cache;
};

// GET /api/ads/config (public): only what the page needs
export const publicAdConfig = async (req, res) => {
    const s = await getAdSettings();
    res.set('Cache-Control', 'no-store');
    const live = s.enabled && PUB.test(s.publisherId);
    return res.status(200).json({
        banner: s.cookieBanner,
        enabled: live, client: live ? `ca-${s.publisherId}` : '', hideInEurope: s.hideInEurope,
        types: live ? { blog: s.onBlog && s.slotBlog ? s.slotBlog : '', lesson: s.onLessons && s.slotLessons ? s.slotLessons : '', interview: s.onInterview && s.slotInterview ? s.slotInterview : '' } : {},
    });
};

// GET /ads.txt: the Google line comes from the publisher id; extra lines (other ad partners) come from the admin field.
export const adsTxt = async (req, res) => {
    const s = await getAdSettings();
    const lines = [];
    if (PUB.test(s.publisherId)) lines.push(`google.com, ${s.publisherId}, DIRECT, f08c47fec0942fa0`);
    String(s.adsTxt || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#') && !/[<>]/.test(l)).forEach((l) => lines.push(l));
    if (!lines.length) return res.status(404).type('text/plain').send('Not found\n');
    res.set('Cache-Control', 'public, max-age=300');
    return res.status(200).type('text/plain').send([...new Set(lines)].join('\n') + '\n');
};

// GET /api/admin/ads
export const adminGetAds = async (req, res) => {
    try { return res.status(200).json({ settings: await getAdSettings() }); } catch (e) { return res.status(500).json({ message: e.message }); }
};

// Shared by the save route and by "restore": validates, saves, records the change in the settings history.
const KEYS = Object.keys(DEFAULTS);
export const saveAds = async (body, admin, restoredFrom = false) => {
    const set = {};
    for (const k of BOOLS) if (typeof body?.[k] === 'boolean') set[k] = body[k];
    if (body?.publisherId !== undefined) {
        const id = String(body.publisherId).trim().toLowerCase().replace(/^ca-/, '');
        if (id && !PUB.test(id)) return { error: 'The publisher ID looks like pub-1234567890123456 (from your AdSense account).' };
        set.publisherId = id;
    }
    for (const k of SLOTS) if (body?.[k] !== undefined) {
        const v = String(body[k]).trim();
        if (v && !/^\d{6,20}$/.test(v)) return { error: 'An ad unit ID is a number of 6 to 20 digits.' };
        set[k] = v;
    }
    if (body?.adsTxt !== undefined) {
        const t = String(body.adsTxt);
        if (t.length > 4000 || /[<>]/.test(t)) return { error: 'ads.txt lines must be plain text, up to 4000 characters.' };
        set.adsTxt = t.trim();
    }
    const before = await getAdSettings();
    const next = { ...before, ...set };
    if (next.enabled && !PUB.test(next.publisherId)) return { error: 'Enter your AdSense publisher ID before turning ads on.' };
    await AdSettings.updateOne({ key: 'main' }, { $set: set, $setOnInsert: { key: 'main' } }, { upsert: true });
    cache = null;
    const after = await getAdSettings();
    await recordChange('ads', admin, before, after, { keys: KEYS, restoredFrom });
    return { settings: after };
};
export const restoreAds = (old, admin) => saveAds(old, admin, true);

// PUT /api/admin/ads { any setting }
export const adminSaveAds = async (req, res) => {
    try {
        const out = await saveAds(req.body, req.adminUser);
        if (out.error) return res.status(400).json({ message: out.error });
        return res.status(200).json({ message: 'Saved.', settings: out.settings });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
