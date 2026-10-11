import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Google Analytics 4. Turned on only when VITE_GA_ID (e.g. G-ABC123XYZ) is set at build time.
const GA_ID = String(import.meta.env.VITE_GA_ID || '').replace(/^["']|["']$/g, '').trim()
const PRIVATE = /^\/(admin|app|view|logout|forgot-password|reset-password|verify-email)(\/|$)/

let ready = false
const boot = () => {
  if (ready || !/^G-[A-Z0-9]+$/i.test(GA_ID) || typeof document === 'undefined') return false
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false }) // page views are sent on every route change below
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(s)
  ready = true
  return true
}

export const trackEvent = (name, params = {}) => {
  if (ready && typeof window.gtag === 'function') window.gtag('event', name, params)
}

const Analytics = () => {
  const { pathname, search } = useLocation()
  useEffect(() => {
    if (PRIVATE.test(pathname)) return
    boot()
    if (!ready) return
    // wait a moment so the page's own <title> (set by the SEO component) is the one reported
    const t = setTimeout(() => window.gtag('event', 'page_view', {
      page_path: pathname + search,
      page_location: window.location.origin + pathname + search,
      page_title: document.title,
    }), 400)
    return () => clearTimeout(t)
  }, [pathname, search])
  return null
}

export default Analytics
