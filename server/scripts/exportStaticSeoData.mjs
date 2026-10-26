// Copies the text the server-rendered public pages need out of the client source, so the server HTML and the
// browser pages cannot drift apart. Run after editing client/src/content/resumeTemplates.js or the FAQ arrays:
//   cd server && node scripts/exportStaticSeoData.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const client = path.resolve(here, '../../client/src');
const read = (p) => fs.readFileSync(path.join(client, p), 'utf8');
const evalLiteral = (text) => new Function(`"use strict"; return (${text});`)();

// Template data: strip the image imports (they are webp files) and read the array literal.
let src = read('content/resumeTemplates.js');
src = src.replace(/^import .*$/gm, '').replace(/image:\s*[A-Za-z0-9_]+Img,?/g, "image: '',");
const body = src.slice(src.indexOf('export const resumeTemplates = ') + 'export const resumeTemplates = '.length, src.indexOf('export const getTemplateBySlug'));
const templates = evalLiteral(body.trim().replace(/;?\s*$/, '')).map((t) => ({
    id: t.id, slug: t.slug, name: t.name, tagline: t.tagline, description: t.description, metaDescription: t.metaDescription || '',
    keywords: t.keywords || '', ats: t.ats, bestFor: t.bestFor || [], features: t.features || [],
}));

// FAQ arrays: `const FAQS = [ [q, a], ... ]`
const faqs = {};
for (const [key, file] of [['cv', 'pages/CvLanding.jsx'], ['matcher', 'pages/JdMatcher.jsx'], ['hire', 'pages/HireLanding.jsx']]) {
    const s = read(file);
    const i = s.indexOf('const FAQS = [');
    if (i < 0) throw new Error(`FAQS not found in ${file}`);
    let depth = 0, j = s.indexOf('[', i), start = j;
    for (; j < s.length; j++) { if (s[j] === '[') depth++; else if (s[j] === ']') { depth--; if (!depth) break; } }
    faqs[key] = evalLiteral(s.slice(start, j + 1)).map(([q, a]) => ({ q, a }));
}

const out = path.resolve(here, '../utils/staticSeoData.json');
fs.writeFileSync(out, JSON.stringify({ templates, faqs }, null, 1));
console.log(`Wrote ${out}: ${templates.length} templates, FAQs: ${Object.entries(faqs).map(([k, v]) => `${k}=${v.length}`).join(', ')}`);
