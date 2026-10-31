import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { imageLimiter } from '../middlewares/rateLimiter.js';
import { publicToolSettings } from '../controllers/toolSettingsController.js';
import { getStatus, enhance, handleUpload } from '../controllers/imageToolController.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';
import { getStatus as careerStatus, coverLetter, bullets, linkedin, mockInterview } from '../controllers/careerToolsController.js';

const toolRouter = express.Router();
toolRouter.get('/settings', publicToolSettings);
toolRouter.get('/image-enhance/status', protect, getStatus);
toolRouter.post('/image-enhance', protect, imageLimiter, handleUpload, enhance);
// Free career tools (AI): sign-in needed, admin on/off switch and one shared daily limit (Admin > Free tools)
toolRouter.get('/career/status', protect, careerStatus);
toolRouter.post('/career/cover-letter', protect, aiLimiter, coverLetter);
toolRouter.post('/career/bullets', protect, aiLimiter, bullets);
toolRouter.post('/career/linkedin', protect, aiLimiter, linkedin);
toolRouter.post('/career/mock-interview', protect, aiLimiter, mockInterview);
export default toolRouter;
