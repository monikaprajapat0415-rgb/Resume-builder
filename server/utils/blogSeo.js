import { slugify, isSafeUrl } from './slugify.js';

export const SITE_NAME = 'Prime Resume AI';
export const siteUrl = () => (process.env.CLIENT_URL || 'https://primeresumeai.com').replace(/\/+$/, '');
export const DEFAULT_AUTHOR = 'Prime Resume AI Team';
const DEFAULT_IMAGE = () => `${siteUrl()}/og-image.png`;

// ---------- text helpers ----------

export const escapeHtml = (s = '') => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
export const stripInline = (t = '') => String(t).replace(TOKEN, (_, label, _u, bold) => label ?? bold);

// [text](url) and **bold** -> safe HTML (everything else is escaped).
export const inlineHtml = (text = '') => {
    let out = '', last = 0, m;
    const src = String(text);
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(src)) !== null) {
        out += escapeHtml(src.slice(last, m.index));
        if (m[3] !== undefined) out += `<strong>${escapeHtml(m[3])}</strong>`;
        else if (!isSafeUrl(m[2])) out += escapeHtml(m[1]);
        else out += `<a href="${escapeHtml(m[2])}"${/^https?:/i.test(m[2]) ? ' rel="noopener noreferrer"' : ''}>${escapeHtml(m[1])}</a>`;
        last = m.index + m[0].length;
    }
    return out + escapeHtml(src.slice(last));
};

export const absUrl = (u) => {
    if (!u) return '';
    if (/^https?:\/\//i.test(u)) return u;
    return /^\//.test(u) ? `${siteUrl()}${u}` : '';
};

export const blocksToText = (blocks = []) => blocks.map((b) => {
    if (b.type === 'list' || b.type === 'olist') return (b.items || []).map(stripInline).join(' ');
    if (b.type === 'image') return b.caption || '';
    if (b.type === 'code') return b.text || '';
    return stripInline(b.text || '');
}).join(' ');

export const wordCount = (blocks = [], extra = '') => (`${blocksToText(blocks)} ${extra}`.match(/\S+/g) || []).length;
export const readTimeFor = (words) => `${Math.max(1, Math.round(words / 200))} min read`;

// ---------- sanitising admin input ----------

const str = (v, max) => String(v ?? '').trim().slice(0, max);
const httpUrl = (v) => (/^https?:\/\/[^\s]+$/i.test(String(v || '').trim()) ? String(v).trim().slice(0, 500) : '');
const mediaUrl = (v) => (/^(https?:\/\/[^\s]+|\/[^\s/][^\s]*)$/i.test(String(v || '').trim()) ? String(v).trim().slice(0, 500) : '');

export const cleanBlogBlocks = (content) => (Array.isArray(content) ? content : []).slice(0, 300).map((b) => {
    const type = b?.type;
    if (type === 'list' || type === 'olist') return { type, items: (Array.isArray(b.items) ? b.items : []).map((s) => str(s, 1000)).filter(Boolean) };
    if (type === 'image') return { type, url: mediaUrl(b.url), alt: str(b.alt, 200), caption: str(b.caption, 300) };
    if (type === 'code') return { type, lang: str(b.lang, 20).toLowerCase().replace(/[^a-z0-9+#.-]/g, ''), text: String(b.text ?? '').replace(/\s+$/, '').slice(0, 30000) };
    if (type === 'note') return { type, text: str(b.text, 3000) };
    return { type: type === 'heading' ? 'heading' : 'paragraph', text: str(b?.text, 20000) };
}).filter((b) => (b.type === 'list' || b.type === 'olist' ? b.items.length : b.type === 'image' ? b.url : b.text.length));

// Validates + normalises the SEO/GEO fields. Returns only the keys that were sent.
export const cleanSeoFields = (body) => {
    const out = {};
    const has = (k) => body[k] !== undefined;
    if (has('metaTitle')) out.metaTitle = str(body.metaTitle, 120);
    if (has('focusKeyword')) out.focusKeyword = str(body.focusKeyword, 80);
    if (has('coverImage')) out.coverImage = mediaUrl(body.coverImage);
    if (has('coverAlt')) out.coverAlt = str(body.coverAlt, 200);
    if (has('takeaways')) out.takeaways = (Array.isArray(body.takeaways) ? body.takeaways : []).map((s) => str(s, 300)).filter(Boolean).slice(0, 8);
    if (has('faqs')) out.faqs = (Array.isArray(body.faqs) ? body.faqs : []).map((f) => ({ q: str(f?.q, 200), a: str(f?.a, 1500) })).filter((f) => f.q && f.a).slice(0, 15);
    if (has('sources')) out.sources = (Array.isArray(body.sources) ? body.sources : []).map((s) => ({ title: str(s?.title, 150), url: httpUrl(s?.url) })).filter((s) => s.title && s.url).slice(0, 15);
    if (has('tags')) out.tags = [...new Set((Array.isArray(body.tags) ? body.tags : String(body.tags || '').split(',')).map((t) => str(t, 30).toLowerCase()).filter(Boolean))].slice(0, 10);
    if (has('author')) out.author = str(body.author, 80) || DEFAULT_AUTHOR;
    if (has('authorBio')) out.authorBio = str(body.authorBio, 400);
    if (has('canonicalUrl')) out.canonicalUrl = httpUrl(body.canonicalUrl);
    if (has('noindex')) out.noindex = Boolean(body.noindex);
    if (has('description')) out.description = str(body.description, 320);
    if (has('keywords')) out.keywords = str(body.keywords, 300);
    return out;
};

// ---------- view model: everything a page / crawler needs ----------

export const headingIds = (blocks) => {
    const used = new Map();
    return blocks.map((b, i) => {
        if (b.type !== 'heading') return b;
        let id = slugify(stripInline(b.text)) || `section-${i + 1}`;
        const n = used.get(id) || 0; used.set(id, n + 1);
        if (n) id = `${id}-${n + 1}`;
        return { ...b, id };
    });
};

const firstSentences = (blocks, max = 155) => {
    const p = blocks.find((b) => b.type === 'paragraph' && b.text);
    const t = stripInline(p?.text || '').replace(/\s+/g, ' ').trim();
    if (t.length <= max) return t;
    return t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
};

export const seoTitle = (t) => (t ? (t.includes(SITE_NAME) ? t : `${t} | ${SITE_NAME}`) : `${SITE_NAME} - Free AI Resume Builder & CV Maker`);

export const postView = (post, { categoryName = '', related = [] } = {}) => {
    const p = typeof post.toObject === 'function' ? post.toObject() : post;
    const content = headingIds(p.content || []);
    const words = wordCount(content, [...(p.takeaways || []), ...(p.faqs || []).map((f) => `${f.q} ${f.a}`)].join(' '));
    const url = `${siteUrl()}/blog/${p.slug}`;
    const description = p.description || p.excerpt && stripInline(p.excerpt) || firstSentences(content);
    const published = p.date || p.createdAt;
    const modified = p.modifiedAt || p.date || p.updatedAt;
    const image = absUrl(p.coverImage) || DEFAULT_IMAGE();
    const isTeam = !p.author || p.author === DEFAULT_AUTHOR;
    const author = isTeam
        ? { '@type': 'Organization', name: SITE_NAME, url: siteUrl() }
        : { '@type': 'Person', name: p.author, ...(p.authorBio ? { description: p.authorBio } : {}), worksFor: { '@type': 'Organization', name: SITE_NAME } };

    const seo = {
        title: p.metaTitle || p.title,
        fullTitle: seoTitle(p.metaTitle || p.title),
        description,
        keywords: p.keywords || (p.tags || []).join(', '),
        canonical: p.canonicalUrl || url,
        robots: p.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1',
        image, imageAlt: p.coverAlt || p.title,
        type: 'article', url,
        article: { published, modified, author: isTeam ? SITE_NAME : p.author, section: categoryName, tags: p.tags || [] },
    };

    const breadcrumbs = [{ name: 'Home', url: siteUrl() + '/' }, { name: 'Blog', url: `${siteUrl()}/blog` }];
    if (p.category && categoryName) breadcrumbs.push({ name: categoryName, url: `${siteUrl()}/blog/category/${p.category}` });
    breadcrumbs.push({ name: p.title, url });

    const jsonLd = [
        {
            '@context': 'https://schema.org', '@type': 'BlogPosting',
            '@id': `${url}#article`,
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            headline: (p.title || '').slice(0, 110), name: p.title, description,
            image: [image], datePublished: new Date(published).toISOString(), dateModified: new Date(modified).toISOString(),
            author, publisher: { '@type': 'Organization', name: SITE_NAME, url: siteUrl(), logo: { '@type': 'ImageObject', url: `${siteUrl()}/logo.svg` } },
            inLanguage: 'en', wordCount: words, timeRequired: `PT${Math.max(1, Math.round(words / 200))}M`,
            ...(categoryName ? { articleSection: categoryName } : {}),
            ...(seo.keywords ? { keywords: seo.keywords } : {}),
            ...((p.sources || []).length ? { citation: p.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url })) } : {}),
            ...(p.takeaways?.length ? { abstract: p.takeaways.join(' ') } : {}),
        },
        {
            '@context': 'https://schema.org', '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
        },
    ];
    if (p.faqs?.length) {
        jsonLd.push({
            '@context': 'https://schema.org', '@type': 'FAQPage',
            mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: stripInline(f.a) } })),
        });
    }

    return {
        _id: p._id, title: p.title, slug: p.slug, description, excerpt: p.excerpt, keywords: p.keywords,
        date: p.date, modifiedAt: modified, readTime: p.readTime || readTimeFor(words), wordCount: words,
        category: p.category, categoryName, author: p.author || DEFAULT_AUTHOR, authorBio: p.authorBio || '',
        coverImage: p.coverImage || '', coverAlt: p.coverAlt || '', tags: p.tags || [], takeaways: p.takeaways || [],
        faqs: p.faqs || [], sources: p.sources || [], noindex: Boolean(p.noindex),
        content,
        toc: content.filter((b) => b.type === 'heading').map((b) => ({ id: b.id, text: stripInline(b.text) })),
        related: related.map((r) => ({ title: r.title, slug: r.slug, excerpt: stripInline(r.excerpt || r.description || ''), date: r.date, readTime: r.readTime, coverImage: r.coverImage || '', coverAlt: r.coverAlt || '' })),
        seo, jsonLd, breadcrumbs,
    };
};

// Cards for the list pages (no body).
export const listItem = (p, catName = '') => ({
    title: p.title, slug: p.slug, excerpt: p.excerpt, description: p.description, date: p.date,
    readTime: p.readTime || '', category: p.category, categoryName: catName,
    coverImage: p.coverImage || '', coverAlt: p.coverAlt || p.title, author: p.author || DEFAULT_AUTHOR,
});

// ---------- HTML for crawlers (what a page looks like with JavaScript off) ----------

export const blocksToHtml = (blocks = []) => blocks.map((b) => {
    if (b.type === 'heading') return `<h2${b.id ? ` id="${escapeHtml(b.id)}"` : ''}>${escapeHtml(stripInline(b.text))}</h2>`;
    if (b.type === 'list') return `<ul>${(b.items || []).map((i) => `<li>${inlineHtml(i)}</li>`).join('')}</ul>`;
    if (b.type === 'olist') return `<ol>${(b.items || []).map((i) => `<li>${inlineHtml(i)}</li>`).join('')}</ol>`;
    if (b.type === 'image') {
        const src = absUrl(b.url) || b.url;
        return `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(b.alt || '')}" loading="lazy">${b.caption ? `<figcaption>${escapeHtml(b.caption)}</figcaption>` : ''}</figure>`;
    }
    if (b.type === 'code') return `<pre><code${b.lang ? ` class="language-${escapeHtml(b.lang)}"` : ''}>${escapeHtml(b.text || '')}</code></pre>`;
    if (b.type === 'note') return `<aside><p><strong>Note:</strong> ${inlineHtml(b.text)}</p></aside>`;
    return `<p>${inlineHtml(b.text)}</p>`;
}).join('\n');

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const iso = (d) => new Date(d).toISOString();

export const postHtml = (v) => `
<article class="ssr-article" itemscope itemtype="https://schema.org/BlogPosting">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/blog">Blog</a>${v.category && v.categoryName ? ` › <a href="/blog/category/${escapeHtml(v.category)}">${escapeHtml(v.categoryName)}</a>` : ''}</nav>
  <h1 itemprop="headline">${escapeHtml(v.title)}</h1>
  <p class="meta">By <span itemprop="author">${escapeHtml(v.author)}</span> · Published <time datetime="${iso(v.date)}" itemprop="datePublished">${fmtDate(v.date)}</time> · Updated <time datetime="${iso(v.modifiedAt)}" itemprop="dateModified">${fmtDate(v.modifiedAt)}</time> · ${escapeHtml(v.readTime)}</p>
  ${v.coverImage ? `<img src="${escapeHtml(absUrl(v.coverImage) || v.coverImage)}" alt="${escapeHtml(v.coverAlt || v.title)}" width="1200" height="630">` : ''}
  ${v.takeaways.length ? `<section><h2>Key takeaways</h2><ul>${v.takeaways.map((t) => `<li>${inlineHtml(t)}</li>`).join('')}</ul></section>` : ''}
  ${v.toc.length > 2 ? `<nav aria-label="Table of contents"><h2>In this article</h2><ol>${v.toc.map((t) => `<li><a href="#${escapeHtml(t.id)}">${escapeHtml(t.text)}</a></li>`).join('')}</ol></nav>` : ''}
  <div itemprop="articleBody">${blocksToHtml(v.content)}</div>
  ${v.faqs.length ? `<section><h2>Frequently asked questions</h2>${v.faqs.map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${inlineHtml(f.a)}</p>`).join('')}</section>` : ''}
  ${v.sources.length ? `<section><h2>Sources</h2><ul>${v.sources.map((s) => `<li><a href="${escapeHtml(s.url)}" rel="noopener noreferrer">${escapeHtml(s.title)}</a></li>`).join('')}</ul></section>` : ''}
  ${v.authorBio ? `<aside><h2>About the author</h2><p><strong>${escapeHtml(v.author)}</strong>. ${escapeHtml(v.authorBio)}</p></aside>` : ''}
  ${v.related.length ? `<aside><h2>Related articles</h2><ul>${v.related.map((r) => `<li><a href="/blog/${escapeHtml(r.slug)}">${escapeHtml(r.title)}</a></li>`).join('')}</ul></aside>` : ''}
</article>`;

export const listHtml = ({ heading, intro, items, categories = [], activeCategory = '' }) => `
<section class="ssr-article">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/blog">Blog</a>${activeCategory ? ` › ${escapeHtml(heading)}` : ''}</nav>
  <h1>${escapeHtml(heading)}</h1>
  <p>${escapeHtml(intro)}</p>
  ${categories.length ? `<nav aria-label="Categories"><ul>${categories.map((c) => `<li><a href="/blog/category/${escapeHtml(c.slug)}">${escapeHtml(c.name)}</a> (${c.count})</li>`).join('')}</ul></nav>` : ''}
  <ul>${items.map((p) => `<li><h2><a href="/blog/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(stripInline(p.excerpt || p.description || ''))}</p><time datetime="${iso(p.date)}">${fmtDate(p.date)}</time></li>`).join('')}</ul>
</section>`;

// JSON-LD must never be able to close the <script> tag.
export const safeJson = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c').split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029');

export const listJsonLd = ({ name, description, path, items }) => [
    {
        '@context': 'https://schema.org', '@type': 'CollectionPage', name, description, url: `${siteUrl()}${path}`, inLanguage: 'en',
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: siteUrl() },
        mainEntity: { '@type': 'ItemList', itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteUrl()}/blog/${p.slug}`, name: p.title })) },
    },
    {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [{ name: 'Home', url: siteUrl() + '/' }, { name: 'Blog', url: `${siteUrl()}/blog` }, ...(path !== '/blog' ? [{ name, url: `${siteUrl()}${path}` }] : [])]
            .map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
    },
];
