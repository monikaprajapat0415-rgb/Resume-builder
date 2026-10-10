import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuCheck, LuRotateCcw, LuTriangleAlert } from 'react-icons/lu'
import api from '../../configs/api'
import { invalidateSiteContent } from '../../utils/siteContent'
import { applyTheme, contrastWithWhite, isHex, DEFAULT_PRIMARY, PRESETS } from '../../utils/theme'

// Full class names so Tailwind can see them (it cannot detect names built from a variable).
const SWATCHES = ['bg-brand-100', 'bg-brand-200', 'bg-brand-300', 'bg-brand-400', 'bg-brand-500', 'bg-brand-600', 'bg-brand-700', 'bg-brand-800', 'bg-brand-900']

const Card = ({ title, hint, children }) => (
  <section className='bg-white rounded-xl border border-slate-200 p-5'>
    <h2 className='text-sm font-semibold text-slate-800'>{title}</h2>
    {hint && <p className='text-xs text-slate-500 mt-1'>{hint}</p>}
    <div className='mt-4'>{children}</div>
  </section>
)

const AdminAppearance = () => {
  const { token } = useSelector(state => state.auth)
  const headers = { headers: { Authorization: token } }
  const [saved, setSaved] = useState(null)      // values from the server
  const [color, setColor] = useState(DEFAULT_PRIMARY)
  const [coverLetter, setCoverLetter] = useState(false)
  const [saving, setSaving] = useState(false)
  const savedColor = useRef(DEFAULT_PRIMARY)

  useEffect(() => {
    api.get('/api/admin/site-content', headers)
      .then(({ data }) => {
        const c = isHex(data.values.theme_primary) ? data.values.theme_primary.toLowerCase() : DEFAULT_PRIMARY
        savedColor.current = c
        setSaved(data.values); setColor(c); setCoverLetter(data.values.feature_cover_letter === 'true')
      })
      .catch((e) => { setSaved({}); toast.error(e.response?.data?.message || 'Could not load settings.') })
    // Leaving the page without saving puts the saved colour back.
    return () => applyTheme(savedColor.current)
  }, [])

  const pick = (value) => { setColor(value.toLowerCase()); if (isHex(value)) applyTheme(value, { persist: false }) }

  const ratio = isHex(color) ? contrastWithWhite(color) : 0
  const lowContrast = isHex(color) && ratio < 3
  const dirty = saved && (color !== savedColor.current || coverLetter !== (saved.feature_cover_letter === 'true'))

  const save = async () => {
    if (!isHex(color)) return toast.error('Enter a colour like #2563eb.')
    if (lowContrast) return toast.error('That colour is too light for white button text. Pick a darker one.')
    setSaving(true)
    try {
      const { data } = await api.put('/api/admin/site-content', { values: { theme_primary: color, feature_cover_letter: String(coverLetter) } }, headers)
      savedColor.current = color
      setSaved(data.values); invalidateSiteContent(); applyTheme(color)
      toast.success('Saved. Everyone now sees the new look.')
    } catch (e) { toast.error(e.response?.data?.message || 'Could not save.') }
    finally { setSaving(false) }
  }

  const reset = () => pick(DEFAULT_PRIMARY)

  if (!saved) return <p className='text-slate-400'>Loading…</p>

  return (
    <div className='max-w-3xl space-y-4'>
      <div>
        <h1 className='text-2xl font-semibold text-slate-800'>Appearance</h1>
        <p className='text-sm text-slate-500 mt-1'>Choose the main colour of the whole site and turn features on or off. The change shows here instantly, and goes live for everyone when you save.</p>
      </div>

      <Card title='Theme colour' hint='Used for buttons, links, highlights, badges and the footer across the homepage, builder, blog and admin.'>
        <div className='grid grid-cols-4 sm:grid-cols-8 gap-3' role='radiogroup' aria-label='Preset colours'>
          {PRESETS.map((p) => {
            const active = color === p.value
            return (
              <button key={p.value} type='button' role='radio' aria-checked={active} onClick={() => pick(p.value)} title={p.name}
                className={`group flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition ${active ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
                <span className='size-10 rounded-full grid place-items-center ring-offset-2 ring-offset-white' style={{ background: p.value, boxShadow: active ? `0 0 0 2px ${p.value}` : 'none' }}>
                  {active && <LuCheck className='size-5 text-white' />}
                </span>
                <span className='text-[11px] text-slate-500 text-center leading-tight'>{p.name.replace(' (default)', '')}</span>
              </button>
            )
          })}
        </div>

        <div className='mt-5 flex flex-wrap items-end gap-3'>
          <div>
            <label htmlFor='custom-colour' className='block text-xs text-slate-500 mb-1'>Or pick any colour</label>
            <div className='flex items-center gap-2'>
              <input id='custom-colour' type='color' value={isHex(color) ? color : DEFAULT_PRIMARY} onChange={(e) => pick(e.target.value)}
                className='!p-0.5 h-10 w-14 !rounded-md !border-slate-300 cursor-pointer bg-white' aria-label='Custom colour' />
              <input value={color} onChange={(e) => pick(e.target.value)} maxLength={7} spellCheck={false} aria-label='Colour code'
                className='w-28 px-3 py-2 border border-slate-200 rounded-md text-sm font-mono' />
            </div>
          </div>
          <button type='button' onClick={reset} className='inline-flex items-center gap-1.5 text-sm px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-50'>
            <LuRotateCcw className='size-4' /> Back to default green
          </button>
        </div>
        {!isHex(color) && <p className='text-xs text-red-500 mt-2'>Use a code like #2563eb.</p>}
        {lowContrast && (
          <p className='text-xs text-amber-700 mt-3 flex items-start gap-1.5'><LuTriangleAlert className='size-4 shrink-0' /> This colour is too light, so white button text would be hard to read. Pick a darker shade.</p>
        )}
      </Card>

      <Card title='Live preview' hint='This is how the new colour looks on common parts of the site.'>
        <div className='rounded-xl border border-slate-200 p-5 bg-gradient-to-br from-brand-50 to-white'>
          <span className='inline-flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-100 rounded-full px-3 py-1'>New · AI feature added</span>
          <p className='text-2xl font-semibold text-slate-800 mt-3'>Land your dream job with <span className='text-brand-600'>AI-powered</span> resumes.</p>
          <div className='flex flex-wrap items-center gap-3 mt-4'>
            <span className='px-5 py-2.5 bg-brand-600 text-white rounded-full text-sm font-medium'>Create my resume</span>
            <span className='px-5 py-2.5 border border-brand-600 text-brand-700 rounded-full text-sm font-medium'>Learn more</span>
            <span className='text-sm text-brand-700 underline'>A link</span>
          </div>
          <div className='flex gap-1.5 mt-4'>{SWATCHES.map((c) => <span key={c} className={`h-6 flex-1 rounded ${c}`} title={c.replace('bg-brand-', 'Shade ')} />)}</div>
        </div>
        <p className='text-xs text-slate-400 mt-3'>Colours inside resume templates and the pass/fail colours of the ATS score and SEO audit do not change.</p>
      </Card>

      <Card title='Features' hint='Switch parts of the app on or off without any code changes.'>
        <label className='flex items-start gap-3 cursor-pointer'>
          <input type='checkbox' checked={coverLetter} onChange={(e) => setCoverLetter(e.target.checked)} className='mt-1 size-4 rounded border-slate-300' />
          <span>
            <span className='text-sm text-slate-800'>Show the Cover Letter button in the resume builder</span>
            <span className='block text-xs text-slate-500'>Currently {saved.feature_cover_letter === 'true' ? 'shown' : 'hidden'} for users. Turn it on when you are ready to relaunch it.</span>
          </span>
        </label>
      </Card>

      <div className='sticky bottom-0 -mx-4 px-4 py-3 md:mx-0 md:px-0 bg-slate-50/90 backdrop-blur flex items-center gap-3'>
        <button type='button' onClick={save} disabled={saving || !dirty || !isHex(color) || lowContrast}
          className='px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed'>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {dirty && <span className='text-xs text-amber-700'>You have unsaved changes.</span>}
        <Link to='/admin' className='ml-auto text-sm text-slate-500 hover:text-slate-800'>Back to overview</Link>
      </div>
    </div>
  )
}

export default AdminAppearance
