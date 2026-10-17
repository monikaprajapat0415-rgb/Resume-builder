import { trackEvent } from '../components/Analytics'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { dropServerJsonLd } from '../utils/seoDom'
import { JobDescription, timeAgo } from '../utils/jobText'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { catShort } from '../utils/workTaxonomy'
import { LuMapPin, LuBriefcase, LuWifi, LuExternalLink, LuFileCheck, LuTriangleAlert } from 'react-icons/lu'

const SITE = 'https://primeresumeai.com'

const JobDetail = () => {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [state, setState] = useState('loading')
  const token = useSelector((s) => s.auth?.token)
  const [reporting, setReporting] = useState(false)
  const [reason, setReason] = useState('')
  const sendReport = async (e) => {
    e.preventDefault()
    try { await api.post(`/api/jobs/${slug}/report`, { reason }, { headers: { Authorization: token } }); toast.success('Thank you. We will review this job.'); setReporting(false); setReason('') }
    catch (err) { toast.error(err.response?.data?.message || 'Could not send your report.') }
  }

  useEffect(() => {
    let live = true
    setState('loading'); setData(null)
    api.get(`/api/jobs/${slug}`)
      .then(({ data }) => { if (live) { setData(data); setState('ok') } })
      .catch((e) => { if (live) setState(e.response?.status === 404 ? 'missing' : 'error') })
    return () => { live = false }
  }, [slug])

  useEffect(() => { if (state !== 'loading') dropServerJsonLd() }, [state])

  if (state !== 'ok') {
    return (
      <div>
        <SEO title='Job' noindex path={`/jobs/${slug}`} />
        <NavBar />
        <div className='max-w-xl mx-auto px-4 py-24 text-center'>
          <h1 className='text-2xl font-semibold text-slate-800'>{state === 'loading' ? 'Loading…' : state === 'missing' ? 'This job is no longer available' : 'Could not load this job'}</h1>
          {state !== 'loading' && <Link to='/jobs' className='inline-block mt-5 text-brand-700 hover:underline'>See all open jobs</Link>}
        </div>
        <Footer />
      </div>
    )
  }

  const { job, more, sourceName, insights } = data
  const where = job.location ? ` in ${job.location}` : ''
  const ld = data.jsonLd   // built on the server, the same data crawlers get in the page source

  return (
    <div>
      <SEO title={`${job.title} at ${job.company}${where}`} description={`${job.title} at ${job.company}${where}. ${job.snippet}`.slice(0, 160)} path={`/jobs/${job.slug}`} structuredData={ld} />
      <NavBar />
      <article className='max-w-3xl mx-auto px-4 py-10'>
        <nav aria-label='Breadcrumb' className='text-sm text-slate-500 mb-5'>
          <Link to='/' className='hover:text-slate-600'>Home</Link> › <Link to='/jobs' className='hover:text-slate-600'>Jobs</Link> › <span>{job.title}</span>
        </nav>
        <h1 className='text-3xl font-bold text-slate-800 leading-tight'>{job.title}</h1>
        <p className='text-lg text-slate-600 mt-1'>{job.company}{job.direct && <span className='ml-2 align-middle px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium'>Posted directly by the employer</span>}</p>
        <p className='flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500 mt-3'>
          {job.location && <span className='inline-flex items-center gap-1.5'><LuMapPin className='size-4' />{job.location}</span>}
          {job.remote && <span className='inline-flex items-center gap-1.5'><LuWifi className='size-4' />Remote</span>}
          {job.employmentType && <span className='inline-flex items-center gap-1.5'><LuBriefcase className='size-4' />{job.employmentType}</span>}
          {job.category && job.category !== 'corporate' && <span>{catShort(job.category)}</span>}
          {job.salary && <span className='font-medium text-slate-700'>{job.salary}</span>}
          {job.openings > 1 && <span>{job.openings} openings</span>}
          <span>Posted {timeAgo(job.postedAt)}</span>
        </p>

        <div className='flex flex-wrap gap-3 mt-6'>
          <a href={job.applyUrl} onClick={() => trackEvent('job_apply_click', { job_company: job.company, job_title: job.title })} target='_blank' rel='nofollow noopener noreferrer' className='inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>
            {/^mailto:/i.test(job.applyUrl) ? 'Apply by email' : `Apply on ${job.company}`} <LuExternalLink className='size-4' />
          </a>
          <Link to={`/features/ats-checker?job=${encodeURIComponent(job.slug || slug)}`} className='inline-flex items-center gap-2 px-6 py-2.5 border border-brand-600 text-brand-700 hover:bg-brand-50 rounded-full text-sm font-medium transition'>
            <LuFileCheck className='size-4' /> Check my resume for this job
          </Link>
        </div>

        {job.perks?.length > 0 && <ul className='flex flex-wrap gap-2 mt-5' aria-label='Benefits'>{job.perks.map((p) => <li key={p} className='px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs'>{p}</li>)}</ul>}

        <div className='mt-8 text-slate-700 text-[15px] leading-relaxed space-y-4'><JobDescription text={job.description} /></div>

        {insights && (
          <section className='mt-10 rounded-2xl border border-slate-200 p-5 sm:p-6'>
            <h2 className='text-xl font-semibold text-slate-800'>About this role</h2>
            <p className='mt-2 text-[15px] text-slate-600 leading-relaxed'>{insights.summary}</p>
            {insights.skills.length > 0 && (
              <>
                <h3 className='mt-5 text-sm font-semibold text-slate-800'>Skills mentioned</h3>
                <ul className='mt-2 flex flex-wrap gap-2'>{insights.skills.map((k) => <li key={k} className='px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-xs'>{k}</li>)}</ul>
              </>
            )}
            <h3 className='mt-5 text-sm font-semibold text-slate-800'>How to prepare your application</h3>
            <ul className='mt-2 space-y-2 text-[15px] text-slate-600 list-disc pl-5'>{insights.tips.map((t) => <li key={t}>{t}</li>)}</ul>
            <h3 className='mt-5 text-sm font-semibold text-slate-800'>Common questions</h3>
            <div className='mt-2 divide-y divide-slate-100'>
              {insights.faqs.map((f) => (
                <details key={f.q} className='py-3 group'>
                  <summary className='cursor-pointer text-[15px] font-medium text-slate-700 list-none flex justify-between gap-3'>{f.q}<span className='text-slate-400 group-open:rotate-45 transition'>+</span></summary>
                  <p className='mt-2 text-sm text-slate-600 leading-relaxed'>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className='mt-8 rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-500'>
          You will apply on the employer's own website. Listing source: {sourceName || 'company career page'}
          {sourceName === 'Adzuna' && <> · Jobs by <a href='https://www.adzuna.com' target='_blank' rel='nofollow noopener noreferrer' className='text-brand-700 hover:underline'>Adzuna</a></>}
          {sourceName === 'Arbeitnow' && <> · via <a href='https://www.arbeitnow.com' target='_blank' rel='nofollow noopener noreferrer' className='text-brand-700 hover:underline'>Arbeitnow</a></>}.
          Never pay money to apply for a job.
        </div>

        <aside className='mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900'>
          <p className='font-semibold inline-flex items-center gap-2'><LuTriangleAlert className='size-4' />Stay safe</p>
          <ul className='mt-1.5 list-disc pl-5 space-y-1'>
            <li>A real employer never asks you to pay for a job, a visa, training, uniform or "registration".</li>
            <li>Meet at the work place or in public. Tell someone where you are going.</li>
            <li>Ask for the pay and hours in writing before you start.</li>
          </ul>
          {!reporting ? (token
            ? <button type='button' onClick={() => setReporting(true)} className='mt-3 underline'>Report this job</button>
            : <p className='mt-3'><Link to='/app' className='underline'>Log in</Link> to report this job.</p>)
            : (
              <form onSubmit={sendReport} className='mt-3 space-y-2'>
                <label className='block'><span className='sr-only'>What is wrong with this job?</span><textarea required minLength={5} maxLength={1000} rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder='What is wrong with this job? For example: asks for money, fake company.' className='w-full rounded-lg border border-amber-300 bg-white p-2 text-slate-700' /></label>
                <div className='flex gap-3'><button className='px-4 py-1.5 rounded-full bg-amber-600 text-white'>Send report</button><button type='button' onClick={() => setReporting(false)} className='text-amber-800'>Cancel</button></div>
              </form>
            )}
        </aside>

        {more.length > 0 && (
          <section className='mt-10'>
            <h2 className='text-xl font-semibold text-slate-800 mb-3'>More jobs at {job.company}</h2>
            <ul className='divide-y divide-slate-100 border-y border-slate-100'>
              {more.map((m) => <li key={m.slug}><Link to={`/jobs/${m.slug}`} className='flex justify-between gap-3 py-3 text-sm hover:text-brand-700'><span>{m.title}</span><span className='text-slate-400'>{m.location}</span></Link></li>)}
            </ul>
          </section>
        )}
      </article>
      <Footer />
    </div>
  )
}

export default JobDetail
