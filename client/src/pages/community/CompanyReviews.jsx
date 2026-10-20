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
    <Shell active='reviews' crumbs={[{ name: 'Home', to: '/' }, { name: 'Jobs', to: '/jobs' }, { name: 'Company reviews' }]}>
      {state === 'ok' && <SEO title={data.seo.title} description={data.seo.description} keywords={data.seo.keywords} path='/jobs/company-reviews' canonical={data.seo.canonical} robots={data.seo.robots} structuredData={data.jsonLd} />}
      <h1 className='text-3xl font-semibold text-slate-800'>Company reviews</h1>
      <p className='text-slate-500 mt-3 max-w-2xl'>What it is really like to work at, or interview with, an employer. Reviews come from job seekers and employees, and each one is read before it is published. They are personal opinions.</p>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search a company' aria-label='Search companies' className={`${input} mt-6`} />
      {state === 'loading' && <p className='text-slate-400 mt-8'>Loading…</p>}
      {state === 'error' && <p className='text-slate-500 mt-8'>Could not load reviews. Please refresh the page.</p>}
      {state === 'ok' && (list.length === 0
        ? <p className='text-slate-500 mt-8 text-sm'>{data.companies.length ? 'No company matches that search.' : 'No reviews have been published yet. Be the first to review an employer below.'}</p>
        : (
          <ul className='mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white'>
            {list.map((c) => (
              <li key={c.slug}>
                <Link to={`/jobs/company-reviews/${c.slug}`} className='flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50'>
                  <span className='text-slate-800'>{c.company}</span>
                  <span className='flex items-center gap-2 text-xs text-slate-400'><Stars value={c.avg} />{c.avg.toFixed(1)} · {c.count} review{c.count > 1 ? 's' : ''}</span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      <section className='mt-12 rounded-xl border border-slate-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-slate-800 mb-3'>Review a company</h2>
        <ReviewForm />
      </section>
    </Shell>
  )
}
export default CompanyReviews
