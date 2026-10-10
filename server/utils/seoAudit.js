import { stripInline, wordCount, siteUrl } from './blogSeo.js';

// Scores a stored blog post against the same SEO + GEO checklist the editor shows,
// so the dashboard and the editor never disagree.

const lc = (s = '') => stripInline(String(s)).toLowerCase();
const textOf = (b) => (b.items ? b.items.join(' ') : b.text || '');

// [key, label, how to fix it, check(post) -> boolean]
const CHECKS = [
  ['keyword', 'Focus keyword set', 'Add a focus keyword in the SEO panel.', (p) => Boolean(p.focusKeyword?.trim())],
  ['kwTitle', 'Keyword in title', 'Work the focus keyword into the title.', (p, c) => c.kw && lc(c.title).includes(c.kw)],
  ['kwDesc', 'Keyword in meta description', 'Mention the focus keyword in the meta description.', (p, c) => c.kw && lc(p.description).includes(c.kw)],
  ['kwIntro', 'Keyword in first paragraph', 'Use the focus keyword in the opening paragraph.', (p, c) => c.kw && lc(c.firstPara).includes(c.kw)],
  ['kwHeading', 'Keyword in a subheading', 'Use the focus keyword in at least one subheading.', (p, c) => c.kw && c.headings.some((h) => lc(h.text).includes(c.kw))],
  ['kwSlug', 'Keyword in URL', 'Change the URL slug to include the focus keyword.', (p, c) => c.kw && String(p.slug || '').includes(c.kw.replace(/\s+/g, '-'))],
  ['titleLen', 'Title 30-60 characters', 'Shorten or lengthen the SEO title to 30-60 characters.', (p, c) => c.title.length >= 30 && c.title.length <= 60],
  ['descLen', 'Meta description 110-160 characters', 'Rewrite the meta description to 110-160 characters.', (p) => (p.description || '').length >= 110 && (p.description || '').length <= 160],
  ['words', 'At least 600 words', 'Expand the article to 600+ words.', (p, c) => c.words >= 600],
  ['headings', '3+ subheadings', 'Break the article up with at least 3 subheadings.', (p, c) => c.headings.length >= 3],
  ['internal', 'Internal link', 'Link to another page on your site.', (p, c) => c.internal > 0],
  ['external', 'External source link', 'Cite or link to an authoritative source.', (p, c) => c.external > 0 || c.hasSources],
  ['cover', 'Cover image with alt text', 'Add a cover image and describe it in the alt text.', (p) => Boolean(p.coverImage && (p.coverAlt || '').trim())],
  ['takeaways', 'Key takeaways', 'Add 3-5 key takeaways (AI answer engines quote these).', (p) => (p.takeaways || []).some((t) => String(t).trim())],
  ['faq', 'FAQ with 2+ questions', 'Add at least 2 FAQ questions (creates FAQ schema).', (p) => (p.faqs || []).filter((f) => f.q && f.a).length >= 2],
  ['sources', 'Sources cited', 'List the sources you used.', (p, c) => c.hasSources],
  ['category', 'Category chosen', 'Choose a category.', (p) => Boolean(p.category)],
];

export const CHECK_META = CHECKS.map(([key, label, fix]) => ({ key, label, fix }));

export const scorePost = (p) => {
  const blocks = p.content || [];
  const headings = blocks.filter((b) => b.type === 'heading');
  const allText = blocks.map(textOf).join(' ');
  const ctx = {
    kw: (p.focusKeyword || '').trim().toLowerCase(),
    title: (p.metaTitle || p.title || '').trim(),
    firstPara: blocks.find((b) => b.type === 'paragraph')?.text || '',
    headings,
    words: wordCount(blocks, ''),
    internal: (allText.match(/\]\(\//g) || []).length,
    external: (allText.match(/\]\(https?:/g) || []).length,
    hasSources: (p.sources || []).some((s) => s.url),
  };
  const results = CHECKS.map(([key, label, fix, fn]) => ({ key, label, fix, ok: Boolean(fn(p, ctx)) }));
  const passed = results.filter((r) => r.ok).length;
  const score = Math.round((passed / results.length) * 100);
  return {
    score,
    status: score >= 80 ? 'good' : score >= 50 ? 'fair' : 'poor',
    words: ctx.words,
    issues: results.filter((r) => !r.ok).map(({ key, label, fix }) => ({ key, label, fix })),
  };
};

const dupes = (rows, pick) => {
  const map = new Map();
  rows.forEach((r) => {
    const v = (pick(r) || '').trim().toLowerCase();
    if (v) map.set(v, [...(map.get(v) || []), r]);
  });
  return [...map.values()].filter((g) => g.length > 1).map((g) => g.map((r) => ({ _id: r._id, title: r.title, slug: r.slug })));
};

export const auditBlogs = (posts) => {
  const rows = posts.map((p) => {
    const s = scorePost(p);
    return {
      _id: p._id, title: p.title, slug: p.slug, published: p.published !== false, noindex: Boolean(p.noindex),
      views: p.views || 0, category: p.category || '', modifiedAt: p.modifiedAt || p.updatedAt || p.date, ...s,
    };
  });
  const live = rows.filter((r) => r.published);
  const pct = (fn) => (live.length ? Math.round((live.filter(fn).length / live.length) * 100) : 0);
  const byKey = {};
  live.forEach((r) => r.issues.forEach((i) => { byKey[i.key] = byKey[i.key] || { ...i, count: 0 }; byKey[i.key].count++; }));
  const publishedPosts = posts.filter((p) => p.published !== false);
  return {
    summary: {
      published: live.length,
      drafts: rows.length - live.length,
      noindex: live.filter((r) => r.noindex).length,
      avgScore: live.length ? Math.round(live.reduce((n, r) => n + r.score, 0) / live.length) : 0,
      good: live.filter((r) => r.status === 'good').length,
      fair: live.filter((r) => r.status === 'fair').length,
      poor: live.filter((r) => r.status === 'poor').length,
      geo: {
        faq: pct((r) => !r.issues.some((i) => i.key === 'faq')),
        takeaways: pct((r) => !r.issues.some((i) => i.key === 'takeaways')),
        sources: pct((r) => !r.issues.some((i) => i.key === 'sources')),
        cover: pct((r) => !r.issues.some((i) => i.key === 'cover')),
      },
    },
    topIssues: Object.values(byKey).sort((a, b) => b.count - a.count),
    duplicateTitles: dupes(publishedPosts, (p) => p.metaTitle || p.title),
    duplicateDescriptions: dupes(publishedPosts, (p) => p.description),
    posts: rows.sort((a, b) => a.score - b.score),
    urls: {
      site: siteUrl(),
      sitemap: `${siteUrl()}/sitemap.xml`,
      blogSitemap: `${siteUrl()}/sitemap-content.xml`,
      robots: `${siteUrl()}/robots.txt`,
      llms: `${siteUrl()}/llms.txt`,
      rss: `${siteUrl()}/blog/rss.xml`,
    },
  };
};
