import AtsReport from "../models/AtsReport.js";
import Resume from "../models/Resume.js";
import { fixFromText, fixStructured } from "../utils/atsFix.js";

const ID = /^[a-f0-9]{24}$/i;
const aiBusy = (res) => res.status(502).json({ message: 'The AI service is busy right now. Nothing was changed. Please try again in a moment.' });
const strs = (v, n, len) => (Array.isArray(v) ? v : []).map((x) => String(x ?? '').slice(0, len)).filter(Boolean).slice(0, n);

// POST /api/ats/reports/:id/apply  { force? }
// Builds a NEW resume in the person's account from the file they checked, with the report's fixes applied.
// The original upload is never touched. Free: it does not use an ATS check.
export const applyReportFixes = async (req, res) => {
    try {
        if (!ID.test(req.params.id)) return res.status(404).json({ message: 'Report not found' });
        const r = await AtsReport.findOne({ _id: req.params.id, userId: req.userId }).select('+sourceText');
        if (!r) return res.status(404).json({ message: 'Report not found' });
        if (r.fixedResumeId && req.body?.force !== true) {
            const existing = await Resume.findOne({ _id: r.fixedResumeId, userId: req.userId }).select('_id');
            if (existing) return res.status(200).json({ resumeId: existing._id, existing: true, applied: [], needsYou: [] });
        }
        if (!r.sourceText || r.sourceText.length < 80) return res.status(409).json({ code: 'NO_SOURCE', message: 'This older report was saved before "Apply fixes" existed. Please upload your resume again and run a new check.' });
        const rep = r.report || {};
        let out;
        try { out = await fixFromText({ text: r.sourceText, issues: rep.issues, missingKeywords: rep.keywords?.missing, rewrites: rep.rewrites }); }
        catch (e) { console.error('[ats-fix] text failed:', e?.message); return aiBusy(res); }
        const base = String(r.fileName || 'Resume').replace(/\.(pdf|docx)$/i, '').slice(0, 60) || 'Resume';
        const created = await Resume.create({ userId: req.userId, title: `${base} (ATS fixed)`, ...out.resume });
        r.fixedResumeId = created._id; await r.save();
        return res.status(201).json({ resumeId: created._id, applied: out.applied, needsYou: out.needsYou });
    } catch (e) { console.error('[ats-fix] apply report failed:', e?.message); return res.status(400).json({ message: 'Could not apply the fixes. Nothing was changed.' }); }
};

// POST /api/ats/apply-resume  { resumeId, jobDescription?, suggestions?, missingKeywords? }
// For a resume already in the builder: returns the improved wording but does NOT save. The builder shows it,
// lets the person undo, and saves through its normal Save/autosave.
export const proposeResumeFixes = async (req, res) => {
    try {
        const { resumeId } = req.body || {};
        if (!ID.test(String(resumeId))) return res.status(400).json({ message: 'A resume is required.' });
        const resume = await Resume.findOne({ _id: resumeId, userId: req.userId }).lean();
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        let out;
        try {
            out = await fixStructured({
                resume, jobDescription: String(req.body.jobDescription || '').slice(0, 5000),
                suggestions: strs(req.body.suggestions, 6, 300), missingKeywords: strs(req.body.missingKeywords, 15, 40),
            });
        } catch (e) { console.error('[ats-fix] structured failed:', e?.message); return aiBusy(res); }
        const { professional_summary, skills, experience, project } = out.resume;
        return res.status(200).json({ changes: { professional_summary, skills, experience, project }, applied: out.applied, needsYou: out.needsYou });
    } catch (e) { console.error('[ats-fix] propose failed:', e?.message); return res.status(400).json({ message: 'Could not prepare the fixes. Nothing was changed.' }); }
};
