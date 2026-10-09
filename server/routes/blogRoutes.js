import express from 'express';
import { getPublishedBlogs, getPublishedBlogBySlug, getPublishedBlogSlugs, getBlogSitemapXml, getBlogCategories } from '../controllers/blogController.js';

const blogRouter = express.Router();

// Public - no auth. Order matters: the sitemap/slug routes must be registered
// before /:slug so they aren't swallowed by the slug param route.
blogRouter.get('/sitemap.xml', getBlogSitemapXml);
blogRouter.get('/categories', getBlogCategories);
blogRouter.get('/sitemap/slugs', getPublishedBlogSlugs);
blogRouter.get('/', getPublishedBlogs);
blogRouter.get('/:slug', getPublishedBlogBySlug);

export default blogRouter;
