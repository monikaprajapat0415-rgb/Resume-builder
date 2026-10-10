import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { dropServerJsonLd } from '../utils/seoDom'
import { timeAgo } from '../utils/jobText'
import { LuSearch, LuMapPin, LuBriefcase, LuWifi, LuArrowRight } from 'react-icons/lu'

const DESC = 'Browse open jobs collected from company career pages. Search by role, company, location or remote, then apply on the employer site.'

const Jobs = () => {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || '', location = params.get('location') || '', company = params.get('company') || ''
  const type = params.get('type') || '', remote = params.get('remote') === '1', page = Math.max(1, parseInt(params.get('page')) || 1)
  const [form, setForm] = useState({ q, location })
  const [data, setData] = useState({ jobs: [], total: 0, pages: 1 })
  const [facets, setFacets] = useState({ companies: [], types: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => { api.get('/api/jobs/facets').then(({ data }) => setFacets(data)).catch(() => {}) }, [])
  useEffect(() => { setForm({ q, location }) }, [q, location])

  useEffect(() => {
    let live = true
    setLoading(true); setFailed(false)
    api.get('/api/jobs', { params: { q, location, company, type, remote: remote ? 1 : undefined, page } })
      .then(({ data }) => { if (live) setData(data) })
      .catch(() => { if (live) setFailed(true) })
      .finally(() => { if (live) { setLoading(false); dropServerJsonLd() } })
    return () => { live = false }
  }, [q, location, company, type, remote, page])

  const update = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => { if (v) next.set(k, v); else next.delete(k) })
    if (!('page' in patch)) next.delete('page')
    setParams(next)
  }
  const submit = (e) => { e.preventDefault(); update({ q: form.q.trim(), location: form.location.trim() }) }
  const filtered = q || location || company || type || remote

  return (
    <div>
      <SEO title='Latest jobs from top companies' description={DESC} keywords='jobs, careers, job openings, remote jobs, software jobs India' path='/jobs'
        robots={filtered || page > 1 ? 'noindex, follow' : undefined} canonical='https://primeresumeai.com/jobs' />
      <NavBar />
      <section className='max-w-5xl mx-auto px-4 py-12'>
        <nav aria-label='Breadcrumb' className='text-xs text-slate-400 mb-6'><Link to='/' className='hover:text-slate-600'>Home</Link> › <span>Jobs</span></nav>
        <div className='text-center max-w-2xl mx-auto mb-8'>
          <h1 className='text-4xl font-semibold text-slate-800'>Latest jobs from top companies</h1>
          <p className='text-slate-500 mt-3'>{facets.total ? `${facets.total.toLocaleString()} open jobs from company career pages. ` : ''}Apply on each employer's own site, and tailor your resume first.</p>
        </div>

        <form onSubmit={submit} className='grid sm:grid-cols-[1fr_1fr_auto] gap-3 mb-4'>
          <label className='relative'><span className='sr-only'>Job title, skill or company</span>
            <LuSearch className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400' />
            <input value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} placeholder='Job title, skill or company' className='w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-200' />
          </label>
          <label className='relative'><span className='sr-only'>Location</span>
            <LuMapPin className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400' />
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder='City or country, e.g. Bengaluru' className='w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-200' />
          </label>
          <button type='submit' className='px-7 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>Search</button>
        </form>

        <div className='flex flex-wrap items-center gap-3 mb-6 text-sm'>
          <button type='button' onClick={() => update({ remote: remote ? '' : '1' })} aria-pressed={remote} className={`px-4 py-1.5 rounded-full border transition ${remote ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>Remote</button>
          <button type='button' onClick={() => update({ location: location === 'India' ? '' : 'India' })} aria-pressed={location === 'India'} className={`px-4 py-1.5 rounded-full border transition ${location === 'India' ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>India</button>
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
                        <h2 className='text-lg font-semibold text-slate-800 group-hover:text-brand-600 transition'>{j.title}</h2>
                        <p className='text-sm text-slate-600 mt-0.5'>{j.company}</p>
                        <p className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2'>
                          {j.location && <span className='inline-flex items-center gap-1'><LuMapPin className='size-3.5' />{j.location}</span>}
                          {j.remote && !/^remote$/i.test(j.location || '') && <span className='inline-flex items-center gap-1'><LuWifi className='size-3.5' />Remote</span>}
                          {j.employmentType && <span className='inline-flex items-center gap-1'><LuBriefcase className='size-3.5' />{j.employmentType}</span>}
                          {j.salary && <span>{j.salary}</span>}
                          <span>{timeAgo(j.postedAt)}</span>
                        </p>
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
      </section>
      <Footer />
    </div>
  )
}

export default Jobs
