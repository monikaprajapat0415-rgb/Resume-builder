import { slugify } from './slugify.js';
import {
    SITE_NAME, siteUrl, absUrl, escapeHtml, stripInline, inlineHtml, blocksToHtml, headingIds, wordCount, readTimeFor, seoTitle, DEFAULT_AUTHOR,
} from './blogSeo.js';

const str = (v, max) => String(v ?? '').trim().slice(0, max);
const httpOrPath = (v) => (/^(https?:\/\/[^\s]+|\/[^\s/][^\s]*)$/i.test(String(v || '').trim()) ? String(v).trim().slice(0, 500) : '');
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All levels'];

// ---------- sanitising admin input ----------

export const cleanCourseFields = (b) => {
    const out = {};
    const has = (k) => b[k] !== undefined;
    if (has('description')) out.description = str(b.description, 320);
    if (has('summary')) out.summary = str(b.summary, 200);
    if (has('level')) out.level = LEVELS.includes(b.level) ? b.level : 'All levels';
    if (has('topic')) out.topic = str(b.topic, 40);
    if (has('badge')) out.badge = str(b.badge, 3).toUpperCase();
    if (has('coverImage')) out.coverImage = httpOrPath(b.coverImage);
    if (has('coverAlt')) out.coverAlt = str(b.coverAlt, 200);
    if (has('tags')) out.tags = [...new Set((Array.isArray(b.tags) ? b.tags : String(b.tags || '').split(',')).map((t) => str(t, 30).toLowerCase()).filter(Boolean))].slice(0, 10);
    if (has('author')) out.author = str(b.author, 80) || DEFAULT_AUTHOR;
    if (has('order')) out.order = Number.isFinite(Number(b.order)) ? Math.trunc(Number(b.order)) : 0;
    if (has('published')) out.published = Boolean(b.published);
    if (has('metaTitle')) out.metaTitle = str(b.metaTitle, 120);
    if (has('keywords')) out.keywords = str(b.keywords, 300);
    if (has('noindex')) out.noindex = Boolean(b.noindex);
    return out;
};

export const cleanLessonFields = (b) => {
    const out = {};
    const has = (k) => b[k] !== undefined;
    if (has('section')) out.section = str(b.section, 80);
    if (has('description')) out.description = str(b.description, 320);
    if (has('readTime')) out.readTime = str(b.readTime, 30);
    if (has('published')) out.published = Boolean(b.published);
    if (has('metaTitle')) out.metaTitle = str(b.metaTitle, 120);
    if (has('keywords')) out.keywords = str(b.keywords, 300);
    if (has('noindex')) out.noindex = Boolean(b.noindex);
    if (has('faqs')) out.faqs = (Array.isArray(b.faqs) ? b.faqs : []).map((f) => ({ q: str(f?.q, 200), a: str(f?.a, 1500) })).filter((f) => f.q && f.a).slice(0, 15);
    return out;
};

// ---------- view models ----------

const plainLesson = (l) => ({ title: l.title, slug: l.slug, section: l.section || '', description: l.description || '', readTime: l.readTime || '' });

// Lessons (already sorted by order) -> [{ title, lessons: [...] }] in order of first appearance.
export const groupSections = (lessons) => {
    const sections = [];
    for (const l of lessons) {
        const name = l.section || '';
        let s = sections.find((x) => x.title === name);
        if (!s) { s = { title: name, lessons: [] }; sections.push(s); }
        s.lessons.push(plainLesson(l));
    }
    return sections;
};

const courseUrl = (c) => `${siteUrl()}/learn/${c.slug}`;
const lessonUrl = (c, l) => `${siteUrl()}/learn/${c.slug}/${l.slug}`;
const breadcrumbLd = (items) => ({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
});
const publisher = () => ({ '@type': 'Organization', name: SITE_NAME, url: siteUrl(), logo: { '@type': 'ImageObject', url: `${siteUrl()}/logo.svg` } });
const authorOf = (a) => ((!a || a === DEFAULT_AUTHOR) ? { '@type': 'Organization', name: SITE_NAME, url: siteUrl() } : { '@type': 'Person', name: a });

export const courseCard = (c, lessonCount = 0) => ({
    title: c.title, slug: c.slug, summary: c.summary || c.description || '', level: c.level, topic: c.topic || '',
    badge: c.badge || '', coverImage: c.coverImage || '', coverAlt: c.coverAlt || c.title, lessonCount,
});

export const courseView = (course, lessons) => {
    const c = typeof course.toObject === 'function' ? course.toObject() : course;
    const sections = groupSections(lessons);
    const url = courseUrl(c);
    const description = c.description || c.summary || `Learn ${c.title} step by step with clear explanations and examples.`;
    const image = absUrl(c.coverImage) || `${siteUrl()}/og-image.png`;
    const seo = {
        title: c.metaTitle || c.title, fullTitle: seoTitle(c.metaTitle || c.title), description, keywords: c.keywords || (c.tags || []).join(', '),
        canonical: url, robots: c.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large', image, imageAlt: c.coverAlt || c.title, type: 'website', url,
    };
    const crumbs = [{ name: 'Home', url: `${siteUrl()}/` }, { name: 'Learn', url: `${siteUrl()}/learn` }, { name: c.title, url }];
    const jsonLd = [
        {
            '@context': 'https://schema.org', '@type': 'Course', name: c.title, description, url, inLanguage: 'en',
            provider: { '@type': 'Organization', name: SITE_NAME, sameAs: siteUrl() },
            educationalLevel: c.level, ...(c.tags?.length ? { keywords: c.tags.join(', ') } : {}), image: [image],
            hasPart: lessons.map((l) => ({ '@type': 'LearningResource', name: l.title, url: lessonUrl(c, l) })),
        },
        breadcrumbLd(crumbs),
    ];
    return {
        course: { title: c.title, slug: c.slug, description, summary: c.summary || '', level: c.level, topic: c.topic || '', badge: c.badge || '', coverImage: c.coverImage || '', coverAlt: c.coverAlt || c.title, tags: c.tags || [], author: c.author || DEFAULT_AUTHOR, modifiedAt: c.modifiedAt || c.updatedAt },
        sections, lessonCount: lessons.length, firstLesson: lessons[0]?.slug || '', seo, jsonLd, breadcrumbs: crumbs,
    };
};

export const lessonView = (course, lesson, lessons) => {
    const c = typeof course.toObject === 'function' ? course.toObject() : course;
    const l = typeof lesson.toObject === 'function' ? lesson.toObject() : lesson;
    const content = headingIds(l.content || []);
    const words = wordCount(content, (l.faqs || []).map((f) => `${f.q} ${f.a}`).join(' '));
    const url = lessonUrl(c, l);
    const firstPara = stripInline(content.find((b) => b.type === 'paragraph')?.text || '').replace(/\s+/g, ' ').trim();
    const description = l.description || (firstPara.length > 155 ? `${firstPara.slice(0, 154).replace(/\s+\S*$/, '')}…` : firstPara) || `${l.title} - ${c.title}`;
    const idx = lessons.findIndex((x) => String(x._id) === String(l._id));
    const prev = idx > 0 ? plainLesson(lessons[idx - 1]) : null;
    const next = idx >= 0 && idx < lessons.length - 1 ? plainLesson(lessons[idx + 1]) : null;
    const published = l.createdAt || Date.now();
    const modified = l.modifiedAt || l.updatedAt || published;
    const image = absUrl(c.coverImage) || `${siteUrl()}/og-image.png`;
    const fullTitleBase = l.metaTitle || `${l.title} - ${c.title}`;
    const seo = {
        title: fullTitleBase, fullTitle: seoTitle(fullTitleBase), description, keywords: l.keywords || (c.tags || []).join(', '),
        canonical: url, robots: l.noindex || c.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1',
        image, imageAlt: c.coverAlt || c.title, type: 'article', url,
        article: { published, modified, author: c.author && c.author !== DEFAULT_AUTHOR ? c.author : SITE_NAME, section: c.title, tags: c.tags || [] },
    };
    const crumbs = [{ name: 'Home', url: `${siteUrl()}/` }, { name: 'Learn', url: `${siteUrl()}/learn` }, { name: c.title, url: courseUrl(c) }, { name: l.title, url }];
    const jsonLd = [
        {
            '@context': 'https://schema.org', '@type': 'TechArticle', '@id': `${url}#article`, mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            headline: l.title.slice(0, 110), name: l.title, description, image: [image],
            datePublished: new Date(published).toISOString(), dateModified: new Date(modified).toISOString(),
            author: authorOf(c.author), publisher: publisher(), inLanguage: 'en', wordCount: words, timeRequired: `PT${Math.max(1, Math.round(words / 200))}M`,
            isPartOf: { '@type': 'Course', name: c.title, url: courseUrl(c) },
            ...(l.section ? { articleSection: l.section } : {}), ...(seo.keywords ? { keywords: seo.keywords } : {}),
            proficiencyLevel: c.level,
        },
        breadcrumbLd(crumbs),
    ];
    if (l.faqs?.length) {
        jsonLd.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: l.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: stripInline(f.a) } })) });
    }
    return {
        lesson: { title: l.title, slug: l.slug, section: l.section || '', description, readTime: l.readTime || readTimeFor(words), content, faqs: l.faqs || [], datePublished: published, modifiedAt: modified, noindex: Boolean(l.noindex) },
        toc: content.filter((b) => b.type === 'heading').map((b) => ({ id: b.id, text: stripInline(b.text) })),
        course: { title: c.title, slug: c.slug, level: c.level, author: c.author || DEFAULT_AUTHOR },
        sections: groupSections(lessons), prev, next, position: idx + 1, total: lessons.length, seo, jsonLd, breadcrumbs: crumbs,
    };
};

// ---------- HTML for crawlers (JavaScript off) ----------

const crumbHtml = (items) => `<nav aria-label="Breadcrumb">${items.map((b, i) => (b.href ? `<a href="${escapeHtml(b.href)}">${escapeHtml(b.name)}</a>` : escapeHtml(b.name)) + (i < items.length - 1 ? ' › ' : '')).join('')}</nav>`;

export const learnIndexHtml = ({ courses }) => `
<section class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Learn' }])}
  <h1>Free tutorials for new technologies</h1>
  <p>Step-by-step courses with clear explanations and working code examples.</p>
  <ul>${courses.map((c) => `<li><h2><a href="/learn/${escapeHtml(c.slug)}">${escapeHtml(c.title)}</a></h2><p>${escapeHtml(stripInline(c.summary))}</p><p class="meta">${escapeHtml(c.level)} · ${c.lessonCount} lessons</p></li>`).join('')}</ul>
</section>`;

export const courseHtml = (v) => `
<section class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Learn', href: '/learn' }, { name: v.course.title }])}
  <h1>${escapeHtml(v.course.title)}</h1>
  <p>${escapeHtml(v.course.description)}</p>
  <p class="meta">${escapeHtml(v.course.level)} · ${v.lessonCount} lessons</p>
  ${v.sections.map((s) => `${s.title ? `<h2>${escapeHtml(s.title)}</h2>` : '<h2>Lessons</h2>'}<ol>${s.lessons.map((l) => `<li><a href="/learn/${escapeHtml(v.course.slug)}/${escapeHtml(l.slug)}">${escapeHtml(l.title)}</a>${l.description ? ` - ${escapeHtml(stripInline(l.description))}` : ''}</li>`).join('')}</ol>`).join('')}
</section>`;

export const lessonHtml = (v) => `
<article class="ssr-article" itemscope itemtype="https://schema.org/TechArticle">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Learn', href: '/learn' }, { name: v.course.title, href: `/learn/${v.course.slug}` }, { name: v.lesson.title }])}
  <h1 itemprop="headline">${escapeHtml(v.lesson.title)}</h1>
  <p class="meta">${escapeHtml(v.course.title)}${v.lesson.section ? ` · ${escapeHtml(v.lesson.section)}` : ''} · ${escapeHtml(v.lesson.readTime)} · Updated <time datetime="${new Date(v.lesson.modifiedAt).toISOString()}">${new Date(v.lesson.modifiedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</time></p>
  ${v.toc.length > 2 ? `<nav aria-label="On this page"><h2>On this page</h2><ol>${v.toc.map((t) => `<li><a href="#${escapeHtml(t.id)}">${escapeHtml(t.text)}</a></li>`).join('')}</ol></nav>` : ''}
  <div itemprop="articleBody">${blocksToHtml(v.lesson.content)}</div>
  ${v.lesson.faqs.length ? `<section><h2>Frequently asked questions</h2>${v.lesson.faqs.map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${inlineHtml(f.a)}</p>`).join('')}</section>` : ''}
  <nav aria-label="Lesson navigation">${v.prev ? `<a href="/learn/${escapeHtml(v.course.slug)}/${escapeHtml(v.prev.slug)}" rel="prev">← ${escapeHtml(v.prev.title)}</a> ` : ''}${v.next ? `<a href="/learn/${escapeHtml(v.course.slug)}/${escapeHtml(v.next.slug)}" rel="next">${escapeHtml(v.next.title)} →</a>` : ''}</nav>
  <aside><h2>${escapeHtml(v.course.title)} - all lessons</h2>${v.sections.map((s) => `${s.title ? `<h3>${escapeHtml(s.title)}</h3>` : ''}<ul>${s.lessons.map((l) => `<li><a href="/learn/${escapeHtml(v.course.slug)}/${escapeHtml(l.slug)}">${escapeHtml(l.title)}</a></li>`).join('')}</ul>`).join('')}</aside>
</article>`;

export const learnIndexJsonLd = (courses) => [
    {
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Learn new technologies', url: `${siteUrl()}/learn`, inLanguage: 'en',
        mainEntity: { '@type': 'ItemList', itemListElement: courses.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteUrl()}/learn/${c.slug}`, name: c.title })) },
    },
    breadcrumbLd([{ name: 'Home', url: `${siteUrl()}/` }, { name: 'Learn', url: `${siteUrl()}/learn` }]),
];

export { slugify };
