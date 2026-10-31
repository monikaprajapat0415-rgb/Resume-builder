import { withLearn } from './lib.mjs';
import { n1 } from './node-1.mjs';
import { n2 } from './node-2.mjs';

const NODE = {
  'Node.js basics': 'what-is-nodejs-and-your-first-script',
  'Node.js modules, files and async': 'async-javascript-promises-and-event-loop',
  'Express basics and middleware': 'express-middleware-explained',
  'REST API design and errors': 'build-a-rest-api-crud-routes',
};
const MERN = {
  'MongoDB and Mongoose': 'connect-express-to-mongodb-with-mongoose',
  'Authentication and security': 'login-with-jwt-json-web-tokens',
  'MERN: connecting React and the API': 'react-useeffect-and-fetching-data-from-your-api',
  'Node.js testing, performance and deployment': 'deploy-a-mern-app-to-a-vps-with-pm2-nginx-and-https',
  'MERN architecture and scaling': 'mern-capstone-checklist-and-next-steps',
};
export const nodeQuestions = [
  ...withLearn(n1, 'nodejs-express-course', NODE),
  ...withLearn(n2, 'mern-stack-full-course', MERN),
];
