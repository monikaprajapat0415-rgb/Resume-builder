import express from 'express';
import { submitMessage } from '../controllers/contactController.js';
import { getPublicPage } from '../controllers/pageController.js';
import { getSiteContent } from '../controllers/siteContentController.js';
import { contactLimiter } from '../middlewares/rateLimiter.js';

// Public endpoints for the contact form, editable pages and editable site text.
const publicRouter = express.Router();
publicRouter.post('/contact', contactLimiter, submitMessage);
publicRouter.get('/pages/:slug', getPublicPage);
publicRouter.get('/site-content', getSiteContent);
export default publicRouter;
