import api from '../configs/api'

// Cookie choices and Google Consent Mode. Visitors in Europe (EEA, UK, Switzerland) start with analytics and ad
// storage OFF until they choose; elsewhere it starts as allowed and the visitor can still reject.
const KEY = 'pr_consent_v1'
const REGIONS = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH']
const ALL = ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization']
const state = (v) => Object.fromEntries(ALL.map((k) => [k, v]))
const MAX_AGE = 365 * 24 * 3600 * 1000

export const getChoice = () => {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (c && (c.v === 'accept' || c.v === 'reject') && Date.now() - c.at < MAX_AGE) return c.v
  } catch { /* storage can be blocked */ }
  return null
}

const gtagFn = () => {
  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag !== 'function') window.gtag = function () { window.dataLayer.push(arguments) }
  return window.gtag
}

let started = false
// Must run before any Google script loads (analytics or ads).
export const initConsent = () => {
  if (started || typeof window === 'undefined') return
  started = true
  const gtag = gtagFn()
  gtag('consent', 'default', { ...state('denied'), region: REGIONS, wait_for_update: 500 })
  gtag('consent', 'default', state('granted'))
  const c = getChoice()
  if (c) gtag('consent', 'update', state(c === 'accept' ? 'granted' : 'denied'))
}

export const setChoice = (v) => {
  try { localStorage.setItem(KEY, JSON.stringify({ v, at: Date.now() })) } catch { /* ignore */ }
  initConsent()
  gtagFn()('consent', 'update', state(v === 'accept' ? 'granted' : 'denied'))
  window.dispatchEvent(new Event('pr-consent-change'))
}

export const openCookieSettings = () => window.dispatchEvent(new Event('pr-cookie-settings'))

// Rough check from the browser time zone (no location lookup, nothing is sent anywhere).
export const looksEuropean = () => {
  try { return /^(Europe|Atlantic\/(Reykjavik|Faroe|Madeira|Canary|Azores))\//.test(Intl.DateTimeFormat().resolvedOptions().timeZone || '') } catch { return false }
}

let cfgPromise = null
export const getAdConfig = () => {
  if (!cfgPromise) cfgPromise = api.get('/api/ads/config').then(({ data }) => data).catch(() => ({ banner: false, enabled: false, types: {} }))
  return cfgPromise
}
