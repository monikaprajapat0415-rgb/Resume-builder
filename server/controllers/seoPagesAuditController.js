import { siteUrl } from '../utils/blogSeo.js';
import { getToolSettings } from './toolSettingsController.js';
import { STATIC_ROUTES } from '../utils/staticSitemapRoutes.js';
import { hiddenCareerPaths, careerToolPaths } from '../utils/staticPages.js';

// Admin > SEO: fetches each public page from this server the way a crawler without JavaScript would, and reports what
// it finds. Pages the server does not render itself (nginx serves the plain app shell for them) show "not server-rendered".
const EXTRA = ['/roadmaps', '/examples', '/jobs/interview-questions', '/jobs/salaries', '/jobs/company-reviews'];
const PATHS = [...new Set([...STATIC_ROUTES.filter((p) => !p.startsWith('/templates/') && !p.startsWith('/examples/')), '/templates/classic-resume-template', '/examples/software-developer-resume-example', ...EXTRA])];

const grab = (html, re) => (html.match(re) || [])[1] || '';
const words = (t) => (t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ').match(/\S+/g) || []).length;

const checkOne = async (base, p, inSitemap) => {
    const row = { path: p, status: 0, title: '', titleLen: 0, descLen: 0, h1: 0, words: 0, jsonLd: 0, canonicalOk: false, inSitemap: inSitemap(p), rendered: false, noindex: false, issues: [] };
    try {
        const r = await fetch(`${base}${p}`, { headers: { Accept: 'text/html', 'User-Agent': 'seo-self-check' }, redirect: 'manual' });
        row.status = r.status;
        const html = await r.text();
        row.title = grab(html, /<title>([\s\S]*?)<\/title>/i).replace(/&amp;/g, '&').trim();
        row.titleLen = row.title.length;
        row.descLen = grab(html, /<meta\s+name="description"\s+content="([^"]*)"/i).length;
        const canon = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]*)"/gi)];
        row.canonicalOk = canon.length === 1 && canon[0][1] === `${siteUrl()}${p === '/' ? '/' : p}`;
        const root = (html.split('<div id="root">')[1] || '').split('</body>')[0];
        row.h1 = (root.match(/<h1[\s>]/gi) || []).length;
        row.words = words(root);
        const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
        row.jsonLd = ld.length;
        let badLd = 0; ld.forEach((m) => { try { JSON.parse(m[1]); } catch { badLd++; } });
        row.rendered = row.words >= 30;
        if (r.status === 404 && p !== '/nope') row.issues.push('Client-rendered only: the server sends no page text for this path (crawlers without JavaScript see an empty shell)');
        else if (r.status !== 200) row.issues.push(`HTTP ${r.status}`);
        else {
            if (!row.rendered) row.issues.push('Not server-rendered: a crawler without JavaScript sees an empty page');
            if (row.titleLen < 15 || row.titleLen > 65) row.issues.push(`Title is ${row.titleLen} characters`);
            if (row.descLen < 70 || row.descLen > 160) row.issues.push(`Description is ${row.descLen} characters`);
            if (!row.canonicalOk) row.issues.push('Canonical missing, repeated or different from the URL');
            if (row.rendered && row.h1 !== 1) row.issues.push(`${row.h1} h1 headings (should be 1)`);
            if (badLd) row.issues.push(`${badLd} structured-data block(s) are not valid JSON`);
            if (/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) row.noindex = true;
            else if (!row.inSitemap) row.issues.push('Not in the sitemap');
        }
    } catch (e) { row.issues.push(`Could not fetch: ${e.message}`); }
    return row;
};

// GET /api/admin/seo-pages
export const getSeoPagesAudit = async (req, res) => {
    try {
        const base = `http://127.0.0.1:${process.env.PORT || 3000}`;
        const toolsOn = await getToolSettings();
        const hidden = hiddenCareerPaths(toolsOn);
        const PATHS_NOW = [...new Set([...PATHS, '/tools', ...careerToolPaths()])].filter((p) => (toolsOn.imageEnhancer || p !== '/products/image-enhancer') && !hidden.includes(p));
        let sitemap = '';
        try { sitemap = await (await fetch(`${base}/sitemap.xml`, { headers: { Accept: 'application/xml' } })).text(); } catch { /* reported per page */ }
        const locs = new Set([...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1].replace(/\/$/, '')));
        const inSitemap = (p) => locs.has(`${siteUrl()}${p === '/' ? '' : p}`);
        const rows = [];
        for (let i = 0; i < PATHS_NOW.length; i += 4) rows.push(...await Promise.all(PATHS_NOW.slice(i, i + 4).map((p) => checkOne(base, p, inSitemap))));
        return res.status(200).json({ checkedAt: new Date().toISOString(), rows, summary: { total: rows.length, ok: rows.filter((r) => !r.issues.length).length, notRendered: rows.filter((r) => !r.rendered).length } });
    } catch (e) { return res.status(500).json({ message: e.message }); }
};
