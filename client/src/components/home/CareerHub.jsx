import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Title from './Title'

const POPULAR = ['Full Stack Developer', 'Frontend Developer', 'SQL Developer', 'DevOps Engineer', 'Data Analyst', 'React']

const CARDS = [
  { to: '/roadmaps', title: 'Roadmaps', text: 'Step-by-step paths for roles and technologies, with the full stack from end to end and free places to learn.' },
  { to: '/jobs/interview-questions', title: 'Interview questions', text: 'Questions for freshers and experienced candidates, with model answers. Add your own answer after you sign in.' },
  { to: '/jobs/salaries', title: 'Salaries', text: 'Pay ranges shared by people in the role. A range is shown only once enough reports agree.' },
  { to: '/jobs/company-reviews', title: 'Company reviews', text: 'Read and write honest reviews of employers. Reviews are checked before they appear.' },
]

const CareerHub = () => {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const go = (e) => {
    e.preventDefault()
    const v = q.trim()
    nav(v ? `/roadmaps?q=${encodeURIComponent(v)}` : '/roadmaps')
  }
  return (
    <section id="career-hub" aria-labelledby="career-hub-h" className="py-14 px-4 bg-slate-50 scroll-mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          <Title title="Grow your career, not just your resume" desciption="Find what to learn next, prepare for interviews, and check pay and employers before you apply. All free to read." />
        </div>
        <h2 id="career-hub-h" className="sr-only">Career tools</h2>

        <form onSubmit={go} role="search" className="mt-8 mx-auto max-w-xl flex gap-2">
          <label htmlFor="home-rm-search" className="sr-only">Search roadmaps by role or technology</label>
          <input id="home-rm-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a role or technology, e.g. full stack, SQL"
            className="flex-1 min-w-0 rounded-full border border-slate-300 bg-white px-5 h-12 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
          <button type="submit" className="rounded-full bg-brand-500 hover:bg-brand-600 text-white px-6 h-12 text-sm transition">Search</button>
        </form>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {POPULAR.map((p) => (
            <li key={p}><Link to={`/roadmaps?q=${encodeURIComponent(p)}`} className="inline-block rounded-full border border-slate-200 bg-white hover:border-brand-300 text-slate-700 text-sm px-3.5 py-1 transition">{p}</Link></li>
          ))}
        </ul>

        <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.map((c) => (
            <li key={c.to}>
              <Link to={c.to} className="block h-full rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-300 hover:shadow-sm transition">
                <h3 className="font-medium text-slate-800">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{c.text}</p>
                <span className="mt-3 inline-block text-sm text-brand-600">Open &rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default CareerHub
