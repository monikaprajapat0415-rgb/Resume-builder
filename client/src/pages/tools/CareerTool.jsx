import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuCopy, LuLoader, LuShieldCheck, LuWand, LuDownload, LuRefreshCw, LuChevronDown, LuLock } from 'react-icons/lu'
import SEO from '../../components/SEO'
import NavBar from '../../components/home/NavBar'
import Footer from '../../components/home/Footer'
import api from '../../configs/api'
import { useToolSettings } from '../../utils/toolSettings'
import C from '../../content/careerTools.json'
import OfferComparer from './OfferComparer'
const Playground = lazy(() => import('./Playground'))
import { TOOLS, visibleTools, toolByPath } from '../../content/toolsHub'
import { IconTile, Badges, ToolCard } from './parts'

// One page for the free career tools: /tools/:slug. Copy comes from content/careerTools.json (also served as server HTML).
// Admin > Free tools can switch each tool off and sets the shared daily limit. The AI tools need a signed-in account.
const box = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400'
const btn = 'inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold px-6 py-3 shadow-sm transition'
const ghost = 'inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 px-3 py-1.5'
const TONES = [['professional', 'Professional'], ['friendly', 'Friendly'], ['confident', 'Confident']]

const Field = ({ id, label, hint, count, max, children }) => (
  <div>
    <div className='flex items-baseline justify-between gap-3'>
      <label htmlFor={id} className='block text-sm font-semibold text-slate-700'>{label}</label>
      {max && <span className={`text-[11px] tabular-nums ${count > max * 0.95 ? 'text-amber-600' : 'text-slate-400'}`}>{count}/{max}</span>}
    </div>
    {hint && <p className='text-xs text-slate-500 mt-0.5'>{hint}</p>}
    <div className='mt-1.5'>{children}</div>
  </div>
)
// Invented sample data so people can see the tool work in one click. Labelled as a sample on screen.
const Example = ({ onFill }) => (
  <button type='button' onClick={onFill} className='inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 hover:underline'><LuWand className='size-3.5' />Try a made-up example</button>
)
const download = (name, text) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000) }
const Tone = ({ value, onChange }) => (
  <fieldset>
    <legend className='text-sm font-semibold text-slate-700'>Tone</legend>
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
      <form id='cl-form' onSubmit={(e) => { e.preventDefault(); ask(f) }} className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='flex justify-end'><Example onFill={() => setF({ background: 'Sample (made up): I worked for three years in the customer support team of a small online shop. I answered about the same number of emails and calls each day, solved delivery and refund problems, and trained two new colleagues. I know Excel and a ticket system.', jobDescription: 'Sample (made up): We are hiring a Customer Support Executive. You will answer customer calls and emails, solve problems politely and keep clear records. Good written English and basic Excel are needed.', jobTitle: 'Customer Support Executive', company: 'Example Co', name: 'Asha Verma', tone: 'professional' })} /></div>
        <Field id='cl-bg' label='Your experience and skills' hint='Paste your resume text or a few lines. Only real facts.' count={f.background.length} max={6000}><textarea id='cl-bg' required minLength={40} maxLength={6000} rows={7} value={f.background} onChange={set('background')} className={box} /></Field>
        <Field id='cl-jd' label='Job description' hint='Paste the advert you are applying to.' count={f.jobDescription.length} max={6000}><textarea id='cl-jd' required minLength={40} maxLength={6000} rows={7} value={f.jobDescription} onChange={set('jobDescription')} className={box} /></Field>
        <div className='grid sm:grid-cols-3 gap-3'>
          <Field id='cl-t' label='Job title'><input id='cl-t' maxLength={100} value={f.jobTitle} onChange={set('jobTitle')} className={box} /></Field>
          <Field id='cl-c' label='Company'><input id='cl-c' maxLength={100} value={f.company} onChange={set('company')} className={box} /></Field>
          <Field id='cl-n' label='Your name'><input id='cl-n' maxLength={80} value={f.name} onChange={set('name')} className={box} /></Field>
        </div>
        <Tone value={f.tone} onChange={(tone) => setF((x) => ({ ...x, tone }))} />
        <div><button type='submit' disabled={busy} className={btn}>{busy && <LuLoader className='size-4 animate-spin' />}{busy ? 'Writing…' : 'Write my cover letter'}</button></div>
      </form>
      <Output title='Your draft' empty='Fill in the form and your cover letter will appear here. Edit it before you send it.' show={Boolean(result?.letter)} busy={busy}>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <span className='text-xs text-slate-400'>{(result?.letter || '').split(/\s+/).filter(Boolean).length} words</span>
          <span className='flex gap-2'>
            <button type='button' onClick={() => navigator.clipboard?.writeText(result.letter).then(() => toast.success('Copied'), () => toast.error('Could not copy'))} className={ghost}><LuCopy className='size-3.5' />Copy</button>
            <button type='button' onClick={() => download('cover-letter.txt', result.letter)} className={ghost}><LuDownload className='size-3.5' />Download</button>
            <button type='submit' form='cl-form' disabled={busy} className={ghost}><LuRefreshCw className='size-3.5' />Write again</button>
          </span>
        </div>
        <p className='whitespace-pre-line text-sm text-slate-800 leading-relaxed mt-4'>{result?.letter}</p>
        <p className='mt-4 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2'>Check every line is true for you and fill in any [brackets] before you send it.</p>
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
      <form onSubmit={(e) => { e.preventDefault(); ask({ bullets: text, role }) }} className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='flex justify-end'><Example onFill={() => { setText('Sample (made up): Worked on customer complaints\nHelped the team with weekly reports\nResponsible for the stock room'); setRole('Customer Support Executive') }} /></div>
        <Field id='bp-t' label='Your resume lines' hint='One bullet per line, up to 8 lines.' count={text.length} max={4000}><textarea id='bp-t' required maxLength={4000} rows={9} value={text} onChange={(e) => setText(e.target.value)} className={box} placeholder={'Worked on customer complaints\nHelped the team with reports'} /></Field>
        <Field id='bp-r' label='Job you are applying for (optional)'><input id='bp-r' maxLength={100} value={role} onChange={(e) => setRole(e.target.value)} className={box} /></Field>
        <div><button type='submit' disabled={busy} className={btn}>{busy && <LuLoader className='size-4 animate-spin' />}{busy ? 'Improving…' : 'Improve my bullets'}</button></div>
      </form>
      <Output title='Stronger versions' empty='Paste your resume lines and the improved versions will appear here.' show={Boolean(result?.items?.length)} busy={busy}>
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
      <form onSubmit={(e) => { e.preventDefault(); ask(f) }} className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='flex justify-end'><Example onFill={() => setF({ background: 'Sample (made up): Three years in customer support for an online shop. I handle emails and calls, solve delivery and refund problems and trained two new colleagues. I use Excel and a ticket system. I want a support team lead role.', targetRole: 'Customer Support Team Lead', tone: 'professional' })} /></div>
        <Field id='li-bg' label='About you' hint='What you do, your main skills and what you are looking for. Only real facts.' count={f.background.length} max={5000}><textarea id='li-bg' required minLength={40} maxLength={5000} rows={8} value={f.background} onChange={(e) => setF((x) => ({ ...x, background: e.target.value }))} className={box} /></Field>
        <Field id='li-r' label='Role you want (optional)'><input id='li-r' maxLength={100} value={f.targetRole} onChange={(e) => setF((x) => ({ ...x, targetRole: e.target.value }))} className={box} /></Field>
        <Tone value={f.tone} onChange={(tone) => setF((x) => ({ ...x, tone }))} />
        <div><button type='submit' disabled={busy} className={btn}>{busy && <LuLoader className='size-4 animate-spin' />}{busy ? 'Writing…' : 'Write my headline and About'}</button></div>
      </form>
      <Output title='Your text' empty='Three headline options and an About section will appear here.' show={Boolean(result?.headlines?.length)} busy={busy}>
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
      <div className='space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='grid sm:grid-cols-2 gap-3'>
          <Field id='mi-l' label='Level'><select id='mi-l' value={level} onChange={(e) => setLevel(e.target.value)} className={box}><option value=''>Any</option><option value='fresher'>Fresher</option><option value='experienced'>Experienced</option></select></Field>
          <Field id='mi-c' label='Topic'><select id='mi-c' value={cat} onChange={(e) => setCat(e.target.value)} className={box}><option value=''>Any topic</option>{(qs?.categories || []).map((c) => <option key={c}>{c}</option>)}</select></Field>
        </div>
        <button type='button' onClick={draw} disabled={!pool.length} className='rounded-full border border-brand-300 text-brand-700 hover:bg-brand-50 disabled:opacity-50 text-sm font-medium px-5 py-2'>{pick ? 'Another question' : 'Give me a question'}</button>
        {qs && !pool.length && <p className='text-sm text-slate-500'>No questions match. Try another level or topic.</p>}
        {pick && (
          <form onSubmit={(e) => { e.preventDefault(); ask({ slug: pick.slug, answer }) }} className='space-y-4'>
            <p className='rounded-xl bg-brand-50 border border-brand-100 p-4 text-slate-800 font-semibold'><span className='block text-xs font-medium text-brand-700 mb-1'>{pick.category}</span>{pick.question}</p>
            <Field id='mi-a' label='Your answer' hint='Type it as you would say it in the interview.' count={answer.length} max={3000}><textarea id='mi-a' required minLength={30} maxLength={3000} rows={8} value={answer} onChange={(e) => setAnswer(e.target.value)} className={box} /></Field>
            <button type='submit' disabled={busy} className={btn}>{busy && <LuLoader className='size-4 animate-spin' />}{busy ? 'Reading your answer…' : 'Get feedback'}</button>
          </form>
        )}
      </div>
      <Output title='Feedback' empty='Choose a question, type your answer and your feedback will appear here.' show={Boolean(result?.worked)} busy={busy}>
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

const Output = ({ title, empty, show, busy, children }) => (
  <section aria-live='polite' aria-busy={busy} className='rounded-2xl border border-slate-200 bg-white shadow-sm p-5 min-h-64 lg:sticky lg:top-24'>
    <h2 className='text-sm font-semibold text-slate-700 mb-3'>{title}</h2>
    {busy ? (
      <div className='space-y-3 animate-pulse' role='status' aria-label='Working on it'>
        {[90, 100, 75, 95, 60].map((w, i) => <div key={i} className='h-3 rounded bg-slate-200' style={{ width: `${w}%` }} />)}
        <p className='text-xs text-slate-400 pt-2'>Writing… this usually takes a few seconds.</p>
      </div>
    ) : show ? children : <p className='text-sm text-slate-400'>{empty}</p>}
  </section>
)

const TOOL_VIEWS = { 'cover-letter-generator': CoverLetter, 'resume-bullet-improver': Bullets, 'linkedin-headline-about-generator': LinkedIn, 'mock-interview-practice': MockInterview }
const KEYS = { 'cover-letter-generator': 'cover-letter', 'resume-bullet-improver': 'bullets', 'linkedin-headline-about-generator': 'linkedin', 'mock-interview-practice': 'mock-interview' }

const CareerTool = ({ slug }) => {
  const tool = C.tools.find((t) => t.slug === slug)
  const hub = tool && toolByPath(tool.path)
  const s = useToolSettings()
  const { token, user, loading } = useSelector((st) => st.auth)
  const [status, setStatus] = useState(null)
  useEffect(() => {
    if (!token || !tool?.needsLogin) return
    api.get('/api/tools/career/status', { headers: { Authorization: token } }).then(({ data }) => setStatus(data)).catch(() => {})
  }, [token, tool])

  const more = useMemo(() => {
    if (!hub) return []
    const all = visibleTools(s).filter((t) => t.id !== hub.id)
    return [...all.filter((t) => t.group === hub.group), ...all.filter((t) => t.group !== hub.group)].slice(0, 3)
  }, [hub, s])

  if (!tool) {
    return (<><SEO title='Tool not found' description='This tool could not be found.' path={`/products/${slug}`} noindex /><NavBar /><main className='max-w-xl mx-auto px-4 py-24 text-center'><h1 className='text-2xl font-semibold text-slate-800'>Tool not found</h1><p className='mt-4'><Link to='/products' className='text-brand-700 underline'>See all free tools</Link></p></main><Footer /></>)
  }
  const off = s.loaded && s[tool.flag] === false && user?.role !== 'admin'
  if (off && !loading) {
    return (<><SEO title={`${tool.name} is not available`} description='This tool is switched off right now.' path={tool.path} noindex /><NavBar /><main className='max-w-xl mx-auto px-4 py-24 text-center'><h1 className='text-2xl font-semibold text-slate-800'>This tool is not available right now</h1><p className='text-slate-600 mt-3'>Please check back later.</p><p className='mt-6'><Link to='/products' className='px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium'>See other free tools</Link></p></main><Footer /></>)
  }
  const View = TOOL_VIEWS[slug]
  const structured = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ['Products', '/products'], [tool.name, tool.path]].map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `https://primeresumeai.com${p}` })) },
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: `Prime Resume AI ${tool.name}`, url: `https://primeresumeai.com${tool.path}`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', description: tool.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: tool.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ]
  const signedIn = Boolean(token)
  return (
    <>
      <SEO title={tool.title} description={tool.description} path={tool.path} structuredData={structured} />
      <NavBar />
      <header className='bg-gradient-to-b from-brand-50 to-white border-b border-slate-100'>
        <div className='max-w-page xl:px-10 mx-auto px-4 pt-8 pb-8'>
          <div className='flex items-start gap-4'>
            {hub && <IconTile tool={hub} size='size-14' icon='size-6' />}
            <div className='min-w-0'>
              <h1 className='text-3xl sm:text-4xl font-bold text-slate-800 leading-tight'>{tool.h1}</h1>
              <p className='text-slate-600 mt-2 max-w-3xl'>{tool.intro}</p>
              {hub && <div className='mt-3'><Badges tool={hub} /></div>}
            </div>
          </div>
          <ol className={`mt-6 grid sm:grid-cols-3 gap-3 ${slug === 'code-playground' ? 'hidden' : ''}`} aria-label='How it works'>
            {tool.steps.map((x, i) => (
              <li key={x} className='flex items-start gap-3 rounded-xl bg-white/80 border border-slate-200 px-4 py-3'>
                <span className='size-6 shrink-0 rounded-full bg-brand-600 text-white text-xs font-semibold flex items-center justify-center'>{i + 1}</span>
                <span className='text-sm text-slate-700'>{x}</span>
              </li>
            ))}
          </ol>
        </div>
      </header>

      <main className='max-w-page xl:px-10 mx-auto px-4 py-10'>
        <section aria-label={tool.name}>
          {!signedIn ? (
            <div className='rounded-2xl border border-brand-200 bg-brand-50/50 p-8 max-w-2xl mx-auto text-center'>
              <span className='mx-auto size-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center'><LuLock className='size-5' aria-hidden /></span>
              <h2 className='font-semibold text-slate-800 text-lg mt-4'>Sign in to use this free tool</h2>
              <p className='text-sm text-slate-600 mt-1.5'>{tool.ai === false ? 'It is free. Create an account or log in to open the editor.' : 'It is free. An account keeps the daily limit fair for everyone, and nothing you type is added to your resume.'}</p>
              <p className='mt-5 flex flex-wrap justify-center gap-3'>
                <Link to={`/app?state=register&next=${encodeURIComponent(tool.path)}`} className={btn}>Create a free account</Link>
                <Link to={`/app?state=login&next=${encodeURIComponent(tool.path)}`} className='rounded-full border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 px-6 py-3'>Log in</Link>
              </p>
            </div>
          ) : (
            <>
              {View && status && status.limit != null && (
                <p className='text-xs text-slate-500 mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1'><span className={`size-2 rounded-full ${status.remaining > 0 ? 'bg-brand-500' : 'bg-amber-500'}`} />{status.remaining} of {status.limit} free uses left today, shared by the AI tools</p>
              )}
              {View ? <View token={token} /> : slug === 'code-playground' ? <Suspense fallback={<p className='text-slate-400 py-16 text-center'>Loading the editor…</p>}><Playground /></Suspense> : <OfferComparer />}
            </>
          )}
        </section>

        <div className='mt-14 grid lg:grid-cols-[1fr_1.2fr] gap-10'>
          <section>
            <h2 className='text-xl font-semibold text-slate-800'>Good to know</h2>
            <p className='mt-3 flex items-start gap-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4'><LuShieldCheck className='size-5 mt-0.5 shrink-0 text-brand-600' /><span>{tool.note}</span></p>
          </section>
          <section>
            <h2 className='text-xl font-semibold text-slate-800'>Frequently asked questions</h2>
            <div className='mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white'>
              {tool.faqs.map((f) => (
                <details key={f.q} className='group px-4 py-3'>
                  <summary className='flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-slate-800'>{f.q}<LuChevronDown className='size-4 shrink-0 text-slate-400 transition group-open:rotate-180' aria-hidden /></summary>
                  <p className='text-sm text-slate-600 mt-2'>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {more.length > 0 && (
          <section className='mt-14' aria-labelledby='more-tools'>
            <div className='flex items-baseline justify-between gap-3 mb-4'>
              <h2 id='more-tools' className='text-xl font-semibold text-slate-800'>More free tools</h2>
              <Link to='/products' className='text-sm font-medium text-brand-700 hover:underline'>See all tools</Link>
            </div>
            <ul className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>{more.map((t) => <li key={t.id}><ToolCard tool={t} /></li>)}</ul>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
export default CareerTool
