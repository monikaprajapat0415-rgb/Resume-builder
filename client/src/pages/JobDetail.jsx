import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { dropServerJsonLd } from '../utils/seoDom'
import { JobDescription, timeAgo } from '../utils/jobText'
import { LuMapPin, LuBriefcase, LuWifi, LuExternalLink, LuFileCheck } from 'react-icons/lu'

const SITE = 'https://primeresumeai.com'
const TYPE_LD = { 'full-time': 'FULL_TIME', 'part-time': 'PART_TIME', contract: 'CONTRACTOR', internship: 'INTERN', temporary: 'TEMPORARY' }

const JobDetail = () => {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [state, setState] = useState('loading')

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

  const { job, more, sourceName } = data
  const where = job.location ? ` in ${job.location}` : ''
  const ld = {
    '@context': 'https://schema.org', '@type': 'JobPosting', title: job.title,
    description: `<p>${(job.description || job.title).replace(/&/g, '&amp;').replace(/</g, '&lt;').split(/\n{2,}/).join('</p><p>').replace(/\n/g, '<br>')}</p>`,
    datePosted: new Date(job.postedAt).toISOString().slice(0, 10), hiringOrganization: { '@type': 'Organization', name: job.company },
    url: `${SITE}/jobs/${job.slug}`, directApply: false,
    ...(TYPE_LD[String(job.employmentType || '').toLowerCase()] ? { employmentType: TYPE_LD[String(job.employmentType).toLowerCase()] } : {}),
    ...(job.location ? { jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location, ...(job.country ? { addressCountry: job.country } : {}) } } } : {}),
    ...(job.remote ? { jobLocationType: 'TELECOMMUTE', ...(job.country ? { applicantLocationRequirements: { '@type': 'Country', name: job.country } } : {}) } : {}),
  }

  return (
    <div>
      <SEO title={`${job.title} at ${job.company}${where}`} description={`${job.title} at ${job.company}${where}. ${job.snippet}`.slice(0, 160)} path={`/jobs/${job.slug}`} structuredData={ld} />
      <NavBar />
      <article className='max-w-3xl mx-auto px-4 py-10'>
        <nav aria-label='Breadcrumb' className='text-xs text-slate-400 mb-5'>
          <Link to='/' className='hover:text-slate-600'>Home</Link> › <Link to='/jobs' className='hover:text-slate-600'>Jobs</Link> › <span>{job.title}</span>
        </nav>
        <h1 className='text-3xl font-bold text-slate-800 leading-tight'>{job.title}</h1>
        <p className='text-lg text-slate-600 mt-1'>{job.company}</p>
        <p className='flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500 mt-3'>
          {job.location && <span className='inline-flex items-center gap-1.5'><LuMapPin className='size-4' />{job.location}</span>}
          {job.remote && <span className='inline-flex items-center gap-1.5'><LuWifi className='size-4' />Remote</span>}
          {job.employmentType && <span className='inline-flex items-center gap-1.5'><LuBriefcase className='size-4' />{job.employmentType}</span>}
          {job.salary && <span>{job.salary}</span>}
          <span>Posted {timeAgo(job.postedAt)}</span>
        </p>

        <div className='flex flex-wrap gap-3 mt-6'>
          <a href={job.applyUrl} target='_blank' rel='nofollow noopener noreferrer' className='inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>
            Apply on {job.company} <LuExternalLink className='size-4' />
          </a>
          <Link to='/features/ats-checker' className='inline-flex items-center gap-2 px-6 py-2.5 border border-brand-600 text-brand-700 hover:bg-brand-50 rounded-full text-sm font-medium transition'>
            <LuFileCheck className='size-4' /> Check my resume first
          </Link>
        </div>

        <div className='mt-8 text-slate-700 text-[15px] leading-relaxed space-y-4'><JobDescription text={job.description} /></div>

        <div className='mt-8 rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-500'>
          You will apply on the employer's own website. Listing source: {sourceName || 'company career page'}
          {sourceName === 'Adzuna' && <> · Jobs by <a href='https://www.adzuna.com' target='_blank' rel='nofollow noopener noreferrer' className='text-brand-700 hover:underline'>Adzuna</a></>}
          {sourceName === 'Arbeitnow' && <> · via <a href='https://www.arbeitnow.com' target='_blank' rel='nofollow noopener noreferrer' className='text-brand-700 hover:underline'>Arbeitnow</a></>}.
          Never pay money to apply for a job.
        </div>

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
