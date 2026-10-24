// Prints every course with its lessons (slug, title, section, and whether it has an animation).
// Use it to see which lessons still need an animation:   cd server && node scripts/listLessons.js [course-slug]
import "dotenv/config";
const { default: connectDB } = await import("../configs/db.js");
const { default: Course } = await import("../models/Course.js");
const { default: Lesson } = await import("../models/Lesson.js");

await connectDB();
const only = process.argv[2];
const courses = await Course.find(only ? { slug: only } : {}).sort({ order: 1, createdAt: 1 });
for (const c of courses) {
  const lessons = await Lesson.find({ course: c._id }).sort({ order: 1 }).select('slug title section animation published');
  console.log(`\n## ${c.slug}  (${c.title})  ${lessons.length} lessons, ${lessons.filter((l) => l.animation).length} with animation`);
  for (const l of lessons) console.log(`${l.animation ? '[anim]' : '[none]'} ${l.published ? '' : '(draft) '}${l.slug} | ${l.section || '-'} | ${l.title}`);
}
process.exit(0);
