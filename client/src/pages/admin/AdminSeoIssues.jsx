import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'

const STATUS = { open: 'Open', fixing: 'Fixing', validating: 'Validating in Search Console', fixed: 'Fixed', ignore: 'Ignore' }
const TONE = { open: 'bg-red-50 text-red-700', fixing: 'bg-amber-50 text-amber-700', validating: 'bg-blue-50 text-blue-700', fixed: 'bg-green-50 text-green-700', ignore: 'bg-slate-100 text-slate-500' }
const field = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-300'

const Row = ({ it, onSave, onDelete }) => {
  const [f, setF] = useState({ title: it.title, count: it.count, status: it.status, note: it.note, examples: (it.examples || []).join('\n'), checkedAt: (it.checkedAt || '').slice(0, 10) })
  const [open, setOpen] = useState(false)
  const dirty = JSON.stringify(f) !== JSON.stringify({ title: it.title, count: it.count, status: it.status, note: it.note, examples: (it.examples || []).join('\n'), checkedAt: (it.checkedAt || '').slice(0, 10) })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  return (
    <li className='rounded-xl border border-slate-200 bg-white p-4'>
      <button type='button' onClick={() => setOpen((o) => !o)} aria-expanded={open} className='flex w-full flex-wrap items-center gap-3 text-left'>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE[it.status]}`}>{STATUS[it.status]}</span>
        <span className='min-w-0 flex-1 font-medium text-slate-800'>{it.title}</span>
        <span className='text-sm text-slate-500'>{it.count} page{it.count === 1 ? '' : 's'}</span>
      </button>
      {open && (
        <div className='mt-4 space-y-3'>
          <label className='block text-sm'>Issue<input value={f.title} onChange={set('title')} className={field} maxLength={140} /></label>
          <div className='grid sm:grid-cols-3 gap-3'>
            <label className='block text-sm'>Pages affected<input value={f.count} onChange={set('count')} inputMode='numeric' className={field} /></label>
            <label className='block text-sm'>Status<select value={f.status} onChange={set('status')} className={field}>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
            <label className='block text-sm'>Count read on<input type='date' value={f.checkedAt} onChange={set('checkedAt')} className={field} /></label>
          </div>
          <label className='block text-sm'>Note (what to do, what you found)<textarea value={f.note} onChange={set('note')} rows={2} maxLength={600} className={field} /></label>
          <label className='block text-sm'>Example pages (one path per line, up to 10)<textarea value={f.examples} onChange={set('examples')} rows={3} className={`${field} font-mono`} placeholder='/jobs/some-job' /></label>
          <div className='flex gap-3'>
            <button type='button' disabled={!dirty} onClick={() => onSave(it._id, { ...f, count: Number(f.count), checkedAt: f.checkedAt || undefined })} className='rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50'>Save</button>
            <button type='button' onClick={() => onDelete(it)} className='rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50'>Delete</button>
          </div>
        </div>
      )}
    </li>
  )
}

const AdminSeoIssues = () => {
  const { token } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const [issues, setIssues] = useState(null)
  const [title, setTitle] = useState('')

  const load = useCallback(() => api.get('/api/admin/seo-issues', auth).then(({ data }) => setIssues(data.issues)).catch(() => toast.error('Could not load.')), [token]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [load])

  const act = async (fn, ok) => { try { await fn(); if (ok) toast.success(ok); load() } catch (e) { toast.error(e.response?.data?.message || 'Could not save.') } }
  const save = (id, body) => act(() => api.put(`/api/admin/seo-issues/${id}`, body, auth), 'Saved.')
  const del = (it) => window.confirm(`Delete "${it.title}"?`) && act(() => api.delete(`/api/admin/seo-issues/${it._id}`, auth), 'Deleted.')
  const add = (e) => { e.preventDefault(); if (title.trim()) act(() => api.post('/api/admin/seo-issues', { title }, auth).then(() => setTitle('')), 'Added.') }

  const open = (issues || []).filter((i) => !['fixed', 'ignore'].includes(i.status))
  return (
    <div className='max-w-3xl'>
      <h1 className='text-2xl font-semibold text-slate-800 mb-1'>Search Console checklist</h1>
      <p className='text-sm text-slate-500 mb-6'>A list you keep by hand of the issues Search Console reports, so nothing is forgotten. This page does not read Search Console: update the counts yourself when you check it (the "Count read on" date shows how old a number is).</p>
      {issues === null ? <p className='text-slate-400'>Loading…</p> : (
        <>
          <p className='text-sm text-slate-600 mb-3'>{open.length} open · {issues.length - open.length} fixed or ignored</p>
          {issues.length === 0 && (
            <div className='mb-4 rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600'>
              <p>No issues yet. Add the ones we found in November (157 different canonical, 378 not found, 208 alternate, 509 noindex, 48 not indexed, 6 duplicate, and the Job postings fix) as a starting point?</p>
              <button type='button' onClick={() => act(() => api.post('/api/admin/seo-issues', { starter: true }, auth), 'Starter list added.')} className='mt-3 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700'>Add the starter list</button>
            </div>
          )}
          <ul className='space-y-3'>{issues.map((it) => <Row key={it._id + it.updatedAt} it={it} onSave={save} onDelete={del} />)}</ul>
          <form onSubmit={add} className='mt-5 flex gap-2'>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Add an issue, e.g. Soft 404' maxLength={140} aria-label='New issue' className={field} />
            <button className='rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700'>Add</button>
          </form>
        </>
      )}
    </div>
  )
}
export default AdminSeoIssues
