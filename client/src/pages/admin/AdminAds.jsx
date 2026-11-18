import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import SettingsHistory from '../../components/admin/SettingsHistory'
import useUnsavedWarning from '../../utils/useUnsavedWarning'

const Switch = ({ on, busy, onChange, label }) => (
  <button type='button' role='switch' aria-checked={on} aria-label={label} disabled={busy} onClick={() => onChange(!on)}
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:opacity-60 ${on ? 'bg-brand-600' : 'bg-slate-300'}`}>
    <span className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
)
const Row = ({ title, text, children }) => (
  <div className='flex items-start justify-between gap-4 py-4 border-t border-slate-100 first:border-t-0'>
    <div className='min-w-0'><h3 className='font-medium text-slate-800'>{title}</h3><p className='text-sm text-slate-500 mt-0.5'>{text}</p></div>
    {children}
  </div>
)
const field = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-300'

const AdminAds = () => {
  const { token } = useSelector((s) => s.auth)
  const headers = { headers: { Authorization: token } }
  const [s, setS] = useState(null)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({})
  const isDirty = () => ['publisherId', 'slotBlog', 'slotLessons', 'slotInterview', 'adsTxt'].some((k) => (form[k] || '') !== (s?.[k] || ''))

  useEffect(() => {
    api.get('/api/admin/ads', headers).then(({ data }) => { setS(data.settings); setForm(data.settings) }).catch(() => toast.error('Could not load the ad settings.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useUnsavedWarning(Boolean(s) && isDirty())
  if (!s) return <p className='text-slate-400'>Loading…</p>

  const save = async (patch) => {
    setBusy(true)
    try { const { data } = await api.put('/api/admin/ads', patch, headers); setS(data.settings); setForm(data.settings); toast.success(data.message) }
    catch (e) { toast.error(e.response?.data?.message || 'Could not save.') }
    setBusy(false)
  }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const dirty = ['publisherId', 'slotBlog', 'slotLessons', 'slotInterview', 'adsTxt'].some((k) => (form[k] || '') !== (s[k] || ''))

  return (
    <div className='max-w-3xl'>
      <h1 className='text-2xl font-semibold text-slate-800 mb-1'>Ads and cookies</h1>
      <p className='text-sm text-slate-500 mb-6'>Ads are off until you switch them on here. A change takes effect within a few seconds. Apply to Google AdSense first; ads only show with a publisher ID and an ad unit ID for the page type.</p>

      <section className='bg-white rounded-xl border border-slate-200 px-5 mb-6'>
        <Row title='Show ads' text='Master switch. Off means no ad script loads on any page.'>
          <Switch on={s.enabled} busy={busy} onChange={(v) => save({ enabled: v })} label='Show ads' />
        </Row>
        <Row title='Blog articles' text='An ad unit inside blog posts.'><Switch on={s.onBlog} busy={busy} onChange={(v) => save({ onBlog: v })} label='Ads on blog articles' /></Row>
        <Row title='Learn lessons' text='An ad unit inside course lessons.'><Switch on={s.onLessons} busy={busy} onChange={(v) => save({ onLessons: v })} label='Ads on lessons' /></Row>
        <Row title='Interview answers' text='An ad unit on interview question and answer pages.'><Switch on={s.onInterview} busy={busy} onChange={(v) => save({ onInterview: v })} label='Ads on interview answers' /></Row>
        <Row title='No ads in Europe' text='Hides ads for visitors whose browser time zone is in Europe. Keep this on until a Google-approved consent tool (for example Google’s own messaging in AdSense) is set up. It is an approximate check, not a location lookup.'>
          <Switch on={s.hideInEurope} busy={busy} onChange={(v) => save({ hideInEurope: v })} label='Hide ads in Europe' />
        </Row>
        <Row title='Cookie banner' text='Shows the accept or reject choice and sets Google’s consent signals. Turn it off only if another consent tool (such as Google’s own) already shows one, so visitors do not get two.'>
          <Switch on={s.cookieBanner} busy={busy} onChange={(v) => save({ cookieBanner: v })} label='Show the cookie banner' />
        </Row>
      </section>

      <section className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
        <h2 className='font-semibold text-slate-800'>AdSense details</h2>
        <label className='block text-sm'>Publisher ID<input value={form.publisherId || ''} onChange={set('publisherId')} placeholder='pub-1234567890123456' className={field} /></label>
        <div className='grid sm:grid-cols-3 gap-3'>
          <label className='block text-sm'>Blog ad unit ID<input value={form.slotBlog || ''} onChange={set('slotBlog')} inputMode='numeric' className={field} /></label>
          <label className='block text-sm'>Lesson ad unit ID<input value={form.slotLessons || ''} onChange={set('slotLessons')} inputMode='numeric' className={field} /></label>
          <label className='block text-sm'>Interview ad unit ID<input value={form.slotInterview || ''} onChange={set('slotInterview')} inputMode='numeric' className={field} /></label>
        </div>
        <label className='block text-sm'>Extra ads.txt lines (optional)
          <textarea value={form.adsTxt || ''} onChange={set('adsTxt')} rows={4} className={`${field} font-mono`} placeholder='One line per ad partner. The Google line is added for you from the publisher ID.' />
        </label>
        <p className='text-xs text-slate-500'>Your ads.txt file is at <a href='/ads.txt' target='_blank' rel='noreferrer' className='text-brand-700 underline'>/ads.txt</a> (empty until a publisher ID is saved). An ad unit with no ID, or a page type that is switched off, shows nothing.</p>
        <button type='button' disabled={busy || !dirty} onClick={() => save({ publisherId: form.publisherId, slotBlog: form.slotBlog, slotLessons: form.slotLessons, slotInterview: form.slotInterview, adsTxt: form.adsTxt })}
          className='rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50'>Save details</button>
      </section>
      <SettingsHistory settingsKey='ads' onRestored={() => window.location.reload()} />
    </div>
  )
}
export default AdminAds
