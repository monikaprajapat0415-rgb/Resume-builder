import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';
import { lessons as p4 } from './part4.js';
export const course = {
  title: 'Advanced iOS Development: Concurrency, Architecture, Security and Release',
  slug: 'advanced-ios-development-course',
  summary: 'Free advanced iOS course in 14 lessons: Swift concurrency, ARC, Combine, UIKit, secure networking, SwiftData, StoreKit, modular architecture, CI/CD and interviews.',
  description: 'Free advanced iOS course: 14 lessons on Swift concurrency, ARC, UIKit, Keychain, SwiftData migrations, StoreKit 2, Swift packages, CI/CD and interviews.',
  level: 'Advanced',
  topic: 'Mobile development',
  badge: 'IOS',
  tags: ['ios', 'swift', 'swiftui', 'uikit', 'combine', 'swiftdata', 'storekit', 'ci/cd', 'architecture'],
  order: 41,
  published: true,
  minWords: 600,
  metaTitle: 'Advanced iOS Development Course',
  keywords: 'advanced ios development, swift concurrency, arc retain cycle, combine, uikit interop, keychain, swiftdata migration, storekit 2, fastlane, ios architecture, senior ios interview',
};
export const lessons = finish([...p1, ...p2, ...p3, ...p4]);
