import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuStar, LuTrash2 } from 'react-icons/lu'
import api from '../configs/api'

const MAX = 1000
const when = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

const Stars = ({ value, onChange, size = 'size-5' }) => (
  <span className='inline-flex' role={onChange ? 'radiogroup' : 'img'} aria-label={onChange ? 'Rating' : `${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => {
      const on = n <= Math.round(value || 0)
      const star = <LuStar className={`${size} ${on ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
      return onChange ? (
        <button key={n} type='button' role='radio' aria-checked={value === n} aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(value === n ? 0 : n)} className='p-0.5 hover:scale-110 transition'>{star}</button>
      ) : <span key={n}>{star}</span>
    })}
  </span>
)

// Comment / feedback section under a lesson. Anyone can read; signed-in users can post.
const LessonFeedback = ({ courseSlug, lessonSlug }) => {
  const { user, token } = useSelector((state) => state.auth)
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1, average: null, ratings: 0 })
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [website, setWebsite] = useState('') // honeypot: real people never see it
  const [sending, setSending] = useState(false)
  const base = `/api/learn/${courseSlug}/${lessonSlug}/feedback`
  const auth = token ? { headers: { Authorization: token } } : {}

  const load = useCallback((page = 1) => {
    return api.get(base, { ...auth, params: { page } })
      .then(({ data }) => setData((prev) => ({ ...data, items: page > 1 ? [...prev.items, ...data.items] : data.items })))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [base, token])

  useEffect(() => { setLoading(true); setText(''); setRating(0); load(1) }, [load])

  const submit = async (e) => {
    e.preventDefault()
    if (text.trim().length < 3) return toast.error('Please write at least a few words.')
    setSending(true)
    try {
      await api.post(base, { text, rating: rating || undefined, website }, auth)
      toast.success('Thanks for your feedback!')
      setText(''); setRating(0)
      await load(1)
    } catch (err) { toast.error(err.response?.data?.message || 'Could not send your feedback.') }
    finally { setSending(false) }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete your comment?')) return
    try { await api.delete(`${base}/${id}`, auth); toast.success('Comment deleted.'); await load(1) }
    catch (err) { toast.error(err.response?.data?.message || 'Could not delete.') }
  }

  return (
    <section className='mt-12' aria-labelledby='feedback'>
      <div className='flex flex-wrap items-center justify-between gap-2 mb-4'>
        <h2 id='feedback' className='text-2xl font-semibold text-slate-800'>Feedback and comments{data.total > 0 && <span className='text-base font-normal text-slate-400'> ({data.total})</span>}</h2>
        {data.average && (
          <p className='flex items-center gap-2 text-sm text-slate-500'><Stars value={data.average} size='size-4' />{data.average} from {data.ratings} rating{data.ratings > 1 ? 's' : ''}</p>
        )}
      </div>

      {user ? (
        <form onSubmit={submit} className='rounded-xl border border-slate-200 p-4 bg-slate-50/50'>
          <label htmlFor='feedback-text' className='block text-sm font-medium text-slate-700 mb-1.5'>Was this lesson helpful? Share a question, idea or correction.</label>
          <textarea id='feedback-text' value={text} onChange={(e) => setText(e.target.value.slice(0, MAX))} rows={4}
            placeholder='Write your feedback…' className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300' />
          <input type='text' name='website' value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete='off' aria-hidden='true' className='hidden' />
          <div className='mt-3 flex flex-wrap items-center justify-between gap-3'>
            <div className='flex items-center gap-2 text-sm text-slate-500'>Rating (optional) <Stars value={rating} onChange={setRating} /></div>
            <div className='flex items-center gap-3'>
              <span className='text-xs text-slate-400'>{text.length}/{MAX}</span>
              <button type='submit' disabled={sending} className='px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-full text-sm font-medium transition'>{sending ? 'Sending…' : 'Post feedback'}</button>
            </div>
          </div>
          <p className='mt-2 text-xs text-slate-400'>Posted as {String(user.name || '').split(' ')[0] || 'you'}. Only your first name is shown.</p>
        </form>
      ) : (
        <div className='rounded-xl border border-slate-200 p-4 bg-slate-50/50 text-sm text-slate-600'>
          <Link to='/app?state=login' className='text-brand-700 font-medium hover:underline'>Sign in</Link> or <Link to='/app?state=register' className='text-brand-700 font-medium hover:underline'>create a free account</Link> to leave feedback on this lesson.
        </div>
      )}

      <div className='mt-5 divide-y divide-slate-100'>
        {loading && <p className='py-4 text-sm text-slate-400'>Loading comments…</p>}
        {!loading && data.items.length === 0 && <p className='py-4 text-sm text-slate-400'>No comments yet. Be the first to share feedback.</p>}
        {data.items.map((f) => (
          <article key={f._id} className='py-4'>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
              <span className='font-medium text-slate-800 text-sm'>{f.name}</span>
              {f.rating && <Stars value={f.rating} size='size-3.5' />}
              <time className='text-xs text-slate-400' dateTime={new Date(f.createdAt).toISOString()}>{when(f.createdAt)}</time>
              {f.mine && <button onClick={() => remove(f._id)} className='ml-auto inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-600' aria-label='Delete your comment'><LuTrash2 className='size-3.5' />Delete</button>}
            </div>
            <p className='mt-1.5 text-sm text-slate-600 whitespace-pre-wrap break-words'>{f.text}</p>
          </article>
        ))}
      </div>
      {data.page < data.pages && (
        <button onClick={() => load(data.page + 1)} className='mt-2 text-sm text-brand-700 hover:underline'>Show more comments</button>
      )}
    </section>
  )
}

export default LessonFeedback
