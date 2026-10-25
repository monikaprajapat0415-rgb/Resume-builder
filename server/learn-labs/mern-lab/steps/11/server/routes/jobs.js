import { Router } from 'express';
import { listJobs, getJob, createJob, updateJob, deleteJob } from '../controllers/jobs.js';

// A router groups the routes of one feature. index.js mounts it at /api/jobs.
const router = Router();

router.get('/', listJobs);
router.post('/', createJob);
router.get('/:id', getJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
