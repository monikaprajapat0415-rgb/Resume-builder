import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import { getAdConfig, getChoice } from '../utils/consent'

// A small, non-blocking card that invites a visitor to create a free account. Admin: Admin > Sign-up prompt.
// It only appears when ALL of these are true: it is switched on, the page is allowed, the visitor is signed out, has
// not closed it recently, is not an automated browser, has scrolled/clicked/typed, has been on the page for the set
// delay, and has already answered the cookie banner. It never covers the page and never shows on the builder or login.
const HIDE_KEY = 'pr_nudge_until'
let cfgPromise = null
const getCfg = () => (cfgPromise ||= api.get('/api/nudge/config').then(({ data }) => data).catch(() => ({ enabled: false })))
const count = (type) => { api.post('/api/nudge/event', { type }).catch(() => {}) }
const hiddenNow = () => { try { return Number(localStorage.getItem(HIDE_KEY) || 0) > Date.now() } catch { return false } }
const hideFor = (days) => { try { localStorage.setItem(HIDE_KEY, String(Date.now() + days * 86400000)) } catch { /* storage can be blocked */ } }

const SignupNudge = () => {
  const { pathname } = useLocation()
  const { user, loading } = useSelector((s) => s.auth)
  const [cfg, setCfg] = useState(null)
  const [acted, setActed] = useState(false)     // a real visitor action happened
  const [waited, setWaited] = useState(false)   // the delay has passed
  const [consentOk, setConsentOk] = useState(false)
  const [open, setOpen] = useState(false)
  const counted = useRef(false)

  const allowed = cfg?.enabled && ((pathname === '/' && cfg.onHome) || (cfg.onContent && /^\/(blog|learn|jobs\/interview-questions)\/[^/]+/.test(pathname)))
  const eligible = Boolean(allowed) && !user && loading === false && !hiddenNow() && !(typeof navigator !== 'undefined' && navigator.webdriver)

  useEffect(() => { let live = true; getCfg().then((c) => { if (live) setCfg(c) }); return () => { live = false } }, [])

  // cookie banner first: wait until it is answered (or switched off)
  useEffect(() => {
    let live = true
    const check = () => getAdConfig().then((c) => { if (live) setConsentOk(!c.banner || Boolean(getChoice())) })
    check()
    window.addEventListener('pr-consent-change', check)
    return () => { live = false; window.removeEventListener('pr-consent-change', check) }
  }, [])

  useEffect(() => {
    setActed(false); setWaited(false); setOpen(false)
    if (!eligible) return undefined
    const act = () => setActed(true)
    const evs = ['scroll', 'pointerdown', 'keydown', 'touchstart']
    evs.forEach((e) => window.addEventListener(e, act, { passive: true, once: true }))
    const t = setTimeout(() => setWaited(true), (cfg.delaySeconds || 20) * 1000)
    return () => { evs.forEach((e) => window.removeEventListener(e, act)); clearTimeout(t) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, eligible])

  const show = eligible && acted && waited && consentOk
  useEffect(() => {
    setOpen(show)
    if (show && !counted.current) { counted.current = true; count('shown') }
  }, [show])

  useEffect(() => {
    if (!open) return undefined
    const esc = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open || !cfg) return null
  const close = () => { hideFor(cfg.hideDays || 14); count('dismissed'); setOpen(false) }
  const go = () => { hideFor(cfg.hideDays || 14); count('clicked'); setOpen(false) }
  return (
    <aside aria-label='Create a free account' className='fixed bottom-4 right-4 left-4 z-40 sm:left-auto sm:w-96 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl' style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
      <button type='button' onClick={close} aria-label='Close' className='absolute right-3 top-3 grid size-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600'>
        <svg viewBox='0 0 20 20' className='size-4' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' aria-hidden='true'><path d='M5 5l10 10M15 5L5 15' /></svg>
      </button>
      <h2 className='pr-7 text-base font-semibold text-slate-800'>{cfg.title}</h2>
      <p className='mt-1.5 text-sm text-slate-600'>{cfg.body}</p>
      <div className='mt-4 flex flex-wrap items-center gap-3'>
        <Link to='/app?state=register' onClick={go} className='rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700'>{cfg.button}</Link>
        <Link to='/app?state=login' onClick={go} className='text-sm text-brand-700 hover:underline'>I have an account</Link>
      </div>
    </aside>
  )
}
export default SignupNudge
