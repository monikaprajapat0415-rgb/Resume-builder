import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

// Adapter that prefers the Google GenAI client (@google/genai) when a
// Gemini/GenAI API key is present, otherwise falls back to the OpenAI client.
// This keeps your existing controllers working (they call ai.chat.completions.create(...)).

const genaiKey = process.env.GEMINI_API_KEY || process.env.GENAI_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || process.env.GENAI_BASE_URL || process.env.OPENAI_API_BASE_URL;

// Validate baseURL: if it's an empty string or invalid URL, ignore it and warn.
let safeBaseURL;
if (baseURL && String(baseURL).trim() !== "") {
    try {
        // This will throw if baseURL is not a valid absolute URL
        // eslint-disable-next-line no-new
        new URL(baseURL);
        safeBaseURL = baseURL;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[ai] ignoring invalid OPENAI/GEND_API baseURL: ${baseURL}`);
        safeBaseURL = undefined;
    }
}

let ai;

// Build options object and only include baseURL when it's valid.
const buildOptions = (key) => {
    const opts = {};
    if (key) opts.apiKey = key;
    if (safeBaseURL) opts.baseURL = safeBaseURL;
    return opts;
};

// Use top-level await to dynamically import @google/genai only when desired.
if (genaiKey) {
    try {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        const GenAIModule = await import("@google/genai");
        const GenAI = GenAIModule.default || GenAIModule;
        ai = new GoogleGenAI({});
        // eslint-disable-next-line no-console
        console.log("[ai] initialized @google/genai client (Gemini)", { usingBaseURL: !!safeBaseURL });
    } catch (err) {
        // If import fails, fall back to OpenAI but warn.
        // eslint-disable-next-line no-console
        console.warn("[ai] failed to load @google/genai, falling back to OpenAI:", err?.message);
        ai = new OpenAI(buildOptions(openaiKey));
        // eslint-disable-next-line no-console
        console.log("[ai] initialized OpenAI client (fallback)", { usingBaseURL: !!safeBaseURL });
    }
} else {
    ai = new OpenAI(buildOptions(openaiKey));
    // eslint-disable-next-line no-console
    console.log("[ai] initialized OpenAI client", { usingBaseURL: !!safeBaseURL });
}

export default ai;
