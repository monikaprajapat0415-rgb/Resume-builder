import express from 'express';
import { getPublishedBlogs, getPublishedBlogBySlug, getPublishedBlogSlugs } from '../controllers/blogController.js';

const blogRouter = express.Router();

// Public - no auth. Order matters: /sitemap/slugs must be registered before
// /:slug so it isn't swallowed by the slug param route.
blogRouter.get('/sitemap/slugs', getPublishedBlogSlugs);
blogRouter.get('/', getPublishedBlogs);
blogRouter.get('/:slug', getPublishedBlogBySlug);

export default blogRouter;
