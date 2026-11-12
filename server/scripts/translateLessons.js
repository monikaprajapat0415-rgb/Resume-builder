// Drafts lesson translations with your AI providers (the same keys the site already uses).
//   cd server && node scripts/translateLessons.js <course-slug|all> <es|fr|pt|ar|all> [--limit N] [--force] [--dry]
// Drafts are saved HIDDEN (status "machine"). Review and publish each one in Admin > Learn > edit lesson > Translations.
// Lessons that already have a translation for that language are skipped unless --force, so edits made in Admin are safe.
// Code blocks, commands, quiz answers and the animation are never sent to the AI and cannot change.
import "dotenv/config";
const [courseArg, langArg] = process.argv.slice(2);
const flag = (n) => process.argv.includes(n);
const limit = Number(process.argv[process.argv.indexOf('--limit') + 1]) || Infinity;
if (!courseArg || !langArg) { console.error('Usage: node scripts/translateLessons.js <course-slug|all> <es|fr|pt|ar|all> [--limit N] [--force] [--dry]'); process.exit(1); }

const { LESSON_LANGS, applyUnits, draftWithAi, hashOf, unitsOf } = await import("../utils/lessonTranslate.js");
const { default: connectDB } = await import("../configs/db.js");
const { default: Course } = await import("../models/Course.js");
const { default: Lesson } = await import("../models/Lesson.js");
const { defaultRouter } = await import("../utils/aiRouter.js");
await connectDB();

const langs = langArg === 'all' ? Object.keys(LESSON_LANGS) : [langArg];
if (langs.some((l) => !LESSON_LANGS[l])) { console.error(`Unknown language. Use one of: ${Object.keys(LESSON_LANGS).join(', ')}, all`); process.exit(1); }
const courses = courseArg === 'all' ? await Course.find({}) : await Course.find({ slug: courseArg });
if (!courses.length) { console.error('No such course.'); process.exit(1); }

let made = 0, skipped = 0, failed = 0, lines = 0, left = 0;
outer: for (const c of courses) {
  const lessons = await Lesson.find({ course: c._id }).sort({ order: 1 });
  for (const l of lessons) {
    for (const lang of langs) {
      if (made >= limit) break outer;
      if (l.translations?.[lang] && !flag('--force')) { skipped++; continue; }
      if (flag('--dry')) { console.log(`would translate ${c.slug}/${l.slug} -> ${lang} (${unitsOf(l).length} lines)`); made++; continue; }
      try {
        const r = await draftWithAi(l, lang, (s, u, o) => defaultRouter().call(s, u, o));
        const { value } = applyUnits(l, r.map);
        l.set(`translations.${lang}`, { ...value, published: false, status: 'machine', sourceHash: hashOf(l), at: new Date() });
        l.markModified('translations');
        await l.save({ timestamps: false });
        made++; lines += r.translated; left += r.skipped.length;
        console.log(`ok   ${c.slug}/${l.slug} -> ${lang}: ${r.translated} lines, ${r.skipped.length} left in English`);
      } catch (e) { failed++; console.error(`FAIL ${c.slug}/${l.slug} -> ${lang}: ${e.message.slice(0, 160)}`); }
    }
  }
}
console.log(`\nDone. ${made} draft(s), ${skipped} skipped, ${failed} failed, ${lines} lines translated, ${left} left in English. All drafts are hidden until published in Admin.`);
process.exit(0);
