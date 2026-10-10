import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { stripInline } from '../utils/inlineText'
import { dropServerJsonLd, fmtDate } from '../utils/seoDom'
import { LuArrowRight } from 'react-icons/lu'

const SITE = 'https://primeresumeai.com'
const BLOG_DESC = 'Practical, no-fluff guides on writing resumes that get interviews: summaries, ATS formatting, bullet points, cover letters and career advice.'

const BlogIndex = () => {
  const { slug: active = '' } = useParams()
  const [params] = useSearchParams()
  const legacy = params.get('category') // old /blog?category=x links
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/blogs/categories').then(({ data }) => setCategories(data.categories || [])).catch(() => {})
  }, [])

  useEffect(() => {
    let live = true
    setLoading(true)
    api.get('/api/blogs', { params: active ? { category: active } : {} })
      .then(({ data }) => { if (live) setPosts(data.posts || []) })
      .catch((error) => console.error(error?.response?.data?.message || error.message || 'Could not load posts.'))
      .finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [active])

  useEffect(() => { if (!loading) dropServerJsonLd() }, [loading])

  if (legacy && !active) return <Navigate to={`/blog/category/${encodeURIComponent(legacy)}`} replace />

  const cat = categories.find((c) => c.slug === active)
  const heading = cat ? cat.name : 'Resume & Career Blog'
  const description = cat ? (cat.description || `Guides and tips about ${cat.name.toLowerCase()} from the Prime Resume AI team.`) : BLOG_DESC
  const path = active ? `/blog/category/${active}` : '/blog'
  const title = cat ? `${cat.name} articles` : 'Resume Writing Tips & Career Advice'

  const structuredData = [
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: `${SITE}${path}`, inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', name: 'Prime Resume AI', url: SITE },
      mainEntity: { '@type': 'ItemList', itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/blog/${p.slug}`, name: p.title })) },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Home', url: `${SITE}/` }, { name: 'Blog', url: `${SITE}/blog` }, ...(active ? [{ name: title, url: `${SITE}${path}` }] : [])]
        .map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
    },
  ]

  return (
    <div>
      <SEO title={title} description={description} keywords='resume tips, resume writing advice, career blog, ATS resume tips' path={path} structuredData={loading ? undefined : structuredData} />
      <NavBar />
      <section className='max-w-5xl mx-auto px-4 py-16'>
        <nav aria-label='Breadcrumb' className='text-xs text-slate-400 mb-6'>
          <Link to='/' className='hover:text-slate-600'>Home</Link> › {active ? <><Link to='/blog' className='hover:text-slate-600'>Blog</Link> › <span>{heading}</span></> : <span>Blog</span>}
        </nav>
        <div className='text-center max-w-2xl mx-auto mb-12'>
          <h1 className='text-4xl font-semibold text-slate-800'>{heading}</h1>
          <p className='text-slate-500 mt-3'>{description}</p>
        </div>

        {categories.length > 0 && (
          <nav aria-label='Categories' className='flex flex-wrap justify-center gap-2 mb-10'>
            {[{ slug: '', name: 'All' }, ...categories].map((c) => (
              <Link
                key={c.slug || 'all'}
                to={c.slug ? `/blog/category/${c.slug}` : '/blog'}
                aria-current={active === c.slug ? 'page' : undefined}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${active === c.slug ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700'}`}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        )}

        {loading ? (
          <p className='text-center text-slate-400'>Loading articles…</p>
        ) : posts.length === 0 ? (
          <p className='text-center text-slate-400'>No articles here yet. Check back soon.</p>
        ) : (
          <div className='grid sm:grid-cols-2 gap-6'>
            {posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className='group block rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-md hover:border-brand-200 transition'>
                {post.coverImage && <img src={post.coverImage} alt={post.coverAlt || post.title} loading='lazy' width={800} height={420} className='w-full aspect-[1200/630] object-cover' />}
                <div className='p-6'>
                  <p className='text-xs text-slate-400 mb-2'>
                    {post.categoryName && <span className='text-brand-700 font-medium'>{post.categoryName} · </span>}
                    {fmtDate(post.date)}{post.readTime ? ` · ${post.readTime}` : ''}
                  </p>
                  <h2 className='text-lg font-semibold text-slate-800 group-hover:text-brand-600 transition'>{post.title}</h2>
                  <p className='text-sm text-slate-500 mt-2 line-clamp-3'>{stripInline(post.excerpt || post.description || '')}</p>
                  <span className='inline-flex items-center gap-1 text-sm text-brand-600 font-medium mt-4'>
                    Read article <LuArrowRight className='size-4 group-hover:translate-x-1 transition-transform' />
                  </span>
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

export default BlogIndex
