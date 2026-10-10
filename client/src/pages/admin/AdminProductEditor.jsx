import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import BlockEditor from '../../components/admin/BlockEditor'
import ImageUploader from '../../components/admin/ImageUploader'

const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300 focus:border-brand-400'
const Field = ({ label, hint, children }) => (
  <div>
    <label className='block text-sm font-medium text-slate-700 mb-1'>{label} {hint && <span className='text-slate-400 font-normal'>{hint}</span>}</label>
    {children}
  </div>
)

const blank = {
  title: '', slug: '', tagline: '', description: '', keywords: '', category: '',
  price: 0, compareAtPrice: 0, currency: 'INR', buyUrl: '', buttonLabel: 'Buy now',
  stockStatus: 'in_stock', featured: false, published: false,
}

const AdminProductEditor = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useSelector(state => state.auth)
  const headers = { headers: { Authorization: token } }

  const [form, setForm] = useState(blank)
  const [features, setFeatures] = useState('')
  const [images, setImages] = useState([])
  const [blocks, setBlocks] = useState([{ type: 'paragraph', text: '' }])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  useEffect(() => {
    api.get('/api/admin/categories?type=product', headers).then(({ data }) => setCategories(data.categories || [])).catch(() => {})
    if (!isEdit) return
    api.get(`/api/admin/products/${id}`, headers)
      .then(({ data }) => {
        const p = data.product
        setForm({ ...blank, ...Object.fromEntries(Object.keys(blank).map((k) => [k, p[k] ?? blank[k]])) })
        setFeatures((p.features || []).join('\n'))
        setImages(p.images || [])
        setBlocks(p.content?.length ? p.content : [{ type: 'paragraph', text: '' }])
      })
      .catch((e) => { toast.error(e.response?.data?.message || 'Could not load product.'); navigate('/admin/products') })
      .finally(() => setLoading(false))
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const content = blocks
        .map((b) => (b.type === 'list'
          ? { type: 'list', items: (b.items || []).map((s) => s.trim()).filter(Boolean) }
          : { type: b.type, text: (b.text || '').trim() }))
        .filter((b) => (b.type === 'list' ? b.items.length > 0 : b.text.length > 0))
      const payload = {
        ...form, price: Number(form.price) || 0, compareAtPrice: Number(form.compareAtPrice) || 0,
        features: features.split('\n').map((s) => s.trim()).filter(Boolean), images, content,
      }
      if (isEdit) await api.put(`/api/admin/products/${id}`, payload, headers)
      else await api.post('/api/admin/products', payload, headers)
      toast.success(isEdit ? 'Product updated.' : 'Product created.')
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Could not save product.')
    }
    setSaving(false)
  }

  if (loading) return <p className='text-slate-400'>Loading…</p>

  return (
    <div>
      <h1 className='text-2xl font-semibold text-slate-800 mb-6'>{isEdit ? 'Edit Product' : 'New Product'}</h1>
      <form onSubmit={submit} className='space-y-6 max-w-3xl'>
        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <Field label='Name'><input value={form.title} onChange={set('title')} required className={inputClass} /></Field>
          <Field label='Tagline' hint='(one line under the name)'><input value={form.tagline} onChange={set('tagline')} className={inputClass} /></Field>
          <Field label='URL slug' hint='(blank = auto from name)'><input value={form.slug} onChange={set('slug')} placeholder='e.g. ats-resume-toolkit' className={inputClass} /></Field>
          <Field label='Meta description' hint='(shown in Google results)'><textarea value={form.description} onChange={set('description')} rows={2} className={inputClass} /></Field>
          <div className='grid sm:grid-cols-2 gap-4'>
            <Field label='Keywords'><input value={form.keywords} onChange={set('keywords')} placeholder='comma, separated' className={inputClass} /></Field>
            <Field label='Category' hint={<>(<Link to='/admin/categories' className='text-brand-600 hover:underline'>manage</Link>)</>}>
              <select value={form.category} onChange={set('category')} className={inputClass}>
                <option value=''>Uncategorised</option>
                {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <h2 className='text-sm font-semibold text-slate-800'>Pricing &amp; purchase</h2>
          <div className='grid sm:grid-cols-3 gap-4'>
            <Field label='Price' hint='(0 = free)'><input type='number' min='0' step='any' value={form.price} onChange={set('price')} className={inputClass} /></Field>
            <Field label='Original price' hint='(optional, shown struck-through)'><input type='number' min='0' step='any' value={form.compareAtPrice} onChange={set('compareAtPrice')} className={inputClass} /></Field>
            <Field label='Currency'>
              <select value={form.currency} onChange={set('currency')} className={inputClass}>
                {['INR', 'USD', 'EUR', 'GBP', 'AED'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label='Buy link' hint='(Razorpay / Stripe payment link, Gumroad, WhatsApp, mailto:… — leave blank to show “Contact us to buy”)'>
            <input value={form.buyUrl} onChange={set('buyUrl')} placeholder='https://…' className={inputClass} />
          </Field>
          <div className='grid sm:grid-cols-2 gap-4'>
            <Field label='Button text'><input value={form.buttonLabel} onChange={set('buttonLabel')} className={inputClass} /></Field>
            <Field label='Availability'>
              <select value={form.stockStatus} onChange={set('stockStatus')} className={inputClass}>
                <option value='in_stock'>In stock</option><option value='out_of_stock'>Sold out</option><option value='coming_soon'>Coming soon</option>
              </select>
            </Field>
          </div>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
          <h2 className='text-sm font-semibold text-slate-800'>Images</h2>
          <ImageUploader images={images} setImages={setImages} />
          <Field label='Highlights' hint='(one per line, shown with ticks)'>
            <textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={4} className={inputClass} />
          </Field>
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5'>
          <BlockEditor blocks={blocks} setBlocks={setBlocks} />
        </div>

        <div className='bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap gap-6'>
          <label className='flex items-center gap-2 text-sm text-slate-700'><input type='checkbox' checked={form.published} onChange={set('published')} /> Published <span className='text-slate-400'>(unticked = draft, hidden from the store)</span></label>
          <label className='flex items-center gap-2 text-sm text-slate-700'><input type='checkbox' checked={form.featured} onChange={set('featured')} /> Featured <span className='text-slate-400'>(shown first)</span></label>
        </div>

        <div className='flex items-center gap-3'>
          <button type='submit' disabled={saving} className='px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition disabled:opacity-60'>{saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}</button>
          <button type='button' onClick={() => navigate('/admin/products')} className='px-5 py-2.5 border border-slate-200 rounded-full text-sm hover:bg-slate-50 transition'>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductEditor
