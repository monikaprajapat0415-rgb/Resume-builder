import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuPencil, LuTrash2, LuExternalLink, LuPlus } from 'react-icons/lu'

const AdminPages = () => {
  const { token } = useSelector(state => state.auth)
  const headers = { headers: { Authorization: token } }
  const navigate = useNavigate()
  const [pages, setPages] = useState(null)

  const load = () => api.get('/api/admin/pages', headers).then(({ data }) => setPages(data.pages || [])).catch((e) => { setPages([]); toast.error(e.response?.data?.message || 'Could not load pages.') })
  useEffect(() => { load() }, [])

  const urlOf = (p) => (p.system ? `/${p.slug}` : `/p/${p.slug}`)

  const remove = async (p) => {
    if (!window.confirm(`Delete the page "${p.title}"? Its address will stop working.`)) return
    try { await api.delete(`/api/admin/pages/${p._id}`, headers); toast.success('Page deleted.'); load() }
    catch (e) { toast.error(e.response?.data?.message || 'Could not delete.') }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-semibold text-slate-800'>Pages</h1>
        <button onClick={() => navigate('/admin/pages/new')} className='inline-flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition'><LuPlus className='size-4' /> New page</button>
      </div>
      <div className='bg-white rounded-xl border border-slate-200 divide-y divide-slate-100'>
        {pages === null && <p className='p-6 text-sm text-slate-400 text-center'>Loading…</p>}
        {pages && pages.length === 0 && <p className='p-6 text-sm text-slate-400 text-center'>No pages yet.</p>}
        {pages?.map((p) => (
          <div key={p._id} className='flex items-center gap-3 px-4 py-3'>
            <div className='flex-1 min-w-0'>
              <p className='text-sm text-slate-800 truncate'>{p.title}
                {p.system && <span className='ml-2 text-[10px] uppercase tracking-wide bg-slate-100 text-slate-500 rounded px-1.5 py-0.5'>Built-in</span>}
                {!p.published && <span className='ml-2 text-[10px] uppercase tracking-wide bg-amber-100 text-amber-700 rounded px-1.5 py-0.5'>Draft</span>}
              </p>
              <p className='text-xs text-slate-400'>{urlOf(p)}</p>
            </div>
            <a href={urlOf(p)} target='_blank' rel='noreferrer' className='p-2 rounded-md hover:bg-slate-100' title='View page'><LuExternalLink className='size-4 text-slate-600' /></a>
            <Link to={`/admin/pages/${p._id}/edit`} className='p-2 rounded-md hover:bg-slate-100' title='Edit'><LuPencil className='size-4 text-slate-600' /></Link>
            {!p.system && <button onClick={() => remove(p)} className='p-2 rounded-md hover:bg-slate-100' title='Delete'><LuTrash2 className='size-4 text-red-500' /></button>}
          </div>
        ))}
      </div>
      <p className='text-xs text-slate-400 mt-3'>Custom pages appear at <code>/p/your-page</code>. Add them to the site menus from Menus (as a custom link).</p>
    </div>
  )
}

export default AdminPages
