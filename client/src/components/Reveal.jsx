import React, { useEffect, useRef, useState } from 'react'

// Fades and slides its content in when it scrolls into view. Content already on screen is simply shown (no flash),
// and nothing is hidden for people who prefer reduced motion (the CSS only applies when motion is allowed).
const Reveal = ({ as: Tag = 'div', delay = 0, from = 'up', className = '', children, ...rest }) => {
  const ref = useRef(null)
  const [state, setState] = useState('shown') // shown -> armed -> in
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return
    let done
    setState('armed')
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setState('in'); io.disconnect(); done = setTimeout(() => setState('shown'), delay + 900) }
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' })
    io.observe(el)
    return () => { io.disconnect(); clearTimeout(done) }
  }, [])
  const cls = state === 'shown' ? '' : state === 'armed' ? `reveal reveal-${from}` : `reveal reveal-${from} is-in`
  return <Tag ref={ref} className={`${cls} ${className}`} style={{ '--d': `${delay}ms` }} {...rest}>{children}</Tag>
}

export default Reveal
