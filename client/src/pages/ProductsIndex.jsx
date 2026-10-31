import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { useToolSettings } from '../utils/toolSettings'
import { formatPrice } from '../utils/inlineText'
import { LuSearch } from 'react-icons/lu'
import { GROUPS, visibleTools } from '../content/toolsHub'
import { ToolCard } from './tools/parts'

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
  const tools = useToolSettings()
  const [q, setQ] = useState('')
  const [grp, setGrp] = useState('')
  const shown = visibleTools(tools).filter((t) => (!grp || t.group === grp) && (!q.trim() || `${t.name} ${t.tagline}`.toLowerCase().includes(q.trim().toLowerCase())))

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
        title="Free Career Tools and Products"
        description="Free tools for your job search: resume builder, ATS checker, cover letters, interview practice, offer comparison and image tools."
        keywords="free resume tools, ATS checker, cover letter generator, mock interview, job offer comparison"
        path="/products"
      />
      <NavBar />
      <header className='bg-gradient-to-b from-brand-50 to-white border-b border-slate-100'>
        <div className='max-w-page xl:px-10 mx-auto px-4 pt-12 pb-10 text-center'>
          <p className='text-sm font-medium text-brand-700'>Free to use</p>
          <h1 className='text-3xl sm:text-5xl font-bold text-slate-800 mt-2'>Tools for your job search</h1>
          <p className='text-slate-600 mt-4 max-w-2xl mx-auto'>Build a resume, check it, write the cover letter, practise the interview and compare offers. Pick a tool and start. Nothing here promises a job, and the AI tools only use the facts you give them.</p>
          <div className='relative max-w-xl mx-auto mt-7'>
            <LuSearch className='absolute start-4 top-1/2 -translate-y-1/2 size-4 text-slate-400' aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label='Search the tools' placeholder='Search tools, for example "cover letter"' className='w-full rounded-full border border-slate-300 bg-white ps-11 pe-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-300' />
          </div>
          <div className='flex flex-wrap justify-center gap-2 mt-5' role='group' aria-label='Tool categories'>
            {[{ id: '', title: 'All tools' }, ...GROUPS].map((g) => (
              <button key={g.id || 'all'} type='button' aria-pressed={grp === g.id} onClick={() => setGrp(g.id)} className={`px-4 py-1.5 rounded-full text-sm border transition ${grp === g.id ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700'}`}>{g.title}</button>
            ))}
          </div>
        </div>
      </header>

      <section className='max-w-page xl:px-10 mx-auto px-4 py-12'>
        {shown.length === 0 && <p className='text-center text-slate-500'>No tool matches that search. Try another word.</p>}
        {(q.trim() || grp) ? (
          <ul className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>{shown.map((t) => <li key={t.id}><ToolCard tool={t} /></li>)}</ul>
        ) : GROUPS.map((g) => {
          const list = shown.filter((t) => t.group === g.id)
          if (!list.length) return null
          return (
            <div key={g.id} className='mb-12' aria-labelledby={`g-${g.id}`}>
              <div className='flex items-baseline gap-3 mb-4'>
                <h2 id={`g-${g.id}`} className='text-xl font-semibold text-slate-800'>{g.title}</h2>
                <p className='text-sm text-slate-500'>{g.blurb}</p>
              </div>
              <ul className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>{list.map((t) => <li key={t.id}><ToolCard tool={t} /></li>)}</ul>
            </div>
          )
        })}

        {(products.length > 0 || categories.length > 0 || active) && (
          <div className='border-t border-slate-200 pt-12 mt-4'>
            <h2 className='text-xl font-semibold text-slate-800'>Templates, toolkits and downloads</h2>
            <p className='text-sm text-slate-500 mt-1 mb-6'>Extra resources from the shop.</p>
            {categories.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-8'>
                {[{ slug: '', name: 'All' }, ...categories].map((c) => (
                  <button key={c.slug || 'all'} onClick={() => (c.slug ? setParams({ category: c.slug }) : setParams({}))}
                    className={`px-4 py-1.5 rounded-full text-sm border transition ${active === c.slug ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700'}`}>{c.name}</button>
                ))}
              </div>
            )}
        {loading ? (
          <p className='text-center text-slate-400'>Loading products…</p>
        ) : products.length === 0 ? (
          // The tool cards above are not shop products, so the empty message shows only inside a category.
          active && <p className='text-center text-slate-400'>No products here yet. Check back soon.</p>
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
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
                  <h3 className='font-semibold text-slate-800 group-hover:text-brand-600 transition'>{p.title}</h3>
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
        </div>
        )}
      </section>
      <Footer />
    </div>
  )
}

export default ProductsIndex
