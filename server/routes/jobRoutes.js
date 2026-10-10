import express from 'express';
import { listJobs, jobFacets, getJob } from '../controllers/jobController.js';

const jobRouter = express.Router();
jobRouter.get('/', listJobs);
jobRouter.get('/facets', jobFacets);   // must stay above /:slug
jobRouter.get('/:slug', getJob);

export default jobRouter;
