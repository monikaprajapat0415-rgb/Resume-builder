import express from 'express';
import { submitMessage } from '../controllers/contactController.js';
import { getPublicPage } from '../controllers/pageController.js';
import { getSiteContent } from '../controllers/siteContentController.js';
import protect from '../middlewares/authMiddleware.js';
import { feedbackLimiter } from '../middlewares/rateLimiter.js';
import { getHomeTrust, submitUserReview } from '../controllers/trustController.js';
import { contactLimiter, hitLimiter } from '../middlewares/rateLimiter.js';
import { recordHit, recordEngaged } from '../controllers/visitController.js';
import { publicAdConfig } from '../controllers/adsController.js';
import { publicNudge, nudgeEvent } from '../controllers/nudgeController.js';

// Public endpoints for the contact form, editable pages and editable site text.
const publicRouter = express.Router();
publicRouter.post('/contact', contactLimiter, submitMessage);
publicRouter.get('/pages/:slug', getPublicPage);
publicRouter.get('/site-content', getSiteContent);
publicRouter.get('/ads/config', publicAdConfig);
publicRouter.get('/nudge/config', publicNudge);
publicRouter.post('/nudge/event', hitLimiter, nudgeEvent);
import { getPublicPlan, planWebhook } from '../controllers/planController.js';
publicRouter.get('/plan', getPublicPlan);
publicRouter.post('/plan/webhook', planWebhook);
publicRouter.get('/home/trust', getHomeTrust);
publicRouter.post('/home/trust/review', protect, feedbackLimiter, submitUserReview);
publicRouter.post('/stats/hit', hitLimiter, recordHit);
publicRouter.post('/stats/engaged', hitLimiter, recordEngaged);
export default publicRouter;
