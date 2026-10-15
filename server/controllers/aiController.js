import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";
import { defaultRouter } from "../utils/aiRouter.js";
import { inspect } from 'util';

// Try multiple strategies to parse possibly-invalid JSON returned by models.
export const tryParseJSON = (input) => {
    // console.log("tryParseJSON input preview:", input);
    if (input === null || input === undefined) return null;

    // If input is already an object/array, return it directly or try to
    // extract a string from common wrapper fields.
    if (typeof input === 'object') {
        // Some GenAI responses include a `parts` array with `{ text: '...' }` entries.
        if (input.parts && Array.isArray(input.parts)) {
            try {
                input = input.parts.map(p => (typeof p.text === 'string' ? p.text : (p.content?.text || ''))).join('');
                input = input.replace(/```(?:json)?\n?/g, '').replace(/```$/g, '').trim();
                input = JSON.parse(input);
            } catch (e) {
                // fall through to other handlers
            }
        }
        // If it's already a plain object/array that looks like parsed JSON, return it.
        if (Array.isArray(input) || input.constructor === Object) return input;
        // Some SDKs return a wrapper with text/content fields; prefer those when present.
        if (typeof input.text === 'string') input = input.text;
        else if (typeof input.content === 'string') input = input.content;
        else if (input.candidates && Array.isArray(input.candidates) && typeof input.candidates[0]?.content === 'string') {
            input = input.candidates[0].content;
        } else if (input.outputs && Array.isArray(input.outputs) && typeof input.outputs[0]?.content?.[0]?.text === 'string') {
            input = input.outputs[0].content[0].text;
        } else {
            // give up and return the object as-is
            console.log("tryParseJSON object fallback:", input);
            return input;
        }
    }

    let text = String(input);
    // console.log("tryParseJSON text preview:", text.slice(0, 5000)); 

    // 1) direct parse
    try {
        // console.log("tryParseJSON direct parse preview:", text.slice(0, 5000));
        return JSON.parse(text);
    } catch (e) {
        // continue
    }

    // 2) strip markdown fences
    text = text.replace(/```(?:json)?\n?/g, '').replace(/```$/g, '').trim();

    // 3) extract first {...} or [...] block
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
        const candidate = match[0];
        try {
            return JSON.parse(candidate);
        } catch (e) {
            // try to sanitize
            let sanitized = candidate
                // remove JS-style comments
                .replace(/\/\/.*(?=[\n\r])/g, '')
                .replace(/\/\*[\s\S]*?\*\//g, '')
                // remove trailing commas
                .replace(/,\s*([}\]])/g, '$1')
                // convert single quotes to double where safe (naive)
                .replace(/'([^']*)'/g, '"$1"');
            try {
                return JSON.parse(sanitized);
            } catch (e2) {
                return null;
            }
        }
    }

    // 4) last ditch: try to replace single quotes globally and parse
    try {
        const alt = text.replace(/'([^']*)'/g, '"$1"').replace(/,\s*([}\]])/g, '$1');
        return JSON.parse(alt);
    } catch (e) {
        return null;
    }
};

// Small sleep helper for retries
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Attempt a GenAI generateContent with retries/backoff on transient errors.
const genaiGenerateWithRetries = async (model, contents, maxAttempts = 3) => {
    let attempt = 0;
    let lastErr;
    while (attempt < maxAttempts) {
        try {
            // `ai.models.generateContent` is provided by the GenAI client
            return await ai.models.generateContent({ model, contents });
        } catch (err) {
            lastErr = err;
            attempt += 1;
            const errMsg = err?.message || JSON.stringify(err?.error || err || 'unknown');
            // If it's a transient server-side error (5xx) or UNAVAILABLE, retry with backoff
            const isTransient = /5\d{2}/.test(errMsg) || /UNAVAILABLE/.test(errMsg) || /high demand/i.test(errMsg);
            if (!isTransient || attempt >= maxAttempts) break;
            const backoff = 500 * Math.pow(2, attempt - 1);
            // eslint-disable-next-line no-console
            console.warn(`[ai] genai attempt ${attempt} failed transiently: ${errMsg}, retrying in ${backoff}ms`);
            // wait before retrying
            // eslint-disable-next-line no-await-in-loop
            await sleep(backoff);
        }
    }
    throw lastErr;
};

// Shared by the two "enhance with AI" buttons: sends the user's own text to the AI (with automatic
// provider fallback) and returns clean plain text.
const enhanceText = async (res, system, userContent, errorLabel) => {
    if (!userContent || !String(userContent).trim()) return res.status(400).json({ message: 'Missing required fields' });
    try {
        const raw = await callAI(system, String(userContent).slice(0, 4000), { validate: (t) => t.trim().length > 0 });
        const enhancedContent = String(raw).replace(/```(?:\w+)?\n?/g, '').replace(/```$/g, '').trim().replace(/^["']|["']$/g, '').trim();
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        console.error(`Error ${errorLabel}:`, error?.message || error);
        return res.status(502).json({ message: 'The AI service is busy right now. Please try again in a moment.' });
    }
};

//controller for enhancing a resume's professional summery
//POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = (req, res) => enhanceText(res,
    "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Do not invent facts. Only return the improved text, no options, quotes or explanations.",
    req.body.userContent, 'enhancing professional summary');

//controller for enhancing a resume's job description
//POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = (req, res) => enhanceText(res,
    "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible, but do not invent numbers. Make it ATS-friendly. Only return the improved text, no options, quotes or explanations.",
    req.body.userContent, 'enhancing job description');

//controller for uploading a resume to the database
//POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {

        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const systemPrompt = 'You are an expert AI agent to extract structured data from resumes.'
        const userPropmt = `Extract structured data from the following resume text and return ONLY a single valid JSON object — nothing else (no explanation, no markdown, no leading/trailing text).\nResume text:\n${resumeText}\n\nThe JSON must follow this example shape exactly (use empty strings/arrays when data is missing):{  "professional_summary": "",  "skills": [],  "personal_info": {    "image": "",    "full_name": "",    "profession": "",    "email": "",    "phone": "",    "location": "",    "linkedin": "",    "website": ""  },  "experience": [    {      "company": "",      "position": "",      "start_date": "",      "end_date": "",      "description": "",      "is_current": false    }  ],  "project": [    {      "name": "",      "type": "",      "description": ""    }  ],  "education": [    {      "institution": "",      "degree": "",      "field": "",      "graduation_date": "",      "gpa": ""    }  ]}`
       // console.log("userPrompt:", userPropmt);
        //console.log("systemPrompt:", systemPrompt);
        //console.log("OPENAI_MODEL:", process.env.OPENAI_MODEL);

        // Diagnostics: log request metadata to help identify "Invalid URL" / network issues.
        if (process.env.DEBUG) {
            // eslint-disable-next-line no-console
            console.log('[ai] uploadResume headers:', req.headers);
            // eslint-disable-next-line no-console
            console.log('[ai] resumeText length:', String(resumeText).length);
        }

        // Note: the `response_format: { type: 'json_object' }` option
        // is not supported by the OpenAI JS client used here. Request
        // a plain JSON string from the model and parse it robustly.
        let extractedData;
        try {
            // callAI tries each configured AI provider in turn; an answer that is not parseable JSON counts as a failure.
            extractedData = await callAI(systemPrompt, userPropmt, { validate: (t) => { const j = tryParseJSON(t); return !!j && typeof j === 'object'; } });
        } catch (aiError) {
            const message = process.env.DEBUG ? (aiError?.message || String(aiError)) : 'The AI service is busy right now. Please try again in a moment.';
            return res.status(502).json({ message });
        }


        // Attempt robust parsing with multiple fallbacks. If parsing ultimately fails,
        // save the raw AI output to the DB and return a successful response so the user
        // can inspect the raw output and recover manually.
        let parsedData = tryParseJSON(extractedData);
        // parsedData = JSON.parse(parsedData);
        console.log("parsedData:", parsedData);
        
        const newResume = await Resume.create({
            userId,
            title,
            ...parsedData
        })
        console.log("Created new resume with ID:", newResume);

        res.json({ resumeId: newResume._id })

    } catch (error) {
        return res.status(400).json({ message: error.message })

    }
}

// Shared helper: send a system+user prompt to whichever AI client is configured
// (OpenAI-style chat completions, or @google/genai's generateContent) and return
// the raw text response. Used by the ATS score checker and cover letter generator
// below so they don't have to duplicate the client branching every time.
export const callAI = async (systemPrompt, userPrompt, options = {}) => {
    // Tries every configured AI provider in turn (see utils/aiRouter.js), so one busy model does not fail the request.
    // options.validate(text) can reject an unusable answer so the next provider gets a chance.
    return defaultRouter().call(systemPrompt, userPrompt, options);
};

//controller for scoring a resume against a job description (ATS match score)
//POST: /api/ai/ats-score
export const checkAtsScore = async (req, res) => {
    try {
        const { resumeId, jobDescription } = req.body;
        const userId = req.userId;

        if (!resumeId || !jobDescription || !jobDescription.trim()) {
            return res.status(400).json({ message: 'A resume and a job description are required' });
        }

        const resume = await Resume.findOne({ userId, _id: resumeId });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const resumeSummary = {
            professional_summary: resume.professional_summary,
            skills: resume.skills,
            experience: resume.experience,
            education: resume.education,
            project: resume.project,
        };

        const systemPrompt = "You are an expert ATS (Applicant Tracking System) and technical recruiter. You compare a resume against a job description and return ONLY a single valid JSON object - no markdown, no explanation, no leading/trailing text.";
        const userPrompt = `Compare this resume data against the job description below. Score how well the resume matches the job on a 0-100 scale (100 = perfect match), list important keywords/skills from the job description that ARE present in the resume, list important keywords/skills from the job description that are MISSING from the resume, and give 3-5 short, actionable suggestions to improve the match.

Resume data (JSON):
${JSON.stringify(resumeSummary)}

Job description:
${jobDescription}

Return ONLY a JSON object with exactly this shape:
{
  "score": 0,
  "matchedKeywords": [],
  "missingKeywords": [],
  "suggestions": []
}`;

        let extractedData;
        try {
            extractedData = await callAI(systemPrompt, userPrompt);
        } catch (aiError) {
            const message = process.env.DEBUG ? (aiError?.message || String(aiError)) : 'AI service error';
            return res.status(502).json({ message });
        }

        const result = tryParseJSON(extractedData);
        if (!result || typeof result.score === 'undefined') {
            return res.status(502).json({ message: 'Could not parse AI response. Please try again.' });
        }
        // clamp score defensively in case the model returns something out of range
        result.score = Math.max(0, Math.min(100, Number(result.score) || 0));

        return res.status(200).json({ result });
    } catch (error) {
        console.error("Error checking ATS score:", error);
        return res.status(400).json({ message: "An error occurred while checking the ATS score. Please try again." });
    }
}

//controller for generating a tailored cover letter from resume data + a job description
//POST: /api/ai/cover-letter
export const generateCoverLetter = async (req, res) => {
    try {
        const { resumeId, jobDescription, companyName, jobTitle, tone } = req.body;
        const userId = req.userId;

        if (!resumeId || !jobDescription || !jobDescription.trim()) {
            return res.status(400).json({ message: 'A resume and a job description are required' });
        }

        const resume = await Resume.findOne({ userId, _id: resumeId });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const resumeSummary = {
            full_name: resume.personal_info?.full_name,
            profession: resume.personal_info?.profession,
            email: resume.personal_info?.email,
            professional_summary: resume.professional_summary,
            skills: resume.skills,
            experience: resume.experience,
            education: resume.education,
            project: resume.project,
        };

        const systemPrompt = "You are an expert career coach who writes concise, compelling, ATS-friendly cover letters. Return ONLY the cover letter text - no markdown headers, no explanation, no JSON, just the letter body ready to send.";
        const userPrompt = `Write a ${tone || 'professional'} cover letter (3-4 short paragraphs, under 350 words) for this candidate applying to ${jobTitle ? `the "${jobTitle}" role` : 'a role'}${companyName ? ` at ${companyName}` : ''}.

Candidate resume data (JSON):
${JSON.stringify(resumeSummary)}

Job description:
${jobDescription}

Highlight the candidate's most relevant experience and skills for this specific job. Do not invent facts not present in the resume data. Sign off with the candidate's name.`;

        let letterText;
        try {
            letterText = await callAI(systemPrompt, userPrompt, { validate: (t) => t.trim().length > 40 });
            if (typeof letterText === 'object') {
                letterText = letterText?.text || JSON.stringify(letterText);
            }
            // strip accidental markdown code fences if the model added them
            letterText = String(letterText).replace(/```(?:\w+)?\n?/g, '').replace(/```$/g, '').trim();
        } catch (aiError) {
            const message = process.env.DEBUG ? (aiError?.message || String(aiError)) : 'AI service error';
            return res.status(502).json({ message });
        }

        return res.status(200).json({ coverLetter: letterText });
    } catch (error) {
        console.error("Error generating cover letter:", error);
        return res.status(400).json({ message: "An error occurred while generating the cover letter. Please try again." });
    }
}