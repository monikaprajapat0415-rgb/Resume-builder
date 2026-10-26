import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { useCourseProgress, countDone } from '../utils/learnProgress'
import { LuAward, LuPrinter } from 'react-icons/lu'

// A printable "certificate of completion". It is based on the progress saved in this browser, so it is a
// personal record, not an accredited qualification, and it says so. Not indexed by search engines.
const LearnCertificate = () => {
  const { course: slug } = useParams()
  const progress = useCourseProgress(slug)
  const [data, setData] = useState(null)
  const [state, setState] = useState('loading')
  const [name, setName] = useState(() => { try { return localStorage.getItem('prime_cert_name') || '' } catch { return '' } })

  useEffect(() => {
    let live = true
    api.get(`/api/learn/${slug}`).then(({ data: d }) => { if (live) { setData(d); setState('ok') } })
      .catch((e) => { if (live) setState(e.response?.status === 404 ? 'missing' : 'error') })
    return () => { live = false }
  }, [slug])

  const saveName = (v) => { setName(v); try { localStorage.setItem('prime_cert_name', v) } catch { /* ignore */ } }

  if (state !== 'ok') {
    return (
      <div><SEO title='Certificate' noindex /><NavBar />
        <div className='min-h-[50vh] grid place-items-center text-slate-500 px-4 text-center'>{state === 'loading' ? 'Loading…' : state === 'missing' ? 'We could not find that course.' : 'Could not load this course. Please refresh.'}</div>
        <Footer /></div>
    )
  }

  const { course, sections } = data
  const allSlugs = sections.flatMap((s) => s.lessons.map((l) => l.slug))
  const done = countDone(progress.done, allSlugs)
  const complete = allSlugs.length > 0 && done === allSlugs.length
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div>
      <SEO title={`${course.title} certificate`} description='Your course completion certificate.' path={`/learn/${course.slug}/certificate`} noindex />
      <div className='print:hidden'><NavBar /></div>
      <section className='max-w-3xl mx-auto px-4 py-10'>
        <div className='print:hidden'>
          <Link to={`/learn/${course.slug}`} className='text-sm text-brand-700 hover:underline'>← {course.title}</Link>
          <h1 className='text-2xl font-bold text-slate-800 mt-3'>Your certificate</h1>
        </div>
        {!complete ? (
          <div className='mt-6 rounded-xl border border-slate-200 p-6 print:hidden'>
            <p className='text-slate-700'>You have finished <strong>{done} of {allSlugs.length}</strong> lessons. Mark every lesson as done to unlock your certificate.</p>
            <Link to={`/learn/${course.slug}`} className='inline-block mt-4 rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700'>Back to the course</Link>
            <p className='mt-3 text-xs text-slate-500'>Progress is saved in this browser. If you studied on another device, open the course there.</p>
          </div>
        ) : (
          <>
            <div className='mt-6 print:hidden'>
              <label htmlFor='cert-name' className='block text-sm font-medium text-slate-700'>Name to show on the certificate</label>
              <div className='mt-1 flex flex-wrap gap-3'>
                <input id='cert-name' value={name} onChange={(e) => saveName(e.target.value.slice(0, 60))} maxLength={60} placeholder='Your full name' autoComplete='name'
                  className='w-full sm:w-80 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400' />
                <button type='button' onClick={() => window.print()} disabled={!name.trim()} className='inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50'>
                  <LuPrinter className='size-4' />Print or save as PDF
                </button>
              </div>
            </div>
            <div className='mt-6 rounded-2xl border-4 border-double border-brand-300 bg-white p-8 sm:p-12 text-center shadow-sm print:shadow-none' aria-label='Certificate of completion'>
              <LuAward className='mx-auto size-12 text-brand-600' aria-hidden='true' />
              <p className='mt-3 text-xs uppercase tracking-[0.3em] text-slate-500'>Certificate of completion</p>
              <p className='mt-8 text-sm text-slate-500'>This is to say that</p>
              <p className='mt-2 text-3xl sm:text-4xl font-semibold text-slate-800 break-words'>{name.trim() || 'Your name'}</p>
              <p className='mt-6 text-sm text-slate-500'>has completed all {allSlugs.length} lessons of</p>
              <p className='mt-2 text-xl sm:text-2xl font-semibold text-brand-700'>{course.title}</p>
              <p className='mt-8 text-sm text-slate-500'>on {today}</p>
              <p className='mt-8 text-sm font-semibold text-slate-700'>Prime Resume AI</p>
              <p className='text-xs text-slate-400'>primeresumeai.com/learn</p>
              <p className='mt-6 text-[11px] text-slate-400'>A personal record of study based on lessons marked done. It is not an accredited qualification.</p>
            </div>
          </>
        )}
      </section>
      <div className='print:hidden'><Footer /></div>
    </div>
  )
}

export default LearnCertificate
