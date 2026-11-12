import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../configs/api'

const LANG_NAMES = { es: 'Spanish', fr: 'French', pt: 'Portuguese', ar: 'Arabic' }

// Admin: translate one lesson, line by line, next to the English. Everything not listed here (code,
// commands, quiz answers, the animation, the web address) is copied from the English and cannot change.
const LessonTranslations = ({ lessonId, auth }) => {
  const base = `/api/admin/learn/lessons/${lessonId}/translations`
  const [langs, setLangs] = useState([])
  const [lang, setLang] = useState('')
  const [rows, setRows] = useState(null)
  const [vals, setVals] = useState({})
  const [meta, setMeta] = useState({ published: false, status: '', stale: false })
  const [onlyEmpty, setOnlyEmpty] = useState(false)
  const [busy, setBusy] = useState(false)

  const loadLangs = () => api.get(base, auth).then(({ data }) => setLangs(data.langs)).catch(() => {})
  useEffect(() => { loadLangs() }, [lessonId]) // eslint-disable-line react-hooks/exhaustive-deps

  const open = async (code) => {
    setLang(code); setRows(null)
    try {
      const { data } = await api.get(`${base}/${code}`, auth)
      setRows(data.rows); setVals(Object.fromEntries(data.rows.map((r) => [r.k, r.tr]))); setMeta({ published: data.published, status: data.status, stale: data.stale })
    } catch (e) { toast.error(e.response?.data?.message || 'Could not load.') }
  }
  const run = async (fn, ok) => {
    setBusy(true)
    try { const { data } = await fn(); toast.success(ok || data.message); await loadLangs(); return data } catch (e) { toast.error(e.response?.data?.message || 'Failed.') } finally { setBusy(false) }
  }
  const save = async (published) => {
    const d = await run(() => api.put(`${base}/${lang}`, { units: vals, published, status: 'reviewed' }, auth))
    if (d) open(lang)
  }
  const draft = async () => {
    if (!window.confirm(`Draft the ${LANG_NAMES[lang]} translation with AI? It replaces the current text and stays hidden from readers until you publish it.`)) return
    const d = await run(() => api.post(`${base}/${lang}/draft`, {}, auth))
    if (d) open(lang)
  }
  const remove = async () => {
    if (!window.confirm(`Remove the ${LANG_NAMES[lang]} translation? Readers will see English.`)) return
    await run(() => api.delete(`${base}/${lang}`, auth))
    setLang(''); setRows(null)
  }
  const done = rows ? rows.filter((r) => (vals[r.k] || '').trim()).length : 0
  const shown = rows ? rows.filter((r) => !onlyEmpty || !(vals[r.k] || '').trim()) : []
  const area = 'w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300'

  return (
    <section className='mt-8 max-w-5xl bg-white rounded-xl border border-slate-200 p-5' aria-labelledby='tr-h'>
      <h2 id='tr-h' className='text-sm font-semibold text-slate-800'>Translations</h2>
      <p className='text-xs text-slate-500 mt-1 mb-3 max-w-2xl'>Readers see a published translation when they choose that language in the country and language menu. Code, commands, quiz answers and the animation stay as they are in English. Keep `backticks`, **bold** marks and links exactly as in the English line, or the line is refused. Save the lesson itself first if you changed the English.</p>
      <div className='flex flex-wrap gap-2 mb-4'>
        {langs.map((l) => (
          <button key={l.code} type='button' onClick={() => open(l.code)} aria-pressed={lang === l.code}
            className={`rounded-full border px-3 py-1.5 text-xs ${lang === l.code ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
            {l.name}{l.exists ? ` · ${l.done}/${l.total}${l.published ? ' · live' : ' · draft'}${l.stale ? ' · English changed' : ''}` : ' · none'}
          </button>
        ))}
      </div>
      {lang && !rows && <p className='text-sm text-slate-400'>Loading…</p>}
      {lang && rows && (<>
        <div className='flex flex-wrap items-center gap-2 mb-3'>
          <button type='button' disabled={busy} onClick={draft} className='rounded-full border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50 disabled:opacity-60'>Draft with AI</button>
          <button type='button' disabled={busy} onClick={() => save(false)} className='rounded-full border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50 disabled:opacity-60'>Save draft</button>
          <button type='button' disabled={busy} onClick={() => save(true)} className='rounded-full bg-brand-600 px-3 py-1.5 text-xs text-white hover:bg-brand-700 disabled:opacity-60'>Save and show to readers</button>
          {meta.published && <button type='button' disabled={busy} onClick={() => save(false)} className='rounded-full border border-amber-300 px-3 py-1.5 text-xs text-amber-800 hover:bg-amber-50'>Hide from readers</button>}
          <button type='button' disabled={busy} onClick={remove} className='ml-auto text-xs text-red-600 hover:underline'>Remove translation</button>
        </div>
        <p className='text-xs text-slate-500 mb-2'>
          {done} of {rows.length} lines translated. {meta.published ? 'Visible to readers.' : 'Not visible to readers yet.'}
          {meta.status === 'machine' && ' This is an AI draft that nobody has checked.'}
          {meta.stale && <strong className='text-amber-700'> The English changed after this was translated, so check the lines again.</strong>}
        </p>
        <label className='mb-3 flex items-center gap-2 text-xs text-slate-600'><input type='checkbox' checked={onlyEmpty} onChange={(e) => setOnlyEmpty(e.target.checked)} /> Show only lines still in English</label>
        <div className='divide-y divide-slate-100 border border-slate-200 rounded-lg'>
          {shown.map((r) => (
            <div key={r.k} className='grid md:grid-cols-2 gap-2 p-3'>
              <p className='text-sm text-slate-600 whitespace-pre-wrap'><span className='block text-[10px] uppercase tracking-wide text-slate-400'>{r.k}</span>{r.en}</p>
              <textarea value={vals[r.k] || ''} dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang} rows={Math.min(8, Math.max(2, Math.ceil(r.en.length / 70)))}
                onChange={(e) => setVals((v) => ({ ...v, [r.k]: e.target.value }))} aria-label={`${LANG_NAMES[lang]} for ${r.k}`} className={area} />
            </div>
          ))}
        </div>
      </>)}
    </section>
  )
}
export default LessonTranslations
