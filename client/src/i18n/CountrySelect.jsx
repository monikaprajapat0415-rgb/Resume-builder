import React from 'react'
import { LuGlobe } from 'react-icons/lu'
import { useI18n } from './I18nProvider'
import { COUNTRIES, LANGS } from './countries'

// Country dropdown (and a language dropdown when the country has more than one). Changing it changes the language
// of the whole signed-in app and the headings/labels of resumes and CVs.
export default function CountrySelect({ className = '' }) {
  const { country, lang, countryInfo, setLocale, t } = useI18n()
  const langs = countryInfo?.langs || ['en']
  return (
    <div className={`flex items-center gap-2 ${className}`} data-no-i18n>
      <label className='flex items-center gap-1.5 text-sm text-slate-600'>
        <LuGlobe className='size-4' aria-hidden />
        <span className='sr-only'>{tr0(t, 'Country')}</span>
        <select value={country} onChange={(e) => setLocale(e.target.value)} aria-label={tr0(t, 'Country')}
          className='max-w-[11rem] rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500'>
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </label>
      {langs.length > 1 && (
        <select value={lang} onChange={(e) => setLocale(country, e.target.value)} aria-label={tr0(t, 'Language')}
          className='rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500'>
          {langs.map((l) => <option key={l} value={l}>{LANGS[l].native}</option>)}
        </select>
      )}
    </div>
  )
}
const tr0 = (t, s) => t(s)
