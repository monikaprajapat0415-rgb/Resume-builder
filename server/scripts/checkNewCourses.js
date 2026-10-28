// Offline check of the extra courses (no database): word counts, meta lengths, slugs, blocks, animations.
// Usage (from server/):  node scripts/checkNewCourses.js [key]   (minimum prose words: course.minWords, default 1000)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { proseWords } from "./learn-courses/kit.js";
import { cleanAnimation } from "../utils/lessonAnimation.js";
import { cleanBlogBlocks } from "../utils/blogSeo.js";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'learn-courses');
const keys = process.argv[2] ? [process.argv[2]] : fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory() && fs.existsSync(path.join(root, d.name, 'index.js'))).map((d) => d.name);
let bad = 0;
for (const k of keys) {
  const { course, lessons } = await import(pathToFileURL(path.join(root, k, 'index.js')).href);
  const min = course.minWords || 1000;
  const err = (m) => { bad++; console.log('  ✗', m); };
  console.log(`${k}: ${lessons.length} lessons`);
  if (!course.metaTitle || course.metaTitle.length > 43) err(`course metaTitle length ${course.metaTitle?.length}`);
  if (course.description.length > 160) err(`course description ${course.description.length}`);
  if (course.summary.length > 200) err('summary > 200');
  const slugs = new Set(); let total = 0;
  for (const l of lessons) {
    const w = proseWords(l); total += w;
    if (slugs.has(l.slug)) err(`duplicate slug ${l.slug}`); slugs.add(l.slug);
    if (w < min) err(`${l.slug}: ${w} words (< ${min})`);
    if (!l.metaTitle || l.metaTitle.length > 43) err(`${l.slug}: metaTitle ${l.metaTitle?.length}`);
    if (!l.description || l.description.length > 160 || l.description.length < 60) err(`${l.slug}: description ${l.description?.length}`);
    if (cleanBlogBlocks(l.content).length !== l.content.length) err(`${l.slug}: blocks changed by cleaner`);
    try {
      const an = cleanAnimation(l.animation);
      if (!an) err(`${l.slug}: no animation`);
      else {
        const pos = Object.fromEntries(an.nodes.map((x) => [x.id, x]));
        for (const st of an.steps) for (const f of st.flow || []) {
          const a = f.from, b = f.to; const A = pos[a], B = pos[b];
          if (A && B && (Math.abs(A.col - B.col) > 1 || Math.abs(A.row - B.row) > 1)) err(`${l.slug}: flow ${a}>${b} is not between neighbouring cells`);
        }
      }
    } catch (e) { err(`${l.slug}: ${e.message}`); }
    if (!l.content.some((b) => b.type === 'heading' && b.text === 'Your task')) err(`${l.slug}: no task`);
    for (const b of l.content) if (b.type === 'paragraph' && /\b(guarantee[sd]?|100% (job|placement))\b/i.test(b.text.replace(/not a guarantee/gi, ''))) err(`${l.slug}: guarantee wording`);
  }
  console.log(`  ${total} prose words, avg ${Math.round(total / lessons.length)}`);
}
console.log(bad ? `${bad} problem(s)` : 'all good');
process.exit(bad ? 1 : 0);
