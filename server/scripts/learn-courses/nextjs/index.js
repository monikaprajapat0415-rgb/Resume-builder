import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';

export const course = {
  title: 'Next.js Course: Beginner to Advanced with Examples',
  slug: 'nextjs-course',
  summary: 'Learn Next.js step by step in simple English: how it works, the App Router, routing, layouts, Server and Client Components, data fetching and more, with code that was built and run.',
  description: 'Free Next.js course for beginners in simple English: rendering, App Router, routing, layouts and components, with tested examples. More modules follow.',
  level: 'Beginner to Advanced',
  topic: 'Front end and full stack',
  badge: 'NX',
  tags: ['nextjs', 'react', 'app router', 'server components', 'routing', 'typescript', 'tailwind', 'full stack'],
  order: 45,
  published: true,
  minWords: 600,
  metaTitle: 'Next.js Course for Beginners',
  keywords: 'next js course for beginners, learn next js, next js tutorial, next js app router tutorial, next js server components, next js routing, next js for react developers',
};

export const lessons = finish([...p1, ...p2, ...p3]);
