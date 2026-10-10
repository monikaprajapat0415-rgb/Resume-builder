import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import BlockEditor from '../../components/admin/BlockEditor'

const input = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300 focus:border-brand-400'
const Field = ({ label, hint, children }) => (
  <div>
    <label className='block text-sm font-medium text-slate-700 mb-1'>{label}{hint && <span className='text-slate-400 font-normal'> ({hint})</span>}</label>
    {children}
  </div>
)

// Routes: /admin/learn/:id/lessons/new (id = course) and /admin/learn/lessons/:lessonId/edit
const AdminLessonEditor = () => {
  const { id: courseIdParam, lessonId } = useParams()
  const isEdit = Boolean(lessonId)
  const navigate = useNavigate()
  const { token } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const [course, setCourse] = useState(null)
  const [sections, setSections] = useState([])
  const [f, setF] = useState({ title: '', slug: '', section: '', description: '', readTime: '', published: false, metaTitle: '', keywords: '', noindex: false })
  const [blocks, setBlocks] = useState([{ type: 'paragraph', text: '' }])
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const set = (patch) => setF((p) => ({ ...p, ...patch }))
  const courseId = course?._id || courseIdParam

  useEffect(() => {
    const run = async () => {
      try {
        let cid = courseIdParam
        if (isEdit) {
          const { data } = await api.get(`/api/admin/learn/lessons/${lessonId}`, auth)
          const l = data.lesson
          cid = l.course
          setF({ title: l.title, slug: l.slug, section: l.section || '', description: l.description || '', readTime: l.readTime || '', published: l.published, metaTitle: l.metaTitle || '', keywords: l.keywords || '', noindex: Boolean(l.noindex) })
          setBlocks(l.content?.length ? l.content : [{ type: 'paragraph', text: '' }])
          setFaqs(l.faqs || [])
        }
        const { data } = await api.get(`/api/admin/learn/courses/${cid}/lessons`, auth)
        setCourse(data.course)
        const secs = [...new Set(data.lessons.map((x) => x.section).filter(Boolean))]
        setSections(secs)
        if (!isEdit && data.lessons.length) set({ section: data.lessons[data.lessons.length - 1].section || '' })
      } catch (e) {
        toast.error(e.response?.data?.message || 'Could not load.')
        navigate('/admin/learn')
      }
      setLoading(false)
    }
    run()
  }, [lessonId, courseIdParam])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const content = blocks.map((b) => {
        if (b.type === 'list' || b.type === 'olist') return { type: b.type, items: (b.items || []).map((x) => x.trim()).filter(Boolean) }
        if (b.type === 'image') return { type: 'image', url: (b.url || '').trim(), alt: (b.alt || '').trim(), caption: (b.caption || '').trim() }
        if (b.type === 'code') return { type: 'code', lang: (b.lang || '').trim(), text: b.text || '' }
        return { type: b.type, text: (b.text || '').trim() }
      }).filter((b) => (b.items ? b.items.length > 0 : b.type === 'image' ? b.url : (b.text || '').trim().length > 0))
      const payload = { ...f, content, faqs: faqs.map((x) => ({ q: x.q.trim(), a: x.a.trim() })).filter((x) => x.q && x.a) }
      if (isEdit) await api.put(`/api/admin/learn/lessons/${lessonId}`, payload, auth)
      else await api.post(`/api/admin/learn/courses/${courseId}/lessons`, payload, auth)
      toast.success(isEdit ? 'Lesson updated.' : 'Lesson created.')
      navigate(`/admin/learn/${courseId}`)
    } catch (err) { toast.error(err.response?.data?.message || 'Could not save lesson.') }
    setSaving(false)
  }

  if (loading) return <p className='text-slate-400'>Loading…</p>
  const words = blocks.map((b) => (b.type === 'code' ? '' : b.text || (b.items || []).join(' '))).join(' ').split(/\s+/).filter(Boolean).length
  const setFaq = (i, patch) => setFaqs((p) => p.map((x, j) => (j === i ? { ...x, ...patch } : x)))

  return (
    <div>
      <Link to={`/admin/learn/${courseId}`} className='inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 mb-3'>← {course?.title}</Link>
      <h1 className='text-2xl font-semibold text-slate-800 mb-6'>{isEdit ? 'Edit lesson' : 'New lesson'}</h1>
      <form onSubmit={submit} className='space-y-6 max-w-3xl'>
        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <Field label='Lesson title'><input value={f.title} onChange={(e) => set({ title: e.target.value })} required placeholder='e.g. Angular components' className={input} /></Field>
          <div className='grid sm:grid-cols-2 gap-4'>
            <Field label='URL slug' hint='blank = made from the title'><input value={f.slug} onChange={(e) => set({ slug: e.target.value })} placeholder='angular-components' className={input} /></Field>
            <Field label='Section' hint='chapter name in the course menu'>
              <input value={f.section} onChange={(e) => set({ section: e.target.value })} list='sections-list' placeholder='e.g. Core concepts' className={input} />
              <datalist id='sections-list'>{sections.map((s) => <option key={s} value={s} />)}</datalist>
            </Field>
          </div>
          <Field label='Short description' hint='Google snippet and course menu line, about 110-160 characters'>
            <textarea value={f.description} onChange={(e) => set({ description: e.target.value })} rows={2} maxLength={320} className={input} />
            <p className='text-xs text-slate-400 mt-1'>{f.description.length} characters</p>
          </Field>
          <div className='grid sm:grid-cols-2 gap-4'>
            <Field label='Read time' hint='blank = worked out automatically'><input value={f.readTime} onChange={(e) => set({ readTime: e.target.value })} placeholder='6 min read' className={input} /></Field>
            <label className='flex items-center gap-2 text-sm text-slate-700 sm:pt-7'>
              <input type='checkbox' checked={f.published} onChange={(e) => set({ published: e.target.checked })} className='rounded border-slate-300' />
              Published <span className='text-slate-400'>(unticked = draft)</span>
            </label>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5'>
          <BlockEditor blocks={blocks} setBlocks={setBlocks} rich tutorial />
          <p className='text-xs text-slate-400 mt-4'>{words} words of text. Headings become the "On this page" menu on the right of the lesson.</p>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-3'>
          <h2 className='text-sm font-semibold text-slate-800'>FAQ <span className='text-slate-400 font-normal'>(optional; adds FAQ rich results for Google and AI answers)</span></h2>
          {faqs.map((x, i) => (
            <div key={i} className='border border-slate-100 rounded-lg p-3 space-y-2'>
              <input value={x.q} onChange={(e) => setFaq(i, { q: e.target.value })} placeholder='Question' className={input} />
              <textarea value={x.a} onChange={(e) => setFaq(i, { a: e.target.value })} placeholder='Answer' rows={2} className={input} />
              <button type='button' onClick={() => setFaqs((p) => p.filter((_, j) => j !== i))} className='text-xs text-red-500'>Remove</button>
            </div>
          ))}
          <button type='button' onClick={() => setFaqs((p) => [...p, { q: '', a: '' }])} className='text-xs px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50'>+ question</button>
        </div>

        <details className='bg-white rounded-xl border border-slate-200 p-5'>
          <summary className='text-sm font-semibold text-slate-800 cursor-pointer'>SEO options</summary>
          <div className='space-y-4 mt-4'>
            <Field label='SEO title' hint={`blank = "${f.title || 'Lesson'} - ${course?.title || 'Course'}"`}><input value={f.metaTitle} onChange={(e) => set({ metaTitle: e.target.value })} className={input} /></Field>
            <Field label='Keywords'><input value={f.keywords} onChange={(e) => set({ keywords: e.target.value })} className={input} /></Field>
            <label className='flex items-center gap-2 text-sm text-slate-700'>
              <input type='checkbox' checked={f.noindex} onChange={(e) => set({ noindex: e.target.checked })} className='rounded border-slate-300' />
              Hide from search engines (noindex; also removed from the sitemap and llms.txt)
            </label>
          </div>
        </details>

        <div className='flex items-center gap-3'>
          <button type='submit' disabled={saving} className='px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition disabled:opacity-60'>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create lesson'}</button>
          <button type='button' onClick={() => navigate(`/admin/learn/${courseId}`)} className='px-5 py-2.5 border border-slate-200 rounded-full text-sm hover:bg-slate-50 transition'>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default AdminLessonEditor
