// Yoast-style content analysis for blog posts. Pure functions: the same code scores a post
// in the editor and every post in the list. `post.blocks` is the block array of the post.

export const plain = (t = '') => String(t).replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim()

const TRANSITIONS = ['however', 'therefore', 'for example', 'for instance', 'in addition', 'also', 'moreover', 'furthermore', 'because', 'as a result', 'finally', 'first', 'second', 'third', 'next', 'then', 'meanwhile', 'instead', 'but', 'so', 'although', 'while', 'similarly', 'in contrast', 'on the other hand', 'in conclusion', 'overall', 'in fact', 'besides', 'otherwise', 'consequently', 'specifically', 'for this reason', 'after that', 'before', 'once', 'since', 'unless', 'whereas', 'in short']
const IRREGULAR = 'known|shown|seen|given|taken|written|made|done|built|chosen|held|kept|sent|found|set|put|read|told|paid|sold|lost|left|began|driven|broken|spoken|hidden|drawn|grown|thrown|worn|torn|won|met|led|fed|run|bought|brought|caught|taught|thought'
const PASSIVE = new RegExp(`\\b(is|are|was|were|be|been|being|get|gets|got)\\s+(?:\\w+ly\\s+)?(\\w+ed|${IRREGULAR})\\b`, 'i')

const blockText = (b) => b.text || (b.items || []).join(' ') || ''
const sentencesOf = (s) => plain(s).split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/).map((x) => x.trim()).filter((x) => x.split(/\s+/).length >= 2)
const countWords = (s) => plain(s).split(/\s+/).filter(Boolean).length
const pct = (a, b) => (b ? (a / b) * 100 : 0)

const countPhrase = (text, kw) => {
  if (!kw) return 0
  const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
  return (text.match(new RegExp(`(^|[^a-z0-9])${esc}(?=$|[^a-z0-9])`, 'gi')) || []).length
}

export const analyzePost = (post) => {
  const blocks = (post.blocks || []).filter((b) => b && b.type !== 'image' && b.type !== 'code')
  const allBlocks = post.blocks || []
  const kw = String(post.focusKeyword || '').trim().toLowerCase()
  const low = (v) => plain(v).toLowerCase()
  const title = post.metaTitle || post.title || ''
  const description = post.description || ''
  const headings = blocks.filter((b) => b.type === 'heading')
  const paragraphs = blocks.filter((b) => b.type === 'paragraph' && plain(b.text))
  const body = blocks.map(blockText).join(' ')
  const words = countWords(body)
  const firstPara = paragraphs[0]?.text || ''
  const links = blocks.map(blockText).join(' ')
  const internalLinks = (links.match(/\]\(\//g) || []).length
  const externalLinks = (links.match(/\]\(https?:/g) || []).length
  const sources = post.sources || []
  const faqs = (post.faqs || []).filter((f) => f.q?.trim() && f.a?.trim())
  const imageAlts = [post.coverAlt, ...allBlocks.filter((b) => b.type === 'image').map((b) => b.alt)].filter(Boolean)
  const kwCount = countPhrase(low(body), kw)
  const density = kw ? pct(kwCount * kw.split(/\s+/).length, words) : 0

  const seo = [
    ['Focus keyword set', Boolean(kw), 'Add the one phrase people would search for to find this post.'],
    ['Keyword in title', kw && low(title).includes(kw), 'Use the focus keyword in the SEO title, ideally near the start.'],
    ['Keyword in meta description', kw && low(description).includes(kw), 'Mention the keyword once in the meta description.'],
    ['Keyword in first paragraph', kw && low(firstPara).includes(kw), 'Say the keyword in your opening paragraph.'],
    ['Keyword in a subheading', kw && headings.some((h) => low(h.text).includes(kw)), 'Use the keyword in at least one heading.'],
    ['Keyword in URL slug', kw && String(post.slug || '').includes(kw.replace(/\s+/g, '-')), 'Put the keyword in the URL (for new posts only; changing a live URL loses its ranking).'],
    ['Keyword in an image alt text', kw && imageAlts.some((a) => low(a).includes(kw)), 'Describe the cover or an image using the keyword where it fits naturally.'],
    [`Keyword density 0.5–2.5% (now ${density.toFixed(1)}%)`, kw && density >= 0.5 && density <= 2.5, density > 2.5 ? 'The keyword is used too often. Vary the wording.' : 'Use the keyword a few more times where natural.'],
    ['Title 30–60 characters', title.length >= 30 && title.length <= 60, 'Google cuts titles after about 60 characters.'],
    ['Meta description 110–160 characters', description.length >= 110 && description.length <= 160, 'Aim for 110–160 characters so Google shows all of it.'],
    ['At least 600 words', words >= 600, 'Longer, useful posts rank better. Add examples or steps.'],
    ['3+ subheadings', headings.length >= 3, 'Break the post up with at least 3 headings.'],
    ['Internal link to another page', internalLinks > 0, 'Link to one of your own pages, e.g. [ATS checker](/features/ats-checker).'],
    ['External link to a source', externalLinks > 0 || sources.some((x) => x.url?.trim()), 'Link to a trusted outside source.'],
    ['Cover image with alt text', Boolean(post.coverImage && String(post.coverAlt || '').trim()), 'Add a cover image and describe it in the alt text.'],
    ['Key takeaways (helps AI answers)', (post.takeaways || []).some((t) => t.trim()), 'Add 3–5 short key takeaways.'],
    ['FAQ with 2+ questions (helps AI answers)', faqs.length >= 2, 'Add at least 2 questions with answers.'],
    ['Sources cited (helps AI trust)', sources.some((x) => x.url?.trim()), 'Cite where your facts come from.'],
    ['Category chosen', Boolean(post.category), 'Pick a category.'],
  ].map(([label, ok, tip]) => ({ label, ok: Boolean(ok), tip }))

  // ---- readability ----
  const sentences = blocks.filter((b) => b.type === 'paragraph' || b.type === 'list' || b.type === 'olist').flatMap((b) => (b.items ? b.items : [b.text]).flatMap(sentencesOf))
  const n = sentences.length
  const longSent = sentences.filter((s) => countWords(s) > 20).length
  const passive = sentences.filter((s) => PASSIVE.test(s)).length
  const withTransition = sentences.filter((s) => { const l = ` ${s.toLowerCase()} `; return TRANSITIONS.some((t) => l.includes(` ${t} `) || l.includes(` ${t},`)) }).length
  const longPara = paragraphs.filter((p) => countWords(p.text) > 150).length
  let sameStart = false
  for (let i = 2; i < sentences.length; i++) {
    const w = (s) => s.split(/\s+/)[0].toLowerCase()
    if (w(sentences[i]) === w(sentences[i - 1]) && w(sentences[i]) === w(sentences[i - 2])) { sameStart = true; break }
  }
  let run = 0, longestRun = 0
  blocks.forEach((b) => { if (b.type === 'heading') run = 0; else { run += countWords(blockText(b)); longestRun = Math.max(longestRun, run) } })
  const noText = n < 3
  const readability = [
    [`Short sentences: ${pct(longSent, n).toFixed(0)}% are over 20 words (max 25%)`, noText || pct(longSent, n) <= 25, 'Split long sentences in two.'],
    [`Short paragraphs: ${longPara} over 150 words`, longPara === 0, 'Break up paragraphs of more than 150 words.'],
    [`Active voice: ${pct(passive, n).toFixed(0)}% passive (max 10%)`, noText || pct(passive, n) <= 10, 'Say who does the action: "we tested it" instead of "it was tested".'],
    [`Transition words: ${pct(withTransition, n).toFixed(0)}% of sentences (aim for 30%+)`, noText || pct(withTransition, n) >= 30, 'Use words like "however", "for example" and "because" to connect ideas.'],
    ['Varied sentence starts', !sameStart, 'Three sentences in a row begin with the same word. Change one.'],
    [`Heading at least every 300 words (longest gap ${longestRun})`, longestRun <= 300, 'Add a heading to break up the long stretch of text.'],
  ].map(([label, ok, tip]) => ({ label, ok: Boolean(ok), tip }))

  const share = (list) => Math.round((list.filter((c) => c.ok).length / list.length) * 100)
  return { seo, readability, words, density, seoScore: share(seo), readScore: share(readability), sentences: n }
}
