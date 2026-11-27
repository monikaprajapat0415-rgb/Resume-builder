// Run: node --test server/tests/fileToolsPages.test.mjs   (no database needed)
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { careerData } from '../utils/staticPages.js';
import { STATIC_ROUTES } from '../utils/staticSitemapRoutes.js';
import { TOOLS } from '../controllers/toolSettingsController.js';

const SLUGS = ['merge-pdf', 'split-pdf', 'reduce-pdf-size', 'photo-signature-resizer'];

test('each file tool has copy that meets the SEO rules, a sitemap entry, an admin switch and a route', () => {
  const routes = fs.readFileSync(new URL('../routes/seoRoutes.js', import.meta.url), 'utf8');
  const nginx = fs.readFileSync(new URL('../../nginx-static-pages-snippet.conf', import.meta.url), 'utf8');
  const vite = fs.readFileSync(new URL('../../client/vite.config.js', import.meta.url), 'utf8');
  for (const slug of SLUGS) {
    const t = careerData().tools.find((x) => x.slug === slug);
    assert.ok(t, slug);
    assert.ok(t.title.length <= 60, `${slug} title ${t.title.length}`);
    assert.ok(t.description.length >= 70 && t.description.length <= 160, `${slug} description ${t.description.length}`);
    assert.equal(t.needsLogin, false); assert.equal(t.ai, false);
    assert.ok(t.faqs.length >= 3);
    assert.ok(TOOLS[t.flag], `${slug} flag ${t.flag} has an admin switch`);
    assert.ok(STATIC_ROUTES.includes(t.path), `${slug} in sitemap`);
    assert.ok(routes.includes(`'${t.path}'`), `${slug} server route`);
    assert.ok(nginx.includes(t.path.slice(1)), `${slug} nginx`);
    assert.ok(vite.includes(`'${t.path}'`), `${slug} prerender list`);
    assert.ok(!/\b(guarantee|best|#1|\d+% )/i.test(`${t.intro} ${t.note} ${t.description}`), `${slug} claims`);
  }
});

test('client and server copies of the tool text are identical', () => {
  const a = fs.readFileSync(new URL('../../client/src/content/careerTools.json', import.meta.url), 'utf8');
  const b = fs.readFileSync(new URL('../utils/careerToolsData.json', import.meta.url), 'utf8');
  assert.equal(a, b);
});
