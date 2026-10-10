import express from 'express';
import { getCourses, getCourse, getLesson } from '../controllers/learnController.js';

const learnRouter = express.Router();
learnRouter.get('/', getCourses);
learnRouter.get('/:course', getCourse);
learnRouter.get('/:course/:lesson', getLesson);

export default learnRouter;
