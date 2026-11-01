import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';
export const course = {
  title: 'iOS App Development with Swift and SwiftUI: Beginner to Job-Ready Projects',
  slug: 'ios-development-swift-swiftui-course',
  summary: 'Learn iOS development in 15 lessons: Swift, SwiftUI, state, lists and navigation, async/await, REST APIs, SwiftData, MVVM, testing, TestFlight and the App Store, with one Expense Tracker project.',
  description: 'Free iOS development course for beginners. 15 lessons on Swift, SwiftUI, Codable and URLSession, SwiftData, MVVM, testing, TestFlight and App Store release.',
  level: 'Beginner',
  topic: 'Mobile development',
  badge: 'IOS',
  tags: ['ios', 'swift', 'swiftui', 'xcode', 'swiftdata', 'mobile development'],
  order: 40,
  published: true,
  minWords: 600,
  metaTitle: 'iOS Development: Swift and SwiftUI Course',
  keywords: 'ios development course, learn swift, swiftui tutorial, ios developer roadmap, swiftdata, xcode for beginners, testflight, mvvm swift',
};
export const lessons = finish([...p1, ...p2, ...p3]);
