// Adds lesson animations to lessons that already exist, without touching their text.
//   cd server && node scripts/applyAnimations.js path/to/animations.json [--dry] [--course=<course-slug>]
// File shape:  { "<course-slug>": { "<lesson-slug or exact lesson title>": { title, nodes, steps }, ... }, ... }
// A course key that is not a slug is matched against course titles (must match exactly one course).
// Every animation is checked with the same rules as the admin editor; nothing is written if any is invalid.
import "dotenv/config";
import fs from "node:fs";
import { cleanAnimation } from "../utils/lessonAnimation.js";

const file = process.argv[2];
const dry = process.argv.includes('--dry');
if (!file) { console.error('Usage: node scripts/applyAnimations.js animations.json [--dry]'); process.exit(1); }
let input = JSON.parse(fs.readFileSync(file, 'utf8'));
// --course=<slug> puts every lesson in the file into that one course (use when the file's course key is a placeholder).
const only = (process.argv.find(a => a.startsWith('--course=')) || '').slice(9);
if (only) input = { [only]: Object.assign({}, ...Object.values(input)) };

const cleaned = [];
let invalid = 0;
for (const [course, lessons] of Object.entries(input)) {
  for (const [slug, raw] of Object.entries(lessons)) {
    try { cleaned.push([course, slug, cleanAnimation(raw)]); } catch (e) { invalid++; console.error(`${course}/${slug}: ${e.message}`); }
  }
}
if (invalid) { console.error(`\n${invalid} invalid animation(s). Nothing was written.`); process.exit(1); }

const { default: connectDB } = await import("../configs/db.js");
const { default: Course } = await import("../models/Course.js");
const { default: Lesson } = await import("../models/Lesson.js");
await connectDB();
let done = 0, missing = 0;
for (const [courseSlug, slug, animation] of cleaned) {
  let course = await Course.findOne({ slug: courseSlug }).select('_id');
  if (!course) {
    const found = await Course.find({ title: new RegExp(courseSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).select('_id title');
    if (found.length > 1) { console.error(`"${courseSlug}" matches ${found.length} courses: ${found.map(c => c.title).join(' | ')}. Use the exact slug.`); process.exit(1); }
    course = found[0];
  }
  let lesson = course && await Lesson.findOne({ course: course._id, slug }).select('_id');
  if (!lesson && course) lesson = await Lesson.findOne({ course: course._id, title: slug }).select('_id');
  if (!lesson) { missing++; console.error(`not found: ${courseSlug}/${slug}`); continue; }
  if (!dry) await Lesson.updateOne({ _id: lesson._id }, { $set: { animation, modifiedAt: new Date() } });
  done++;
}
console.log(`${dry ? 'Checked' : 'Updated'} ${done} lesson(s)${missing ? `, ${missing} not found` : ''}.`);
process.exit(0);
