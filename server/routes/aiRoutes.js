import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { aiLimiter } from "../middlewares/rateLimiter.js";
import { enhanceProfessionalSummary, enhanceJobDescription, uploadResume, checkAtsScore, generateCoverLetter } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, aiLimiter, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, aiLimiter, enhanceJobDescription);
aiRouter.post('/upload-resume', protect, aiLimiter, uploadResume);
// ATS score checker - scores a resume against a pasted job description
aiRouter.post('/ats-score', protect, aiLimiter, checkAtsScore);
// AI cover letter generator - drafts a cover letter from resume data + a job description
aiRouter.post('/cover-letter', protect, aiLimiter, generateCoverLetter);

export default aiRouter;
