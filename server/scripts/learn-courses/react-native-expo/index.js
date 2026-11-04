import { lessons as l1 } from './part1.js';
import { lessons as l2 } from './part2.js';
import { lessons as l3 } from './part3.js';
import { finish } from '../kit.js';

export const course = {
  title: 'React Native with Expo: 10 Real Projects',
  slug: 'react-native-development-expo-course',
  summary: 'Learn React Native from zero with Expo and TypeScript: ten complete apps with navigation, storage, SQLite, APIs, camera, notifications and state, plus testing and a store release guide.',
  description: 'Learn React Native with Expo and TypeScript by building 10 real apps with full source code, expected output, tests and an EAS publishing guide.',
  level: 'Beginner to advanced',
  topic: 'Mobile development',
  badge: 'New',
  tags: ['React Native', 'Expo', 'TypeScript', 'Expo Router', 'SQLite', 'TanStack Query', 'Zustand', 'Mobile apps'],
  order: 43,
  published: true,
  minWords: 450,
  metaTitle: 'React Native with Expo Course',
  keywords: ['react native course', 'expo tutorial', 'react native projects with source code', 'learn react native', 'react native typescript'],
};

export const lessons = finish([...l1, ...l2, ...l3]);
