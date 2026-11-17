import React, { useEffect, useRef, useState } from 'react'
import { getAdConfig, initConsent, looksEuropean } from '../utils/consent'

// One AdSense unit for a content page type ('blog' | 'lesson' | 'interview'). Renders nothing unless Admin > Ads has ads on,
// a publisher ID and an ad unit ID for this page type, and the visitor is not hidden (Europe setting). The ad script loads
// only when a slot is on the page, so the builder, login and checkout never load it.
let scriptReady = false
const loadScript = (client) => {
  if (scriptReady || typeof document === 'undefined') return
  scriptReady = true
  initConsent()
  const s = document.createElement('script')
  s.async = true
  s.crossOrigin = 'anonymous'
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`
  document.head.appendChild(s)
}

const AdSlot = ({ type, className = '' }) => {
  const [cfg, setCfg] = useState(null)
  const pushed = useRef(false)
  const slot = cfg?.types?.[type]
  const blocked = cfg?.hideInEurope && looksEuropean()

  useEffect(() => { let live = true; getAdConfig().then((c) => { if (live) setCfg(c) }); return () => { live = false } }, [])
  useEffect(() => {
    if (!cfg?.enabled || !slot || blocked || pushed.current) return
    pushed.current = true
    loadScript(cfg.client)
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch { /* an ad failing must never break the page */ }
  }, [cfg, slot, blocked])

  if (!cfg?.enabled || !slot || blocked) return null
  return (
    <aside aria-label='Advertisement' className={`my-8 min-h-[100px] ${className}`}>
      <p className='mb-1 text-[11px] uppercase tracking-wide text-slate-400'>Advertisement</p>
      <ins className='adsbygoogle' style={{ display: 'block' }} data-ad-client={cfg.client} data-ad-slot={slot} data-ad-format='auto' data-full-width-responsive='true' />
    </aside>
  )
}
export default AdSlot
