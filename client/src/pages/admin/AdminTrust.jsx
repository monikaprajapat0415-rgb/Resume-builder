import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { invalidateHomeTrust } from '../../utils/homeTrust'

const input = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300 focus:border-brand-400'
const EMPTY_REVIEW = { name: '', role: '', company: '', location: '', quote: '', rating: 5, reviewerType: 'job seeker', logoUrl: '', permission: false, proof: '', published: false, order: 0 }
const EMPTY_CLIENT = { name: '', logoUrl: '', url: '', published: false, order: 0 }

const Field = ({ label, hint, children }) => (
  <label className='block'>
    <span className='block text-xs font-medium text-slate-600 mb-1'>{label}</span>
    {children}
    {hint && <span className='block text-xs text-slate-400 mt-1'>{hint}</span>}
  </label>
)

const AdminTrust = () => {
  const { token } = useSelector((s) => s.auth)
  const headers = { headers: { Authorization: token } }
  const [kind, setKind] = useState('review')
  const [items, setItems] = useState(null)
  const [form, setForm] = useState(null)   // null = closed, otherwise the item being edited (id present) or created
  const [busy, setBusy] = useState(false)

  const load = (k = kind) => api.get(`/api/admin/trust?kind=${k}`, headers)
    .then(({ data }) => setItems(data.items))
    .catch((e) => { setItems([]); toast.error(e.response?.data?.message || 'Could not load.') })

  useEffect(() => { setItems(null); setForm(null); load(kind) }, [kind])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const body = { ...form, kind }
      if (form._id) await api.put(`/api/admin/trust/${form._id}`, body, headers)
      else await api.post('/api/admin/trust', body, headers)
      invalidateHomeTrust(); toast.success('Saved.'); setForm(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Could not save.') }
    finally { setBusy(false) }
  }

  const togglePublish = async (it) => {
    try {
      await api.put(`/api/admin/trust/${it._id}`, { published: !it.published }, headers)
      invalidateHomeTrust(); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Could not change this.') }
  }

  const remove = async (it) => {
    if (!window.confirm(`Delete "${it.name}"? This cannot be undone.`)) return
    try { await api.delete(`/api/admin/trust/${it._id}`, headers); invalidateHomeTrust(); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Could not delete.') }
  }

  const upload = async (e) => {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file) return
    const fd = new FormData(); fd.append('image', file)
    try {
      const { data } = await api.post('/api/admin/upload', fd, headers)
      set({ logoUrl: data.url }); toast.success('Image uploaded.')
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed.') }
  }

  const live = (items || []).filter((i) => i.published).length

  return (
    <div className='max-w-4xl'>
      <h1 className='text-xl font-semibold text-slate-800'>Trust section</h1>
      <p className='text-sm text-slate-500 mt-1'>
        Real customer reviews and "trusted by" clients on the home page. Each part stays hidden until at least one item is published.
        Add only feedback and clients you have <strong>permission</strong> to show. Do not invent reviews or use a company logo without agreement.
      </p>

      <div className='mt-5 inline-flex rounded-lg border border-slate-200 bg-white p-1 text-sm' role='tablist'>
        {[['review', 'Reviews'], ['client', 'Clients']].map(([k, l]) => (
          <button key={k} type='button' role='tab' aria-selected={kind === k} onClick={() => setKind(k)}
            className={`px-4 py-1.5 rounded-md ${kind === k ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{l}</button>
        ))}
      </div>

      <div className='mt-4 flex items-center justify-between'>
        <p className='text-sm text-slate-500'>{items ? `${items.length} saved, ${live} shown on the home page` : 'Loading...'}</p>
        {!form && <button type='button' onClick={() => setForm(kind === 'review' ? { ...EMPTY_REVIEW } : { ...EMPTY_CLIENT })} className='rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm px-4 py-2'>Add {kind === 'review' ? 'a review' : 'a client'}</button>}
      </div>

      {form && (
        <form onSubmit={save} className='mt-4 rounded-xl border border-slate-200 bg-white p-5 grid gap-4 sm:grid-cols-2'>
          <Field label={kind === 'review' ? 'Name' : 'Company name'}><input className={input} value={form.name} onChange={(e) => set({ name: e.target.value })} required maxLength={80} /></Field>
          {kind === 'review' ? (
            <>
              <Field label='Job title'><input className={input} value={form.role} onChange={(e) => set({ role: e.target.value })} maxLength={80} /></Field>
              <Field label='Company (optional)'><input className={input} value={form.company} onChange={(e) => set({ company: e.target.value })} maxLength={80} /></Field>
              <Field label='Location (optional)'><input className={input} value={form.location} onChange={(e) => set({ location: e.target.value })} maxLength={60} /></Field>
              <Field label='Who wrote it'>
                <select className={input} value={form.reviewerType} onChange={(e) => set({ reviewerType: e.target.value })}>
                  <option value='job seeker'>Job seeker</option><option value='employer'>Employer</option><option value='client'>Client</option>
                </select>
              </Field>
              <Field label='Stars' hint='0 hides the stars.'>
                <select className={input} value={form.rating} onChange={(e) => set({ rating: Number(e.target.value) })}>{[5, 4, 3, 2, 1, 0].map((n) => <option key={n} value={n}>{n}</option>)}</select>
              </Field>
              <div className='sm:col-span-2'>
                <Field label='Review text' hint={`${form.quote.length}/500. Use their own words. Do not edit the meaning.`}>
                  <textarea className={input} rows={4} maxLength={500} value={form.quote} onChange={(e) => set({ quote: e.target.value })} required />
                </Field>
              </div>
            </>
          ) : (
            <Field label='Website (optional)'><input className={input} type='url' placeholder='https://' value={form.url} onChange={(e) => set({ url: e.target.value })} /></Field>
          )}
          <div className='sm:col-span-2'>
            <Field label={kind === 'review' ? 'Photo (optional)' : 'Logo (optional, the name shows if empty)'}>
              <div className='flex flex-wrap items-center gap-3'>
                {form.logoUrl && <img src={form.logoUrl} alt='' className='h-10 w-auto max-w-[8rem] rounded border border-slate-200 object-contain bg-white' />}
                <label className='text-xs px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer'>Upload an image<input type='file' accept='image/*' className='hidden' onChange={upload} /></label>
                <input className={`${input} flex-1 min-w-[14rem]`} placeholder='or paste an image address (https://...)' value={form.logoUrl} onChange={(e) => set({ logoUrl: e.target.value })} />
                {form.logoUrl && <button type='button' onClick={() => set({ logoUrl: '' })} className='text-xs text-slate-500 hover:text-slate-800'>Remove</button>}
              </div>
            </Field>
          </div>
          {kind === 'review' && (
            <div className='sm:col-span-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 space-y-3'>
              <label className='flex items-start gap-2'><input type='checkbox' className='mt-1' checked={form.permission} onChange={(e) => set({ permission: e.target.checked })} />
                <span><strong>I have permission to show this review publicly</strong> with this name. A review cannot be published without it.</span></label>
              <Field label='Private note: where did it come from? (never shown)'><input className={input} value={form.proof} maxLength={300} onChange={(e) => set({ proof: e.target.value })} placeholder='e.g. email from the customer on 12 Nov, saved in the support inbox' /></Field>
            </div>
          )}
          <Field label='Order' hint='Smaller numbers come first.'><input type='number' className={input} value={form.order} onChange={(e) => set({ order: Number(e.target.value) })} /></Field>
          <label className='flex items-center gap-2 text-sm self-end pb-2'><input type='checkbox' checked={form.published} onChange={(e) => set({ published: e.target.checked })} />Show on the home page</label>
          <div className='sm:col-span-2 flex gap-3'>
            <button disabled={busy} className='rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm px-5 py-2'>{busy ? 'Saving...' : 'Save'}</button>
            <button type='button' onClick={() => setForm(null)} className='rounded-lg border border-slate-200 text-sm px-5 py-2 hover:bg-slate-50'>Cancel</button>
          </div>
        </form>
      )}

      <ul className='mt-4 space-y-3'>
        {(items || []).map((it) => (
          <li key={it._id} className='rounded-xl border border-slate-200 bg-white p-4 flex flex-wrap items-start justify-between gap-3'>
            <div className='min-w-0'>
              <p className='font-medium text-slate-800'>{it.name} <span className={`ml-2 text-xs rounded-full px-2 py-0.5 ${it.published ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{it.published ? 'Shown' : 'Hidden'}</span>{it.source === 'user' && <span className='ml-2 text-xs rounded-full px-2 py-0.5 bg-amber-50 text-amber-800'>From a user{it.permission ? '' : ' (no permission to show)'}</span>}</p>
              {it.kind === 'review' && <p className='text-sm text-slate-500 mt-1 line-clamp-2'>“{it.quote}”</p>}
              {it.kind === 'review' && <p className='text-xs text-slate-400 mt-1'>{[it.role, it.company, it.location].filter(Boolean).join(' · ')}{it.permission ? '' : ' · permission not confirmed'}</p>}
              {it.kind === 'client' && it.url && <p className='text-xs text-slate-400 mt-1 truncate'>{it.url}</p>}
            </div>
            <div className='flex gap-2 text-xs'>
              <button type='button' onClick={() => togglePublish(it)} className='px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50'>{it.published ? 'Hide' : 'Show'}</button>
              <button type='button' onClick={() => setForm({ ...it })} className='px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50'>Edit</button>
              <button type='button' onClick={() => remove(it)} className='px-3 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50'>Delete</button>
            </div>
          </li>
        ))}
        {items && !items.length && <li className='text-sm text-slate-500'>Nothing here yet. Add the first {kind === 'review' ? 'review' : 'client'} when you have a real one.</li>}
      </ul>
    </div>
  )
}

export default AdminTrust
