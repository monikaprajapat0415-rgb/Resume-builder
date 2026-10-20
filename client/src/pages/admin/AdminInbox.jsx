import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuCheck, LuX, LuTrash2, LuFlag } from 'react-icons/lu'

const KIND = { answers: 'Answer', salaries: 'Salary report', reviews: 'Company review' }
const TABS = [['', 'All'], ['answers', 'Answers'], ['salaries', 'Salary reports'], ['reviews', 'Reviews']]
const when = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const keyOf = (i) => `${i.type}:${i._id}`

const Body = ({ i }) => {
  if (i.type === 'answers') return <><p className='text-xs text-slate-400'>On: {i.question?.question || '(deleted question)'}</p><p className='text-sm text-slate-700 mt-1 whitespace-pre-line line-clamp-6'>{i.body}</p></>
  if (i.type === 'salaries') return <p className='text-sm text-slate-700'><strong>{i.roleTitle}</strong> · {i.amount?.toLocaleString()} {i.currency} per {i.period} · {i.country}{i.company ? ` · ${i.company}` : ''}</p>
  return <><p className='text-sm text-slate-700'><strong>{i.company}</strong> · {'★'.repeat(i.rating || 0)} · {i.title}</p>{i.pros && <p className='text-sm text-slate-600 mt-1'>Good: {i.pros}</p>}{i.cons && <p className='text-sm text-slate-600 mt-1'>Could be better: {i.cons}</p>}</>
}

const AdminInbox = () => {
  const { token } = useSelector((s) => s.auth)
  const auth = useMemo(() => ({ headers: { Authorization: token } }), [token])
  const [type, setType] = useState('')
  const [reported, setReported] = useState(false)
  const [items, setItems] = useState(null)
  const [sel, setSel] = useState({})
  const [hiring, setHiring] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    api.get(`/api/admin/inbox?${type ? `type=${type}&` : ''}${reported ? 'reported=1' : ''}`, auth)
      .then(({ data }) => setItems(data.items)).catch((e) => { setItems([]); toast.error(e.response?.data?.message || 'Could not load.') })
  }, [type, reported, auth])
  useEffect(() => { setItems(null); setSel({}); load() }, [load])
  useEffect(() => { api.get('/api/admin/hiring/stats', auth).then(({ data }) => setHiring(data)).catch(() => {}) }, [auth])

  const chosen = (items || []).filter((i) => sel[keyOf(i)])
  const run = async (action, list) => {
    if (!list.length) return
    if (action === 'delete' && !window.confirm(`Delete ${list.length} item${list.length > 1 ? 's' : ''} permanently?`)) return
    setBusy(true)
    try {
      const { data } = await api.post('/api/admin/inbox/bulk', { action, items: list.map((i) => ({ type: i.type, id: i._id })) }, auth)
      toast.success(`${data.done} ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'deleted'}.`)
      setSel({}); load(); window.dispatchEvent(new Event('admin-review-changed'))
    } catch (e) { toast.error(e.response?.data?.message || 'Failed.') } finally { setBusy(false) }
  }
  const allOn = items?.length > 0 && chosen.length === items.length

  return (
    <div>
      <h1 className='text-2xl font-semibold text-slate-800 mb-1'>Moderation inbox</h1>
      <p className='text-sm text-slate-500 mb-5'>Everything waiting for a decision in one place. Approving a reported item clears its reports.</p>

      {hiring && (hiring.pendingEmployers > 0 || hiring.pendingJobs > 0) && (
        <div className='mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 flex flex-wrap gap-x-6 gap-y-1'>
          {hiring.pendingEmployers > 0 && <Link to='/admin/hiring' className='hover:underline'>{hiring.pendingEmployers} employer{hiring.pendingEmployers > 1 ? 's' : ''} waiting for approval →</Link>}
          {hiring.pendingJobs > 0 && <Link to='/admin/hiring' className='hover:underline'>{hiring.pendingJobs} employer job{hiring.pendingJobs > 1 ? 's' : ''} waiting for review →</Link>}
        </div>
      )}

      <div className='flex flex-wrap items-center gap-2 mb-4'>
        {TABS.map(([v, l]) => <button key={v || 'all'} onClick={() => setType(v)} className={`px-3 py-1 rounded-full text-xs border ${type === v ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-200 bg-white text-slate-600'}`}>{l}</button>)}
        <label className='ml-2 flex items-center gap-1.5 text-xs text-slate-600'><input type='checkbox' checked={reported} onChange={(e) => setReported(e.target.checked)} /> Reported only</label>
      </div>

      {items === null ? <p className='text-slate-400'>Loading…</p> : items.length === 0 ? (
        <p className='text-green-700 text-sm'>You are all caught up. Nothing is waiting.</p>
      ) : (
        <>
          <div className='sticky top-0 z-10 flex flex-wrap items-center gap-2 bg-slate-50/95 backdrop-blur py-2 mb-2'>
            <label className='flex items-center gap-2 text-sm text-slate-600'><input type='checkbox' checked={allOn} onChange={(e) => setSel(e.target.checked ? Object.fromEntries(items.map((i) => [keyOf(i), true])) : {})} aria-label='Select all' /> {chosen.length ? `${chosen.length} selected` : `${items.length} waiting`}</label>
            <button disabled={!chosen.length || busy} onClick={() => run('approve', chosen)} className='ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-green-600 text-white text-sm disabled:opacity-40'><LuCheck className='size-4' />Approve</button>
            <button disabled={!chosen.length || busy} onClick={() => run('reject', chosen)} className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-300 bg-white text-slate-700 text-sm disabled:opacity-40'><LuX className='size-4' />Reject</button>
            <button disabled={!chosen.length || busy} onClick={() => run('delete', chosen)} className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-red-200 bg-white text-red-600 text-sm disabled:opacity-40'><LuTrash2 className='size-4' />Delete</button>
          </div>
          <div className='space-y-3'>
            {items.map((i) => (
              <div key={keyOf(i)} className='rounded-xl border border-slate-200 bg-white p-4 flex gap-3'>
                <input type='checkbox' className='mt-1' checked={Boolean(sel[keyOf(i)])} onChange={(e) => setSel({ ...sel, [keyOf(i)]: e.target.checked })} aria-label={`Select ${KIND[i.type]} by ${i.user?.name || 'unknown'}`} />
                <div className='min-w-0 flex-1'>
                  <div className='flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2'>
                    <span className='px-2 py-0.5 rounded-full bg-slate-100 text-slate-600'>{KIND[i.type]}</span>
                    <span className={`px-2 py-0.5 rounded-full ${i.status === 'pending' ? 'bg-amber-100 text-amber-800' : i.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{i.status}</span>
                    {i.reportCount > 0 && <span className='inline-flex items-center gap-1 text-red-600'><LuFlag className='size-3' />{i.reportCount} report{i.reportCount > 1 ? 's' : ''}</span>}
                    <span>{when(i.createdAt)} · {i.user?.name || 'unknown'}{i.user?.email ? ` (${i.user.email})` : ''}</span>
                  </div>
                  <Body i={i} />
                </div>
                <div className='flex flex-col gap-1 shrink-0'>
                  <button disabled={busy} onClick={() => run('approve', [i])} className='p-2 rounded-md hover:bg-green-50' title='Approve'><LuCheck className='size-4 text-green-600' /></button>
                  <button disabled={busy} onClick={() => run('reject', [i])} className='p-2 rounded-md hover:bg-slate-100' title='Reject'><LuX className='size-4 text-slate-600' /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <p className='text-xs text-slate-400 mt-6'>Need to edit wording before approving? Use <Link to='/admin/community' className='text-brand-700 hover:underline'>the full community tools</Link>.</p>
    </div>
  )
}

export default AdminInbox
