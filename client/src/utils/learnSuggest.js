// Turns "missing keywords" from the job matcher into links to free lessons and roadmaps on this site.
// Only published courses and roadmaps are ever returned by the API, so Admin > Learn / Roadmaps (publish switches) controls what can appear.
// It matches wording only. A course teaches a topic; it does not make the skill true for a resume, and the page says so.
import { keyOf } from './jdMatch'

const toks = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9+#\s]/g, ' ').split(/\s+/).filter((w) => w.length > 1).map(keyOf)

const index = (items, kind) => {
  const rows = items.map((it) => ({ ...it, kind, title: it.title, own: new Set(toks([it.title, it.topic, ...(it.aliases || [])].join(' '))), all: new Set(toks([it.title, it.topic, it.summary, ...(it.aliases || [])].join(' '))) }))
  // words that appear in a third or more of the items say nothing (e.g. "development", "free"), so ignore them
  const df = new Map()
  rows.forEach((r) => r.all.forEach((w) => df.set(w, (df.get(w) || 0) + 1)))
  const common = new Set([...df].filter(([, n]) => n >= Math.max(4, rows.length / 3)).map(([w]) => w))
  return { rows, common }
}

export const suggestLearning = (missing, courses = [], roadmaps = [], max = 6) => {
  const ci = index(courses, 'course'), ri = index(roadmaps, 'roadmap')
  const hits = new Map()
  for (const m of missing) {
    const parts = toks(m.label)
    if (!parts.length) continue
    for (const { rows, common } of [ci, ri]) {
      for (const r of rows) {
        const ok = parts.length > 1 ? parts.every((p) => r.all.has(p)) : !common.has(parts[0]) && r.all.has(parts[0])
        if (!ok) continue
        const key = `${r.kind}:${r.slug}`
        const cur = hits.get(key) || { kind: r.kind, slug: r.slug, title: r.title, level: r.level || '', score: 0, terms: [] }
        cur.score += parts.some((p) => r.own.has(p)) ? 3 : 1
        if (!cur.terms.includes(m.label)) cur.terms.push(m.label)
        hits.set(key, cur)
      }
    }
  }
  const all = [...hits.values()].sort((a, b) => b.score - a.score || b.terms.length - a.terms.length)
  return { courses: all.filter((h) => h.kind === 'course').slice(0, max), roadmaps: all.filter((h) => h.kind === 'roadmap').slice(0, 3) }
}
