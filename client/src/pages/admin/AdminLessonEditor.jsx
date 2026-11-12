import React, { useEffect, useState } from 'react'
import LessonTranslations from '../../components/admin/LessonTranslations'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import BlockEditor from '../../components/admin/BlockEditor'
import LessonAnimation from '../../components/LessonAnimation'

const ANIMATION_EXAMPLE = {
  title: 'How a request travels',
  nodes: [
    { id: 'user', label: 'Reader', sub: 'browser', col: 0, row: 0, kind: 'user' },
    { id: 'app', label: 'Your app', sub: 'Angular', col: 1, row: 0, kind: 'app' },
    { id: 'api', label: 'API', sub: 'Node.js', col: 2, row: 0, kind: 'tool' },
  ],
  steps: [
    { say: 'The reader clicks a button in your app.', on: ['user'], flow: ['user>app:click'] },
    { say: 'The app sends a request to your API.', flow: ['app>api:GET /data'] },
    { say: 'The API answers and the app shows the result.', flow: ['api>app:JSON'], on: ['app'] },
  ],
}

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
  const [download, setDownload] = useState(null)
  const [animText, setAnimText] = useState('')
  const [quizText, setQuizText] = useState('')
  const [notesText, setNotesText] = useState('')
  const notesCount = notesText.split('\n').filter((x) => x.trim()).length
  const QUIZ_EXAMPLE = [{ q: 'Which command saves a snapshot of your staged changes?', options: ['git add', 'git commit', 'git push'], answer: 1, explain: 'commit records what you staged.' }]
  let quizError = ''
  if (quizText.trim()) { try { const v = JSON.parse(quizText); if (!Array.isArray(v)) quizError = 'The quiz must be a list [ ... ] of questions.' } catch { quizError = 'This is not valid JSON yet.' } }
  const [anim, setAnim] = useState({ ok: null, message: '', data: null })
  const [uploading, setUploading] = useState(false)
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
          setAnimText(l.animation ? JSON.stringify(l.animation, null, 2) : '')
          setQuizText(l.quiz ? JSON.stringify(l.quiz, null, 2) : '')
          setNotesText(Array.isArray(l.notes) ? l.notes.join('\n') : '')
          setDownload(l.download?.file ? l.download : null)
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

  // check the animation JSON with the server's own rules (same code that cleans it on save) and show a live preview
  useEffect(() => {
    if (!animText.trim()) { setAnim({ ok: null, message: '', data: null }); return undefined }
    let parsed
    try { parsed = JSON.parse(animText) } catch (e) { setAnim({ ok: false, message: `Not valid JSON: ${e.message}`, data: null }); return undefined }
    let live = true
    const t = setTimeout(() => {
      api.post('/api/admin/learn/animation/preview', { animation: parsed }, auth)
        .then(({ data }) => { if (live) setAnim({ ok: true, message: '', data: data.animation }) })
        .catch((e) => { if (live) setAnim({ ok: false, message: e.response?.data?.message || 'Could not check the animation.', data: null }) })
    }, 500)
    return () => { live = false; clearTimeout(t) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animText])

  const submit = async (e) => {
    e.preventDefault()
    if (animText.trim() && anim.ok === false) { toast.error(anim.message || 'Fix the animation first.'); return }
    if (quizError) { toast.error(quizError); return }
    if (notesCount > 10) { toast.error('Use 10 note lines or fewer.'); return }
    setSaving(true)
    try {
      const content = blocks.map((b) => {
        if (b.type === 'list' || b.type === 'olist') return { type: b.type, items: (b.items || []).map((x) => x.trim()).filter(Boolean) }
        if (b.type === 'image') return { type: 'image', url: (b.url || '').trim(), alt: (b.alt || '').trim(), caption: (b.caption || '').trim() }
        if (b.type === 'code') return { type: 'code', lang: (b.lang || '').trim(), text: b.text || '' }
        return { type: b.type, text: (b.text || '').trim() }
      }).filter((b) => (b.items ? b.items.length > 0 : b.type === 'image' ? b.url : (b.text || '').trim().length > 0))
      const payload = { ...f, content, animation: animText.trim() ? JSON.parse(animText) : null, quiz: quizText.trim() ? JSON.parse(quizText) : null, notes: notesCount ? notesText.split('\n').map((x) => x.trim()).filter(Boolean) : null, faqs: faqs.map((x) => ({ q: x.q.trim(), a: x.a.trim() })).filter((x) => x.q && x.a) }
      if (isEdit) await api.put(`/api/admin/learn/lessons/${lessonId}`, payload, auth)
      else await api.post(`/api/admin/learn/courses/${courseId}/lessons`, payload, auth)
      toast.success(isEdit ? 'Lesson updated.' : 'Lesson created.')
      navigate(`/admin/learn/${courseId}`)
    } catch (err) { toast.error(err.response?.data?.message || 'Could not save lesson.') }
    setSaving(false)
  }

  if (loading) return <p className='text-slate-400'>Loading…</p>
  const words = blocks.map((b) => (b.type === 'code' ? '' : b.text || (b.items || []).join(' '))).join(' ').split(/\s+/).filter(Boolean).length
  const sizeText = (n) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)
  const uploadZip = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!/\.zip$/i.test(file.name)) return toast.error('Choose a .zip file.')
    if (file.size > 25 * 1024 * 1024) return toast.error('That file is over the 25 MB limit.')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const { data } = await api.post(`/api/admin/learn/lessons/${lessonId}/download`, fd, auth)
      setDownload(data.download)
      toast.success('Solution zip saved.')
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed.') }
    setUploading(false)
  }
  const removeZip = async () => {
    if (!window.confirm('Remove the solution download from this lesson?')) return
    try {
      await api.delete(`/api/admin/learn/lessons/${lessonId}/download`, auth)
      setDownload(null)
      toast.success('Solution removed.')
    } catch (err) { toast.error(err.response?.data?.message || 'Could not remove.') }
  }
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
          <h2 className='text-sm font-semibold text-slate-800'>Solution download <span className='text-slate-400 font-normal'>(optional .zip, 25 MB max; shown as a download card under the lesson)</span></h2>
          {!isEdit ? (
            <p className='text-sm text-slate-500'>Save the lesson first, then edit it to upload a zip.</p>
          ) : (
            <>
              {download ? (
                <p className='text-sm text-slate-700'>
                  <strong>{download.name}</strong> · {sizeText(download.size || 0)} · {download.builtin ? 'built-in file from the project' : 'uploaded by an admin'}
                </p>
              ) : <p className='text-sm text-slate-500'>No download on this lesson yet.</p>}
              <div className='flex flex-wrap items-center gap-3'>
                <label className={`text-xs px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploading ? 'Uploading…' : download ? 'Replace zip' : 'Upload zip'}
                  <input type='file' accept='.zip,application/zip' onChange={uploadZip} className='hidden' />
                </label>
                {download && <button type='button' onClick={removeZip} className='text-xs text-red-500'>Remove</button>}
                <span className='text-xs text-slate-400'>Uploads save straight away; no need to press Save.</span>
              </div>
            </>
          )}
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

        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-3'>
          <h2 className='text-sm font-semibold text-slate-800'>Animation <span className='text-slate-400 font-normal'>(optional step-by-step diagram with captions and a voice-over button, shown above the lesson text)</span></h2>
          <p className='text-xs text-slate-500'>Write it as JSON: <code>nodes</code> sit on a grid (<code>col</code> 0-3, <code>row</code> 0-2) and each <code>step</code> has a <code>say</code> caption, optional <code>on</code> (nodes to light up) and <code>flow</code> (<code>"from&gt;to:label"</code> sends a packet along an arrow). Leave it empty for no animation.</p>
          <textarea value={animText} onChange={(e) => setAnimText(e.target.value)} rows={10} spellCheck={false} className={`${input} font-mono text-xs`} placeholder='Paste the animation JSON here' />
          <div className='flex flex-wrap items-center gap-3'>
            <button type='button' onClick={() => setAnimText(JSON.stringify(ANIMATION_EXAMPLE, null, 2))} className='text-xs px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50'>Insert an example</button>
            {animText.trim() && <button type='button' onClick={() => setAnimText('')} className='text-xs text-red-500'>Remove the animation</button>}
            {anim.ok === true && <span className='text-xs text-green-700'>Valid. Preview below.</span>}
            {anim.ok === false && <span className='text-xs text-red-600'>{anim.message}</span>}
          </div>
          {anim.ok && anim.data && <LessonAnimation key={animText} animation={anim.data} />}
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-3'>
          <h2 className='text-sm font-semibold text-slate-800'>Handwritten notes <span className='text-slate-400 font-normal'>(optional)</span></h2>
          <p className='text-xs text-slate-500'>One key point per line, 3 to 10 lines. Shown at the end of the lesson as a handwritten "My notes" card. Use `backticks` around commands.</p>
          <textarea value={notesText} onChange={(e) => setNotesText(e.target.value)} rows={7} className={input} placeholder={'Git is a program on your computer.\nRun `git status` any time, it is safe.'} />
          <p className={`text-xs ${notesCount > 10 ? 'text-red-600' : 'text-slate-400'}`}>{notesCount} line{notesCount === 1 ? '' : 's'}</p>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-3'>
          <h2 className='text-sm font-semibold text-slate-800'>Quiz <span className='text-slate-400 font-normal'>(optional practice questions shown at the end of the lesson; 60% or more marks the lesson done for the reader)</span></h2>
          <p className='text-xs text-slate-500'>Write it as JSON, a list of questions. Each has <code>q</code>, <code>options</code> (2 to 5), <code>answer</code> (the position of the right option, starting at 0) and an optional <code>explain</code>. Up to 10 questions. Leave it empty for no quiz. The server checks it when you save.</p>
          <textarea value={quizText} onChange={(e) => setQuizText(e.target.value)} rows={8} spellCheck={false} className={`${input} font-mono text-xs`} placeholder='Paste the quiz JSON here' />
          <div className='flex flex-wrap items-center gap-3'>
            <button type='button' onClick={() => setQuizText(JSON.stringify(QUIZ_EXAMPLE, null, 2))} className='text-xs px-2.5 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50'>Insert an example</button>
            {quizText.trim() && <button type='button' onClick={() => setQuizText('')} className='text-xs text-red-500'>Remove the quiz</button>}
            {quizText.trim() && !quizError && <span className='text-xs text-green-700'>Looks like valid JSON.</span>}
            {quizError && <span className='text-xs text-red-600'>{quizError}</span>}
          </div>
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
      {isEdit && <LessonTranslations lessonId={lessonId} auth={auth} />}
    </div>
  )
}

export default AdminLessonEditor
