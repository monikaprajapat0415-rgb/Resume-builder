import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuPlus, LuPencil, LuTrash2, LuExternalLink } from 'react-icons/lu'

const AdminBlogList = () => {
  const { token } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [cat, setCat] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/api/admin/blogs', { headers: { Authorization: token } })
      setPosts(data.posts || [])
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not load posts.')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
    api.get('/api/admin/categories?type=blog', { headers: { Authorization: token } })
      .then(({ data }) => setCategories(data.categories || [])).catch(() => {})
  }, [])

  const nameOf = (slug) => categories.find((c) => c.slug === slug)?.name || '—'
  const shown = posts.filter((p) =>
    (!q || p.title.toLowerCase().includes(q.toLowerCase())) &&
    (status === 'all' || (status === 'published') === p.published) &&
    (!cat || p.category === cat))

  const remove = async (id, title) => {
    const confirmed = window.confirm(`Delete "${title}"? This can't be undone.`)
    if (!confirmed) return
    try {
      await api.delete(`/api/admin/blogs/${id}`, { headers: { Authorization: token } })
      setPosts((prev) => prev.filter((p) => p._id !== id))
      toast.success('Post deleted.')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not delete post.')
    }
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-semibold text-slate-800'>Blog Posts</h1>
        <button
          onClick={() => navigate('/admin/blogs/new')}
          className='inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'
        >
          <LuPlus className='size-4' /> New Post
        </button>
      </div>

      <div className='flex flex-wrap gap-2 mb-4'>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search titles…' className='px-3 py-2 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-300' />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className='px-3 py-2 border border-slate-200 rounded-md text-sm bg-white'>
          <option value='all'>All statuses</option><option value='published'>Published</option><option value='draft'>Drafts</option>
        </select>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className='px-3 py-2 border border-slate-200 rounded-md text-sm bg-white'>
          <option value=''>All categories</option>
          {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <p className='text-slate-400'>Loading…</p>
      ) : posts.length === 0 ? (
        <div className='rounded-lg border border-dashed border-slate-200 p-10 text-center text-slate-500 bg-white'>
          No posts yet. Create your first one.
        </div>
      ) : (
        <div className='bg-white rounded-xl border border-slate-200 overflow-hidden'>
          <table className='w-full text-sm'>
            <thead className='bg-slate-50 text-slate-500 text-left'>
              <tr>
                <th className='px-4 py-3 font-medium'>Title</th>
                <th className='px-4 py-3 font-medium'>Category</th>
                <th className='px-4 py-3 font-medium'>Status</th>
                <th className='px-4 py-3 font-medium'>Date</th>
                <th className='px-4 py-3 font-medium'>Views</th>
                <th className='px-4 py-3 font-medium text-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((post) => (
                <tr key={post._id} className='border-t border-slate-100'>
                  <td className='px-4 py-3 text-slate-800 max-w-sm truncate'>{post.title}</td>
                  <td className='px-4 py-3 text-slate-500 whitespace-nowrap'>{nameOf(post.category)}</td>
                  <td className='px-4 py-3'>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${post.published ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-700'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-slate-500 whitespace-nowrap'>{new Date(post.date).toLocaleDateString()}</td>
                  <td className='px-4 py-3 text-slate-500'>{post.views || 0}</td>
                  <td className='px-4 py-3 text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      {post.published && (
                        <a
                          href={`/blog/${post.slug}`}
                          target='_blank'
                          rel='noreferrer'
                          className='p-2 rounded-md hover:bg-slate-100 transition'
                          title='View live'
                        >
                          <LuExternalLink className='size-4 text-slate-500' />
                        </a>
                      )}
                      <button onClick={() => navigate(`/admin/blogs/${post._id}/edit`)} className='p-2 rounded-md hover:bg-slate-100 transition' title='Edit'>
                        <LuPencil className='size-4 text-slate-600' />
                      </button>
                      <button onClick={() => remove(post._id, post.title)} className='p-2 rounded-md hover:bg-slate-100 transition' title='Delete'>
                        <LuTrash2 className='size-4 text-red-500' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminBlogList
