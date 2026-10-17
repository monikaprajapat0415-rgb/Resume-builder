import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';
import protect from '../middlewares/authMiddleware.js';
import { feedbackLimiter } from '../middlewares/rateLimiter.js';
import { getCourses, getCourse, getLesson } from '../controllers/learnController.js';
import { listFeedback, createFeedback, deleteOwnFeedback } from '../controllers/feedbackController.js';

const learnRouter = express.Router();

// Reading comments is public, but if a valid token is sent we mark the reader's own comments.
const optionalUser = (req, res, next) => {
    const h = req.headers.authorization;
    if (h) { try { req.userId = jwt.verify(h.startsWith('Bearer ') ? h.split(' ')[1] : h, process.env.JWT_SECRET).userId; } catch { /* anonymous */ } }
    next();
};

// Solution downloads for the lesson tasks: GET /api/learn/downloads/<lab>/ai-lab-lesson-NN.zip
// Only names that match these patterns are served, and only from server/learn-labs/<lab>/zips.
const labsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'learn-labs');
learnRouter.get('/downloads/:lab/:file', (req, res) => {
    const { lab, file } = req.params;
    if (!/^[a-z0-9-]{1,60}$/.test(lab) || !/^ai-lab-lesson-\d{2}\.zip$/.test(file)) return res.status(404).json({ message: 'Not found' });
    const full = path.join(labsDir, lab, 'zips', file);
    if (!fs.existsSync(full)) return res.status(404).json({ message: 'Not found' });
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.download(full, file);
});

learnRouter.get('/', getCourses);
learnRouter.get('/:course', getCourse);
learnRouter.get('/:course/:lesson', getLesson);
learnRouter.get('/:course/:lesson/feedback', optionalUser, listFeedback);
learnRouter.post('/:course/:lesson/feedback', protect, feedbackLimiter, createFeedback);
learnRouter.delete('/:course/:lesson/feedback/:id', protect, deleteOwnFeedback);

export default learnRouter;
