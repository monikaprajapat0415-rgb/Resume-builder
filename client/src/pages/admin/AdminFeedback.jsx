import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuEye, LuEyeOff, LuTrash2, LuSearch, LuStar } from 'react-icons/lu'
import api from '../../configs/api'

const FILTERS = [['all', 'All'], ['visible', 'Visible'], ['hidden', 'Hidden']]
const fmt = (d) => new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const AdminFeedback = () => {
  const { token } = useSelector((state) => state.auth)
  const headers = { headers: { Authorization: token } }
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ items: [], pages: 1, total: 0, hidden: 0 })
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    return api.get('/api/admin/feedback', { ...headers, params: { status, q: query, page } })
      .then(({ data }) => setData(data))
      .catch((e) => toast.error(e.response?.data?.message || 'Could not load feedback.'))
      .finally(() => setLoading(false))
  }, [status, query, page, token])

  useEffect(() => { load() }, [load])
  useEffect(() => { const t = setTimeout(() => { setQuery(q.trim()); setPage(1) }, 300); return () => clearTimeout(t) }, [q])

  const setVisibility = async (f, next) => {
    try { await api.patch(`/api/admin/feedback/${f._id}`, { status: next }, headers); toast.success(next === 'hidden' ? 'Hidden from readers.' : 'Visible again.'); load() }
    catch (e) { toast.error(e.response?.data?.message || 'Could not update.') }
  }
  const remove = async (f) => {
    if (!window.confirm(`Delete the comment from ${f.name}? This cannot be undone.`)) return
    try { await api.delete(`/api/admin/feedback/${f._id}`, headers); toast.success('Comment deleted.'); load() }
    catch (e) { toast.error(e.response?.data?.message || 'Could not delete.') }
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold text-slate-800 mb-5'>Lesson feedback <span className='text-sm font-normal text-slate-400'>comments readers leave under tutorials{data.hidden > 0 && ` · ${data.hidden} hidden`}</span></h1>
      <div className='flex flex-wrap items-center gap-3 mb-4'>
        <div className='inline-flex rounded-full border border-slate-200 bg-white p-1'>
          {FILTERS.map(([k, label]) => (
            <button key={k} onClick={() => { setStatus(k); setPage(1) }} className={`px-4 py-1.5 rounded-full text-sm transition ${status === k ? 'bg-brand-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}>{label}</button>
          ))}
        </div>
        <div className='relative flex-1 min-w-48 max-w-sm'>
          <LuSearch className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400' />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search name or text' className='w-full pl-9 pr-3 py-2 border border-slate-200 rounded-full text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-300' />
        </div>
      </div>

      <div className='bg-white rounded-xl border border-slate-200 divide-y divide-slate-100'>
        {loading && data.items.length === 0 && <p className='p-6 text-sm text-slate-400 text-center'>Loading…</p>}
        {!loading && data.items.length === 0 && <p className='p-6 text-sm text-slate-400 text-center'>No feedback yet.</p>}
        {data.items.map((f) => (
          <div key={f._id} className={`p-4 ${f.status === 'hidden' ? 'bg-slate-50' : ''}`}>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-sm'>
              <span className='font-medium text-slate-800'>{f.name}</span>
              {f.user?.email && <span className='text-xs text-slate-400'>{f.user.email}</span>}
              {f.rating && <span className='inline-flex items-center gap-0.5 text-xs text-amber-600'><LuStar className='size-3.5 fill-amber-400 text-amber-400' />{f.rating}</span>}
              <span className='text-xs text-slate-400'>{fmt(f.createdAt)}</span>
              {f.status === 'hidden' && <span className='text-xs rounded-full bg-slate-200 text-slate-600 px-2 py-0.5'>Hidden</span>}
              <span className='ml-auto flex items-center gap-1'>
                <button onClick={() => setVisibility(f, f.status === 'hidden' ? 'visible' : 'hidden')} title={f.status === 'hidden' ? 'Show' : 'Hide'} className='p-2 rounded-md hover:bg-slate-100'>
                  {f.status === 'hidden' ? <LuEye className='size-4 text-slate-600' /> : <LuEyeOff className='size-4 text-slate-600' />}
                </button>
                <button onClick={() => remove(f)} title='Delete' className='p-2 rounded-md hover:bg-slate-100'><LuTrash2 className='size-4 text-red-500' /></button>
              </span>
            </div>
            <p className='mt-1.5 text-sm text-slate-700 whitespace-pre-wrap break-words'>{f.text}</p>
            {f.lesson && f.course && (
              <Link to={`/learn/${f.course.slug}/${f.lesson.slug}`} target='_blank' className='mt-1.5 inline-block text-xs text-brand-700 hover:underline'>On: {f.lesson.title}</Link>
            )}
          </div>
        ))}
        {data.pages > 1 && (
          <div className='flex items-center justify-between px-4 py-2 text-xs text-slate-500'>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className='disabled:opacity-40 hover:text-slate-800'>← Newer</button>
            <span>Page {page} of {data.pages}</span>
            <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className='disabled:opacity-40 hover:text-slate-800'>Older →</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminFeedback
