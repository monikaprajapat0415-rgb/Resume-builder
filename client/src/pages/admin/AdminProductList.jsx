import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { formatPrice } from '../../utils/inlineText'
import { LuPlus, LuPencil, LuTrash2, LuExternalLink, LuStar } from 'react-icons/lu'

const AdminProductList = () => {
  const { token } = useSelector(state => state.auth)
  const headers = { headers: { Authorization: token } }
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  const load = () => api.get('/api/admin/products', headers)
    .then(({ data }) => setProducts(data.products || []))
    .catch((e) => toast.error(e.response?.data?.message || 'Could not load products.'))
    .finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const patch = async (p, change) => {
    try {
      await api.put(`/api/admin/products/${p._id}`, change, headers)
      setProducts((prev) => prev.map((x) => (x._id === p._id ? { ...x, ...change } : x)))
    } catch (e) { toast.error(e.response?.data?.message || 'Could not update.') }
  }

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This can't be undone.`)) return
    try {
      await api.delete(`/api/admin/products/${p._id}`, headers)
      setProducts((prev) => prev.filter((x) => x._id !== p._id))
      toast.success('Product deleted.')
    } catch (e) { toast.error(e.response?.data?.message || 'Could not delete.') }
  }

  const shown = products.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-semibold text-slate-800'>Products</h1>
        <button onClick={() => navigate('/admin/products/new')} className='inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>
          <LuPlus className='size-4' /> New Product
        </button>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search products…' className='mb-4 px-3 py-2 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-300' />

      {loading ? <p className='text-slate-400'>Loading…</p> : shown.length === 0 ? (
        <div className='rounded-lg border border-dashed border-slate-200 p-10 text-center text-slate-500 bg-white'>
          {products.length ? 'No products match your search.' : 'No products yet. Add your first one.'}
        </div>
      ) : (
        <div className='bg-white rounded-xl border border-slate-200 overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-slate-50 text-slate-500 text-left'>
              <tr>
                <th className='px-4 py-3 font-medium'>Product</th>
                <th className='px-4 py-3 font-medium'>Price</th>
                <th className='px-4 py-3 font-medium'>Status</th>
                <th className='px-4 py-3 font-medium'>Views / clicks</th>
                <th className='px-4 py-3 font-medium text-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p._id} className='border-t border-slate-100'>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3 max-w-xs'>
                      {p.images?.[0] ? <img src={p.images[0]} alt='' className='size-10 rounded object-cover shrink-0' /> : <div className='size-10 rounded bg-slate-100 shrink-0' />}
                      <span className='text-slate-800 truncate'>{p.title}</span>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-slate-600 whitespace-nowrap'>{p.price > 0 ? formatPrice(p.price, p.currency) : 'Free'}</td>
                  <td className='px-4 py-3'>
                    <button onClick={() => patch(p, { published: !p.published })} title='Click to toggle' className={`px-2 py-0.5 rounded-full text-xs ${p.published ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-700'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className='px-4 py-3 text-slate-500 whitespace-nowrap'>{p.views || 0} / {p.clicks || 0}</td>
                  <td className='px-4 py-3 text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <button onClick={() => patch(p, { featured: !p.featured })} className='p-2 rounded-md hover:bg-slate-100 transition' title={p.featured ? 'Unfeature' : 'Feature'}>
                        <LuStar className={`size-4 ${p.featured ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
                      </button>
                      {p.published && <a href={`/products/${p.slug}`} target='_blank' rel='noreferrer' className='p-2 rounded-md hover:bg-slate-100 transition' title='View live'><LuExternalLink className='size-4 text-slate-500' /></a>}
                      <button onClick={() => navigate(`/admin/products/${p._id}/edit`)} className='p-2 rounded-md hover:bg-slate-100 transition' title='Edit'><LuPencil className='size-4 text-slate-600' /></button>
                      <button onClick={() => remove(p)} className='p-2 rounded-md hover:bg-slate-100 transition' title='Delete'><LuTrash2 className='size-4 text-red-500' /></button>
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

export default AdminProductList
