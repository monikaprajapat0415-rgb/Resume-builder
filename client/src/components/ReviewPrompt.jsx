import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../configs/api'
import { LuStar, LuX } from 'react-icons/lu'

// "How was it?" card shown once after a resume is downloaded. The answer goes to the admin, hidden, and is only
// shown on the home page if an admin publishes it AND the person ticked the permission box. Easy to dismiss.
const KEY = 'prime_review_prompt'
const SNOOZE_DAYS = 30

export const shouldAskForReview = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '{}')
    if (v.done) return false
    if (v.until && Date.now() < v.until) return false
    return true
  } catch { return false }
}
const remember = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch { /* ignore */ } }

export default function ReviewPrompt({ token, onClose }) {
  const [rating, setRating] = useState(0)
  const [quote, setQuote] = useState('')
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // honeypot
  const [busy, setBusy] = useState(false)

  const later = () => { remember({ until: Date.now() + SNOOZE_DAYS * 86400000 }); onClose() }
  const send = async (e) => {
    e.preventDefault()
    if (!rating) return toast.error('Please choose a star rating.')
    if (quote.trim().length < 10) return toast.error('Please write at least a short sentence.')
    setBusy(true)
    try {
      const { data } = await api.post('/api/home/trust/review', { rating, quote, name, consent, website }, { headers: { Authorization: token } })
      remember({ done: true }); toast.success(data.message || 'Thank you!'); onClose()
    } catch (err) { toast.error(err.response?.data?.message || 'Could not send. Please try again.') }
    setBusy(false)
  }

  return (
    <div className='fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-96 z-50 print:hidden' role='dialog' aria-label='Feedback request' data-no-i18n>
      <form onSubmit={send} className='rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='font-semibold text-slate-800'>Your resume is ready. How was it?</p>
            <p className='text-xs text-slate-500 mt-0.5'>Takes 20 seconds and helps other job seekers.</p>
          </div>
          <button type='button' onClick={later} aria-label='Close, ask me later' className='p-1 text-slate-400 hover:text-slate-700'><LuX className='size-5' /></button>
        </div>
        <div className='mt-3 flex gap-1' role='radiogroup' aria-label='Rating'>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type='button' role='radio' aria-checked={rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setRating(n)} className='p-0.5'>
              <LuStar className={`size-7 transition ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-300'}`} />
            </button>
          ))}
        </div>
        <label htmlFor='rp-quote' className='sr-only'>Your feedback</label>
        <textarea id='rp-quote' value={quote} onChange={(e) => setQuote(e.target.value.slice(0, 500))} rows={3} placeholder='What did you like, or what should we improve?'
          className='mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400' />
        <label htmlFor='rp-name' className='sr-only'>Name to show</label>
        <input id='rp-name' value={name} onChange={(e) => setName(e.target.value.slice(0, 40))} placeholder='First name (optional)' autoComplete='given-name'
          className='mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400' />
        <input type='text' name='website' value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete='off' aria-hidden='true' className='hidden' />
        <label className='mt-3 flex items-start gap-2 text-xs text-slate-600'>
          <input type='checkbox' checked={consent} onChange={(e) => setConsent(e.target.checked)} className='mt-0.5' />
          <span>You may show my feedback and first name on Prime Resume AI. (Optional. We read every message either way.)</span>
        </label>
        <div className='mt-4 flex items-center justify-between'>
          <button type='button' onClick={later} className='text-xs text-slate-500 hover:text-slate-700 underline'>Maybe later</button>
          <button type='submit' disabled={busy} className='rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60'>{busy ? 'Sending…' : 'Send'}</button>
        </div>
      </form>
    </div>
  )
}
