import express from 'express';
import { renderLearnIndex, renderCourse, renderLesson } from '../controllers/learnSeoController.js';
import { renderPost, renderIndex, rssFeed, llmsTxt, llmsFullTxt } from '../controllers/blogSeoController.js';

// Not under /api: these answer the public URLs themselves (https://site/blog/...).
// Order matters: rss.xml and category/:slug must come before /blog/:slug.
const seoRouter = express.Router();
seoRouter.get('/blog/rss.xml', rssFeed);
seoRouter.get('/llms.txt', llmsTxt);
seoRouter.get('/llms-full.txt', llmsFullTxt);
seoRouter.get('/blog/category/:slug', renderIndex);
seoRouter.get('/blog', renderIndex);
seoRouter.get('/blog/:slug', renderPost);

seoRouter.get('/learn', renderLearnIndex);
seoRouter.get('/learn/:course', renderCourse);
seoRouter.get('/learn/:course/:lesson', renderLesson);

export default seoRouter;
