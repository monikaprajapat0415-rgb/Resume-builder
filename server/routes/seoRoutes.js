import express from 'express';
import { renderLearnIndex, renderCourse, renderLesson } from '../controllers/learnSeoController.js';
import { renderQuestionsIndex, renderQuestion, renderSalariesIndex, renderSalaryRole, renderCompaniesIndex, renderCompany } from '../controllers/communitySeoController.js';
import { renderRoadmapIndex, renderRoadmap } from '../controllers/roadmapSeoController.js';
import { renderExamplesIndex, renderExample } from '../controllers/examplesSeoController.js';
import { renderJobsIndex, renderJob, renderLanding } from '../controllers/jobSeoController.js';
import { renderHome, renderFeatures, renderAtsChecker, renderCvBuilder, renderMatcher, renderTemplatesIndex, renderTemplate, renderHire, renderContact, renderPrivacy, renderTerms, renderImageEnhancer, renderImageConverter, renderCareerTool, redirectOldTools } from '../controllers/staticSeoController.js';
import { getBlogSitemapXml } from '../controllers/blogController.js';
import { renderPost, renderIndex, rssFeed, llmsTxt, llmsFullTxt } from '../controllers/blogSeoController.js';

// Not under /api: these answer the public URLs themselves (https://site/blog/...).
// Order matters: rss.xml and category/:slug must come before /blog/:slug.
const seoRouter = express.Router();
seoRouter.get('/blog/rss.xml', rssFeed);
// Live sitemap (posts, products, pages, tutorial courses and lessons). Same output as
// /api/blogs/sitemap.xml, but on a public path nginx already sends to Node.
seoRouter.get('/sitemap-content.xml', getBlogSitemapXml);
// Same sitemap under the standard name. nginx must send exactly /sitemap.xml to Node (see nginx snippet).
seoRouter.get('/sitemap.xml', getBlogSitemapXml);
seoRouter.get('/llms.txt', llmsTxt);
seoRouter.get('/llms-full.txt', llmsFullTxt);
seoRouter.get('/blog/category/:slug', renderIndex);
seoRouter.get('/blog', renderIndex);
seoRouter.get('/blog/:slug', renderPost);

seoRouter.get('/jobs', renderJobsIndex);
// jobs community: these fixed paths must stay above /jobs/:slug
seoRouter.get('/jobs/interview-questions', renderQuestionsIndex);
seoRouter.get('/jobs/interview-questions/fresher', renderQuestionsIndex);
seoRouter.get('/jobs/interview-questions/experienced', renderQuestionsIndex);
seoRouter.get('/jobs/interview-questions/:slug', renderQuestion);
seoRouter.get('/jobs/salaries', renderSalariesIndex);
seoRouter.get('/jobs/salaries/:slug', renderSalaryRole);
seoRouter.get('/jobs/company-reviews', renderCompaniesIndex);
seoRouter.get('/jobs/company-reviews/:slug', renderCompany);
seoRouter.get('/jobs/in/:country', renderLanding);          // must stay above /jobs/:slug
seoRouter.get('/jobs/in/:country/:kind', renderLanding);
seoRouter.get('/jobs/:slug', renderJob);

seoRouter.get('/learn', renderLearnIndex);
seoRouter.get('/learn/:course', renderCourse);
seoRouter.get('/learn/:course/:lesson', renderLesson);

seoRouter.get('/examples', renderExamplesIndex);
seoRouter.get('/examples/:slug', renderExample);

seoRouter.get('/roadmaps', renderRoadmapIndex);
seoRouter.get('/roadmaps/:slug', renderRoadmap);

// Pages whose content lives in the client code: server-rendered copies for crawlers and AI assistants.
seoRouter.get('/', renderHome);
seoRouter.get('/features', renderFeatures);
seoRouter.get('/features/ats-checker', renderAtsChecker);
seoRouter.get('/cv-builder', renderCvBuilder);
seoRouter.get('/resume-job-description-matcher', renderMatcher);
seoRouter.get('/templates', renderTemplatesIndex);
seoRouter.get('/templates/:slug', renderTemplate);
seoRouter.get('/hire', renderHire);
seoRouter.get('/contact-us', renderContact);
seoRouter.get('/privacy-policy', renderPrivacy);
seoRouter.get('/terms-and-conditions', renderTerms);
seoRouter.get('/products/image-enhancer', renderImageEnhancer);
seoRouter.get('/products/image-converter', renderImageConverter);
seoRouter.get(['/products/cover-letter-generator', '/products/resume-bullet-improver', '/products/mock-interview-practice', '/products/job-offer-comparison', '/products/linkedin-headline-about-generator', '/products/code-playground', '/products/timed-interview-round', '/products/swift-code-reader'], renderCareerTool);
seoRouter.get(['/tools', '/tools/:slug'], redirectOldTools);

export default seoRouter;
