import React from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import { getPostBySlug, blogPosts } from '../content/blogPosts'
import { LuArrowLeft } from 'react-icons/lu'

const renderBlock = (block, i) => {
  if (block.type === 'heading') {
    return <h2 key={i} className='text-2xl font-semibold text-slate-800 mt-10 mb-3'>{block.text}</h2>
  }
  if (block.type === 'list') {
    return (
      <ul key={i} className='list-disc list-outside pl-5 space-y-2 text-slate-600 my-4'>
        {block.items.map((item, j) => <li key={j}>{item}</li>)}
      </ul>
    )
  }
  // paragraph (default)
  return <p key={i} className='text-slate-600 leading-relaxed my-4'>{block.text}</p>
}

const BlogPost = () => {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return <Navigate to='/blog' replace />
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'Prime Resume AI' },
    publisher: {
      '@type': 'Organization',
      name: 'Prime Resume AI',
      logo: { '@type': 'ImageObject', url: 'https://primeresumeai.com/logo.svg' },
    },
    mainEntityOfPage: `https://primeresumeai.com/blog/${post.slug}`,
  }

  // Simple related-posts pick: up to 2 other posts, excluding this one.
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <div>
      <SEO
        title={post.title}
        description={post.description}
        keywords={post.keywords}
        path={`/blog/${post.slug}`}
        type="article"
        structuredData={structuredData}
      />
      <NavBar />
      <article className='max-w-2xl mx-auto px-4 py-14'>
        <Link to='/blog' className='inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition mb-8'>
          <LuArrowLeft className='size-4' />Back to blog
        </Link>

        <p className='text-xs text-slate-400 mb-2'>
          {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {post.readTime}
        </p>
        <h1 className='text-3xl sm:text-4xl font-bold text-slate-800 leading-tight'>{post.title}</h1>

        <div className='mt-8'>
          {post.content.map(renderBlock)}
        </div>

        <div className='mt-14 rounded-xl border border-green-200 bg-green-50 p-6 text-center'>
          <p className='text-slate-800 font-medium'>Ready to put this into practice?</p>
          <p className='text-sm text-slate-500 mt-1 mb-4'>Build an ATS-friendly resume with Prime Resume AI in minutes — free to start.</p>
          <Link to='/app?state=register' className='inline-block px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm transition'>
            Build my resume
          </Link>
        </div>

        {related.length > 0 && (
          <div className='mt-14'>
            <p className='text-sm font-semibold text-slate-800 mb-4'>More from the blog</p>
            <div className='space-y-4'>
              {related.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className='block text-green-600 hover:underline text-sm'>
                  {p.title}
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

export default BlogPost
