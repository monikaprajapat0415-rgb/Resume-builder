import { callAI, tryParseJSON } from '../controllers/aiController.js';

// "Apply fixes": the AI rewrites a resume to fix what an ATS report found. It may reword and tidy, but it must not
// invent anything. These guards run after the AI answers, so a bad answer cannot slip facts into someone's resume.

const SYSTEM = 'You are a careful resume editor. You fix ATS problems by rewording and tidying only what the person already wrote. You never invent employers, job titles, dates, degrees, skills, tools, numbers or achievements. You return ONLY one valid JSON object, no markdown.';

const s = (v, n) => String(v ?? '').replace(/\r/g, '').trim().slice(0, n);
const nums = (t) => new Set((String(t).match(/\d+(?:[.,]\d+)?/g) || []).map((x) => x.replace(',', '.')));
const hasNewNumber = (src, out) => { const a = nums(src); for (const n of nums(out)) if (!a.has(n)) return true; return false; };

const rulesText = `Rules:
- Keep every fact exactly: names, employers, job titles, dates, schools, degrees, places, phone, email, links.
- You may: write clearer sentences, start bullet points with strong action verbs, remove filler, fix grammar and spelling, make the summary specific, put skills into a clean list.
- Do NOT add any number, percentage, amount or date that is not already in the resume. Do NOT add skills, tools or keywords the resume does not already show.
- Keep bullet points as separate lines starting with "- " inside each description.
- Anything that needs information only the person has (real numbers, a missing phone number, a keyword they may truly have) must NOT be filled in. Put it in "needsYou" as a short plain sentence.
- "applied" is a short list (3 to 8 items) of what you changed, in plain words, e.g. "Rewrote the summary to say what you do and for whom".`;

const issueLines = (issues) => (issues || []).slice(0, 12).map((i, n) => `${n + 1}. [${i.severity || 'medium'}] ${s(i.area, 40)}: ${s(i.problem, 300)}${i.fix ? ` Fix: ${s(i.fix, 300)}` : ''}`).join('\n');

// The builder's date boxes need "YYYY-MM". Turn "Jan 2022", "01/2022", "2022-1" into that. A bare year becomes January
// of that year (flagged so the person can fix the month); anything unreadable is left empty, never guessed.
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
export const toMonth = (v, flags) => {
    const t = String(v ?? '').trim().toLowerCase();
    if (!t || /^(present|current|now|till date|to date|ongoing)$/.test(t)) return '';
    let m;
    if ((m = t.match(/^(\d{4})-(\d{1,2})$/))) return +m[2] >= 1 && +m[2] <= 12 ? `${m[1]}-${m[2].padStart(2, '0')}` : '';
    if ((m = t.match(/^(\d{1,2})[\/.-](\d{4})$/))) return +m[1] >= 1 && +m[1] <= 12 ? `${m[2]}-${m[1].padStart(2, '0')}` : '';
    if ((m = t.match(/^([a-z]{3,9})\.?,?\s+(\d{4})$/))) { const i = MONTHS.indexOf(m[1].slice(0, 3)); if (i >= 0) return `${m[2]}-${String(i + 1).padStart(2, '0')}`; }
    if ((m = t.match(/^(\d{4})$/)) && +m[1] > 1950 && +m[1] < 2100) { if (flags) flags.approx = true; return `${m[1]}-01`; }
    if (flags) flags.lost = true;
    return '';
};

const cleanList = (v, max) => (Array.isArray(v) ? v : []).map((x) => s(x, 200)).filter(Boolean).slice(0, max);

// ---- Case A: only text is available (an uploaded PDF/Word). Returns a full structured resume.
export const fixFromText = async ({ text, issues, missingKeywords, rewrites }) => {
    const prompt = `Here is a resume as plain text, and the problems an ATS checker found. Turn the resume into structured data AND fix the problems, following the rules.

${rulesText}

Problems found:
${issueLines(issues)}
${missingKeywords?.length ? `\nKeywords the checker says are missing (add ONLY if the resume already clearly shows the skill, otherwise list them in needsYou): ${missingKeywords.slice(0, 12).join(', ')}` : ''}

Resume text:
"""
${s(text, 12000)}
"""

Return ONLY JSON in this shape (empty strings/arrays when missing):
{"resume":{"professional_summary":"","skills":[],"personal_info":{"full_name":"","profession":"","email":"","phone":"","location":"","linkedin":"","website":""},"experience":[{"company":"","position":"","start_date":"","end_date":"","description":"","is_current":false}],"project":[{"name":"","type":"","description":""}],"education":[{"institution":"","degree":"","field":"","graduation_date":"","gpa":""}]},"applied":[],"needsYou":[]}`;
    const raw = await callAI(SYSTEM, prompt, { validate: (t) => { const j = tryParseJSON(t); return !!j && typeof j === 'object' && j.resume; } });
    const j = tryParseJSON(raw);
    if (!j?.resume) throw new Error('The AI did not return a resume.');
    const r = j.resume, src = String(text);
    const lineSafe = (d) => String(d || '').split('\n').filter((ln) => !hasNewNumber(src, ln)).join('\n'); // drop any line that brought in an unseen number
    const pi = r.personal_info || {};
    const flags = {};
    const resume = {
        professional_summary: hasNewNumber(src, r.professional_summary) ? '' : s(r.professional_summary, 1200),
        skills: cleanList(r.skills, 40).filter((k) => src.toLowerCase().includes(k.toLowerCase())),
        personal_info: { image: '', full_name: s(pi.full_name, 80), profession: s(pi.profession, 80), email: s(pi.email, 120), phone: s(pi.phone, 40), location: s(pi.location, 100), linkedin: s(pi.linkedin, 200), website: s(pi.website, 200) },
        experience: (Array.isArray(r.experience) ? r.experience : []).slice(0, 15).map((e) => ({
            company: s(e?.company, 120), position: s(e?.position, 120), start_date: toMonth(e?.start_date, flags), end_date: toMonth(e?.end_date, flags),
            description: s(lineSafe(e?.description), 2500), is_current: e?.is_current === true,
        })),
        project: (Array.isArray(r.project) ? r.project : []).slice(0, 10).map((p) => ({ name: s(p?.name, 120), type: s(p?.type, 80), description: s(lineSafe(p?.description), 1500) })),
        education: (Array.isArray(r.education) ? r.education : []).slice(0, 10).map((e) => ({
            institution: s(e?.institution, 160), degree: s(e?.degree, 100), field: s(e?.field, 100), graduation_date: toMonth(e?.graduation_date, flags), gpa: s(e?.gpa, 20),
        })),
    };
    const needsYou = cleanList(j.needsYou, 8);
    if (flags.approx) needsYou.push('Some dates only had a year, so we set the month to January. Please check the months.');
    if (flags.lost) needsYou.push('Some dates could not be read. Please fill them in.');
    // a job with no end date and no "current" flag is shown as ended; mark it current when the text said so
    resume.experience.forEach((e, i) => { const o = j.resume.experience?.[i]; if (!e.end_date && (e.is_current || /^(present|current|now|till date|to date|ongoing)$/i.test(String(o?.end_date || '').trim()))) e.is_current = true; });
    return { resume, applied: cleanList(j.applied, 8), needsYou: needsYou.slice(0, 10) };
};

// ---- Case B: a resume already in the builder. Only wording fields may change; facts are copied from the original.
export const fixStructured = async ({ resume, issues, missingKeywords, suggestions, jobDescription }) => {
    const base = {
        professional_summary: resume.professional_summary || '', skills: resume.skills || [],
        experience: (resume.experience || []).map((e) => ({ company: e.company, position: e.position, description: e.description || '' })),
        project: (resume.project || []).map((p) => ({ name: p.name, description: p.description || '' })),
    };
    const prompt = `Fix this resume's wording for an ATS, following the rules. Only these fields may change: professional_summary, experience[].description, project[].description, skills (reorder or tidy only). Keep the same number and order of experience and project entries.

${rulesText}

${issues?.length ? `Problems found:\n${issueLines(issues)}\n` : ''}${suggestions?.length ? `Suggestions from the score check:\n${suggestions.slice(0, 6).map((x, n) => `${n + 1}. ${s(x, 300)}`).join('\n')}\n` : ''}${missingKeywords?.length ? `Missing keywords for the job (use a keyword ONLY if the resume already clearly shows that skill, otherwise list it in needsYou): ${missingKeywords.slice(0, 15).join(', ')}\n` : ''}${jobDescription ? `\nJob description (to understand what matters, do not copy from it):\n${s(jobDescription, 3000)}\n` : ''}
Resume data:
${JSON.stringify(base)}

Return ONLY JSON: {"professional_summary":"","skills":[],"experience":[{"description":""}],"project":[{"description":""}],"applied":[],"needsYou":[]}`;
    const raw = await callAI(SYSTEM, prompt, { validate: (t) => { const j = tryParseJSON(t); return !!j && typeof j === 'object'; } });
    const j = tryParseJSON(raw);
    if (!j || typeof j !== 'object') throw new Error('The AI did not return usable text.');
    const srcAll = JSON.stringify(base);
    const out = { ...resume };
    const sum = s(j.professional_summary, 1200);
    if (sum && !hasNewNumber(resume.professional_summary || '', sum)) out.professional_summary = sum;
    const okDesc = (orig, next, max) => { const t = s(next, max); return t && !hasNewNumber(orig || '', t) ? t : orig; };
    if (Array.isArray(j.experience) && j.experience.length === (resume.experience || []).length) out.experience = resume.experience.map((e, i) => ({ ...e, description: okDesc(e.description, j.experience[i]?.description, 2500) }));
    if (Array.isArray(j.project) && j.project.length === (resume.project || []).length) out.project = resume.project.map((p, i) => ({ ...p, description: okDesc(p.description, j.project[i]?.description, 1500) }));
    const origSkills = (resume.skills || []).map((k) => k.toLowerCase());
    const skills = cleanList(j.skills, 40).filter((k) => origSkills.includes(k.toLowerCase()) || srcAll.toLowerCase().includes(k.toLowerCase()));
    if (skills.length >= Math.min(origSkills.length, 1)) out.skills = skills;
    return { resume: out, applied: cleanList(j.applied, 8), needsYou: cleanList(j.needsYou, 8) };
};
