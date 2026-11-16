import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

// Shown for any address that is not a real page. noindex keeps these out of search results
// (the server still sends 200 for the app shell, so the page itself must say it is not found).
const NotFound = () => (
  <main className='mx-auto max-w-2xl px-4 py-20 text-center'>
    <SEO title='Page not found' description='This page does not exist or has moved.' noindex />
    <h1 className='text-3xl font-bold text-slate-900'>Page not found</h1>
    <p className='mt-3 text-slate-600'>We could not find this page. It may have moved, or the link may be wrong.</p>
    <ul className='mt-8 flex flex-wrap justify-center gap-3 text-sm'>
      <li><Link className='rounded-lg border border-slate-200 px-4 py-2 hover:border-slate-400' to='/'>Home</Link></li>
      <li><Link className='rounded-lg border border-slate-200 px-4 py-2 hover:border-slate-400' to='/templates'>Resume templates</Link></li>
      <li><Link className='rounded-lg border border-slate-200 px-4 py-2 hover:border-slate-400' to='/learn'>Free courses</Link></li>
      <li><Link className='rounded-lg border border-slate-200 px-4 py-2 hover:border-slate-400' to='/jobs'>Jobs</Link></li>
      <li><Link className='rounded-lg border border-slate-200 px-4 py-2 hover:border-slate-400' to='/blog'>Blog</Link></li>
    </ul>
  </main>
)

export default NotFound
