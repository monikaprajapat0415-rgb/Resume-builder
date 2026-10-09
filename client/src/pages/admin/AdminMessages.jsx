import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuMail, LuMailOpen, LuArchive, LuArchiveRestore, LuTrash2, LuReply, LuSearch } from 'react-icons/lu'

const FILTERS = [['inbox', 'Inbox'], ['unread', 'Unread'], ['archived', 'Archived']]
const fmt = (d) => new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export const refreshUnread = () => window.dispatchEvent(new Event('admin-messages-changed'))

const AdminMessages = () => {
  const { token } = useSelector(state => state.auth)
  const headers = { headers: { Authorization: token } }
  const [status, setStatus] = useState('inbox')
  const [q, setQ] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ messages: [], pages: 1, total: 0, unread: 0 })
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    return api.get('/api/admin/messages', { ...headers, params: { status, q: query, page } })
      .then(({ data }) => setData(data))
      .catch((e) => toast.error(e.response?.data?.message || 'Could not load messages.'))
      .finally(() => setLoading(false))
  }, [status, query, page, token])

  useEffect(() => { load() }, [load])
  useEffect(() => { const t = setTimeout(() => { setQuery(q.trim()); setPage(1) }, 300); return () => clearTimeout(t) }, [q])

  const current = data.messages.find((m) => m._id === openId) || null

  const patch = async (m, change, okMsg) => {
    try {
      await api.patch(`/api/admin/messages/${m._id}`, change, headers)
      if (okMsg) toast.success(okMsg)
      await load(); refreshUnread()
    } catch (e) { toast.error(e.response?.data?.message || 'Could not update.') }
  }

  const open = (m) => {
    setOpenId(m._id)
    if (!m.read) patch(m, { read: true })
  }

  const remove = async (m) => {
    if (!window.confirm(`Delete the message from ${m.name}? This cannot be undone.`)) return
    try {
      await api.delete(`/api/admin/messages/${m._id}`, headers)
      setOpenId(null); toast.success('Message deleted.')
      await load(); refreshUnread()
    } catch (e) { toast.error(e.response?.data?.message || 'Could not delete.') }
  }

  const markAll = async () => {
    try { await api.post('/api/admin/messages/mark-all-read', {}, headers); toast.success('All marked as read.'); await load(); refreshUnread() }
    catch (e) { toast.error(e.response?.data?.message || 'Could not update.') }
  }

  return (
    <div>
      <div className='flex flex-wrap items-center justify-between gap-3 mb-5'>
        <h1 className='text-2xl font-semibold text-slate-800'>Messages <span className='text-sm font-normal text-slate-400'>from the Contact Us form</span></h1>
        {data.unread > 0 && <button onClick={markAll} className='text-sm text-green-700 hover:underline'>Mark all {data.unread} as read</button>}
      </div>

      <div className='flex flex-wrap items-center gap-3 mb-4'>
        <div className='inline-flex rounded-full border border-slate-200 bg-white p-1'>
          {FILTERS.map(([k, label]) => (
            <button key={k} onClick={() => { setStatus(k); setPage(1); setOpenId(null) }} className={`px-4 py-1.5 rounded-full text-sm transition ${status === k ? 'bg-green-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}>{label}</button>
          ))}
        </div>
        <div className='relative flex-1 min-w-48 max-w-sm'>
          <LuSearch className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400' />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search name, email or text' className='w-full pl-9 pr-3 py-2 border border-slate-200 rounded-full text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-300' />
        </div>
      </div>

      <div className='grid lg:grid-cols-5 gap-4'>
        <div className='lg:col-span-2 bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 self-start'>
          {loading && data.messages.length === 0 && <p className='p-6 text-sm text-slate-400 text-center'>Loading…</p>}
          {!loading && data.messages.length === 0 && <p className='p-6 text-sm text-slate-400 text-center'>{query ? 'No messages match your search.' : 'No messages here.'}</p>}
          {data.messages.map((m) => (
            <button key={m._id} onClick={() => open(m)} className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition ${openId === m._id ? 'bg-green-50/60' : ''}`}>
              <div className='flex items-center gap-2'>
                {!m.read && <span className='size-2 rounded-full bg-green-500 shrink-0' aria-label='Unread' />}
                <span className={`text-sm truncate ${m.read ? 'text-slate-700' : 'font-semibold text-slate-900'}`}>{m.name}</span>
                <span className='ml-auto text-[11px] text-slate-400 shrink-0'>{new Date(m.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
              </div>
              <p className='text-xs text-slate-500 truncate mt-0.5'>{m.message}</p>
            </button>
          ))}
          {data.pages > 1 && (
            <div className='flex items-center justify-between px-4 py-2 text-xs text-slate-500'>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className='disabled:opacity-40 hover:text-slate-800'>← Newer</button>
              <span>Page {page} of {data.pages}</span>
              <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className='disabled:opacity-40 hover:text-slate-800'>Older →</button>
            </div>
          )}
        </div>

        <div className='lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 min-h-48 self-start'>
          {!current ? (
            <p className='text-sm text-slate-400 text-center py-12'>Select a message to read it.</p>
          ) : (
            <div>
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <p className='font-semibold text-slate-800'>{current.name}</p>
                  <a href={`mailto:${current.email}`} className='text-sm text-green-700 hover:underline break-all'>{current.email}</a>
                  <p className='text-xs text-slate-400 mt-0.5'>{fmt(current.createdAt)}</p>
                </div>
                <div className='flex items-center gap-1 shrink-0'>
                  <button onClick={() => patch(current, { read: !current.read })} title={current.read ? 'Mark as unread' : 'Mark as read'} className='p-2 rounded-md hover:bg-slate-100'>
                    {current.read ? <LuMail className='size-4 text-slate-600' /> : <LuMailOpen className='size-4 text-slate-600' />}
                  </button>
                  <button onClick={() => patch(current, { archived: !current.archived }, current.archived ? 'Moved to inbox.' : 'Archived.')} title={current.archived ? 'Move to inbox' : 'Archive'} className='p-2 rounded-md hover:bg-slate-100'>
                    {current.archived ? <LuArchiveRestore className='size-4 text-slate-600' /> : <LuArchive className='size-4 text-slate-600' />}
                  </button>
                  <button onClick={() => remove(current)} title='Delete' className='p-2 rounded-md hover:bg-slate-100'><LuTrash2 className='size-4 text-red-500' /></button>
                </div>
              </div>
              <p className='mt-5 text-sm text-slate-700 whitespace-pre-wrap break-words'>{current.message}</p>
              <a href={`mailto:${current.email}?subject=${encodeURIComponent('Re: your message to Prime Resume AI')}`} className='mt-6 inline-flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition'>
                <LuReply className='size-4' /> Reply by email
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminMessages
