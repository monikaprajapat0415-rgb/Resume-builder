import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getAdConfig, getChoice, setChoice, initConsent } from '../utils/consent'

// Cookie choices. Shown once (and again after a year, or from the footer "Cookie settings" link). Admin: Admin > Ads > Cookie banner.
const ConsentBanner = () => {
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    let live = true
    initConsent()
    getAdConfig().then((c) => { if (live) { setAllowed(Boolean(c.banner)); setShow(Boolean(c.banner) && !getChoice()) } })
    const open = () => setShow(true)
    window.addEventListener('pr-cookie-settings', open)
    return () => { live = false; window.removeEventListener('pr-cookie-settings', open) }
  }, [])

  if (!show || !allowed || /^\/admin(\/|$)/.test(pathname)) return null
  const pick = (v) => { setChoice(v); setShow(false) }
  return (
    <div role='dialog' aria-label='Cookie choices' className='fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5'>
      <p className='text-sm text-slate-700'>We use cookies to measure how the site is used and, where ads are shown, to show them. You can accept all or reject the ones that are not essential. Read more in our <Link to='/privacy-policy' className='text-brand-700 underline'>privacy policy</Link>.</p>
      <div className='mt-3 flex flex-wrap gap-2'>
        <button type='button' onClick={() => pick('accept')} className='rounded-full bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700'>Accept all</button>
        <button type='button' onClick={() => pick('reject')} className='rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50'>Reject non-essential</button>
      </div>
    </div>
  )
}
export default ConsentBanner
