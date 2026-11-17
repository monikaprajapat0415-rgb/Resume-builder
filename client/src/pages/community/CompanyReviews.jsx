import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import { Shell, Stars, input } from '../../components/community/Shell'
import { ReviewForm } from '../../components/community/Forms'
import { useCommunity } from './useCommunity'

const CompanyReviews = () => {
  const { state, data } = useCommunity('/api/community/companies')
  const [q, setQ] = useState('')
  const list = useMemo(() => (data?.companies || []).filter((c) => !q || c.company.toLowerCase().includes(q.toLowerCase())), [data, q])
  return (
    <Shell active='reviews' inset crumbs={[{ name: 'Home', to: '/' }, { name: 'Jobs', to: '/jobs' }, { name: 'Company reviews' }]}>
      {state === 'ok' && <SEO title={data.seo.title} description={data.seo.description} keywords={data.seo.keywords} path='/jobs/company-reviews' canonical={data.seo.canonical} robots={data.seo.robots} structuredData={data.jsonLd} />}
      <h1 className='text-3xl sm:text-4xl font-semibold tracking-tight text-slate-800'>Company reviews</h1>
      <p className='text-slate-500 mt-3 max-w-2xl'>What it is really like to work at, or interview with, an employer. Reviews come from job seekers and employees, and each one is read before it is published. They are personal opinions.</p>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search a company' aria-label='Search companies' className={`${input} mt-6`} />
      {state === 'loading' && <p className='text-slate-400 mt-8'>Loading…</p>}
      {state === 'error' && <p className='text-slate-500 mt-8'>Could not load reviews. Please refresh the page.</p>}
      {state === 'ok' && (list.length === 0
        ? <p className='text-slate-500 mt-8 text-sm'>{data.companies.length ? 'No company matches that search.' : 'No reviews have been published yet. Be the first to review an employer below.'}</p>
        : (
          <>
          <p className='mt-6 text-sm text-slate-400'>{list.length} compan{list.length === 1 ? 'y' : 'ies'}</p>
          <ul className='mt-3 grid lg:grid-cols-2 gap-4'>
            {list.map((c) => (
              <li key={c.slug} className='rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm'>
                <Link to={`/jobs/company-reviews/${c.slug}`} className='group flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none transition-colors'>
                  <span className='min-w-0 text-[15px] text-slate-800 group-hover:text-brand-700'>{c.company}</span>
                  <span className='flex shrink-0 items-center gap-2 text-xs text-slate-400'><Stars value={c.avg} />{c.avg.toFixed(1)} · {c.count} review{c.count > 1 ? 's' : ''}<svg className='h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-600 transition' viewBox='0 0 20 20' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M7 4l6 6-6 6' /></svg></span>
                </Link>
              </li>
            ))}
          </ul>
          </>
        ))}
      <section className='mt-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <h2 className='text-lg font-semibold text-slate-800 mb-3'>Review a company</h2>
        <ReviewForm />
      </section>
    </Shell>
  )
}
export default CompanyReviews
