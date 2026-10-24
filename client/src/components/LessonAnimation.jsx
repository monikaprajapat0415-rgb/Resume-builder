import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LuPlay, LuPause, LuSkipBack, LuSkipForward, LuRotateCcw, LuVolume2, LuVolumeX } from 'react-icons/lu'

// Plays a lesson animation (see server/utils/lessonAnimation.js): nodes on a grid, a caption per step, packets that
// travel along arrows, and an optional spoken voice-over using the browser's own text-to-speech (no audio files).
// Nothing starts by itself: the reader presses Play or steps through with the arrows.

const KIND = { app: '#2563eb', model: '#7c3aed', tool: '#d97706', data: '#0891b2', store: '#475569', user: '#16a34a', check: '#dc2626', out: '#059669' }
const NODE_W = 156, NODE_H = 68

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const canSpeak = () => { try { return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window } catch { return false } }

// largest font size (up to `max`) that keeps a text inside a node; about `em` of the font size per character
const fit = (text, max, em) => Math.max(10, Math.min(max, +((NODE_W - 16) / (text.length * em)).toFixed(1)))

// point where the line from c towards `to` leaves the rectangle around c
const edgePoint = (c, to, gap = 6) => {
  const dx = to.x - c.x, dy = to.y - c.y
  const t = Math.min((NODE_W / 2 + gap) / Math.abs(dx || 1e-6), (NODE_H / 2 + gap) / Math.abs(dy || 1e-6))
  return { x: c.x + dx * t, y: c.y + dy * t }
}

const LessonAnimation = ({ animation }) => {
  const { nodes, steps, title } = animation
  const box = useRef(null)
  const [compact, setCompact] = useState(false)
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [voice, setVoice] = useState(false)
  const [speakable] = useState(canSpeak)
  const still = useMemo(reducedMotion, [])
  const timer = useRef(null)
  const last = steps.length - 1

  useEffect(() => {
    const el = box.current
    if (!el) return undefined
    const fit = () => setCompact(el.clientWidth < 560)
    fit()
    const ro = new ResizeObserver(fit); ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const stopSpeech = useCallback(() => { if (canSpeak()) window.speechSynthesis.cancel() }, [])
  useEffect(() => () => { clearTimeout(timer.current); if (canSpeak()) window.speechSynthesis.cancel() }, [])

  // layout: on a narrow screen the grid is turned so columns run down the page
  const layout = useMemo(() => {
    const pos = (n) => (compact ? { c: n.row, r: n.col } : { c: n.col, r: n.row })
    const maxC = Math.max(...nodes.map((n) => pos(n).c)), maxR = Math.max(...nodes.map((n) => pos(n).r))
    const CW = compact ? 190 : 228, CH = compact ? 104 : 126
    const at = Object.fromEntries(nodes.map((n) => { const p = pos(n); return [n.id, { x: p.c * CW + CW / 2, y: p.r * CH + CH / 2 }] }))
    return { at, W: (maxC + 1) * CW, H: (maxR + 1) * CH }
  }, [nodes, compact])

  // every arrow used anywhere in the animation is drawn faintly; the current step's arrows are bold
  const allLinks = useMemo(() => {
    const seen = new Map()
    steps.forEach((s) => s.flow.forEach((f) => { const k = [f.from, f.to].sort().join('|'); if (!seen.has(k)) seen.set(k, f) }))
    return [...seen.values()]
  }, [steps])
  const lit = useMemo(() => {
    const s = new Set()
    steps.slice(0, i + 1).forEach((st) => { st.on.forEach((x) => s.add(x)); st.flow.forEach((f) => { s.add(f.from); s.add(f.to) }) })
    return s
  }, [steps, i])
  const step = steps[i]
  const active = new Set([...step.on, ...step.flow.flatMap((f) => [f.from, f.to])])

  const speak = useCallback((text, onDone) => {
    if (!canSpeak()) return false
    try {
      const synth = window.speechSynthesis
      synth.cancel()
      const u = new window.SpeechSynthesisUtterance(text)
      u.lang = 'en-US'; u.rate = 0.95
      const voices = synth.getVoices()
      const en = voices.find((v) => /^en[-_]/i.test(v.lang) && v.localService) || voices.find((v) => /^en[-_]/i.test(v.lang))
      if (en) u.voice = en
      let done = false
      const finish = () => { if (!done) { done = true; onDone?.() } }
      u.onend = finish; u.onerror = finish
      synth.speak(u)
      return true
    } catch {
      return false // a browser that refuses to speak must never break the lesson page
    }
  }, [])

  const playingRef = useRef(false)
  useEffect(() => { playingRef.current = playing }, [playing])
  const advance = useCallback(() => {
    if (!playingRef.current) return
    setI((x) => { if (x >= last) { setPlaying(false); return x } return x + 1 })
  }, [last])

  // read step n aloud; when it has been read, move on after a short pause if the animation is playing
  const readStep = useCallback((n) => {
    clearTimeout(timer.current)
    return speak(steps[n].say, () => { clearTimeout(timer.current); timer.current = setTimeout(advance, 600) })
  }, [speak, steps, advance])

  // a new step (or voice switched on): speak it
  useEffect(() => { if (voice) readStep(i); else stopSpeech() }, [i, voice]) // eslint-disable-line react-hooks/exhaustive-deps

  // timed advance while playing (the reading pause, or a safety net when a browser never reports the end of speech)
  useEffect(() => {
    clearTimeout(timer.current)
    if (!playing) return undefined
    const readTime = Math.max(3200, step.say.length * 62)
    timer.current = setTimeout(advance, voice ? readTime * 2.5 + 3000 : readTime)
    return () => clearTimeout(timer.current)
  }, [i, playing, voice, step, advance])

  const go = (n) => { clearTimeout(timer.current); stopSpeech(); setI(Math.max(0, Math.min(last, n))) }
  const toggle = () => {
    if (playing) { setPlaying(false); clearTimeout(timer.current); stopSpeech(); return }
    const from = i >= last ? 0 : i
    playingRef.current = true
    setPlaying(true)
    if (from !== i) setI(0)
    else if (voice) readStep(i)
  }
  const toggleVoice = () => { setVoice((v) => !v) }

  const node = (n) => {
    const p = layout.at[n.id], color = KIND[n.kind] || KIND.app
    const on = active.has(n.id), seen = lit.has(n.id)
    return (
      <g key={n.id} transform={`translate(${p.x - NODE_W / 2} ${p.y - NODE_H / 2})`} style={{ transition: 'opacity .3s' }} opacity={on ? 1 : seen ? 0.8 : 0.4}>
        <rect width={NODE_W} height={NODE_H} rx='14' fill={on ? `${color}22` : '#ffffff'} stroke={color} strokeWidth={on ? 3.5 : 1.5} style={{ transition: 'all .3s' }} />
        <text x={NODE_W / 2} y={n.sub ? 29 : 40} textAnchor='middle' fontSize={fit(n.label, 17, 0.62)} fontWeight='700' fill='#1e293b'>{n.label}</text>
        {n.sub && <text x={NODE_W / 2} y={51} textAnchor='middle' fontSize={fit(n.sub, 13, 0.56)} fill='#475569'>{n.sub}</text>}
      </g>
    )
  }

  const line = (f, key, bold) => {
    const a = layout.at[f.from], b = layout.at[f.to]
    const p1 = edgePoint(a, b), p2 = edgePoint(b, a, 10)
    return <line key={key} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={bold ? '#0f172a' : '#cbd5e1'} strokeWidth={bold ? 3 : 2} strokeDasharray={bold ? undefined : '5 6'} markerEnd={bold ? 'url(#la-arrow)' : undefined} />
  }

  return (
    <section aria-label='Animated walkthrough' className='rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden print:hidden'>
      <div className='px-4 sm:px-5 pt-4 pb-1 flex items-center justify-between gap-3'>
        <h2 className='text-base font-semibold text-slate-800'>{title || 'How it works, step by step'}</h2>
        <span className='text-xs text-slate-500 shrink-0'>Step {i + 1} of {steps.length}</span>
      </div>

      <div ref={box} className='px-2 sm:px-4'>
        <svg viewBox={`0 0 ${layout.W} ${layout.H}`} className='w-full h-auto select-none' role='img' aria-label={`Diagram: ${nodes.map((n) => n.label).join(', ')}`}>
          <defs>
            <marker id='la-arrow' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0 0 L10 5 L0 10 z' fill='#0f172a' /></marker>
          </defs>
          {allLinks.map((f, k) => line(f, `l${k}`, false))}
          {nodes.map(node)}
          {step.flow.map((f, k) => {
            const a = layout.at[f.from], b = layout.at[f.to]
            const p1 = edgePoint(a, b), p2 = edgePoint(b, a, 10)
            const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
            const w = f.label ? Math.min(f.label.length * 7.4 + 24, 200) : 0
            // a label wider than the gap between two side-by-side boxes sits just above the row instead of covering the boxes
            const wide = Math.abs(p2.x - p1.x) >= Math.abs(p2.y - p1.y) && w > Math.abs(p2.x - p1.x) + 4
            if (wide) mid.y -= NODE_H / 2 + 14
            return (
              <g key={`${i}-${k}`}>
                {line(f, `f${k}`, true)}
                {!still && <circle r='7' fill='#f59e0b' stroke='#fff' strokeWidth='2'><animateMotion dur='1.3s' fill='freeze' path={`M${p1.x} ${p1.y} L${p2.x} ${p2.y}`} /></circle>}
                {f.label && (
                  <g transform={`translate(${mid.x} ${mid.y})`}>
                    <rect x={-w / 2} y='-13' width={w} height='26' rx='13' fill='#fef3c7' stroke='#f59e0b' />
                    <text y='5' textAnchor='middle' fontSize='13' fontWeight='600' fill='#78350f'>{f.label}</text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <p aria-live='polite' className='px-4 sm:px-5 py-3 text-[15px] leading-relaxed text-slate-700 bg-slate-50 border-t border-slate-100 min-h-[4.5rem]'>{step.say}</p>

      <div className='px-3 sm:px-4 py-3 flex flex-wrap items-center gap-2 border-t border-slate-100'>
        <button type='button' onClick={toggle} aria-label={playing ? 'Pause' : i >= last ? 'Play again' : 'Play'} className='inline-flex items-center gap-1.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 text-sm font-medium transition'>
          {playing ? <LuPause className='size-4' /> : <LuPlay className='size-4' />}{playing ? 'Pause' : i >= last ? 'Play again' : 'Play'}
        </button>
        <button type='button' onClick={() => go(i - 1)} disabled={i === 0} aria-label='Previous step' className='p-2 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-40'><LuSkipBack className='size-4' /></button>
        <button type='button' onClick={() => go(i + 1)} disabled={i === last} aria-label='Next step' className='p-2 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-40'><LuSkipForward className='size-4' /></button>
        <button type='button' onClick={() => { setPlaying(false); go(0) }} aria-label='Back to the first step' className='p-2 rounded-full border border-slate-200 hover:bg-slate-50'><LuRotateCcw className='size-4' /></button>
        {speakable && (
          <button type='button' onClick={toggleVoice} aria-pressed={voice} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition ${voice ? 'border-brand-300 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {voice ? <LuVolume2 className='size-4' /> : <LuVolumeX className='size-4' />}Voice {voice ? 'on' : 'off'}
          </button>
        )}
        <div className='ml-auto flex items-center gap-1.5' role='group' aria-label='Choose a step'>
          {steps.map((_, k) => <button key={k} type='button' onClick={() => go(k)} aria-label={`Step ${k + 1}`} aria-current={k === i} className={`size-2.5 rounded-full transition ${k === i ? 'bg-brand-600 scale-125' : k < i ? 'bg-brand-300' : 'bg-slate-300'}`} />)}
        </div>
      </div>

      <details className='px-4 sm:px-5 py-3 border-t border-slate-100 text-sm text-slate-600'>
        <summary className='cursor-pointer text-slate-700 font-medium'>Read the steps as text</summary>
        <ol className='mt-2 list-decimal pl-5 space-y-1.5'>{steps.map((s, k) => <li key={k}>{s.say}</li>)}</ol>
        {speakable && <p className='mt-3 text-xs text-slate-400'>The voice is read by your device&apos;s own speech engine, so how it sounds depends on your phone or computer.</p>}
      </details>
    </section>
  )
}

export default LessonAnimation
