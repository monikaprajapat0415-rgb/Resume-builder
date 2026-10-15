import React, { useRef, useState } from 'react'
import { LuPlus, LuX } from 'react-icons/lu'
import { splitPasted } from '../../utils/cvSuggestions'

const norm = (s) => String(s || '').trim().toLowerCase()

// Type and press Enter or comma to add. Paste a whole list to add many at once. Backspace on an empty box removes the last one.
export const ChipInput = ({ label, hint, value = [], onChange, placeholder, max = 40, maxLen = 80, suggestionGroups = [], countHint }) => {
  const [text, setText] = useState('')
  const ref = useRef(null)
  const has = (s) => value.some((v) => norm(v) === norm(s))
  const add = (items) => {
    const next = [...value]
    for (const raw of Array.isArray(items) ? items : [items]) {
      const s = String(raw).trim().slice(0, maxLen)
      if (s && !next.some((v) => norm(v) === norm(s)) && next.length < max) next.push(s)
    }
    if (next.length !== value.length) onChange(next)
  }
  const commit = () => { if (text.trim()) { add(splitPasted(text)); setText('') } }
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i))

  return (
    <div>
      <div className='flex items-baseline justify-between gap-3'>
        <label className='block text-sm font-medium text-slate-700 mb-1' htmlFor={`chip-${label}`}>{label}</label>
        {countHint && <span className='text-xs text-slate-500'>{countHint(value.length)}</span>}
      </div>
      <div onClick={() => ref.current?.focus()} className='flex flex-wrap gap-1.5 p-2 border border-slate-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-brand-200 focus-within:border-brand-500 cursor-text'>
        {value.map((v, i) => (
          <span key={`${v}-${i}`} className='inline-flex items-center gap-1 pl-2.5 pr-1 py-1 text-sm rounded-full bg-brand-50 text-brand-800 border border-brand-200'>
            {v}
            <button type='button' aria-label={`Remove ${v}`} onClick={(e) => { e.stopPropagation(); remove(i) }} className='p-0.5 rounded-full hover:bg-brand-100'><LuX className='size-3.5' /></button>
          </span>
        ))}
        <input id={`chip-${label}`} ref={ref} value={text} placeholder={value.length ? '' : placeholder} maxLength={maxLen * 3}
          onChange={(e) => { const v = e.target.value; if (/[,;\n]/.test(v)) { add(splitPasted(v)); setText('') } else setText(v) }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commit() }
            else if (e.key === 'Backspace' && !text && value.length) remove(value.length - 1)
          }}
          onBlur={commit}
          onPaste={(e) => { const t = e.clipboardData.getData('text'); if (/[\n,;•|]/.test(t)) { e.preventDefault(); add(splitPasted(t)) } }}
          className='flex-1 min-w-[8rem] px-1.5 py-1 text-sm outline-none bg-transparent' />
      </div>
      {hint && <p className='text-xs text-slate-500 mt-1'>{hint}</p>}
      {value.length >= max && <p className='text-xs text-amber-700 mt-1'>You have reached the limit of {max}.</p>}
      {suggestionGroups.map((gr) => {
        const items = gr.items.filter((s) => !has(s))
        if (!items.length) return null
        return (
          <div key={gr.id} className='mt-2.5' data-testid={`sugg-${gr.id}`}>
            <div className='flex items-center justify-between'>
              <p className='text-xs font-medium text-slate-500'>{gr.label}</p>
              {items.length > 1 && <button type='button' onClick={() => add(items)} className='text-xs text-brand-700 hover:underline'>Add all ({items.length})</button>}
            </div>
            <div className='flex flex-wrap gap-1.5 mt-1'>
              {items.map((s) => (
                <button type='button' key={s} onClick={() => add(s)} aria-label={`Add ${s}`} className='inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border border-dashed border-slate-300 text-slate-700 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800 transition'>
                  <LuPlus className='size-3' />{s}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// For longer lines (achievements, other information): one row each, Enter to add.
export const ListInput = ({ label, hint, value = [], onChange, placeholder, max = 10, quick = [], quickLabel = 'Quick add' }) => {
  const [text, setText] = useState('')
  const has = (s) => value.some((v) => norm(v) === norm(s))
  const add = (s) => { const t = String(s).trim().slice(0, 250); if (t && !has(t) && value.length < max) onChange([...value, t]) }
  const commit = () => { if (text.trim()) { add(text); setText('') } }
  return (
    <div>
      <label className='block text-sm font-medium text-slate-700 mb-1' htmlFor={`list-${label}`}>{label}</label>
      <div className='flex gap-2'>
        <input id={`list-${label}`} value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} maxLength={250}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit() } }}
          className='flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500' />
        <button type='button' onClick={commit} disabled={!text.trim()} className='px-3 py-2 text-sm rounded-lg bg-slate-800 text-white disabled:opacity-40 inline-flex items-center gap-1'><LuPlus className='size-4' />Add</button>
      </div>
      {hint && <p className='text-xs text-slate-500 mt-1'>{hint}</p>}
      {value.length > 0 && (
        <ul className='mt-2 space-y-1.5'>
          {value.map((v, i) => (
            <li key={`${v}-${i}`} className='flex items-start justify-between gap-2 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5'>
              <span className='text-slate-800'>{v}</span>
              <button type='button' aria-label={`Remove ${v}`} onClick={() => onChange(value.filter((_, idx) => idx !== i))} className='p-0.5 text-slate-400 hover:text-red-600'><LuX className='size-4' /></button>
            </li>
          ))}
        </ul>
      )}
      {quick.filter((q) => !has(q)).length > 0 && (
        <div className='mt-2'>
          <p className='text-xs font-medium text-slate-500'>{quickLabel}</p>
          <div className='flex flex-wrap gap-1.5 mt-1'>
            {quick.filter((q) => !has(q)).map((q) => (
              <button type='button' key={q} onClick={() => add(q)} aria-label={`Add ${q}`} className='inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border border-dashed border-slate-300 text-slate-700 hover:border-brand-500 hover:bg-brand-50 transition'><LuPlus className='size-3' />{q}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
