import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';
import { lessons as p4 } from './part4.js';
import { lessons as p5 } from './part5.js';
export const course = {
  title: 'iOS App Development with Swift and SwiftUI: 13 Projects',
  slug: 'ios-development-swift-swiftui-course',
  summary: 'Learn iOS in 28 lessons: Swift, SwiftUI, async/await, SwiftData, MVVM and testing, then 12 more apps from a calculator to HealthKit, QR scanning and AI chat, plus a Swift for Android developers guide.',
  description: 'Free iOS course for beginners: 28 lessons on Swift, SwiftUI, SwiftData, networking and testing, with 13 projects, full source code and TestFlight release.',
  level: 'Beginner',
  topic: 'Mobile development',
  badge: 'IOS',
  tags: ['ios', 'swift', 'swiftui', 'xcode', 'swiftdata', 'mobile development', 'ios projects', 'swift for android developers'],
  order: 40,
  published: true,
  minWords: 600,
  metaTitle: 'iOS Development: Swift and SwiftUI Course',
  keywords: 'ios app projects with source code, swiftui projects, swift for android developers, ios development course, learn swift, swiftui tutorial, ios developer roadmap, swiftdata, xcode for beginners, testflight, mvvm swift',
};
// The publish and interview lesson (the last of part 3) stays last.
export const lessons = finish([...p1, ...p2, ...p3.slice(0, -1), ...p4, ...p5, p3[p3.length - 1]]);
