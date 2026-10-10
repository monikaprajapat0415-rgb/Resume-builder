import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuPlus, LuPencil, LuTrash2, LuArrowUp, LuArrowDown, LuExternalLink, LuArrowLeft } from 'react-icons/lu'

const AdminCourseLessons = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = () => api.get(`/api/admin/learn/courses/${id}/lessons`, auth)
    .then(({ data }) => { setCourse(data.course); setLessons(data.lessons); setDirty(false) })
    .catch((e) => { toast.error(e.response?.data?.message || 'Could not load lessons.'); navigate('/admin/learn') })
    .finally(() => setLoading(false))
  useEffect(() => { load() }, [id])

  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= lessons.length) return
    const next = [...lessons]
    ;[next[i], next[j]] = [next[j], next[i]]
    setLessons(next); setDirty(true)
  }
  const setSection = (i, section) => { setLessons((p) => p.map((l, k) => (k === i ? { ...l, section } : l))); setDirty(true) }

  const saveOrder = async () => {
    setSaving(true)
    try {
      await api.put(`/api/admin/learn/courses/${id}/reorder`, { items: lessons.map((l) => ({ id: l._id, section: l.section || '' })) }, auth)
      toast.success('Order saved.'); setDirty(false)
    } catch (e) { toast.error(e.response?.data?.message || 'Could not save the order.') }
    setSaving(false)
  }

  const remove = async (l) => {
    if (!window.confirm(`Delete the lesson "${l.title}"? This can't be undone.`)) return
    try {
      await api.delete(`/api/admin/learn/lessons/${l._id}`, auth)
      setLessons((p) => p.filter((x) => x._id !== l._id)); toast.success('Lesson deleted.')
    } catch (e) { toast.error(e.response?.data?.message || 'Could not delete lesson.') }
  }

  const togglePublish = async (l) => {
    try {
      await api.put(`/api/admin/learn/lessons/${l._id}`, { published: !l.published }, auth)
      setLessons((p) => p.map((x) => (x._id === l._id ? { ...x, published: !l.published } : x)))
    } catch (e) { toast.error(e.response?.data?.message || 'Could not update lesson.') }
  }

  if (loading) return <p className='text-slate-400'>Loading…</p>
  const sections = [...new Set(lessons.map((l) => l.section).filter(Boolean))]

  return (
    <div>
      <Link to='/admin/learn' className='inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 mb-3'><LuArrowLeft className='size-3.5' />All courses</Link>
      <div className='flex items-center justify-between mb-2 gap-3 flex-wrap'>
        <h1 className='text-2xl font-semibold text-slate-800'>{course.title}</h1>
        <div className='flex items-center gap-2'>
          <Link to={`/admin/learn/${id}/edit`} className='text-sm px-4 py-2 border border-slate-200 rounded-full hover:bg-slate-50'>Course settings</Link>
          <button onClick={() => navigate(`/admin/learn/${id}/lessons/new`)} className='inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'><LuPlus className='size-4' />New lesson</button>
        </div>
      </div>
      <p className='text-sm text-slate-500 mb-5 max-w-2xl'>Lessons appear in this order, one after another. Use the arrows to reorder and type a chapter name in "Section" to group lessons in the course menu (lessons with the same section name sit together). Click <strong>Save order</strong> when done. Drafts are never shown to visitors.</p>

      {lessons.length === 0 ? (
        <div className='rounded-lg border border-dashed border-slate-200 p-10 text-center text-slate-500 bg-white'>No lessons yet. Add the first one.</div>
      ) : (
        <div className='bg-white rounded-xl border border-slate-200 divide-y divide-slate-100'>
          {lessons.map((l, i) => (
            <div key={l._id} className='flex items-center gap-3 px-4 py-3 flex-wrap'>
              <span className='text-xs text-slate-400 w-6'>{i + 1}.</span>
              <div className='flex flex-col'>
                <button type='button' onClick={() => move(i, -1)} disabled={i === 0} className='p-0.5 rounded hover:bg-slate-100 disabled:opacity-30' title='Move up'><LuArrowUp className='size-3.5' /></button>
                <button type='button' onClick={() => move(i, 1)} disabled={i === lessons.length - 1} className='p-0.5 rounded hover:bg-slate-100 disabled:opacity-30' title='Move down'><LuArrowDown className='size-3.5' /></button>
              </div>
              <div className='min-w-0 flex-1 basis-48'>
                <Link to={`/admin/learn/lessons/${l._id}/edit`} className='font-medium text-slate-800 hover:text-brand-700'>{l.title}</Link>
                <p className='text-xs text-slate-400'>/{l.slug}</p>
              </div>
              <input value={l.section || ''} onChange={(e) => setSection(i, e.target.value)} list='lesson-sections' placeholder='Section (optional)' aria-label={`Section for ${l.title}`}
                className='w-44 px-2.5 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-brand-300' />
              <button type='button' onClick={() => togglePublish(l)} className={`text-xs font-medium px-2.5 py-1 rounded-full ${l.published ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'}`} title='Click to switch between published and draft'>
                {l.published ? 'Published' : 'Draft'}
              </button>
              <div className='flex items-center'>
                <Link to={`/admin/learn/lessons/${l._id}/edit`} className='p-2 rounded hover:bg-slate-100' title='Edit'><LuPencil className='size-4 text-slate-500' /></Link>
                {l.published && course.published && <a href={`/learn/${course.slug}/${l.slug}`} target='_blank' rel='noopener noreferrer' className='p-2 rounded hover:bg-slate-100' title='View live'><LuExternalLink className='size-4 text-slate-500' /></a>}
                <button type='button' onClick={() => remove(l)} className='p-2 rounded hover:bg-slate-100' title='Delete'><LuTrash2 className='size-4 text-red-500' /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <datalist id='lesson-sections'>{sections.map((s) => <option key={s} value={s} />)}</datalist>

      {dirty && (
        <div className='sticky bottom-4 mt-5 flex items-center gap-3 bg-white border border-amber-200 rounded-xl px-4 py-3 shadow-sm w-fit'>
          <span className='text-sm text-amber-700'>You have unsaved order or section changes.</span>
          <button onClick={saveOrder} disabled={saving} className='px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm disabled:opacity-60'>{saving ? 'Saving…' : 'Save order'}</button>
          <button onClick={load} className='px-4 py-1.5 border border-slate-200 rounded-full text-sm hover:bg-slate-50'>Discard</button>
        </div>
      )}
    </div>
  )
}

export default AdminCourseLessons
