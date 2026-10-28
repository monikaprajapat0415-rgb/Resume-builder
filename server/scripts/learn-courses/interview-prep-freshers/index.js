import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';

export const course = {
  title: 'Interview Preparation for Freshers: Answers, Tests and Confidence',
  slug: 'interview-preparation-for-freshers',
  summary: 'A 15-lesson course for first-time job seekers: how interviews work, common questions, STAR stories, aptitude and technical rounds, online interviews, pay questions and staying safe from job scams.',
  description: 'Free interview course for freshers. 15 lessons with sample answers: tell me about yourself, STAR, tests, group discussion, video interviews and pay.',
  level: 'Beginner',
  topic: 'Career',
  badge: 'INT',
  tags: ['interview', 'freshers', 'career', 'job search', 'star method'],
  order: 33,
  minWords: 700, // sample answers and checklists carry part of each lesson
  published: true,
  metaTitle: 'Interview Preparation for Freshers',
  keywords: 'interview preparation for freshers, fresher interview questions, tell me about yourself, star method, aptitude test preparation, group discussion tips, video interview tips',
};

export const lessons = finish([...p1, ...p2, ...p3]);
