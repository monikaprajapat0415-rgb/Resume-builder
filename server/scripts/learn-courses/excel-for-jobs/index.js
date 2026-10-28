import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';

export const course = {
  title: 'Excel for Jobs: Formulas, Pivot Tables and Office Skills',
  slug: 'excel-for-jobs-course',
  summary: 'Learn the Excel skills that office, admin, accounts and data entry jobs ask for, in 15 lessons with one small shop sheet: formulas, lookups, pivot tables, charts and test practice.',
  description: 'Free Excel course for jobs. 15 lessons: formulas, IF, SUMIF, VLOOKUP, pivot tables, charts, data cleaning, validation, printing and test practice.',
  level: 'Beginner',
  topic: 'Office skills',
  badge: 'XLS',
  tags: ['excel', 'spreadsheets', 'office skills', 'vlookup', 'pivot tables'],
  order: 34,
  published: true,
  minWords: 650, // screen steps, formulas and sample tables carry part of each lesson
  metaTitle: 'Excel for Jobs: Free Course',
  keywords: 'excel course for jobs, learn excel free, excel for beginners, vlookup tutorial, pivot table tutorial, excel formulas, excel test practice',
};

export const lessons = finish([...p1, ...p2, ...p3]);
