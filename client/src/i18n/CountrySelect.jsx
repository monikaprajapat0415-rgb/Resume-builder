import React, { useEffect, useRef, useState } from 'react'
import { LuChevronDown, LuCheck } from 'react-icons/lu'
import { useI18n } from './I18nProvider'
import { COUNTRIES, LANGS } from './countries'
import CountryFlag from './CountryFlag'

// Country dropdown with flags (and a language dropdown when the country has more than one). Changing it changes the
// language of the whole signed-in app and the headings/labels of resumes and CVs. A custom list is used because a
// native <select> cannot show images. It is keyboard friendly: arrows, Home/End, Enter/Space, Escape, type a letter.
export default function CountrySelect({ className = '' }) {
  const { country, lang, countryInfo, setLocale, t } = useI18n()
  const langs = countryInfo?.langs || ['en']
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef(null)
  const list = useRef(null)
  const btn = useRef(null)
  const current = COUNTRIES.find((c) => c.code === country) || COUNTRIES[0]
  const label = t('Country')

  const openList = () => { setActive(Math.max(0, COUNTRIES.findIndex((c) => c.code === country))); setOpen(true) }
  const choose = (code) => { setLocale(code); setOpen(false); btn.current?.focus() }

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!root.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown); document.addEventListener('touchstart', onDown)
    list.current?.focus()
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('touchstart', onDown) }
  }, [open])
  useEffect(() => { if (open) list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' }) }, [open, active])

  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); btn.current?.focus(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(COUNTRIES.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)) }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0) }
    else if (e.key === 'End') { e.preventDefault(); setActive(COUNTRIES.length - 1) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(COUNTRIES[active].code) }
    else if (e.key === 'Tab') setOpen(false)
    else if (e.key.length === 1) {
      const k = e.key.toLowerCase()
      const from = COUNTRIES.findIndex((c, i) => i > active && c.name.toLowerCase().startsWith(k))
      const any = from > -1 ? from : COUNTRIES.findIndex((c) => c.name.toLowerCase().startsWith(k))
      if (any > -1) setActive(any)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`} data-no-i18n>
      <div ref={root} className='relative'>
        <button ref={btn} type='button' aria-haspopup='listbox' aria-expanded={open} aria-label={`${label}: ${current.name}`}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={(e) => { if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); openList() } }}
          className='flex w-full min-w-[14rem] max-w-[18rem] items-center gap-2 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500'>
          <CountryFlag code={current.code} />
          <span className='min-w-0 truncate'>{current.name}</span>
          <LuChevronDown className={`size-4 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
        {open && (
          <ul ref={list} role='listbox' tabIndex={-1} aria-label={label} aria-activedescendant={`cs-opt-${COUNTRIES[active].code}`} onKeyDown={onKey}
            className='absolute start-0 sm:start-auto sm:end-0 z-[60] mt-1 max-h-80 w-80 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl focus:outline-none'>
            {COUNTRIES.map((c, i) => (
              <li key={c.code} id={`cs-opt-${c.code}`} role='option' aria-selected={c.code === country} data-active={i === active}
                onMouseEnter={() => setActive(i)} onClick={() => choose(c.code)}
                className={`flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm ${i === active ? 'bg-brand-50' : ''} ${c.code === country ? 'font-medium text-brand-700' : 'text-slate-800'}`}>
                <CountryFlag code={c.code} />
                <span className='min-w-0 flex-1 truncate'>{c.name}</span>
                {c.code === country && <LuCheck className='size-4 shrink-0' aria-hidden />}
              </li>
            ))}
          </ul>
        )}
      </div>
      {langs.length > 1 && (
        <select value={lang} onChange={(e) => setLocale(country, e.target.value)} aria-label={t('Language')}
          className='rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500'>
          {langs.map((l) => <option key={l} value={l}>{LANGS[l].native}</option>)}
        </select>
      )}
    </div>
  )
}
