import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import SEO from '../../components/SEO'

const when = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
const detail = (r) => {
  const m = r.meta || {}
  const bits = []
  if (m.action && m.resource) bits.push(`${m.action} ${m.count ?? m.idsCount ?? ''} ${m.resource}`.replace(/\s+/g, ' '))
  if (m.days !== undefined) bits.push(m.days === 0 ? 'removed the plan' : `${m.days} days`)
  if (m.lifetime) bits.push('lifetime')
  if (m.role) bits.push(`role: ${m.role}`)
  if (m.published !== undefined && !m.action) bits.push(m.published ? 'published' : 'unpublished')
  if (m.email) bits.push(m.email)
  if (m.note) bits.push(m.note)
  if (m.title) bits.push(`“${m.title}”`)
  if (m.postIdsCount) bits.push(`${m.postIdsCount} posts`)
  if (m.changesCount) bits.push(`${m.changesCount} changes`)
  return bits.join(' · ')
}

const AdminActivity = () => {
  const { token } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const [q, setQ] = useState('')
  const [admin, setAdmin] = useState('')
  const [kind, setKind] = useState('all')
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => {
      api.get('/api/admin/activity', { ...auth, params: { q, admin, kind, page } })
        .then(({ data }) => setData(data)).catch((e) => toast.error(e.response?.data?.message || 'Could not load the activity log.'))
    }, 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, admin, kind, page])

  const sel = 'px-3 py-2 border border-slate-200 rounded-md text-sm bg-white'
  return (
    <div className='max-w-5xl'>
      <SEO title='Activity log' description='Who changed what in the admin area.' noindex />
      <h1 className='text-2xl font-semibold text-slate-800 mb-1'>Activity log</h1>
      <p className='text-sm text-slate-500 mb-4'>Every change made in Admin: who, what and when. Plan grants, role changes, publishing, deletes, SEO fixes and automatic payments are all here. Entries are kept for a year. Passwords and post text are never stored.</p>
      <div className='flex flex-wrap gap-2 mb-4'>
        <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder='Search actions…' aria-label='Search actions' className={sel} />
        <select value={admin} onChange={(e) => { setAdmin(e.target.value); setPage(1) }} aria-label='Filter by admin' className={sel}>
          <option value=''>All admins</option>{(data?.admins || []).map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={kind} onChange={(e) => { setKind(e.target.value); setPage(1) }} aria-label='Filter by kind' className={sel}>
          <option value='all'>Everything</option><option value='deletes'>Deletes only</option><option value='plans'>Plans and payments</option>
        </select>
      </div>
      {!data ? <p className='text-slate-400'>Loading…</p> : data.rows.length === 0 ? (
        <div className='rounded-lg border border-dashed border-slate-200 p-10 text-center text-slate-500 bg-white'>Nothing recorded yet. Changes made from now on will show here.</div>
      ) : (
        <div className='bg-white rounded-xl border border-slate-200 overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-slate-50 text-slate-500 text-left'><tr><th className='px-4 py-3 font-medium'>When</th><th className='px-4 py-3 font-medium'>Who</th><th className='px-4 py-3 font-medium'>What</th></tr></thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r._id} className='border-t border-slate-100 align-top'>
                  <td className='px-4 py-3 text-slate-500 whitespace-nowrap'>{when(r.at)}</td>
                  <td className='px-4 py-3 text-slate-700 whitespace-nowrap'>{r.adminEmail || '—'}</td>
                  <td className='px-4 py-3 text-slate-800'>{r.action}{detail(r) && <span className='block text-xs text-slate-500'>{detail(r)}</span>}<span className='block text-[11px] text-slate-400 break-all'>{r.method} {r.path}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && data.pages > 1 && (
        <div className='flex items-center gap-3 mt-4 text-sm'>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className='px-3 py-1.5 border border-slate-200 rounded-full disabled:opacity-40'>Previous</button>
          <span className='text-slate-500'>Page {data.page} of {data.pages} · {data.total} entries</span>
          <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className='px-3 py-1.5 border border-slate-200 rounded-full disabled:opacity-40'>Next</button>
        </div>
      )}
    </div>
  )
}
export default AdminActivity
