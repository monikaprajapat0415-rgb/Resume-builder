import { Router } from 'express';
import { listJobs, getJob, createJob, updateJob, deleteJob } from '../controllers/jobs.js';
import { jobStats } from '../controllers/stats.js';
import { uploadResume, downloadResume, deleteResume } from '../controllers/files.js';
import { checkId } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.use(protect);
router.param('id', checkId);

router.get('/', listJobs);
router.get('/stats', jobStats);
router.post('/', createJob);
router.get('/:id', getJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

// the resume file of one job
router.post('/:id/resume', upload.single('resume'), uploadResume);
router.get('/:id/resume', downloadResume);
router.delete('/:id/resume', deleteResume);

export default router;
