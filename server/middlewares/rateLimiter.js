import rateLimit from "express-rate-limit";

// AI calls hit a paid, rate-limited upstream (Gemini/OpenAI), so cap how often
// any single signed-in user can trigger them. Keyed by userId (set by `protect`)
// so it can't be bypassed just by rotating IP.
export const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 30 AI requests per user per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.userId || req.ip,
    message: { message: "Too many AI requests. Please wait a few minutes and try again." },
});

// Auth endpoints (login/register/google-auth/forgot-password) are brute-force /
// credential-stuffing targets. Keyed by IP since there's no authenticated user yet.
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 20 attempts per IP per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts. Please wait a few minutes and try again." },
});

// Public contact form: a handful of messages per IP per hour is plenty for real people.
export const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "You've sent several messages already. Please try again later." },
});
