import { lessons as l1 } from './part1.js';
import { lessons as l2 } from './part2.js';
import { lessons as l3 } from './part3.js';
import { finish } from '../kit.js';

export const course = {
  title: 'Android Development with Kotlin: 10 Real Projects',
  slug: 'android-development-kotlin-course',
  summary: 'Learn Android from zero: Kotlin, then ten complete apps with Jetpack Compose, Room, Retrofit, DataStore, WorkManager and Hilt, plus a Google Play release guide.',
  description: 'Learn Android with Kotlin and Jetpack Compose by building 10 real apps with full source code, expected output, tests and a Play Store release guide.',
  level: 'Beginner to advanced',
  topic: 'Mobile development',
  badge: 'New',
  tags: ['Android', 'Kotlin', 'Jetpack Compose', 'Room', 'Retrofit', 'Hilt', 'Mobile apps'],
  order: 42,
  published: true,
  minWords: 450,
  metaTitle: 'Android Development with Kotlin Course',
  keywords: ['android development course', 'kotlin tutorial', 'jetpack compose', 'android projects with source code', 'learn android app development'],
};

export const lessons = finish([...l1, ...l2, ...l3]);
