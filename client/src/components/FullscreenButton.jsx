import React, { useEffect, useState } from 'react'

// One button to fill the whole screen (the browser's own full-screen mode). Press Esc or the button again to leave.
// Hidden where the browser cannot do it (for example iPhone Safari).
export default function FullscreenButton({ className = '' }) {
  const [on, setOn] = useState(false)
  const ok = typeof document !== 'undefined' && !!document.fullscreenEnabled
  useEffect(() => {
    const h = () => setOn(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    h()
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])
  if (!ok) return null
  const toggle = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen()
      else document.documentElement.requestFullscreen()
    } catch { /* the browser refused: nothing to do */ }
  }
  return (
    <button type='button' onClick={toggle} aria-pressed={on} data-testid='fullscreen-btn'
      className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 active:scale-95 transition print:hidden ${className}`}>
      <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
        {on ? <path d='M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3' /> : <path d='M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3' />}
      </svg>
      {on ? 'Exit full screen' : 'Full screen'}
    </button>
  )
}
