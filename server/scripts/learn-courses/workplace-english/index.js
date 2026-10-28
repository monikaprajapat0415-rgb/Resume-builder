import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';

export const course = {
  title: 'Workplace English: Emails, Calls, Meetings and Customers',
  slug: 'workplace-english-course',
  summary: 'Practical English for work in 15 lessons: polite tone, emails, reports, phone calls, meetings, listening, presentations, customer service, feedback and a daily practice plan.',
  description: 'Free workplace English course. 15 lessons on emails, phone calls, meetings, presentations, customer service and feedback, with ready phrases and practice tasks.',
  level: 'Beginner',
  topic: 'Communication',
  badge: 'ENG',
  tags: ['english', 'business english', 'workplace communication', 'email writing', 'spoken english'],
  order: 35,
  published: true,
  minWords: 540, // phrase lists and sample messages carry part of each lesson
  metaTitle: 'Workplace English: Free Course',
  keywords: 'workplace english course, business english for beginners, english for work, email writing english, english phone calls, meeting english phrases, customer service english',
};

export const lessons = finish([...p1, ...p2, ...p3]);
