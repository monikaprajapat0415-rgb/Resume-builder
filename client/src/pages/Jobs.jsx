import React, { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { dropServerJsonLd } from '../utils/seoDom'
import { timeAgo } from '../utils/jobText'
import { CATEGORIES, catShort } from '../utils/workTaxonomy'
import { LuSearch, LuMapPin, LuBriefcase, LuWifi, LuArrowRight, LuUserCheck, LuBuilding2 } from 'react-icons/lu'

const DESC = 'Jobs for office, factory and skilled workers in India, the UK, Canada and Africa. Find office jobs, factory work, trade jobs and daily wage work, and apply directly.'

const COUNTRY_SLUG = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const KIND_SLUG = { corporate: 'office-jobs', factory: 'factory-jobs', skilled_trade: 'skilled-trade-jobs', daily_wage: 'daily-wage-jobs' }

// landing: true on /jobs/in/<country>[/<kind>] - the same list, fixed to one country (and kind of work), with its own heading and copy
const Jobs = ({ landing = false }) => {
  const route = useParams()
  const [page_, setPage_] = useState(null)   // landing copy + SEO from the server
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || '', location = params.get('location') || '', company = params.get('company') || ''
  const KIND_ID = { 'office-jobs': 'corporate', 'factory-jobs': 'factory', 'skilled-trade-jobs': 'skilled_trade', 'daily-wage-jobs': 'daily_wage' }
  const category = landing ? (KIND_ID[route.kind] || '') : params.get('category') || '', country = landing ? (page_?.code || '') : params.get('country') || ''
  const type = params.get('type') || '', remote = params.get('remote') === '1', page = Math.max(1, parseInt(params.get('page')) || 1)
  const [form, setForm] = useState({ q, location })
  const [data, setData] = useState({ jobs: [], total: 0, pages: 1 })
  const [facets, setFacets] = useState({ companies: [], types: [], countries: [], categories: {}, total: 0 })
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!landing) return
    setPage_(null)
    api.get(`/api/jobs/landing/${route.country}${route.kind ? `/${route.kind}` : ''}`).then(({ data }) => setPage_(data)).catch(() => setPage_({ missing: true }))
  }, [landing, route.country, route.kind])
  useEffect(() => { api.get('/api/jobs/facets').then(({ data }) => setFacets(data)).catch(() => {}) }, [])
  useEffect(() => { setForm({ q, location }) }, [q, location])

  useEffect(() => {
    if (landing && !page_?.code) return
    let live = true
    setLoading(true); setFailed(false)
    api.get('/api/jobs', { params: { q, location, company, type, remote: remote ? 1 : undefined, category, country, page } })
      .then(({ data }) => { if (live) setData(data) })
      .catch(() => { if (live) setFailed(true) })
      .finally(() => { if (live) { setLoading(false); dropServerJsonLd() } })
    return () => { live = false }
  }, [q, location, company, type, remote, category, country, page, landing, page_?.code])

  const update = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => { if (v) next.set(k, v); else next.delete(k) })
    if (!('page' in patch)) next.delete('page')
    setParams(next)
  }
  const submit = (e) => { e.preventDefault(); update({ q: form.q.trim(), location: form.location.trim() }) }
  const filtered = q || location || company || type || remote || (!landing && (category || country))

  return (
    <div>
      {landing && page_?.seo ? <SEO title={page_.seo.title.replace(/ \| Prime Resume AI$/, '')} description={page_.seo.description} canonical={page_.seo.canonical} robots={filtered || page > 1 ? 'noindex, follow' : page_.seo.robots} structuredData={page_.seo.jsonLd} path={page_.content?.path} /> : landing ? <SEO title='Jobs' noindex /> :
      <SEO title='Jobs for office, factory and skilled workers' description={DESC} keywords='jobs in India, factory jobs, daily wage jobs, electrician jobs, jobs UK, jobs Canada, jobs Nigeria, jobs Kenya, remote jobs' path='/jobs'
        robots={filtered || page > 1 || category || country ? 'noindex, follow' : undefined} canonical='https://primeresumeai.com/jobs' />}
      <NavBar />
      <section className='max-w-5xl mx-auto px-4 py-12'>
        <nav aria-label='Breadcrumb' className='text-xs text-slate-400 mb-6'><Link to='/' className='hover:text-slate-600'>Home</Link> › {landing && page_?.content ? <><Link to='/jobs' className='hover:text-slate-600'>Jobs</Link> › <span>{page_.content.h1}</span></> : <span>Jobs</span>}</nav>
        <div className='text-center max-w-2xl mx-auto mb-8'>
          <h1 className='text-3xl sm:text-4xl font-semibold text-slate-800'>{landing ? (page_?.content?.h1 || 'Jobs') : 'Jobs for office, factory and skilled workers'}</h1>
          {landing ? <p className='text-slate-500 mt-3'>{page_?.content?.intro}</p> : <p className='text-slate-500 mt-3'>{facets.total ? `${facets.total.toLocaleString()} open jobs. ` : ''}Office jobs, factory work, skilled trades and daily wage work in India, the UK, Canada and Africa. Never pay anyone to get a job.</p>}
        </div>

        <div className='flex gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1' role='group' aria-label='Kind of work'>
          {[{ id: '', label: 'All jobs', icon: '' }, ...CATEGORIES].map((c) => {
            const on = category === c.id, n = landing ? 0 : c.id ? facets.categories?.[c.id] : facets.total
            return landing ? <Link key={c.id} to={`/jobs/in/${route.country}${c.id ? `/${KIND_SLUG[c.id]}` : ''}`} aria-current={on ? 'page' : undefined} className={`shrink-0 px-4 py-2 text-sm rounded-full border transition ${on ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{c.icon ? `${c.icon} ` : ''}{c.label}</Link> : <button key={c.id} type='button' aria-pressed={on} onClick={() => update({ category: c.id })} className={`shrink-0 px-4 py-2 text-sm rounded-full border transition ${on ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{c.icon ? `${c.icon} ` : ''}{c.label}{n ? <span className={`ml-1.5 text-xs ${on ? 'text-slate-300' : 'text-slate-400'}`}>{n.toLocaleString()}</span> : null}</button>
          })}
        </div>
        <form onSubmit={submit} className='grid sm:grid-cols-[1fr_1fr_auto] gap-3 mb-4'>
          <label className='relative'><span className='sr-only'>Job title, skill or company</span>
            <LuSearch className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400' />
            <input value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} placeholder='Job title, skill or company' className='w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-200' />
          </label>
          <label className='relative'><span className='sr-only'>Location</span>
            <LuMapPin className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400' />
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder='City or area, e.g. Pune, Leeds, Lagos' className='w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-200' />
          </label>
          <button type='submit' className='px-7 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>Search</button>
        </form>

        <div className='flex flex-wrap items-center gap-3 mb-6 text-sm'>
          <button type='button' onClick={() => update({ remote: remote ? '' : '1' })} aria-pressed={remote} className={`px-4 py-1.5 rounded-full border transition ${remote ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>Remote</button>
          {!landing && facets.countries.length > 0 && (
            <select value={country} onChange={(e) => update({ country: e.target.value })} aria-label='Country' className='px-3 py-1.5 border border-slate-200 rounded-full bg-white text-slate-600'>
              <option value=''>All countries</option>{facets.countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          )}
          <select value={company} onChange={(e) => update({ company: e.target.value })} aria-label='Company' className='px-3 py-1.5 border border-slate-200 rounded-full bg-white text-slate-600'>
            <option value=''>All companies</option>{facets.companies.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {facets.types.length > 0 && (
            <select value={type} onChange={(e) => update({ type: e.target.value })} aria-label='Job type' className='px-3 py-1.5 border border-slate-200 rounded-full bg-white text-slate-600'>
              <option value=''>Any type</option>{facets.types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
          {filtered && <button type='button' onClick={() => setParams({})} className='text-brand-700 hover:underline'>Clear filters</button>}
        </div>

        <div className='grid sm:grid-cols-2 gap-3 mb-6'>
          <Link to='/app/open-to-work' className='group flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/60 px-4 py-3 hover:bg-brand-50 transition'>
            <LuUserCheck className='size-6 text-brand-600 shrink-0' />
            <span className='text-sm'><strong className='block text-slate-800'>Looking for work?</strong><span className='text-slate-600'>Tell employers you are available. Your phone and name stay private.</span></span>
            <LuArrowRight className='size-4 ml-auto text-brand-600 group-hover:translate-x-1 transition shrink-0' />
          </Link>
          <Link to='/hire' className='group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 transition'>
            <LuBuilding2 className='size-6 text-slate-500 shrink-0' />
            <span className='text-sm'><strong className='block text-slate-800'>Hiring?</strong><span className='text-slate-600'>Post a job and contact available workers.</span></span>
            <LuArrowRight className='size-4 ml-auto text-slate-400 group-hover:translate-x-1 transition shrink-0' />
          </Link>
        </div>

        {loading ? <p className='text-center text-slate-400 py-10'>Loading jobs…</p>
          : failed ? <p className='text-center text-slate-500 py-10'>Could not load jobs. Please refresh the page.</p>
          : data.jobs.length === 0 ? <p className='text-center text-slate-400 py-10'>{filtered ? 'No jobs match your search. Try fewer filters.' : 'No jobs yet. Check back soon.'}</p>
          : (
            <>
              <p className='text-sm text-slate-400 mb-3'>{data.total.toLocaleString()} job{data.total === 1 ? '' : 's'}</p>
              <ul className='grid gap-3'>
                {data.jobs.map((j) => (
                  <li key={j.slug}>
                    <Link to={`/jobs/${j.slug}`} className='group flex gap-4 items-start rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md hover:border-brand-200 transition'>
                      <span aria-hidden='true' className='size-11 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0'>{j.company.slice(0, 2).toUpperCase()}</span>
                      <div className='min-w-0 flex-1'>
                        <h2 className='text-lg font-semibold text-slate-800 group-hover:text-brand-600 transition'>{j.title}{j.direct && <span className='ml-2 align-middle px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[11px] font-medium'>Direct from employer</span>}</h2>
                        <p className='text-sm text-slate-600 mt-0.5'>{j.company}</p>
                        <p className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2'>
                          {j.location && <span className='inline-flex items-center gap-1'><LuMapPin className='size-3.5' />{j.location}</span>}
                          {j.remote && !/^remote$/i.test(j.location || '') && <span className='inline-flex items-center gap-1'><LuWifi className='size-3.5' />Remote</span>}
                          {j.employmentType && <span className='inline-flex items-center gap-1'><LuBriefcase className='size-3.5' />{j.employmentType}</span>}
                          {j.category && j.category !== 'corporate' && <span className='px-2 py-0.5 rounded-full bg-slate-100 text-slate-600'>{catShort(j.category)}</span>}
                          {j.salary && <span className='font-medium text-slate-600'>{j.salary}</span>}
                          {j.openings > 1 && <span>{j.openings} openings</span>}
                          <span>{timeAgo(j.postedAt)}</span>
                        </p>
                        {j.perks?.length > 0 && <p className='text-xs text-green-700 mt-1.5'>{j.perks.slice(0, 4).join(' · ')}</p>}
                        {j.snippet && <p className='text-sm text-slate-500 mt-2 line-clamp-2'>{j.snippet}</p>}
                      </div>
                      <LuArrowRight className='size-5 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition shrink-0 self-center' />
                    </Link>
                  </li>
                ))}
              </ul>
              {data.pages > 1 && (
                <nav aria-label='Pages' className='flex items-center justify-between mt-6 text-sm text-slate-500'>
                  <button disabled={page <= 1} onClick={() => update({ page: String(page - 1) })} className='px-4 py-2 rounded-full border border-slate-200 disabled:opacity-40 hover:bg-slate-50'>← Previous</button>
                  <span>Page {page} of {data.pages}</span>
                  <button disabled={page >= data.pages} onClick={() => update({ page: String(page + 1) })} className='px-4 py-2 rounded-full border border-slate-200 disabled:opacity-40 hover:bg-slate-50'>Next →</button>
                </nav>
              )}
            </>
          )}
        {landing && page_?.content && (
          <div className='mt-12 grid md:grid-cols-2 gap-8'>
            <section aria-labelledby='tips-h'>
              <h2 id='tips-h' className='text-xl font-semibold text-slate-800'>Before you apply</h2>
              <ul className='mt-3 space-y-2 list-disc pl-5 text-[15px] text-slate-600'>{page_.content.tips.map((t) => <li key={t}>{t}</li>)}</ul>
            </section>
            <section aria-labelledby='more-h'>
              <h2 id='more-h' className='text-xl font-semibold text-slate-800'>More jobs</h2>
              <ul className='mt-3 space-y-2 text-[15px]'>{page_.content.links.map((l) => <li key={l.path}><Link to={l.path} className='text-brand-700 hover:underline'>{l.name}</Link></li>)}</ul>
            </section>
            <section className='md:col-span-2' aria-labelledby='faq-h'>
              <h2 id='faq-h' className='text-xl font-semibold text-slate-800'>Questions</h2>
              <div className='mt-2 divide-y divide-slate-100'>{page_.content.faqs.map((f) => <details key={f.q} className='py-3 group'><summary className='cursor-pointer font-medium text-slate-800'>{f.q}</summary><p className='text-sm text-slate-600 mt-2'>{f.a}</p></details>)}</div>
            </section>
          </div>
        )}
        {!landing && facets.countries.length > 0 && (
          <nav className='mt-12' aria-label='Browse jobs by country'>
            <h2 className='text-xl font-semibold text-slate-800'>Browse jobs by country</h2>
            <ul className='mt-3 grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-[15px]'>
              {facets.countries.map((c) => <li key={c.code}><Link to={`/jobs/in/${COUNTRY_SLUG(c.name)}`} className='text-brand-700 hover:underline'>Jobs in {c.name}</Link></li>)}
            </ul>
          </nav>
        )}
      </section>
      <Footer />
    </div>
  )
}

export default Jobs
