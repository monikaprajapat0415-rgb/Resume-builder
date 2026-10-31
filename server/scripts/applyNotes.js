// Adds lesson notes to lessons that already exist, without touching their text.
//   cd server && node scripts/applyNotes.js scripts/learn-courses/json/notes.json [--dry]
// File shape:  { "<course-slug>": { "<lesson-slug or exact lesson title>": [ "line", "line", ... ], ... }, ... }
// Every list of notes is checked with the same rules as the admin editor; nothing is written if any is invalid.
import "dotenv/config";
import fs from "node:fs";
import { cleanNotes } from "../utils/lessonNotes.js";

const file = process.argv[2];
const dry = process.argv.includes('--dry');
const force = process.argv.includes('--force'); // without it, lessons that already have notes (maybe edited in Admin) are left alone
if (!file) { console.error('Usage: node scripts/applyNotes.js notes.json [--dry]'); process.exit(1); }
const input = JSON.parse(fs.readFileSync(file, 'utf8'));

const cleaned = [];
let invalid = 0;
for (const [course, lessons] of Object.entries(input)) {
  for (const [slug, raw] of Object.entries(lessons)) {
    try { cleaned.push([course, slug, cleanNotes(raw)]); } catch (e) { invalid++; console.error(`${course}/${slug}: ${e.message}`); }
  }
}
if (invalid) { console.error(`\n${invalid} invalid notes. Nothing was written.`); process.exit(1); }

const { default: connectDB } = await import("../configs/db.js");
const { default: Course } = await import("../models/Course.js");
const { default: Lesson } = await import("../models/Lesson.js");
await connectDB();
let done = 0, missing = 0, skipped = 0;
for (const [courseSlug, slug, notes] of cleaned) {
  const course = await Course.findOne({ slug: courseSlug }).select('_id notes');
  let lesson = course && await Lesson.findOne({ course: course._id, slug }).select('_id notes');
  if (!lesson && course) lesson = await Lesson.findOne({ course: course._id, title: slug }).select('_id notes');
  if (!lesson) { missing++; console.error(`not found: ${courseSlug}/${slug}`); continue; }
  if (!force && lesson.notes && (Array.isArray(lesson.notes) ? lesson.notes.length : true)) { skipped++; continue; }
  if (!dry) await Lesson.updateOne({ _id: lesson._id }, { $set: { notes: notes ?? null, modifiedAt: new Date() } });
  done++;
}
console.log(`${dry ? 'Checked' : 'Updated'} ${done} lesson(s)${skipped ? `, ${skipped} skipped (already have notes; use --force to overwrite)` : ''}${missing ? `, ${missing} not found` : ''}.`);
process.exit(0);
