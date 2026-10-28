import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';

export const course = {
  title: 'Node.js and Express: Build a Back End API from Scratch',
  slug: 'nodejs-express-course',
  summary: 'Learn back-end development with Node.js and Express in 15 lessons: modules, async code, routing, middleware, a task API, MongoDB, login with JWT, security, tests and deployment.',
  description: 'Free Node.js and Express course. 15 lessons: async code, routes, middleware, REST API, MongoDB, JWT login, security, tests and deployment with tested code.',
  level: 'Beginner',
  topic: 'Back end',
  badge: 'JS',
  tags: ['nodejs', 'express', 'rest api', 'mongodb', 'jwt', 'backend'],
  order: 36,
  published: true,
  minWords: 600, // working code files carry part of each lesson
  metaTitle: 'Node.js and Express: Free Course',
  keywords: 'node js course, express js tutorial, learn nodejs for beginners, rest api tutorial, node js mongodb, jwt login node, node js backend course',
};

export const lessons = finish([...p1, ...p2, ...p3]);
