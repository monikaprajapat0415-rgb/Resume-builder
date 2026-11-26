import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { clearVideoCache } from '../../components/PageVideos'
import PublishSwitch from '../../components/admin/PublishSwitch'

const input = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300 focus:border-brand-400'
const today = () => new Date().toISOString().slice(0, 10)
const EMPTY = { path: '', youtubeId: '', title: '', description: '', uploadDate: today(), durationSec: 0, visible: false, order: 0 }

const Field = ({ label, hint, children }) => (
  <label className='block'>
    <span className='block text-xs font-medium text-slate-600 mb-1'>{label}</span>
    {children}
    {hint && <span className='block text-xs text-slate-400 mt-1'>{hint}</span>}
  </label>
)

const AdminVideos = () => {
  const { token } = useSelector((s) => s.auth)
  const headers = { headers: { Authorization: token } }
  const [items, setItems] = useState(null)
  const [form, setForm] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = () => api.get('/api/admin/videos', headers)
    .then(({ data }) => setItems(data.items))
    .catch((e) => { setItems([]); toast.error(e.response?.data?.message || 'Could not load.') })
  useEffect(() => { load() }, [])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      if (form._id) await api.put(`/api/admin/videos/${form._id}`, form, headers)
      else await api.post('/api/admin/videos', form, headers)
      clearVideoCache(); toast.success('Saved.'); setForm(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Could not save.') }
    finally { setBusy(false) }
  }

  const toggle = async (it) => {
    try { await api.put(`/api/admin/videos/${it._id}`, { visible: !it.visible }, headers); clearVideoCache(); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Could not change this.') }
  }

  const remove = async (it) => {
    if (!window.confirm(`Delete "${it.title}"? This cannot be undone.`)) return
    try { await api.delete(`/api/admin/videos/${it._id}`, headers); clearVideoCache(); load() }
    catch (err) { toast.error(err.response?.data?.message || 'Could not delete.') }
  }

  return (
    <div className='max-w-4xl'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h1 className='text-xl font-semibold text-slate-800'>Videos on pages</h1>
          <p className='text-sm text-slate-500 mt-1'>Show a YouTube video near the bottom of any public page. It loads only when a visitor presses play, and search engines get proper video details. Up to 3 per page.</p>
        </div>
        {!form && <button type='button' onClick={() => setForm({ ...EMPTY })} className='rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm px-4 py-2'>Add a video</button>}
      </div>

      {form && (
        <form onSubmit={save} className='mt-4 rounded-xl border border-slate-200 bg-white p-5 grid gap-4 sm:grid-cols-2'>
          <Field label='Page address' hint='For example /cv-builder or /learn/angular. Use / for the home page.'>
            <input className={input} value={form.path} onChange={(e) => set({ path: e.target.value })} required placeholder='/cv-builder' maxLength={200} />
          </Field>
          <Field label='YouTube link' hint='The video must be Public or Unlisted, not Private.'>
            <input className={input} value={form.youtubeId} onChange={(e) => set({ youtubeId: e.target.value })} required placeholder='https://youtu.be/xxxxxxxxxxx' />
          </Field>
          <div className='sm:col-span-2'>
            <Field label='Title' hint={`${form.title.length}/100. Say what the video shows.`}>
              <input className={input} value={form.title} onChange={(e) => set({ title: e.target.value })} required maxLength={100} />
            </Field>
          </div>
          <div className='sm:col-span-2'>
            <Field label='Description' hint={`${form.description.length}/300. Plain words, no promises about jobs or results.`}>
              <textarea className={input} rows={3} maxLength={300} value={form.description} onChange={(e) => set({ description: e.target.value })} required />
            </Field>
          </div>
          <Field label='Upload date'><input type='date' className={input} value={String(form.uploadDate).slice(0, 10)} max={today()} onChange={(e) => set({ uploadDate: e.target.value })} required /></Field>
          <Field label='Length in seconds (optional)' hint='For example 340 for 5:40.'><input type='number' min={0} max={86400} className={input} value={form.durationSec} onChange={(e) => set({ durationSec: Number(e.target.value) })} /></Field>
          <Field label='Order' hint='Smaller numbers come first.'><input type='number' className={input} value={form.order} onChange={(e) => set({ order: Number(e.target.value) })} /></Field>
          <label className='flex items-center gap-2 text-sm self-end pb-2'><input type='checkbox' checked={form.visible} onChange={(e) => set({ visible: e.target.checked })} />Show on the page</label>
          <div className='sm:col-span-2 flex gap-3'>
            <button disabled={busy} className='rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm px-5 py-2'>{busy ? 'Saving...' : 'Save'}</button>
            <button type='button' onClick={() => setForm(null)} className='rounded-lg border border-slate-200 text-sm px-5 py-2 hover:bg-slate-50'>Cancel</button>
          </div>
        </form>
      )}

      <ul className='mt-4 space-y-3'>
        {(items || []).map((it) => (
          <li key={it._id} className='rounded-xl border border-slate-200 bg-white p-4 flex flex-wrap items-start justify-between gap-3'>
            <div className='min-w-0 flex gap-3'>
              <img src={`https://i.ytimg.com/vi/${it.youtubeId}/default.jpg`} alt='' className='w-24 h-[68px] rounded object-cover bg-slate-100 shrink-0' loading='lazy' />
              <div className='min-w-0'>
                <p className='font-medium text-slate-800'>{it.title}</p>
                <p className='text-xs text-slate-500 mt-1'>Page: <code>{it.path}</code> · <a className='underline' href={`https://youtu.be/${it.youtubeId}`} target='_blank' rel='noreferrer'>youtu.be/{it.youtubeId}</a></p>
              </div>
            </div>
            <div className='flex flex-wrap items-center gap-2 text-xs'>
              <PublishSwitch on={it.visible} labelOn='Shown' labelOff='Hidden' name={it.title} onChange={() => toggle(it)} />
              <button type='button' onClick={() => setForm({ ...it, youtubeId: it.youtubeId, uploadDate: String(it.uploadDate).slice(0, 10) })} className='px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50'>Edit</button>
              <button type='button' onClick={() => remove(it)} className='px-3 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50'>Delete</button>
            </div>
          </li>
        ))}
        {items && !items.length && <li className='text-sm text-slate-500'>No videos yet. Add one once it is public or unlisted on YouTube.</li>}
      </ul>
    </div>
  )
}

export default AdminVideos
