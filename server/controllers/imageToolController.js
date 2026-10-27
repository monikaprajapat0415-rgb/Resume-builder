import multer from 'multer';
import User from '../models/User.js';
import ToolUsage from '../models/ToolUsage.js';
import { isToolOn } from './toolSettingsController.js';
import { getPlanSettings, isPaidUser } from './planController.js';
import { enhanceImage, TARGETS, STRENGTHS, FORMATS, MAX_INPUT_PIXELS } from '../utils/imageEnhance.js';

// ---- Limits (change here) ----
export const LIMITS = {
    freePerDay: 10,                 // enhancements per signed-in user per day (admins are not limited)
    maxFileBytes: 15 * 1024 * 1024, // upload size
    maxJobsAtOnce: 2,               // how many images the server works on at the same time
    maxEightKAtOnce: 1,             // 8K needs the most memory, so only one at a time
};
const TOOL = 'image-enhance';
const today = () => new Date().toISOString().slice(0, 10);

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: LIMITS.maxFileBytes, files: 1 },
    fileFilter: (req, file, cb) => (/^image\/(jpeg|png|webp)$/.test(file.mimetype) ? cb(null, true) : cb(Object.assign(new Error('Please upload a JPG, PNG or WebP image.'), { status: 400 }))),
}).single('image');

// Turns upload errors (too big, wrong type) into a clean 400 instead of a stack trace.
export const handleUpload = (req, res, next) => upload(req, res, (err) => {
    if (!err) return next();
    const big = err.code === 'LIMIT_FILE_SIZE';
    return res.status(big ? 413 : 400).json({ message: big ? `That file is too large. The limit is ${LIMITS.maxFileBytes / 1024 / 1024} MB.` : (err.message || 'Could not read that file.') });
});

let running = 0, runningBig = 0;
const usedToday = async (userId) => (await ToolUsage.findOne({ user: userId, tool: TOOL, day: today() }).select('count').lean())?.count || 0;

// GET /api/tools/image-enhance/status: what this user can do today
export const getStatus = async (req, res) => {
    try {
        const [user, plan] = await Promise.all([User.findById(req.userId).select('role planUntil'), getPlanSettings()]);
        const admin = user?.role === 'admin';
        const on = await isToolOn('imageEnhancer');
        const used = admin ? 0 : await usedToday(req.userId);
        const eightK = !(plan.enabled && plan.gates?.image_8k) || isPaidUser(user);
        return res.status(200).json({ enabled: on, limit: admin ? null : LIMITS.freePerDay, used, remaining: admin ? null : Math.max(0, LIMITS.freePerDay - used), eightK, maxFileMb: LIMITS.maxFileBytes / 1024 / 1024 });
    } catch (e) { return res.status(500).json({ message: 'Could not load your limits.' }); }
};

// POST /api/tools/image-enhance  (multipart: image, target, strength, format, denoise, contrast)
export const enhance = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Choose an image first.' });
    const target = TARGETS[req.body.target] ? req.body.target : '4k';
    const strength = STRENGTHS[req.body.strength] ? req.body.strength : 'medium';
    const format = FORMATS[req.body.format] ? req.body.format : 'jpeg';
    const flag = (v) => v === 'true' || v === '1' || v === 'on';
    let counted = false;
    try {
        const [user, plan] = await Promise.all([User.findById(req.userId).select('role planUntil'), getPlanSettings()]);
        const admin = user?.role === 'admin';
        if (!admin && !(await isToolOn('imageEnhancer'))) return res.status(404).json({ code: 'TOOL_OFF', message: 'The image enhancer is not available right now.' });
        if (target === '8k' && plan.enabled && plan.gates?.image_8k && !isPaidUser(user)) {
            return res.status(402).json({ code: 'PLAN_REQUIRED', feature: 'image_8k', pricingUrl: '/pricing', message: `8K output is part of the ${plan.planName} plan. You can still make 4K for free.` });
        }
        if (target === '8k' && format === 'png') return res.status(400).json({ message: 'PNG files at 8K are very large. Choose JPG or WebP for 8K.' });
        if (!admin) {
            const used = await usedToday(req.userId);
            if (used >= LIMITS.freePerDay) return res.status(429).json({ message: `You have used your ${LIMITS.freePerDay} free enhancements for today. Come back tomorrow.` });
        }
        if (running >= LIMITS.maxJobsAtOnce || (target === '8k' && runningBig >= LIMITS.maxEightKAtOnce)) {
            return res.status(503).json({ message: 'The enhancer is busy with other images. Please try again in a minute.' });
        }
        running++; if (target === '8k') runningBig++; counted = true;
        const out = await enhanceImage(req.file.buffer, { target, strength, format, denoise: flag(req.body.denoise), contrast: flag(req.body.contrast) });
        if (!admin) await ToolUsage.updateOne({ user: req.userId, tool: TOOL, day: today() }, { $inc: { count: 1 }, $setOnInsert: { createdAt: new Date() } }, { upsert: true }).catch(() => {});
        const base = String(req.file.originalname || 'image').replace(/\.[^.]+$/, '').replace(/[^\w\-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'image';
        res.set({
            'Content-Type': out.mime,
            'Content-Disposition': `attachment; filename="${base}-enhanced-${target}.${out.ext}"`,
            'Cache-Control': 'no-store',
            'X-Image-Width': String(out.width), 'X-Image-Height': String(out.height),
            'X-Image-In-Width': String(out.inWidth), 'X-Image-In-Height': String(out.inHeight),
            'X-Image-Upscaled': out.upscaled ? '1' : '0', 'X-Image-Engine': out.engine || 'classic',
            'Access-Control-Expose-Headers': 'Content-Disposition, X-Image-Width, X-Image-Height, X-Image-In-Width, X-Image-In-Height, X-Image-Upscaled, X-Image-Engine',
        });
        return res.status(200).send(out.buffer);
    } catch (e) {
        const tooBig = /pixel limit|exceeds/i.test(e.message || '');
        const bad = /unsupported image|corrupt|bad seek|Input buffer|VipsJpeg|VipsPng|webp/i.test(e.message || '');
        if (tooBig) return res.status(413).json({ message: `That picture has too many pixels. The limit is about ${Math.round(MAX_INPUT_PIXELS / 1e6)} megapixels.` });
        if (bad) return res.status(400).json({ message: 'That file could not be read as an image. Try saving it again as a JPG or PNG.' });
        console.error('[image-enhance]', e.message);
        return res.status(500).json({ message: 'Something went wrong while enhancing the image. Please try a smaller picture.' });
    } finally {
        if (counted) { running--; if (target === '8k') runningBig--; }
    }
};
