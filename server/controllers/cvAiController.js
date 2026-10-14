import Cv from "../models/Cv.js";
import { callAI, tryParseJSON } from "./aiController.js";

export const MAX_GENERATIONS_PER_CV = 8;

// The product's CV-writing prompt (kept verbatim; the guards below enforce its "never invent" rules in code too).
export const CV_SYSTEM_PROMPT = `You are an expert resume writer, ATS optimization specialist, and professional career consultant for Prime Resume AI.
Your task is to create a professional, accurate, ATS-friendly CV tailored to the user's target job, experience level, industry, and provided information.

Core requirements
1. Generate a complete, polished CV using only the information provided by the user.
2. Never invent employers, job titles, degrees, certifications, dates, achievements, metrics, or skills.
3. Improve grammar, spelling, clarity, and professional wording without changing the meaning of the user's experience.
4. Tailor the professional summary, skills, work experience, and projects to the target job description.
5. Naturally incorporate relevant keywords from the job description without keyword stuffing.
6. Use clear section headings, reverse-chronological work experience, concise bullet points, and professional language.
7. Write achievement-focused bullet points using action verbs and measurable results when actual metrics are provided.
8. For freshers, prioritize education, internships, academic projects, technical skills, and relevant coursework.
9. For experienced candidates, prioritize relevant experience, accomplishments, leadership, technical expertise, and career progression.
10. Do not add personal information such as age, religion, marital status, or a photograph unless explicitly requested and appropriate for the user's region and purpose.
11. Do not include references unless the user requests them.
12. Do not claim that a CV is guaranteed to pass every ATS.

CV sections
Select relevant sections based on the candidate's information:
- Full Name and Contact Information
- Professional Summary or Career Objective
- Technical Skills or Core Competencies
- Professional Experience
- Projects
- Education
- Certifications
- Internships
- Achievements
- Languages
- Relevant Additional Information
Omit sections for which no information is available. Never fill missing information with fabricated content.

ATS formatting rules
- Use a single-column, text-first structure.
- Use standard headings that applicant tracking systems can recognize.
- Avoid tables, text boxes, icons, graphics, skill-rating bars, and decorative columns in the CV content.
- Use consistent dates, bullet formatting, and section order.
- Expand important abbreviations when useful.
- Preserve important job-related keywords while maintaining natural readability.
- Prefer concise, specific bullet points over long paragraphs.

Output instructions
Return a valid JSON object with the following fields:
{
"cv_title": "Professional CV",
"professional_summary": "Candidate summary",
"skills": ["Skill 1", "Skill 2"],
"experience": [
{
"job_title": "Job title",
"company": "Company name",
"location": "Location if provided",
"start_date": "Start date",
"end_date": "End date or Present",
"responsibilities": ["Achievement or responsibility"]
}
],
"projects": [
{
"project_name": "Project name",
"description": "Project description",
"technologies": ["Technology"],
"achievements": ["Result if provided"]
}
],
"education": [
{
"qualification": "Degree or qualification",
"institution": "Institution",
"graduation_year": "Year if provided"
}
],
"certifications": [],
"internships": [],
"achievements": [],
"languages": [],
"additional_information": [],
"missing_information": [],
"ats_recommendations": []
}
Return valid JSON only, without Markdown fences or explanatory text. Use empty arrays for missing list data and empty strings for missing scalar values. Do not include unsupported facts. Ensure all JSON strings are properly escaped.
For each internship use the same object shape as an experience entry (job_title, company, location, start_date, end_date, responsibilities).`;

// ---------- helpers ----------
const s = (v, max = 600) => (typeof v === 'string' ? v : v == null ? '' : String(v)).replace(/\s+/g, ' ').trim().slice(0, max);
const list = (v, maxItems = 40, max = 400) => (Array.isArray(v) ? v : []).map((x) => s(x, max)).filter(Boolean).slice(0, maxItems);
const norm = (v) => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const same = (a, b) => { const x = norm(a), y = norm(b); return !!x && !!y && (x === y || x.includes(y) || y.includes(x)); };
const bulletsFromText = (t) => String(t || '').split(/\r?\n|•|•/).map((x) => x.replace(/^[\s\-*–]+/, '').trim()).filter(Boolean);

// Numbers/percentages in a bullet that the user never supplied = an invented metric.
const numbersIn = (t) => (String(t).match(/\d[\d,.]*/g) || []).map((n) => n.replace(/[,.]+$/, '').replace(/,/g, ''));
const makeNumberCheck = (corpus) => {
    const known = new Set(numbersIn(corpus));
    return (bullet) => numbersIn(bullet).every((n) => known.has(n));
};

const cleanBullets = (arr, fallbackText, numOk) => {
    const out = list(arr, 12, 300).filter((b) => numOk(b));
    if (out.length) return out;
    return bulletsFromText(fallbackText).slice(0, 8).map((b) => s(b, 300));
};

// <input type="month"> gives "2022-01"; a CV reads better (and ATS parse it better) as "Jan 2022".
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtDate = (d) => { const m = /^(\d{4})-(\d{2})$/.exec(String(d || '').trim()); return m && MONTHS[+m[2] - 1] ? `${MONTHS[+m[2] - 1]} ${m[1]}` : s(d, 40); };

const dateKey = (d) => { const t = Date.parse(String(d || '')); return Number.isNaN(t) ? null : t; };
const sortRecent = (items) => {
    const keys = items.map((e) => dateKey(e.start_date));
    if (keys.some((k) => k === null) || items.length < 2) return items;
    return items.map((e, i) => [e, keys[i]]).sort((a, b) => b[1] - a[1]).map(([e]) => e);
};

const pickAchievements = (aiList, inputList, numOk) => {
    const mine = list(inputList, 12, 300);
    if (!mine.length) return []; // nothing supplied -> nothing to show
    const ai = list(aiList, 12, 300).filter(numOk).slice(0, mine.length);
    return ai.length ? ai : mine;
};

// Rebuilds the AI answer so that every employer, title, date, school, degree, certification, language and
// metric comes from what the user typed. The model only contributes wording, ordering and keyword fit.
export const sanitizeCv = (raw, cvDoc) => {
    const inp = cvDoc.input || {};
    const corpus = [
        cvDoc.target?.job_title,
        inp.summary_notes, ...(inp.skills || []),
        ...(inp.experience || []).flatMap((e) => [e.job_title, e.company, e.start_date, e.end_date, e.details]),
        ...(inp.internships || []).flatMap((e) => [e.job_title, e.company, e.start_date, e.end_date, e.details]),
        ...(inp.projects || []).flatMap((p) => [p.name, p.technologies, p.details]),
        ...(inp.education || []).flatMap((e) => [e.qualification, e.institution, e.graduation_year, e.details]),
        ...(inp.certifications || []), ...(inp.achievements || []), ...(inp.languages || []), ...(inp.additional_information || []),
    ].join(' \n ');
    const lc = corpus.toLowerCase();
    const numOk = makeNumberCheck(corpus);
    const notes = [];

    const jobEntries = (inputList, aiList, label) => {
        const used = new Set();
        const result = [];
        (inputList || []).forEach((src, idx) => {
            if (!s(src.company) && !s(src.job_title)) return;
            let ai = (aiList || []).find((a, i) => !used.has(i) && same(a?.company, src.company) && (same(a?.job_title, src.job_title) || !s(src.job_title)));
            if (!ai) ai = (aiList || []).find((a, i) => !used.has(i) && same(a?.company, src.company));
            const aiIndex = (aiList || []).indexOf(ai);
            if (aiIndex >= 0) used.add(aiIndex);
            result.push({
                job_title: s(src.job_title, 120),
                company: s(src.company, 120),
                location: s(src.location, 120),
                start_date: fmtDate(src.start_date),
                end_date: src.is_current ? 'Present' : fmtDate(src.end_date),
                responsibilities: cleanBullets(ai?.responsibilities, src.details, numOk),
            });
        });
        if ((aiList || []).length > used.size && (aiList || []).some((a) => s(a?.company)) ) {
            const dropped = (aiList || []).filter((_, i) => !used.has(i)).length;
            if (dropped) notes.push(`${dropped} ${label} entr${dropped > 1 ? 'ies' : 'y'} suggested by the AI did not match your details and were removed.`);
        }
        return result.filter((e) => e.company || e.job_title);
    };

    const experience = sortRecent(jobEntries(inp.experience, raw.experience, 'experience'));
    const internships = jobEntries(inp.internships, raw.internships, 'internship');

    const education = (inp.education || [])
        .filter((e) => s(e.qualification) || s(e.institution))
        .map((e) => ({ qualification: s(e.qualification, 160), institution: s(e.institution, 160), graduation_year: s(e.graduation_year, 20) }));

    const projects = (inp.projects || []).filter((p) => s(p.name)).map((src) => {
        const ai = (raw.projects || []).find((a) => same(a?.project_name, src.name));
        const aiTech = list(ai?.technologies, 20, 60).filter((t) => lc.includes(t.toLowerCase()));
        const srcTech = s(src.technologies, 300).split(/[,;|]/).map((t) => t.trim()).filter(Boolean);
        const ach = list(ai?.achievements, 6, 300).filter(numOk);
        const desc = s(ai?.description, 500);
        return {
            project_name: s(src.name, 120),
            description: desc && numOk(desc) ? desc : s(src.details, 500),
            technologies: aiTech.length ? aiTech : srcTech,
            achievements: ach,
        };
    });

    // Skills: only ones the user listed or mentioned somewhere in their own text.
    const userSkills = list(inp.skills, 60, 60);
    const aiSkills = list(raw.skills, 60, 60).filter((k) => lc.includes(k.toLowerCase()));
    const seen = new Set();
    const skills = [...aiSkills, ...userSkills].filter((k) => { const n = k.toLowerCase(); if (seen.has(n)) return false; seen.add(n); return true; });
    if (list(raw.skills, 60, 60).length > aiSkills.length) notes.push('Some skills suggested by the AI were removed because they were not in your details.');

    const summaryRaw = s(raw.professional_summary, 900);
    const professional_summary = summaryRaw && numOk(summaryRaw) ? summaryRaw : '';

    const cv = {
        cv_title: s(raw.cv_title, 120) || 'Professional CV',
        professional_summary,
        skills,
        experience,
        projects,
        education,
        certifications: list(inp.certifications, 20, 200),
        internships,
        achievements: pickAchievements(raw.achievements, inp.achievements, numOk),
        languages: list(inp.languages, 12, 80),
        additional_information: list(inp.additional_information, 12, 300),
        missing_information: [...list(raw.missing_information, 15, 300), ...notes],
        ats_recommendations: list(raw.ats_recommendations, 12, 300),
    };

    // Programmatic hints so the checklist is useful even if the model returns none.
    const hints = [];
    const add = (re, text) => { if (!cv.missing_information.some((m) => re.test(m))) hints.push(text); };
    if (!professional_summary) add(/summary/i, 'Add a short professional summary (or write a few notes about your goals) so one can be generated.');
    if (!cvDoc.personal_info?.phone) add(/phone/i, 'Add a phone number - recruiters usually expect one.');
    if (!cvDoc.personal_info?.linkedin) add(/linkedin/i, 'Add your LinkedIn profile URL if you have one.');
    if (!cvDoc.target?.job_description) add(/job description/i, 'Paste the job description so the CV can be tailored with the right keywords.');
    if (cvDoc.target?.level !== 'fresher' && !experience.length) add(/experience/i, 'You chose "experienced" but no work experience was added.');
    cv.missing_information.push(...hints);
    cv.ats_recommendations = [...new Set([...cv.ats_recommendations, 'Download the text-based PDF: it keeps selectable text, which applicant tracking systems read best. No tool can guarantee passing every ATS.'])].slice(0, 12);
    return cv;
};

// POST /api/ai/generate-cv   body: { cvId }
export const generateCv = async (req, res) => {
    try {
        const { cvId } = req.body;
        const doc = await Cv.findOne({ userId: req.userId, _id: cvId });
        if (!doc) return res.status(404).json({ message: 'CV not found' });

        const inp = doc.input || {};
        const hasContent = (inp.experience || []).some((e) => e.company || e.job_title) || (inp.education || []).some((e) => e.institution || e.qualification)
            || (inp.projects || []).some((p) => p.name) || (inp.internships || []).some((e) => e.company || e.job_title);
        if (!doc.personal_info?.full_name?.trim()) return res.status(400).json({ message: 'Please add your full name first.' });
        if (!doc.target?.job_title?.trim()) return res.status(400).json({ message: 'Please add the job title you are applying for.' });
        if (!hasContent) return res.status(400).json({ message: 'Add at least one education, experience, internship or project entry so the CV has real content.' });
        if ((doc.generations || 0) >= MAX_GENERATIONS_PER_CV) {
            return res.status(429).json({ message: `You have reached the limit of ${MAX_GENERATIONS_PER_CV} AI generations for this CV. Duplicate it to start a fresh one.` });
        }

        const payload = {
            target_job_title: doc.target.job_title,
            target_company: doc.target.company,
            industry: doc.target.industry,
            experience_level: doc.target.level === 'experienced' ? 'experienced candidate' : 'fresher / entry level',
            job_description: doc.target.job_description || '(not provided)',
            personal_information: { full_name: doc.personal_info.full_name },
            candidate_notes_for_summary: inp.summary_notes,
            skills: inp.skills,
            experience: (inp.experience || []).map((e) => ({ ...e.toObject?.() ?? e, start_date: fmtDate(e.start_date), end_date: e.is_current ? 'Present' : fmtDate(e.end_date) })),
            internships: (inp.internships || []).map((e) => ({ ...e.toObject?.() ?? e, start_date: fmtDate(e.start_date), end_date: fmtDate(e.end_date) })),
            projects: inp.projects,
            education: inp.education,
            certifications: inp.certifications,
            achievements: inp.achievements,
            languages: inp.languages,
            additional_information: inp.additional_information,
        };
        const userPrompt = `Create the CV for this candidate. Use ONLY these details.\n\n${JSON.stringify(payload)}`;

        let out;
        try {
            out = await callAI(CV_SYSTEM_PROMPT, userPrompt);
        } catch (aiError) {
            console.error('[cv] AI error:', aiError?.message || aiError);
            return res.status(502).json({ message: process.env.DEBUG ? (aiError?.message || String(aiError)) : 'The AI service is busy. Please try again in a moment.' });
        }
        const parsed = tryParseJSON(out);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return res.status(502).json({ message: 'The AI returned an unreadable answer. Please try again.' });
        }

        const cv = sanitizeCv(parsed, doc);
        doc.cv = cv;
        doc.generated = true;
        doc.generations = (doc.generations || 0) + 1;
        if (!doc.title || doc.title === 'Untitled CV') doc.title = `${doc.target.job_title} CV`.slice(0, 120);
        await doc.save();
        return res.status(200).json({ cv: doc.cv, generations: doc.generations, remaining: MAX_GENERATIONS_PER_CV - doc.generations });
    } catch (error) {
        console.error('Error generating CV:', error);
        return res.status(400).json({ message: 'An error occurred while generating the CV. Please try again.' });
    }
};
