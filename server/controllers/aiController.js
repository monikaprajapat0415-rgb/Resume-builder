import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";
import { inspect } from 'util';

// Try multiple strategies to parse possibly-invalid JSON returned by models.
const tryParseJSON = (input) => {
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

//controller for enhancing a resume's professional summery
//POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        // const response = await ai.chat.completions.create({
        //     model: process.env.OPENAI_MODEL,
        //     messages: [
        //         {
        //             role: "system",
        //             content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else. "
        //         },
        //         {
        //             role: "user",
        //             content: userContent,
        //         },
        //     ],
        // })
        let extractedData;
        let genResp;
        let enhancedContent;

        try {
             // @google/genai expects `contents` to be provided. Pass a single text content
                // containing the combined prompt. Some GenAI SDKs also accept an array of
                // content blocks with `{ type: 'text', text: '...' }`.
               if (ai?.models?.generateContent) {
                 genResp = await ai.models.generateContent({
                    model: process.env.GENAI_MODEL || process.env.OPENAI_MODEL,
                    contents: [
                        { type: 'text', text: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else. " }
                    ],
                });
            }

            extractedData = genResp?.candidates?.[0]?.content || genResp?.outputs?.[0]?.content?.[0]?.text || genResp?.output?.[0]?.content?.text || genResp?.candidates?.[0]?.output || JSON.stringify(genResp);
          enhancedContent = tryParseJSON(extractedData);


        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
        return res.status(200).json({ enhancedContent })

    } catch (error) {
        return res.status(400).json({ message: error.message })

    }
}

//controller for enhancing a resume's job description
//POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;
        let genResp;

        if (!userContent) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
             // @google/genai expects `contents` to be provided. Pass a single text content
                // containing the combined prompt. Some GenAI SDKs also accept an array of
                // content blocks with `{ type: 'text', text: '...' }`.
               if (ai?.models?.generateContent) {
               genResp = await ai.models.generateContent({
                    model: process.env.GENAI_MODEL || process.env.OPENAI_MODEL,
                    contents: [
                        { type: 'text', text: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else." }
                    ],
                });
            }
            const extractedData = genResp?.candidates?.[0]?.content || genResp?.outputs?.[0]?.content?.[0]?.text || genResp?.output?.[0]?.content?.text || genResp?.candidates?.[0]?.output || JSON.stringify(genResp);
            const enhancedContent = tryParseJSON(extractedData);
        return res.status(200).json({ enhancedContent })

    } catch (error) {
        console.error("Error enhancing job description:", error);
        return res.status(400).json({ message:"An error occurred while enhancing job description. Please try again." })

    }
}

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
        console.log("userPrompt:", userPropmt);
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
        let response;
        let extractedData;
        try {
            if (ai?.chat?.completions?.create) {
                response = await ai.chat.completions.create({
                    model: process.env.OPENAI_MODEL,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPropmt },
                    ],
                });
                extractedData = response?.choices?.[0]?.message?.content;
                if (process.env.DEBUG) {
                    // eslint-disable-next-line no-console
                    console.log("[ai] raw response preview:", typeof extractedData === 'string' ? extractedData.slice(0, 2000) : inspect(extractedData, { depth: 4 }));
                }
            } else if (ai?.models?.generateContent) {
                // @google/genai expects `contents` to be provided. Pass a single text content
                // containing the combined prompt. Some GenAI SDKs also accept an array of
                // content blocks with `{ type: 'text', text: '...' }`.
                const genResp = await ai.models.generateContent({
                    model: process.env.GENAI_MODEL || process.env.OPENAI_MODEL,
                    contents: [
                        { type: 'text', text: `${systemPrompt}\n\n${userPropmt}` }
                    ],
                });

                extractedData = genResp?.candidates?.[0]?.content || genResp?.outputs?.[0]?.content?.[0]?.text || genResp?.output?.[0]?.content?.text || genResp?.candidates?.[0]?.output || JSON.stringify(genResp);

            } else {
                throw new Error('No supported AI client method found on `ai`');
            }
        } catch (aiError) {
            // eslint-disable-next-line no-console
            // Return a 502 Bad Gateway to indicate upstream AI error.
            const message = process.env.DEBUG ? (aiError?.message || String(aiError)) : 'AI service error';
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