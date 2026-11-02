import React, { useMemo, useState } from 'react'
import { LuCalendarDays, LuCopy, LuDownload } from 'react-icons/lu'
import toast from 'react-hot-toast'

// "Make my study plan": spreads the roadmap steps you have NOT ticked over calendar weeks that you choose.
// It does not estimate how long anything takes (that depends on the person). You pick the weeks per step and the start day.
// Admin > Free tools > "Roadmap study plan" switches it off. Nothing is stored or sent: the plan lives on this screen.
const DAY = 86400000
const fmt = (d) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
const ymd = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
const nextMonday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); return d }
const inputVal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const RoadmapPlan = ({ roadmap, doneSteps = [] }) => {
  const [weeks, setWeeks] = useState(2)
  const [hours, setHours] = useState(5)
  const [start, setStart] = useState(inputVal(nextMonday()))
  const [open, setOpen] = useState(false)

  const plan = useMemo(() => {
    const first = new Date(`${start}T00:00:00`)
    if (Number.isNaN(first.getTime())) return []
    let t = first.getTime()
    return roadmap.steps.map((s, i) => ({ s, i })).filter(({ s, i }) => !doneSteps.includes(i) && s.title).map(({ s, i }) => {
      const from = new Date(t); const to = new Date(t + weeks * 7 * DAY - DAY); t += weeks * 7 * DAY
      return { n: i + 1, title: s.title, skills: s.skills || [], from, to }
    })
  }, [roadmap, doneSteps, weeks, start])

  const text = () => `${roadmap.title}: my study plan (${hours} hours a week, ${weeks} week${weeks > 1 ? 's' : ''} per step)\n\n` + plan.map((p) => `Step ${p.n}: ${p.title}\n${fmt(p.from)} to ${fmt(p.to)}\nSkills: ${p.skills.join(', ') || 'see the roadmap'}\n`).join('\n')
  const ics = () => {
    const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
    const ev = plan.map((p, k) => ['BEGIN:VEVENT', `UID:${roadmap.slug}-${p.n}-${k}@primeresumeai.com`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${ymd(p.from)}`, `DTEND;VALUE=DATE:${ymd(new Date(p.to.getTime() + DAY))}`, `SUMMARY:${(`Study: ${p.title}`).replace(/[,;\\]/g, ' ')}`, `DESCRIPTION:${p.skills.join(' / ').replace(/[,;\\]/g, ' ')}`, 'END:VEVENT'].join('\r\n'))
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Prime Resume AI//Roadmap plan//EN', ...ev, 'END:VCALENDAR'].join('\r\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = `${roadmap.slug}-plan.ics`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }
  const field = 'rounded-lg border-2 border-slate-900 bg-white px-2.5 py-1.5 text-sm'

  return (
    <section className='mt-8 rounded-lg border-2 border-slate-900 bg-white p-4 sm:p-5' aria-labelledby='plan-h' data-testid='roadmap-plan'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 id='plan-h' className='flex items-center gap-2 font-semibold text-slate-900'><LuCalendarDays className='size-5 text-purple-600' />Make my study plan</h2>
        <button type='button' aria-expanded={open} onClick={() => setOpen((v) => !v)} className='text-sm font-medium text-purple-700 hover:underline'>{open ? 'Hide' : 'Plan my weeks'}</button>
      </div>
      <p className='text-sm text-slate-600 mt-1'>Choose how many weeks to give each step and when to start. Steps you have ticked are left out. How long a step really takes depends on you, so adjust as you go.</p>
      {open && (
        <div className='mt-4'>
          <div className='flex flex-wrap items-end gap-4'>
            <label className='text-sm font-medium text-slate-700'>Weeks per step<select value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} className={`${field} block mt-1`}>{[1, 2, 3, 4, 6, 8].map((w) => <option key={w} value={w}>{w}</option>)}</select></label>
            <label className='text-sm font-medium text-slate-700'>Hours per week<select value={hours} onChange={(e) => setHours(Number(e.target.value))} className={`${field} block mt-1`}>{[2, 3, 5, 7, 10, 15, 20].map((h) => <option key={h} value={h}>{h}</option>)}</select></label>
            <label className='text-sm font-medium text-slate-700'>Start on<input type='date' value={start} onChange={(e) => setStart(e.target.value)} className={`${field} block mt-1`} /></label>
          </div>
          {plan.length === 0 ? <p className='text-sm text-slate-600 mt-4'>Every step is ticked, or the date is not valid.</p> : (
            <>
              <ol className='mt-4 space-y-2'>
                {plan.map((p) => (
                  <li key={p.n} className='rounded-lg border border-slate-300 p-3 text-sm'>
                    <p className='font-semibold text-slate-900'>Step {p.n}: {p.title}</p>
                    <p className='text-xs text-slate-500'>{fmt(p.from)} to {fmt(p.to)}, about {hours} hours a week</p>
                    {p.skills.length > 0 && <p className='text-xs text-slate-600 mt-1'>{p.skills.join(', ')}</p>}
                  </li>
                ))}
              </ol>
              <p className='text-xs text-slate-500 mt-3'>Finish date of the last step: <strong>{fmt(plan[plan.length - 1].to)}</strong>. This is a schedule you set, not a prediction.</p>
              <div className='flex flex-wrap gap-3 mt-3'>
                <button type='button' onClick={() => navigator.clipboard?.writeText(text()).then(() => toast.success('Plan copied'), () => toast.error('Could not copy'))} className='inline-flex items-center gap-1.5 rounded-full border-2 border-slate-900 px-4 py-1.5 text-sm font-medium hover:bg-slate-50'><LuCopy className='size-4' />Copy as text</button>
                <button type='button' onClick={ics} className='inline-flex items-center gap-1.5 rounded-full border-2 border-slate-900 px-4 py-1.5 text-sm font-medium hover:bg-slate-50'><LuDownload className='size-4' />Add to calendar (.ics)</button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  )
}
export default RoadmapPlan
