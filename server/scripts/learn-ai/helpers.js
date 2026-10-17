// Small helpers for writing course content as data.
export const P = (text) => ({ type: 'paragraph', text });
export const H = (text) => ({ type: 'heading', text });
export const L = (...items) => ({ type: 'list', items });
export const O = (...items) => ({ type: 'olist', items });
export const N = (text) => ({ type: 'note', text });
export const C = (lang, text) => ({ type: 'code', lang, text });
export const lesson = (section, slug, title, description, readTime, content, faqs = [], keywords = '') =>
  ({ section, slug, title, description, readTime, content, faqs, keywords, published: true });

// ---- lab helpers: embed real files from the downloadable Angular lab into a lesson ----
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.join(here, '..', '..', 'learn-labs');

// Show a file exactly as it is inside the zip, so the lesson and the download never disagree.
export const F = (lab, rel) => {
  const file = path.join(labRoot, lab, rel);
  const ext = path.extname(file).slice(1);
  const lang = { js: 'javascript', ts: 'typescript', json: 'json', txt: 'text' }[ext] || ext;
  return C(lang, fs.readFileSync(file, 'utf8').trimEnd());
};

// Link to a solution zip served by GET /api/learn/downloads/:lab/:file
export const dl = (lab, n) => `/api/learn/downloads/${lab}/ai-lab-lesson-${String(n).padStart(2, '0')}.zip`;
