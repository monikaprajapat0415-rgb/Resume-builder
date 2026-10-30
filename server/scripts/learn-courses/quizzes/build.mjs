// Combines every course quiz file into json/quizzes.json and checks it against the lesson files.
//   cd server && node scripts/learn-courses/quizzes/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanQuiz } from '../../../utils/lessonQuiz.js';

// Options are written with the right answer anywhere; shuffle them with a fixed seed so the right answer
// is not always first and the output is the same every time.
const seeded = (str) => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; }; };
const shuffleQuiz = (quiz, seed) => quiz.map((q, i) => {
  const rnd = seeded(`${seed}#${i}`);
  const idx = q.options.map((_, k) => k);
  for (let k = idx.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [idx[k], idx[j]] = [idx[j], idx[k]]; }
  return { ...q, options: idx.map((k) => q.options[k]), answer: idx.indexOf(q.answer) };
});

const here = path.dirname(fileURLToPath(import.meta.url));
const jsonDir = path.join(here, '..', 'json');
const files = fs.readdirSync(here).filter((f) => f.endsWith('.mjs') && f !== 'build.mjs');
const out = {};
let questions = 0, problems = 0;
const lessonFiles = fs.readdirSync(jsonDir).filter((f) => f.endsWith('.json') && f !== 'quizzes.json');
const lessonsByCourse = {};
for (const f of lessonFiles) {
  const j = JSON.parse(fs.readFileSync(path.join(jsonDir, f), 'utf8'));
  const slug = j.course?.slug || j.slug || f.replace(/\.json$/, '');
  lessonsByCourse[slug] = new Set((j.lessons || []).map((l) => l.slug));
  lessonsByCourse[f.replace(/\.json$/, '')] = lessonsByCourse[slug];
}
for (const f of files) {
  const { course, quizzes } = await import(path.join(here, f));
  const known = lessonsByCourse[course];
  if (!known) { console.error(`${f}: no lesson file found for course ${course}`); problems++; continue; }
  out[course] = {};
  for (const [slug, quiz] of Object.entries(quizzes)) {
    if (!known.has(slug)) { console.error(`${course}/${slug}: no such lesson`); problems++; continue; }
    try { out[course][slug] = cleanQuiz(shuffleQuiz(quiz, `${course}/${slug}`)); questions += quiz.length; } catch (e) { console.error(`${course}/${slug}: ${e.message}`); problems++; }
  }
  const missing = [...known].filter((s) => !(s in quizzes));
  console.log(`${course}: ${Object.keys(quizzes).length}/${known.size} lessons with a quiz${missing.length ? ` (missing: ${missing.join(', ')})` : ''}`);
}
if (problems) { console.error(`\n${problems} problem(s). Nothing written.`); process.exit(1); }
fs.writeFileSync(path.join(jsonDir, 'quizzes.json'), JSON.stringify(out, null, 1));
const dist = {};
for (const c of Object.values(out)) for (const q of Object.values(c)) for (const x of q) dist[x.answer] = (dist[x.answer] || 0) + 1;
console.log('Position of the right answer:', JSON.stringify(dist));
console.log(`Wrote json/quizzes.json: ${questions} questions.`);
