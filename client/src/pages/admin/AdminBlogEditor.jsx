import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import BlockEditor from '../../components/admin/BlockEditor'

const todayStr = () => new Date().toISOString().slice(0, 10)

const AdminBlogEditor = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useSelector(state => state.auth)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [readTime, setReadTime] = useState('')
  const [date, setDate] = useState(todayStr)
  const [published, setPublished] = useState(true)
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [blocks, setBlocks] = useState([{ type: 'paragraph', text: '' }])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/api/admin/categories?type=blog', { headers: { Authorization: token } })
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    const load = async () => {
      try {
        const { data } = await api.get(`/api/admin/blogs/${id}`, { headers: { Authorization: token } })
        const post = data.post
        setTitle(post.title || '')
        setSlug(post.slug || '')
        setDescription(post.description || '')
        setKeywords(post.keywords || '')
        setExcerpt(post.excerpt || '')
        setReadTime(post.readTime || '')
        setDate(post.date ? new Date(post.date).toISOString().slice(0, 10) : todayStr())
        setPublished(post.published !== false)
        setCategory(post.category || '')
        setBlocks(post.content && post.content.length > 0 ? post.content : [{ type: 'paragraph', text: '' }])
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Could not load post.')
        navigate('/admin/blogs')
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const content = blocks
        .map((b) => (b.type === 'list'
          ? { type: 'list', items: (b.items || []).map((s) => s.trim()).filter(Boolean) }
          : { type: b.type, text: (b.text || '').trim() }))
        .filter((b) => (b.type === 'list' ? b.items.length > 0 : b.text.length > 0))

      const payload = { title, slug, description, keywords, excerpt, readTime, date, published, category, content }

      if (isEdit) {
        await api.put(`/api/admin/blogs/${id}`, payload, { headers: { Authorization: token } })
        toast.success('Post updated.')
      } else {
        await api.post('/api/admin/blogs', payload, { headers: { Authorization: token } })
        toast.success('Post created.')
      }
      navigate('/admin/blogs')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not save post.')
    }
    setSaving(false)
  }

  if (loading) return <p className='text-slate-400'>Loading…</p>

  const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-300 focus:border-green-400'

  return (
    <div>
      <h1 className='text-2xl font-semibold text-slate-800 mb-6'>{isEdit ? 'Edit Post' : 'New Post'}</h1>

      <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl'>
        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>
              URL slug <span className='text-slate-400 font-normal'>(leave blank to auto-generate from the title)</span>
            </label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder='e.g. how-to-write-a-resume-summary' className={inputClass} />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Meta description <span className='text-slate-400 font-normal'>(shown in Google search results)</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass} />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>Excerpt <span className='text-slate-400 font-normal'>(shown on the blog listing page)</span></label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={inputClass} />
          </div>
          <div className='grid sm:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Keywords</label>
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder='comma, separated, keywords' className={inputClass} />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Read time</label>
              <input value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder='6 min read' className={inputClass} />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Published date</label>
              <input type='date' value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>
              Category <span className='text-slate-400 font-normal'>(<Link to='/admin/categories' className='text-green-600 hover:underline'>manage categories</Link>)</span>
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              <option value=''>Uncategorised</option>
              {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <label className='flex items-center gap-2 text-sm text-slate-700'>
            <input type='checkbox' checked={published} onChange={(e) => setPublished(e.target.checked)} className='rounded border-slate-300' />
            Published <span className='text-slate-400'>(unpublished posts are saved as drafts and won't appear on the public blog)</span>
          </label>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5'>
          <BlockEditor blocks={blocks} setBlocks={setBlocks} />
        </div>

        <div className='flex items-center gap-3'>
          <button type='submit' disabled={saving} className='px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition disabled:opacity-60'>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create post'}
          </button>
          <button type='button' onClick={() => navigate('/admin/blogs')} className='px-5 py-2.5 border border-slate-200 rounded-full text-sm hover:bg-slate-50 transition'>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminBlogEditor
