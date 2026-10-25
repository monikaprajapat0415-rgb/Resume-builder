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
  summary: 'Build and put online a full app with React, Node.js and MongoDB. 40 simple lessons, with source code and an animation in every lesson.',
  description: 'Free MERN stack course for beginners. Build a Job Tracker with React, Node.js, Express and MongoDB, with simple lessons, code and animations.',
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
  "what-is-the-mern-stack": "Learn what MongoDB, Express, React and Node.js do, and follow one request from the browser to the database and back.",
  "set-up-your-tools-for-mern": "Install Node.js, Git, VS Code and MongoDB step by step, and check that everything works before you start.",
  "modern-javascript-for-mern": "The new JavaScript you will use every day: let, const, arrow functions, destructuring and modules, with small examples.",
  "asynchronous-javascript-promises-async-await": "Learn how JavaScript waits for slow things like a network call, using promises, async/await and fetch.",
  "http-json-and-rest-basics": "Understand how the browser and server talk: methods like GET and POST, status codes like 404, and JSON data.",
  "plan-the-job-tracker-project": "Plan the app before you code: what it does, which URLs it needs, what data it saves and how the folders look.",
  "node-js-basics-modules-files-events": "Run JavaScript outside the browser. Read and write files, use modules and events, and see what process gives you.",
  "npm-package-json-and-environment-variables": "Learn what npm and package.json do, how to run scripts, and how to keep secrets safe in a .env file.",
  "your-first-express-server-and-routes": "Build your first Express server. Add routes, read values from the URL and send back JSON.",
  "express-middleware-json-cors-and-logging": "Learn middleware, the small steps every request passes through. Add JSON reading, CORS and a request logger.",
  "express-routers-and-controllers": "Keep your code tidy. Split the API into routers and controllers so each file has one job.",
  "validation-and-error-handling-in-express": "Check what users send and handle mistakes in one place, so your API gives clear and safe error messages.",
  "test-your-api-with-rest-client-and-smoke-script": "Try your API with a .http file, curl and Postman, then run one script that checks every route for you.",
  "what-is-mongodb-documents-collections-atlas": "Learn how MongoDB saves data, get a free online database, and try your first commands in the shell.",
  "connect-express-to-mongodb-with-mongoose": "Connect your Express app to MongoDB with Mongoose, and start the server only after the database is ready.",
  "mongoose-schemas-models-and-validation": "Describe your data with a schema. Set types, rules and default values so bad data never gets saved.",
  "crud-with-mongoose-in-express": "Save real data. Create, read, update and delete jobs in MongoDB, and show friendly errors when something fails.",
  "search-filter-sort-pagination-and-indexes": "Let users search, filter, sort and open data page by page, and learn how an index makes searches fast.",
  "mongodb-aggregation-pipeline-for-statistics": "Count your jobs by status with an aggregation pipeline, and send the numbers to a dashboard.",
  "user-registration-and-password-hashing-with-bcrypt": "Let people sign up. Learn why you never save a plain password, and how bcrypt keeps it safe.",
  "login-with-jwt-json-web-tokens": "Let people log in. Check the password, give them a token (JWT) and learn how to avoid a common timing leak.",
  "protect-routes-and-ownership-checks": "Allow only signed-in users, and make sure each person can see only their own jobs.",
  "express-security-basics-helmet-rate-limit-nosql-injection": "Add simple protection: safe headers with helmet, limits on login tries, and a defence against NoSQL injection.",
  "automated-api-tests-with-node-test-runner": "Write tests that check your API for you, using the test runner that comes with Node.js. No extra tools needed.",
  "react-and-vite-setup-components-and-jsx": "Start a React app with Vite. Learn what components and JSX are and build your first screen.",
  "react-props-state-and-events": "Send data into components with props, keep changing data in state, and react to clicks, with a working status picker.",
  "react-lists-forms-and-controlled-inputs": "Show lists, build forms that React controls, check what users type and add clear labels for everyone.",
  "react-useeffect-and-fetching-data-from-your-api": "Load data from your API with useEffect. Show loading and error messages and stop old requests safely.",
  "react-router-pages-links-and-params": "Add many pages to your React app. Use links, read values from the URL and share one layout.",
  "react-context-and-custom-hooks": "Share data like the signed-in user across your app with context, and reuse your logic with custom hooks.",
  "react-crud-ui-create-edit-delete-with-the-api": "Add, edit and delete jobs from the screen. Ask before delete, and update the status at once with an undo on failure.",
  "sign-in-and-register-pages-with-protected-routes": "Build the sign-in and sign-up pages, and keep private pages locked until the user logs in.",
  "react-dashboard-stats-filters-and-pagination-in-the-url": "Build a dashboard with numbers, filters and pages. Save the choices in the URL so links and the back button work.",
  "responsive-styling-and-accessibility-in-react": "Make your app look good on phones and big screens, and easy to use with a keyboard, good colours and dark mode.",
  "react-performance-memo-debounce-and-code-splitting": "Make your app faster with simple tricks: memo, debounce and loading pages only when needed.",
  "file-upload-with-multer-and-react": "Let users attach a resume to a job. Upload files safely with multer and let only the owner download them.",
  "production-ready-express-logging-graceful-shutdown-compression-indexes": "Get your server ready for real users: clear logs, a safe stop, an honest health check and smaller responses.",
  "build-and-serve-the-react-app-from-express": "Build your React app for production and let Express serve it, so one server runs the whole project.",
  "deploy-a-mern-app-to-a-vps-with-pm2-nginx-and-https": "Put your app online. Set up a Linux server with pm2, nginx and a free HTTPS certificate, step by step.",
  "mern-capstone-checklist-and-next-steps": "A final checklist before you launch, the common beginner mistakes to avoid, and ideas for what to build next."
};
const clip = (t, max) => (t.length <= max ? t : t.slice(0, max - 1).replace(/[\s,;:.-]+\S*$/, '') + '.');

// Lesson N has the zip "mern-lesson-NN.zip" (the whole project as it stands after that lesson).
export const lessons = [...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7].map((l, i) => ({
  ...l, metaTitle: META[l.slug], description: DESC[l.slug], lab: LAB, labStep: i + 1, readTime: `${minutes(l)} min read`,
}));
