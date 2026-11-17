import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import { Shell, input } from '../../components/community/Shell'
import { SalaryForm } from '../../components/community/Forms'
import { useCommunity } from './useCommunity'

const Salaries = () => {
  const { state, data } = useCommunity('/api/community/salaries')
  const [q, setQ] = useState('')
  const roles = useMemo(() => (data?.roles || []).filter((r) => !q || r.title.toLowerCase().includes(q.toLowerCase())), [data, q])
  return (
    <Shell active='salaries' inset crumbs={[{ name: 'Home', to: '/' }, { name: 'Jobs', to: '/jobs' }, { name: 'Salaries' }]}>
      {state === 'ok' && <SEO title={data.seo.title} description={data.seo.description} keywords={data.seo.keywords} path='/jobs/salaries' canonical={data.seo.canonical} robots={data.seo.robots} structuredData={data.jsonLd} />}
      <h1 className='text-3xl sm:text-4xl font-semibold tracking-tight text-slate-800'>Salaries by job role</h1>
      <p className='text-slate-500 mt-3 max-w-2xl'>Pay shared by people who do the job. Figures are self-reported and checked before they appear. We never mix currencies, and a range is shown only once at least 3 reports agree, so you are not misled by a single number.</p>

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search a job title, e.g. driver, accountant, developer' aria-label='Search job titles' className={`${input} mt-6`} />
      {state === 'loading' && <p className='text-slate-400 mt-8'>Loading…</p>}
      {state === 'error' && <p className='text-slate-500 mt-8'>Could not load salaries. Please refresh the page.</p>}
      {state === 'ok' && (roles.length === 0
        ? <p className='text-slate-500 mt-8 text-sm'>{data.roles.length ? 'No role matches that search.' : 'No salaries have been published yet. Be the first to share yours below.'}</p>
        : (
          <>
          <p className='mt-6 text-sm text-slate-400'>{roles.length} job role{roles.length === 1 ? '' : 's'}</p>
          <ul className='mt-3 grid lg:grid-cols-2 gap-4'>
            {roles.map((r) => (
              <li key={r.slug} className='rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm'>
                <Link to={`/jobs/salaries/${r.slug}`} className='group flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none transition-colors'>
                  <span className='min-w-0 text-[15px] text-slate-800 group-hover:text-brand-700'>{r.title}</span>
                  <span className='flex shrink-0 items-center gap-2 text-xs text-slate-400'>{r.count} report{r.count > 1 ? 's' : ''}{r.ready ? '' : ' · collecting'}<svg className='h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-600 transition' viewBox='0 0 20 20' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M7 4l6 6-6 6' /></svg></span>
                </Link>
              </li>
            ))}
          </ul>
          </>
        ))}

      <section className='mt-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <h2 className='text-lg font-semibold text-slate-800 mb-3'>Share your salary</h2>
        <SalaryForm />
      </section>
    </Shell>
  )
}
export default Salaries
