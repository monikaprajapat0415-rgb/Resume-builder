import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import BlockRenderer from '../components/BlockRenderer'
import { renderInline } from '../utils/inlineText'
import { dropServerJsonLd, fmtDate } from '../utils/seoDom'
import { LuArrowLeft, LuArrowRight, LuChevronRight, LuMenu } from 'react-icons/lu'

// Course menu: every lesson grouped by chapter, current lesson highlighted.
const CourseMenu = ({ courseSlug, sections, current }) => {
  const starts = sections.map((_, i) => sections.slice(0, i).reduce((sum, sec) => sum + sec.lessons.length, 0))
  return (
    <nav aria-label='Course lessons' className='text-sm'>
      {sections.map((s, si) => {
        const open = s.lessons.some((l) => l.slug === current)
        return (
          <details key={si} open={open || sections.length === 1} className='mb-1 group'>
            {s.title && (
              <summary className='cursor-pointer list-none flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-800'>
                {s.title}<LuChevronRight className='size-3.5 transition group-open:rotate-90' />
              </summary>
            )}
            <ol className='mb-2'>
              {s.lessons.map((l, li) => {
                const n = starts[si] + li + 1
                const active = l.slug === current
                return (
                  <li key={l.slug}>
                    <Link to={`/learn/${courseSlug}/${l.slug}`} aria-current={active ? 'page' : undefined}
                      className={`flex gap-2 rounded-md px-2 py-1.5 leading-snug transition ${active ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
                      <span className='text-slate-400 w-5 shrink-0'>{n}.</span><span>{l.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </details>
        )
      })}
    </nav>
  )
}

const LearnLesson = () => {
  const { course: courseSlug, lesson: lessonSlug } = useParams()
  const key = `${courseSlug}/${lessonSlug}`
  const [result, setResult] = useState({ key: '', data: null, state: 'loading' })
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    let live = true
    api.get(`/api/learn/${courseSlug}/${lessonSlug}`)
      .then(({ data: d }) => {
        if (!live) return
        setResult(d.seo ? { key, data: d, state: 'ok' } : { key, data: null, state: 'error' })
        setMenuOpen(false)
        if (!window.location.hash) window.scrollTo(0, 0)
      })
      .catch((e) => { if (live) setResult({ key, data: null, state: e.response?.status === 404 ? 'missing' : 'error' }) })
    return () => { live = false }
  }, [courseSlug, lessonSlug, key])

  // Keep showing the previous lesson (menu included) while the next one loads.
  const fresh = result.key === key
  const data = result.data
  const state = fresh ? result.state : (data ? 'ok' : 'loading')

  useEffect(() => { if (data) dropServerJsonLd() }, [data])

  // Highlight the heading being read in "On this page".
  useEffect(() => {
    if (!data?.toc?.length || typeof IntersectionObserver === 'undefined') return undefined
    const els = data.toc.map((t) => document.getElementById(t.id)).filter(Boolean)
    const io = new IntersectionObserver((entries) => {
      const seen = entries.filter((e) => e.isIntersecting)
      if (seen.length) setActive(seen[0].target.id)
    }, { rootMargin: '0px 0px -70% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [data])

  if (state !== 'ok' && !data) {
    return (
      <div>
        {state === 'missing' && <SEO title='Lesson not found' noindex />}
        <NavBar />
        <div className='min-h-[50vh] flex flex-col items-center justify-center text-center px-4'>
          {state === 'loading' && <p className='text-slate-400'>Loading…</p>}
          {state === 'missing' && <>
            <h1 className='text-2xl font-semibold text-slate-800'>We couldn't find that lesson</h1>
            <p className='text-slate-500 mt-2'>It may have been moved or unpublished.</p>
            <Link to={`/learn/${courseSlug}`} className='mt-5 text-brand-600 hover:underline'>See the course</Link>
          </>}
          {state === 'error' && <p className='text-slate-500'>Could not load this lesson. Please refresh the page.</p>}
        </div>
        <Footer />
      </div>
    )
  }

  const { lesson, course, sections, prev, next, toc, seo } = data

  return (
    <div>
      <SEO title={seo.title} description={seo.description} keywords={seo.keywords} path={`/learn/${course.slug}/${lesson.slug}`} canonical={seo.canonical} robots={seo.robots}
        image={seo.image} imageAlt={seo.imageAlt} type='article' article={seo.article} structuredData={data.jsonLd} />
      <NavBar />
      <div className='max-w-7xl mx-auto px-4 py-8 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_14rem] lg:gap-8'>
        <aside className='lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto mb-6 lg:mb-0'>
          <Link to={`/learn/${course.slug}`} className='block font-semibold text-slate-800 hover:text-brand-700 mb-2 px-2'>{course.title}</Link>
          <button type='button' onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen}
            className='lg:hidden w-full flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600'>
            <span className='inline-flex items-center gap-2'><LuMenu className='size-4' />All lessons ({data.position}/{data.total})</span>
            <LuChevronRight className={`size-4 transition ${menuOpen ? 'rotate-90' : ''}`} />
          </button>
          <div className={`${menuOpen ? 'block' : 'hidden'} lg:block mt-2`}>
            <CourseMenu courseSlug={course.slug} sections={sections} current={lesson.slug} />
          </div>
        </aside>

        <article className='min-w-0'>
          <nav aria-label='Breadcrumb' className='text-xs text-slate-400 mb-4'>
            <Link to='/' className='hover:text-slate-600'>Home</Link> › <Link to='/learn' className='hover:text-slate-600'>Learn</Link> › <Link to={`/learn/${course.slug}`} className='hover:text-slate-600'>{course.title}</Link>
          </nav>
          {lesson.section && <p className='text-xs font-medium text-brand-700 mb-2'>{lesson.section}</p>}
          <h1 className='text-3xl sm:text-4xl font-bold text-slate-800 leading-tight'>{lesson.title}</h1>
          <p className='text-sm text-slate-500 mt-3'>
            Lesson {data.position} of {data.total}<span className='mx-1.5 text-slate-300'>·</span>{lesson.readTime}
            <span className='mx-1.5 text-slate-300'>·</span>Updated <time dateTime={new Date(lesson.modifiedAt).toISOString()}>{fmtDate(lesson.modifiedAt)}</time>
          </p>

          <div className='mt-6'><BlockRenderer blocks={lesson.content} /></div>

          {lesson.faqs.length > 0 && (
            <section className='mt-12' aria-labelledby='faq'>
              <h2 id='faq' className='text-2xl font-semibold text-slate-800 mb-4'>Frequently asked questions</h2>
              <div className='divide-y divide-slate-200 border-y border-slate-200'>
                {lesson.faqs.map((f, i) => (
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

          <nav aria-label='Lesson navigation' className='mt-12 grid sm:grid-cols-2 gap-4'>
            {prev ? (
              <Link to={`/learn/${course.slug}/${prev.slug}`} rel='prev' className='group rounded-xl border border-slate-200 p-4 hover:border-brand-300 hover:bg-brand-50/40 transition'>
                <span className='flex items-center gap-1 text-xs text-slate-400'><LuArrowLeft className='size-3.5' />Previous</span>
                <span className='block font-medium text-slate-800 group-hover:text-brand-700 mt-1'>{prev.title}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link to={`/learn/${course.slug}/${next.slug}`} rel='next' className='group rounded-xl border border-slate-200 p-4 text-right hover:border-brand-300 hover:bg-brand-50/40 transition sm:col-start-2'>
                <span className='flex items-center justify-end gap-1 text-xs text-slate-400'>Next<LuArrowRight className='size-3.5' /></span>
                <span className='block font-medium text-slate-800 group-hover:text-brand-700 mt-1'>{next.title}</span>
              </Link>
            )}
          </nav>
        </article>

        {toc.length > 1 && (
          <aside className='hidden xl:block xl:sticky xl:top-4 xl:self-start'>
            <p className='text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2'>On this page</p>
            <ul className='border-l border-slate-200 text-sm'>
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className={`block -ml-px border-l-2 pl-3 py-1 transition ${active === t.id ? 'border-brand-600 text-brand-700 font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{t.text}</a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default LearnLesson
