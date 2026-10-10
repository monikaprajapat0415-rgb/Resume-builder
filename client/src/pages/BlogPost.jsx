import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import BlockRenderer from '../components/BlockRenderer'
import { renderInline } from '../utils/inlineText'
import { dropServerJsonLd, fmtDate, wasUpdated } from '../utils/seoDom'
import { LuChevronRight, LuListChecks, LuLink, LuCheck, LuLightbulb } from 'react-icons/lu'

const Crumbs = ({ post }) => (
  <nav aria-label='Breadcrumb' className='text-xs text-slate-400 mb-6'>
    <ol className='flex flex-wrap items-center gap-1'>
      <li><Link to='/' className='hover:text-slate-600'>Home</Link></li>
      <li aria-hidden='true'><LuChevronRight className='size-3' /></li>
      <li><Link to='/blog' className='hover:text-slate-600'>Blog</Link></li>
      {post.category && post.categoryName && <>
        <li aria-hidden='true'><LuChevronRight className='size-3' /></li>
        <li><Link to={`/blog/category/${post.category}`} className='hover:text-slate-600'>{post.categoryName}</Link></li>
      </>}
    </ol>
  </nav>
)

const ShareRow = ({ post }) => {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''
  const enc = encodeURIComponent
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* clipboard blocked */ }
  }
  const btn = 'text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition'
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <span className='text-xs text-slate-400 mr-1'>Share</span>
      <a className={btn} href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target='_blank' rel='noopener noreferrer'>LinkedIn</a>
      <a className={btn} href={`https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(post.title)}`} target='_blank' rel='noopener noreferrer'>X</a>
      <a className={btn} href={`https://wa.me/?text=${enc(`${post.title} ${url}`)}`} target='_blank' rel='noopener noreferrer'>WhatsApp</a>
      <button type='button' onClick={copy} className={`${btn} inline-flex items-center gap-1`}>{copied ? <><LuCheck className='size-3.5' />Copied</> : <><LuLink className='size-3.5' />Copy link</>}</button>
    </div>
  )
}

const BlogPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [state, setState] = useState('loading') // loading | ok | missing | error

  useEffect(() => {
    let live = true
    setState('loading'); setPost(null)
    api.get(`/api/blogs/${slug}`)
      .then(({ data }) => { if (!live) return; if (!data.post?.seo) { setState('error'); return } setPost(data.post); setState('ok') })
      .catch((e) => { if (live) setState(e.response?.status === 404 ? 'missing' : 'error') })
    return () => { live = false }
  }, [slug])

  useEffect(() => { if (post) dropServerJsonLd() }, [post])

  if (state !== 'ok') {
    return (
      <div>
        {state === 'missing' && <SEO title='Article not found' noindex />}
        <NavBar />
        <div className='min-h-[50vh] flex flex-col items-center justify-center text-center px-4'>
          {state === 'loading' && <p className='text-slate-400'>Loading…</p>}
          {state === 'missing' && <>
            <h1 className='text-2xl font-semibold text-slate-800'>We couldn't find that article</h1>
            <p className='text-slate-500 mt-2'>It may have been moved or unpublished.</p>
            <Link to='/blog' className='mt-5 text-brand-600 hover:underline'>Browse all articles</Link>
          </>}
          {state === 'error' && <p className='text-slate-500'>Could not load this article. Please refresh the page.</p>}
        </div>
        <Footer />
      </div>
    )
  }

  const s = post.seo
  const updated = wasUpdated(post.date, post.modifiedAt)

  return (
    <div>
      <SEO
        title={s.title}
        description={s.description}
        keywords={s.keywords}
        path={`/blog/${post.slug}`}
        canonical={s.canonical}
        robots={s.robots}
        image={s.image}
        imageAlt={s.imageAlt}
        type='article'
        article={s.article}
        structuredData={post.jsonLd}
      />
      <NavBar />
      <article className='max-w-2xl mx-auto px-4 py-12'>
        <Crumbs post={post} />

        {post.categoryName && (
          <Link to={`/blog/category/${post.category}`} className='inline-block text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full mb-3 hover:bg-brand-100 transition'>
            {post.categoryName}
          </Link>
        )}
        <h1 className='text-3xl sm:text-4xl font-bold text-slate-800 leading-tight'>{post.title}</h1>
        <p className='text-sm text-slate-500 mt-4'>
          By <span className='font-medium text-slate-700'>{post.author}</span>
          <span className='mx-1.5 text-slate-300'>·</span>
          <time dateTime={new Date(post.date).toISOString()}>{fmtDate(post.date)}</time>
          {updated && <><span className='mx-1.5 text-slate-300'>·</span>Updated <time dateTime={new Date(post.modifiedAt).toISOString()}>{fmtDate(post.modifiedAt)}</time></>}
          <span className='mx-1.5 text-slate-300'>·</span>{post.readTime}
        </p>

        {post.coverImage && (
          <img src={post.coverImage} alt={post.coverAlt || post.title} width={1200} height={630} fetchpriority='high' decoding='async'
            className='w-full h-auto rounded-xl mt-6 border border-slate-100 aspect-[1200/630] object-cover' />
        )}

        {post.takeaways.length > 0 && (
          <aside className='mt-8 rounded-xl border border-brand-200 bg-brand-50/60 p-5' aria-labelledby='takeaways'>
            <h2 id='takeaways' className='flex items-center gap-2 text-sm font-semibold text-brand-800'><LuLightbulb className='size-4' />Key takeaways</h2>
            <ul className='mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5'>
              {post.takeaways.map((t, i) => <li key={i}>{renderInline(t)}</li>)}
            </ul>
          </aside>
        )}

        {post.toc.length > 2 && (
          <nav className='mt-6 rounded-xl border border-slate-200 p-5' aria-labelledby='toc'>
            <h2 id='toc' className='flex items-center gap-2 text-sm font-semibold text-slate-800'><LuListChecks className='size-4 text-slate-500' />In this article</h2>
            <ol className='mt-3 space-y-1.5 text-sm list-decimal pl-5 text-slate-500'>
              {post.toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className='text-brand-700 hover:underline'>{t.text}</a></li>)}
            </ol>
          </nav>
        )}

        <div className='mt-8'>
          <BlockRenderer blocks={post.content} />
        </div>

        {post.faqs.length > 0 && (
          <section className='mt-12' aria-labelledby='faq'>
            <h2 id='faq' className='text-2xl font-semibold text-slate-800 mb-4'>Frequently asked questions</h2>
            <div className='divide-y divide-slate-200 border-y border-slate-200'>
              {post.faqs.map((f, i) => (
                <details key={i} className='group py-3'>
                  <summary className='cursor-pointer list-none flex items-start justify-between gap-4 font-medium text-slate-800'>
                    <h3 className='text-base font-medium'>{f.q}</h3>
                    <span className='text-slate-400 group-open:rotate-45 transition text-xl leading-none' aria-hidden='true'>+</span>
                  </summary>
                  <p className='mt-2 text-slate-600'>{renderInline(f.a)}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {post.sources.length > 0 && (
          <section className='mt-10' aria-labelledby='sources'>
            <h2 id='sources' className='text-sm font-semibold text-slate-800 mb-2'>Sources</h2>
            <ul className='text-sm space-y-1 list-disc pl-5'>
              {post.sources.map((src, i) => <li key={i}><a href={src.url} target='_blank' rel='noopener noreferrer' className='text-brand-700 hover:underline'>{src.title}</a></li>)}
            </ul>
          </section>
        )}

        <div className='mt-10 flex flex-col gap-6'>
          <ShareRow post={post} />
          {post.authorBio && (
            <aside className='rounded-xl bg-slate-50 p-5 text-sm'>
              <p className='font-semibold text-slate-800'>About {post.author}</p>
              <p className='text-slate-600 mt-1'>{post.authorBio}</p>
            </aside>
          )}
        </div>

        <div className='mt-12 rounded-xl border border-brand-200 bg-brand-50 p-6 text-center'>
          <p className='text-slate-800 font-medium'>Ready to put this into practice?</p>
          <p className='text-sm text-slate-500 mt-1 mb-4'>Build an ATS-friendly resume with Prime Resume AI in minutes, or check how your current resume scores.</p>
          <div className='flex flex-wrap justify-center gap-3'>
            <Link to='/app?state=register' className='inline-block px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm transition'>Build my resume</Link>
            <Link to='/features/ats-checker' className='inline-block px-6 py-2.5 border border-brand-300 text-brand-700 hover:bg-brand-100 rounded-full text-sm transition'>Free ATS checker</Link>
          </div>
        </div>
      </article>

      {post.related.length > 0 && (
        <section className='max-w-4xl mx-auto px-4 pb-16' aria-labelledby='related'>
          <h2 id='related' className='text-lg font-semibold text-slate-800 mb-4'>Related articles</h2>
          <div className='grid sm:grid-cols-3 gap-4'>
            {post.related.map((r) => (
              <Link key={r.slug} to={`/blog/${r.slug}`} className='group block rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-md hover:border-brand-200 transition'>
                {r.coverImage && <img src={r.coverImage} alt={r.coverAlt || r.title} loading='lazy' width={600} height={315} className='w-full aspect-[1200/630] object-cover' />}
                <div className='p-4'>
                  <p className='text-sm font-semibold text-slate-800 group-hover:text-brand-600 transition'>{r.title}</p>
                  {r.excerpt && <p className='text-xs text-slate-500 mt-1.5 line-clamp-2'>{r.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      <Footer />
    </div>
  )
}

export default BlogPost
