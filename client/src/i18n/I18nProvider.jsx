import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { getLocale, setLocale, subscribe, tr, isRtl, intlTag, translateLoose } from './engine'
import { findCountry } from './countries'

const Ctx = createContext(null)

// Elements (and everything inside them) whose text is written by people, not by us, are never translated:
// resume and CV pages, articles, job ads, inputs. Mark more with data-no-i18n.
const SKIP = '[data-no-i18n], textarea, input, script, style, code, pre, [contenteditable="true"], svg text'
const ATTRS = ['placeholder', 'title', 'aria-label', 'alt']
const origText = new WeakMap()
const origAttr = new WeakMap()

const skipNode = (n) => {
  const el = n.nodeType === 1 ? n : n.parentElement
  return !el || !!el.closest(SKIP)
}

function applyText(node, lang) {
  if (skipNode(node)) return
  const cur = node.nodeValue
  let base = origText.get(node)
  // If React changed the text since we translated it, the new value is the new original.
  if (base === undefined || (base.shown !== cur)) base = { orig: cur, shown: cur }
  const out = lang === 'en' ? null : translateLoose(base.orig, lang)
  const next = out ?? base.orig
  if (next !== cur) node.nodeValue = next
  origText.set(node, { orig: base.orig, shown: next })
}

function applyAttrs(el, lang) {
  if (el.nodeType !== 1 || el.closest(SKIP.replace('textarea, input, ', ''))) return
  let rec = origAttr.get(el)
  for (const a of ATTRS) {
    if (!el.hasAttribute(a)) continue
    const cur = el.getAttribute(a)
    if (!rec) { rec = {}; origAttr.set(el, rec) }
    let r = rec[a]
    if (!r || r.shown !== cur) r = { orig: cur, shown: cur }
    const out = lang === 'en' ? null : translateLoose(r.orig, lang)
    const next = out ?? r.orig
    if (next !== cur) el.setAttribute(a, next)
    rec[a] = { orig: r.orig, shown: next }
  }
}

function walk(root, lang) {
  if (root.nodeType === 3) { applyText(root, lang); return }
  if (root.nodeType !== 1) return
  if (root.closest && root.closest('[data-no-i18n], script, style, code, pre')) return
  applyAttrs(root, lang)
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => (n.nodeType === 1 && n.matches('[data-no-i18n], script, style, code, pre') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  })
  let n = tw.nextNode()
  while (n) { if (n.nodeType === 3) applyText(n, lang); else applyAttrs(n, lang); n = tw.nextNode() }
}

export function I18nProvider({ children }) {
  const [loc, setLoc] = useState(getLocale())
  useEffect(() => subscribe(setLoc), [])

  // <html lang dir> follow the language
  useEffect(() => {
    const el = document.documentElement
    el.lang = loc.lang
    el.dir = isRtl(loc.lang) ? 'rtl' : 'ltr'
    el.dataset.country = loc.country
  }, [loc])

  // Translate what is already on the page and keep translating what React adds or changes.
  useEffect(() => {
    const lang = loc.lang
    let busy = false
    const run = (fn) => { busy = true; try { fn() } finally { busy = false } }
    run(() => walk(document.body, lang))
    if (lang === 'en' && typeof MutationObserver === 'undefined') return undefined
    const mo = new MutationObserver((list) => {
      if (busy) return
      run(() => {
        for (const m of list) {
          if (m.type === 'childList') m.addedNodes.forEach((n) => walk(n, lang))
          else if (m.type === 'characterData') applyText(m.target, lang)
          else if (m.type === 'attributes') applyAttrs(m.target, lang)
        }
      })
    })
    mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS })
    return () => mo.disconnect()
  }, [loc.lang])

  const value = useMemo(() => {
    const c = findCountry(loc.country)
    return {
      country: loc.country, lang: loc.lang, dir: isRtl(loc.lang) ? 'rtl' : 'ltr', countryInfo: c, locale: intlTag(loc),
      t: (s, vars) => tr(s, vars, loc.lang),
      setLocale,
    }
  }, [loc])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useI18n = () => {
  const v = useContext(Ctx)
  if (v) return v
  const l = getLocale()
  return { country: l.country, lang: l.lang, dir: isRtl(l.lang) ? 'rtl' : 'ltr', countryInfo: findCountry(l.country), locale: intlTag(l), t: (s, vars) => tr(s, vars), setLocale }
}
export const useCallbackT = () => { const { t } = useI18n(); return useCallback(t, [t]) }
