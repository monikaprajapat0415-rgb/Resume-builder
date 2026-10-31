import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuCopy, LuLoader, LuShieldCheck } from 'react-icons/lu'
import SEO from '../../components/SEO'
import NavBar from '../../components/home/NavBar'
import Footer from '../../components/home/Footer'
import api from '../../configs/api'
import { useToolSettings } from '../../utils/toolSettings'
import C from '../../content/careerTools.json'
import OfferComparer from './OfferComparer'

// One page for the free career tools: /tools/:slug. Copy comes from content/careerTools.json (also served as server HTML).
// Admin > Free tools can switch each tool off and sets the shared daily limit. The AI tools need a signed-in account.
const box = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-300'
const btn = 'inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 transition'
const TONES = [['professional', 'Professional'], ['friendly', 'Friendly'], ['confident', 'Confident']]

const Field = ({ id, label, hint, children }) => (
  <div>
    <label htmlFor={id} className='block text-sm font-medium text-slate-700'>{label}</label>
    {hint && <p className='text-xs text-slate-500 mt-0.5'>{hint}</p>}
    <div className='mt-1.5'>{children}</div>
  </div>
)
const Tone = ({ value, onChange }) => (
  <fieldset>
    <legend className='text-sm font-medium text-slate-700'>Tone</legend>
    <div className='mt-1.5 inline-flex rounded-lg border border-slate-300 bg-white p-0.5'>
      {TONES.map(([v, t]) => <button key={v} type='button' aria-pressed={value === v} onClick={() => onChange(v)} className={`px-3 py-1.5 text-sm rounded-md ${value === v ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>{t}</button>)}
    </div>
  </fieldset>
)
const Copy = ({ text, label = 'Copy' }) => (
  <button type='button' onClick={() => navigator.clipboard?.writeText(text).then(() => toast.success('Copied'), () => toast.error('Could not copy'))} className='inline-flex items-center gap-1.5 text-xs text-brand-700 hover:underline'><LuCopy className='size-3.5' />{label}</button>
)

// Shared request: sends the form, handles the limit and error messages the server gives in plain words.
const useAsk = (token, path) => {
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const ask = async (body) => {
    setBusy(true)
    try {
      const { data } = await api.post(`/api/tools/career/${path}`, body, { headers: { Authorization: token }, timeout: 90000 })
      setResult(data)
      return data
    } catch (e) { toast.error(e.response?.data?.message || 'Something went wrong. Please try again.') }
    finally { setBusy(false) }
  }
  return { busy, result, ask, setResult }
}

const CoverLetter = ({ token }) => {
  const [f, setF] = useState({ background: '', jobDescription: '', jobTitle: '', company: '', name: '', tone: 'professional' })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const { busy, result, ask } = useAsk(token, 'cover-letter')
  return (
    <div className='grid lg:grid-cols-2 gap-8 items-start'>
      <form onSubmit={(e) => { e.preventDefault(); ask(f) }} className='space-y-4'>
        <Field id='cl-bg' label='Your experience and skills' hint='Paste your resume text or a few lines. Only real facts.'><textarea id='cl-bg' required minLength={40} maxLength={6000} rows={7} value={f.background} onChange={set('background')} className={box} /></Field>
        <Field id='cl-jd' label='Job description'><textarea id='cl-jd' required minLength={40} maxLength={6000} rows={7} value={f.jobDescription} onChange={set('jobDescription')} className={box} /></Field>
        <div className='grid sm:grid-cols-3 gap-3'>
          <Field id='cl-t' label='Job title'><input id='cl-t' maxLength={100} value={f.jobTitle} onChange={set('jobTitle')} className={box} /></Field>
          <Field id='cl-c' label='Company'><input id='cl-c' maxLength={100} value={f.company} onChange={set('company')} className={box} /></Field>
          <Field id='cl-n' label='Your name'><input id='cl-n' maxLength={80} value={f.name} onChange={set('name')} className={box} /></Field>
        </div>
        <Tone value={f.tone} onChange={(tone) => setF((x) => ({ ...x, tone }))} />
        <div><button type='submit' disabled={busy} className={btn}>{busy && <LuLoader className='size-4 animate-spin' />}{busy ? 'Writing…' : 'Write my cover letter'}</button></div>
      </form>
      <Output title='Your draft' empty='Your cover letter will appear here.' show={Boolean(result?.letter)}>
        <div className='flex justify-end'><Copy text={result?.letter || ''} label='Copy the letter' /></div>
        <p className='whitespace-pre-line text-sm text-slate-800 leading-relaxed mt-2'>{result?.letter}</p>
      </Output>
    </div>
  )
}

const Bullets = ({ token }) => {
  const [text, setText] = useState('')
  const [role, setRole] = useState('')
  const { busy, result, ask } = useAsk(token, 'bullets')
  return (
    <div className='grid lg:grid-cols-2 gap-8 items-start'>
      <form onSubmit={(e) => { e.preventDefault(); ask({ bullets: text, role }) }} className='space-y-4'>
        <Field id='bp-t' label='Your resume lines' hint='One bullet per line, up to 8 lines.'><textarea id='bp-t' required maxLength={4000} rows={9} value={text} onChange={(e) => setText(e.target.value)} className={box} placeholder={'Worked on customer complaints\nHelped the team with reports'} /></Field>
        <Field id='bp-r' label='Job you are applying for (optional)'><input id='bp-r' maxLength={100} value={role} onChange={(e) => setRole(e.target.value)} className={box} /></Field>
        <div><button type='submit' disabled={busy} className={btn}>{busy && <LuLoader className='size-4 animate-spin' />}{busy ? 'Improving…' : 'Improve my bullets'}</button></div>
      </form>
      <Output title='Stronger versions' empty='Your improved bullets will appear here.' show={Boolean(result?.items?.length)}>
        <ol className='space-y-5'>
          {result?.items?.map((it, i) => (
            <li key={i} className='text-sm'>
              <p className='text-slate-500 line-through decoration-slate-300'>{it.original}</p>
              {it.versions.map((v, j) => <p key={j} className='mt-1.5 flex items-start justify-between gap-3 text-slate-800'><span>• {v}</span><Copy text={v} /></p>)}
              {it.add && <p className='mt-1.5 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1'>Add if true: {it.add}</p>}
            </li>
          ))}
        </ol>
      </Output>
    </div>
  )
}

const LinkedIn = ({ token }) => {
  const [f, setF] = useState({ background: '', targetRole: '', tone: 'professional' })
  const { busy, result, ask } = useAsk(token, 'linkedin')
  return (
    <div className='grid lg:grid-cols-2 gap-8 items-start'>
      <form onSubmit={(e) => { e.preventDefault(); ask(f) }} className='space-y-4'>
        <Field id='li-bg' label='About you' hint='What you do, your main skills and what you are looking for. Only real facts.'><textarea id='li-bg' required minLength={40} maxLength={5000} rows={8} value={f.background} onChange={(e) => setF((x) => ({ ...x, background: e.target.value }))} className={box} /></Field>
        <Field id='li-r' label='Role you want (optional)'><input id='li-r' maxLength={100} value={f.targetRole} onChange={(e) => setF((x) => ({ ...x, targetRole: e.target.value }))} className={box} /></Field>
        <Tone value={f.tone} onChange={(tone) => setF((x) => ({ ...x, tone }))} />
        <div><button type='submit' disabled={busy} className={btn}>{busy && <LuLoader className='size-4 animate-spin' />}{busy ? 'Writing…' : 'Write my headline and About'}</button></div>
      </form>
      <Output title='Your text' empty='Three headlines and an About section will appear here.' show={Boolean(result?.headlines?.length)}>
        <h3 className='text-sm font-semibold text-slate-700'>Headline options</h3>
        <ul className='mt-2 space-y-2'>{result?.headlines?.map((h, i) => <li key={i} className='flex items-start justify-between gap-3 text-sm text-slate-800'><span>{h} <span className='text-xs text-slate-400'>({h.length}/220)</span></span><Copy text={h} /></li>)}</ul>
        <div className='flex items-center justify-between mt-5'><h3 className='text-sm font-semibold text-slate-700'>About section</h3><Copy text={result?.about || ''} /></div>
        <p className='whitespace-pre-line text-sm text-slate-800 leading-relaxed mt-2'>{result?.about}</p>
      </Output>
    </div>
  )
}

const MockInterview = ({ token }) => {
  const [qs, setQs] = useState(null)
  const [level, setLevel] = useState('')
  const [cat, setCat] = useState('')
  const [pick, setPick] = useState(null)
  const [answer, setAnswer] = useState('')
  const { busy, result, ask, setResult } = useAsk(token, 'mock-interview')
  useEffect(() => { api.get('/api/community/questions').then(({ data }) => setQs(data)).catch(() => setQs({ questions: [], categories: [] })) }, [])
  const pool = useMemo(() => (qs?.questions || []).filter((q) => (!level || q.level === level || q.level === 'both') && (!cat || q.category === cat)), [qs, level, cat])
  const draw = () => { if (!pool.length) return; setPick(pool[Math.floor(Math.random() * pool.length)]); setAnswer(''); setResult(null) }
  return (
    <div className='grid lg:grid-cols-2 gap-8 items-start'>
      <div className='space-y-4'>
        <div className='grid sm:grid-cols-2 gap-3'>
          <Field id='mi-l' label='Level'><select id='mi-l' value={level} onChange={(e) => setLevel(e.target.value)} className={box}><option value=''>Any</option><option value='fresher'>Fresher</option><option value='experienced'>Experienced</option></select></Field>
          <Field id='mi-c' label='Topic'><select id='mi-c' value={cat} onChange={(e) => setCat(e.target.value)} className={box}><option value=''>Any topic</option>{(qs?.categories || []).map((c) => <option key={c}>{c}</option>)}</select></Field>
        </div>
        <button type='button' onClick={draw} disabled={!pool.length} className='rounded-full border border-brand-300 text-brand-700 hover:bg-brand-50 disabled:opacity-50 text-sm font-medium px-5 py-2'>{pick ? 'Another question' : 'Give me a question'}</button>
        {qs && !pool.length && <p className='text-sm text-slate-500'>No questions match. Try another level or topic.</p>}
        {pick && (
          <form onSubmit={(e) => { e.preventDefault(); ask({ slug: pick.slug, answer }) }} className='space-y-4'>
            <p className='rounded-xl bg-brand-50 border border-brand-100 p-4 text-slate-800 font-medium'>{pick.question}</p>
            <Field id='mi-a' label='Your answer' hint='Type it as you would say it.'><textarea id='mi-a' required minLength={30} maxLength={3000} rows={8} value={answer} onChange={(e) => setAnswer(e.target.value)} className={box} /></Field>
            <button type='submit' disabled={busy} className={btn}>{busy && <LuLoader className='size-4 animate-spin' />}{busy ? 'Reading your answer…' : 'Get feedback'}</button>
          </form>
        )}
      </div>
      <Output title='Feedback' empty='Choose a question and answer it to see feedback here.' show={Boolean(result?.worked)}>
        <h3 className='text-sm font-semibold text-green-700'>What worked</h3>
        <ul className='list-disc pl-5 mt-1 text-sm text-slate-800 space-y-1'>{result?.worked?.map((x, i) => <li key={i}>{x}</li>)}</ul>
        {result?.missing?.length > 0 && (<><h3 className='text-sm font-semibold text-amber-700 mt-4'>What is missing</h3><ul className='list-disc pl-5 mt-1 text-sm text-slate-800 space-y-1'>{result.missing.map((x, i) => <li key={i}>{x}</li>)}</ul></>)}
        <div className='flex items-center justify-between mt-4'><h3 className='text-sm font-semibold text-slate-700'>A stronger version</h3><Copy text={result?.improved || ''} /></div>
        <p className='whitespace-pre-line text-sm text-slate-800 mt-1'>{result?.improved}</p>
        {result?.modelAnswer && <details className='mt-4 rounded-lg border border-slate-200 p-3'><summary className='text-sm font-medium text-slate-700 cursor-pointer'>See our model answer</summary><p className='whitespace-pre-line text-sm text-slate-700 mt-2'>{result.modelAnswer}</p></details>}
        {pick && <p className='text-xs text-slate-500 mt-3'><Link to={`/jobs/interview-questions/${pick.slug}`} className='text-brand-700 underline'>Open this question</Link> to read answers from other job seekers.</p>}
      </Output>
    </div>
  )
}

const Output = ({ title, empty, show, children }) => (
  <section aria-live='polite' className='rounded-2xl border border-slate-200 bg-slate-50/60 p-5 min-h-48'>
    <h2 className='text-sm font-semibold text-slate-700 mb-3'>{title}</h2>
    {show ? children : <p className='text-sm text-slate-400'>{empty}</p>}
  </section>
)

const TOOL_VIEWS = { 'cover-letter-generator': CoverLetter, 'resume-bullet-improver': Bullets, 'linkedin-headline-about-generator': LinkedIn, 'mock-interview-practice': MockInterview }
const KEYS = { 'cover-letter-generator': 'cover-letter', 'resume-bullet-improver': 'bullets', 'linkedin-headline-about-generator': 'linkedin', 'mock-interview-practice': 'mock-interview' }

const CareerTool = () => {
  const { slug } = useParams()
  const tool = C.tools.find((t) => t.slug === slug)
  const s = useToolSettings()
  const { token, user, loading } = useSelector((st) => st.auth)
  const [status, setStatus] = useState(null)
  useEffect(() => {
    if (!token || !tool?.needsLogin) return
    api.get('/api/tools/career/status', { headers: { Authorization: token } }).then(({ data }) => setStatus(data)).catch(() => {})
  }, [token, tool])

  if (!tool) {
    return (<><SEO title='Tool not found' description='This tool could not be found.' path={`/tools/${slug}`} noindex /><NavBar /><main className='max-w-xl mx-auto px-4 py-24 text-center'><h1 className='text-2xl font-semibold text-slate-800'>Tool not found</h1><p className='mt-4'><Link to='/tools' className='text-brand-700 underline'>See all free tools</Link></p></main><Footer /></>)
  }
  const off = s.loaded && s[tool.flag] === false && user?.role !== 'admin'
  if (off && !loading) {
    return (<><SEO title={`${tool.name} is not available`} description='This tool is switched off right now.' path={tool.path} noindex /><NavBar /><main className='max-w-xl mx-auto px-4 py-24 text-center'><h1 className='text-2xl font-semibold text-slate-800'>This tool is not available right now</h1><p className='text-slate-600 mt-3'>Please check back later.</p><p className='mt-6'><Link to='/tools' className='px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium'>See other free tools</Link></p></main><Footer /></>)
  }
  const View = TOOL_VIEWS[slug]
  const structured = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ['Free tools', '/tools'], [tool.name, tool.path]].map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `https://primeresumeai.com${p}` })) },
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: `Prime Resume AI ${tool.name}`, url: `https://primeresumeai.com${tool.path}`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', description: tool.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: tool.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ]
  const signedIn = Boolean(token)
  return (
    <>
      <SEO title={tool.title} description={tool.description} path={tool.path} structuredData={structured} />
      <NavBar />
      <main className='max-w-page xl:px-10 mx-auto px-4 py-10'>
        <h1 className='text-3xl sm:text-4xl font-bold text-slate-800'>{tool.h1}</h1>
        <p className='text-slate-600 mt-3 max-w-3xl'>{tool.intro}</p>

        <section className='mt-8'>
          {!tool.needsLogin ? <OfferComparer /> : !signedIn ? (
            <div className='rounded-2xl border border-brand-200 bg-brand-50/50 p-6 max-w-xl'>
              <h2 className='font-semibold text-slate-800'>Sign in to use this free tool</h2>
              <p className='text-sm text-slate-600 mt-1'>It is free. An account keeps the daily limit fair for everyone.</p>
              <p className='mt-4 flex flex-wrap gap-3'>
                <Link to={`/app?state=register&next=${encodeURIComponent(tool.path)}`} className={btn}>Create a free account</Link>
                <Link to={`/app?state=login&next=${encodeURIComponent(tool.path)}`} className='rounded-full border border-slate-300 text-sm text-slate-700 hover:bg-white px-6 py-2.5'>Log in</Link>
              </p>
            </div>
          ) : (
            <>
              {status && status.limit != null && <p className='text-xs text-slate-500 mb-4'>{status.remaining} of {status.limit} free uses left today, shared by all the career tools.</p>}
              <View token={token} />
            </>
          )}
        </section>

        <div className='mt-12 grid lg:grid-cols-2 gap-8'>
          <section>
            <h2 className='text-xl font-semibold text-slate-800'>How it works</h2>
            <ol className='mt-3 list-decimal pl-5 space-y-2 text-slate-700'>{tool.steps.map((x) => <li key={x}>{x}</li>)}</ol>
            <p className='mt-5 flex items-start gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3'><LuShieldCheck className='size-4 mt-0.5 shrink-0 text-brand-600' /><span>{tool.note}</span></p>
          </section>
          <section>
            <h2 className='text-xl font-semibold text-slate-800'>Frequently asked questions</h2>
            <div className='mt-3 space-y-4'>{tool.faqs.map((f) => <div key={f.q}><h3 className='font-medium text-slate-800'>{f.q}</h3><p className='text-sm text-slate-600 mt-1'>{f.a}</p></div>)}</div>
          </section>
        </div>
        <p className='text-sm text-slate-500 mt-10'><Link to='/tools' className='text-brand-700 underline'>More free tools</Link> · <Link to='/app' className='text-brand-700 underline'>Free resume builder</Link> · <Link to='/features/ats-checker' className='text-brand-700 underline'>ATS resume checker</Link></p>
      </main>
      <Footer />
    </>
  )
}
export default CareerTool
