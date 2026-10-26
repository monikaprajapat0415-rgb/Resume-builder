import React, { useRef, useEffect, useState } from 'react'
import { LuSparkles, LuCheck } from 'react-icons/lu'

// A decorative sample of the product: a resume summary being written by AI, then the ATS-friendly checks ticking.
// It is an illustration with example text, labelled as such, and makes no claim about a real score or a real person.
const LINES = [
  'Reliable warehouse supervisor with 5 years of experience leading a team of 12.',
  'Cut picking errors by organising stock and training new staff.',
  'Comfortable with scanners, forklifts and daily safety checks.',
]
const CHECKS = ['Clean single-column layout', 'Readable fonts and spacing', 'Skills and keywords in plain text']

const HeroDemo = () => {
  const wrap = useRef(null)
  const card = useRef(null)
  // gentle 3D tilt that follows a mouse; touch and keyboard users, and reduced-motion users, just see a still card
  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || !card.current || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const r = wrap.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    card.current.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`
  }
  const onLeave = () => { if (card.current) card.current.style.transform = '' }
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [line, setLine] = useState(reduce ? LINES.length : 0)
  const [chars, setChars] = useState(0)
  const [checks, setChecks] = useState(reduce ? CHECKS.length : 0)

  useEffect(() => {
    if (reduce) return
    let stop = false
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    ;(async () => {
      while (!stop) {
        setLine(0); setChars(0); setChecks(0)
        await wait(900)
        for (let i = 0; i < LINES.length && !stop; i++) {
          setLine(i)
          for (let c = 1; c <= LINES[i].length && !stop; c++) { setChars(c); await wait(22) }
          await wait(250)
        }
        setLine(LINES.length)
        for (let k = 1; k <= CHECKS.length && !stop; k++) { await wait(450); setChecks(k) }
        await wait(5000)
      }
    })()
    return () => { stop = true }
  }, [reduce])

  return (
    <div ref={wrap} onPointerMove={onMove} onPointerLeave={onLeave} aria-hidden="true" className="relative mx-auto mt-12 w-full max-w-md select-none">
      <div className="float-slow absolute -left-3 sm:-left-24 top-32 z-10 hidden sm:flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-md">
        <LuSparkles className="size-4 text-brand-600" /> AI suggestion
      </div>
      <div className="float-slower absolute -right-3 sm:-right-12 bottom-16 z-10 hidden sm:flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-md">
        <span className="size-2 rounded-full bg-green-500 pulse-ring" /> ATS-friendly
      </div>

      <div ref={card} className="tilt rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-left shadow-xl shadow-brand-900/5 ring-1 ring-black/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-slate-800">Your Name</p>
            <p className="text-xs text-slate-500">Warehouse Supervisor</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">Sample preview</span>
        </div>
        <div className="mt-4 h-px bg-slate-100" />
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-brand-700">Summary</p>
        <div className="mt-2 min-h-[7.5rem] space-y-1.5 text-[13px] leading-snug text-slate-600">
          {LINES.map((t, i) => {
            const text = i < line ? t : i === line ? t.slice(0, chars) : ''
            return (
              <p key={i} className={text ? '' : 'invisible'}>
                {text || t}{i === line && line < LINES.length && <span className="typing-caret ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 bg-brand-600" />}
              </p>
            )
          })}
        </div>
        <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
          {CHECKS.map((c, i) => (
            <li key={c} className={`flex items-center gap-2 text-xs ${i < checks ? 'text-slate-700' : 'text-slate-300'}`}>
              <span className={`grid size-4 place-items-center rounded-full ${i < checks ? 'bg-green-500 text-white pop-in' : 'bg-slate-100'}`}>{i < checks && <LuCheck className="size-3" />}</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default HeroDemo
