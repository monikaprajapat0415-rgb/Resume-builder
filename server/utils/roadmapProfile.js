// Matches a job seeker's own profile (resumes, CVs, open-to-work profile) against the skills in a roadmap.
// Everything here runs for the signed-in user on their own data and only derived results leave the server:
// which roadmap skills were found, never the raw resume text. Matching is a simple word comparison, so the
// page labels it as an estimate and lets the reader tick or untick steps themselves.
import Resume from '../models/Resume.js';
import Cv from '../models/Cv.js';
import TalentProfile from '../models/TalentProfile.js';

const STOP = new Set(['and', 'or', 'the', 'with', 'for', 'from', 'basic', 'basics', 'skills', 'skill', 'work', 'working', 'your', 'you', 'into', 'that', 'this', 'are', 'required', 'using', 'use', 'general', 'level', 'new', 'good']);
const singular = (w) => (w.length > 4 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w);
export const tokens = (text) => String(text || '').toLowerCase().replace(/\(.*?\)/g, ' ').split(/[^a-z0-9+#.]+/).map((w) => w.replace(/^\.+|\.+$/g, '')).filter((w) => w.length >= 3 && !STOP.has(w)).map(singular);

const CATEGORY_AUDIENCE = { factory: /factory|warehouse/i, skilled_trade: /skilled/i, daily_wage: /skilled|factory|driver/i, corporate: /office|customer|fresher|account/i };

export const collectProfile = async (userId) => {
    const [resumes, cvs, talent] = await Promise.all([
        Resume.find({ userId }).select('title professional_summary skills personal_info.profession experience.position experience.description project.name education.degree education.field').lean(),
        Cv.find({ userId }).select('target.job_title input.skills input.experience.job_title input.experience.details input.internships.job_title output.skills output.experience.job_title').lean(),
        TalentProfile.findOne({ userId }).select('headline skills category').lean(),
    ]);
    const bits = [];
    const titles = [];
    const sources = [];
    for (const r of resumes) {
        sources.push('resume');
        bits.push(r.professional_summary, ...(r.skills || []), r.personal_info?.profession);
        if (r.personal_info?.profession) titles.push(r.personal_info.profession);
        for (const e of r.experience || []) { bits.push(e.position, e.description); if (e.position) titles.push(e.position); }
        for (const p of r.project || []) bits.push(p.name);
        for (const e of r.education || []) bits.push(e.degree, e.field);
    }
    for (const c of cvs) {
        sources.push('CV');
        bits.push(c.target?.job_title, ...(c.input?.skills || []), ...(c.output?.skills || []));
        if (c.target?.job_title) titles.push(c.target.job_title);
        for (const e of [...(c.input?.experience || []), ...(c.input?.internships || []), ...(c.output?.experience || [])]) { bits.push(e.job_title, e.details); if (e.job_title) titles.push(e.job_title); }
    }
    if (talent) {
        sources.push('open-to-work profile');
        bits.push(talent.headline, ...(talent.skills || []));
        if (talent.headline) titles.push(talent.headline);
    }
    const text = bits.filter(Boolean).join(' \n ').toLowerCase();
    return {
        hasData: text.trim().length > 0,
        text,
        words: new Set(tokens(text)),
        titleWords: new Set(tokens(titles.join(' '))),
        category: talent?.category || '',
        sources: [...new Set(sources)],
    };
};

// does the profile show this skill? whole phrase first, then its meaningful words
export const hasSkill = (profile, skill) => {
    const phrase = String(skill).replace(/\(.*?\)/g, ' ').toLowerCase().replace(/\s+/g, ' ').trim();
    if (!phrase) return false;
    if (profile.text.includes(phrase)) return true;
    // "Forklift or pallet truck" counts when either side shows up
    return phrase.split(/\s+or\s+|\//).some((alt) => {
        const t = tokens(alt);
        if (!t.length) return false;
        const found = t.filter((w) => profile.words.has(w)).length;
        return t.length <= 2 ? found === t.length : found / t.length >= 0.67;
    });
};

// Step by step: which skills were found, and whether the step looks covered.
export const coverage = (profile, steps) => {
    const rows = steps.map((s) => {
        const matched = (s.skills || []).filter((k) => hasSkill(profile, k));
        const total = (s.skills || []).length;
        const status = total && matched.length === total ? 'have' : matched.length ? 'partial' : 'todo';
        return { matched, total, status };
    });
    const matched = rows.reduce((n, r) => n + r.matched.length, 0);
    const total = rows.reduce((n, r) => n + r.total, 0);
    // "Start here": carry on from the furthest step where the profile already shows something
    const lastHit = rows.reduce((n, r, i) => (r.matched.length ? i : n), -1);
    let next = lastHit === -1 ? 0 : (rows[lastHit].status === 'have' ? lastHit + 1 : lastHit);
    if (next >= rows.length) next = rows.findIndex((r) => r.status !== 'have');
    return { steps: rows, matched, total, percent: total ? Math.round((matched / total) * 100) : 0, nextStep: next < 0 ? null : next };
};

// How well a roadmap fits this person: found skills, a job-title match, and the kind of work they chose.
export const fitScore = (profile, roadmap) => {
    const cov = coverage(profile, roadmap.steps || []);
    const roadmapWords = new Set(tokens(`${roadmap.title} ${(roadmap.tags || []).join(' ')} ${roadmap.keywords || ''}`));
    const titleHits = [...profile.titleWords].filter((w) => roadmapWords.has(w)).length;
    const audienceBoost = profile.category && CATEGORY_AUDIENCE[profile.category]?.test(roadmap.audience || '') ? 2 : 0;
    return { score: cov.matched * 2 + Math.min(titleHits, 3) * 3 + audienceBoost, titleHits, ...cov };
};
