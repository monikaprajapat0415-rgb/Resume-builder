import React, { useEffect, useRef, useState } from 'react'
import Reveal from '../Reveal'
import { useHomeTrust, roundDown } from '../../utils/homeTrust'
import { resumeTemplates } from '../../content/resumeTemplates'
import { CV_TEMPLATES } from '../../utils/cvModel'
import { LuLayoutTemplate, LuFileText, LuLanguages, LuUsers, LuFilePlus2, LuBadgeCheck } from 'react-icons/lu'

// Counts up from 0 once the number is on screen (or shows the number at once if motion is reduced).
const CountUp = ({ to, suffix = '' }) => {
  const ref = useRef(null)
  const [val, setVal] = useState(0)
  useEffect(() => {
    const el = ref.current
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!el || reduce || typeof IntersectionObserver === 'undefined') { setVal(to); return }
    let raf
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      io.disconnect()
      const start = performance.now(), dur = 1400
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur)
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const TrustStats = () => {
  const trust = useHomeTrust()
  // Always-true facts about the product, plus live numbers that appear only when they are big enough to mean something.
  const tiles = [
    { icon: LuLayoutTemplate, n: resumeTemplates.length, label: 'ATS-friendly resume templates' },
    { icon: LuFileText, n: CV_TEMPLATES.length, label: 'CV styles to choose from' },
    { icon: LuLanguages, n: 5, label: 'Languages for the site' },
  ]
  const users = trust?.stats?.users || 0
  const resumes = trust?.stats?.resumes || 0
  if (users >= 100) tiles.push({ icon: LuUsers, n: roundDown(users), suffix: '+', label: 'Job seekers signed up', live: true })
  if (resumes >= 100) tiles.push({ icon: LuFilePlus2, n: roundDown(resumes), suffix: '+', label: 'Resumes created', live: true })
  if (tiles.length < 4) tiles.push({ icon: LuBadgeCheck, text: 'Free', label: 'to start. No card needed' })
  const cols = tiles.length >= 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'

  return (
    <section aria-label="Prime Resume AI in numbers" className="px-4 py-8">
      <ul className={`max-w-6xl mx-auto grid grid-cols-2 ${cols} gap-3 sm:gap-4`}>
        {tiles.map((t, i) => (
          <Reveal as="li" key={t.label} delay={i * 90} className="lift rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4 sm:p-5 text-center">
            <span className="mx-auto grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700"><t.icon className="size-5" aria-hidden="true" /></span>
            <p className="mt-3 text-3xl sm:text-4xl font-semibold text-slate-800 tabular-nums">
              {t.text ? t.text : <CountUp to={t.n} suffix={t.suffix} />}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">{t.label}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export default TrustStats
