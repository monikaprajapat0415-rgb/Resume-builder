import React from 'react'
import { useParams } from 'react-router-dom'
import SEO from '../../components/SEO'
import { Shell, NotFound, Stars } from '../../components/community/Shell'
import { ReviewForm, ReportButton } from '../../components/community/Forms'
import { useCommunity, timeAgo } from './useCommunity'

const WHO = { current: 'Current employee', former: 'Former employee', candidate: 'Interviewed / applied' }

const CompanyView = () => {
  const { slug } = useParams()
  const { state, data, reload } = useCommunity(`/api/community/companies/${slug}`)
  if (state === 'loading') return <Shell active='reviews'><p className='text-slate-400 py-16 text-center'>Loading…</p></Shell>
  if (state !== 'ok') return <Shell active='reviews'><SEO title='Company not found' description='No reviews for this company yet.' noindex /><NotFound what='Company' back='/jobs/company-reviews' backLabel='See all company reviews' /></Shell>
  const { company, avg, count, reviews, seo } = data
  return (
    <Shell active='reviews' crumbs={[{ name: 'Home', to: '/' }, { name: 'Jobs', to: '/jobs' }, { name: 'Company reviews', to: '/jobs/company-reviews' }, { name: company }]}>
      <SEO title={seo.title} description={seo.description} keywords={seo.keywords} path={`/jobs/company-reviews/${slug}`} canonical={seo.canonical} robots={seo.robots} structuredData={data.jsonLd} />
      <h1 className='text-3xl font-semibold text-slate-800'>{company} reviews</h1>
      <p className='mt-3 flex items-center gap-3 text-slate-600'><Stars value={avg} size='text-xl' /> <span><strong>{avg.toFixed(1)}</strong> out of 5 from {count} review{count > 1 ? 's' : ''}</span></p>
      <div className='mt-6 space-y-4'>
        {reviews.map((r) => (
          <article key={r._id} className='rounded-xl border border-slate-200 bg-white p-5'>
            <div className='flex items-center justify-between gap-3'><Stars value={r.rating} /><span className='text-xs text-slate-400'>{timeAgo(r.createdAt)}</span></div>
            <h2 className='font-semibold text-slate-800 mt-1'>{r.title}</h2>
            <p className='text-xs text-slate-400'>{r.displayName} · {WHO[r.employment]}{r.jobTitle ? ` · ${r.jobTitle}` : ''}</p>
            {r.pros && <p className='mt-3 text-sm text-slate-700'><strong className='text-green-700'>Good: </strong>{r.pros}</p>}
            {r.cons && <p className='mt-2 text-sm text-slate-700'><strong className='text-red-700'>Could be better: </strong>{r.cons}</p>}
            <div className='mt-3 text-right'><ReportButton type='reviews' id={r._id} /></div>
          </article>
        ))}
      </div>
      <p className='text-xs text-slate-400 mt-3'>Reviews are personal opinions of the people who wrote them and are read before publishing.</p>
      <section className='mt-10 rounded-xl border border-slate-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-slate-800 mb-3'>Review {company}</h2>
        <ReviewForm company={company} onDone={reload} />
      </section>
    </Shell>
  )
}
export default CompanyView
