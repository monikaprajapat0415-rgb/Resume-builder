import express from 'express';
import { getRoadmaps, getRoadmap } from '../controllers/roadmapController.js';

const roadmapRouter = express.Router();
roadmapRouter.get('/', getRoadmaps);
roadmapRouter.get('/:slug', getRoadmap);
export default roadmapRouter;
