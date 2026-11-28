import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuPlus, LuTrash2, LuPencil, LuExternalLink, LuBellRing, LuX, LuMapPin, LuCalendar } from 'react-icons/lu'
import { BiLoaderAlt } from 'react-icons/bi'
import SEO from '../components/SEO'
import api from '../configs/api'
import { COLUMNS, groupByStatus, dueState, dueCount, dayValue, prettyDay, todayLocal } from '../utils/trackerLib'

// Private job application board in the signed-in area (/app/tracker). Admin > Free tools switches it on or off and sets the
// number of jobs per user. Reminders are shown on this board only: nothing is emailed or pushed.
const input = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400'
const BLANK = { company: '', role: '', jobUrl: '', location: '', status: 'applied', appliedOn: '', followUpOn: '', notes: '' }
const errMsg = (e, fallback) => e?.response?.data?.message || fallback

const Field = ({ label, children, className = '' }) => (
  <label className={`block ${className}`}><span className='block text-xs font-medium text-slate-600 mb-1'>{label}</span>{children}</label>
)

const Card = ({ c, today, onEdit, onMove, onDelete, dragging, setDragging }) => {
  const due = dueState(c, today)
  return (
    <li draggable onDragStart={(e) => { e.dataTransfer.setData('text/plain', c._id); e.dataTransfer.effectAllowed = 'move'; setDragging(c._id) }} onDragEnd={() => setDragging('')}
      className={`rounded-xl border bg-white p-3.5 shadow-sm cursor-grab active:cursor-grabbing ${dragging === c._id ? 'opacity-50' : ''} ${due === 'overdue' ? 'border-red-300' : due === 'today' ? 'border-amber-300' : 'border-slate-200'}`}>
      <p className='font-semibold text-slate-800 text-sm break-words'>{c.company}</p>
      <p className='text-sm text-slate-600 break-words'>{c.role}</p>
      {c.location && <p className='mt-1 text-xs text-slate-500 flex items-center gap-1'><LuMapPin className='size-3' aria-hidden />{c.location}</p>}
      {c.appliedOn && <p className='mt-1 text-xs text-slate-500 flex items-center gap-1'><LuCalendar className='size-3' aria-hidden />Applied {prettyDay(c.appliedOn)}</p>}
      {due && <p className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${due === 'overdue' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800'}`}><LuBellRing className='size-3' aria-hidden />{due === 'overdue' ? `Follow up was due ${prettyDay(c.followUpOn)}` : 'Follow up today'}</p>}
      {!due && c.followUpOn && c.status !== 'closed' && c.status !== 'offer' && <p className='mt-2 text-xs text-slate-500'>Follow up on {prettyDay(c.followUpOn)}</p>}
      {c.notes && <p className='mt-2 text-xs text-slate-600 whitespace-pre-line line-clamp-3'>{c.notes}</p>}
      <div className='mt-3 flex flex-wrap items-center gap-2'>
        <label className='sr-only' htmlFor={`mv-${c._id}`}>Move {c.company} to another column</label>
        <select id={`mv-${c._id}`} value={c.status} onChange={(e) => onMove(c, e.target.value)} className='rounded-md border border-slate-300 bg-white px-2 py-1 text-xs'>
          {COLUMNS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
        </select>
        {c.jobUrl && <a href={c.jobUrl} target='_blank' rel='noopener noreferrer nofollow' className='text-slate-500 hover:text-brand-700 p-1' aria-label={`Open the ${c.company} job link`}><LuExternalLink className='size-4' /></a>}
        <button type='button' onClick={() => onEdit(c)} className='text-slate-500 hover:text-brand-700 p-1' aria-label={`Edit ${c.company}`}><LuPencil className='size-4' /></button>
        <button type='button' onClick={() => onDelete(c)} className='text-slate-500 hover:text-red-600 p-1' aria-label={`Delete ${c.company}`}><LuTrash2 className='size-4' /></button>
      </div>
    </li>
  )
}

const Tracker = () => {
  const { token } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const [items, setItems] = useState(null)
  const [limit, setLimit] = useState(200)
  const [off, setOff] = useState(false)
  const [form, setForm] = useState(null)       // null = closed; otherwise the card being added or edited
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState('')
  const [overCol, setOverCol] = useState('')
  const today = todayLocal()

  useEffect(() => {
    api.get('/api/tracker', auth).then(({ data }) => { setItems(data.items); setLimit(data.limit) })
      .catch((e) => { if (e.response?.status === 403) setOff(true); else toast.error(errMsg(e, 'Could not load your jobs.')); setItems([]) })
  }, [])

  const groups = useMemo(() => groupByStatus(items || [], today), [items, today])
  const due = useMemo(() => dueCount(items || [], today), [items, today])
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const openNew = (status = 'applied') => setForm({ ...BLANK, status, appliedOn: status === 'applied' ? today : '' })
  const openEdit = (c) => setForm({ ...BLANK, ...c, appliedOn: dayValue(c.appliedOn), followUpOn: dayValue(c.followUpOn) })

  const save = async (e) => {
    e.preventDefault(); setBusy(true)
    const body = { company: form.company, role: form.role, jobUrl: form.jobUrl, location: form.location, status: form.status, appliedOn: form.appliedOn || null, followUpOn: form.followUpOn || null, notes: form.notes }
    try {
      if (form._id) { const { data } = await api.put(`/api/tracker/${form._id}`, body, auth); setItems((cur) => cur.map((x) => (x._id === form._id ? data.item : x))) }
      else { const { data } = await api.post('/api/tracker', body, auth); setItems((cur) => [data.item, ...cur]) }
      setForm(null)
    } catch (err) { toast.error(errMsg(err, 'Could not save.')) }
    setBusy(false)
  }

  const move = async (c, status) => {
    if (status === c.status) return
    const before = items
    setItems((cur) => cur.map((x) => (x._id === c._id ? { ...x, status, updatedAt: new Date().toISOString() } : x)))
    try { await api.put(`/api/tracker/${c._id}`, { status }, auth) }
    catch (err) { setItems(before); toast.error(errMsg(err, 'Could not move this job.')) }
  }

  const remove = async (c) => {
    if (!window.confirm(`Delete ${c.company} (${c.role}) from your board? This cannot be undone.`)) return
    try { await api.delete(`/api/tracker/${c._id}`, auth); setItems((cur) => cur.filter((x) => x._id !== c._id)) }
    catch (err) { toast.error(errMsg(err, 'Could not delete.')) }
  }

  const drop = (status) => (e) => {
    e.preventDefault(); setOverCol(''); setDragging('')
    const id = e.dataTransfer.getData('text/plain'); const c = (items || []).find((x) => x._id === id)
    if (c) move(c, status)
  }

  return (
    <div className='site-w py-8'>
      <SEO title='Job application tracker' description='Keep track of the jobs you applied for.' noindex />
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-800'>My job applications</h1>
          <p className='text-sm text-slate-500 mt-1 max-w-2xl'>Keep every job in one place and move it along as things change. Only you can see this board. Reminders show here when you open the page; we do not send emails or messages for them.</p>
        </div>
        {!off && <button type='button' onClick={() => openNew()} className='inline-flex items-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5'><LuPlus className='size-4' />Add a job</button>}
      </div>

      {off && <p role='status' className='mt-8 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700'>The job tracker is not available right now. Please check again later. <Link to='/app' className='underline text-brand-700'>Back to my resumes</Link></p>}
      {items === null && !off && <p className='mt-8 text-slate-400 flex items-center gap-2'><BiLoaderAlt className='animate-spin' />Loading your jobs…</p>}

      {!off && items && due > 0 && <p role='status' className='mt-5 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-sm px-4 py-1.5'><LuBellRing className='size-4' aria-hidden />{due} job{due === 1 ? ' needs' : 's need'} a follow-up</p>}

      {form && (
        <form onSubmit={save} className='mt-6 rounded-2xl border border-slate-200 bg-white p-5 grid gap-4 sm:grid-cols-2' aria-label={form._id ? 'Edit job' : 'Add a job'}>
          <div className='sm:col-span-2 flex items-center justify-between'>
            <h2 className='font-semibold text-slate-800'>{form._id ? 'Edit job' : 'Add a job'}</h2>
            <button type='button' onClick={() => setForm(null)} className='text-slate-500 hover:text-slate-800 p-1' aria-label='Close'><LuX className='size-5' /></button>
          </div>
          <Field label='Company'><input className={input} value={form.company} onChange={(e) => set({ company: e.target.value })} required maxLength={120} autoFocus /></Field>
          <Field label='Job title'><input className={input} value={form.role} onChange={(e) => set({ role: e.target.value })} required maxLength={120} /></Field>
          <Field label='Job link (optional)'><input className={input} value={form.jobUrl} onChange={(e) => set({ jobUrl: e.target.value })} placeholder='https://...' maxLength={500} inputMode='url' /></Field>
          <Field label='Location (optional)'><input className={input} value={form.location} onChange={(e) => set({ location: e.target.value })} maxLength={120} /></Field>
          <Field label='Column'><select className={input} value={form.status} onChange={(e) => set({ status: e.target.value })}>{COLUMNS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select></Field>
          <div className='grid grid-cols-2 gap-3'>
            <Field label='Applied on'><input type='date' className={input} value={form.appliedOn} onChange={(e) => set({ appliedOn: e.target.value })} /></Field>
            <Field label='Remind me to follow up on'><input type='date' className={input} value={form.followUpOn} onChange={(e) => set({ followUpOn: e.target.value })} /></Field>
          </div>
          <Field label='Notes (optional)' className='sm:col-span-2'><textarea className={input} rows={3} maxLength={2000} value={form.notes} onChange={(e) => set({ notes: e.target.value })} placeholder='Contact name, interview time, questions to ask…' /></Field>
          <div className='sm:col-span-2 flex gap-3'>
            <button disabled={busy} className='rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5'>{busy ? 'Saving…' : 'Save'}</button>
            <button type='button' onClick={() => setForm(null)} className='rounded-full border border-slate-300 text-sm px-6 py-2.5 hover:bg-slate-50'>Cancel</button>
          </div>
        </form>
      )}

      {!off && items && (
        <>
          {items.length === 0 && !form && <p className='mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center text-sm text-slate-600'>Nothing here yet. Press <strong>Add a job</strong> when you apply for one, or save a job you plan to apply for.</p>}
          <div className='mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5'>
            {COLUMNS.map((col) => (
              <section key={col.id} aria-label={`${col.label}, ${groups[col.id].length} job${groups[col.id].length === 1 ? '' : 's'}`}
                onDragOver={(e) => { e.preventDefault(); setOverCol(col.id) }} onDragLeave={() => setOverCol('')} onDrop={drop(col.id)}
                className={`rounded-2xl border p-3 min-h-40 transition ${overCol === col.id ? 'border-brand-400 bg-brand-50' : 'border-slate-200 bg-slate-50'}`}>
                <div className='flex items-center justify-between px-1 pb-2'>
                  <h2 className='text-sm font-semibold text-slate-700'>{col.label} <span className='ml-1 text-xs font-medium text-slate-500'>{groups[col.id].length}</span></h2>
                  <button type='button' onClick={() => openNew(col.id)} className='text-slate-500 hover:text-brand-700 p-1' aria-label={`Add a job to ${col.label}`}><LuPlus className='size-4' /></button>
                </div>
                <p className='px-1 pb-2 text-xs text-slate-500'>{col.hint}</p>
                <ul className='space-y-3'>
                  {groups[col.id].map((c) => <Card key={c._id} c={c} today={today} onEdit={openEdit} onMove={move} onDelete={remove} dragging={dragging} setDragging={setDragging} />)}
                </ul>
              </section>
            ))}
          </div>
          <p className='mt-4 text-xs text-slate-500'>{items.length} of {limit} jobs used. Drag a card to another column, or use the menu on the card.</p>
        </>
      )}
    </div>
  )
}

export default Tracker
