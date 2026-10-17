// Adds (or updates) the three Generative AI courses in the Learn section:
//   1. Generative AI & LLM Fundamentals
//   2. Claude API & Tool Use with Node.js
//   3. RAG, AI Agents & MCP
// Safe to re-run: courses are matched by slug and their lessons are replaced (reader comments are kept by lesson slug).
//
// Usage (from server/):  node scripts/seedAiCourses.js           -> create/update and publish
//                        node scripts/seedAiCourses.js --draft   -> create/update as drafts (not public)
//                        node scripts/seedAiCourses.js --json    -> only write JSON files for Admin > Learn > Import
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { course as c1, lessons as l1 } from "./learn-ai/course1.js";
import { course as c2, lessons as l2 } from "./learn-ai/course2.js";
import { course as c3, lessons as l3 } from "./learn-ai/course3.js";

const sets = [[c1, l1], [c2, l2], [c3, l3]];
const draft = process.argv.includes('--draft');
const jsonOnly = process.argv.includes('--json');
const here = path.dirname(fileURLToPath(import.meta.url));

const build = ([course, lessons]) => ({
  course: { ...course, published: !draft },
  lessons: lessons.map((l) => ({ ...l, published: !draft })),
});

if (jsonOnly) {
  const dir = path.join(here, 'learn-ai', 'json');
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
  if (course) {
    course.title = c.title; Object.assign(course, cleanCourseFields(c)); course.modifiedAt = now; await course.save();
    const old = await Lesson.find({ course: course._id }).select('slug');
    oldSlugOf = Object.fromEntries(old.map((l) => [String(l._id), l.slug]));
    await Lesson.deleteMany({ course: course._id });
  } else {
    course = await Course.create({ title: c.title, slug: c.slug, modifiedAt: now, ...cleanCourseFields(c) });
  }
  const created = await Lesson.insertMany(lessons.map((l, i) => ({
    title: l.title, slug: l.slug, order: i, content: cleanBlogBlocks(l.content), ...cleanLessonFields(l), course: course._id, modifiedAt: now,
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
