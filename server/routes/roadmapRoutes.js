import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { getRoadmaps, getRoadmap, getRoadmapsForMe, getRoadmapForMe } from '../controllers/roadmapController.js';

const roadmapRouter = express.Router();
roadmapRouter.get('/', getRoadmaps);
roadmapRouter.get('/for-me', protect, getRoadmapsForMe);      // must stay above /:slug
roadmapRouter.get('/:slug/for-me', protect, getRoadmapForMe);
roadmapRouter.get('/:slug', getRoadmap);
export default roadmapRouter;
