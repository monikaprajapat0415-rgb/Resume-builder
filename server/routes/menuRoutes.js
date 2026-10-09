import express from 'express';
import { getMenu } from '../controllers/menuController.js';

const menuRouter = express.Router();
menuRouter.get('/', getMenu);
export default menuRouter;
