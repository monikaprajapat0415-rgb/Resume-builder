import ToolSettings from '../models/ToolSettings.js';
import ToolUsage from '../models/ToolUsage.js';

// Admin on/off switches for the free tools. Everything is ON unless an admin turns it off, and if the settings cannot be
// read the tool stays ON (a database hiccup must not hide a working tool). Cached for 10 seconds, cleared on save.
export const TOOLS = { imageEnhancer: 'Image Enhancer', coverLetterTool: 'Cover Letter Generator', bulletTool: 'Resume Bullet Point Improver', interviewTool: 'Mock Interview Practice', offerTool: 'Job Offer Comparison', linkedinTool: 'LinkedIn Headline and About Writer', playgroundTool: 'React and Angular Code Playground' };
const DEFAULTS = { imageEnhancer: true, coverLetterTool: true, bulletTool: true, interviewTool: true, offerTool: true, linkedinTool: true, playgroundTool: true, enhancerDailyLimit: 10, careerDailyLimit: 10, enhancerMode: 'pro' };
let cache = null, at = 0;
export const getToolSettings = async () => {
    if (cache && Date.now() - at < 10000) return cache;
    try {
        const doc = await ToolSettings.findOne({ key: 'main' }).lean();
        cache = { ...DEFAULTS, ...Object.fromEntries(Object.keys(TOOLS).map((k) => [k, doc?.[k] !== false])), enhancerDailyLimit: Number.isInteger(doc?.enhancerDailyLimit) ? doc.enhancerDailyLimit : DEFAULTS.enhancerDailyLimit, careerDailyLimit: Number.isInteger(doc?.careerDailyLimit) ? doc.careerDailyLimit : DEFAULTS.careerDailyLimit, enhancerMode: doc?.enhancerMode === 'standard' ? 'standard' : 'pro' };
    } catch { cache = { ...DEFAULTS }; }
    at = Date.now();
    return cache;
};
export const isToolOn = async (name) => Boolean((await getToolSettings())[name]);

// GET /api/tools/settings (public): which tools are visible
export const publicToolSettings = async (req, res) => {
    const s = await getToolSettings();
    res.set('Cache-Control', 'no-store');
    return res.status(200).json({ ...Object.fromEntries(Object.keys(TOOLS).map((k) => [k, s[k]])), enhancerMode: s.enhancerMode });
};

// GET /api/admin/tools
export const adminGetTools = async (req, res) => {
    try {
        const day = new Date().toISOString().slice(0, 10);
        const rows = await ToolUsage.find({ tool: 'image-enhance', day }).select('count').lean();
        const career = await ToolUsage.find({ tool: /^career-/, day }).select('tool count user').lean();
        const byTool = {};
        for (const r of career) byTool[r.tool] = (byTool[r.tool] || 0) + (r.count || 0);
        return res.status(200).json({ settings: await getToolSettings(), labels: TOOLS, usage: { imageEnhancer: { today: rows.reduce((n, r) => n + (r.count || 0), 0), usersToday: rows.length }, career: { byTool, usersToday: new Set(career.map((r) => String(r.user))).size } } });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};

// PUT /api/admin/tools   { imageEnhancer?, coverLetterTool?, bulletTool?, interviewTool?, offerTool?, linkedinTool?, playgroundTool?: boolean, careerDailyLimit?: 1-200, enhancerDailyLimit?: 1-500, enhancerMode?: 'pro' | 'standard' }
export const adminSaveTools = async (req, res) => {
    try {
        const set = {};
        for (const k of Object.keys(TOOLS)) if (typeof req.body?.[k] === 'boolean') set[k] = req.body[k];
        if (req.body?.enhancerDailyLimit !== undefined) {
            const n = Number(req.body.enhancerDailyLimit);
            if (!Number.isInteger(n) || n < 1 || n > 500) return res.status(400).json({ message: 'The daily limit must be a whole number from 1 to 500.' });
            set.enhancerDailyLimit = n;
        }
        if (req.body?.careerDailyLimit !== undefined) {
            const n = Number(req.body.careerDailyLimit);
            if (!Number.isInteger(n) || n < 1 || n > 200) return res.status(400).json({ message: 'The daily limit for the career tools must be a whole number from 1 to 200.' });
            set.careerDailyLimit = n;
        }
        if (req.body?.enhancerMode !== undefined) {
            if (!['pro', 'standard'].includes(req.body.enhancerMode)) return res.status(400).json({ message: 'The starting mode must be pro or standard.' });
            set.enhancerMode = req.body.enhancerMode;
        }
        if (!Object.keys(set).length) return res.status(400).json({ message: 'Nothing to save.' });
        await ToolSettings.findOneAndUpdate({ key: 'main' }, { $set: set }, { upsert: true, setDefaultsOnInsert: true });
        cache = null;
        const flag = Object.keys(TOOLS).find((k) => typeof set[k] === 'boolean');
        const msg = flag ? (set[flag] ? `Saved. ${TOOLS[flag]} is visible to visitors.` : `${TOOLS[flag]} is now hidden from visitors.`) : 'Saved.';
        return res.status(200).json({ settings: await getToolSettings(), message: msg });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
