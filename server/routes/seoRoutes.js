import express from 'express';
import { renderLearnIndex, renderCourse, renderLesson } from '../controllers/learnSeoController.js';
import { renderJobsIndex, renderJob } from '../controllers/jobSeoController.js';
import { getBlogSitemapXml } from '../controllers/blogController.js';
import { renderPost, renderIndex, rssFeed, llmsTxt, llmsFullTxt } from '../controllers/blogSeoController.js';

// Not under /api: these answer the public URLs themselves (https://site/blog/...).
// Order matters: rss.xml and category/:slug must come before /blog/:slug.
const seoRouter = express.Router();
seoRouter.get('/blog/rss.xml', rssFeed);
// Live sitemap (posts, products, pages, tutorial courses and lessons). Same output as
// /api/blogs/sitemap.xml, but on a public path nginx already sends to Node.
seoRouter.get('/sitemap-content.xml', getBlogSitemapXml);
seoRouter.get('/llms.txt', llmsTxt);
seoRouter.get('/llms-full.txt', llmsFullTxt);
seoRouter.get('/blog/category/:slug', renderIndex);
seoRouter.get('/blog', renderIndex);
seoRouter.get('/blog/:slug', renderPost);

seoRouter.get('/jobs', renderJobsIndex);
seoRouter.get('/jobs/:slug', renderJob);

seoRouter.get('/learn', renderLearnIndex);
seoRouter.get('/learn/:course', renderCourse);
seoRouter.get('/learn/:course/:lesson', renderLesson);

export default seoRouter;
