import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { stripInline } from '../utils/inlineText'
import { LuArrowRight } from 'react-icons/lu'

const BlogIndex = () => {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useSearchParams()
  const active = params.get('category') || ''

  useEffect(() => {
    api.get('/api/blogs/categories').then(({ data }) => setCategories(data.categories || [])).catch(() => {})
  }, [])

  useEffect(() => {
    let live = true
    setLoading(true)
    const loadPosts = async () => {
      try {
        const { data } = await api.get('/api/blogs', { params: active ? { category: active } : {} })
        if (live) setPosts(data.posts || [])
      } catch (error) {
        console.error(error?.response?.data?.message || error.message || 'Could not load posts.')
      }
      if (live) setLoading(false)
    }
    loadPosts()
    return () => { live = false }
  }, [active])

  const pick = (slug) => (slug ? setParams({ category: slug }) : setParams({}))
  const nameOf = (slug) => categories.find((c) => c.slug === slug)?.name

  return (
    <div>
      <SEO
        title="Resume Writing Tips & Career Advice"
        description="Practical, no-fluff guides on writing resumes that get interviews — summaries, ATS formatting, bullet points, and more."
        keywords="resume tips, resume writing advice, career blog, ATS resume tips"
        path="/blog"
      />
      <NavBar />
      <section className='max-w-5xl mx-auto px-4 py-16'>
        <div className='text-center max-w-2xl mx-auto mb-14'>
          <h1 className='text-4xl font-semibold text-slate-800'>Resume &amp; Career Blog</h1>
          <p className='text-slate-500 mt-3'>Practical, no-fluff guides on writing resumes that actually get interviews.</p>
        </div>

        {categories.length > 0 && (
          <div className='flex flex-wrap justify-center gap-2 mb-10'>
            {[{ slug: '', name: 'All' }, ...categories].map((c) => (
              <button
                key={c.slug || 'all'}
                onClick={() => pick(c.slug)}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${active === c.slug ? 'bg-green-600 border-green-600 text-white' : 'border-slate-200 text-slate-600 hover:border-green-300 hover:text-green-700'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className='text-center text-slate-400'>Loading articles…</p>
        ) : posts.length === 0 ? (
          <p className='text-center text-slate-400'>No articles here yet. Check back soon.</p>
        ) : (
          <div className='grid sm:grid-cols-2 gap-6'>
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className='group block rounded-xl border border-slate-200 p-6 bg-white hover:shadow-md hover:border-green-200 transition'
              >
                <p className='text-xs text-slate-400 mb-2'>
                  {nameOf(post.category) && <span className='text-green-700 font-medium'>{nameOf(post.category)} · </span>}
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {post.readTime}
                </p>
                <h2 className='text-lg font-semibold text-slate-800 group-hover:text-green-600 transition'>{post.title}</h2>
                <p className='text-sm text-slate-500 mt-2 line-clamp-3'>{stripInline(post.excerpt)}</p>
                <span className='inline-flex items-center gap-1 text-sm text-green-600 font-medium mt-4'>
                  Read article <LuArrowRight className='size-4 group-hover:translate-x-1 transition-transform' />
                </span>
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
