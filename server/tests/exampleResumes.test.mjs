// Run: OPENAI_API_KEY=x node --test server/tests/exampleResumes.test.mjs   (no database needed)
// The 100/100 claim itself needs a real exported PDF; this guards the parts that do not: slugs, lengths, numbers, page text.
import test from 'node:test';
import assert from 'node:assert/strict';
import { EXAMPLES } from '../utils/exampleResumes.js';
import { exampleHtml, exampleView } from '../utils/exampleSeo.js';
import { exampleSlugs } from '../../client/src/content/exampleSlugs.js';
import { STATIC_ROUTES } from '../utils/staticSitemapRoutes.js';

const NEW = ['warehouse-supervisor-resume-example', 'nurse-resume-example'];

test('slugs are unique and match the client list and the sitemap', () => {
  const s = EXAMPLES.map((e) => e.slug);
  assert.equal(new Set(s).size, s.length);
  assert.deepEqual([...s].sort(), [...exampleSlugs].sort());
  for (const slug of s) assert.ok(STATIC_ROUTES.includes(`/examples/${slug}`), slug);
});

test('new examples have SEO copy of the right length and numbers in their bullets', () => {
  for (const slug of NEW) {
    const e = EXAMPLES.find((x) => x.slug === slug);
    assert.ok(e, slug);
    assert.ok(e.title.length <= 60 && e.metaDescription.length >= 70 && e.metaDescription.length <= 160, slug);
    assert.ok(e.why.length >= 3 && e.tips.length >= 2);
    const bullets = e.data.experience.flatMap((x) => x.description.split('\n'));
    assert.ok(bullets.length >= 8);
    assert.ok(bullets.filter((b) => /\d/.test(b)).length >= 6, 'most bullets carry a number');
    assert.ok(/example\.com$/.test(e.data.personal_info.email), 'invented person');
    assert.ok(!/\b(guarantee|best|#1|dream job|get hired)\b/i.test(JSON.stringify(e)), 'no promises');
  }
});

test('the server page for each new example shows the real resume text and the page and breadcrumb JSON-LD', () => {
  for (const slug of NEW) {
    const e = EXAMPLES.find((x) => x.slug === slug);
    const html = exampleHtml(e);
    assert.ok(html.includes(e.data.personal_info.full_name));
    assert.ok(html.includes(e.data.experience[0].company));
    const ld = exampleView(e).jsonLd;
    assert.ok(ld.some((x) => x['@type'] === 'WebPage') && ld.some((x) => x['@type'] === 'BreadcrumbList'));
    JSON.parse(JSON.stringify(ld));
  }
});
