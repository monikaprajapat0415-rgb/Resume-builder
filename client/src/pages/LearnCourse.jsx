import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { stripInline } from '../utils/inlineText'
import { dropServerJsonLd } from '../utils/seoDom'
import { CourseBadge } from './LearnIndex'
import { LuArrowRight, LuBookOpen, LuSignal } from 'react-icons/lu'

const NotFound = ({ state }) => (
  <div>
    {state === 'missing' && <SEO title='Course not found' noindex />}
    <NavBar />
    <div className='min-h-[50vh] flex flex-col items-center justify-center text-center px-4'>
      {state === 'loading' && <p className='text-slate-400'>Loading…</p>}
      {state === 'missing' && <>
        <h1 className='text-2xl font-semibold text-slate-800'>We couldn't find that course</h1>
        <p className='text-slate-500 mt-2'>It may have been moved or unpublished.</p>
        <Link to='/learn' className='mt-5 text-brand-600 hover:underline'>Browse all tutorials</Link>
      </>}
      {state === 'error' && <p className='text-slate-500'>Could not load this course. Please refresh the page.</p>}
    </div>
    <Footer />
  </div>
)

const LearnCourse = () => {
  const { course: slug } = useParams()
  const [result, setResult] = useState({ key: '', data: null, state: 'loading' })

  useEffect(() => {
    let live = true
    api.get(`/api/learn/${slug}`)
      .then(({ data: d }) => { if (live) setResult(d.seo ? { key: slug, data: d, state: 'ok' } : { key: slug, data: null, state: 'error' }) })
      .catch((e) => { if (live) setResult({ key: slug, data: null, state: e.response?.status === 404 ? 'missing' : 'error' }) })
    return () => { live = false }
  }, [slug])

  const data = result.key === slug ? result.data : null
  const state = result.key === slug ? result.state : 'loading'

  useEffect(() => { if (data) dropServerJsonLd() }, [data])

  if (state !== 'ok') return <NotFound state={state} />
  const { course, sections, seo } = data
  const starts = sections.map((_, i) => sections.slice(0, i).reduce((sum, sec) => sum + sec.lessons.length, 0))

  return (
    <div>
      <SEO title={seo.title} description={seo.description} keywords={seo.keywords} path={`/learn/${course.slug}`} canonical={seo.canonical} robots={seo.robots} image={seo.image} imageAlt={seo.imageAlt} structuredData={data.jsonLd} />
      <NavBar />
      <section className='max-w-3xl mx-auto px-4 py-14'>
        <nav aria-label='Breadcrumb' className='text-xs text-slate-400 mb-6'>
          <Link to='/' className='hover:text-slate-600'>Home</Link> › <Link to='/learn' className='hover:text-slate-600'>Learn</Link> › <span>{course.title}</span>
        </nav>
        <div className='flex items-start gap-5'>
          <CourseBadge course={course} className='size-16 text-xl' />
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold text-slate-800 leading-tight'>{course.title}</h1>
            <p className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-2'>
              <span className='inline-flex items-center gap-1'><LuBookOpen className='size-4' />{data.lessonCount} lessons</span>
              <span className='inline-flex items-center gap-1'><LuSignal className='size-4' />{course.level}</span>
            </p>
          </div>
        </div>
        <p className='text-slate-600 mt-6 leading-relaxed'>{stripInline(course.description)}</p>
        {data.firstLesson && (
          <Link to={`/learn/${course.slug}/${data.firstLesson}`} className='inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>
            Start learning <LuArrowRight className='size-4' />
          </Link>
        )}

        <h2 className='text-xl font-semibold text-slate-800 mt-12 mb-4'>What you'll learn</h2>
        <div className='space-y-6'>
          {sections.map((s, si) => (
            <div key={si} className='rounded-xl border border-slate-200 bg-white overflow-hidden'>
              <h3 className='px-5 py-3 bg-slate-50 text-sm font-semibold text-slate-700 border-b border-slate-200'>{s.title || 'Lessons'}</h3>
              <ol className='divide-y divide-slate-100'>
                {s.lessons.map((l, li) => {
                  const n = starts[si] + li + 1
                  return (
                    <li key={l.slug}>
                      <Link to={`/learn/${course.slug}/${l.slug}`} className='flex items-start gap-3 px-5 py-3 hover:bg-brand-50/50 transition group'>
                        <span className='text-xs text-slate-400 w-6 pt-0.5 shrink-0'>{n}.</span>
                        <span>
                          <span className='block text-sm font-medium text-slate-800 group-hover:text-brand-700'>{l.title}</span>
                          {l.description && <span className='block text-xs text-slate-500 mt-0.5 line-clamp-1'>{stripInline(l.description)}</span>}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default LearnCourse
