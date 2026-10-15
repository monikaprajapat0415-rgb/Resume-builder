// Resume <-> job description keyword matcher. Runs entirely in the browser (nothing is uploaded).
// It compares wording, so it shows what a keyword scanner would see: it cannot judge quality or truthfulness.
const STOP = new Set('a an and are as at be but by for from has have in into is it its of on or our that the their this to we will with you your who what when where which can may must should would could also etc such than then them they these those been being were was not no any all more most other over per via within while using use used work works working experience experienced years year ability able strong good great team role job position candidate required requirements responsibilities preferred plus including include includes looking seeking join company about across around both each every few new own same so some very well like need needs needed help helps ensure ensuring day days time part full based related relevant knowledge understanding skills skill excellent proven demonstrated opportunity opportunities benefits apply us if how what why do does done make makes making get gets getting high highly able etc build built building hiring hire hired essential tools tool responsible ideal successful environment fast paced dynamic passionate learn grow growth impact drive driven seeking wanted desired nice bonus add added adding provide provides providing daily weekly annual salary location remote hybrid onsite office'.split(/\s+/))

const clean = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9+#.\s/-]/g, ' ')
const tokens = (s) => clean(s).split(/\s+/).map((w) => w.replace(/^[.\-/]+|[.\-/]+$/g, '')).filter(Boolean)

// "Node.js", "NodeJS" and "node" should all count as the same thing; so should "API" / "APIs".
export const keyOf = (w) => {
  let k = String(w).toLowerCase().replace(/[.\-/]/g, '')
  if (k.length > 4 && k.endsWith('js')) k = k.slice(0, -2)
  if (k.length > 3 && k.endsWith('s') && !k.endsWith('ss')) k = k.slice(0, -1)
  return k
}

export const extractJdTerms = (jd, max = 30) => {
  const words = tokens(jd)
  const uni = new Map()
  words.forEach((w) => { if (w.length > 1 && !STOP.has(w) && !/^\d+$/.test(w)) { const k = keyOf(w); const cur = uni.get(k) || { label: w, n: 0 }; cur.n++; uni.set(k, cur) } })
  // two-word phrases that repeat in the job post (e.g. "project management")
  const bi = new Map()
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1]
    if (STOP.has(a) || STOP.has(b) || a.length < 3 || b.length < 3 || /^\d+$/.test(a + b)) continue
    const key = `${keyOf(a)} ${keyOf(b)}`
    const cur = bi.get(key) || { label: `${a} ${b}`, n: 0, parts: [keyOf(a), keyOf(b)] }
    cur.n++; bi.set(key, cur)
  }
  const phrases = [...bi.values()].filter((p) => p.n >= 2)
  const phraseParts = new Set(phrases.flatMap((p) => p.parts))
  const list = [
    ...phrases.map((p) => ({ label: p.label, kind: 'phrase', weight: p.n * 2, parts: p.parts })),
    ...[...uni.entries()].filter(([k]) => !phraseParts.has(k)).map(([k, v]) => ({ label: v.label, kind: 'word', key: k, weight: v.n })),
  ]
  return list.sort((a, b) => b.weight - a.weight || b.label.length - a.label.length).slice(0, max)
}

const countIn = (resumeKeys, resumeJoined, term) => {
  if (term.kind === 'phrase') {
    const re = new RegExp(`\\b${term.parts[0]}\\w*\\s+${term.parts[1]}`, 'g')
    return (resumeJoined.match(re) || []).length
  }
  return resumeKeys.filter((k) => k === term.key).length
}

export const matchResumeToJd = (resumeText, jdText) => {
  const terms = extractJdTerms(jdText)
  const rWords = tokens(resumeText)
  const rKeys = rWords.map(keyOf)
  const joined = rWords.map(keyOf).join(' ')
  const strong = [], weak = [], missing = []
  let got = 0, total = 0
  terms.forEach((t) => {
    const n = countIn(rKeys, joined, t)
    total += t.weight
    if (n >= 2) { strong.push({ ...t, n }); got += t.weight } else if (n === 1) { weak.push({ ...t, n }); got += t.weight * 0.6 } else missing.push(t)
  })
  const score = total ? Math.round((got / total) * 100) : 0
  return { score, strong, weak, missing, termCount: terms.length, resumeWords: rWords.length, jdWords: tokens(jdText).length }
}
