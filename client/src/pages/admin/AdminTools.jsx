import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { invalidateToolSettings } from '../../utils/toolSettings'
import CAREER from '../../content/careerTools.json'

const USE_KEY = { coverLetterTool: 'career-cover-letter', bulletTool: 'career-bullets', linkedinTool: 'career-linkedin', interviewTool: 'career-mock-interview' }

const Switch = ({ on, busy, onChange, label }) => (
  <button type='button' role='switch' aria-checked={on} aria-label={label} disabled={busy} onClick={() => onChange(!on)}
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:opacity-60 ${on ? 'bg-brand-600' : 'bg-slate-300'}`}>
    <span className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
)

const AdminTools = () => {
  const { token } = useSelector((s) => s.auth)
  const headers = { headers: { Authorization: token } }
  const [data, setData] = useState(null)
  const [busy, setBusy] = useState(false)
  const [limit, setLimit] = useState('')
  const [cLimit, setCLimit] = useState('')

  useEffect(() => {
    api.get('/api/admin/tools', headers).then(({ data }) => { setData(data); setLimit(String(data.settings.enhancerDailyLimit ?? 10)); setCLimit(String(data.settings.careerDailyLimit ?? 10)) }).catch(() => toast.error('Could not load the tool settings.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!data) return <p className='text-slate-400'>Loading…</p>

  const save = async (patch) => {
    setBusy(true)
    try {
      const { data: d } = await api.put('/api/admin/tools', patch, headers)
      setData((x) => ({ ...x, settings: d.settings })); invalidateToolSettings(); toast.success(d.message)
    } catch (e) { toast.error(e.response?.data?.message || 'Could not save.') }
    setBusy(false)
  }
  const on = data.settings.imageEnhancer
  const u = data.usage?.imageEnhancer

  return (
    <div className='max-w-3xl'>
      <h1 className='text-2xl font-semibold text-slate-800 mb-1'>Free tools</h1>
      <p className='text-sm text-slate-500 mb-6'>Show or hide the free tools on the website. A change takes effect within a few seconds.</p>

      <section className='bg-white rounded-xl border border-slate-200 p-5'>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0'>
            <h2 className='font-semibold text-slate-800 flex items-center gap-2'>Image Enhancer
              <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${on ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>{on ? 'Visible' : 'Hidden'}</span>
            </h2>
            <p className='text-sm text-slate-600 mt-1'>Sharpens photos and upscales them to 2K, 4K or 8K. Page: <Link to='/products/image-enhancer' className='text-brand-700 underline'>/products/image-enhancer</Link></p>
          </div>
          <Switch on={on} busy={busy} onChange={(v) => save({ imageEnhancer: v })} label='Show the Image Enhancer to visitors' />
        </div>

        <ul className='mt-4 text-sm text-slate-600 list-disc pl-5 space-y-1'>
          {on
            ? <>
                <li>Visitors see the tool page, the card on the Products page, the sitemap entry and the link in llms.txt.</li>
                <li>Today: {u?.today ?? 0} picture{u?.today === 1 ? '' : 's'} enhanced by {u?.usersToday ?? 0} user{u?.usersToday === 1 ? '' : 's'} (admins are not counted).</li>
              </>
            : <>
                <li>Visitors see "not available right now" instead of the tool, and the card is removed from the Products page.</li>
                <li>Search engines get a "not found" answer, and the page is taken out of the sitemap and llms.txt, so it drops out of search over time. Turn it back on and request indexing in Search Console to restore it.</li>
                <li>Uploads are refused for everyone except admins, so you can still test it.</li>
              </>}
        </ul>

        <div className='mt-5 border-t border-slate-200 pt-4 grid sm:grid-cols-2 gap-5'>
          <div>
            <label htmlFor='enh-limit' className='block text-sm font-medium text-slate-800'>Free pictures per user per day</label>
            <p className='text-xs text-slate-500 mt-0.5'>Whole number from 1 to 500. Admins are never limited.</p>
            <div className='mt-2 flex items-center gap-2'>
              <input id='enh-limit' type='number' min='1' max='500' value={limit} onChange={(e) => setLimit(e.target.value)} className='w-24 rounded-lg border border-slate-300 px-3 py-1.5 text-sm' />
              <button type='button' disabled={busy || String(data.settings.enhancerDailyLimit) === String(limit)} onClick={() => save({ enhancerDailyLimit: Number(limit) })} className='rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm px-4 py-1.5'>Save</button>
            </div>
          </div>
          <fieldset>
            <legend className='text-sm font-medium text-slate-800'>Mode the page starts on</legend>
            <p className='text-xs text-slate-500 mt-0.5'>Visitors can still change it.</p>
            <div className='mt-2 inline-flex rounded-lg border border-slate-300 bg-white p-0.5'>
              {[['pro', 'Natural pro'], ['standard', 'Standard sharpen']].map(([v, t]) => (
                <button key={v} type='button' disabled={busy} aria-pressed={data.settings.enhancerMode === v} onClick={() => save({ enhancerMode: v })}
                  className={`px-3 py-1.5 text-sm rounded-md ${data.settings.enhancerMode === v ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>{t}</button>
              ))}
            </div>
          </fieldset>
        </div>
        <p className='text-xs text-slate-400 mt-4'>The paid 8K option is set under Paid plan.</p>
      </section>

      <section className='bg-white rounded-xl border border-slate-200 p-5 mt-6'>
        <h2 className='font-semibold text-slate-800'>Career tools</h2>
        <p className='text-sm text-slate-600 mt-1'>Free tools on <Link to='/tools' className='text-brand-700 underline'>/tools</Link>. A hidden tool leaves the tools list, the sitemap and llms.txt, answers "not found" to search engines, and the AI ones refuse requests (admins can still test). The offer comparison runs in the visitor's browser.</p>
        <ul className='mt-4 divide-y divide-slate-100'>
          {CAREER.tools.map((t) => {
            const isOn = data.settings[t.flag] !== false
            const uses = data.usage?.career?.byTool?.[USE_KEY[t.flag]] ?? 0
            return (
              <li key={t.flag} className='flex items-start justify-between gap-4 py-3'>
                <div className='min-w-0'>
                  <p className='font-medium text-slate-800 flex flex-wrap items-center gap-2'>{t.name}
                    <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${isOn ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>{isOn ? 'Visible' : 'Hidden'}</span>
                  </p>
                  <p className='text-xs text-slate-500 mt-0.5'><Link to={t.path} className='text-brand-700 underline'>{t.path}</Link>{USE_KEY[t.flag] ? ` · ${uses} use${uses === 1 ? '' : 's'} today` : ' · runs in the browser, no AI'}</p>
                </div>
                <Switch on={isOn} busy={busy} onChange={(v) => save({ [t.flag]: v })} label={`Show ${t.name} to visitors`} />
              </li>
            )
          })}
        </ul>
        <div className='mt-4 border-t border-slate-200 pt-4'>
          <label htmlFor='career-limit' className='block text-sm font-medium text-slate-800'>Free AI uses per user per day (all career tools together)</label>
          <p className='text-xs text-slate-500 mt-0.5'>Whole number from 1 to 200. Admins are never limited. Today {data.usage?.career?.usersToday ?? 0} user{data.usage?.career?.usersToday === 1 ? '' : 's'} used them.</p>
          <div className='mt-2 flex items-center gap-2'>
            <input id='career-limit' type='number' min='1' max='200' value={cLimit} onChange={(e) => setCLimit(e.target.value)} className='w-24 rounded-lg border border-slate-300 px-3 py-1.5 text-sm' />
            <button type='button' disabled={busy || String(data.settings.careerDailyLimit) === String(cLimit)} onClick={() => save({ careerDailyLimit: Number(cLimit) })} className='rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm px-4 py-1.5'>Save</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminTools
