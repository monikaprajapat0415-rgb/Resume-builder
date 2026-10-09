import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { escapeHtml, safeJson, siteUrl, absUrl } from './blogSeo.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const DIST = () => process.env.CLIENT_DIST || path.resolve(here, '../../client/dist');

let cache = { at: 0, mtime: 0, html: null };

// The built client's index.html. Re-read when it changes on disk (a new `npm run build`).
export const loadTemplate = () => {
    const file = path.join(DIST(), 'index.html');
    try {
        if (cache.html && Date.now() - cache.at < 30000) return cache.html;
        const st = fs.statSync(file);
        if (!cache.html || st.mtimeMs !== cache.mtime) cache = { at: Date.now(), mtime: st.mtimeMs, html: fs.readFileSync(file, 'utf8') };
        else cache.at = Date.now();
        return cache.html;
    } catch {
        return null; // client not built on this machine
    }
};

const metaRe = (attr, name) => new RegExp(`<meta\\s+${attr}="${name.replace(/[.:]/g, '\\$&')}"\\s+content="[^"]*"\\s*/?>`, 'i');
const setMeta = (html, attr, name, value) => {
    const tag = `<meta ${attr}="${name}" content="${escapeHtml(value)}">`;
    const re = metaRe(attr, name);
    return re.test(html) ? html.replace(re, () => tag) : html.replace('</head>', () => `    ${tag}\n  </head>`);
};

const STYLE = `<style>
.ssr-article{max-width:42rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#334155;line-height:1.65}
.ssr-article h1{font-size:2rem;line-height:1.2;color:#1e293b}.ssr-article h2{font-size:1.4rem;color:#1e293b;margin-top:2rem}
.ssr-article img{max-width:100%;height:auto}.ssr-article a{color:#16a34a}.ssr-article .meta{color:#94a3b8;font-size:.85rem}
</style>`;

/**
 * Takes the built index.html and returns it with this page's own title, description,
 * canonical, social tags, structured data and readable body content filled in - i.e.
 * what search engines and AI crawlers (which mostly do not run JavaScript) will read.
 * React replaces the #root content as soon as the app loads.
 */
export const renderShell = (template, page) => {
    let html = template;
    const full = page.fullTitle;
    html = html.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${escapeHtml(full)}</title>`);
    html = setMeta(html, 'name', 'description', page.description);
    if (page.keywords) html = setMeta(html, 'name', 'keywords', page.keywords);
    html = setMeta(html, 'name', 'robots', page.robots || 'index, follow');
    const canon = `<link rel="canonical" href="${escapeHtml(page.canonical)}">`;
    html = /<link\s+rel="canonical"[^>]*>/i.test(html) ? html.replace(/<link\s+rel="canonical"[^>]*>/i, () => canon) : html.replace('</head>', () => `    ${canon}\n  </head>`);

    const image = page.image || `${siteUrl()}/og-image.png`;
    html = setMeta(html, 'property', 'og:title', full);
    html = setMeta(html, 'property', 'og:description', page.description);
    html = setMeta(html, 'property', 'og:type', page.type || 'website');
    html = setMeta(html, 'property', 'og:url', page.canonical);
    html = setMeta(html, 'property', 'og:image', image);
    html = setMeta(html, 'name', 'twitter:title', full);
    html = setMeta(html, 'name', 'twitter:description', page.description);
    html = setMeta(html, 'name', 'twitter:image', image);

    const extra = [];
    if (page.imageAlt) { extra.push(`<meta property="og:image:alt" content="${escapeHtml(page.imageAlt)}">`, `<meta name="twitter:image:alt" content="${escapeHtml(page.imageAlt)}">`); }
    const a = page.article;
    if (a) {
        if (a.published) extra.push(`<meta property="article:published_time" content="${new Date(a.published).toISOString()}">`);
        if (a.modified) extra.push(`<meta property="article:modified_time" content="${new Date(a.modified).toISOString()}">`);
        if (a.author) extra.push(`<meta property="article:author" content="${escapeHtml(a.author)}">`);
        if (a.section) extra.push(`<meta property="article:section" content="${escapeHtml(a.section)}">`);
        (a.tags || []).forEach((t) => extra.push(`<meta property="article:tag" content="${escapeHtml(t)}">`));
    }
    extra.push(`<link rel="alternate" type="application/rss+xml" title="Prime Resume AI blog" href="${siteUrl()}/blog/rss.xml">`);
    (page.jsonLd || []).forEach((d) => extra.push(`<script type="application/ld+json" data-seo-ssr="1">${safeJson(d)}</script>`));
    extra.push(STYLE);
    html = html.replace('</head>', () => `    ${extra.join('\n    ')}\n  </head>`);

    html = html.replace(/<div id="root">\s*<\/div>/i, () => `<div id="root">${page.body || ''}</div>`);
    return html;
};

export { absUrl };
