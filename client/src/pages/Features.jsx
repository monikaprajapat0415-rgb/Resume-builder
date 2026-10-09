import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import { LuScanSearch, LuSparkles, LuLayoutTemplate, LuUpload, LuMailPlus, LuTarget, LuShare2, LuArrowRight } from 'react-icons/lu'

const FEATURES = [
  { icon: LuTarget, title: 'ATS match for a job', desc: 'Paste a job description inside the builder and see which keywords your resume is missing.', to: '/app', cta: 'Open the builder' },
  { icon: LuSparkles, title: 'AI writing help', desc: 'Let AI polish your professional summary and turn job duties into achievement-focused bullet points.', to: '/app', cta: 'Try it' },
  { icon: LuLayoutTemplate, title: 'ATS-friendly templates', desc: 'Clean, recruiter-tested layouts. Change colours and templates any time without losing your content.', to: '/templates', cta: 'Browse templates' },
  { icon: LuUpload, title: 'Import your old resume', desc: 'Upload a PDF and we fill the builder for you, so you edit instead of retyping.', to: '/app', cta: 'Import a resume' },
  { icon: LuMailPlus, title: 'AI cover letters', desc: 'Generate a cover letter tailored to the job and company from your resume details.', to: '/app', cta: 'Write one' },
  { icon: LuShare2, title: 'Download or share', desc: 'Download your resume or share a public link with recruiters in one click.', to: '/app', cta: 'Get started' },
]

const Features = () => (
  <>
    <SEO
      title='Features - AI Resume Builder, ATS Checker, Cover Letters'
      description='Everything in Prime Resume AI: a free ATS resume checker, AI writing help, ATS-friendly templates, resume import and AI cover letters.'
      path='/features'
    />
    <NavBar />
    <main>
      <section className='bg-gradient-to-b from-green-50/60 to-white'>
        <div className='max-w-3xl mx-auto px-4 pt-14 pb-10 text-center'>
          <h1 className='text-3xl md:text-5xl font-semibold text-slate-800 leading-tight'>Everything you need to get shortlisted</h1>
          <p className='text-slate-600 mt-4 max-w-xl mx-auto'>Build, check and improve your resume with AI, all in one place.</p>
        </div>
      </section>

      <section className='max-w-5xl mx-auto px-4 pb-6'>
        <Link to='/features/ats-checker' className='group block rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 text-white p-7 md:p-9 hover:shadow-lg transition'>
          <div className='flex flex-col md:flex-row md:items-center gap-5'>
            <div className='size-14 shrink-0 rounded-xl bg-white/15 flex items-center justify-center'><LuScanSearch className='size-7' /></div>
            <div className='flex-1'>
              <span className='text-[11px] font-semibold uppercase tracking-wide bg-white/20 rounded-full px-2.5 py-1'>5 free checks</span>
              <h2 className='text-2xl font-semibold mt-2'>ATS Resume Checker</h2>
              <p className='text-green-50 mt-1.5 max-w-2xl'>Drop your resume (PDF or Word) and get an ATS score with a full report: formatting, sections, keywords, and exactly what to fix.</p>
            </div>
            <span className='inline-flex items-center gap-2 bg-white text-green-700 rounded-full px-5 py-2.5 text-sm font-medium group-hover:gap-3 transition-all'>Check my resume <LuArrowRight className='size-4' /></span>
          </div>
        </Link>
      </section>

      <section className='max-w-5xl mx-auto px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {FEATURES.map(({ icon: Icon, title, desc, to, cta }) => (
          <div key={title} className='bg-white rounded-xl border border-slate-200 p-6 flex flex-col'>
            <div className='size-11 rounded-lg bg-green-50 flex items-center justify-center'><Icon className='size-5 text-green-600' /></div>
            <h3 className='font-semibold text-slate-800 mt-4'>{title}</h3>
            <p className='text-sm text-slate-600 mt-1.5 flex-1'>{desc}</p>
            <Link to={to} className='text-sm text-green-700 font-medium mt-4 inline-flex items-center gap-1.5 hover:gap-2.5 transition-all'>{cta} <LuArrowRight className='size-4' /></Link>
          </div>
        ))}
      </section>
    </main>
    <Footer />
  </>
)

export default Features
