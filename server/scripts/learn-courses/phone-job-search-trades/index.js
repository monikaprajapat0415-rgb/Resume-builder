import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';

export const course = {
  title: 'Job Search on Your Phone: A Simple Guide for Skilled and Daily Wage Workers',
  slug: 'phone-job-search-trades-course',
  summary: 'A plain-language course in 10 short lessons for trade, factory, driving and service workers: set up your phone, write your skills, make a resume, find work, apply, avoid scams and prepare.',
  description: 'Free course in plain words for skilled trade, factory and daily wage workers. Find and apply for jobs from your phone, avoid scams and know your rights.',
  level: 'Beginner',
  topic: 'Job search',
  badge: 'JOB',
  tags: ['job search', 'skilled trades', 'daily wage', 'phone', 'resume', 'job scams'],
  order: 39,
  published: true,
  minWords: 550, // plain words and short sentences, easy to read on a phone
  metaTitle: 'Job Search on Your Phone: Free Course',
  keywords: 'job search on phone, jobs for skilled trades, daily wage jobs, factory jobs, how to make a resume on phone, job scams, resume for trade jobs',
};

export const lessons = finish([...p1, ...p2]);
