import { trackEvent } from '../components/Analytics'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import AtsReport from '../components/ats/AtsReport'
import api from '../configs/api'
import { LuExternalLink, LuBriefcase, LuUpload, LuFileText, LuX, LuLock, LuInfo, LuShieldCheck, LuZap, LuTarget, LuChevronDown } from 'react-icons/lu'
import { BiLoaderAlt } from 'react-icons/bi'

const MAX = 5 * 1024 * 1024
const okType = (f) => /\.(pdf|docx)$/i.test(f.name)

const structured = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Free ATS Resume Checker',
  url: 'https://primeresumeai.com/features/ats-checker',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  description: 'Upload your resume (PDF or Word) and get a free ATS score with a detailed list of what to improve.',
}

const AtsChecker = () => {
  const { token, user, loading: authLoading } = useSelector((s) => s.auth)
  const [status, setStatus] = useState(null)
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [job, setJob] = useState(null) // job picked from /jobs, used as the target
  const [params] = useSearchParams()
  const jobSlug = params.get('job')
  useEffect(() => {
    if (!jobSlug) return
    api.get(`/api/jobs/${encodeURIComponent(jobSlug)}`).then(({ data }) => {
      const j = data.job
      if (!j) return
      setJob({ title: j.title, company: j.company, applyUrl: j.applyUrl, slug: jobSlug })
      setJd(`${j.title} at ${j.company}\n${j.description || ''}`.slice(0, 5000))
    }).catch(() => {})
  }, [jobSlug])
  const [showJd, setShowJd] = useState(false)
  const [drag, setDrag] = useState(false)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null) // { report, fileName }
  const input = useRef(null)
  const resultRef = useRef(null)
  const headers = { headers: { Authorization: token } }

  const loadStatus = useCallback(() => {
    if (!token) return
    api.get('/api/ats/status', headers).then(({ data }) => setStatus(data)).catch((e) => setStatus({ error: true, http: e.response?.status || 0, msg: e.response?.data?.message || '' }))
  }, [token])
  useEffect(() => { loadStatus() }, [loadStatus])

  const pick = (f) => {
    if (!f) return
    if (!okType(f)) return toast.error('Please choose a PDF or Word (.docx) file.')
    if (f.size > MAX) return toast.error('That file is larger than 5 MB.')
    setFile(f)
  }

  const run = async (e) => {
    e.preventDefault()
    if (!file) return toast.error('Choose your resume file first.')
    setBusy(true); setResult(null)
    try {
      const form = new FormData()
      form.append('resume', file)
      if (jd.trim()) form.append('jobDescription', jd.trim())
      const { data } = await api.post('/api/ats/analyze', form, { headers: { Authorization: token }, timeout: 90000 })
      setResult({ report: data.report, fileName: data.fileName })
      trackEvent('ats_check', { score: data.report?.score, for_job: job ? 'yes' : 'no' })
      setFile(null); loadStatus()
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      if (['LIMIT_REACHED', 'ATS_DISABLED'].includes(err.response?.data?.code)) { loadStatus(); toast.error(err.response.data.message) }
      else toast.error(err.response?.data?.message || 'Could not check your resume. Please try again.')
    }
    setBusy(false)
  }

  const openLast = async () => {
    try {
      const { data } = await api.get(`/api/ats/reports/${status.last.id}`, headers)
      setResult({ report: data.report, fileName: data.fileName })
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch { toast.error('Could not open that report.') }
  }

  const resend = async () => {
    try { const { data } = await api.post('/api/users/resend-verification', {}, headers); toast.success(data.message || 'Verification email sent.') }
    catch (e) { toast.error(e.response?.data?.message || 'Could not send the email.') }
  }

  const canCheck = status && !status.error && status.canCheck && status.verified

  return (
    <>
      <SEO
        title='Free ATS Resume Checker - Check Your Resume Score Online'
        description='Upload your resume (PDF or Word) and get a free ATS score with a detailed report: formatting, keywords, sections and exactly what to fix. Free first check, no credit card.'
        keywords='ATS resume checker, free ATS score, resume checker, ATS friendly resume, resume scanner'
        path='/features/ats-checker'
        structuredData={structured}
      />
      <NavBar />
      <main className='bg-gradient-to-b from-brand-50/60 to-white'>
        <div className='max-w-3xl mx-auto px-4 pt-14 pb-10 text-center'>
          <span className='inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-100 rounded-full px-3 py-1'><LuZap className='size-3.5' /> 5 free checks per account</span>
          <h1 className='text-3xl md:text-5xl font-semibold text-slate-800 mt-4 leading-tight'>Free ATS Resume Checker</h1>
          <p className='text-slate-600 mt-4 max-w-xl mx-auto'>Drop your resume and see how an Applicant Tracking System reads it: your score, what is hurting it, and exactly how to fix it.</p>
        </div>

        <div className='max-w-3xl mx-auto px-4 pb-16'>
          {/* Not signed in */}
          {!authLoading && !user && (
            <div className='bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center'>
              <LuLock className='size-8 text-brand-600 mx-auto' />
              <h2 className='text-lg font-semibold text-slate-800 mt-3'>Create a free account to check your resume</h2>
              <p className='text-sm text-slate-500 mt-1 max-w-md mx-auto'>It takes a minute. Your account keeps your report so you can open it again any time.</p>
              <div className='flex flex-wrap justify-center gap-3 mt-5'>
                <Link to='/app?state=register&next=/features/ats-checker' className='px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>Sign up free</Link>
                <Link to='/app?state=login&next=/features/ats-checker' className='px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full text-sm font-medium transition'>Log in</Link>
              </div>
            </div>
          )}

          {user && !status && <p className='text-center text-slate-400 py-10'>Loading…</p>}
          {user && status?.error && (
            <div className='bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center' role='alert'>
              <LuInfo className='size-8 text-red-500 mx-auto' />
              <h2 className='text-lg font-semibold text-slate-800 mt-3'>Could not load your ATS checker</h2>
              <p className='text-sm text-slate-500 mt-1 max-w-md mx-auto'>
                {status.http === 0 ? "We couldn't reach the server. Check your internet connection and try again."
                  : status.http === 401 || (status.http === 404 && status.msg === 'User not found') ? 'Your login has expired. Please log in again.'
                  : status.http === 404 ? 'The ATS service is not available on the server yet. Please try again shortly.'
                  : status.http === 503 ? 'The server is starting up. Please try again in a minute.'
                  : (status.msg || 'Something went wrong on the server. Please try again.')}
              </p>
              <div className='flex justify-center gap-3 mt-5'>
                <button onClick={() => { setStatus(null); loadStatus() }} className='px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>Try again</button>
                {(status.http === 401 || status.http === 404) && <Link to='/logout' className='px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full text-sm font-medium transition'>Log in again</Link>}
              </div>
              <p className='text-[11px] text-slate-300 mt-4'>Error code: {status.http || 'network'}</p>
            </div>
          )}

          {/* Needs email verification */}
          {user && status && !status.error && !status.verified && (
            <div className='bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center'>
              <p className='font-medium text-amber-900'>Verify your email to use the ATS checker</p>
              <p className='text-sm text-amber-800 mt-1'>We sent a link to {user.email}. Open it, then come back to this page.</p>
              <button onClick={resend} className='mt-4 px-5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full text-sm font-medium transition'>Resend verification email</button>
            </div>
          )}

          {/* Upload form */}
          {user && canCheck && (
            <form onSubmit={run} className='bg-white rounded-2xl border border-slate-200 shadow-sm p-6'>
              <div
                onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]) }}
                onClick={() => !file && input.current?.click()}
                className={`rounded-xl border-2 border-dashed px-4 py-10 text-center transition ${drag ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400'} ${file ? '' : 'cursor-pointer'}`}
              >
                <input ref={input} type='file' accept='.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document' className='hidden' onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} data-testid='ats-file' />
                {file ? (
                  <div className='inline-flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3'>
                    <LuFileText className='size-6 text-brand-600' />
                    <div className='text-left'><p className='text-sm text-slate-800 break-all'>{file.name}</p><p className='text-xs text-slate-400'>{(file.size / 1024).toFixed(0)} KB</p></div>
                    <button type='button' onClick={(e) => { e.stopPropagation(); setFile(null) }} className='p-1 rounded hover:bg-slate-200' aria-label='Remove file'><LuX className='size-4 text-slate-500' /></button>
                  </div>
                ) : (
                  <>
                    <LuUpload className='size-9 text-brand-600 mx-auto' />
                    <p className='mt-3 text-slate-700 font-medium'>Drag and drop your resume here</p>
                    <p className='text-sm text-slate-500'>or <span className='text-brand-700 underline'>browse files</span> · PDF or Word (.docx) · up to 5 MB</p>
                  </>
                )}
              </div>

              {job && (
                <div className='mt-4 flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2.5 text-sm'>
                  <LuBriefcase className='size-4 text-brand-700 mt-0.5 shrink-0' />
                  <p className='flex-1 text-slate-700'>Checking against <b>{job.title}</b> at <b>{job.company}</b>. We compare your resume with this job's keywords.</p>
                  <button type='button' onClick={() => { setJob(null); setJd('') }} className='text-slate-500 hover:text-slate-800' aria-label='Remove job'><LuX className='size-4' /></button>
                </div>
              )}
              {!job && <button type='button' onClick={() => setShowJd(!showJd)} className='mt-4 flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900'>
                <LuTarget className='size-4 text-brand-600' /> Check against a specific job <span className='text-slate-400'>(optional)</span>
                <LuChevronDown className={`size-4 transition ${showJd ? 'rotate-180' : ''}`} />
              </button>}
              {showJd && !job && <textarea value={jd} onChange={(e) => setJd(e.target.value)} maxLength={5000} rows={5} placeholder='Paste the job description here to see which of its keywords your resume is missing…' className='mt-2 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-300 resize-y' />}

              <button disabled={busy || !file} className='mt-5 w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-full font-medium transition flex items-center justify-center gap-2'>
                {busy && <BiLoaderAlt className='size-4 animate-spin' />}
                {busy ? 'Analysing your resume… this takes about 20 seconds' : 'Check my resume'}
              </button>
              <p className='text-xs text-slate-400 text-center mt-3 flex items-center justify-center gap-1'>
                <LuShieldCheck className='size-3.5' />
                {status.left} of {status.limit} free checks left. We don't keep your file - only the report is saved to your account.
              </p>
            </form>
          )}

          {/* Checker switched off for this account (limit reached, or turned off by an admin) */}
          {user && status && !status.error && !status.canCheck && status.verified && !busy && !result && (
            <div className='bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center' role='status'>
              <LuInfo className='size-8 text-brand-600 mx-auto' />
              <h2 className='text-lg font-semibold text-slate-800 mt-3'>{status.reason === 'disabled' ? 'The ATS checker is turned off for your account' : `You have used all ${status.limit} of your free ATS checks`}</h2>
              <p className='text-sm text-slate-500 mt-1 max-w-md mx-auto'>
                {status.reason === 'disabled' ? 'Please contact us if you think this is a mistake.' : 'The ATS checker is now turned off for your account. If you need more checks, please contact us.'}
              </p>
              <div className='flex flex-wrap justify-center gap-3 mt-5'>
                <Link to='/contact-us' className='px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>Contact us</Link>
                {status?.last && <button onClick={openLast} className='px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full text-sm font-medium transition'>View my last report (score {status.last.score})</button>}
              </div>
              <p className='text-xs text-slate-400 mt-4'>Meanwhile, you can improve your resume with our <Link to='/templates' className='underline'>ATS-friendly templates</Link>.</p>
            </div>
          )}

          <div ref={resultRef} className='mt-8 scroll-mt-6'>
            {result && status && !status.error && !status.canCheck && (
              <div className='mb-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900' role='status'>
                <LuInfo className='size-4 shrink-0 mt-0.5' />
                <span>That was your last ATS check. The ATS checker is now turned off for your account. If you need more checks, please <Link to='/contact-us' className='underline'>contact us</Link>.</span>
              </div>
            )}
            {result && <AtsReport report={result.report} fileName={result.fileName} />}
            {result && job && (
              <div className='mt-4 flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-xl p-4'>
                <p className='text-sm text-slate-600 flex-1 min-w-[12rem]'>Fix the missing keywords above, then apply for <b>{job.title}</b> at {job.company}.</p>
                <Link to='/app' className='px-4 py-2 border border-slate-200 rounded-full text-sm text-slate-700 hover:bg-slate-50'>Edit my resume</Link>
                <a href={job.applyUrl} target='_blank' rel='nofollow noopener noreferrer' className='inline-flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium'>Apply on {job.company} <LuExternalLink className='size-4' /></a>
              </div>
            )}
            {result && (
              <div className='mt-6 rounded-xl bg-brand-600 text-white p-6 text-center'>
                <p className='font-semibold text-lg'>Fix these in minutes with our resume builder</p>
                <p className='text-sm text-brand-50 mt-1'>ATS-friendly templates and AI writing help for your summary and experience.</p>
                <Link to='/app' className='inline-block mt-4 px-6 py-2.5 bg-white text-brand-700 rounded-full text-sm font-medium hover:bg-brand-50 transition'>Build my resume</Link>
              </div>
            )}
          </div>
        </div>

        <section className='max-w-4xl mx-auto px-4 pb-20'>
          <h2 className='text-xl font-semibold text-slate-800 text-center'>What the ATS checker looks at</h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-sm'>
            {[['Readability', 'Can software read your file, or is it an image, table or icon-heavy layout?'], ['Sections & structure', 'Clear Experience, Education and Skills headings, plus dates.'], ['Keywords', 'The skills recruiters search for, and which ones you are missing.'], ['Content & impact', 'Action verbs and measurable results that make bullets stand out.']].map(([t, d]) => (
              <div key={t} className='bg-white rounded-xl border border-slate-200 p-4'><p className='font-medium text-slate-800'>{t}</p><p className='text-slate-500 mt-1'>{d}</p></div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default AtsChecker
