import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { listCards, createCard, updateCard, deleteCard } from '../controllers/trackerController.js';

const trackerRouter = express.Router();
trackerRouter.get('/', protect, listCards);
trackerRouter.post('/', protect, createCard);
trackerRouter.put('/:id', protect, updateCard);
trackerRouter.delete('/:id', protect, deleteCard);
export default trackerRouter;
