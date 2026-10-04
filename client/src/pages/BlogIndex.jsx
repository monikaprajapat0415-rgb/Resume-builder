import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import { blogPosts } from '../content/blogPosts'
import { LuArrowRight } from 'react-icons/lu'

const BlogIndex = () => {
  const sorted = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date))

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

        <div className='grid sm:grid-cols-2 gap-6'>
          {sorted.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className='group block rounded-xl border border-slate-200 p-6 bg-white hover:shadow-md hover:border-green-200 transition'
            >
              <p className='text-xs text-slate-400 mb-2'>
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {post.readTime}
              </p>
              <h2 className='text-lg font-semibold text-slate-800 group-hover:text-green-600 transition'>{post.title}</h2>
              <p className='text-sm text-slate-500 mt-2 line-clamp-3'>{post.excerpt}</p>
              <span className='inline-flex items-center gap-1 text-sm text-green-600 font-medium mt-4'>
                Read article <LuArrowRight className='size-4 group-hover:translate-x-1 transition-transform' />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default BlogIndex
