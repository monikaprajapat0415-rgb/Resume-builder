// Updates SEO titles, descriptions and FAQs on lessons and courses that already exist, without touching their text.
//   cd server
//   node scripts/seo/applySeoText.js scripts/seo/seo-updates-nov2026.json --check    (rules only, no database)
//   node scripts/seo/applySeoText.js scripts/seo/seo-updates-nov2026.json            (dry run: shows before and after)
//   node scripts/seo/applySeoText.js scripts/seo/seo-updates-nov2026.json --apply    (writes, and saves a backup file next to the JSON)
//   node scripts/seo/applySeoText.js scripts/seo/backup-<time>.json --revert         (puts the old values back)
// An entry with "overwrite": true replaces what is there; otherwise a field is filled only when it is empty, so edits made in Admin are kept.
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

const file = process.argv[2];
const has = (f) => process.argv.includes(f);
if (!file) { console.error('Usage: node scripts/seo/applySeoText.js file.json [--check|--apply|--revert]'); process.exit(1); }
const input = JSON.parse(fs.readFileSync(file, 'utf8'));

// ---- rules (same as CLAUDE.md: lesson metaTitle <= 43, description 60-160; FAQ answers are plain text) ----
export const problems = (entry, where, kind) => {
  const out = [];
  const t = entry.metaTitle, d = entry.description;
  if (t !== undefined && (t.length < 8 || t.length > 43)) out.push(`${where}: metaTitle is ${t.length} characters (8-43)`);
  if (d !== undefined && (d.length < 60 || d.length > 160)) out.push(`${where}: description is ${d.length} characters (60-160)`);
  if (/["]/.test(t || '') ) out.push(`${where}: metaTitle has a straight double quote`);
  for (const f of entry.addFaqs || []) if (!f.q || !f.a || f.q.length > 200 || f.a.length > 900) out.push(`${where}: FAQ needs a question (200 or fewer) and an answer (900 or fewer)`);
  if (kind === 'course' && entry.addFaqs) out.push(`${where}: courses have no FAQs here`);
  return out;
};

const list = [];
for (const [c, ls] of Object.entries(input.lessons || {})) for (const [l, e] of Object.entries(ls)) list.push({ kind: 'lesson', course: c, slug: l, entry: e, where: `${c}/${l}` });
for (const [c, e] of Object.entries(input.courses || {})) list.push({ kind: 'course', course: c, entry: e, where: c });

if (has('--check')) {
  const bad = list.flatMap((x) => problems(x.entry, x.where, x.kind));
  bad.forEach((b) => console.error(b));
  console.log(bad.length ? `${bad.length} problem(s).` : `${list.length} entries pass the rules.`);
  process.exit(bad.length ? 1 : 0);
}

const bad = list.flatMap((x) => problems(x.entry, x.where, x.kind));
if (bad.length && !has('--revert')) { bad.forEach((b) => console.error(b)); console.error('Nothing was written.'); process.exit(1); }

const { default: connectDB } = await import("../../configs/db.js");
const { default: Course } = await import("../../models/Course.js");
const { default: Lesson } = await import("../../models/Lesson.js");
await connectDB();

if (has('--revert')) {
  let n = 0;
  for (const r of input.changes || []) {
    const Model = r.kind === 'course' ? Course : Lesson;
    await Model.updateOne({ _id: r.id }, { $set: r.before });
    n++;
  }
  console.log(`Restored ${n} item(s).`);
  process.exit(0);
}

const changes = [];
let missing = 0;
for (const x of list) {
  const course = await Course.findOne({ slug: x.course });
  if (!course) { missing++; console.error(`course not found: ${x.course}`); continue; }
  const doc = x.kind === 'course' ? course : await Lesson.findOne({ course: course._id, slug: x.slug });
  if (!doc) { missing++; console.error(`lesson not found: ${x.where}`); continue; }
  const overwrite = Boolean(x.entry.overwrite);
  const set = {}, before = {};
  for (const f of ['metaTitle', 'description']) {
    if (x.entry[f] === undefined) continue;
    const cur = doc[f] || '';
    if (cur === x.entry[f]) continue;
    if (cur && !overwrite) { console.log(`keep   ${x.where} ${f} (already set: "${cur}")`); continue; }
    set[f] = x.entry[f]; before[f] = cur;
  }
  if (x.kind === 'lesson' && x.entry.addFaqs?.length) {
    const have = new Set((doc.faqs || []).map((f) => f.q.toLowerCase()));
    const add = x.entry.addFaqs.filter((f) => !have.has(f.q.toLowerCase()));
    if (add.length) { set.faqs = [...(doc.faqs || []).map((f) => ({ q: f.q, a: f.a })), ...add]; before.faqs = (doc.faqs || []).map((f) => ({ q: f.q, a: f.a })); }
  }
  if (!Object.keys(set).length) continue;
  for (const k of Object.keys(set)) console.log(`${has('--apply') ? 'set' : 'would set'} ${x.where} ${k}: ${k === 'faqs' ? `${before[k].length} -> ${set[k].length} FAQs` : `"${before[k]}" -> "${set[k]}"`}`);
  changes.push({ kind: x.kind, id: String(doc._id), where: x.where, before, set });
}

if (has('--apply') && changes.length) {
  const out = path.join(path.dirname(file), `backup-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)}.json`);
  fs.writeFileSync(out, JSON.stringify({ note: 'Old values. Restore with --revert.', changes }, null, 2));
  for (const c of changes) {
    const Model = c.kind === 'course' ? Course : Lesson;
    await Model.updateOne({ _id: c.id }, { $set: { ...c.set, modifiedAt: new Date() } });
  }
  console.log(`\nUpdated ${changes.length} item(s). Backup: ${out}`);
} else {
  console.log(`\n${changes.length} item(s) would change${missing ? `, ${missing} not found` : ''}. Add --apply to write.`);
}
process.exit(0);
