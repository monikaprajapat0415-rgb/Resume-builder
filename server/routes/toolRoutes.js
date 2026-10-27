import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { imageLimiter } from '../middlewares/rateLimiter.js';
import { getStatus, enhance, handleUpload } from '../controllers/imageToolController.js';

const toolRouter = express.Router();
toolRouter.get('/image-enhance/status', protect, getStatus);
toolRouter.post('/image-enhance', protect, imageLimiter, handleUpload, enhance);
export default toolRouter;
