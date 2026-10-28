// Shared helpers for the extra courses in scripts/learn-courses/<key>/index.js.
// A course folder exports `course` (meta) and `lessons` (array built with `les()`); parts are plain modules of lessons.
import { P, H, L, O, N, C } from '../learn-ai/helpers.js';
export { P, H, L, O, N, C };
export const task = (...steps) => [H('Your task'), O(...steps)];
export const check = (...items) => [H('How to check it worked'), L(...items)];
export const faq = (q, a) => ({ q, a });

// Animation helpers (format: server/utils/lessonAnimation.js: grid col 0-3, row 0-2, labels <= 19 chars).
export const n = (id, label, sub, col, row, kind) => ({ id, label, sub, col, row, kind });
export const A = (title, nodes, steps) => ({ title, nodes, steps });

// section, slug, title, metaTitle (<= 43 chars), description (<= 160), content blocks, animation, faqs
export const les = (section, slug, title, metaTitle, description, content, animation, faqs = []) =>
  ({ section, slug, title, metaTitle, description, content, animation, faqs, readTime: '', published: true });

export const proseWords = (l) => l.content.filter((b) => b.type !== 'code').map((b) => (b.text || '') + ' ' + (b.items || []).join(' ')).join(' ').split(/\s+/).filter(Boolean).length;
const minutes = (l) => {
  let code = 0;
  for (const b of l.content) if (b.type === 'code') code += b.text.split('\n').length;
  return Math.max(4, Math.round(proseWords(l) / 200 + code / 25));
};
export const finish = (lessons) => lessons.map((l) => ({ ...l, readTime: `${minutes(l)} min read` }));
