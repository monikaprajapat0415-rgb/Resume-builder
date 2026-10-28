import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';

export const course = {
  title: 'SQL for Beginners: Learn Databases Step by Step',
  slug: 'sql-for-beginners',
  summary: 'Learn SQL from zero in 15 lessons with one small shop database: SELECT, JOIN, GROUP BY, subqueries, window functions, indexes and interview practice.',
  description: 'Free SQL course for beginners. 15 lessons in simple English with a practice database: joins, grouping, changing data, window functions and interview questions.',
  level: 'Beginner',
  topic: 'Data',
  badge: 'SQL',
  tags: ['sql', 'database', 'sqlite', 'joins', 'data analysis'],
  order: 32,
  minWords: 600, // code-heavy: examples and outputs carry part of each lesson
  published: true,
  metaTitle: 'SQL for Beginners: Free Course',
  keywords: 'sql for beginners, learn sql, sql course free, sql tutorial, sql joins, sql interview questions, sqlite tutorial',
};

export const lessons = finish([...p1, ...p2, ...p3]);
