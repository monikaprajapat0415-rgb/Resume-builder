import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LuClock, LuEye, LuPlay, LuRefreshCw } from 'react-icons/lu'
import api from '../../configs/api'

// A timed practice round from the interview question bank. No AI and nothing is saved: you answer in your own words
// (or aloud), reveal the model answer, and rate yourself. Admin > Free tools > "Timed interview round" switches it off.
const box = 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800'
const btn = 'inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 transition'
const shuffle = (a) => { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]] } return x }
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

// Model answers may contain fenced code blocks (practical coding questions), so show those as code.
const Answer = ({ text }) => {
  const parts = String(text || '').split(/```[a-z]*\n?/i)
  return (
    <div className='space-y-3 text-sm text-slate-700'>
      {parts.map((p, i) => i % 2 === 1
        ? <pre key={i} className='overflow-x-auto rounded-lg bg-slate-900 text-slate-100 p-3 text-xs'><code>{p.replace(/\n$/, '')}</code></pre>
        : p.split(/\n{2,}/).filter((x) => x.trim()).map((x, k) => <p key={`${i}-${k}`}>{x}</p>))}
    </div>
  )
}

const TimedRound = () => {
  const [bank, setBank] = useState(null)
  const [failed, setFailed] = useState(false)
  const [cfg, setCfg] = useState({ category: '', level: '', count: 5, seconds: 120 })
  const [round, setRound] = useState(null)          // { list, i, left, revealed, answer, loading, marks: [] }
  const tick = useRef(null)

  useEffect(() => { api.get('/api/community/questions').then(({ data }) => setBank(data.questions || [])).catch(() => setFailed(true)) }, [])
  const categories = useMemo(() => [...new Set((bank || []).map((q) => q.category))].sort(), [bank])
  const pool = useMemo(() => (bank || []).filter((q) => (!cfg.category || q.category === cfg.category) && (!cfg.level || q.level === cfg.level || q.level === 'both')), [bank, cfg.category, cfg.level])

  const stop = () => { clearInterval(tick.current); tick.current = null }
  useEffect(() => stop, [])

  const reveal = useCallback(async (slug) => {
    stop()
    setRound((r) => r && { ...r, revealed: true, loading: true })
    try { const { data } = await api.get(`/api/community/questions/${slug}`); setRound((r) => r && { ...r, loading: false, answer: data.question?.modelAnswer || '', tips: data.question?.tips || [] }) }
    catch { setRound((r) => r && { ...r, loading: false, answer: '', failed: true }) }
  }, [])

  const run = (r) => {
    stop()
    tick.current = setInterval(() => setRound((x) => {
      if (!x || x.revealed) return x
      return x.left <= 1 ? { ...x, left: 0 } : { ...x, left: x.left - 1 }
    }), 1000)
    return r
  }
  // when the clock reaches zero, show the answer
  useEffect(() => { if (round && !round.revealed && round.left === 0) reveal(round.list[round.i].slug) }, [round, reveal])

  const start = () => { setRound(run({ list: shuffle(pool).slice(0, cfg.count), i: 0, left: cfg.seconds, revealed: false, answer: '', marks: [], note: '' })) }
  const rate = (mark) => setRound((r) => {
    const marks = [...r.marks, mark]
    if (r.i + 1 >= r.list.length) { stop(); return { ...r, marks, done: true } }
    return run({ ...r, marks, i: r.i + 1, left: cfg.seconds, revealed: false, answer: '', tips: [], failed: false, loading: false, note: '' })
  })

  if (failed) return <p className='text-center text-slate-600 py-12'>The question bank could not be loaded. Please refresh the page.</p>
  if (!bank) return <p className='text-center text-slate-400 py-12'>Loading questions…</p>

  if (!round) {
    return (
      <div className='max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <h2 className='text-lg font-semibold text-slate-800'>Set up your round</h2>
        <p className='text-sm text-slate-600 mt-1'>Questions are picked at random from our bank of interview questions with model answers. {bank.length} are available.</p>
        <div className='grid sm:grid-cols-2 gap-4 mt-5'>
          <label className='text-sm font-medium text-slate-700'>Topic<select value={cfg.category} onChange={(e) => setCfg({ ...cfg, category: e.target.value })} className={`${box} block w-full mt-1`}><option value=''>Any topic</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
          <label className='text-sm font-medium text-slate-700'>Level<select value={cfg.level} onChange={(e) => setCfg({ ...cfg, level: e.target.value })} className={`${box} block w-full mt-1`}><option value=''>Any level</option><option value='fresher'>Freshers</option><option value='experienced'>Experienced</option></select></label>
          <label className='text-sm font-medium text-slate-700'>Number of questions<select value={cfg.count} onChange={(e) => setCfg({ ...cfg, count: Number(e.target.value) })} className={`${box} block w-full mt-1`}>{[3, 5, 8, 10].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
          <label className='text-sm font-medium text-slate-700'>Time for each answer<select value={cfg.seconds} onChange={(e) => setCfg({ ...cfg, seconds: Number(e.target.value) })} className={`${box} block w-full mt-1`}>{[60, 90, 120, 180, 300].map((n) => <option key={n} value={n}>{mmss(n)} minutes</option>)}</select></label>
        </div>
        {pool.length === 0 && <p className='text-sm text-amber-700 mt-4'>No questions match these choices. Try another topic or level.</p>}
        <button type='button' disabled={pool.length === 0} onClick={start} className={`${btn} mt-6`}><LuPlay className='size-4' />Start the round ({Math.min(cfg.count, pool.length)} question{Math.min(cfg.count, pool.length) === 1 ? '' : 's'})</button>
      </div>
    )
  }

  if (round.done) {
    const good = round.marks.filter((m) => m === 'good').length, mid = round.marks.filter((m) => m === 'mid').length
    return (
      <div className='max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm' data-testid='round-summary'>
        <h2 className='text-lg font-semibold text-slate-800'>Round finished</h2>
        <p className='text-sm text-slate-600 mt-1'>You rated yourself: {good} answered well, {mid} partly, {round.marks.length - good - mid} to review. This is your own rating, not a score from us.</p>
        <ol className='mt-4 divide-y divide-slate-100'>
          {round.list.map((q, k) => (
            <li key={q.slug} className='py-2.5 flex items-start justify-between gap-3 text-sm'>
              <Link to={`/jobs/interview-questions/${q.slug}`} className='text-brand-700 hover:underline'>{q.question}</Link>
              <span className={`shrink-0 text-xs rounded-full px-2.5 py-0.5 ${round.marks[k] === 'good' ? 'bg-green-100 text-green-700' : round.marks[k] === 'mid' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{round.marks[k] === 'good' ? 'Well' : round.marks[k] === 'mid' ? 'Partly' : 'Review'}</span>
            </li>
          ))}
        </ol>
        <div className='flex flex-wrap gap-3 mt-5'>
          <button type='button' className={btn} onClick={start}><LuRefreshCw className='size-4' />Another round</button>
          <button type='button' className='rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50' onClick={() => setRound(null)}>Change settings</button>
        </div>
      </div>
    )
  }

  const q = round.list[round.i]
  const low = round.left <= 15 && !round.revealed
  return (
    <div className='max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm' data-testid='round-question'>
      <div className='flex items-center justify-between gap-3 text-sm text-slate-500'>
        <span>Question {round.i + 1} of {round.list.length} · {q.category}</span>
        <span role='timer' aria-live='off' className={`inline-flex items-center gap-1.5 font-mono text-base ${low ? 'text-red-600' : 'text-slate-700'}`}><LuClock className='size-4' />{mmss(round.left)}</span>
      </div>
      <h2 className='text-xl font-semibold text-slate-800 mt-3'>{q.question}</h2>
      {!round.revealed ? (
        <>
          <label htmlFor='round-note' className='block text-sm font-medium text-slate-700 mt-5'>Your answer (optional notes; speaking it aloud works too)</label>
          <textarea id='round-note' rows={6} value={round.note} onChange={(e) => setRound((r) => ({ ...r, note: e.target.value }))} className='w-full mt-1.5 rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300' placeholder='Write the points you would say. Nothing is saved or sent.' />
          <button type='button' className={`${btn} mt-4`} onClick={() => reveal(q.slug)}><LuEye className='size-4' />Show the model answer</button>
        </>
      ) : (
        <div className='mt-5'>
          <p className='text-sm font-semibold text-slate-800'>Model answer</p>
          <div className='mt-2 rounded-lg bg-slate-50 border border-slate-200 p-4'>
            {round.loading ? <p className='text-sm text-slate-500'>Loading…</p> : round.failed ? <p className='text-sm text-red-600'>Could not load the answer. <Link to={`/jobs/interview-questions/${q.slug}`} className='underline'>Open the question page</Link>.</p> : round.answer ? <Answer text={round.answer} /> : <p className='text-sm text-slate-500'>There is no model answer for this question yet. <Link to={`/jobs/interview-questions/${q.slug}`} className='text-brand-700 underline'>Open the question page</Link>.</p>}
          </div>
          {round.note && <div className='mt-4'><p className='text-sm font-semibold text-slate-800'>Your notes</p><p className='mt-1 text-sm text-slate-600 whitespace-pre-wrap'>{round.note}</p></div>}
          <p className='text-sm font-medium text-slate-800 mt-5'>How did you do?</p>
          <div className='flex flex-wrap gap-2 mt-2'>
            <button type='button' onClick={() => rate('good')} className='rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2'>I answered it well</button>
            <button type='button' onClick={() => rate('mid')} className='rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2'>Partly</button>
            <button type='button' onClick={() => rate('bad')} className='rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2'>I need to review</button>
          </div>
        </div>
      )}
    </div>
  )
}
export default TimedRound
