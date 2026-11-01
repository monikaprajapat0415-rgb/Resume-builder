import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuCheck, LuX, LuTrash2, LuPencil, LuPlus, LuFlag } from 'react-icons/lu'
import PublishSwitch from '../../components/admin/PublishSwitch'

const input = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300'
const TABS = [['answers', 'Answers'], ['salaries', 'Salary reports'], ['reviews', 'Company reviews'], ['questions', 'Interview questions']]
const STATUS = { pending: 'bg-amber-100 text-amber-800', approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' }
const when = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

// ---------- moderation list for answers / salaries / reviews ----------
const Moderation = ({ type, auth, onChange }) => {
  const [status, setStatus] = useState('pending')
  const [reported, setReported] = useState(false)
  const [items, setItems] = useState(null)
  const [edit, setEdit] = useState(null)
  const load = useCallback(() => {
    api.get(`/api/admin/community/${type}?${status ? `status=${status}&` : ''}${reported ? 'reported=1' : ''}`, auth)
      .then(({ data }) => setItems(data.items)).catch((e) => toast.error(e.response?.data?.message || 'Could not load.'))
  }, [type, status, reported])
  useEffect(() => { setItems(null); setEdit(null); load() }, [load])

  const act = async (fn, msg) => { try { await fn(); toast.success(msg); load(); onChange?.(); window.dispatchEvent(new Event('admin-review-changed')) } catch (e) { toast.error(e.response?.data?.message || 'Failed.') } }
  const setSt = (i, s) => act(() => api.put(`/api/admin/community/${type}/${i._id}`, { status: s }, auth), s === 'approved' ? 'Approved.' : s === 'rejected' ? 'Rejected.' : 'Saved.')
  const del = (i) => window.confirm('Delete this permanently?') && act(() => api.delete(`/api/admin/community/${type}/${i._id}`, auth), 'Deleted.')
  const save = () => act(async () => { await api.put(`/api/admin/community/${type}/${edit._id}`, edit, auth); setEdit(null) }, 'Saved.')
  const f = (k) => ({ value: edit[k] ?? '', onChange: (e) => setEdit({ ...edit, [k]: e.target.value }), className: input })

  const body = (i) => {
    if (type === 'answers') return <><p className='text-xs text-slate-400'>On: {i.question?.question || '(deleted question)'}</p><p className='text-sm text-slate-700 mt-1 whitespace-pre-line'>{i.body}</p></>
    if (type === 'salaries') return <p className='text-sm text-slate-700'><strong>{i.roleTitle}</strong> · {i.amount.toLocaleString()} {i.currency} per {i.period} · {i.country}{i.city ? `, ${i.city}` : ''}{i.company ? ` · ${i.company}` : ''} · {i.level}{i.experienceYears ? `, ${i.experienceYears} yrs` : ''}</p>
    return <><p className='text-sm text-slate-700'><strong>{i.company}</strong> · {'★'.repeat(i.rating)} · {i.title}</p>{i.pros && <p className='text-sm text-slate-600 mt-1'>Good: {i.pros}</p>}{i.cons && <p className='text-sm text-slate-600 mt-1'>Could be better: {i.cons}</p>}</>
  }
  const form = () => {
    if (type === 'answers') return <textarea rows={5} {...f('body')} />
    if (type === 'salaries') return <div className='grid sm:grid-cols-3 gap-2'><input {...f('roleTitle')} placeholder='Role' /><input {...f('company')} placeholder='Company' /><input type='number' {...f('amount')} /></div>
    return <div className='space-y-2'><input {...f('title')} /><textarea rows={3} {...f('pros')} /><textarea rows={3} {...f('cons')} /><input type='number' min='1' max='5' {...f('rating')} /></div>
  }
  const pick = (i) => (type === 'answers' ? { _id: i._id, body: i.body } : type === 'salaries' ? { _id: i._id, roleTitle: i.roleTitle, company: i.company, amount: i.amount } : { _id: i._id, title: i.title, pros: i.pros, cons: i.cons, rating: i.rating })

  return (
    <div>
      <div className='flex flex-wrap items-center gap-2 mb-4'>
        {['pending', 'approved', 'rejected', ''].map((s) => (
          <button key={s || 'all'} onClick={() => setStatus(s)} className={`px-3 py-1 rounded-full text-xs border ${status === s ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-200 bg-white text-slate-600'}`}>{s || 'all'}</button>
        ))}
        <label className='ml-2 flex items-center gap-1.5 text-xs text-slate-600'><input type='checkbox' checked={reported} onChange={(e) => setReported(e.target.checked)} /> Reported by readers only</label>
      </div>
      {items === null ? <p className='text-slate-400'>Loading…</p> : items.length === 0 ? <p className='text-slate-400'>Nothing here.</p> : (
        <div className='space-y-3'>
          {items.map((i) => (
            <div key={i._id} className='rounded-xl border border-slate-200 bg-white p-4'>
              <div className='flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2'>
                <span className={`px-2 py-0.5 rounded-full ${STATUS[i.status]}`}>{i.status}</span>
                {i.reportCount > 0 && <span className='inline-flex items-center gap-1 text-red-600'><LuFlag className='size-3' />{i.reportCount} report{i.reportCount > 1 ? 's' : ''}</span>}
                <span>{when(i.createdAt)}</span>
                <span>by {i.user?.name || 'unknown'} ({i.user?.email || 'deleted user'}) {i.displayName ? `· shown as ${i.displayName}` : ''}</span>
              </div>
              {edit?._id === i._id ? form() : body(i)}
              <div className='flex flex-wrap gap-2 mt-3'>
                {edit?._id === i._id ? (<>
                  <button onClick={save} className='px-3 py-1 rounded-full text-xs bg-brand-600 text-white'>Save</button>
                  <button onClick={() => setEdit(null)} className='px-3 py-1 rounded-full text-xs border border-slate-200'>Cancel</button>
                </>) : (<>
                  {i.status !== 'approved' && <button onClick={() => setSt(i, 'approved')} className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-600 text-white'><LuCheck className='size-3' />Approve</button>}
                  {i.status !== 'rejected' && <button onClick={() => setSt(i, 'rejected')} className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-slate-700 text-white'><LuX className='size-3' />Reject</button>}
                  <button onClick={() => setEdit(pick(i))} className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border border-slate-200'><LuPencil className='size-3' />Edit</button>
                  <button onClick={() => del(i)} className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border border-red-200 text-red-600'><LuTrash2 className='size-3' />Delete</button>
                </>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- interview questions CRUD ----------
const EMPTY = { question: '', category: 'General', level: 'both', modelAnswer: '', tips: '', tags: '', learnCourse: '', learnLesson: '', order: 0, published: true }
const Questions = ({ auth }) => {
  const [rows, setRows] = useState(null)
  const [form, setForm] = useState(null)   // null = list, object = editor
  const load = () => api.get('/api/admin/community/questions', auth).then(({ data }) => setRows(data.questions)).catch((e) => toast.error(e.response?.data?.message || 'Could not load.'))
  useEffect(() => { load() }, [])
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const open = (q) => setForm(q ? { ...q, tips: (q.tips || []).join('\n'), tags: (q.tags || []).join(', ') } : { ...EMPTY })
  const save = async (e) => {
    e.preventDefault()
    try {
      if (form._id) await api.put(`/api/admin/community/questions/${form._id}`, form, auth)
      else await api.post('/api/admin/community/questions', form, auth)
      toast.success('Saved.'); setForm(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Could not save.') }
  }
  const setPublished = async (q, published) => {
    try {
      await api.put(`/api/admin/community/questions/${q._id}`, { published }, auth)
      setRows((prev) => prev.map((x) => (x._id === q._id ? { ...x, published } : x)))
      toast.success(published ? 'Question published.' : 'Question hidden. Its page now shows not found.')
    } catch (err) { toast.error(err.response?.data?.message || 'Could not change this question.') }
  }
  const del = async (q) => {
    if (!window.confirm(`Delete "${q.question}" and all answers shared on it?`)) return
    try { await api.delete(`/api/admin/community/questions/${q._id}`, auth); toast.success('Deleted.'); load() } catch (err) { toast.error(err.response?.data?.message || 'Failed.') }
  }
  if (form) return (
    <form onSubmit={save} className='space-y-3 max-w-3xl'>
      <label className='block text-sm'>Question<input value={form.question} onChange={set('question')} required minLength={8} className={input} /></label>
      <div className='grid sm:grid-cols-3 gap-3'>
        <label className='block text-sm'>Category<input value={form.category} onChange={set('category')} className={input} /></label>
        <label className='block text-sm'>Level<select value={form.level} onChange={set('level')} className={input}><option value='both'>Fresher and experienced</option><option value='fresher'>Fresher</option><option value='experienced'>Experienced</option></select></label>
        <label className='block text-sm'>Order<input type='number' value={form.order} onChange={set('order')} className={input} /></label>
      </div>
      <label className='block text-sm'>Model answer (blank line = new paragraph; helpful, honest, 80+ words)<textarea rows={10} value={form.modelAnswer} onChange={set('modelAnswer')} className={input} /></label>
      <label className='block text-sm'>Tips (one per line)<textarea rows={3} value={form.tips} onChange={set('tips')} className={input} /></label>
      <label className='block text-sm'>Tags (comma separated)<input value={form.tags} onChange={set('tags')} className={input} /></label>
      <div className='grid sm:grid-cols-2 gap-3'>
        <label className='block text-sm'>Course to link (optional: the slug in /learn/slug)<input value={form.learnCourse || ''} onChange={set('learnCourse')} className={input} placeholder='python-for-beginners-course' /></label>
        <label className='block text-sm'>Lesson to link (optional: the lesson slug)<input value={form.learnLesson || ''} onChange={set('learnLesson')} className={input} placeholder='functions-in-python' /></label>
      </div>
      <p className='text-xs text-slate-500 -mt-1'>The question page shows a "Learn this topic" link. It appears only while that course or lesson is published. Leave both empty for no link.</p>
      <label className='flex items-center gap-2 text-sm'><input type='checkbox' checked={form.published} onChange={set('published')} /> Published (visible and in the sitemap)</label>
      <div className='flex gap-2'><button className='px-5 py-2 bg-brand-600 text-white rounded-full text-sm'>Save</button><button type='button' onClick={() => setForm(null)} className='px-5 py-2 border border-slate-200 rounded-full text-sm'>Cancel</button></div>
    </form>
  )
  return (
    <div>
      <button onClick={() => open(null)} className='inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-full text-sm mb-4'><LuPlus className='size-4' />New question</button>
      {rows === null ? <p className='text-slate-400'>Loading…</p> : (
        <div className='divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white'>
          {rows.map((q) => (
            <div key={q._id} className='flex items-center gap-3 px-4 py-3'>
              <div className='min-w-0 flex-1'><p className='text-sm text-slate-800 truncate'>{q.question}</p><p className='text-xs text-slate-400'>{q.category} · {q.level} · {q.answerCount} answers · {q.views} views</p></div>
              <PublishSwitch on={q.published} name={q.question} onChange={(v) => setPublished(q, v)} />
              <button onClick={() => open(q)} className='p-2 hover:bg-slate-100 rounded-md' title='Edit'><LuPencil className='size-4 text-slate-600' /></button>
              <button onClick={() => del(q)} className='p-2 hover:bg-slate-100 rounded-md' title='Delete'><LuTrash2 className='size-4 text-red-500' /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const AdminCommunity = () => {
  const { token } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const [tab, setTab] = useState('answers')
  const [sum, setSum] = useState(null)
  const refresh = () => api.get('/api/admin/community/summary', auth).then(({ data }) => setSum(data)).catch(() => {})
  useEffect(() => { refresh() }, [])
  return (
    <div className='max-w-4xl'>
      <h1 className='text-2xl font-semibold text-slate-800 mb-2'>Jobs community</h1>
      <p className='text-sm text-slate-500 mb-5'>Everything readers submit waits here first. Approve to publish, reject to hide, or edit and delete. Items that several readers report go back to “pending” automatically.</p>
      <div className='flex flex-wrap gap-2 mb-6'>
        {TABS.map(([id, label]) => {
          const n = sum?.pending?.[id]
          return <button key={id} onClick={() => setTab(id)} className={`px-4 py-1.5 rounded-full text-sm border ${tab === id ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}>{label}{n > 0 && <span className='ml-1.5 rounded-full bg-amber-400 text-slate-900 text-xs px-1.5'>{n}</span>}</button>
        })}
      </div>
      {tab === 'questions' ? <Questions auth={auth} /> : <Moderation key={tab} type={tab} auth={auth} onChange={refresh} />}
    </div>
  )
}
export default AdminCommunity
