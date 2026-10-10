import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { formatPrice } from '../utils/inlineText'

export const StockBadge = ({ status }) => {
  if (status === 'in_stock') return null
  const label = status === 'coming_soon' ? 'Coming soon' : 'Sold out'
  return <span className='absolute top-3 left-3 text-xs font-medium bg-slate-800/85 text-white px-2.5 py-1 rounded-full'>{label}</span>
}

const ProductsIndex = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useSearchParams()
  const active = params.get('category') || ''

  useEffect(() => {
    api.get('/api/products/categories').then(({ data }) => setCategories(data.categories || [])).catch(() => {})
  }, [])

  useEffect(() => {
    let live = true
    setLoading(true)
    api.get('/api/products', { params: active ? { category: active } : {} })
      .then(({ data }) => { if (live) setProducts(data.products || []) })
      .catch(() => {})
      .finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [active])

  return (
    <div>
      <SEO
        title="Products"
        description="Resume templates, career toolkits and tools from Prime Resume AI."
        keywords="resume templates, career toolkit, interview prep, resume products"
        path="/products"
      />
      <NavBar />
      <section className='max-w-6xl mx-auto px-4 py-16'>
        <div className='text-center max-w-2xl mx-auto mb-12'>
          <h1 className='text-4xl font-semibold text-slate-800'>Products</h1>
          <p className='text-slate-500 mt-3'>Tools and resources to help you land the job.</p>
        </div>

        {categories.length > 0 && (
          <div className='flex flex-wrap justify-center gap-2 mb-10'>
            {[{ slug: '', name: 'All' }, ...categories].map((c) => (
              <button
                key={c.slug || 'all'}
                onClick={() => (c.slug ? setParams({ category: c.slug }) : setParams({}))}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${active === c.slug ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className='text-center text-slate-400'>Loading products…</p>
        ) : products.length === 0 ? (
          <p className='text-center text-slate-400'>No products here yet. Check back soon.</p>
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products.map((p) => (
              <Link key={p.slug} to={`/products/${p.slug}`} className='group rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-md hover:border-brand-200 transition'>
                <div className='relative aspect-[4/3] bg-slate-50'>
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.title} loading='lazy' className='w-full h-full object-cover' />
                    : <div className='w-full h-full flex items-center justify-center text-slate-300 text-sm'>No image</div>}
                  <StockBadge status={p.stockStatus} />
                  {p.featured && <span className='absolute top-3 right-3 text-xs font-medium bg-brand-600 text-white px-2.5 py-1 rounded-full'>Featured</span>}
                </div>
                <div className='p-5'>
                  <h2 className='font-semibold text-slate-800 group-hover:text-brand-600 transition'>{p.title}</h2>
                  {p.tagline && <p className='text-sm text-slate-500 mt-1 line-clamp-2'>{p.tagline}</p>}
                  <div className='mt-3 flex items-baseline gap-2'>
                    <span className='text-lg font-semibold text-slate-800'>{p.price > 0 ? formatPrice(p.price, p.currency) : 'Free'}</span>
                    {p.compareAtPrice > p.price && <span className='text-sm text-slate-400 line-through'>{formatPrice(p.compareAtPrice, p.currency)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}

export default ProductsIndex
