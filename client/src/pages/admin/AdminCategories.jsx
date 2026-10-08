import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { LuPencil, LuTrash2, LuCheck, LuX } from 'react-icons/lu'

const input = 'px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-300 focus:border-green-400'

const AdminCategories = () => {
  const { token } = useSelector(state => state.auth)
  const headers = { headers: { Authorization: token } }
  const [type, setType] = useState('blog')
  const [all, setAll] = useState([])
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(null) // { id, name }

  const load = () => api.get('/api/admin/categories', headers).then(({ data }) => setAll(data.categories || [])).catch((e) => toast.error(e.response?.data?.message || 'Could not load categories.'))
  useEffect(() => { load() }, [])

  const list = all.filter((c) => c.type === type)

  const add = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    try {
      await api.post('/api/admin/categories', { name, type }, headers)
      setName('')
      load()
      toast.success('Category added.')
    } catch (err) { toast.error(err.response?.data?.message || 'Could not add category.') }
  }

  const saveEdit = async () => {
    try {
      await api.put(`/api/admin/categories/${editing.id}`, { name: editing.name }, headers)
      setEditing(null)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Could not rename.') }
  }

  const remove = async (c) => {
    const msg = c.count ? `Delete "${c.name}"? Its ${c.count} item(s) will become uncategorised.` : `Delete "${c.name}"?`
    if (!window.confirm(msg)) return
    try {
      await api.delete(`/api/admin/categories/${c._id}`, headers)
      load()
      toast.success('Category deleted.')
    } catch (err) { toast.error(err.response?.data?.message || 'Could not delete.') }
  }

  return (
    <div className='max-w-2xl'>
      <h1 className='text-2xl font-semibold text-slate-800 mb-6'>Categories</h1>

      <div className='inline-flex rounded-full border border-slate-200 bg-white p-1 mb-5'>
        {['blog', 'product'].map((t) => (
          <button key={t} onClick={() => { setType(t); setEditing(null) }} className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${type === t ? 'bg-green-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}>{t}</button>
        ))}
      </div>

      <form onSubmit={add} className='flex gap-2 mb-5'>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={`New ${type} category name`} className={`${input} flex-1`} />
        <button className='px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition'>Add</button>
      </form>

      <div className='bg-white rounded-xl border border-slate-200 divide-y divide-slate-100'>
        {list.length === 0 && <p className='p-6 text-sm text-slate-400 text-center'>No {type} categories yet.</p>}
        {list.map((c) => (
          <div key={c._id} className='flex items-center gap-3 px-4 py-3'>
            {editing?.id === c._id ? (
              <>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={`${input} flex-1`} autoFocus />
                <button onClick={saveEdit} className='p-2 rounded-md hover:bg-slate-100' title='Save'><LuCheck className='size-4 text-green-600' /></button>
                <button onClick={() => setEditing(null)} className='p-2 rounded-md hover:bg-slate-100' title='Cancel'><LuX className='size-4 text-slate-500' /></button>
              </>
            ) : (
              <>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm text-slate-800 truncate'>{c.name}</p>
                  <p className='text-xs text-slate-400'>/{c.slug} · {c.count} {c.count === 1 ? 'item' : 'items'}</p>
                </div>
                <button onClick={() => setEditing({ id: c._id, name: c.name })} className='p-2 rounded-md hover:bg-slate-100' title='Rename'><LuPencil className='size-4 text-slate-600' /></button>
                <button onClick={() => remove(c)} className='p-2 rounded-md hover:bg-slate-100' title='Delete'><LuTrash2 className='size-4 text-red-500' /></button>
              </>
            )}
          </div>
        ))}
      </div>
      <p className='text-xs text-slate-400 mt-3'>Renaming keeps the URL slug, so existing links keep working.</p>
    </div>
  )
}

export default AdminCategories
