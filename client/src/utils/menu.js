import { useEffect, useState } from 'react'
import api from '../configs/api'

// Same items the site shipped with (mirrors server/utils/menuDefaults.js). Rendered
// immediately and whenever the menu API can't be reached, so the nav is never empty.
export const DEFAULT_MENU = {
  header: [
    { _id: 'h-home', label: 'Home', url: '/' },
    { _id: 'h-features', label: 'Features', url: '/features' },
    { _id: 'h-testimonials', label: 'Testimonials', url: '/#testimonials' },
    { _id: 'h-templates', label: 'Templates', url: '/templates' },
    { _id: 'h-products', label: 'Products', url: '/products' },
    { _id: 'h-blog', label: 'Blog', url: '/blog' },
    { _id: 'h-learn', label: 'Learn', url: '/learn' },
    { _id: 'h-contact', label: 'Contact Us', url: '/#contact-us' },
  ],
  footer_product: [
    { _id: 'fp-home', label: 'Home', url: '/' },
    { _id: 'fp-support', label: 'Support', url: '/' },
    { _id: 'fp-pricing', label: 'Pricing', url: '/' },
    { _id: 'fp-affiliate', label: 'Affiliate', url: '/' },
  ],
  footer_resources: [
    { _id: 'fr-templates', label: 'Templates', url: '/templates' },
    { _id: 'fr-ats', label: 'ATS Checker', url: '/features/ats-checker' },
    { _id: 'fr-products', label: 'Products', url: '/products' },
    { _id: 'fr-blog', label: 'Blog', url: '/blog' },
    { _id: 'fr-learn', label: 'Learn', url: '/learn' },
    { _id: 'fr-contact', label: 'Contact', url: '/contact-us' },
  ],
  footer_legal: [
    { _id: 'fl-privacy', label: 'Privacy', url: '/privacy-policy' },
    { _id: 'fl-terms', label: 'Terms', url: '/terms-and-conditions' },
  ],
}

// One shared request for the whole page load (NavBar and Footer both ask), reused
// for 30 seconds while the visitor moves between pages.
let cache = null
let cachedAt = 0
let inflight = null

const fetchMenu = () => {
  if (cache && Date.now() - cachedAt < 30000) return Promise.resolve(cache)
  if (!inflight) {
    inflight = api.get('/api/menu')
      .then(({ data }) => { cache = { ...DEFAULT_MENU, ...data.menu }; cachedAt = Date.now(); return cache })
      .catch(() => cache || DEFAULT_MENU)
      .finally(() => { inflight = null })
  }
  return inflight
}

// Call after the admin edits the menu so the live nav refreshes immediately.
export const invalidateMenu = () => { cache = null; cachedAt = 0 }

export const useMenu = () => {
  const [menu, setMenu] = useState(cache || DEFAULT_MENU)
  useEffect(() => {
    let live = true
    fetchMenu().then((m) => { if (live) setMenu(m) })
    return () => { live = false }
  }, [])
  return menu
}
