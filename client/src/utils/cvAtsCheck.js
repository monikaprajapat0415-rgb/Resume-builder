import { cvToText } from './cvModel'

// CV-specific ATS check. Runs in the browser on the current CV text, so it is instant, free and updates as the user edits.
// It scores structure, content and keyword coverage. It is a guide, not a guarantee of how any real ATS will rate a CV.
const STOP = new Set('a an and are as at be but by for from has have in into is it its of on or our that the their this to we will with you your who what when where which can may must should would could also etc such than then them they these those been being were was not no any all more most other over per via within while using use used work works working experience experienced years year ability able strong good great team role job position candidate required requirements responsibilities preferred plus including include includes looking seeking join company'.split(' '))
const ACTION = new Set('built developed designed led managed created implemented delivered improved reduced increased launched optimized automated analyzed collaborated coordinated maintained deployed engineered established migrated integrated owned drove streamlined mentored trained resolved tested wrote supported organized planned executed presented achieved conducted contributed configured debugged documented produced researched scaled secured simplified shipped handled assisted prepared monitored administered applied enhanced performed participated spearheaded refactored extended initiated generated evaluated'.split(' '))

export const extractKeywords = (jd, max = 24) => {
  const words = String(jd || '').toLowerCase().replace(/[^a-z0-9+#.\s/-]/g, ' ').split(/\s+/).map((w) => w.replace(/^[.\-/]+|[.\-/]+$/g, '')).filter(Boolean)
  const counts = new Map()
  words.forEach((w) => { if (w.length > 1 && !STOP.has(w) && !/^\d+$/.test(w)) counts.set(w, (counts.get(w) || 0) + 1) })
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).slice(0, max).map(([w]) => w)
}

const firstWord = (b) => String(b).trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '')

export const checkCv = ({ cv, personal = {}, target = {}, level = 'fresher' }) => {
  const text = cvToText(cv, personal, level)
  const lower = text.toLowerCase()
  const checks = [] // { group, label, ok, points, max, tip }
  const add = (group, label, ok, max, tip, partial) => checks.push({ group, label, ok: partial ?? ok, pass: !!ok, points: Math.round(max * (partial ?? (ok ? 1 : 0))), max, tip })

  // --- structure
  add('Structure', 'Name and email present', !!personal.full_name && !!personal.email, 8, 'Add your full name and email so recruiters can reach you.')
  add('Structure', 'Phone number present', !!personal.phone, 4, 'Add a phone number.')
  add('Structure', 'Location present', !!personal.location, 3, 'Add your city/country: many ATS filter by location.')
  add('Structure', 'LinkedIn or portfolio link', !!(personal.linkedin || personal.website), 3, 'Add a LinkedIn or portfolio URL if you have one.')
  add('Structure', 'Education section', (cv.education || []).length > 0, 6, 'Add your education.')
  add('Structure', level === 'fresher' ? 'Projects or internships' : 'Work experience', level === 'fresher' ? ((cv.projects || []).length + (cv.internships || []).length + (cv.experience || []).length) > 0 : (cv.experience || []).length > 0, 10, level === 'fresher' ? 'Add at least one project or internship.' : 'Add your work experience.')
  add('Structure', 'Skills section', (cv.skills || []).length >= 4, 8, 'List at least 4 relevant skills.', Math.min(1, (cv.skills || []).length / 4))

  // --- content
  const summaryWords = String(cv.professional_summary || '').trim().split(/\s+/).filter(Boolean).length
  add('Content', 'Professional summary (25-80 words)', summaryWords >= 25 && summaryWords <= 80, 8, summaryWords === 0 ? 'Add a short professional summary.' : summaryWords < 25 ? 'Your summary is short: aim for 2-4 sentences (25-80 words).' : 'Your summary is long: trim it to 2-4 sentences.', summaryWords === 0 ? 0 : summaryWords >= 25 && summaryWords <= 80 ? 1 : 0.5)
  const bullets = [...(cv.experience || []), ...(cv.internships || [])].flatMap((e) => e.responsibilities || []).concat((cv.projects || []).flatMap((p) => p.achievements || []))
  const withAction = bullets.filter((b) => ACTION.has(firstWord(b)))
  if (bullets.length) add('Content', 'Bullets start with action verbs', withAction.length / bullets.length >= 0.7, 8, 'Start bullet points with strong verbs such as Built, Led, Improved, Delivered.', Math.min(1, withAction.length / bullets.length / 0.7))
  if (bullets.length) {
    const long = bullets.filter((b) => b.split(/\s+/).length > 30).length
    add('Content', 'Bullets are concise (under 30 words)', long === 0, 5, `${long} bullet(s) are over 30 words. Split or shorten them.`, long === 0 ? 1 : Math.max(0, 1 - long / bullets.length))
    const withNum = bullets.filter((b) => /\d/.test(b)).length
    add('Content', 'Some results include numbers', withNum > 0, 5, 'Where true, add real numbers (%, users, time saved). Never invent them.')
  }
  const dateVals = [...(cv.experience || []), ...(cv.internships || [])].flatMap((e) => [e.start_date, e.end_date]).filter((d) => d && d !== 'Present')
  const fmts = new Set(dateVals.map((d) => (/^[A-Za-z]{3} \d{4}$/.test(d) ? 'mon' : /^\d{4}$/.test(d) ? 'yr' : 'other')))
  add('Content', 'Consistent date format', fmts.size <= 1, 4, 'Use one date format throughout (e.g. Jan 2022).')
  const words = text.split(/\s+/).filter(Boolean).length
  const lenOk = level === 'fresher' ? words <= 650 : words <= 950
  add('Content', 'Sensible length', lenOk, 4, 'This CV is long. Keep it to what is relevant (1-2 pages).')

  // --- keywords
  const keywords = extractKeywords(target.job_description)
  let matched = [], missing = []
  if (keywords.length) {
    const present = (k) => new RegExp(`(^|[^a-z0-9])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`).test(lower)
    keywords.forEach((k) => (present(k) ? matched : missing).push(k))
    const ratio = matched.length / keywords.length
    add('Keywords', 'Job description keywords found in CV', ratio >= 0.6, 24, 'Add keywords you genuinely have (skills, tools, titles) from the job post.', Math.min(1, ratio / 0.6))
  }
  const titleOk = !!target.job_title && lower.includes(String(target.job_title).toLowerCase().split(/\s+/)[0])
  if (target.job_title) add('Keywords', 'Target job title appears in CV', titleOk, 6, `Mention "${target.job_title}" (or your closest real title) in your summary.`)

  const max = checks.reduce((s, c) => s + c.max, 0)
  const got = checks.reduce((s, c) => s + c.points, 0)
  const score = max ? Math.round((got / max) * 100) : 0
  return { score, checks, matched, missing, hasJd: keywords.length > 0 }
}
