import { useEffect, useState } from 'react'
import api from '../configs/api'

// Mirrors server/utils/siteContentDefaults.js. Used immediately on first paint and
// whenever the API is unreachable, so the homepage text is never blank.
export const DEFAULT_SITE = {
  banner_show: 'true',
  banner_badge: 'New',
  banner_text: 'AI Feature Added',
  hero_line1: 'Land your dream job with',
  hero_highlight: 'AI-powered',
  hero_line2: 'resumes.',
  hero_subtext: 'Create, edit, and download professional resumes with AI-powered assistance.',
  hero_button: 'Create my resume',
  cta_text: 'Build a Professional Resume That Help You Stand Out and Get Hired',
  cta_button: 'Get Started',
  contact_email: 'support@primeresumeai.com',
  contact_phone: '+91 7976204889',
  contact_address: 'New Delhi, India',
  theme_primary: '#00a63e',
  feature_cover_letter: 'false',
}

let cache = null
let cachedAt = 0
let inflight = null

const fetchSite = () => {
  if (cache && Date.now() - cachedAt < 30000) return Promise.resolve(cache)
  if (!inflight) {
    inflight = api.get('/api/site-content')
      .then(({ data }) => { cache = { ...DEFAULT_SITE, ...data.values }; cachedAt = Date.now(); return cache })
      .catch(() => cache || DEFAULT_SITE)
      .finally(() => { inflight = null })
  }
  return inflight
}

export const invalidateSiteContent = () => { cache = null; cachedAt = 0 }

export const useSiteContent = () => {
  const [site, setSite] = useState(cache || DEFAULT_SITE)
  useEffect(() => {
    let live = true
    fetchSite().then((v) => { if (live) setSite(v) })
    return () => { live = false }
  }, [])
  return site
}
