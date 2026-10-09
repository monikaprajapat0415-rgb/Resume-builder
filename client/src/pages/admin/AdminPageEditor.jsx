import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import BlockEditor from '../../components/admin/BlockEditor'
import { LuArrowLeft } from 'react-icons/lu'

const input = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-300 focus:border-green-400'

const AdminPageEditor = () => {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { token } = useSelector(state => state.auth)
  const headers = { headers: { Authorization: token } }
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [system, setSystem] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', description: '', published: true })
  const [blocks, setBlocks] = useState([{ type: 'paragraph', text: '' }])

  const apply = (p) => {
    setSystem(Boolean(p.system))
    setForm({ title: p.title, slug: p.slug, description: p.description || '', published: p.published })
    setBlocks(p.content?.length ? p.content : [{ type: 'paragraph', text: '' }])
  }

  useEffect(() => {
    if (isNew) return
    api.get(`/api/admin/pages/${id}`, headers)
      .then(({ data }) => apply(data.page))
      .catch((e) => { toast.error(e.response?.data?.message || 'Could not load the page.'); navigate('/admin/pages') })
      .finally(() => setLoading(false))
  }, [id])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const save = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Please enter a title.')
    setSaving(true)
    try {
      const body = { ...form, content: blocks }
      if (isNew) {
        const { data } = await api.post('/api/admin/pages', body, headers)
        toast.success('Page created.')
        navigate(`/admin/pages/${data.page._id}/edit`, { replace: true })
      } else {
        const { data } = await api.put(`/api/admin/pages/${id}`, body, headers)
        apply(data.page)
        toast.success('Page saved.')
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Could not save.') }
    finally { setSaving(false) }
  }

  const reset = async () => {
    if (!window.confirm('Replace this page with the original text? Your edits will be lost.')) return
    try {
      const { data } = await api.post(`/api/admin/pages/${id}/reset`, {}, headers)
      apply(data.page); toast.success('Page reset to the original text.')
    } catch (err) { toast.error(err.response?.data?.message || 'Could not reset.') }
  }

  if (loading) return <p className='text-slate-400'>Loading…</p>
  const publicUrl = system ? `/${form.slug}` : `/p/${form.slug}`

  return (
    <form onSubmit={save} className='max-w-3xl'>
      <Link to='/admin/pages' className='inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-3'><LuArrowLeft className='size-3.5' /> All pages</Link>
      <h1 className='text-2xl font-semibold text-slate-800 mb-6'>{isNew ? 'New page' : `Edit: ${form.title || 'page'}`}</h1>

      <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
        <label className='block'><span className='text-xs text-slate-500'>Title</span><input value={form.title} onChange={set('title')} className={input} /></label>
        {!system && (
          <label className='block'><span className='text-xs text-slate-500'>Page address</span>
            <div className='flex items-center'><span className='text-sm text-slate-400 mr-1'>/p/</span><input value={form.slug} onChange={set('slug')} placeholder='auto from title' className={input} /></div>
          </label>
        )}
        <label className='block'><span className='text-xs text-slate-500'>Search description (shown on Google)</span><textarea rows={2} value={form.description} onChange={set('description')} className={input} /></label>
        {!system && (
          <label className='inline-flex items-center gap-2 text-sm text-slate-700'>
            <input type='checkbox' checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published (visible to everyone)
          </label>
        )}
      </div>

      <h2 className='text-sm font-semibold text-slate-800 mt-6 mb-2'>Content</h2>
      <BlockEditor blocks={blocks} setBlocks={setBlocks} />

      <div className='flex flex-wrap items-center gap-3 mt-6'>
        <button disabled={saving} className='px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-full text-sm font-medium transition'>{saving ? 'Saving…' : 'Save page'}</button>
        {!isNew && form.published && <a href={publicUrl} target='_blank' rel='noreferrer' className='text-sm text-green-700 hover:underline'>View live page</a>}
        {system && <button type='button' onClick={reset} className='ml-auto text-sm text-slate-500 hover:text-red-600'>Reset to original text</button>}
      </div>
      {system && <p className='text-xs text-slate-400 mt-3'>This is a built-in page: its address stays the same and it can't be unpublished or deleted. “Last updated” on the page changes each time you save.</p>}
    </form>
  )
}

export default AdminPageEditor
