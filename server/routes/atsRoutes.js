import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';
import { getStatus, analyze, listReports, getReport, handleUpload } from '../controllers/atsController.js';

const atsRouter = express.Router();
// Public self-check: open http://localhost:3000/api/ats/ping to confirm this server has the ATS feature.
atsRouter.get('/ping', (req, res) => res.status(200).json({ ok: true, feature: 'ats-checker' }));
atsRouter.get('/status', protect, getStatus);
atsRouter.get('/reports', protect, listReports);
atsRouter.get('/reports/:id', protect, getReport);
atsRouter.post('/analyze', protect, aiLimiter, handleUpload, analyze);

export default atsRouter;
