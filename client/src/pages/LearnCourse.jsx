import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { stripInline } from '../utils/inlineText'
import { dropServerJsonLd } from '../utils/seoDom'
import { CourseBadge } from './LearnIndex'
import { useCourseProgress, countDone } from '../utils/learnProgress'
import { LuArrowRight, LuBookOpen, LuSignal, LuCheck, LuBookmarkCheck, LuAward, LuChevronDown, LuSearch, LuLayers } from 'react-icons/lu'

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


// The lesson list. Long courses (Angular has 84 lessons) are grouped into sections that open and close, with a jump bar,
// a per-section progress count and a search box. Every lesson link stays in the page (closed sections are only hidden),
// so search engines and the "view source" HTML still see the full list.
const CourseOutline = ({ course, sections, starts, done, nextSlug }) => {
  const nextSection = Math.max(0, sections.findIndex((sec) => sec.lessons.some((l) => l.slug === nextSlug)))
  const [open, setOpen] = useState(() => new Set([nextSection]))
  const [q, setQ] = useState('')
  const term = q.trim().toLowerCase()
  const match = (l) => !term || `${l.title} ${l.description || ''}`.toLowerCase().includes(term)
  const shown = sections.map((sec) => sec.lessons.filter(match))
  const total = shown.reduce((n, l) => n + l.length, 0)
  const toggle = (i) => setOpen((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })
  const allOpen = open.size === sections.length
  const jump = (i) => {
    setOpen((prev) => new Set(prev).add(i))
    requestAnimationFrame(() => document.getElementById(`sec-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <div className='mt-12'>
      <div className='flex flex-wrap items-end justify-between gap-3 mb-4'>
        <div>
          <h2 className='text-xl font-semibold text-slate-800'>What you'll learn</h2>
          <p className='text-sm text-slate-500 mt-0.5'>{sections.length} sections, {sections.reduce((n, sec) => n + sec.lessons.length, 0)} lessons. Open a section to see its lessons.</p>
        </div>
        <div className='flex items-center gap-2'>
          <label className='relative'>
            <span className='sr-only'>Search lessons</span>
            <LuSearch className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400' aria-hidden='true' />
            <input type='search' value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search lessons' className='w-52 sm:w-64 pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-brand-300' />
          </label>
          <button type='button' onClick={() => setOpen(allOpen ? new Set() : new Set(sections.map((_, i) => i)))} className='text-sm px-4 py-2 border border-slate-200 rounded-full bg-white hover:bg-slate-50 whitespace-nowrap'>
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
      </div>

      {sections.length > 1 && !term && (
        <nav aria-label='Course sections' className='flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1'>
          {sections.map((sec, i) => (
            <button key={i} type='button' onClick={() => jump(i)} className='shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700'>
              <LuLayers className='size-3.5' aria-hidden='true' />{sec.title || `Section ${i + 1}`}
            </button>
          ))}
        </nav>
      )}

      {term && <p className='text-sm text-slate-500 mb-3' role='status'>{total ? `${total} lesson${total === 1 ? '' : 's'} match "${q.trim()}".` : `No lesson matches "${q.trim()}".`}</p>}

      <div className='space-y-3'>
        {sections.map((sec, si) => {
          const lessons = shown[si]
          if (term && !lessons.length) return null
          const doneN = sec.lessons.filter((l) => done.includes(l.slug)).length
          const isOpen = term ? true : open.has(si)
          const pct = sec.lessons.length ? (doneN / sec.lessons.length) * 100 : 0
          return (
            <section key={si} id={`sec-${si}`} className='scroll-mt-24 rounded-xl border border-slate-200 bg-white overflow-hidden'>
              <h3>
                <button type='button' aria-expanded={isOpen} aria-controls={`sec-body-${si}`} onClick={() => toggle(si)} className='w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-slate-50 transition'>
                  <span className={`size-8 shrink-0 rounded-full grid place-items-center text-xs font-semibold ${doneN === sec.lessons.length && doneN > 0 ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'}`} data-no-i18n>
                    {doneN === sec.lessons.length && doneN > 0 ? <LuCheck className='size-4' aria-label='Section complete' /> : si + 1}
                  </span>
                  <span className='min-w-0 flex-1'>
                    <span className='block text-sm font-semibold text-slate-800'>{sec.title || 'Lessons'}</span>
                    <span className='block text-xs text-slate-500 mt-0.5' data-no-i18n>{sec.lessons.length} lessons{doneN > 0 ? `, ${doneN} done` : ''}</span>
                  </span>
                  {doneN > 0 && <span className='hidden sm:block w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden' aria-hidden='true'><span className='block h-full bg-brand-500' style={{ width: `${pct}%` }} /></span>}
                  <LuChevronDown className={`size-5 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden='true' />
                </button>
              </h3>
              <ol id={`sec-body-${si}`} hidden={!isOpen} className='divide-y divide-slate-100 border-t border-slate-100'>
                {lessons.map((l) => {
                  const n = starts[si] + sec.lessons.indexOf(l) + 1
                  const isDone = done.includes(l.slug)
                  const isNext = l.slug === nextSlug
                  return (
                    <li key={l.slug}>
                      <Link to={`/learn/${course.slug}/${l.slug}`} className={`flex items-start gap-3 px-5 py-3 hover:bg-brand-50/50 transition group ${isNext ? 'bg-brand-50/40' : ''}`}>
                        <span className='text-xs text-slate-400 w-7 pt-0.5 shrink-0' data-no-i18n>{isDone ? <LuCheck className='size-4 text-brand-600' aria-label='Completed' /> : `${n}.`}</span>
                        <span className='min-w-0 flex-1'>
                          <span className='block text-sm font-medium text-slate-800 group-hover:text-brand-700'>{l.title}</span>
                          {l.description && <span className='block text-xs text-slate-500 mt-0.5 line-clamp-2'>{stripInline(l.description)}</span>}
                        </span>
                        {isNext && <span className='shrink-0 text-[11px] font-medium text-brand-700 bg-brand-100 rounded-full px-2 py-0.5' data-no-i18n>{done.length ? 'Up next' : 'Start here'}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}
      </div>
    </div>
  )
}

const LearnCourse = () => {
  const { course: slug } = useParams()
  const [result, setResult] = useState({ key: '', data: null, state: 'loading' })
  const progress = useCourseProgress(slug)

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
  const allLessons = sections.flatMap((sec) => sec.lessons)
  const allSlugs = allLessons.map((l) => l.slug)
  const doneCount = countDone(progress.done, allSlugs)
  const lastLesson = allLessons.find((l) => l.slug === progress.last)
  const nextUp = allLessons.find((l) => !progress.done.includes(l.slug))
  const resumeTo = lastLesson && doneCount < allSlugs.length ? lastLesson : null
  const saved = allLessons.filter((l) => progress.marks.includes(l.slug))
  const starts = sections.map((_, i) => sections.slice(0, i).reduce((sum, sec) => sum + sec.lessons.length, 0))

  return (
    <div>
      <SEO title={seo.title} description={seo.description} keywords={seo.keywords} path={`/learn/${course.slug}`} canonical={seo.canonical} robots={seo.robots} image={seo.image} imageAlt={seo.imageAlt} structuredData={data.jsonLd} />
      <NavBar />
      <section className='site-w py-14'>
       <div className='max-w-5xl mx-auto'>
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
        <p className='text-slate-600 mt-6 leading-relaxed max-w-3xl'>{stripInline(course.description)}</p>
        {data.firstLesson && (
          <Link to={`/learn/${course.slug}/${data.firstLesson}`} className='inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>
            Start learning <LuArrowRight className='size-4' />
          </Link>
        )}

        {(doneCount > 0 || resumeTo || saved.length > 0) && (
          <div className='mt-8 rounded-xl border border-brand-200 bg-brand-50/40 p-5' data-no-i18n>
            <div className='flex justify-between text-sm text-slate-700 mb-1.5'><span className='font-medium'>Your progress</span><span>{doneCount} of {allSlugs.length} lessons done</span></div>
            <div className='h-2 rounded-full bg-white overflow-hidden' role='progressbar' aria-label='Course progress' aria-valuemin={0} aria-valuemax={allSlugs.length} aria-valuenow={doneCount}><div className='h-full bg-brand-500 transition-all duration-500' style={{ width: `${allSlugs.length ? (doneCount / allSlugs.length) * 100 : 0}%` }} /></div>
            <div className='mt-3 flex flex-wrap items-center gap-3'>
              {resumeTo && <Link to={`/learn/${course.slug}/${resumeTo.slug}`} className='inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700'>Continue: {stripInline(resumeTo.title)} <LuArrowRight className='size-4' /></Link>}
              {!resumeTo && nextUp && doneCount > 0 && <Link to={`/learn/${course.slug}/${nextUp.slug}`} className='inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700'>Next lesson <LuArrowRight className='size-4' /></Link>}
              {doneCount === allSlugs.length && allSlugs.length > 0 && <Link to={`/learn/${course.slug}/certificate`} className='inline-flex items-center gap-2 rounded-full border border-brand-300 bg-white px-5 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50'><LuAward className='size-4' />Get your certificate</Link>}
              {doneCount > 0 && <button type='button' onClick={() => { if (window.confirm('Clear your progress and saved lessons for this course?')) progress.resetAll() }} className='text-xs text-slate-500 hover:text-slate-700 underline'>Clear progress</button>}
            </div>
            {saved.length > 0 && <p className='mt-3 text-sm text-slate-600'><LuBookmarkCheck className='inline size-4 text-amber-500 mr-1' />Saved: {saved.map((l, i) => <span key={l.slug}>{i > 0 && ', '}<Link to={`/learn/${course.slug}/${l.slug}`} className='text-brand-700 hover:underline'>{stripInline(l.title)}</Link></span>)}</p>}
          </div>
        )}

        <CourseOutline course={course} sections={sections} starts={starts} done={progress.done} nextSlug={(resumeTo || nextUp)?.slug} />
       </div>
      </section>
      <Footer />
    </div>
  )
}

export default LearnCourse
