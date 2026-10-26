import React, { useEffect, useRef, useState } from 'react'
import { LuType, LuMinus, LuPlus, LuRotateCcw } from 'react-icons/lu'

// Reading options for lessons: font size and font family (Google Fonts). The choice is kept in this browser only.
export const FONTS = [
  { name: 'Outfit', label: 'Outfit (default)', stack: "'Outfit', sans-serif", gf: null },
  { name: 'Inter', label: 'Inter', stack: "'Inter', sans-serif", gf: 'Inter:wght@400;500;600;700' },
  { name: 'Open Sans', label: 'Open Sans', stack: "'Open Sans', sans-serif", gf: 'Open+Sans:wght@400;500;600;700' },
  { name: 'Roboto', label: 'Roboto', stack: "'Roboto', sans-serif", gf: 'Roboto:wght@400;500;700' },
  { name: 'Lato', label: 'Lato', stack: "'Lato', sans-serif", gf: 'Lato:wght@400;700' },
  { name: 'Nunito', label: 'Nunito', stack: "'Nunito', sans-serif", gf: 'Nunito:wght@400;600;700' },
  { name: 'Lexend', label: 'Lexend (easy to read)', stack: "'Lexend', sans-serif", gf: 'Lexend:wght@400;500;600;700' },
  { name: 'Atkinson Hyperlegible', label: 'Atkinson Hyperlegible (low vision)', stack: "'Atkinson Hyperlegible', sans-serif", gf: 'Atkinson+Hyperlegible:wght@400;700' },
  { name: 'Merriweather', label: 'Merriweather (serif)', stack: "'Merriweather', serif", gf: 'Merriweather:wght@400;700' },
  { name: 'Lora', label: 'Lora (serif)', stack: "'Lora', serif", gf: 'Lora:wght@400;500;600;700' },
  { name: 'Source Serif 4', label: 'Source Serif 4 (serif)', stack: "'Source Serif 4', serif", gf: 'Source+Serif+4:wght@400;600;700' },
  { name: 'System', label: 'Your device font', stack: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", gf: null },
]
export const SIZE_MIN = 14, SIZE_MAX = 24, SIZE_DEFAULT = 16
const KEY = 'prime_reading'

const clampSize = (n) => Math.min(SIZE_MAX, Math.max(SIZE_MIN, Math.round(Number(n)) || SIZE_DEFAULT))
const findFont = (name) => FONTS.find((f) => f.name === name) || FONTS[0]

// Load a Google font only when it is chosen, so nobody downloads fonts they do not use.
const loadFont = (font) => {
  if (!font.gf || typeof document === 'undefined') return
  const id = `gf-${font.name.replace(/\s+/g, '-')}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${font.gf}&display=swap`
  document.head.appendChild(link)
}

const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '{}')
    return { size: clampSize(v.size ?? SIZE_DEFAULT), font: findFont(v.font).name }
  } catch { return { size: SIZE_DEFAULT, font: FONTS[0].name } }
}

export function useReadingPrefs() {
  const [prefs, setPrefs] = useState(read)
  useEffect(() => { loadFont(findFont(prefs.font)) }, [prefs.font])
  const update = (patch) => setPrefs((p) => {
    const next = { ...p, ...patch, size: clampSize((patch.size ?? p.size)) }
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* private mode: ignore */ }
    return next
  })
  const reset = () => { try { localStorage.removeItem(KEY) } catch { /* ignore */ } setPrefs({ size: SIZE_DEFAULT, font: FONTS[0].name }) }
  return { prefs, update, reset, stack: findFont(prefs.font).stack }
}

export default function ReadingOptions({ prefs, update, reset }) {
  const [open, setOpen] = useState(false)
  const box = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    const onClick = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [open])

  return (
    <div className='relative' ref={box} data-no-i18n>
      <button type='button' onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls='reading-options'
        className='inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50'>
        <LuType className='size-4' aria-hidden='true' />Text options
      </button>
      {open && (
        <div id='reading-options' role='group' aria-label='Reading options'
          className='absolute left-0 sm:left-auto sm:right-0 z-20 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white p-4 shadow-lg'>
          <p className='text-sm font-semibold text-slate-800'>Font size</p>
          <div className='mt-2 flex items-center gap-2'>
            <button type='button' onClick={() => update({ size: prefs.size - 1 })} disabled={prefs.size <= SIZE_MIN} aria-label='Smaller text'
              className='grid size-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40'><LuMinus className='size-4' /></button>
            <input type='range' min={SIZE_MIN} max={SIZE_MAX} step={1} value={prefs.size} onChange={(e) => update({ size: e.target.value })}
              aria-label='Font size in pixels' className='flex-1 accent-brand-600' />
            <button type='button' onClick={() => update({ size: prefs.size + 1 })} disabled={prefs.size >= SIZE_MAX} aria-label='Larger text'
              className='grid size-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40'><LuPlus className='size-4' /></button>
          </div>
          <p className='mt-1 text-xs text-slate-500' aria-live='polite'>{prefs.size}px</p>

          <label htmlFor='reading-font' className='mt-3 block text-sm font-semibold text-slate-800'>Font</label>
          <select id='reading-font' value={prefs.font} onChange={(e) => update({ font: e.target.value })}
            className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700'>
            {FONTS.map((f) => <option key={f.name} value={f.name}>{f.label}</option>)}
          </select>

          <button type='button' onClick={reset} className='mt-4 inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900'>
            <LuRotateCcw className='size-4' aria-hidden='true' />Reset to default
          </button>
        </div>
      )}
    </div>
  )
}
