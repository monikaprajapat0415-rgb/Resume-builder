import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { createCv, deleteCv, duplicateCv, getCv, listCvs, updateCv } from '../controllers/cvController.js';

const cvRouter = express.Router();
cvRouter.get('/', protect, listCvs);
cvRouter.post('/create', protect, createCv);
cvRouter.post('/duplicate/:cvId', protect, duplicateCv);
cvRouter.put('/update', protect, updateCv);
cvRouter.delete('/delete/:cvId', protect, deleteCv);
cvRouter.get('/get/:cvId', protect, getCv);
export default cvRouter;
