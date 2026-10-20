// Search for roadmaps by job title or technology ("fullstack", "sql dev", "react").
// Words are matched as pieces of the text, and spaces/hyphens are ignored so "full stack" = "full-stack" = "fullstack".
const compact = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9+#.]/g, '');
const words = (t) => String(t || '').toLowerCase().split(/[^a-z0-9+#.]+/).filter(Boolean);

// small synonyms so "dev", "developer", "engineer" don't block a match
const SYN = { dev: 'developer', developers: 'developer', engineer: 'developer', engineering: 'developer', js: 'javascript', node: 'nodejs', 'node.js': 'nodejs', ml: 'machine learning', ai: 'machine learning', db: 'database', k8s: 'kubernetes', postgres: 'postgresql', dotnet: '.net', 'c#': 'csharp' };
const norm = (w) => SYN[w] || w;

export const scoreRoadmap = (r, q) => {
    const tokens = words(q).map(norm);
    if (!tokens.length) return 1;
    const title = `${r.title} ${compact(r.title)}`.toLowerCase().replace(/engineer/g, 'developer');
    const alias = (r.aliases || []).map((a) => `${a} ${compact(a)}`).join(' ').toLowerCase().replace(/engineer/g, 'developer');
    const tags = (r.tags || []).join(' ').toLowerCase();
    const body = `${r.summary || ''} ${(r.steps || []).map((s) => `${s.title} ${(s.skills || []).join(' ')}`).join(' ')}`.toLowerCase();
    const whole = compact(q);
    let score = 0;
    if (whole.length > 2 && (compact(r.title).includes(whole) || (r.aliases || []).some((a) => compact(a) === whole))) score += 20;
    for (const t of tokens) {
        const hay = [[title, 8], [alias, 7], [tags, 4], [body, 1]];
        const hit = hay.find(([h]) => h.includes(t) || h.includes(compact(t)));
        if (!hit) return 0;                // every word must match somewhere
        score += hit[1];
    }
    return score;
};

export const searchRoadmaps = (rows, { q = '', kind = '' } = {}) => {
    const filtered = rows.filter((r) => !kind || (r.kind || 'career') === kind);
    if (!String(q).trim()) return filtered;
    return filtered.map((r) => ({ r, s: scoreRoadmap(r, q) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.r);
};
