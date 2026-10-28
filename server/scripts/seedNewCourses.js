// Adds or updates the extra courses in scripts/learn-courses/<key>/index.js. Safe to re-run: a course is matched by slug and its
// lessons are replaced (reader feedback is kept by lesson slug).
// Usage (from server/):  node scripts/seedNewCourses.js <key|all> [--draft] [--json]
//   keys: see `ls scripts/learn-courses`.   --draft saves unpublished.   --json writes learn-courses/json/<slug>.json for Admin > Learn > Import.
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, 'learn-courses');
const arg = process.argv[2];
const keys = !arg || arg.startsWith('--') ? [] : arg === 'all'
  ? fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory() && fs.existsSync(path.join(root, d.name, 'index.js'))).map((d) => d.name)
  : [arg];
if (!keys.length) { console.log('Usage: node scripts/seedNewCourses.js <key|all> [--draft] [--json]'); process.exit(1); }
const draft = process.argv.includes('--draft');
const jsonOnly = process.argv.includes('--json');

const sets = [];
for (const k of keys) {
  const m = await import(pathToFileURL(path.join(root, k, 'index.js')).href);
  sets.push([m.course, m.lessons]);
}
const build = ([course, lessons]) => ({
  course: { ...course, published: !draft },
  lessons: lessons.map((l) => ({ ...l, ...(l.animation ? { animation: l.animation } : {}), published: !draft })),
});

if (jsonOnly) {
  const dir = path.join(root, 'json');
  fs.mkdirSync(dir, { recursive: true });
  for (const s of sets) {
    const body = build(s);
    fs.writeFileSync(path.join(dir, `${body.course.slug}.json`), JSON.stringify({ ...body, replace: true }, null, 2));
    console.log('wrote', `${body.course.slug}.json`, `(${body.lessons.length} lessons)`);
  }
  process.exit(0);
}

const { default: connectDB } = await import("../configs/db.js");
const { default: Course } = await import("../models/Course.js");
const { default: Lesson } = await import("../models/Lesson.js");
const { default: LessonFeedback } = await import("../models/LessonFeedback.js");
const { cleanBlogBlocks } = await import("../utils/blogSeo.js");
const { cleanCourseFields, cleanLessonFields } = await import("../utils/learnSeo.js");

await connectDB();
for (const s of sets) {
  const { course: c, lessons } = build(s);
  const now = new Date();
  let course = await Course.findOne({ slug: c.slug });
  let oldSlugOf = null;
  let oldDownloads = {};
  if (course) {
    course.title = c.title; Object.assign(course, cleanCourseFields(c)); course.modifiedAt = now; await course.save();
    const old = await Lesson.find({ course: course._id }).select('slug download');
    oldSlugOf = Object.fromEntries(old.map((l) => [String(l._id), l.slug]));
    oldDownloads = Object.fromEntries(old.filter((l) => l.download?.file && !l.download.builtin).map((l) => [l.slug, l.download.toObject()]));
    await Lesson.deleteMany({ course: course._id });
  } else {
    course = await Course.create({ title: c.title, slug: c.slug, modifiedAt: now, ...cleanCourseFields(c) });
  }
  const created = await Lesson.insertMany(lessons.map((l, i) => ({
    title: l.title, slug: l.slug, order: i, content: cleanBlogBlocks(l.content), ...cleanLessonFields(l),
    ...(oldDownloads[l.slug] ? { download: oldDownloads[l.slug] } : {}), course: course._id, modifiedAt: now,
  })));
  if (oldSlugOf) {
    const newIdOf = Object.fromEntries(created.map((l) => [l.slug, l._id]));
    for (const [oldId, slug] of Object.entries(oldSlugOf)) {
      if (newIdOf[slug]) await LessonFeedback.updateMany({ lesson: oldId }, { lesson: newIdOf[slug] });
      else await LessonFeedback.deleteMany({ lesson: oldId });
    }
  }
  console.log(`${course.slug}: ${created.length} lessons ${draft ? '(draft)' : '(published)'}`);
}
process.exit(0);
