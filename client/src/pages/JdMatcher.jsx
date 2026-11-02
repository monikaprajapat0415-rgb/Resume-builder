import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'
import { LuArrowRight, LuFileText, LuLock, LuTarget, LuUpload, LuX } from 'react-icons/lu'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import { matchResumeToJd } from '../utils/jdMatch'
import { suggestLearning } from '../utils/learnSuggest'
import api from '../configs/api'
import { ToolGate } from './tools/parts'
import { trackEvent } from '../components/Analytics'

const FAQS = [
  ['How does the resume job description matcher work?', 'It pulls the most important skills, tools and phrases out of the job post, then checks how often each one appears in your resume. Keywords found twice or more are strong, found once are weak, and not found are missing. Matching is on wording, the way a keyword scanner sees your resume.'],
  ['Is my resume uploaded or stored?', 'No. The comparison runs in your browser. Your resume text and the job description are not sent to our servers by this tool.'],
  ['Should I add every missing keyword?', 'No. Add a keyword only if it is true for you, and put it where you really used it: in your skills list, or better, in a bullet point that shows the result. Copying a job post into your resume makes it worse, and can cost you at interview.'],
  ['What is a good match score?', 'There is no official pass mark. As a rough guide, 60% or more of the important terms present means your resume speaks the same language as the job. A low score for a role you are really qualified for usually means you describe your skills with different words.'],
  ['Does this replace an ATS check?', 'No. This checks keyword match against one job. An ATS check also looks at formatting and structure. Use both: this page for the job match, then the free ATS checker for the layout.'],
]

const structured = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Resume Job Description Matcher', url: 'https://primeresumeai.com/resume-job-description-matcher', applicationCategory: 'BusinessApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, description: 'Paste your resume and a job description to see which keywords match, which are weak and which are missing. Runs in your browser.' },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
]

const tone = (s) => (s >= 70 ? ['text-emerald-700', 'bg-emerald-500', 'Strong match'] : s >= 45 ? ['text-amber-700', 'bg-amber-500', 'Partial match'] : ['text-red-700', 'bg-red-500', 'Weak match'])

const JdMatcher = () => {
  const [resume, setResume] = useState('')
  const [jd, setJd] = useState('')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const out = useRef(null)
  const [catalog, setCatalog] = useState(null)
  // published lessons and roadmaps on this site, used only to suggest where to learn a missing skill
  useEffect(() => {
    let on = true
    Promise.all([api.get('/api/learn').then((r) => r.data.courses || []).catch(() => []), api.get('/api/roadmaps').then((r) => r.data.roadmaps || []).catch(() => [])]).then(([courses, roadmaps]) => on && setCatalog({ courses, roadmaps }))
    return () => { on = false }
  }, [])
  const learn = result && catalog ? suggestLearning(result.missing, catalog.courses, catalog.roadmaps) : null

  const onFile = async (e) => {
    const f = e.target.files?.[0]; e.target.value = ''
    if (!f) return
    if (!/\.pdf$/i.test(f.name)) return toast.error('Please choose a PDF, or paste your resume text.')
    if (f.size > 5 * 1024 * 1024) return toast.error('That file is over 5 MB.')
    setBusy(true)
    try { const t = await pdfToText(f); if (!t.trim()) throw new Error('empty'); setResume(t.trim()) }
    catch { toast.error('Could not read text from that PDF (it may be a scan). Paste your resume text instead.') }
    setBusy(false)
  }

  const run = (e) => {
    e.preventDefault()
    if (resume.trim().split(/\s+/).length < 30) return toast.error('Paste your resume text first (at least a few lines).')
    if (jd.trim().split(/\s+/).length < 20) return toast.error('Paste the full job description.')
    const r = matchResumeToJd(resume, jd)
    setResult(r)
    trackEvent('jd_match_completed', { score: r.score })
    setTimeout(() => out.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  const [txt, bar, label] = result ? tone(result.score) : []
  const chip = (t, cls) => <span key={t.label} className={`text-xs px-2.5 py-1 rounded-full border ${cls}`}>{t.label}</span>

  return (
    <>
      <SEO
        title='Resume Job Description Matcher (Free)'
        description='Paste your resume and a job description to see which keywords match, which are weak and which are missing. Free, instant, and private: it runs in your browser.'
        keywords='tailor resume to job description, resume job match, resume keyword scanner, job description matcher, resume keyword match'
        path='/resume-job-description-matcher'
        structuredData={structured}
      />
      <NavBar />
      <main>
        <section className='bg-gradient-to-b from-brand-50/60 to-white'>
          <div className='max-w-3xl mx-auto px-4 pt-14 pb-8 text-center'>
            <span className='inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-100 rounded-full px-3 py-1'><LuLock className='size-3.5' />Free account. Runs in your browser.</span>
            <h1 className='text-3xl md:text-5xl font-semibold text-slate-800 mt-4 leading-tight'>Resume Job Description Matcher</h1>
            <p className='text-slate-600 mt-4 max-w-xl mx-auto'>See how well your resume matches a specific job: which keywords you already use, which are weak, and which are missing.</p>
          </div>
        </section>

        <section className='max-w-5xl mx-auto px-4 pb-10'>
          <ToolGate path='/resume-job-description-matcher'>
          <form onSubmit={run} className='grid md:grid-cols-2 gap-5'>
            <div className='bg-white border border-slate-200 rounded-2xl p-4 shadow-sm'>
              <div className='flex items-center justify-between mb-2'>
                <label htmlFor='resume-text' className='font-medium text-slate-800 flex items-center gap-2'><LuFileText className='size-4 text-brand-600' />Your resume</label>
                <label className='text-xs text-brand-700 cursor-pointer inline-flex items-center gap-1 hover:underline'><LuUpload className='size-3.5' />{busy ? 'Reading...' : 'Upload PDF'}<input type='file' accept='.pdf' hidden onChange={onFile} /></label>
              </div>
              <textarea id='resume-text' value={resume} onChange={(e) => setResume(e.target.value)} rows={14} placeholder='Paste your resume text here, or upload a PDF' className='w-full p-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200' />
            </div>
            <div className='bg-white border border-slate-200 rounded-2xl p-4 shadow-sm'>
              <label htmlFor='jd-text' className='font-medium text-slate-800 flex items-center gap-2 mb-2'><LuTarget className='size-4 text-brand-600' />Job description</label>
              <textarea id='jd-text' value={jd} onChange={(e) => setJd(e.target.value)} rows={14} placeholder='Paste the full job post here' className='w-full p-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200' />
            </div>
            <div className='md:col-span-2 flex flex-wrap items-center justify-center gap-3'>
              <button className='inline-flex items-center gap-2 px-7 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-medium transition'>Match my resume<LuArrowRight className='size-4' /></button>
              {(resume || jd || result) && <button type='button' onClick={() => { setResume(''); setJd(''); setResult(null) }} className='inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900'><LuX className='size-4' />Clear</button>}
            </div>
          </form>

          {result && (
            <div ref={out} className='mt-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm' data-testid='jd-result'>
              <div className='flex flex-wrap items-center gap-5'>
                <div>
                  <p className={`text-5xl font-semibold ${txt}`} data-testid='jd-score'>{result.score}%</p>
                  <p className={`text-sm font-medium ${txt}`}>{label}</p>
                </div>
                <div className='flex-1 min-w-[12rem]'>
                  <div className='h-2.5 rounded-full bg-slate-100 overflow-hidden'><div className={`h-full ${bar}`} style={{ width: `${result.score}%` }} /></div>
                  <p className='text-sm text-slate-600 mt-2'>{result.strong.length} strong, {result.weak.length} weak and {result.missing.length} missing out of {result.termCount} key terms from the job post.</p>
                </div>
              </div>

              <div className='grid md:grid-cols-3 gap-5 mt-6'>
                <div><h2 className='text-sm font-semibold text-emerald-800 mb-2'>Strong (used 2+ times)</h2><div className='flex flex-wrap gap-1.5'>{result.strong.length ? result.strong.map((t) => chip(t, 'bg-emerald-50 text-emerald-800 border-emerald-200')) : <p className='text-xs text-slate-500'>None yet.</p>}</div></div>
                <div><h2 className='text-sm font-semibold text-amber-800 mb-2'>Weak (used once)</h2><div className='flex flex-wrap gap-1.5'>{result.weak.length ? result.weak.map((t) => chip(t, 'bg-amber-50 text-amber-800 border-amber-200')) : <p className='text-xs text-slate-500'>None.</p>}</div></div>
                <div><h2 className='text-sm font-semibold text-red-800 mb-2'>Missing</h2><div className='flex flex-wrap gap-1.5'>{result.missing.length ? result.missing.map((t) => chip(t, 'bg-red-50 text-red-800 border-red-200')) : <p className='text-xs text-slate-500'>Nothing missing.</p>}</div></div>
              </div>

              {learn && (learn.courses.length > 0 || learn.roadmaps.length > 0) && (
                <div className='mt-6 rounded-xl border border-brand-200 bg-brand-50/50 p-4' data-testid='jd-learn'>
                  <h2 className='text-sm font-semibold text-slate-800'>Learn the gaps</h2>
                  <p className='text-xs text-slate-600 mt-1'>Free lessons and roadmaps on this site that mention some of your missing terms. Learning a topic is a good step, but add it to your resume only once it is true for you.</p>
                  <ul className='mt-3 grid sm:grid-cols-2 gap-2'>
                    {learn.courses.map((c) => (
                      <li key={c.slug}><Link to={`/learn/${c.slug}`} className='block rounded-lg border border-slate-200 bg-white p-3 hover:border-brand-300'><span className='text-sm font-medium text-slate-800'>{c.title}</span><span className='block text-xs text-slate-500 mt-0.5'>Course{c.level ? `, ${c.level}` : ''}. Covers: {c.terms.slice(0, 4).join(', ')}</span></Link></li>
                    ))}
                    {learn.roadmaps.map((r) => (
                      <li key={r.slug}><Link to={`/roadmaps/${r.slug}`} className='block rounded-lg border border-slate-200 bg-white p-3 hover:border-brand-300'><span className='text-sm font-medium text-slate-800'>{r.title}</span><span className='block text-xs text-slate-500 mt-0.5'>Roadmap. Mentions: {r.terms.slice(0, 4).join(', ')}</span></Link></li>
                    ))}
                  </ul>
                </div>
              )}

              <div className='mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700'>
                <p className='font-medium text-slate-800'>What to do next</p>
                <ul className='list-disc pl-5 mt-1.5 space-y-1'>
                  <li>Add a missing keyword only if it is true for you. Use it in a bullet that shows what you did, not just in a list.</li>
                  <li>Strengthen weak keywords by using them in a second place, such as your summary or another job.</li>
                  <li>Ignore words that are not skills (company-specific terms or generic filler).</li>
                </ul>
                <div className='flex flex-wrap gap-3 mt-4'>
                  <Link to='/features/ats-checker' className='px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>Run the free ATS check</Link>
                  <Link to='/app' className='px-5 py-2 border border-slate-300 hover:bg-white rounded-full text-sm font-medium transition'>Edit my resume</Link>
                  <Link to='/cv-builder' className='px-5 py-2 border border-slate-300 hover:bg-white rounded-full text-sm font-medium transition'>Write a tailored CV with AI</Link>
                </div>
              </div>
            </div>
          )}
          </ToolGate>
        </section>

        <section className='max-w-3xl mx-auto px-4 py-8'>
          <h2 className='text-2xl font-semibold text-slate-800'>How to tailor your resume to a job description</h2>
          <ol className='list-decimal pl-5 mt-4 space-y-3 text-slate-700'>
            <li><strong>Read the job post for what the employer repeats.</strong> Skills, tools and responsibilities that appear several times are the ones that matter most.</li>
            <li><strong>Compare with your real experience.</strong> Run the matcher, then look at the missing list and ask: have I actually done this under another name?</li>
            <li><strong>Mirror the wording where it is true.</strong> If the job says "stakeholder management" and you wrote "worked with clients", say what you did using their term.</li>
            <li><strong>Show results, not a keyword list.</strong> A keyword inside a bullet with an outcome is worth more than the same word in a skills line.</li>
            <li><strong>Keep one base resume and save a copy per application.</strong> Then check the layout with the <Link className='text-brand-700 underline' to='/features/ats-checker'>free ATS checker</Link>.</li>
          </ol>
          <p className='text-sm text-slate-600 mt-4'>Want the longer guide? Read our <Link className='text-brand-700 underline' to='/blog/how-to-tailor-your-resume-to-a-job-description'>step-by-step article on tailoring your resume</Link>, or browse <Link className='text-brand-700 underline' to='/templates'>ATS-friendly templates</Link>.</p>
        </section>

        <section className='max-w-3xl mx-auto px-4 pb-14'>
          <h2 className='text-2xl font-semibold text-slate-800 text-center'>Frequently asked questions</h2>
          <div className='mt-6 divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white'>
            {FAQS.map(([q, a]) => (
              <details key={q} className='group p-4'>
                <summary className='cursor-pointer font-medium text-slate-800 list-none flex justify-between gap-3'>{q}<span className='text-slate-400 group-open:rotate-45 transition'>+</span></summary>
                <p className='text-sm text-slate-600 mt-2'>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default JdMatcher
