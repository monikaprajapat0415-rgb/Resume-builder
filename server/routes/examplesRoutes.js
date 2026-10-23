import express from 'express';
import { listExamples, getExampleBySlug } from '../controllers/examplesController.js';

const examplesRouter = express.Router();
examplesRouter.get('/', listExamples);
examplesRouter.get('/:slug', getExampleBySlug);
export default examplesRouter;
