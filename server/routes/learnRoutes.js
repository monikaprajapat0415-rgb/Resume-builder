import express from 'express';
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

learnRouter.get('/', getCourses);
learnRouter.get('/:course', getCourse);
learnRouter.get('/:course/:lesson', getLesson);
learnRouter.get('/:course/:lesson/feedback', optionalUser, listFeedback);
learnRouter.post('/:course/:lesson/feedback', protect, feedbackLimiter, createFeedback);
learnRouter.delete('/:course/:lesson/feedback/:id', protect, deleteOwnFeedback);

export default learnRouter;
