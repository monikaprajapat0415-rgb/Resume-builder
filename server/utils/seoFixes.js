import { stripInline } from './blogSeo.js';

// Fixes the admin can apply with one click. Each one is built only from text that is
// already in the post, so nothing is invented. Anything that needs a human (focus keyword,
// FAQ, sources, takeaways, category, URL slug) stays in the "needs you" list.

export const FIXABLE_FIELDS = ['metaTitle', 'description', 'coverAlt'];

const clean = (s = '') => stripInline(String(s)).replace(/\s+/g, ' ').trim();
const TRAIL = /[\s,;:\-–—(]+$/;
const WEAK_END = /\s(and|or|the|a|an|of|to|for|in|on|with|your|our|is|are|at|by)$/i;

// Cut to at most `max` characters at a word boundary, without a dangling connector word.
export const trimToWords = (text, max) => {
    let t = clean(text);
    if (t.length <= max) return t;
    t = t.slice(0, max + 1);
    t = t.slice(0, Math.max(t.lastIndexOf(' '), 0)).replace(TRAIL, '');
    while (WEAK_END.test(t)) t = t.replace(WEAK_END, '').replace(TRAIL, '');
    return t;
};

// Sentences from the first paragraphs, joined until the next one would pass `max`.
const sentenceSummary = (blocks, min, max) => {
    const paras = (blocks || []).filter((b) => b.type === 'paragraph').slice(0, 3).map((b) => clean(b.text)).filter(Boolean);
    const sentences = paras.join(' ').match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) || [];
    let out = '';
    for (const s of sentences) {
        if ((out ? `${out} ${s}` : s).length > max) break;
        out = out ? `${out} ${s}` : s;
    }
    if (out.length >= min) return out;
    // First sentence alone is too long, or the text is short: cut at a word boundary.
    const joined = sentences.join(' ');
    const cut = trimToWords(joined, max - 1);
    return cut.length >= min ? `${cut.replace(/[.!?]+$/, '')}…`.replace('……', '…') : '';
};

export const proposeFixes = (p) => {
    const fixes = [];
    const title = (p.metaTitle || p.title || '').trim();

    if (title.length > 60) {
        // Prefer cutting at a natural break (colon, dash, bar) when what is left still reads as a title.
        const head = title.slice(0, 61).match(/^(.{30,60}?)\s*(?:[:|–—]|\s-\s)/g)?.pop()?.replace(/\s*(?:[:|–—]|\s-\s)$/, '').trim();
        const next = head && head.length >= 30 ? head : trimToWords(title, 60);
        if (next.length >= 30 && next !== title) {
            fixes.push({ key: 'titleLen', field: 'metaTitle', label: 'Shorten the SEO title to 60 characters', before: p.metaTitle || '', after: next });
        }
    }

    const desc = (p.description || '').trim();
    if (!desc || desc.length > 160) {
        let next = '';
        if (desc.length > 160) {
            const cut = trimToWords(desc, 160);
            const sentenceEnd = cut.match(/^[\s\S]*[.!?](?=\s|$)/)?.[0];
            next = sentenceEnd && sentenceEnd.length >= 110 ? sentenceEnd : cut;
            if (next.length < 110) next = '';
        }
        if (!next) next = sentenceSummary(p.content, 110, 160);
        if (next && next !== desc) {
            fixes.push({ key: 'descLen', field: 'description', label: desc ? 'Shorten the meta description to 160 characters' : 'Write the meta description from the first paragraph', before: p.description || '', after: next });
        }
    }

    if (p.coverImage && !(p.coverAlt || '').trim() && clean(p.title)) {
        fixes.push({ key: 'cover', field: 'coverAlt', label: 'Add alt text to the cover image (uses the post title)', before: p.coverAlt || '', after: clean(p.title).slice(0, 125) });
    }
    return fixes;
};

export const fixSummary = (posts) => {
    const rows = posts.filter((p) => p.published !== false).map((p) => ({ _id: p._id, title: p.title, fixes: proposeFixes(p) })).filter((r) => r.fixes.length);
    const byKey = {};
    rows.forEach((r) => r.fixes.forEach((f) => { byKey[f.key] = byKey[f.key] || { key: f.key, label: f.label, count: 0 }; byKey[f.key].count++; }));
    return { total: rows.reduce((n, r) => n + r.fixes.length, 0), posts: rows, byKey: Object.values(byKey) };
};
