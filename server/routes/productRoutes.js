import express from 'express';
import { getPublishedProducts, getProductCategories, getPublishedProductBySlug, trackProductClick } from '../controllers/productController.js';

const productRouter = express.Router();

// Public. /categories must be registered before /:slug.
productRouter.get('/categories', getProductCategories);
productRouter.get('/', getPublishedProducts);
productRouter.post('/:slug/click', trackProductClick);
productRouter.get('/:slug', getPublishedProductBySlug);

export default productRouter;
