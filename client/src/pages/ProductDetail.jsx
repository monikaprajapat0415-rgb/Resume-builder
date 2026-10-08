import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import BlockRenderer from '../components/BlockRenderer'
import api from '../configs/api'
import { formatPrice } from '../utils/inlineText'
import { LuArrowLeft, LuCheck } from 'react-icons/lu'

const AVAILABILITY = {
  in_stock: 'https://schema.org/InStock',
  out_of_stock: 'https://schema.org/OutOfStock',
  coming_soon: 'https://schema.org/PreOrder',
}

const ProductDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let live = true
    setLoading(true)
    setProduct(null)
    setImage(0)
    api.get(`/api/products/${slug}`)
      .then(async ({ data }) => {
        if (!live) return
        setProduct(data.product)
        try {
          const { data: list } = await api.get('/api/products')
          if (live) setRelated((list.products || []).filter((p) => p.slug !== slug).slice(0, 3))
        } catch { /* related products are optional */ }
      })
      .catch(() => { if (live) navigate('/products', { replace: true }) })
      .finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [slug])

  if (loading || !product) {
    return (
      <div>
        <NavBar />
        <div className='min-h-[40vh] flex items-center justify-center text-slate-400'>{loading ? 'Loading…' : null}</div>
        <Footer />
      </div>
    )
  }

  const canBuy = product.stockStatus === 'in_stock'
  const discount = product.compareAtPrice > product.price && product.price > 0
    ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0

  const buy = () => {
    api.post(`/api/products/${product.slug}/click`).catch(() => {})
    if (/^https?:/i.test(product.buyUrl)) window.open(product.buyUrl, '_blank', 'noopener,noreferrer')
    else window.location.href = product.buyUrl
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.tagline,
    image: product.images,
    url: `https://primeresumeai.com/products/${product.slug}`,
    brand: { '@type': 'Brand', name: 'Prime Resume AI' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: AVAILABILITY[product.stockStatus],
      url: `https://primeresumeai.com/products/${product.slug}`,
    },
  }

  return (
    <div>
      <SEO
        title={product.title}
        description={product.description || product.tagline}
        keywords={product.keywords}
        path={`/products/${product.slug}`}
        image={product.images?.[0]}
        structuredData={structuredData}
      />
      <NavBar />
      <article className='max-w-5xl mx-auto px-4 py-12'>
        <Link to='/products' className='inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition mb-8'>
          <LuArrowLeft className='size-4' /> All products
        </Link>

        <div className='grid md:grid-cols-2 gap-10'>
          <div>
            <div className='aspect-[4/3] rounded-xl border border-slate-200 bg-slate-50 overflow-hidden'>
              {product.images?.[image]
                ? <img src={product.images[image]} alt={product.title} className='w-full h-full object-contain' />
                : <div className='w-full h-full flex items-center justify-center text-slate-300'>No image</div>}
            </div>
            {product.images?.length > 1 && (
              <div className='flex gap-2 mt-3 flex-wrap'>
                {product.images.map((src, i) => (
                  <button key={src + i} onClick={() => setImage(i)} className={`size-16 rounded-md overflow-hidden border-2 ${i === image ? 'border-green-500' : 'border-transparent hover:border-slate-300'}`}>
                    <img src={src} alt='' className='w-full h-full object-cover' />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className='text-3xl font-bold text-slate-800 leading-tight'>{product.title}</h1>
            {product.tagline && <p className='text-slate-500 mt-2'>{product.tagline}</p>}

            <div className='mt-5 flex items-baseline gap-3'>
              <span className='text-3xl font-semibold text-slate-800'>{product.price > 0 ? formatPrice(product.price, product.currency) : 'Free'}</span>
              {product.compareAtPrice > product.price && <span className='text-slate-400 line-through'>{formatPrice(product.compareAtPrice, product.currency)}</span>}
              {discount > 0 && <span className='text-sm font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full'>{discount}% off</span>}
            </div>

            {product.features?.length > 0 && (
              <ul className='mt-6 space-y-2'>
                {product.features.map((f, i) => (
                  <li key={i} className='flex items-start gap-2 text-slate-600 text-sm'>
                    <LuCheck className='size-4 mt-0.5 text-green-600 shrink-0' /> {f}
                  </li>
                ))}
              </ul>
            )}

            <div className='mt-8'>
              {!canBuy ? (
                <button disabled className='px-8 py-3 rounded-full bg-slate-200 text-slate-500 text-sm font-medium cursor-not-allowed'>
                  {product.stockStatus === 'coming_soon' ? 'Coming soon' : 'Sold out'}
                </button>
              ) : product.buyUrl ? (
                <button onClick={buy} className='px-8 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition active:scale-95'>
                  {product.buttonLabel || 'Buy now'}
                </button>
              ) : (
                <Link to='/contact-us' className='inline-block px-8 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition'>
                  Contact us to buy
                </Link>
              )}
            </div>
          </div>
        </div>

        {product.content?.length > 0 && (
          <div className='max-w-2xl mt-14'>
            <BlockRenderer blocks={product.content} />
          </div>
        )}

        {related.length > 0 && (
          <div className='mt-16'>
            <p className='text-sm font-semibold text-slate-800 mb-4'>More products</p>
            <div className='grid sm:grid-cols-3 gap-4'>
              {related.map((p) => (
                <Link key={p.slug} to={`/products/${p.slug}`} className='rounded-lg border border-slate-200 p-3 hover:border-green-200 transition flex gap-3 items-center'>
                  {p.images?.[0] && <img src={p.images[0]} alt='' className='size-14 rounded object-cover' />}
                  <div className='min-w-0'>
                    <p className='text-sm font-medium text-slate-800 truncate'>{p.title}</p>
                    <p className='text-xs text-slate-500'>{p.price > 0 ? formatPrice(p.price, p.currency) : 'Free'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
      <Footer />
    </div>
  )
}

export default ProductDetail
