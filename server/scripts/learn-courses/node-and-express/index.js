import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';
import { lessons as p4 } from './part4.js';
import { lessons as p5 } from './part5.js';
import { lessons as p6 } from './part6.js';
import { lessons as p7 } from './part7.js';
import { lessons as p8 } from './part8.js';
import { lessons as p9 } from './part9.js';
import { lessons as p10 } from './part10.js';
import { lessons as p11 } from './part11.js';

export const course = {
  title: 'Node.js and Express: Build a Back End API from Scratch',
  slug: 'nodejs-express-course',
  summary: 'Learn back-end development with Node.js and Express in 55 lessons: core Node, REST, MongoDB, JWT auth, security, caching, queues, testing, Docker, deployment and 10 portfolio projects.',
  description: 'Free Node.js and Express course with 55 lessons and 10 projects: REST, MongoDB, JWT, security, Redis, queues, Socket.IO, testing, Docker and deployment.',
  level: 'Beginner to advanced',
  topic: 'Back end',
  badge: 'JS',
  tags: ['nodejs', 'express', 'rest api', 'mongodb', 'jwt', 'backend', 'projects', 'testing', 'deployment'],
  order: 36,
  published: true,
  minWords: 600, // working code files carry part of each lesson
  metaTitle: 'Node.js and Express: Free Course',
  keywords: 'node js express course, node js projects for resume, express js tutorial for beginners, node js course, express js tutorial, learn nodejs for beginners, rest api tutorial, node js mongodb, jwt login node, node js backend course',
};

export const lessons = finish([...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7, ...p8, ...p9, ...p10, ...p11]);
