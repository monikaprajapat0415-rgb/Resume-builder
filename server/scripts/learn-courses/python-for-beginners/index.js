import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';

export const course = {
  title: 'Python for Beginners: Learn to Code with Real Projects',
  slug: 'python-for-beginners-course',
  summary: 'Learn Python from zero in 15 lessons: variables, decisions, loops, functions, files, errors, modules, classes, a CSV report, file automation and a command line expense tracker.',
  description: 'Free Python course for beginners. 15 lessons with tested code: variables, loops, functions, files, errors, classes, CSV reports, automation and a final project.',
  level: 'Beginner',
  topic: 'Programming',
  badge: 'PY',
  tags: ['python', 'programming for beginners', 'automation', 'csv', 'learn to code'],
  order: 37,
  published: true,
  minWords: 600, // code and sample output carry part of each lesson
  metaTitle: 'Python for Beginners: Free Course',
  keywords: 'python for beginners, learn python free, python course, python tutorial, python projects for beginners, python automation, python csv',
};

export const lessons = finish([...p1, ...p2, ...p3]);
