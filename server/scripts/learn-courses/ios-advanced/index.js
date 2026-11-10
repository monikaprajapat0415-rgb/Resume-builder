import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';
import { lessons as p4 } from './part4.js';
import { lessons as p5 } from './part5.js';
import { lessons as p6 } from './part6.js';
export const course = {
  title: 'Advanced iOS Development: Concurrency, Architecture, Security and Release',
  slug: 'advanced-ios-development-course',
  summary: 'Advanced iOS in 20 lessons: Swift concurrency, ARC, Combine, UIKit, secure networking, SwiftData, Core Data, accessibility, localization, widgets, App Store review, CI/CD and interview questions.',
  description: 'Free advanced iOS course: 20 lessons on concurrency, ARC, accessibility, localization, widgets, App Intents, privacy, Core Data, CI/CD and interview questions.',
  level: 'Advanced',
  topic: 'Mobile development',
  badge: 'IOS',
  tags: ['ios', 'swift', 'swiftui', 'uikit', 'combine', 'swiftdata', 'storekit', 'ci/cd', 'architecture', 'accessibility', 'localization', 'widgets', 'core data'],
  order: 41,
  published: true,
  minWords: 600,
  metaTitle: 'Advanced iOS Development Course',
  keywords: 'ios interview questions and answers, ios accessibility, ios localization, widgetkit, app intents, core data, advanced ios development, swift concurrency, arc retain cycle, combine, uikit interop, keychain, swiftdata migration, storekit 2, fastlane, ios architecture, senior ios interview',
};
// New topic lessons come before the architecture and release lessons; the interview bank stays last.
export const lessons = finish([...p1, ...p2, ...p3, ...p5, ...p4, ...p6]);
