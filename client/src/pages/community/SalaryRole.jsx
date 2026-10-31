import React from 'react'
import { useParams } from 'react-router-dom'
import SEO from '../../components/SEO'
import { Shell, NotFound } from '../../components/community/Shell'
import { SalaryForm, ReportButton } from '../../components/community/Forms'
import { useCommunity, timeAgo } from './useCommunity'

const money = (n, c) => { try { return new Intl.NumberFormat('en', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(n) } catch { return `${c} ${Math.round(n)}` } }
const PER = { hour: 'per hour', day: 'per day', month: 'per month', year: 'per year' }

const SalaryRole = () => {
  const { slug } = useParams()
  const { state, data, reload } = useCommunity(`/api/community/salaries/${slug}`)
  if (state === 'loading') return <Shell active='salaries'><p className='text-slate-400 py-16 text-center'>Loading…</p></Shell>
  if (state !== 'ok') return <Shell active='salaries'><SEO title='Salary page not found' description='No salary reports for this role yet.' noindex /><NotFound what='Salary page' back='/jobs/salaries' backLabel='See all salaries' /></Shell>
  const { title, groups, recent, seo } = data
  return (
    <Shell active='salaries' crumbs={[{ name: 'Home', to: '/' }, { name: 'Jobs', to: '/jobs' }, { name: 'Salaries', to: '/jobs/salaries' }, { name: `${title} salary` }]}>
      <SEO title={seo.title} description={seo.description} keywords={seo.keywords} path={`/jobs/salaries/${slug}`} canonical={seo.canonical} robots={seo.robots} structuredData={data.jsonLd} />
      <h1 className='text-3xl font-semibold text-slate-800'>{title} salary</h1>
      <p className='text-slate-500 mt-3 max-w-2xl'>Reported by people who do this job. A range needs at least 3 reports in the same country, currency and pay period.</p>

      <div className='mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {groups.map((g) => (
          <div key={g.country} className='rounded-xl border border-slate-200 bg-white p-5'>
            <h2 className='font-semibold text-slate-800'>{g.country}</h2>
            {g.enough ? (
              <>
                <p className='text-2xl font-semibold text-brand-700 mt-2'>{money(g.median, g.currency)} <span className='text-sm font-normal text-slate-400'>median {PER[g.period]}</span></p>
                <p className='text-sm text-slate-500 mt-1'>Range {money(g.min, g.currency)} to {money(g.max, g.currency)} · {g.count} reports</p>
              </>
            ) : <p className='text-sm text-slate-500 mt-2'>{g.totalReports} report{g.totalReports > 1 ? 's' : ''} so far. We show a range once 3 reports agree on currency and pay period.</p>}
          </div>
        ))}
      </div>

      <h2 className='text-lg font-semibold text-slate-800 mt-10 mb-3'>Recent reports</h2>
      <ul className='divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white text-sm'>
        {recent.map((r) => (
          <li key={r._id} className='flex flex-wrap items-center justify-between gap-2 px-4 py-3'>
            <span className='text-slate-700'>{money(r.amount, r.currency)} {PER[r.period]} · {r.country}{r.city ? `, ${r.city}` : ''}{r.company ? ` · ${r.company}` : ''}</span>
            <span className='flex items-center gap-3 text-xs text-slate-400'>{r.level}{r.experienceYears ? `, ${r.experienceYears} yrs` : ''} · {timeAgo(r.createdAt)}<ReportButton type='salaries' id={r._id} /></span>
          </li>
        ))}
      </ul>
      <p className='text-xs text-slate-400 mt-3'>Self-reported and reviewed before publishing. Actual pay depends on employer, city, shifts and experience.</p>

      <section className='mt-10 max-w-3xl rounded-xl border border-slate-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-slate-800 mb-3'>Share your {title} salary</h2>
        <SalaryForm role={title} onDone={reload} />
      </section>
    </Shell>
  )
}
export default SalaryRole
