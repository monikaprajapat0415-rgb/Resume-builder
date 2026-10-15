import React, { useEffect, useState } from 'react'
import { trackEvent } from '../../components/Analytics'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuCopy, LuFileUser, LuPlus, LuSparkles, LuTrash2, LuX } from 'react-icons/lu'
import { BiLoaderAlt } from 'react-icons/bi'
import api from '../../configs/api'

// "My CVs" tab on the dashboard: list, create, duplicate and delete CVs.
const CvDashboardSection = () => {
  const { token } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const navigate = useNavigate()
  const [cvs, setCvs] = useState(null)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    try { const { data } = await api.get('/api/cvs', auth); setCvs(data.cvs); setError('') }
    catch (e) { setError(e.response?.data?.message || 'Could not load your CVs.'); setCvs([]) }
  }
  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault(); setBusy(true)
    try {
      const { data } = await api.post('/api/cvs/create', { title: title.trim() || 'Untitled CV' }, auth)
      trackEvent('resume_builder_started', { type: 'cv', source: 'dashboard' })
      navigate(`/app/cv/${data.cv._id}`)
    } catch (err) { toast.error(err.response?.data?.message || 'Could not create the CV.') }
    setBusy(false)
  }
  const duplicate = async (id) => {
    try { await api.post(`/api/cvs/duplicate/${id}`, {}, auth); toast.success('CV duplicated'); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Could not duplicate.') }
  }
  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this CV?')) return
    try { await api.delete(`/api/cvs/delete/${id}`, auth); setCvs((l) => l.filter((c) => c._id !== id)); toast.success('CV deleted') }
    catch (err) { toast.error(err.response?.data?.message || 'Could not delete.') }
  }

  return (
    <div>
      <div className='flex flex-wrap items-center justify-between gap-3 mb-5'>
        <p className='text-sm text-slate-500'>Write a tailored, ATS-friendly CV for a specific job with AI.</p>
        <button onClick={() => setShowCreate(true)} className='flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-sm transition'><LuPlus className='size-4' />Create CV</button>
      </div>

      {cvs === null && <p className='text-center text-slate-400 py-10'>Loading...</p>}
      {error && <p role='alert' className='text-sm text-red-600 mb-3'>{error}</p>}
      {cvs && cvs.length === 0 && !error && (
        <div className='rounded-lg border border-dashed border-slate-200 p-10 text-center text-slate-500'>
          <LuSparkles className='size-8 mx-auto text-brand-600' />
          <p className='mt-3 text-lg text-slate-700'>No CVs yet</p>
          <p className='mb-6'>Tell us the job you want and your details - the AI writes the CV.</p>
          <button onClick={() => setShowCreate(true)} className='px-4 py-2 bg-brand-600 text-white rounded-md'>Create your first CV</button>
        </div>
      )}
      {cvs && cvs.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {cvs.map((c) => (
            <div key={c._id} onClick={() => navigate(`/app/cv/${c._id}`)} className='group bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition cursor-pointer'>
              <div className='flex items-start justify-between gap-3'>
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='w-10 h-10 rounded-md flex items-center justify-center bg-brand-50'><LuFileUser className='text-lg text-brand-600' /></div>
                  <div className='min-w-0'>
                    <p className='font-medium text-slate-800 truncate'>{c.title || 'Untitled CV'}</p>
                    <p className='text-xs text-slate-500'>Updated {new Date(c.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()} className='flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition'>
                  <button onClick={() => duplicate(c._id)} aria-label='Duplicate CV' className='p-2 rounded-md hover:bg-slate-100'><LuCopy className='size-4 text-slate-600' /></button>
                  <button onClick={() => remove(c._id)} aria-label='Delete CV' className='p-2 rounded-md hover:bg-slate-100'><LuTrash2 className='size-4 text-red-500' /></button>
                </div>
              </div>
              <div className='mt-4 flex items-center justify-between text-xs'>
                <span className='text-slate-500 truncate'>{c.target?.job_title ? `For: ${c.target.job_title}` : 'No target job yet'}</span>
                <span className={c.generated ? 'text-brand-700 font-medium' : 'text-slate-400'}>{c.generated ? 'Generated' : 'Draft'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <form onSubmit={create} onClick={() => setShowCreate(false)} className='fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center'>
          <div onClick={(e) => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
            <h2 className='text-xl font-bold mb-4'>Create CV</h2>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder='e.g. Full Stack Developer CV' className='w-full px-4 py-2 mb-4' />
            <button disabled={busy} className='w-full py-2 bg-brand-600 text-white rounded hover:bg-brand-700 transition-colors flex items-center justify-center gap-2'>
              {busy && <BiLoaderAlt className='size-4 animate-spin' />}Start
            </button>
            <LuX className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer' onClick={() => setShowCreate(false)} />
          </div>
        </form>
      )}
    </div>
  )
}

export default CvDashboardSection
