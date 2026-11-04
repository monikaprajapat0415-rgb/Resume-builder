import { lessons as l1 } from './part1.js';
import { lessons as l2 } from './part2.js';
import { lessons as l3 } from './part3.js';
import { lessons as l4 } from './part4.js';
import { lessons as l5 } from './part5.js';
import { lessons as l6 } from './part6.js';
import { lessons as l7 } from './part7.js';
import { lessons as l8 } from './part8.js';
import { lessons as l9 } from './part9.js';
import { finish } from '../kit.js';

export const course = {
  title: 'Android Development with Kotlin: 21 Real Projects',
  slug: 'android-development-kotlin-course',
  summary: 'Learn Android from Kotlin to Play Store: 21 complete apps with Compose, Room, Retrofit, Firebase, Hilt, Media3, CameraX, plus security, testing and interviews.',
  description: 'Learn Android with Kotlin and Jetpack Compose by building 21 real apps with full source code, expected output, tests and a Play Store release guide.',
  level: 'Beginner to advanced',
  topic: 'Mobile development',
  badge: 'New',
  tags: ['Android', 'Kotlin', 'Jetpack Compose', 'Room', 'Retrofit', 'Hilt', 'Mobile apps', 'Firebase', 'Media3'],
  order: 42,
  published: true,
  minWords: 450,
  metaTitle: 'Android Development with Kotlin Course',
  keywords: ['android development course', 'kotlin tutorial', 'jetpack compose', 'android projects with source code', 'learn android app development'],
};

export const lessons = finish([...l1, ...l2, ...l3, ...l4, ...l5, ...l6, ...l7, ...l9, ...l8]);
