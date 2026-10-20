import { SITE_NAME, siteUrl, escapeHtml, seoTitle } from './blogSeo.js';

const str = (v, max) => String(v ?? '').trim().slice(0, max);
// a link must go to this site (a path) or to a web address
const link = (v) => (/^(https?:\/\/[^\s]+|\/[^\s/][^\s]*)$/i.test(String(v || '').trim()) ? String(v).trim().slice(0, 500) : '');
export const RESOURCE_TYPES = ['docs', 'course', 'video', 'book', 'practice', 'tool'];
const list = (v, n, max) => (Array.isArray(v) ? v : String(v || '').split('\n')).map((x) => str(x, max)).filter(Boolean).slice(0, n);

export const cleanRoadmapFields = (b) => {
    const out = {};
    const has = (k) => b[k] !== undefined;
    if (has('summary')) out.summary = str(b.summary, 200);
    if (has('description')) out.description = str(b.description, 320);
    if (has('audience')) out.audience = str(b.audience, 60);
    if (has('badge')) out.badge = str(b.badge, 3).toUpperCase();
    if (has('kind')) out.kind = ['career', 'role', 'technology'].includes(b.kind) ? b.kind : 'career';
    if (has('aliases')) out.aliases = [...new Set(list(Array.isArray(b.aliases) ? b.aliases : String(b.aliases || '').split(/[,\n]/), 15, 40).map((t) => t.toLowerCase()))];
    if (has('tags')) out.tags = [...new Set(list(b.tags, 10, 30).map((t) => t.toLowerCase()))];
    if (has('order')) out.order = Number.isFinite(Number(b.order)) ? Math.trunc(Number(b.order)) : 0;
    if (has('published')) out.published = Boolean(b.published);
    if (has('metaTitle')) out.metaTitle = str(b.metaTitle, 120);
    if (has('keywords')) out.keywords = str(b.keywords, 300);
    if (has('noindex')) out.noindex = Boolean(b.noindex);
    if (has('faqs')) out.faqs = (Array.isArray(b.faqs) ? b.faqs : []).map((f) => ({ q: str(f?.q, 200), a: str(f?.a, 1500) })).filter((f) => f.q && f.a).slice(0, 15);
    if (has('steps')) {
        out.steps = (Array.isArray(b.steps) ? b.steps : []).map((s) => ({
            title: str(s?.title, 120),
            description: str(s?.description, 1500),
            pace: str(s?.pace, 60),
            skills: list(Array.isArray(s?.skills) ? s.skills : String(s?.skills || '').split(','), 12, 60),
            tips: list(s?.tips, 8, 300),
            links: (Array.isArray(s?.links) ? s.links : []).map((l) => ({ label: str(l?.label, 80), url: link(l?.url) })).filter((l) => l.label && l.url).slice(0, 8),
            layer: str(s?.layer, 40),
            resources: (Array.isArray(s?.resources) ? s.resources : []).map((x) => ({
                label: str(x?.label, 100), url: link(x?.url), type: RESOURCE_TYPES.includes(x?.type) ? x.type : 'docs', free: x?.free !== false,
            })).filter((x) => x.label && x.url).slice(0, 10),
        })).filter((s) => s.title).slice(0, 30);
    }
    return out;
};

// The stack end to end: the steps' skills grouped by layer, in the order the layers first appear.
export const stackOf = (steps = []) => {
    const layers = [];
    steps.forEach((s, i) => {
        if (!s.layer) return;
        let l = layers.find((x) => x.layer === s.layer);
        if (!l) layers.push(l = { layer: s.layer, skills: [], steps: [] });
        l.steps.push(i + 1);
        (s.skills || []).forEach((k) => { if (!l.skills.includes(k) && l.skills.length < 30) l.skills.push(k); });
    });
    return layers;
};

export const roadmapCard = (r) => ({
    title: r.title, slug: r.slug, summary: r.summary || r.description || '', audience: r.audience || '', badge: r.badge || '', stepCount: (r.steps || []).length,
    kind: r.kind || 'career', aliases: r.aliases || [], layers: stackOf(r.steps).map((l) => l.layer),
});

const roadmapUrl = (r) => `${siteUrl()}/roadmaps/${r.slug}`;
const breadcrumbLd = (items) => ({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
});
const absLink = (u) => (u.startsWith('/') ? siteUrl() + u : u);

export const roadmapView = (doc) => {
    const r = typeof doc.toObject === 'function' ? doc.toObject() : doc;
    const url = roadmapUrl(r);
    const description = r.description || r.summary || `A step-by-step career roadmap: ${r.title}.`;
    const image = `${siteUrl()}/og-image.png`;
    const seo = {
        title: r.metaTitle || r.title, fullTitle: seoTitle(r.metaTitle || r.title), description, keywords: r.keywords || (r.tags || []).join(', '),
        canonical: url, robots: r.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large', image, imageAlt: r.title, type: 'website', url,
    };
    const crumbs = [{ name: 'Home', url: `${siteUrl()}/` }, { name: 'Roadmaps', url: `${siteUrl()}/roadmaps` }, { name: r.title, url }];
    const jsonLd = [
        {
            '@context': 'https://schema.org', '@type': 'WebPage', '@id': url, url, name: r.title, description, inLanguage: 'en',
            isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: siteUrl() },
            mainEntity: {
                '@type': 'ItemList', name: r.title, itemListOrder: 'https://schema.org/ItemListOrderAscending', numberOfItems: (r.steps || []).length,
                itemListElement: (r.steps || []).map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.title, description: s.description || undefined })),
            },
        },
        breadcrumbLd(crumbs),
    ];
    if (r.faqs?.length) {
        jsonLd.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: r.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
    }
    return {
        roadmap: {
            title: r.title, slug: r.slug, summary: r.summary || '', description, audience: r.audience || '', badge: r.badge || '', tags: r.tags || [], kind: r.kind || 'career', aliases: r.aliases || [], stack: stackOf(r.steps),
            steps: (r.steps || []).map((s) => ({ title: s.title, description: s.description || '', pace: s.pace || '', skills: s.skills || [], tips: s.tips || [], links: s.links || [], layer: s.layer || '', resources: s.resources || [] })),
            faqs: r.faqs || [], modifiedAt: r.modifiedAt || r.updatedAt || r.createdAt,
        },
        seo, jsonLd, breadcrumbs: crumbs,
    };
};

// ---------- HTML for crawlers (JavaScript off) ----------

const crumbHtml = (items) => `<nav aria-label="Breadcrumb">${items.map((b, i) => (b.href ? `<a href="${escapeHtml(b.href)}">${escapeHtml(b.name)}</a>` : escapeHtml(b.name)) + (i < items.length - 1 ? ' › ' : '')).join('')}</nav>`;

export const roadmapIndexHtml = ({ roadmaps }) => `
<section class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Roadmaps' }])}
  <h1>Roadmaps for jobs and technologies</h1>
  <p>Step-by-step plans to move from where you are to the job you want, with the skills to learn at each stage, the whole technology stack and the best places to learn it.</p>
  ${[['role', 'Job role roadmaps'], ['technology', 'Technology roadmaps'], ['career', 'Career path roadmaps']].map(([k, h]) => { const rs = roadmaps.filter((r) => r.kind === k); return rs.length ? `<h2>${h}</h2><ul>${rs.map((r) => `<li><a href="/roadmaps/${escapeHtml(r.slug)}">${escapeHtml(r.title)}</a><p>${escapeHtml(r.summary)}</p></li>`).join('')}</ul>` : ''; }).join('')}
</section>`;

export const roadmapHtml = (v) => `
<article class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Roadmaps', href: '/roadmaps' }, { name: v.roadmap.title }])}
  <h1>${escapeHtml(v.roadmap.title)}</h1>
  <p>${escapeHtml(v.roadmap.description)}</p>
  ${v.roadmap.stack.length ? `<section><h2>The stack, end to end</h2><ul>${v.roadmap.stack.map((l) => `<li><strong>${escapeHtml(l.layer)}:</strong> ${l.skills.map(escapeHtml).join(', ')}</li>`).join('')}</ul></section>` : ''}
  <ol>${v.roadmap.steps.map((s) => `<li><h2>${escapeHtml(s.title)}</h2>${s.pace ? `<p class="meta">Suggested pace: ${escapeHtml(s.pace)}</p>` : ''}<p>${escapeHtml(s.description)}</p>${s.skills.length ? `<h3>Skills</h3><ul>${s.skills.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>` : ''}${s.tips.length ? `<h3>Tips</h3><ul>${s.tips.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>` : ''}${s.resources?.length ? `<h3>Where to learn</h3><ul>${s.resources.map((x) => `<li><a href="${escapeHtml(x.url)}" rel="noopener">${escapeHtml(x.label)}</a> (${escapeHtml(x.type)}${x.free ? ', free' : ''})</li>`).join('')}</ul>` : ''}${s.links.length ? `<p>${s.links.map((l) => `<a href="${escapeHtml(absLink(l.url))}">${escapeHtml(l.label)}</a>`).join(' · ')}</p>` : ''}</li>`).join('')}</ol>
  ${v.roadmap.faqs.length ? `<section><h2>Frequently asked questions</h2>${v.roadmap.faqs.map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`).join('')}</section>` : ''}
</article>`;

export const roadmapIndexJsonLd = (roadmaps) => [
    {
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Roadmaps for jobs and technologies', url: `${siteUrl()}/roadmaps`, inLanguage: 'en',
        mainEntity: { '@type': 'ItemList', itemListElement: roadmaps.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteUrl()}/roadmaps/${r.slug}`, name: r.title })) },
    },
    breadcrumbLd([{ name: 'Home', url: `${siteUrl()}/` }, { name: 'Roadmaps', url: `${siteUrl()}/roadmaps` }]),
];
