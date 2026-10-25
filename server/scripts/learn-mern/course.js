import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';
import { lessons as p4 } from './part4.js';
import { lessons as p5 } from './part5.js';
import { lessons as p6 } from './part6.js';
import { lessons as p7 } from './part7.js';
import { LAB } from './helpers.js';

export const course = {
  title: 'MERN Stack Full Course: MongoDB, Express, React and Node.js',
  slug: 'mern-stack-full-course',
  summary: 'Build and deploy a complete full stack app, from JavaScript basics to sign-in, uploads and a live server. 40 lessons, source code in every lesson, and an animation for each.',
  description: 'Free MERN stack course from beginner to advanced: build a Job Tracker with React, Express, MongoDB and Node.js, with source code and animations.',
  level: 'All levels',
  topic: 'Full Stack',
  badge: 'MRN',
  tags: ['mern', 'react', 'node.js', 'express', 'mongodb'],
  order: 30,
  published: true,
  metaTitle: 'MERN Stack Course: Beginner to Advanced (Free)',
  keywords: 'mern stack course, mern stack tutorial, learn mern stack, full stack javascript course, react node express mongodb',
};

// Honest reading time: prose at about 200 words a minute, plus a little for the code.
const minutes = (l) => {
  let words = 0, code = 0;
  for (const b of l.content) {
    if (b.type === 'code') code += b.text.split('\n').length;
    else words += ((b.text || '') + ' ' + (b.items || []).join(' ')).split(/\s+/).filter(Boolean).length;
  }
  return Math.max(3, Math.round(words / 200 + code / 25));
};


// Short page titles (the site name is added, so keep these about 40 characters or less) and tighter descriptions.
const META = {
  'what-is-the-mern-stack': 'What Is the MERN Stack? Explained',
  'set-up-your-tools-for-mern': 'MERN Setup: Node.js, npm, Git, MongoDB',
  'modern-javascript-for-mern': 'Modern JavaScript for MERN (ES6+)',
  'asynchronous-javascript-promises-async-await': 'Async JavaScript: Promises, async/await',
  'http-json-and-rest-basics': 'HTTP, JSON and REST API Basics',
  'plan-the-job-tracker-project': 'Plan a MERN Project: API and Data Model',
  'node-js-basics-modules-files-events': 'Node.js Basics: Modules, Files, Events',
  'npm-package-json-and-environment-variables': 'npm, package.json and .env Variables',
  'your-first-express-server-and-routes': 'Your First Express Server and Routes',
  'express-middleware-json-cors-and-logging': 'Express Middleware: JSON, CORS, Logging',
  'express-routers-and-controllers': 'Express Routers and Controllers',
  'validation-and-error-handling-in-express': 'Express Validation and Error Handling',
  'test-your-api-with-rest-client-and-smoke-script': 'Test an Express API: REST Client, curl',
  'what-is-mongodb-documents-collections-atlas': 'MongoDB Basics: Documents and Atlas',
  'connect-express-to-mongodb-with-mongoose': 'Connect Express to MongoDB (Mongoose)',
  'mongoose-schemas-models-and-validation': 'Mongoose Schemas, Models, Validation',
  'crud-with-mongoose-in-express': 'CRUD with Mongoose and Express',
  'search-filter-sort-pagination-and-indexes': 'Mongoose Search, Pagination, Indexes',
  'mongodb-aggregation-pipeline-for-statistics': 'MongoDB Aggregation Pipeline Example',
  'user-registration-and-password-hashing-with-bcrypt': 'Node.js Password Hashing with bcrypt',
  'login-with-jwt-json-web-tokens': 'Login with JWT in Node.js and Express',
  'protect-routes-and-ownership-checks': 'Protect Express Routes: Auth, Ownership',
  'express-security-basics-helmet-rate-limit-nosql-injection': 'Express Security: helmet, Rate Limits',
  'automated-api-tests-with-node-test-runner': 'Node.js Test Runner: API Tests',
  'react-and-vite-setup-components-and-jsx': 'React and Vite Setup: Components, JSX',
  'react-props-state-and-events': 'React Props, State and Events (useState)',
  'react-lists-forms-and-controlled-inputs': 'React Lists, Forms, Controlled Inputs',
  'react-useeffect-and-fetching-data-from-your-api': 'React useEffect: Fetch Data from an API',
  'react-router-pages-links-and-params': 'React Router: Pages, Links, Params',
  'react-context-and-custom-hooks': 'React Context and Custom Hooks',
  'react-crud-ui-create-edit-delete-with-the-api': 'React CRUD UI with a REST API',
  'sign-in-and-register-pages-with-protected-routes': 'React Login Pages, Protected Routes',
  'react-dashboard-stats-filters-and-pagination-in-the-url': 'React Dashboard: Filters in the URL',
  'responsive-styling-and-accessibility-in-react': 'React Responsive CSS and Accessibility',
  'react-performance-memo-debounce-and-code-splitting': 'React Performance: memo, lazy, debounce',
  'file-upload-with-multer-and-react': 'File Upload with Multer and React',
  'production-ready-express-logging-graceful-shutdown-compression-indexes': 'Production-Ready Express Checklist',
  'build-and-serve-the-react-app-from-express': 'Serve a React Build from Express',
  'deploy-a-mern-app-to-a-vps-with-pm2-nginx-and-https': 'Deploy MERN to a VPS: pm2, nginx, HTTPS',
  'mern-capstone-checklist-and-next-steps': 'MERN Production Checklist and Next Steps',
};
const DESC = {
  'what-is-the-mern-stack': 'What MongoDB, Express, React and Node.js each do, how they fit together, and a script that follows one request from browser to database and back.',
  'plan-the-job-tracker-project': 'Plan a full stack app before coding: features, API routes, data model and folders. The Job Tracker plan you follow for the rest of the course.',
  'npm-package-json-and-environment-variables': 'Learn package.json, npm scripts, semantic versions and dotenv environment variables, and why .env stays out of Git.',
  'what-is-mongodb-documents-collections-atlas': 'How MongoDB stores documents in collections, how it differs from SQL, how to get a free Atlas database, and the mongosh commands to try.',
  'crud-with-mongoose-in-express': 'Replace the in-memory array with MongoDB: create, find, update and delete with Mongoose, validate ids and return friendly errors.',
  'protect-routes-and-ownership-checks': 'Write auth middleware, link every job to its owner, and prove that one person cannot read or change another person\'s jobs.',
  'react-props-state-and-events': 'Pass data with props, keep changing data in state, handle events and update state without mutation, with a status picker you can use.',
  'react-crud-ui-create-edit-delete-with-the-api': 'Create, edit and delete jobs through the API, with delete confirmation and an optimistic status update that rolls back on failure.',
  'file-upload-with-multer-and-react': 'Accept PDF and Word files with multer, check size, type and file signature, store a random name, and let the owner download it.',
  'mern-capstone-checklist-and-next-steps': 'A final production checklist, the mistakes that catch most beginners, and eight ideas to extend the Job Tracker with what you learned.',
};
const clip = (t, max) => (t.length <= max ? t : t.slice(0, max - 1).replace(/[\s,;:.-]+\S*$/, '') + '.');

// Lesson N has the zip "mern-lesson-NN.zip" (the whole project as it stands after that lesson).
export const lessons = [...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7].map((l, i) => ({
  ...l, metaTitle: META[l.slug], description: DESC[l.slug] || clip(l.description, 158), lab: LAB, labStep: i + 1, readTime: `${minutes(l)} min read`,
}));
