import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { rateLimit } from '../utils/communityCore.js';
import {
    getMeta, getQuestions, getQuestion, getSalaries, getSalaryRole, getCompanies, getCompany,
    addAnswer, addSalary, addReview, reportItem, getMine,
} from '../controllers/communityController.js';

const r = express.Router();
const post = rateLimit({ max: 12, windowMs: 60 * 60 * 1000, name: 'community-post' });
const flag = rateLimit({ max: 30, windowMs: 60 * 60 * 1000, name: 'community-flag' });

r.get('/meta', getMeta);
r.get('/questions', getQuestions);
r.get('/questions/:slug', getQuestion);
r.get('/salaries', getSalaries);
r.get('/salaries/:slug', getSalaryRole);
r.get('/companies', getCompanies);
r.get('/companies/:slug', getCompany);

r.get('/mine', protect, getMine);
r.post('/questions/:slug/answers', protect, post, addAnswer);
r.post('/salaries', protect, post, addSalary);
r.post('/reviews', protect, post, addReview);
r.post('/report/:type/:id', protect, flag, reportItem);
export default r;
