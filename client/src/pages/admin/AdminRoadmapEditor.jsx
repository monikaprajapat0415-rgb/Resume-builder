import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuPlus, LuTrash2, LuArrowUp, LuArrowDown } from 'react-icons/lu'

const input = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200'
const label = 'block text-xs font-medium text-slate-500 mb-1 mt-3'

const emptyStep = () => ({ title: '', pace: '', description: '', skills: '', tips: '', links: '', layer: '', resources: '' })
// the form keeps lists as text: skills on one line separated by commas, tips and links one per line
const toForm = (r) => ({
  title: r.title || '', slug: r.slug || '', summary: r.summary || '', description: r.description || '', audience: r.audience || '', badge: r.badge || '', kind: r.kind || 'career', aliases: (r.aliases || []).join(', '),
  tags: (r.tags || []).join(', '), order: r.order ?? 0, published: !!r.published, noindex: !!r.noindex, metaTitle: r.metaTitle || '', keywords: r.keywords || '',
  steps: (r.steps || []).map((s) => ({ title: s.title, pace: s.pace || '', description: s.description || '', skills: (s.skills || []).join(', '), tips: (s.tips || []).join('\n'), links: (s.links || []).map((l) => `${l.label} | ${l.url}`).join('\n'), layer: s.layer || '', resources: (s.resources || []).map((x) => `${x.label} | ${x.url} | ${x.type || 'docs'} | ${x.free === false ? 'paid' : 'free'}`).join('\n') })),
  faqs: (r.faqs || []).map((f) => ({ q: f.q, a: f.a })),
})
const toBody = (f) => ({
  ...f,
  order: Number(f.order) || 0,
  tags: f.tags.split(',').map((t) => t.trim()).filter(Boolean),
  aliases: f.aliases.split(',').map((t) => t.trim()).filter(Boolean),
  steps: f.steps.map((s) => ({
    title: s.title, pace: s.pace, description: s.description,
    skills: s.skills.split(',').map((t) => t.trim()).filter(Boolean),
    tips: s.tips.split('\n').map((t) => t.trim()).filter(Boolean),
    links: s.links.split('\n').map((line) => { const [l, ...u] = line.split('|'); return { label: (l || '').trim(), url: u.join('|').trim() } }).filter((x) => x.label && x.url),
    layer: s.layer,
    // one per line: Label | https://address | docs/course/video/book/practice/tool | free/paid
    resources: s.resources.split('\n').map((line) => { const [l, u, t, p] = line.split('|').map((x) => (x || '').trim()); return { label: l, url: u, type: t || 'docs', free: (p || 'free').toLowerCase() !== 'paid' } }).filter((x) => x.label && x.url),
  })),
})

const AdminRoadmapEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const [f, setF] = useState(toForm({ steps: [{ title: '' }] }))
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    api.get(`/api/admin/roadmaps/${id}`, auth)
      .then(({ data }) => setF(toForm(data.roadmap)))
      .catch((e) => { toast.error(e.response?.data?.message || 'Could not load the roadmap.'); navigate('/admin/roadmaps') })
      .finally(() => setLoading(false))
  }, [id])

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const setStep = (i, k, v) => setF((p) => ({ ...p, steps: p.steps.map((s, j) => (j === i ? { ...s, [k]: v } : s)) }))
  const moveStep = (i, d) => setF((p) => {
    const j = i + d
    if (j < 0 || j >= p.steps.length) return p
    const steps = [...p.steps]; [steps[i], steps[j]] = [steps[j], steps[i]]
    return { ...p, steps }
  })
  const setFaq = (i, k, v) => setF((p) => ({ ...p, faqs: p.faqs.map((x, j) => (j === i ? { ...x, [k]: v } : x)) }))

  const save = async (e) => {
    e.preventDefault()
    if (!f.title.trim()) return toast.error('Add a title.')
    if (f.published && !f.steps.some((s) => s.title.trim())) return toast.error('Add at least one step before publishing.')
    setSaving(true)
    try {
      if (id) await api.put(`/api/admin/roadmaps/${id}`, toBody(f), auth)
      else await api.post('/api/admin/roadmaps', toBody(f), auth)
      toast.success('Roadmap saved.')
      navigate('/admin/roadmaps')
    } catch (err) { toast.error(err.response?.data?.message || 'Could not save the roadmap.') }
    setSaving(false)
  }

  if (loading) return <p className='text-slate-400'>Loading…</p>

  return (
    <form onSubmit={save} className='max-w-3xl'>
      <h1 className='text-2xl font-semibold text-slate-800 mb-4'>{id ? 'Edit roadmap' : 'New roadmap'}</h1>

      <div className='bg-white border border-slate-200 rounded-xl p-5'>
        <label className={label} htmlFor='t'>Title</label>
        <input id='t' className={input} value={f.title} onChange={(e) => set('title', e.target.value)} placeholder='Warehouse Worker to Supervisor: Career Roadmap' />
        <label className={label} htmlFor='sl'>URL ending (leave empty to make one from the title)</label>
        <input id='sl' className={input} value={f.slug} onChange={(e) => set('slug', e.target.value)} placeholder='warehouse-worker-to-supervisor' />
        <label className={label} htmlFor='su'>Short line for the card (up to 200 characters)</label>
        <input id='su' className={input} maxLength={200} value={f.summary} onChange={(e) => set('summary', e.target.value)} />
        <label className={label} htmlFor='de'>Description: meta description and intro (up to 320 characters)</label>
        <textarea id='de' className={input} rows={3} maxLength={320} value={f.description} onChange={(e) => set('description', e.target.value)} />
        <div className='grid sm:grid-cols-2 gap-3'>
          <div><label className={label} htmlFor='kd'>Kind of roadmap</label>
            <select id='kd' className={input} value={f.kind} onChange={(e) => set('kind', e.target.value)}>
              <option value='career'>Career path (e.g. Warehouse worker to supervisor)</option>
              <option value='role'>Job role (e.g. Full Stack Developer)</option>
              <option value='technology'>Technology (e.g. React, SQL)</option>
            </select></div>
          <div><label className={label} htmlFor='al'>Other names people search for (comma separated)</label><input id='al' className={input} value={f.aliases} onChange={(e) => set('aliases', e.target.value)} placeholder='fullstack, full-stack, mern' /></div>
        </div>
        <div className='grid sm:grid-cols-3 gap-3'>
          <div><label className={label} htmlFor='au'>Group (e.g. Skilled trades)</label><input id='au' className={input} value={f.audience} onChange={(e) => set('audience', e.target.value)} /></div>
          <div><label className={label} htmlFor='ba'>Badge (1-3 letters)</label><input id='ba' className={input} maxLength={3} value={f.badge} onChange={(e) => set('badge', e.target.value)} /></div>
          <div><label className={label} htmlFor='or'>Order (lower first)</label><input id='or' type='number' className={input} value={f.order} onChange={(e) => set('order', e.target.value)} /></div>
        </div>
        <label className={label} htmlFor='tg'>Tags (comma separated)</label>
        <input id='tg' className={input} value={f.tags} onChange={(e) => set('tags', e.target.value)} />
      </div>

      <h2 className='text-lg font-semibold text-slate-800 mt-8 mb-3'>Steps</h2>
      {f.steps.map((s, i) => (
        <div key={i} className='bg-white border border-slate-200 rounded-xl p-5 mb-4'>
          <div className='flex items-center justify-between gap-2'>
            <p className='font-medium text-slate-700'>Step {i + 1}</p>
            <div className='flex items-center'>
              <button type='button' onClick={() => moveStep(i, -1)} disabled={i === 0} className='p-2 text-slate-400 hover:text-brand-600 disabled:opacity-30' aria-label='Move up'><LuArrowUp className='size-4' /></button>
              <button type='button' onClick={() => moveStep(i, 1)} disabled={i === f.steps.length - 1} className='p-2 text-slate-400 hover:text-brand-600 disabled:opacity-30' aria-label='Move down'><LuArrowDown className='size-4' /></button>
              <button type='button' onClick={() => set('steps', f.steps.filter((_, j) => j !== i))} className='p-2 text-slate-400 hover:text-red-600' aria-label='Remove step'><LuTrash2 className='size-4' /></button>
            </div>
          </div>
          <div className='grid sm:grid-cols-3 gap-3'>
            <div className='sm:col-span-2'><label className={label}>Title</label><input className={input} value={s.title} onChange={(e) => setStep(i, 'title', e.target.value)} /></div>
            <div><label className={label}>Suggested pace</label><input className={input} value={s.pace} onChange={(e) => setStep(i, 'pace', e.target.value)} placeholder='Months 2 to 6' /></div>
          </div>
          <label className={label}>What to do</label>
          <textarea className={input} rows={3} value={s.description} onChange={(e) => setStep(i, 'description', e.target.value)} />
          <label className={label}>Skills (comma separated)</label>
          <input className={input} value={s.skills} onChange={(e) => setStep(i, 'skills', e.target.value)} />
          <label className={label}>Tips (one per line)</label>
          <textarea className={input} rows={2} value={s.tips} onChange={(e) => setStep(i, 'tips', e.target.value)} />
          <label className={label}>Part of the stack (e.g. Frontend, Backend, Database, DevOps). Steps with the same name are grouped in the “stack end to end” box</label>
          <input className={input} value={s.layer} onChange={(e) => setStep(i, 'layer', e.target.value)} placeholder='Frontend' />
          <label className={label}>Best places to learn (one per line, as: Label | https://address | docs, course, video, book, practice or tool | free or paid)</label>
          <textarea className={input} rows={3} value={s.resources} onChange={(e) => setStep(i, 'resources', e.target.value)} placeholder='React documentation | https://react.dev/learn | docs | free' />
          <label className={label}>Links (one per line, as: Label | /page-or-https-address)</label>
          <textarea className={input} rows={2} value={s.links} onChange={(e) => setStep(i, 'links', e.target.value)} placeholder='Build your resume | /cv-builder' />
        </div>
      ))}
      <button type='button' onClick={() => set('steps', [...f.steps, emptyStep()])} className='inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full text-sm hover:bg-slate-50'><LuPlus className='size-4' /> Add step</button>

      <h2 className='text-lg font-semibold text-slate-800 mt-8 mb-3'>Frequently asked questions</h2>
      {f.faqs.map((q, i) => (
        <div key={i} className='bg-white border border-slate-200 rounded-xl p-4 mb-3'>
          <input className={input} placeholder='Question' value={q.q} onChange={(e) => setFaq(i, 'q', e.target.value)} />
          <textarea className={`${input} mt-2`} rows={2} placeholder='Answer' value={q.a} onChange={(e) => setFaq(i, 'a', e.target.value)} />
          <button type='button' onClick={() => set('faqs', f.faqs.filter((_, j) => j !== i))} className='text-xs text-red-600 mt-2'>Remove question</button>
        </div>
      ))}
      <button type='button' onClick={() => set('faqs', [...f.faqs, { q: '', a: '' }])} className='inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full text-sm hover:bg-slate-50'><LuPlus className='size-4' /> Add question</button>

      <h2 className='text-lg font-semibold text-slate-800 mt-8 mb-3'>Search and visibility</h2>
      <div className='bg-white border border-slate-200 rounded-xl p-5'>
        <label className={label} htmlFor='mt'>Page title for search results (optional)</label>
        <input id='mt' className={input} value={f.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} />
        <label className={label} htmlFor='kw'>Keywords (optional)</label>
        <input id='kw' className={input} value={f.keywords} onChange={(e) => set('keywords', e.target.value)} />
        <label className='flex items-center gap-2 text-sm mt-4'><input type='checkbox' checked={f.published} onChange={(e) => set('published', e.target.checked)} /> Published (visible to everyone)</label>
        <label className='flex items-center gap-2 text-sm mt-2'><input type='checkbox' checked={f.noindex} onChange={(e) => set('noindex', e.target.checked)} /> Hide from search engines (noindex)</label>
      </div>

      <div className='flex gap-3 mt-6'>
        <button type='submit' disabled={saving} className='px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium disabled:opacity-60'>{saving ? 'Saving…' : 'Save roadmap'}</button>
        <button type='button' onClick={() => navigate('/admin/roadmaps')} className='px-6 py-2 border border-slate-200 rounded-full text-sm'>Cancel</button>
      </div>
    </form>
  )
}

export default AdminRoadmapEditor
