import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import ImageUploader from '../../components/admin/ImageUploader'

const input = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300 focus:border-brand-400'
const Field = ({ label, hint, children }) => (
  <div>
    <label className='block text-sm font-medium text-slate-700 mb-1'>{label}{hint && <span className='text-slate-400 font-normal'> ({hint})</span>}</label>
    {children}
  </div>
)

const AdminCourseEditor = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const [f, setF] = useState({
    title: '', slug: '', summary: '', description: '', level: 'Beginner', topic: '', badge: '', coverImage: '', coverAlt: '',
    tags: '', author: '', order: 0, published: false, metaTitle: '', keywords: '', noindex: false,
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const set = (patch) => setF((p) => ({ ...p, ...patch }))

  useEffect(() => {
    if (!isEdit) return
    api.get(`/api/admin/learn/courses/${id}`, auth)
      .then(({ data }) => { const c = data.course; setF({ ...c, tags: (c.tags || []).join(', '), summary: c.summary || '', description: c.description || '' }) })
      .catch((e) => { toast.error(e.response?.data?.message || 'Could not load course.'); navigate('/admin/learn') })
      .finally(() => setLoading(false))
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...f, tags: f.tags.split(',').map((t) => t.trim()).filter(Boolean), order: Number(f.order) || 0 }
      delete payload._id; delete payload.createdAt; delete payload.updatedAt; delete payload.modifiedAt; delete payload.__v
      if (isEdit) { await api.put(`/api/admin/learn/courses/${id}`, payload, auth); toast.success('Course updated.'); navigate('/admin/learn') }
      else {
        const { data } = await api.post('/api/admin/learn/courses', payload, auth)
        toast.success('Course created. Now add its first lesson.')
        navigate(`/admin/learn/${data.course._id}`)
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Could not save course.') }
    setSaving(false)
  }

  if (loading) return <p className='text-slate-400'>Loading…</p>

  return (
    <div>
      <h1 className='text-2xl font-semibold text-slate-800 mb-6'>{isEdit ? 'Edit course' : 'New course'}</h1>
      <form onSubmit={submit} className='space-y-6 max-w-3xl'>
        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <Field label='Course title'><input value={f.title} onChange={(e) => set({ title: e.target.value })} required placeholder='e.g. Angular Tutorial' className={input} /></Field>
          <Field label='URL slug' hint='blank = made from the title'><input value={f.slug} onChange={(e) => set({ slug: e.target.value })} placeholder='angular-tutorial' className={input} /></Field>
          <Field label='Short summary' hint='shown on the course card on /learn'><input value={f.summary} onChange={(e) => set({ summary: e.target.value })} maxLength={200} className={input} /></Field>
          <Field label='Description' hint='intro on the course page and the Google snippet, 110-160 characters is ideal'>
            <textarea value={f.description} onChange={(e) => set({ description: e.target.value })} rows={3} maxLength={320} className={input} />
            <p className='text-xs text-slate-400 mt-1'>{f.description.length} characters</p>
          </Field>
          <div className='grid sm:grid-cols-3 gap-4'>
            <Field label='Level'>
              <select value={f.level} onChange={(e) => set({ level: e.target.value })} className={input}>
                {['Beginner', 'Intermediate', 'Advanced', 'All levels'].map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label='Topic' hint='groups cards on /learn'><input value={f.topic} onChange={(e) => set({ topic: e.target.value })} placeholder='Frontend' className={input} /></Field>
            <Field label='Card badge' hint='1-3 letters'><input value={f.badge} onChange={(e) => set({ badge: e.target.value })} maxLength={3} placeholder='NG' className={input} /></Field>
          </div>
          <div className='grid sm:grid-cols-2 gap-4'>
            <Field label='Position on /learn' hint='lower shows first'><input type='number' value={f.order} onChange={(e) => set({ order: e.target.value })} className={input} /></Field>
            <Field label='Author'><input value={f.author} onChange={(e) => set({ author: e.target.value })} placeholder='Prime Resume AI Team' className={input} /></Field>
          </div>
          <label className='flex items-center gap-2 text-sm text-slate-700'>
            <input type='checkbox' checked={f.published} onChange={(e) => set({ published: e.target.checked })} className='rounded border-slate-300' />
            Published <span className='text-slate-400'>(drafts are hidden from visitors, even if their lessons are published)</span>
          </label>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <h2 className='text-sm font-semibold text-slate-800'>Cover image <span className='text-slate-400 font-normal'>(optional; the badge is used if there is none)</span></h2>
          <ImageUploader images={f.coverImage ? [f.coverImage] : []} setImages={(upd) => {
            const next = typeof upd === 'function' ? upd(f.coverImage ? [f.coverImage] : []) : upd
            set({ coverImage: next[next.length - 1] || '' })
          }} />
          <Field label='Cover alt text'><input value={f.coverAlt} onChange={(e) => set({ coverAlt: e.target.value })} className={input} /></Field>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <h2 className='text-sm font-semibold text-slate-800'>SEO</h2>
          <Field label='SEO title' hint='blank = course title'><input value={f.metaTitle} onChange={(e) => set({ metaTitle: e.target.value })} className={input} /></Field>
          <div className='grid sm:grid-cols-2 gap-4'>
            <Field label='Keywords'><input value={f.keywords} onChange={(e) => set({ keywords: e.target.value })} placeholder='angular tutorial, learn angular' className={input} /></Field>
            <Field label='Tags'><input value={f.tags} onChange={(e) => set({ tags: e.target.value })} placeholder='angular, typescript' className={input} /></Field>
          </div>
          <label className='flex items-center gap-2 text-sm text-slate-700'>
            <input type='checkbox' checked={f.noindex} onChange={(e) => set({ noindex: e.target.checked })} className='rounded border-slate-300' />
            Hide from search engines (noindex; also removed from the sitemap and llms.txt)
          </label>
        </div>

        <div className='flex items-center gap-3'>
          <button type='submit' disabled={saving} className='px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition disabled:opacity-60'>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create course'}</button>
          <button type='button' onClick={() => navigate('/admin/learn')} className='px-5 py-2.5 border border-slate-200 rounded-full text-sm hover:bg-slate-50 transition'>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default AdminCourseEditor
