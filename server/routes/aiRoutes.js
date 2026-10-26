import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { aiLimiter } from "../middlewares/rateLimiter.js";
import { requirePlanFor } from "../middlewares/planGate.js";
import { generateCv } from "../controllers/cvAiController.js";
import { enhanceProfessionalSummary, enhanceJobDescription, uploadResume, checkAtsScore, generateCoverLetter } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, requirePlanFor('ai_writing'), aiLimiter, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, requirePlanFor('ai_writing'), aiLimiter, enhanceJobDescription);
aiRouter.post('/upload-resume', protect, aiLimiter, uploadResume);
// ATS score checker - scores a resume against a pasted job description
aiRouter.post('/ats-score', protect, aiLimiter, checkAtsScore);
// AI cover letter generator - drafts a cover letter from resume data + a job description
aiRouter.post('/cover-letter', protect, requirePlanFor('cover_letter'), aiLimiter, generateCoverLetter);

// AI CV builder - writes a tailored, ATS-friendly CV from the details saved on a CV document
aiRouter.post('/generate-cv', protect, requirePlanFor('cv_generate'), aiLimiter, generateCv);

export default aiRouter;
