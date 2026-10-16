import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { contactLimiter } from '../middlewares/rateLimiter.js';
import { listJobs, jobFacets, getJob, reportJob, getLanding } from '../controllers/jobController.js';

const jobRouter = express.Router();
jobRouter.get('/', listJobs);
jobRouter.get('/facets', jobFacets);   // must stay above /:slug
jobRouter.get('/landing/:country{/:kind}', getLanding);   // above /:slug
jobRouter.get('/:slug', getJob);
jobRouter.post('/:slug/report', protect, contactLimiter, reportJob);

export default jobRouter;
