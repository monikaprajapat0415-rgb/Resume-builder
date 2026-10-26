import React, { useEffect, useRef } from 'react'

// A thin bar at the top of the page showing how far down the visitor has read. Decorative, and hidden for reduced motion.
const ScrollProgress = () => {
  const bar = useRef(null)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])
  return <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"><div ref={bar} className="progress-bar aurora h-full w-full bg-gradient-to-r from-brand-500 via-emerald-300 to-brand-600" style={{ transform: 'scaleX(0)' }} /></div>
}

export default ScrollProgress
