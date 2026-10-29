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

// Lesson feedback: a few comments per signed-in user per hour is plenty (stops spam floods).
export const feedbackLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true, // typos and validation errors should not use up the allowance
    keyGenerator: (req) => req.userId || req.ip,
    message: { message: "You've posted several comments already. Please try again later." },
});

// New accounts per network address per day. Generous enough for a shared college / office
// connection, tight enough to stop scripted fake-account sign-ups.
export const signupLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true, // a typo or "user already exists" should not use up the allowance
    message: { message: "Too many accounts were created from this connection today. Please try again tomorrow." },
});

// Company actions (search, contact, post). Keyed by user so rotating IPs does not help.
export const employerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.userId || req.ip,
    message: { message: "Too many requests. Please slow down and try again in a few minutes." },
});

// Image enhancer: heavy on CPU and memory, so also cap bursts per signed-in user (the daily limit is separate).
export const imageLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.userId || req.ip,
    message: { message: "You are sending images very quickly. Please wait a few minutes and try again." },
});

// Visit counter: a real person loads a few dozen pages an hour at most; this stops anyone inflating the numbers.
export const hitLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => res.status(204).end(),
});
