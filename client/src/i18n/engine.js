// Translation engine with no React in it, so utils (CV PDF / Word / text) can use it too.
// English text is the key: anything that has no entry is shown as written, so a missing translation is never blank.
import es from './dict/es'
import fr from './dict/fr'
import pt from './dict/pt'
import ar from './dict/ar'
import { COUNTRIES, DEFAULT_LOCALE, LANGS, findCountry } from './countries'

const DICTS = { es, fr, pt, ar }
const KEY = 'prime_locale'
const subs = new Set()

const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null')
    const c = v && findCountry(v.country)
    if (c && LANGS[v.lang] && c.langs.includes(v.lang)) return { country: c.code, lang: v.lang }
  } catch { /* storage can be blocked */ }
  return { ...DEFAULT_LOCALE }
}

let current = typeof window === 'undefined' ? { ...DEFAULT_LOCALE } : read()

export const getLocale = () => current
export const getLang = () => current.lang
export const isRtl = (lang = current.lang) => LANGS[lang]?.dir === 'rtl'
// BCP 47 tag for Intl (dates, numbers), e.g. "es-MX" or "en-GB".
export const intlTag = (l = current) => `${l.lang}-${l.country}`

export const setLocale = (country, lang) => {
  const c = findCountry(country) || findCountry(DEFAULT_LOCALE.country)
  const l = c.langs.includes(lang) ? lang : c.langs[0]
  current = { country: c.code, lang: l }
  try { localStorage.setItem(KEY, JSON.stringify(current)) } catch { /* ignore */ }
  subs.forEach((fn) => fn(current))
}
export const subscribe = (fn) => { subs.add(fn); return () => subs.delete(fn) }

// {name} placeholders are filled from vars.
const fill = (s, vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m)) : s)

export const tr = (text, vars, lang = current.lang) => {
  if (text == null || text === '') return text
  const d = DICTS[lang]
  const hit = d && d[text]
  return fill(typeof hit === 'string' ? hit : text, vars)
}

// Translate a text node's value, keeping the spaces around it. Returns null when there is nothing to change.
// Entries whose key ends with "…" or has {x} are not used here; only exact strings and the PATTERNS below.
export const translateLoose = (raw, lang = current.lang) => {
  const d = DICTS[lang]
  if (!d || !raw) return null
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(raw)
  const core = m[2]
  if (!core) return null
  const hit = d[core]
  if (typeof hit === 'string') return m[1] + hit + m[3]
  const pats = d.__patterns
  if (pats) for (const [re, out] of pats) { const x = re.exec(core); if (x) return m[1] + core.replace(re, out) + m[3] }
  return null
}

export const countriesList = COUNTRIES
export const dictFor = (lang) => DICTS[lang]
