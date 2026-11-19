// Improves the blog post /blog/resume-vs-cv-difference (it was thin, US-centred and its title was cut off in search results).
//   cd server
//   node scripts/seo/updateResumeVsCv.js            (dry run: shows what would change)
//   node scripts/seo/updateResumeVsCv.js --apply    (writes, and saves a backup file next to this script)
//   node scripts/seo/updateResumeVsCv.js scripts/seo/backup-resume-vs-cv-<time>.json --revert
// It only ADDS sections, takeaway and FAQs and sets a short SEO title when none is set. Nothing already written is removed or reworded.
// If the article was edited in Admin since it was read (the expected headings are not all there), it changes nothing and says so.
import { P, H, L, words } from '../geo-articles/helpers.js';

const SLUG = 'resume-vs-cv-difference';
const NEW_TITLE = 'Resume vs CV: Differences and Which to Use'; // 41 characters, the site adds " | Prime Resume AI"

const GLANCE = [
  H('Resume vs CV at a glance'),
  P('If you only want the short version, this is how the two compare in most English-speaking job markets.'),
  L(
    'Length: a resume is usually one to two pages. A CV has no fixed limit, and academic CVs can run to many pages.',
    'Purpose: a resume is tailored to one job. A CV is a full record of your career or academic work.',
    'Content: a resume holds your most relevant experience, skills and education. A CV can also list publications, research, teaching, grants and conferences.',
    'Changes: you adjust a resume for each application. A CV mostly stays the same and grows as you add to it.',
    'Where it is used: "resume" is the usual word for most jobs in the US and Canada. "CV" is the word for academic, research and medical roles there, and the everyday job document in the UK, Ireland and many other countries.',
  ),
];
const REGIONS = [
  H('India and African countries'),
  P('In India, employers, recruiters and job portals often use "resume" and "CV" for the same document. Follow the word and the length in the job post. One page is common for freshers and one or two pages for most other candidates. If a government department or a company gives its own form, use that form exactly.'),
  P('In many African countries "CV" is the everyday word for the document you send for a job. Practice differs by country and sector, so read the employer\'s instructions and keep the document short and clear unless the role is academic or research.'),
];
const MISTAKES = (hasFormatGuide) => [
  H('Common mistakes to avoid'),
  L(
    'Sending a long academic CV for an ordinary job.',
    'Sending the same document to every employer without adjusting it.',
    'Adding a photo, date of birth or marital status when the job post does not ask for them.',
    'Giving old jobs as much space as your recent ones.',
  ),
  P('Ready to write yours? Pick one of our [free ATS-friendly resume templates](/templates), look at [filled-in examples](/examples), then run your draft through the [free ATS checker](/features/ats-checker).'),
  ...(hasFormatGuide ? [P('For habits by country, see [resume format in India, the UK, Canada and Africa](/blog/resume-format-india-uk-canada-africa).')] : []),
];
const TAKEAWAY = 'In India, employers often use "CV" and "resume" for the same document, so follow the word and length in the job post.';
const FAQS = [
  { q: 'Is a CV longer than a resume?', a: 'Usually yes in academic and research settings, where a CV keeps growing as you add publications and projects. For ordinary jobs, both are normally one to two pages.' },
  { q: 'Do I need a resume or a CV in India?', a: 'Employers in India often use both words for the same document. Use the word the job post uses, keep it to one or two pages (one for most freshers), and use the employer\'s own form if they give one.' },
  { q: 'Can I use the same document for every job?', a: 'It is better to adjust it. Move the most relevant experience and skills to the top for each role. A full academic CV is the exception, because it is meant to be complete.' },
];
const NEED = ['The core difference', 'Where each one is expected', 'How to tell which one a specific application wants'];

// Pure: works out the changes for one post. Returns { skip } or { set, before }.
export const buildUpdate = (post, { hasFormatGuide = false, now = new Date() } = {}) => {
  const content = (post.content || []).map((b) => (b.toObject ? b.toObject() : { ...b }));
  const heads = content.map((b) => (b.type === 'heading' ? b.text : null));
  if (heads.includes('Resume vs CV at a glance')) return { skip: 'already updated' };
  const idx = (t) => heads.indexOf(t);
  const missing = NEED.filter((t) => idx(t) < 0);
  if (missing.length) return { skip: `the article was edited (missing heading: ${missing.join('; ')}). Nothing changed.` };
  const a = idx(NEED[1]), b = idx(NEED[2]);
  if (!(idx(NEED[0]) < a && a < b)) return { skip: 'the headings are in a different order than expected. Nothing changed.' };
  const out = [...content.slice(0, a), ...GLANCE, ...content.slice(a, b), ...REGIONS, ...content.slice(b), ...MISTAKES(hasFormatGuide)];
  const have = new Set((post.faqs || []).map((f) => f.q.toLowerCase()));
  const faqs = [...(post.faqs || []).map((f) => ({ q: f.q, a: f.a })), ...FAQS.filter((f) => !have.has(f.q.toLowerCase()))];
  const takeaways = (post.takeaways || []).includes(TAKEAWAY) ? post.takeaways : [...(post.takeaways || []), TAKEAWAY];
  const set = { content: out, faqs, takeaways, modifiedAt: now };
  if (!post.metaTitle) set.metaTitle = NEW_TITLE;
  const before = { content, faqs: (post.faqs || []).map((f) => ({ q: f.q, a: f.a })), takeaways: post.takeaways || [], metaTitle: post.metaTitle || '', modifiedAt: post.modifiedAt || null };
  return { set, before, wordsBefore: words(content), wordsAfter: words(out) };
};

if (process.argv[1] && process.argv[1].endsWith('updateResumeVsCv.js')) {
  await import('dotenv/config');
  const fs = await import('node:fs'); const path = await import('node:path');
  const has = (f) => process.argv.includes(f);
  const { default: connectDB } = await import('../../configs/db.js');
  const { default: Blog } = await import('../../models/Blog.js');
  await connectDB();
  if (has('--revert')) {
    const file = process.argv[2]; const bk = JSON.parse(fs.readFileSync(file, 'utf8'));
    await Blog.updateOne({ _id: bk.id }, { $set: bk.before });
    console.log('Restored the earlier version.'); process.exit(0);
  }
  const post = await Blog.findOne({ slug: SLUG });
  if (!post) { console.error(`No post with slug ${SLUG}.`); process.exit(1); }
  const guide = await Blog.exists({ slug: 'resume-format-india-uk-canada-africa', published: true });
  const r = buildUpdate(post, { hasFormatGuide: Boolean(guide) });
  if (r.skip) { console.log(`Skipped: ${r.skip}`); process.exit(0); }
  console.log(`Words: ${r.wordsBefore} -> ${r.wordsAfter}. FAQs: ${post.faqs.length} -> ${r.set.faqs.length}. ${r.set.metaTitle ? `SEO title set to "${r.set.metaTitle}".` : 'SEO title already set, kept.'} ${guide ? 'Links to the country guide.' : 'Country guide is not published, so it is not linked.'}`);
  if (!has('--apply')) { console.log('Dry run. Add --apply to write.'); process.exit(0); }
  const out = path.join(path.dirname(new URL(import.meta.url).pathname), `backup-resume-vs-cv-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)}.json`);
  fs.writeFileSync(out, JSON.stringify({ id: String(post._id), before: r.before }, null, 2));
  await Blog.updateOne({ _id: post._id }, { $set: r.set });
  console.log(`Updated. Backup: ${out}`); process.exit(0);
}
