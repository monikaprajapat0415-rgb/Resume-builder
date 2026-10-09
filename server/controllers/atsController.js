import multer from 'multer';
import User from '../models/User.js';
import AtsUsage from '../models/AtsUsage.js';
import AtsReport from '../models/AtsReport.js';
import { emailKey } from '../utils/emailKey.js';
import { detectKind, extractFromFile, buildReport, MAX_FILE_BYTES } from '../utils/atsAnalyzer.js';

// Every account may run this many ATS checks in total; after that the checker is switched
// off for that account (an admin can give extra checks or switch it back on).
export const FREE_CHECKS = 5;

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_FILE_BYTES, files: 1 } }).single('resume');

// Turns multer errors (too large, wrong field) into clean JSON 400s.
export const handleUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (!err) return next();
        const message = err.code === 'LIMIT_FILE_SIZE' ? 'That file is too large. The limit is 5 MB.' : 'Could not read the uploaded file.';
        return res.status(400).json({ message });
    });
};

const LIMIT_MESSAGE = `You have used all ${FREE_CHECKS} of your ATS checks, so the ATS checker is now turned off for your account. If you need more checks, please contact us.`;

const summarise = (r) => ({ id: r._id, fileName: r.fileName, score: r.score, createdAt: r.createdAt });

// GET /api/ats/status - what this user can do right now
export const getStatus = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('email isVerified');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const usage = await AtsUsage.findOne({ email: emailKey(user.email) });
        const credits = usage?.credits || 0;
        const left = Math.max(0, FREE_CHECKS - (usage?.freeUsed || 0)) + credits;
        const disabled = Boolean(usage?.disabled);
        const last = await AtsReport.findOne({ userId: user._id }).sort({ createdAt: -1 }).select('fileName score createdAt');
        return res.status(200).json({
            limit: FREE_CHECKS, used: usage?.totalChecks || 0, left, disabled,
            canCheck: !disabled && left > 0,
            reason: disabled ? 'disabled' : left <= 0 ? 'limit' : null,
            verified: Boolean(user.isVerified),
            last: last ? summarise(last) : null,
        });
    } catch (error) {
        console.error('[ats] status failed:', error);
        return res.status(500).json({ message: error.message });
    }
};

// Atomically take one check (free first, then a credit). Returns 'free' | 'credit' | null.
const claim = async (email) => {
    // Make sure a counter row exists (the unique index on email makes concurrent creates safe)...
    try { await AtsUsage.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true }); }
    catch (e) { if (e?.code !== 11000) throw e; }
    // ...then take a check with an atomic $inc and judge by the value it returns, so two
    // parallel requests can never both win the same last check.
    const stamp = { $set: { lastCheckAt: new Date() } };
    const f = await AtsUsage.findOneAndUpdate({ email }, { $inc: { freeUsed: 1, totalChecks: 1 }, ...stamp }, { returnDocument: 'after' });
    if (f && f.freeUsed <= FREE_CHECKS) return 'free';
    await AtsUsage.updateOne({ email }, { $inc: { freeUsed: -1, totalChecks: -1 } }); // over the limit: put it back
    const c = await AtsUsage.findOneAndUpdate({ email }, { $inc: { credits: -1, totalChecks: 1 }, ...stamp }, { returnDocument: 'after' });
    if (c && c.credits >= 0) return 'credit';
    await AtsUsage.updateOne({ email }, { $inc: { credits: 1, totalChecks: -1 } });
    return null;
};

const refund = (email, kind) => AtsUsage.updateOne({ email }, kind === 'free' ? { $inc: { freeUsed: -1, totalChecks: -1 } } : { $inc: { credits: 1, totalChecks: -1 } }).catch(() => {});

// Same-person requests are handled one at a time (stops double-clicks and parallel requests
// from racing for the last check, whichever database is behind us).
const running = new Set();

// POST /api/ats/analyze  (multipart: resume file, optional jobDescription)
export const analyze = async (req, res) => {
    let claimed = null; let key = null; let locked = null;
    try {
        const user = await User.findById(req.userId).select('email isVerified');
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!user.isVerified) return res.status(403).json({ code: 'VERIFY_EMAIL', message: 'Please verify your email address first - then your free ATS check is unlocked.' });

        const file = req.file;
        if (!file) return res.status(400).json({ message: 'Please upload your resume as a PDF or Word (.docx) file.' });
        const kind = detectKind(file.buffer);
        if (!kind) return res.status(400).json({ message: 'Only PDF and Word (.docx) files are supported.' });

        const jobDescription = String(req.body?.jobDescription || '').trim().slice(0, 5000);

        // Read the file BEFORE spending a check, so a corrupt file never costs one.
        let extracted;
        try { extracted = await extractFromFile(file.buffer, kind); }
        catch { return res.status(400).json({ message: 'We could not read that file. It may be corrupted or password-protected.' }); }

        key = emailKey(user.email);
        const existing = await AtsUsage.findOne({ email: key });
        if (existing?.disabled) { key = null; return res.status(403).json({ code: 'ATS_DISABLED', message: LIMIT_MESSAGE }); }
        if (running.has(key)) { key = null; return res.status(429).json({ message: 'Your resume is already being checked. Please wait a moment.' }); }
        running.add(key); locked = key;
        claimed = await claim(key);
        if (!claimed) {
            return res.status(403).json({ code: 'LIMIT_REACHED', message: LIMIT_MESSAGE });
        }

        let report;
        try { report = await buildReport({ text: extracted.text, pages: extracted.pages, kind, jobDescription }); }
        catch (aiError) {
            await refund(key, claimed); claimed = null;
            console.error('[ats] analysis failed:', aiError?.message);
            return res.status(502).json({ message: 'The analysis service is busy right now. Your check was not used - please try again in a moment.' });
        }

        const saved = await AtsReport.create({ userId: user._id, email: key, fileName: String(file.originalname || 'resume').slice(0, 120), score: report.score, report });
        const left = await AtsUsage.findOne({ email: key });
        return res.status(200).json({
            id: saved._id, fileName: saved.fileName, createdAt: saved.createdAt, report,
            left: Math.max(0, FREE_CHECKS - (left?.freeUsed || 0)) + (left?.credits || 0), limit: FREE_CHECKS,
        });
    } catch (error) {
        if (claimed && key) await refund(key, claimed);
        console.error('[ats] error:', error);
        return res.status(500).json({ message: 'Something went wrong. Your check was not used - please try again.' });
    } finally {
        if (locked) running.delete(locked);
    }
};

// GET /api/ats/reports  - this user's past reports (free to re-open)
export const listReports = async (req, res) => {
    try {
        const items = await AtsReport.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(20).select('fileName score createdAt');
        return res.status(200).json({ reports: items.map(summarise) });
    } catch (error) {
        console.error('[ats] list reports failed:', error);
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/ats/reports/:id
export const getReport = async (req, res) => {
    try {
        if (!/^[a-f0-9]{24}$/i.test(req.params.id)) return res.status(404).json({ message: 'Report not found' });
        const r = await AtsReport.findOne({ _id: req.params.id, userId: req.userId });
        if (!r) return res.status(404).json({ message: 'Report not found' });
        return res.status(200).json({ id: r._id, fileName: r.fileName, createdAt: r.createdAt, report: r.report });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
