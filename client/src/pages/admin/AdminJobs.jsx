import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuPlay, LuTrash2, LuRefreshCw, LuPlus, LuCircleAlert, LuCircleCheck } from 'react-icons/lu'
import api from '../../configs/api'

const TYPES = [
  ['greenhouse', 'Greenhouse', 'Board name from boards.greenhouse.io/<name>', true],
  ['lever', 'Lever', 'Board name from jobs.lever.co/<name>', true],
  ['ashby', 'Ashby', 'Board name from jobs.ashbyhq.com/<name>', true],
  ['arbeitnow', 'Arbeitnow (many companies, mostly Europe)', '', false],
  ['adzuna', 'Adzuna (needs API keys, covers India)', 'Country code, e.g. in', false],
]
const fmt = (d) => (d ? new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Never')

const AdminJobs = () => {
  const { token } = useSelector((state) => state.auth)
  const headers = { headers: { Authorization: token } }
  const [data, setData] = useState({ sources: [], activeJobs: 0, syncing: false, adzunaConfigured: false })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [form, setForm] = useState({ type: 'greenhouse', company: '', token: '', query: '' })

  const load = useCallback(() => api.get('/api/admin/job-sources', headers).then(({ data }) => setData(data))
    .catch((e) => toast.error(e.response?.data?.message || 'Could not load sources.')).finally(() => setLoading(false)), [token])
  useEffect(() => { load() }, [load])
  useEffect(() => { if (!data.syncing) return; const t = setInterval(load, 3000); return () => clearInterval(t) }, [data.syncing, load])

  const call = async (key, fn, okMsg) => {
    setBusy(key)
    try { const r = await fn(); if (okMsg) toast.success(typeof okMsg === 'function' ? okMsg(r.data) : okMsg); await load() }
    catch (e) { toast.error(e.response?.data?.message || 'Something went wrong.'); await load() }
    finally { setBusy('') }
  }

  const meta = TYPES.find((t) => t[0] === form.type)
  const add = (e) => {
    e.preventDefault()
    call('add', () => api.post('/api/admin/job-sources', form, headers), 'Source added. Press Run to fetch its jobs.').then(() => setForm({ ...form, company: '', token: '', query: '' }))
  }

  return (
    <div>
      <div className='flex flex-wrap items-center justify-between gap-3 mb-2'>
        <h1 className='text-2xl font-semibold text-slate-800'>Jobs <span className='text-sm font-normal text-slate-400'>{data.activeJobs.toLocaleString()} live listings</span></h1>
        <div className='flex gap-2'>
          <button onClick={() => call('seed', () => api.post('/api/admin/job-sources/seed', {}, headers), (r) => `${r.added} starter source(s) added`)} disabled={!!busy}
            className='px-4 py-2 border border-slate-200 rounded-full text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50'>Add starter companies</button>
          <button onClick={() => call('all', () => api.post('/api/admin/job-sources/sync-all', {}, headers), 'Sync started. Results appear below.')} disabled={!!busy || data.syncing}
            className='inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium disabled:opacity-50'>
            <LuRefreshCw className={`size-4 ${data.syncing ? 'animate-spin' : ''}`} />{data.syncing ? 'Syncing…' : 'Sync all now'}
          </button>
        </div>
      </div>
      <p className='text-sm text-slate-500 mb-5 max-w-3xl'>Jobs are pulled from companies' public career-page feeds and refreshed automatically every 12 hours. Visitors always apply on the employer's own site. Public listings are at <a href='/jobs' target='_blank' rel='noreferrer' className='text-brand-700 hover:underline'>/jobs</a>.</p>

      <form onSubmit={add} className='bg-white rounded-xl border border-slate-200 p-4 mb-6 grid md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-3 items-end'>
        <label className='text-xs text-slate-500'>Source
          <select value={form.type} onChange={(e) => setForm({ type: e.target.value, company: '', token: '', query: '' })} className='mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white'>
            {TYPES.map((t) => <option key={t[0]} value={t[0]}>{t[1]}</option>)}
          </select>
        </label>
        {meta[3] && <label className='text-xs text-slate-500'>Company name<input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder='Stripe' className='mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm' /></label>}
        {meta[2] && <label className='text-xs text-slate-500'>{form.type === 'adzuna' ? 'Country' : 'Board name'}<input value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} placeholder={form.type === 'adzuna' ? 'in' : 'stripe'} title={meta[2]} className='mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm' /></label>}
        {(form.type === 'adzuna' || form.type === 'arbeitnow') && <label className='text-xs text-slate-500'>Keyword (optional)<input value={form.query} onChange={(e) => setForm({ ...form, query: e.target.value })} placeholder='developer' className='mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm' /></label>}
        <button disabled={busy === 'add'} className='inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm disabled:opacity-50'><LuPlus className='size-4' />Add</button>
        {meta[2] && <p className='md:col-span-full text-xs text-slate-400'>{meta[2]}</p>}
        {form.type === 'adzuna' && !data.adzunaConfigured && <p className='md:col-span-full text-xs text-amber-600'>Add ADZUNA_APP_ID and ADZUNA_APP_KEY to server/.env (free keys from developer.adzuna.com) and restart, or this source will fail.</p>}
      </form>

      <div className='bg-white rounded-xl border border-slate-200 overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100'>
            <tr><th className='px-4 py-3'>Source</th><th className='px-4 py-3'>Live jobs</th><th className='px-4 py-3'>Last run</th><th className='px-4 py-3'>Enabled</th><th className='px-4 py-3 text-right'>Actions</th></tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {loading && <tr><td colSpan={5} className='px-4 py-6 text-center text-slate-400'>Loading…</td></tr>}
            {!loading && data.sources.length === 0 && <tr><td colSpan={5} className='px-4 py-8 text-center text-slate-400'>No sources yet. Press "Add starter companies" to begin.</td></tr>}
            {data.sources.map((s) => (
              <tr key={s._id}>
                <td className='px-4 py-3'><p className='font-medium text-slate-800'>{s.company || s.label}</p><p className='text-xs text-slate-400'>{s.label}{s.token ? ` · ${s.token}` : ''}{s.query ? ` · "${s.query}"` : ''}</p></td>
                <td className='px-4 py-3'>{s.activeJobs}</td>
                <td className='px-4 py-3'>
                  <span className='inline-flex items-center gap-1.5'>{s.lastStatus === 'ok' ? <LuCircleCheck className='size-4 text-green-600' /> : s.lastStatus === 'error' ? <LuCircleAlert className='size-4 text-red-500' /> : null}{fmt(s.lastRunAt)}</span>
                  {s.lastStatus === 'ok' && <p className='text-xs text-slate-400'>{s.lastCount} found</p>}
                  {s.lastStatus === 'error' && <p className='text-xs text-red-600 max-w-xs'>{s.lastError}</p>}
                </td>
                <td className='px-4 py-3'>
                  <input type='checkbox' checked={s.enabled} aria-label={`Enable ${s.company || s.label}`} onChange={(e) => call('t' + s._id, () => api.patch(`/api/admin/job-sources/${s._id}`, { enabled: e.target.checked }, headers))} />
                </td>
                <td className='px-4 py-3'>
                  <div className='flex justify-end gap-1'>
                    <button title='Fetch jobs now' disabled={!!busy} onClick={() => call('r' + s._id, () => api.post(`/api/admin/job-sources/${s._id}/run`, {}, headers), (r) => `${r.count} jobs fetched, ${r.closed} closed`)} className='p-2 rounded-md hover:bg-slate-100 disabled:opacity-40'>
                      {busy === 'r' + s._id ? <LuRefreshCw className='size-4 animate-spin' /> : <LuPlay className='size-4 text-slate-600' />}
                    </button>
                    <button title='Delete source and its jobs' disabled={!!busy} onClick={() => { if (window.confirm(`Delete ${s.company || s.label} and the ${s.activeJobs} jobs it imported?`)) call('d' + s._id, () => api.delete(`/api/admin/job-sources/${s._id}`, headers), 'Source deleted.') }} className='p-2 rounded-md hover:bg-slate-100 disabled:opacity-40'><LuTrash2 className='size-4 text-red-500' /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminJobs
