import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../configs/api'
import NavBar from './NavBar'
import { useSiteContent } from '../../utils/siteContent'
import HeroDemo from './HeroDemo'

const QUICK = [
  { to: '/roadmaps', label: 'Roadmaps' },
  { to: '/jobs/interview-questions', label: 'Interview questions' },
  { to: '/jobs/salaries', label: 'Salaries' },
  { to: '/jobs/company-reviews', label: 'Company reviews' },
  { to: '/jobs', label: 'Browse jobs' },
]

const Hero = () => {
  const [userCount, setUserCount] = useState(null)
  const site = useSiteContent()

  // the real number of accounts, shown only once it is large enough to mean something
  useEffect(() => {
    let live = true
    api.get('/api/users/count').then((r) => { if (live && r?.data?.count != null) setUserCount(r.data.count) }).catch(() => {})
    return () => { live = false }
  }, [])

  return (
    <>
      <div className="pb-12 md:pb-20">
        <NavBar />
        <div className="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-black">
          <div className="float-slow absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-brand-300 blur-[100px] opacity-30"></div>
          <div className="float-slower absolute top-60 -z-10 right-1/4 size-60 sm:size-80 bg-emerald-200 blur-[110px] opacity-30"></div>

          <ul style={{ "--i": 0 }} className="rise flex flex-wrap items-center justify-center gap-2 mt-14 md:mt-20 text-xs sm:text-sm text-slate-700" aria-label="Highlights">
            {(site.hero_chips || '').split(',').map((t) => t.trim()).filter(Boolean).map((t) => (
              <li key={t} className="rounded-full border border-brand-200 bg-white/70 px-3.5 py-1">{t}</li>
            ))}
            {userCount != null && userCount >= 100 && <li className="rounded-full border border-brand-200 bg-white/70 px-3.5 py-1">{userCount.toLocaleString()} job seekers have signed up</li>}
          </ul>

          <h1 style={{ "--i": 1 }} className="rise text-4xl sm:text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-5 md:leading-[70px]">
            {site.hero_line1} <span className="shimmer-text bg-gradient-to-r from-brand-700 via-emerald-400 to-brand-700 bg-clip-text text-transparent sm:text-nowrap">{site.hero_highlight} </span> {site.hero_line2}
          </h1>

          <p style={{ "--i": 2 }} className="rise max-w-xl text-center text-base my-7 text-slate-700">{site.hero_subtext}</p>

          <div style={{ "--i": 3 }} className="rise flex flex-wrap items-center justify-center gap-3">
            <Link to="/app" className="btn-shine pulse-ring bg-brand-500 hover:bg-brand-600 text-white rounded-full px-9 h-12 ring-offset-2 ring-1 ring-brand-400 flex items-center gap-2 transition-colors">
              {site.hero_button}
              <svg className="nudge-x" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/features/ats-checker" className="rounded-full px-7 h-12 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 flex items-center transition">Check my resume (ATS)</Link>
          </div>

          <div style={{ "--i": 4 }} className="rise w-full"><HeroDemo /></div>

          <nav aria-label="Explore" className="mt-12 max-w-3xl">
            <p className="text-center text-xs uppercase tracking-wide text-slate-400 mb-3">More to help you get hired</p>
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {QUICK.map((q) => (
                <li key={q.to}><Link to={q.to} className="inline-block rounded-full bg-brand-50 hover:bg-brand-100 text-brand-800 px-4 py-1.5 transition">{q.label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          * { font-family: 'Poppins', sans-serif; }
        `}
      </style>
    </>
  )
}

export default Hero
