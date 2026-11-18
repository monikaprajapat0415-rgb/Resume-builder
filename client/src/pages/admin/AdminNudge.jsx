import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'

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

const AdminNudge = () => {
  const { token } = useSelector((s) => s.auth)
  const headers = { headers: { Authorization: token } }
  const [s, setS] = useState(null)
  const [form, setForm] = useState({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.get('/api/admin/nudge', headers).then(({ data }) => { setS(data.settings); setForm(data.settings) }).catch(() => toast.error('Could not load the settings.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!s) return <p className='text-slate-400'>Loading…</p>

  const save = async (patch) => {
    setBusy(true)
    try { const { data } = await api.put('/api/admin/nudge', patch, headers); setS(data.settings); setForm(data.settings); toast.success(data.message) }
    catch (e) { toast.error(e.response?.data?.message || 'Could not save.') }
    setBusy(false)
  }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const keys = ['title', 'body', 'button', 'delaySeconds', 'hideDays']
  const dirty = keys.some((k) => String(form[k] ?? '') !== String(s[k] ?? ''))
  const rate = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '–')

  return (
    <div className='max-w-3xl'>
      <h1 className='text-2xl font-semibold text-slate-800 mb-1'>Sign-up prompt</h1>
      <p className='text-sm text-slate-500 mb-6'>A small card in the corner that invites signed-out visitors to create a free account. It never covers the page. It appears only after the visitor has scrolled, clicked or typed, has been on the page for the delay below, and has answered the cookie banner. It is hidden for logged-in users, automated browsers and anyone who closed it recently. Changes apply within a few seconds.</p>

      <section className='bg-white rounded-xl border border-slate-200 px-5 mb-6'>
        <Row title='Show the sign-up card' text='Master switch.'><Switch on={s.enabled} busy={busy} onChange={(v) => save({ enabled: v })} label='Show the sign-up card' /></Row>
        <Row title='On the home page' text='Recommended.'><Switch on={s.onHome} busy={busy} onChange={(v) => save({ onHome: v })} label='Show on the home page' /></Row>
        <Row title='On blog, lessons and interview answers' text='Reaches readers who arrive from search. Off by default; try the home page first.'><Switch on={s.onContent} busy={busy} onChange={(v) => save({ onContent: v })} label='Show on content pages' /></Row>
      </section>

      <section className='bg-white rounded-xl border border-slate-200 p-5 space-y-4 mb-6'>
        <h2 className='font-semibold text-slate-800'>Wording and timing</h2>
        <label className='block text-sm'>Title (up to 70 characters)<input value={form.title || ''} onChange={set('title')} maxLength={70} className={field} /></label>
        <label className='block text-sm'>Text (up to 220 characters)<textarea value={form.body || ''} onChange={set('body')} maxLength={220} rows={3} className={field} /></label>
        <p className='text-xs text-slate-500'>Keep it honest: say what the account gives (saving and editing a resume). Do not promise jobs, interviews or salaries.</p>
        <div className='grid sm:grid-cols-3 gap-3'>
          <label className='block text-sm'>Button label<input value={form.button || ''} onChange={set('button')} maxLength={30} className={field} /></label>
          <label className='block text-sm'>Delay (seconds, 3–300)<input value={form.delaySeconds ?? ''} onChange={set('delaySeconds')} inputMode='numeric' className={field} /></label>
          <label className='block text-sm'>Hide after closing (days)<input value={form.hideDays ?? ''} onChange={set('hideDays')} inputMode='numeric' className={field} /></label>
        </div>
        <button type='button' disabled={busy || !dirty} onClick={() => save({ title: form.title, body: form.body, button: form.button, delaySeconds: Number(form.delaySeconds), hideDays: Number(form.hideDays) })}
          className='rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50'>Save wording and timing</button>
      </section>

      <section className='bg-white rounded-xl border border-slate-200 p-5'>
        <h2 className='font-semibold text-slate-800'>Results{s.statsSince ? ` since ${new Date(s.statsSince).toLocaleDateString()}` : ''}</h2>
        <div className='mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center'>
          {[['Shown', s.shown], ['Clicked', s.clicked], ['Closed', s.dismissed], ['Click rate', rate(s.clicked, s.shown)]].map(([k, v]) => (
            <div key={k} className='rounded-lg bg-slate-50 p-3'><p className='text-xl font-semibold text-slate-800'>{v}</p><p className='text-xs text-slate-500'>{k}</p></div>
          ))}
        </div>
        <p className='mt-3 text-xs text-slate-500'>Clicks mean the visitor pressed the button; they are not proof of a finished sign-up. Compare your new users in Analytics before and after, over at least two weeks. If bounce rate goes up, switch the card off.</p>
        <button type='button' disabled={busy} onClick={() => save({ resetStats: true })} className='mt-3 text-sm text-slate-500 underline hover:text-slate-700'>Reset results</button>
      </section>
    </div>
  )
}
export default AdminNudge
