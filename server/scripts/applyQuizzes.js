// Adds lesson quizzes to lessons that already exist, without touching their text.
//   cd server && node scripts/applyQuizzes.js scripts/learn-courses/json/quizzes.json [--dry]
// File shape:  { "<course-slug>": { "<lesson-slug or exact lesson title>": [ { q, options: [...], answer: 0, explain }, ... ], ... }, ... }
// Every quiz is checked with the same rules as the admin editor; nothing is written if any is invalid.
import "dotenv/config";
import fs from "node:fs";
import { cleanQuiz } from "../utils/lessonQuiz.js";

const file = process.argv[2];
const dry = process.argv.includes('--dry');
if (!file) { console.error('Usage: node scripts/applyQuizzes.js quizzes.json [--dry]'); process.exit(1); }
const input = JSON.parse(fs.readFileSync(file, 'utf8'));

const cleaned = [];
let invalid = 0;
for (const [course, lessons] of Object.entries(input)) {
  for (const [slug, raw] of Object.entries(lessons)) {
    try { cleaned.push([course, slug, cleanQuiz(raw)]); } catch (e) { invalid++; console.error(`${course}/${slug}: ${e.message}`); }
  }
}
if (invalid) { console.error(`\n${invalid} invalid quiz(zes). Nothing was written.`); process.exit(1); }

const { default: connectDB } = await import("../configs/db.js");
const { default: Course } = await import("../models/Course.js");
const { default: Lesson } = await import("../models/Lesson.js");
await connectDB();
let done = 0, missing = 0;
for (const [courseSlug, slug, quiz] of cleaned) {
  const course = await Course.findOne({ slug: courseSlug }).select('_id');
  let lesson = course && await Lesson.findOne({ course: course._id, slug }).select('_id');
  if (!lesson && course) lesson = await Lesson.findOne({ course: course._id, title: slug }).select('_id');
  if (!lesson) { missing++; console.error(`not found: ${courseSlug}/${slug}`); continue; }
  if (!dry) await Lesson.updateOne({ _id: lesson._id }, { $set: { quiz: quiz ?? null, modifiedAt: new Date() } });
  done++;
}
console.log(`${dry ? 'Checked' : 'Updated'} ${done} lesson(s)${missing ? `, ${missing} not found` : ''}.`);
process.exit(0);
