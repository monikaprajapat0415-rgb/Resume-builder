// Adds (or updates) the React.js Full Course (30 lessons, each with an animation).
// Safe to re-run: courses are matched by slug and their lessons are replaced (reader comments are kept by lesson slug).
//
// Usage (from server/):  node scripts/seedReactCourse.js           -> create/update and publish
//                        node scripts/seedReactCourse.js --draft   -> create/update as drafts (not public)
//                        node scripts/seedReactCourse.js --json    -> only write JSON files for Admin > Learn > Import
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { course as c1, lessons as l1 } from "./learn-react/course.js";
import { animations } from "./learn-react/animations.js";

const sets = [[c1, l1]];
const draft = process.argv.includes('--draft');
const jsonOnly = process.argv.includes('--json');
const here = path.dirname(fileURLToPath(import.meta.url));

const build = ([course, lessons]) => ({
  course: { ...course, published: !draft },
  lessons: lessons.map((l) => ({ ...l, ...(animations[l.slug] ? { animation: animations[l.slug] } : {}), published: !draft })),
});

if (jsonOnly) {
  const dir = path.join(here, 'learn-react', 'json');
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
const { builtinDownload } = await import("../utils/learnFiles.js");
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
    // keep zips an admin uploaded; built-in ones are re-pointed below
    oldDownloads = Object.fromEntries(old.filter((l) => l.download?.file && !l.download.builtin).map((l) => [l.slug, l.download.toObject()]));
    await Lesson.deleteMany({ course: course._id });
  } else {
    course = await Course.create({ title: c.title, slug: c.slug, modifiedAt: now, ...cleanCourseFields(c) });
  }
  const created = await Lesson.insertMany(lessons.map((l, i) => ({
    title: l.title, slug: l.slug, order: i, content: cleanBlogBlocks(l.content), ...cleanLessonFields(l),
    ...(() => { const d = oldDownloads[l.slug] || (l.lab ? builtinDownload(l.lab, l.labStep) : undefined); return d ? { download: d } : {}; })(), course: course._id, modifiedAt: now,
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
