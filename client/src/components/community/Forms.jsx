import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { input, button } from './Shell'

export const LoginPrompt = ({ what }) => (
  <p className='rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600'>
    <Link to='/app?state=login' className='text-brand-600 font-medium hover:underline'>Log in</Link> or <Link to='/app?state=register' className='text-brand-600 font-medium hover:underline'>create a free account</Link> to {what}. Your name is never shown unless you choose it.
  </p>
)

// Shared submit helper: posts, shows the server's message, reports success to the caller.
const useSubmit = (url, onDone) => {
  const { token } = useSelector((s) => s.auth)
  const [busy, setBusy] = useState(false)
  const send = async (body) => {
    setBusy(true)
    try {
      const { data } = await api.post(url, body, { headers: { Authorization: token } })
      toast.success(data.message || 'Thanks!')
      onDone?.()
      return true
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not send. Please try again.')
      return false
    } finally { setBusy(false) }
  }
  return { send, busy, token }
}

const Field = ({ label, children, hint }) => (
  <label className='block text-sm'>
    <span className='block text-slate-700 mb-1'>{label}</span>
    {children}
    {hint && <span className='block text-xs text-slate-400 mt-1'>{hint}</span>}
  </label>
)
const Anon = ({ value, onChange }) => (
  <label className='flex items-center gap-2 text-sm text-slate-600'>
    <input type='checkbox' checked={value} onChange={(e) => onChange(e.target.checked)} /> Post anonymously (otherwise your first name and last initial are shown)
  </label>
)

export const AnswerForm = ({ slug, onDone }) => {
  const [body, setBody] = useState('')
  const [anonymous, setAnonymous] = useState(true)
  const { send, busy, token } = useSubmit(`/api/community/questions/${slug}/answers`, () => { setBody(''); onDone?.() })
  if (!token) return <LoginPrompt what='add your own answer' />
  return (
    <form onSubmit={(e) => { e.preventDefault(); send({ body, anonymous }) }} className='space-y-3'>
      <Field label='Your answer' hint='Write it the way you would say it in the interview. No links. Answers are read before they are published.'>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} maxLength={3000} required minLength={40} className={input} />
      </Field>
      <Anon value={anonymous} onChange={setAnonymous} />
      <button disabled={busy} className={button}>{busy ? 'Sending…' : 'Submit answer'}</button>
    </form>
  )
}

export const SalaryForm = ({ role = '', onDone }) => {
  const [meta, setMeta] = useState(null)
  const [f, setF] = useState({ roleTitle: role, company: '', country: 'India', city: '', level: 'mid', experienceYears: '', amount: '', currency: 'INR', period: 'month' })
  useEffect(() => { api.get('/api/community/meta').then(({ data }) => setMeta(data)).catch(() => {}) }, [])
  const { send, busy, token } = useSubmit('/api/community/salaries', () => { setF((p) => ({ ...p, amount: '', company: '', city: '' })); onDone?.() })
  if (!token) return <LoginPrompt what='share your salary' />
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }))
  const country = (e) => setF((p) => ({ ...p, country: e.target.value, currency: meta?.countryCurrency?.[e.target.value] || p.currency }))
  return (
    <form onSubmit={(e) => { e.preventDefault(); send(f) }} className='grid sm:grid-cols-2 gap-3'>
      <Field label='Job title'><input value={f.roleTitle} onChange={set('roleTitle')} required minLength={3} maxLength={80} placeholder='e.g. Forklift operator' className={input} /></Field>
      <Field label='Company (optional)'><input value={f.company} onChange={set('company')} maxLength={80} className={input} /></Field>
      <Field label='Country'><select value={f.country} onChange={country} className={input}>{(meta?.countries || ['India']).map((c) => <option key={c}>{c}</option>)}</select></Field>
      <Field label='City (optional)'><input value={f.city} onChange={set('city')} maxLength={60} className={input} /></Field>
      <Field label='Level'><select value={f.level} onChange={set('level')} className={input}>{(meta?.levels || ['mid']).map((l) => <option key={l} value={l}>{l[0].toUpperCase() + l.slice(1)}</option>)}</select></Field>
      <Field label='Years of experience'><input type='number' min='0' max='50' value={f.experienceYears} onChange={set('experienceYears')} className={input} /></Field>
      <Field label='Pay amount'><input type='number' min='1' value={f.amount} onChange={set('amount')} required className={input} /></Field>
      <div className='grid grid-cols-2 gap-3'>
        <Field label='Currency'><select value={f.currency} onChange={set('currency')} className={input}>{(meta?.currencies || ['INR']).map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label='Paid per'><select value={f.period} onChange={set('period')} className={input}>{(meta?.periods || ['month']).map((p) => <option key={p} value={p}>{p}</option>)}</select></Field>
      </div>
      <p className='sm:col-span-2 text-xs text-slate-400'>Enter your pay before deductions, for work you really do or did. Only the role, country and amount are published, never your name or account.</p>
      <div className='sm:col-span-2'><button disabled={busy} className={button}>{busy ? 'Sending…' : 'Share salary'}</button></div>
    </form>
  )
}

export const ReviewForm = ({ company = '', onDone }) => {
  const [f, setF] = useState({ company, rating: 0, title: '', pros: '', cons: '', jobTitle: '', employment: 'former', anonymous: true })
  const { send, busy, token } = useSubmit('/api/community/reviews', () => { setF((p) => ({ ...p, rating: 0, title: '', pros: '', cons: '' })); onDone?.() })
  if (!token) return <LoginPrompt what='review a company' />
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }))
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!f.rating) return toast.error('Choose a star rating.'); send(f) }} className='grid sm:grid-cols-2 gap-3'>
      <Field label='Company'><input value={f.company} onChange={set('company')} required minLength={2} maxLength={80} readOnly={Boolean(company)} className={input} /></Field>
      <Field label='Your job title (optional)'><input value={f.jobTitle} onChange={set('jobTitle')} maxLength={80} className={input} /></Field>
      <Field label='Your connection'><select value={f.employment} onChange={set('employment')} className={input}><option value='current'>Current employee</option><option value='former'>Former employee</option><option value='candidate'>Interviewed / applied</option></select></Field>
      <div className='text-sm'>
        <span className='block text-slate-700 mb-1'>Overall rating</span>
        <div role='radiogroup' aria-label='Rating' className='flex gap-1'>
          {[1, 2, 3, 4, 5].map((n) => (
            <button type='button' key={n} role='radio' aria-checked={f.rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setF((p) => ({ ...p, rating: n }))}
              className={`text-2xl leading-none ${n <= f.rating ? 'text-amber-500' : 'text-slate-300'}`}>★</button>
          ))}
        </div>
      </div>
      <div className='sm:col-span-2'><Field label='Headline'><input value={f.title} onChange={set('title')} required minLength={5} maxLength={120} className={input} /></Field></div>
      <Field label='What was good'><textarea value={f.pros} onChange={set('pros')} rows={4} maxLength={1500} className={input} /></Field>
      <Field label='What could be better'><textarea value={f.cons} onChange={set('cons')} rows={4} maxLength={1500} className={input} /></Field>
      <div className='sm:col-span-2 space-y-3'>
        <Anon value={f.anonymous} onChange={(v) => setF((p) => ({ ...p, anonymous: v }))} />
        <p className='text-xs text-slate-400'>Be fair and stick to your own experience. No links, personal details of other people or abuse. Reviews are read before they are published.</p>
        <button disabled={busy} className={button}>{busy ? 'Sending…' : 'Submit review'}</button>
      </div>
    </form>
  )
}

export const ReportButton = ({ type, id }) => {
  const { token } = useSelector((s) => s.auth)
  const [done, setDone] = useState(false)
  if (!token || done) return done ? <span className='text-xs text-slate-400'>Reported</span> : null
  const go = async () => {
    try { await api.post(`/api/community/report/${type}/${id}`, {}, { headers: { Authorization: token } }); setDone(true); toast.success('Thanks, we will take a look.') }
    catch (e) { toast.error(e.response?.data?.message || 'Could not report.') }
  }
  return <button type='button' onClick={go} className='text-xs text-slate-400 hover:text-red-600'>Report</button>
}
