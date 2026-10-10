import Blog from '../models/Blog.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import { loadTemplate, renderShell } from '../utils/seoShell.js';
import {
    SITE_NAME, siteUrl, escapeHtml, stripInline, absUrl, seoTitle, postView, listItem, postHtml, listHtml, listJsonLd,
    inlineHtml, blocksToHtml,
} from '../utils/blogSeo.js';

const FIELDS_LIST = 'title slug description excerpt date readTime category coverImage coverAlt author modifiedAt noindex tags';

// Related reading: same category first, then shared tags, then newest. Up to 3.
export const findRelated = async (post) => {
    const others = await Blog.find({ published: true, slug: { $ne: post.slug } }).select(FIELDS_LIST).sort({ date: -1 }).limit(60);
    const score = (o) => (o.category && o.category === post.category ? 10 : 0) + (o.tags || []).filter((t) => (post.tags || []).includes(t)).length * 3;
    return others.map((o) => ({ o, s: score(o) })).sort((a, b) => b.s - a.s || new Date(b.o.date) - new Date(a.o.date)).slice(0, 3).map((x) => x.o);
};

export const loadPostView = async (slug, { count = false } = {}) => {
    const q = { slug, published: true };
    const post = count
        ? await Blog.findOneAndUpdate(q, { $inc: { views: 1 } }, { returnDocument: 'after', timestamps: false })
        : await Blog.findOne(q);
    if (!post) return null;
    const [cat, related] = await Promise.all([
        post.category ? Category.findOne({ type: 'blog', slug: post.category }) : null,
        findRelated(post),
    ]);
    return postView(post, { categoryName: cat?.name || '', related });
};

export const sendShell = (res, status, page) => {
    const tpl = loadTemplate();
    if (!tpl) return false;
    res.status(status).set('Content-Type', 'text/html; charset=utf-8').set('Cache-Control', 'public, max-age=0, s-maxage=300, must-revalidate');
    res.send(renderShell(tpl, page));
    return true;
};

export const notFoundPage = (path) => ({
    fullTitle: `Page not found | ${SITE_NAME}`, description: 'This page could not be found.', canonical: `${siteUrl()}${path}`, robots: 'noindex, nofollow',
    body: '<section class="ssr-article"><h1>Page not found</h1><p><a href="/blog">Back to the blog</a></p></section>', jsonLd: [],
});

// GET /blog/:slug
export const renderPost = async (req, res, next) => {
    try {
        if (!loadTemplate()) return next();
        const view = await loadPostView(req.params.slug);
        if (!view) return sendShell(res, 404, notFoundPage(req.path)) || next();
        const s = view.seo;
        sendShell(res, 200, { ...s, body: postHtml(view), jsonLd: view.jsonLd });
    } catch (e) {
        console.error('[seo] post render failed:', e.message);
        res.set('Retry-After', '120');
        if (!sendShell(res, 503, { ...notFoundPage(req.path), robots: 'noindex', fullTitle: SITE_NAME, description: 'Temporarily unavailable.', body: '' })) next();
    }
};

const BLOG_TITLE = 'Resume Writing Tips & Career Advice';
const BLOG_DESC = 'Practical, no-fluff guides on writing resumes that get interviews: summaries, ATS formatting, bullet points, cover letters and career advice.';

const categoryCounts = async () => {
    const counts = await Blog.aggregate([{ $match: { published: true, category: { $ne: '' } } }, { $group: { _id: '$category', count: { $sum: 1 } } }]);
    const map = Object.fromEntries(counts.map((c) => [c._id, c.count]));
    return (await Category.find({ type: 'blog' }).sort({ name: 1 })).filter((c) => map[c.slug]).map((c) => ({ name: c.name, slug: c.slug, description: c.description, count: map[c.slug] }));
};

// GET /blog  and  GET /blog/category/:slug
export const renderIndex = async (req, res, next) => {
    try {
        if (!loadTemplate()) return next();
        const catSlug = req.params.slug || String(req.query.category || '');
        const cats = await categoryCounts();
        const cat = catSlug ? cats.find((c) => c.slug === catSlug) : null;
        if (catSlug && !cat) return sendShell(res, 404, notFoundPage(req.path)) || next();
        // /blog?category=x duplicates /blog/category/x: send people (and crawlers) to the clean URL.
        if (!req.params.slug && catSlug) return res.redirect(301, `/blog/category/${encodeURIComponent(catSlug)}`);

        const posts = await Blog.find({ published: true, ...(cat ? { category: cat.slug } : {}) }).select(FIELDS_LIST).sort({ date: -1 });
        const name = cat ? `${cat.name} articles` : BLOG_TITLE;
        const description = cat ? (cat.description || `Guides and tips about ${cat.name.toLowerCase()} from the ${SITE_NAME} team.`) : BLOG_DESC;
        const path = cat ? `/blog/category/${cat.slug}` : '/blog';
        const items = posts.map((p) => listItem(p));
        sendShell(res, 200, {
            fullTitle: seoTitle(name), description, canonical: `${siteUrl()}${path}`, robots: 'index, follow', type: 'website',
            keywords: 'resume tips, resume writing advice, career blog, ATS resume tips',
            jsonLd: listJsonLd({ name, description, path, items }),
            body: listHtml({ heading: cat ? cat.name : 'Resume & Career Blog', intro: description, items, categories: cats, activeCategory: cat?.slug || '' }),
        });
    } catch (e) {
        console.error('[seo] index render failed:', e.message);
        next();
    }
};

// ---------- RSS ----------
const cdata = (s) => `<![CDATA[${String(s).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

const rssBody = (v) => [
    v.coverImage ? `<p><img src="${escapeHtml(absUrl(v.coverImage) || v.coverImage)}" alt="${escapeHtml(v.coverAlt || v.title)}"></p>` : '',
    v.takeaways.length ? `<h2>Key takeaways</h2><ul>${v.takeaways.map((t) => `<li>${inlineHtml(t)}</li>`).join('')}</ul>` : '',
    blocksToHtml(v.content),
    v.faqs.length ? `<h2>Frequently asked questions</h2>${v.faqs.map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${inlineHtml(f.a)}</p>`).join('')}` : '',
].join('\n');

// GET /blog/rss.xml
export const rssFeed = async (req, res) => {
    try {
        const posts = await Blog.find({ published: true, noindex: { $ne: true } }).sort({ date: -1 }).limit(50);
        const cats = Object.fromEntries((await Category.find({ type: 'blog' })).map((c) => [c.slug, c.name]));
        const items = posts.map((p) => {
            const v = postView(p, { categoryName: cats[p.category] || '' });
            return `    <item>
      <title>${cdata(p.title)}</title>
      <link>${siteUrl()}/blog/${p.slug}</link>
      <guid isPermaLink="true">${siteUrl()}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <dc:creator>${cdata(v.author)}</dc:creator>${v.categoryName ? `\n      <category>${cdata(v.categoryName)}</category>` : ''}
      <description>${cdata(v.description)}</description>
      <content:encoded>${cdata(rssBody(v))}</content:encoded>
    </item>`;
        }).join('\n');
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_NAME} Blog</title>
    <link>${siteUrl()}/blog</link>
    <atom:link href="${siteUrl()}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeHtml(BLOG_DESC)}</description>
    <language>en</language>
    <lastBuildDate>${new Date(posts[0]?.modifiedAt || posts[0]?.date || Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
        res.set('Content-Type', 'application/rss+xml; charset=utf-8').set('Cache-Control', 'public, max-age=0, s-maxage=900, must-revalidate');
        return res.status(200).send(xml);
    } catch (e) {
        return res.status(500).type('text/plain').send('Feed unavailable');
    }
};

// ---------- llms.txt (a plain-text map of the site for AI assistants) ----------
const plain = (res) => res.set('Content-Type', 'text/plain; charset=utf-8').set('Cache-Control', 'public, max-age=0, s-maxage=900, must-revalidate');

// Tutorials section of llms.txt: each published course with its lessons.
const learnLines = async (u) => {
    try {
        const courses = await Course.find({ published: true, noindex: { $ne: true } }).sort({ order: 1, createdAt: 1 });
        if (!courses.length) return [];
        const lessons = await Lesson.find({ course: { $in: courses.map((c) => c._id) }, published: true, noindex: { $ne: true } }).select('course title slug description').sort({ order: 1, createdAt: 1 });
        const out = ['## Tutorials', ''];
        for (const c of courses) {
            const ls = lessons.filter((l) => String(l.course) === String(c._id));
            if (!ls.length) continue;
            out.push(`### [${c.title}](${u}/learn/${c.slug})`, '', ...ls.map((l) => `- [${l.title}](${u}/learn/${c.slug}/${l.slug})${l.description ? `: ${stripInline(l.description).replace(/\s+/g, ' ').slice(0, 160)}` : ''}`), '');
        }
        return out.length > 2 ? out : [];
    } catch { return []; }
};

export const llmsTxt = async (req, res) => {
    try {
        const [posts, products, cats] = await Promise.all([
            Blog.find({ published: true, noindex: { $ne: true } }).select(FIELDS_LIST).sort({ date: -1 }).limit(200),
            Product.find({ published: true }).select('title slug').limit(50).catch(() => []),
            categoryCounts(),
        ]);
        const u = siteUrl();
        const lines = [
            `# ${SITE_NAME}`, '',
            `> ${SITE_NAME} is a free AI resume builder. It offers ATS-friendly resume templates, AI writing help for resume summaries and bullet points, AI cover letters, and a free ATS resume checker that scores a resume and lists exactly what to improve.`, '',
            '## Key pages', '',
            `- [Resume builder](${u}/): create and download an ATS-friendly resume`,
            `- [Resume templates](${u}/templates): free professional resume templates`,
            `- [Features](${u}/features): everything the builder offers`,
            `- [Free ATS resume checker](${u}/features/ats-checker): upload a resume (PDF or Word) and get an ATS score with fixes`,
            `- [Blog](${u}/blog): resume writing and career advice`,
            `- [Learn](${u}/learn): free step-by-step tutorials for new technologies`,
            `- [Contact](${u}/contact-us)`, '',
        ];
        if (cats.length) lines.push('## Blog categories', '', ...cats.map((c) => `- [${c.name}](${u}/blog/category/${c.slug}): ${c.count} article${c.count > 1 ? 's' : ''}`), '');
        lines.push('## Blog articles', '', ...posts.map((p) => `- [${p.title}](${u}/blog/${p.slug}): ${stripInline(p.description || p.excerpt || '').replace(/\s+/g, ' ').slice(0, 200)}`), '');
        const learn = await learnLines(u);
        if (learn.length) lines.push(...learn);
        if (products.length) lines.push('## Products', '', ...products.map((p) => `- [${p.title}](${u}/products/${p.slug})`), '');
        lines.push('## Optional', '', `- [Full text of every article](${u}/llms-full.txt)`, `- [RSS feed](${u}/blog/rss.xml)`, '');
        return plain(res).status(200).send(lines.join('\n'));
    } catch (e) {
        return res.status(500).type('text/plain').send('Unavailable');
    }
};

export const llmsFullTxt = async (req, res) => {
    try {
        const posts = await Blog.find({ published: true, noindex: { $ne: true } }).sort({ date: -1 }).limit(100);
        const cats = Object.fromEntries((await Category.find({ type: 'blog' })).map((c) => [c.slug, c.name]));
        const u = siteUrl();
        const out = [`# ${SITE_NAME} - blog articles (full text)`, ''];
        for (const p of posts) {
            const v = postView(p, { categoryName: cats[p.category] || '' });
            out.push(`---`, '', `# ${p.title}`, '', `URL: ${u}/blog/${p.slug}`, `Author: ${v.author}`, `Published: ${new Date(p.date).toISOString().slice(0, 10)}`, `Updated: ${new Date(v.modifiedAt).toISOString().slice(0, 10)}`, '');
            if (v.takeaways.length) out.push('Key takeaways:', ...v.takeaways.map((t) => `- ${stripInline(t)}`), '');
            for (const b of v.content) {
                if (b.type === 'heading') out.push(`## ${stripInline(b.text)}`, '');
                else if (b.type === 'list') out.push(...b.items.map((i) => `- ${stripInline(i)}`), '');
                else if (b.type === 'olist') out.push(...b.items.map((i, n) => `${n + 1}. ${stripInline(i)}`), '');
                else if (b.type === 'image') { if (b.alt) out.push(`[Image: ${b.alt}]`, ''); }
                else out.push(stripInline(b.text), '');
            }
            if (v.faqs.length) out.push('## FAQ', '', ...v.faqs.flatMap((f) => [`Q: ${f.q}`, `A: ${stripInline(f.a)}`, '']));
        }
        return plain(res).status(200).send(out.join('\n'));
    } catch (e) {
        return res.status(500).type('text/plain').send('Unavailable');
    }
};
