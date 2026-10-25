import { Router } from 'express';
import { listJobs, getJob, createJob, updateJob, deleteJob } from '../controllers/jobs.js';
import { jobStats } from '../controllers/stats.js';
import { checkId } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect); // everything below needs a signed-in person
router.param('id', checkId);

router.get('/', listJobs);
router.get('/stats', jobStats);
router.post('/', createJob);
router.get('/:id', getJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
