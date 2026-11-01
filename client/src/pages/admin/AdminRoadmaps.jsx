import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuPlus, LuPencil, LuTrash2, LuExternalLink } from 'react-icons/lu'
import PublishSwitch from '../../components/admin/PublishSwitch'

const AdminRoadmaps = () => {
  const { token } = useSelector((s) => s.auth)
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const auth = { headers: { Authorization: token } }

  useEffect(() => {
    api.get('/api/admin/roadmaps', auth)
      .then(({ data }) => setRows(data.roadmaps || []))
      .catch((e) => toast.error(e.response?.data?.message || 'Could not load roadmaps.'))
      .finally(() => setLoading(false))
  }, [])

  const setPublished = async (r, published) => {
    try {
      await api.put(`/api/admin/roadmaps/${r._id}`, { published }, auth)
      setRows((prev) => prev.map((x) => (x._id === r._id ? { ...x, published } : x)))
      toast.success(published ? 'Roadmap published.' : 'Roadmap unpublished.')
    } catch (e) { toast.error(e.response?.data?.message || 'Could not change this roadmap.') }
  }

  const remove = async (r) => {
    if (!window.confirm(`Delete the roadmap "${r.title}"? This can't be undone.`)) return
    try {
      await api.delete(`/api/admin/roadmaps/${r._id}`, auth)
      setRows((prev) => prev.filter((x) => x._id !== r._id))
      toast.success('Roadmap deleted.')
    } catch (e) { toast.error(e.response?.data?.message || 'Could not delete the roadmap.') }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-2 gap-3 flex-wrap'>
        <h1 className='text-2xl font-semibold text-slate-800'>Career roadmaps</h1>
        <button onClick={() => navigate('/admin/roadmaps/new')} className='inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>
          <LuPlus className='size-4' /> New roadmap
        </button>
      </div>
      <p className='text-sm text-slate-500 mb-6'>Step-by-step plans shown at /roadmaps. Only published roadmaps are public and listed in the sitemap.</p>
      {loading ? <p className='text-slate-400'>Loading…</p> : rows.length === 0 ? <p className='text-slate-400'>No roadmaps yet.</p> : (
        <div className='bg-white border border-slate-200 rounded-xl divide-y divide-slate-100'>
          {rows.map((r) => (
            <div key={r._id} className='flex items-center gap-3 p-4 flex-wrap'>
              <div className='min-w-0 flex-1'>
                <p className='font-medium text-slate-800 truncate'>{r.title}</p>
                <p className='text-xs text-slate-400'>{r.audience || 'No group'} · {r.stepCount} steps · /roadmaps/{r.slug}</p>
              </div>
              <PublishSwitch on={r.published} name={r.title} onChange={(v) => setPublished(r, v)} />
              {r.published && <a href={`/roadmaps/${r.slug}`} target='_blank' rel='noreferrer' className='p-2 text-slate-400 hover:text-brand-600' aria-label='View'><LuExternalLink className='size-4' /></a>}
              <button onClick={() => navigate(`/admin/roadmaps/${r._id}/edit`)} className='p-2 text-slate-400 hover:text-brand-600' aria-label='Edit'><LuPencil className='size-4' /></button>
              <button onClick={() => remove(r)} className='p-2 text-slate-400 hover:text-red-600' aria-label='Delete'><LuTrash2 className='size-4' /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminRoadmaps
