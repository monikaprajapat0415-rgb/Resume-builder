import React, { useState } from 'react'
import { LuPlus, LuTrash2 } from 'react-icons/lu'

export const inputCls = 'w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500'

export const Field = ({ label, hint, required, children }) => (
  <label className='block'>
    <span className='block text-sm font-medium text-slate-700 mb-1'>{label}{required && <span className='text-red-500'> *</span>}</span>
    {children}
    {hint && <span className='block text-xs text-slate-500 mt-1'>{hint}</span>}
  </label>
)

export const Text = ({ label, hint, required, value, onChange, ...rest }) => (
  <Field label={label} hint={hint} required={required}>
    <input className={inputCls} value={value || ''} onChange={(e) => onChange(e.target.value)} {...rest} />
  </Field>
)

export const Area = ({ label, hint, required, value, onChange, rows = 4, ...rest }) => (
  <Field label={label} hint={hint} required={required}>
    <textarea className={inputCls} rows={rows} value={value || ''} onChange={(e) => onChange(e.target.value)} {...rest} />
  </Field>
)

// Edits a list of strings as text, one item per line (or comma separated when `commas`).
// Keeps the raw text locally so Enter / trailing commas behave while typing; remount with a new `key` to reset.
export const Lines = ({ label, hint, value, onChange, rows = 3, commas = false, placeholder }) => {
  const [raw, setRaw] = useState((value || []).join(commas ? ', ' : '\n'))
  const split = commas ? /[\n,]+/ : /\n/
  return (
    <Field label={label} hint={hint}>
      <textarea className={inputCls} rows={rows} value={raw} placeholder={placeholder}
        onChange={(e) => { setRaw(e.target.value); onChange(e.target.value.split(split).map((x) => x.trim()).filter(Boolean)) }} />
    </Field>
  )
}

// A list of cards (education, experience...) with add / remove.
export const Repeater = ({ items, onChange, blank, addLabel, render, emptyText, max = 12 }) => {
  const set = (i, patch) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  return (
    <div className='space-y-4'>
      {items.length === 0 && emptyText && <p className='text-sm text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4'>{emptyText}</p>}
      {items.map((it, i) => (
        <div key={i} className='border border-slate-200 rounded-xl p-4 bg-white space-y-3 relative'>
          <button type='button' onClick={() => onChange(items.filter((_, idx) => idx !== i))} aria-label='Remove' className='absolute top-3 right-3 p-1.5 rounded-md hover:bg-red-50 text-red-500'><LuTrash2 className='size-4' /></button>
          {render(it, (patch) => set(i, patch), i)}
        </div>
      ))}
      {items.length < max && (
        <button type='button' onClick={() => onChange([...items, { ...blank }])} className='inline-flex items-center gap-2 text-sm font-medium text-brand-700 border border-brand-300 hover:bg-brand-50 rounded-lg px-4 py-2 transition'>
          <LuPlus className='size-4' />{addLabel}
        </button>
      )}
    </div>
  )
}
