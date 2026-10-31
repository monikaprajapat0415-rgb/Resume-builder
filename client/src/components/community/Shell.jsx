import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../home/NavBar'
import Footer from '../home/Footer'

const TABS = [
  { to: '/jobs', label: 'Browse jobs', id: 'jobs' },
  { to: '/jobs/interview-questions', label: 'Interview questions', id: 'questions' },
  { to: '/jobs/salaries', label: 'Salaries', id: 'salaries' },
  { to: '/jobs/company-reviews', label: 'Company reviews', id: 'reviews' },
]

// Page frame for the jobs community pages: header, section tabs, own breadcrumb trail, footer.
export const Shell = ({ active, crumbs = [], children }) => (
  <div>
    <NavBar />
    <section className='max-w-page xl:px-10 mx-auto px-4 py-8'>
      <nav aria-label='Section' className='flex flex-wrap gap-2 mb-6'>
        {TABS.map((t) => (
          <Link key={t.id} to={t.to} aria-current={active === t.id ? 'page' : undefined}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${active === t.id ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'}`}>{t.label}</Link>
        ))}
      </nav>
      {crumbs.length > 0 && (
        <nav aria-label='Breadcrumb' className='text-sm text-slate-500 mb-5'>
          {crumbs.map((c, i) => (
            <span key={i}>{c.to ? <Link to={c.to} className='hover:text-brand-600'>{c.name}</Link> : <span className='text-slate-700'>{c.name}</span>}{i < crumbs.length - 1 && <span className='mx-1.5 text-slate-300'>›</span>}</span>
          ))}
        </nav>
      )}
      {children}
    </section>
    <Footer />
  </div>
)

export const NotFound = ({ what, back, backLabel }) => (
  <div className='text-center py-16 max-w-xl mx-auto'>
    <h1 className='text-2xl font-semibold text-slate-800'>{what} not found</h1>
    <p className='text-slate-500 mt-2'>It may have been moved, or it is waiting for enough reports to be published.</p>
    <Link to={back} className='inline-block mt-5 text-brand-600 hover:underline'>{backLabel}</Link>
  </div>
)

export const Stars = ({ value, size = 'text-base' }) => (
  <span className={`text-amber-500 ${size}`} role='img' aria-label={`${value} out of 5`}>
    {'★'.repeat(Math.round(value))}<span className='text-slate-300'>{'★'.repeat(5 - Math.round(value))}</span>
  </span>
)

export const input = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300 focus:border-brand-400 bg-white'
export const button = 'px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-full text-sm font-medium transition'
