import React, { useState } from 'react'
import { trackEvent } from '../components/Analytics'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuArrowRight, LuClipboardList, LuFileCheck2, LuShieldCheck, LuSparkles, LuTarget, LuDownload } from 'react-icons/lu'
import { BiLoaderAlt } from 'react-icons/bi'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'

const FAQS = [
  ['What is the difference between a CV and a resume?', 'In India, the UK, Europe and many other regions the two words are used for the same document. In the US a resume is usually one page, while a CV can run longer and is common for academic roles. Prime Resume AI writes a clean, single-column, ATS-friendly document you can use for either.'],
  ['Will the AI make things up?', 'No. It only rewrites the details you enter. Employers, job titles, dates, degrees, certifications, languages and numbers are always kept exactly as you typed them, and anything the AI adds that you did not provide is removed automatically.'],
  ['Is the CV ATS-friendly?', 'Yes. The layout is one column with standard headings and real, selectable text. There are no tables, icons, photos or skill-rating bars that confuse applicant tracking systems. No tool can promise to pass every ATS, so the builder also lists tips and anything missing from your details.'],
  ['Can I build a CV as a fresher?', 'Yes. Choose "Fresher" and the CV leads with education, internships, projects and skills. Choose "Experienced" and your work history comes first.'],
  ['Is it free?', 'You can create an account and try the CV builder for free.'],
]

const structured = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'AI CV Builder - Prime Resume AI', url: 'https://primeresumeai.com/cv-builder', applicationCategory: 'BusinessApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, description: 'Create an ATS-friendly CV tailored to your target job with AI. Fresher and experienced formats, text-based PDF download.' },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
]

const STEPS = [
  [LuTarget, 'Tell us the job', 'Enter the role and paste the job description so your CV uses the right keywords.'],
  [LuClipboardList, 'Add your details', 'Education, experience, internships, projects and skills. Short notes are enough.'],
  [LuSparkles, 'AI writes your CV', 'A polished summary and achievement-focused bullets, using only your facts.'],
  [LuDownload, 'Review and download', 'Edit anything, pick a template and download a text-based PDF.'],
]

const CvLanding = () => {
  const { token, user, loading } = useSelector((s) => s.auth)
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  const start = async () => {
    if (!user) return navigate('/app?state=register&next=/cv-builder')
    setBusy(true)
    try {
      const { data } = await api.post('/api/cvs/create', { title: 'My CV' }, { headers: { Authorization: token } })
      trackEvent('resume_builder_started', { type: 'cv', source: 'landing' })
      navigate(`/app/cv/${data.cv._id}`)
    } catch (e) { toast.error(e.response?.data?.message || 'Could not start your CV. Please try again.') }
    setBusy(false)
  }

  return (
    <>
      <SEO
        title='Free AI CV Builder - Create an ATS-Friendly CV Online'
        description='Build a professional, ATS-friendly CV in minutes. Enter your details and the target job, and AI writes a tailored CV. Fresher and experienced formats, text-based PDF download.'
        keywords='CV builder, AI CV maker, ATS friendly CV, CV for freshers, create CV online, free CV builder'
        path='/cv-builder'
        structuredData={structured}
      />
      <NavBar />
      <main>
        <section className='bg-gradient-to-b from-brand-50/60 to-white'>
          <div className='max-w-3xl mx-auto px-4 pt-14 pb-12 text-center'>
            <span className='inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-100 rounded-full px-3 py-1'><LuShieldCheck className='size-3.5' />Only your facts, never invented ones</span>
            <h1 className='text-3xl md:text-5xl font-semibold text-slate-800 mt-4 leading-tight'>AI CV Builder</h1>
            <p className='text-slate-600 mt-4 max-w-xl mx-auto'>Tell us the job you want and your background. We write an ATS-friendly CV tailored to that job, ready to edit and download.</p>
            <button onClick={start} disabled={busy || loading} className='mt-7 inline-flex items-center gap-2 px-7 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-70 text-white rounded-full font-medium transition'>
              {busy ? <BiLoaderAlt className='size-4 animate-spin' /> : null}{user ? 'Create my CV' : 'Sign up free to start'}<LuArrowRight className='size-4' />
            </button>
            {!user && !loading && <p className='text-sm text-slate-500 mt-3'>Already have an account? <Link className='text-brand-700 underline' to='/app?state=login&next=/cv-builder'>Log in</Link></p>}
          </div>
        </section>

        <section className='max-w-5xl mx-auto px-4 py-10'>
          <h2 className='text-2xl font-semibold text-slate-800 text-center'>How it works</h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8'>
            {STEPS.map(([Icon, t, d], i) => (
              <div key={t} className='bg-white rounded-xl border border-slate-200 p-5'>
                <div className='size-10 rounded-lg bg-brand-50 flex items-center justify-center'><Icon className='size-5 text-brand-600' /></div>
                <p className='text-xs text-slate-400 mt-3'>Step {i + 1}</p>
                <h3 className='font-semibold text-slate-800'>{t}</h3>
                <p className='text-sm text-slate-600 mt-1'>{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className='max-w-3xl mx-auto px-4 py-6'>
          <div className='rounded-2xl border border-slate-200 bg-white p-6 md:p-8'>
            <h2 className='text-xl font-semibold text-slate-800 flex items-center gap-2'><LuFileCheck2 className='size-5 text-brand-600' />Built for applicant tracking systems</h2>
            <ul className='mt-4 space-y-2 text-sm text-slate-700 list-disc pl-5'>
              <li>Single-column layout with standard headings (Professional Summary, Skills, Experience, Education).</li>
              <li>Real, selectable text in the PDF. No tables, text boxes, icons, photos or skill-rating bars.</li>
              <li>Keywords from the job description used naturally, only where they match what you have done.</li>
              <li>A checklist of missing details so you know what to add. No tool can promise to pass every ATS.</li>
            </ul>
          </div>
        </section>

        <section className='max-w-3xl mx-auto px-4 py-10'>
          <h2 className='text-2xl font-semibold text-slate-800 text-center'>Frequently asked questions</h2>
          <div className='mt-6 divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white'>
            {FAQS.map(([q, a]) => (
              <details key={q} className='group p-4'>
                <summary className='cursor-pointer font-medium text-slate-800 list-none flex justify-between gap-3'>{q}<span className='text-slate-400 group-open:rotate-45 transition'>+</span></summary>
                <p className='text-sm text-slate-600 mt-2'>{a}</p>
              </details>
            ))}
          </div>
          <p className='text-center text-sm text-slate-600 mt-8'>Want to improve an existing resume instead? Try the <Link className='text-brand-700 underline' to='/features/ats-checker'>free ATS checker</Link>.</p>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default CvLanding
