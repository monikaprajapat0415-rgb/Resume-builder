import React, { useMemo, useState } from 'react'
import { LuCheck, LuChevronDown, LuScanSearch, LuX } from 'react-icons/lu'
import { checkCv } from '../../utils/cvAtsCheck'

const tone = (s) => (s >= 80 ? ['text-emerald-700', 'bg-emerald-500'] : s >= 60 ? ['text-amber-700', 'bg-amber-500'] : ['text-red-700', 'bg-red-500'])

// Live ATS check of the CV being edited: instant, free, no AI call.
const CvAtsPanel = ({ cv, personal, target, level }) => {
  const r = useMemo(() => checkCv({ cv, personal, target, level }), [cv, personal, target, level])
  const [open, setOpen] = useState(false)
  const [txt, bar] = tone(r.score)
  const groups = [...new Set(r.checks.map((c) => c.group))]
  return (
    <div className='rounded-xl border border-slate-200 bg-white p-4' data-testid='cv-ats'>
      <div className='flex items-center gap-3'>
        <LuScanSearch className='size-5 text-brand-600 shrink-0' />
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-semibold text-slate-800'>CV ATS check <span className={`ml-1 text-lg ${txt}`} data-testid='cv-ats-score'>{r.score}/100</span></p>
          <div className='h-1.5 rounded-full bg-slate-100 mt-1.5 overflow-hidden'><div className={`h-full ${bar}`} style={{ width: `${r.score}%` }} /></div>
        </div>
        <button type='button' onClick={() => setOpen((o) => !o)} aria-expanded={open} className='text-xs text-brand-700 inline-flex items-center gap-1'>{open ? 'Hide' : 'Details'}<LuChevronDown className={`size-3.5 transition ${open ? 'rotate-180' : ''}`} /></button>
      </div>
      <p className='text-xs text-slate-500 mt-2'>A guide to structure, content and keyword match. It cannot guarantee how any real ATS will rank your CV.</p>
      {open && (
        <div className='mt-3 space-y-4'>
          {groups.map((g) => (
            <div key={g}>
              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1'>{g}</p>
              <ul className='space-y-1'>
                {r.checks.filter((c) => c.group === g).map((c) => (
                  <li key={c.label} className='flex gap-2 text-sm'>
                    {c.pass ? <LuCheck className='size-4 text-emerald-600 mt-0.5 shrink-0' /> : <LuX className='size-4 text-red-500 mt-0.5 shrink-0' />}
                    <span className='text-slate-700'>{c.label}{!c.pass && <span className='block text-xs text-slate-500'>{c.tip}</span>}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {r.hasJd ? (
            <div>
              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1'>Job keywords</p>
              <div className='flex flex-wrap gap-1.5'>
                {r.matched.map((k) => <span key={k} className='text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200'>{k}</span>)}
                {r.missing.map((k) => <span key={k} className='text-xs px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200'>{k}</span>)}
              </div>
              {r.missing.length > 0 && <p className='text-xs text-slate-500 mt-2'>Grey words are in the job post but not in your CV. Add one only if it is true for you, in your skills or experience details, then regenerate.</p>}
            </div>
          ) : <p className='text-xs text-slate-500'>Paste a job description in step 1 to see keyword matching.</p>}
        </div>
      )}
    </div>
  )
}
export default CvAtsPanel
