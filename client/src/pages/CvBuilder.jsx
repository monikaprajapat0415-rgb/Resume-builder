import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { BiLoaderAlt } from 'react-icons/bi'
import { LuArrowLeft, LuArrowRight, LuCheck, LuCopy, LuDownload, LuPrinter, LuSparkles, LuTriangleAlert, LuLightbulb, LuRefreshCw } from 'react-icons/lu'
import SEO from '../components/SEO'
import api from '../configs/api'
import CvDocument from '../components/cv/CvDocument'
import { Area, Field, Lines, Repeater, Text, inputCls } from '../components/cv/CvFields'
import { CV_TEMPLATES, cvToText, emptyCv, emptyInput } from '../utils/cvModel'
import { downloadCvPdf } from '../utils/cvPdf'

const STEPS = ['Target job', 'Contact', 'Education', 'Experience', 'Internships & projects', 'Skills & extras', 'Generate & review']
const COLORS = ['#1E3A8A', '#0F766E', '#7C3AED', '#BE123C', '#B45309', '#111827']
const MAX_GEN = 8

const snap = (s) => JSON.stringify({ t: s.title, tp: s.template, a: s.accent_color, tg: s.target, p: s.personal_info, i: s.input, c: s.cv })

const CvBuilder = () => {
  const { cvId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const auth = { headers: { Authorization: token } }

  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [doc, setDoc] = useState(null) // { title, template, accent_color, target, personal_info, input, cv, generated, generations }
  const [step, setStep] = useState(0)
  const [saveState, setSaveState] = useState('saved') // saved | saving | error
  const [generating, setGenerating] = useState(false)
  const [genKey, setGenKey] = useState(0) // remounts the review editors after a new generation
  const lastSynced = useRef('')
  const timer = useRef(null)
  const inFlight = useRef(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/cvs/get/${cvId}`, auth)
        const c = data.cv
        const d = { ...c, input: { ...emptyInput(), ...(c.input || {}) }, cv: { ...emptyCv(), ...(c.cv || {}) }, target: { level: 'fresher', ...(c.target || {}) }, personal_info: c.personal_info || {} }
        setDoc(d); lastSynced.current = snap(d)
        if (c.generated) setStep(STEPS.length - 1)
        document.title = `${c.title} | CV Builder`
      } catch (e) {
        setLoadError(e.response?.status === 404 ? 'This CV was not found.' : 'Could not load this CV. Please try again.')
      }
      setLoaded(true)
    })()
    return () => clearTimeout(timer.current)
  }, [cvId])

  const save = async (d = doc) => {
    const s = snap(d)
    if (s === lastSynced.current) return true
    setSaveState('saving')
    try {
      await api.put('/api/cvs/update', { cvId, title: d.title, template: d.template, accent_color: d.accent_color, target: d.target, personal_info: d.personal_info, input: d.input, cv: d.cv }, auth)
      lastSynced.current = s; setSaveState('saved'); return true
    } catch { setSaveState('error'); return false }
  }

  // autosave 1.2s after the last edit
  useEffect(() => {
    if (!doc || snap(doc) === lastSynced.current) return
    setSaveState('saving')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { inFlight.current = save(doc) }, 1200)
    return () => clearTimeout(timer.current)
  }, [doc])

  const patch = (p) => setDoc((d) => ({ ...d, ...p }))
  const setTarget = (p) => setDoc((d) => ({ ...d, target: { ...d.target, ...p } }))
  const setPersonal = (p) => setDoc((d) => ({ ...d, personal_info: { ...d.personal_info, ...p } }))
  const setInput = (p) => setDoc((d) => ({ ...d, input: { ...d.input, ...p } }))
  const setCv = (p) => setDoc((d) => ({ ...d, cv: { ...d.cv, ...p } }))

  if (!loaded) return <div className='py-24 text-center text-slate-500'><BiLoaderAlt className='size-6 animate-spin mx-auto' /></div>
  if (loadError || !doc) return (
    <div className='max-w-md mx-auto py-24 text-center'>
      <p className='text-slate-700'>{loadError}</p>
      <Link to='/app' className='inline-block mt-4 text-brand-700 underline'>Back to dashboard</Link>
    </div>
  )

  const { target, personal_info: pi, input, cv } = doc
  const emailOk = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test((pi.email || '').trim())
  const phoneOk = (pi.phone || '').replace(/\D/g, '').length >= 7

  const validate = (i) => {
    if (i === 0 && !target.job_title?.trim()) { toast.error('Enter the job title you are applying for'); return false }
    if (i === 1) {
      if (!pi.full_name?.trim()) { toast.error('Full name is required'); return false }
      if (!emailOk) { toast.error('Enter a valid email address'); return false }
      if (!phoneOk) { toast.error('Enter a valid phone number'); return false }
    }
    if (i === 2) for (const e of input.education) if ((e.qualification || e.institution) && !(e.qualification?.trim() && e.institution?.trim())) { toast.error('Each education entry needs a qualification and an institution'); return false }
    if (i === 3) for (const e of input.experience) if ((e.job_title || e.company || e.details) && !(e.job_title?.trim() && e.company?.trim())) { toast.error('Each experience entry needs a job title and a company'); return false }
    return true
  }
  const goTo = (i) => { if (i > step) { for (let k = step; k < i; k++) if (!validate(k)) return } setStep(i); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const hasContent = input.experience.some((e) => e.company || e.job_title) || input.education.some((e) => e.institution || e.qualification)
    || input.projects.some((p) => p.name) || input.internships.some((e) => e.company || e.job_title)
  const remaining = MAX_GEN - (doc.generations || 0)

  const generate = async () => {
    for (let k = 0; k < 4; k++) if (!validate(k)) { setStep(k); return }
    if (!hasContent) { toast.error('Add at least one education, experience, internship or project entry first'); return }
    setGenerating(true)
    try {
      clearTimeout(timer.current)
      if (!(await save())) throw new Error('Could not save your details. Check your connection and try again.')
      const { data } = await api.post('/api/ai/generate-cv', { cvId }, auth)
      const next = { ...doc, cv: { ...emptyCv(), ...data.cv }, generated: true, generations: data.generations }
      setDoc(next); lastSynced.current = snap(next); setGenKey((k) => k + 1); setSaveState('saved')
      toast.success('Your CV is ready - review it below')
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Could not generate your CV. Please try again.')
    }
    setGenerating(false)
  }

  const level = target.level
  const fileName = `${pi.full_name || 'cv'}-cv`
  const download = () => {
    if (!doc.generated) { toast.error('Generate your CV first'); return }
    try { downloadCvPdf({ cv, personal: pi, template: doc.template, accentColor: doc.accent_color, level, fileName }) }
    catch (e) { console.error(e); toast.error('Could not create the PDF') }
  }
  const copyText = async () => {
    try { await navigator.clipboard.writeText(cvToText(cv, pi, level)); toast.success('CV text copied') } catch { toast.error('Could not copy') }
  }

  // ---------------------------------------------------------------- steps
  const stepBody = [
    // 0 target
    <div key='s0' className='space-y-4'>
      <p className='text-sm text-slate-600'>Tell us the job you want. The AI tailors your summary, skills and bullet points to it.</p>
      <Text label='Job title you are applying for' required value={target.job_title} onChange={(v) => setTarget({ job_title: v })} placeholder='e.g. Full Stack Developer' maxLength={120} />
      <div className='grid sm:grid-cols-2 gap-4'>
        <Text label='Company (optional)' value={target.company} onChange={(v) => setTarget({ company: v })} maxLength={120} />
        <Text label='Industry (optional)' value={target.industry} onChange={(v) => setTarget({ industry: v })} placeholder='e.g. IT services, Banking' maxLength={120} />
      </div>
      <fieldset>
        <legend className='block text-sm font-medium text-slate-700 mb-1'>Your experience level</legend>
        <div className='grid grid-cols-2 gap-3'>
          {[['fresher', 'Fresher / student', 'Education and projects lead'], ['experienced', 'Experienced', 'Work experience leads']].map(([v, t, d]) => (
            <button type='button' key={v} onClick={() => setTarget({ level: v })} className={`text-left rounded-xl border p-3 transition ${target.level === v ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600' : 'border-slate-300 hover:bg-slate-50'}`}>
              <span className='block text-sm font-semibold text-slate-800'>{t}</span><span className='block text-xs text-slate-500'>{d}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <Area label='Job description (recommended)' rows={8} value={target.job_description} onChange={(v) => setTarget({ job_description: v })} maxLength={8000}
        hint='Paste the full job post. We use its keywords naturally, and only where they match what you have really done.' />
    </div>,
    // 1 contact
    <div key='s1' className='space-y-4'>
      <p className='text-sm text-slate-600'>Only add what you want recruiters to see. We never add a photo, age or marital status.</p>
      <Text label='Full name' required value={pi.full_name} onChange={(v) => setPersonal({ full_name: v })} maxLength={100} />
      <div className='grid sm:grid-cols-2 gap-4'>
        <Text label='Email' required type='email' value={pi.email} onChange={(v) => setPersonal({ email: v })} maxLength={120} />
        <Text label='Phone' required type='tel' value={pi.phone} onChange={(v) => setPersonal({ phone: v })} maxLength={20} />
      </div>
      <Text label='Location' value={pi.location} onChange={(v) => setPersonal({ location: v })} placeholder='City, State/Country' maxLength={120} />
      <div className='grid sm:grid-cols-2 gap-4'>
        <Text label='LinkedIn URL' value={pi.linkedin} onChange={(v) => setPersonal({ linkedin: v })} maxLength={200} />
        <Text label='Website / portfolio / GitHub' value={pi.website} onChange={(v) => setPersonal({ website: v })} maxLength={200} />
      </div>
    </div>,
    // 2 education
    <div key='s2' className='space-y-4'>
      <Repeater items={input.education} onChange={(education) => setInput({ education })} addLabel='Add education'
        blank={{ qualification: '', institution: '', graduation_year: '', details: '' }} emptyText='Add your highest qualification first, then earlier ones.'
        render={(e, set) => (<>
          <Text label='Degree / qualification' required value={e.qualification} onChange={(v) => set({ qualification: v })} placeholder='B.Tech in Computer Science' />
          <div className='grid sm:grid-cols-3 gap-3'>
            <div className='sm:col-span-2'><Text label='Institution' required value={e.institution} onChange={(v) => set({ institution: v })} /></div>
            <Text label='Graduation year' value={e.graduation_year} onChange={(v) => set({ graduation_year: v })} placeholder='2024' maxLength={9} />
          </div>
        </>)} />
    </div>,
    // 3 experience
    <div key='s3' className='space-y-4'>
      <p className='text-sm text-slate-600'>{level === 'fresher' ? 'No full-time job yet? Skip this and use the next step for internships and projects.' : 'List your jobs. The newest is placed first automatically.'}</p>
      <Repeater items={input.experience} onChange={(experience) => setInput({ experience })} addLabel='Add job'
        blank={{ job_title: '', company: '', location: '', start_date: '', end_date: '', is_current: false, details: '' }}
        render={(e, set) => (<>
          <div className='grid sm:grid-cols-2 gap-3 pr-8'>
            <Text label='Job title' required value={e.job_title} onChange={(v) => set({ job_title: v })} />
            <Text label='Company' required value={e.company} onChange={(v) => set({ company: v })} />
          </div>
          <Text label='Location' value={e.location} onChange={(v) => set({ location: v })} />
          <div className='grid sm:grid-cols-2 gap-3'>
            <Field label='Start date'><input type='month' className={inputCls} value={e.start_date || ''} onChange={(ev) => set({ start_date: ev.target.value })} /></Field>
            <Field label='End date'><input type='month' className={inputCls} disabled={e.is_current} value={e.is_current ? '' : e.end_date || ''} onChange={(ev) => set({ end_date: ev.target.value })} /></Field>
          </div>
          <label className='flex items-center gap-2 text-sm text-slate-700'><input type='checkbox' checked={!!e.is_current} onChange={(ev) => set({ is_current: ev.target.checked })} /> I currently work here</label>
          <Area label='What you did and achieved' rows={5} value={e.details} onChange={(v) => set({ details: v })}
            hint='One point per line. Add real numbers only if you have them (e.g. "reduced load time by 30%"). We will not invent any.' />
        </>)} />
    </div>,
    // 4 internships + projects
    <div key='s4' className='space-y-8'>
      <div className='space-y-3'>
        <h4 className='font-semibold text-slate-800'>Internships</h4>
        <Repeater items={input.internships} onChange={(internships) => setInput({ internships })} addLabel='Add internship'
          blank={{ job_title: '', company: '', location: '', start_date: '', end_date: '', details: '' }}
          render={(e, set) => (<>
            <div className='grid sm:grid-cols-2 gap-3 pr-8'>
              <Text label='Role' value={e.job_title} onChange={(v) => set({ job_title: v })} />
              <Text label='Company' value={e.company} onChange={(v) => set({ company: v })} />
            </div>
            <div className='grid sm:grid-cols-2 gap-3'>
              <Field label='Start date'><input type='month' className={inputCls} value={e.start_date || ''} onChange={(ev) => set({ start_date: ev.target.value })} /></Field>
              <Field label='End date'><input type='month' className={inputCls} value={e.end_date || ''} onChange={(ev) => set({ end_date: ev.target.value })} /></Field>
            </div>
            <Area label='What you did' rows={4} value={e.details} onChange={(v) => set({ details: v })} hint='One point per line.' />
          </>)} />
      </div>
      <div className='space-y-3'>
        <h4 className='font-semibold text-slate-800'>Projects</h4>
        <Repeater items={input.projects} onChange={(projects) => setInput({ projects })} addLabel='Add project'
          blank={{ name: '', technologies: '', details: '' }}
          render={(p, set) => (<>
            <div className='pr-8'><Text label='Project name' value={p.name} onChange={(v) => set({ name: v })} /></div>
            <Text label='Technologies / tools' value={p.technologies} onChange={(v) => set({ technologies: v })} placeholder='React, Node.js, MongoDB' />
            <Area label='What it does and your role' rows={4} value={p.details} onChange={(v) => set({ details: v })} />
          </>)} />
      </div>
    </div>,
    // 5 skills & extras
    <div key='s5' className='space-y-4'>
      <Lines label='Skills' commas rows={3} value={input.skills} onChange={(skills) => setInput({ skills })} placeholder='React, Node.js, MongoDB, REST APIs'
        hint='Comma separated. Only list skills you really have: the AI will not add any.' />
      <Area label='Notes for your summary (optional)' rows={3} value={input.summary_notes} onChange={(v) => setInput({ summary_notes: v })}
        hint='Career goals, strengths, what you want recruiters to know. The AI turns this into a professional summary.' />
      <Lines label='Certifications' rows={3} value={input.certifications} onChange={(certifications) => setInput({ certifications })} hint='One per line.' />
      <Lines label='Achievements & awards' rows={3} value={input.achievements} onChange={(achievements) => setInput({ achievements })} hint='One per line.' />
      <Lines label='Languages' commas rows={2} value={input.languages} onChange={(languages) => setInput({ languages })} placeholder='English, Hindi' />
      <Lines label='Other information (optional)' rows={2} value={input.additional_information} onChange={(additional_information) => setInput({ additional_information })} hint='Volunteering, publications, availability... one per line. References are not included unless you add them here.' />
    </div>,
    // 6 generate & review
    <div key='s6' className='space-y-5'>
      <div className='rounded-xl border border-brand-200 bg-brand-50/60 p-4'>
        <div className='flex items-start gap-3'>
          <LuSparkles className='size-5 text-brand-600 mt-0.5 shrink-0' />
          <div className='flex-1'>
            <p className='font-semibold text-slate-800'>{doc.generated ? 'Your CV is ready' : 'Ready to write your CV'}</p>
            <p className='text-sm text-slate-600 mt-0.5'>The AI only rewrites what you entered. Employers, dates, degrees and numbers always stay exactly as you typed them.</p>
            <button type='button' disabled={generating || remaining <= 0} onClick={generate}
              className='mt-3 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-full text-sm font-medium transition'>
              {generating ? <BiLoaderAlt className='size-4 animate-spin' /> : doc.generated ? <LuRefreshCw className='size-4' /> : <LuSparkles className='size-4' />}
              {generating ? 'Writing your CV...' : doc.generated ? 'Regenerate with AI' : 'Generate my CV'}
            </button>
            {doc.generated && <p className='text-xs text-slate-500 mt-2'>Regenerating replaces your edits below. {remaining} of {MAX_GEN} AI runs left for this CV.</p>}
          </div>
        </div>
      </div>

      {doc.generated && (<>
        {cv.missing_information?.length > 0 && (
          <div className='rounded-xl border border-amber-200 bg-amber-50 p-4'>
            <p className='flex items-center gap-2 text-sm font-semibold text-amber-900'><LuTriangleAlert className='size-4' />Missing or needs attention</p>
            <ul className='list-disc pl-5 mt-1.5 text-sm text-amber-900 space-y-0.5'>{cv.missing_information.map((m, i) => <li key={i}>{m}</li>)}</ul>
          </div>
        )}
        {cv.ats_recommendations?.length > 0 && (
          <div className='rounded-xl border border-sky-200 bg-sky-50 p-4'>
            <p className='flex items-center gap-2 text-sm font-semibold text-sky-900'><LuLightbulb className='size-4' />ATS tips</p>
            <ul className='list-disc pl-5 mt-1.5 text-sm text-sky-900 space-y-0.5'>{cv.ats_recommendations.map((m, i) => <li key={i}>{m}</li>)}</ul>
          </div>
        )}

        <h4 className='font-semibold text-slate-800 pt-2'>Review and edit</h4>
        <div key={genKey} className='space-y-4'>
          <Area label='Professional summary' rows={4} value={cv.professional_summary} onChange={(v) => setCv({ professional_summary: v })} />
          <Lines label='Skills' commas value={cv.skills} onChange={(skills) => setCv({ skills })} />
          {[['experience', 'Professional experience'], ['internships', 'Internships']].map(([key, label]) => cv[key]?.length > 0 && (
            <div key={key} className='space-y-3'>
              <p className='text-sm font-semibold text-slate-700'>{label}</p>
              {cv[key].map((e, i) => (
                <div key={i} className='border border-slate-200 rounded-xl p-3 space-y-2 bg-white'>
                  <p className='text-sm font-medium text-slate-800'>{[e.job_title, e.company].filter(Boolean).join(', ')} <span className='text-slate-500 font-normal'>{[e.start_date, e.end_date].filter(Boolean).join(' – ')}</span></p>
                  <Lines label='Bullet points' rows={Math.max(3, (e.responsibilities || []).length + 1)} value={e.responsibilities}
                    onChange={(r) => setCv({ [key]: cv[key].map((x, idx) => (idx === i ? { ...x, responsibilities: r } : x)) })} />
                </div>
              ))}
            </div>
          ))}
          {cv.projects?.length > 0 && (
            <div className='space-y-3'>
              <p className='text-sm font-semibold text-slate-700'>Projects</p>
              {cv.projects.map((p, i) => (
                <div key={i} className='border border-slate-200 rounded-xl p-3 space-y-2 bg-white'>
                  <p className='text-sm font-medium text-slate-800'>{p.project_name}</p>
                  <Area label='Description' rows={3} value={p.description} onChange={(v) => setCv({ projects: cv.projects.map((x, idx) => (idx === i ? { ...x, description: v } : x)) })} />
                </div>
              ))}
            </div>
          )}
          {cv.achievements?.length > 0 && <Lines label='Achievements' value={cv.achievements} onChange={(achievements) => setCv({ achievements })} />}
        </div>
      </>)}
    </div>,
  ]

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <SEO title='CV Builder' description='Build an ATS-friendly CV with AI.' path={`/app/cv/${cvId}`} noindex />
      <div className='flex flex-wrap items-center gap-3 mb-5'>
        <Link to='/app?tab=cvs' className='inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900'><LuArrowLeft className='size-4' />My CVs</Link>
        <input aria-label='CV title' value={doc.title || ''} onChange={(e) => patch({ title: e.target.value })} maxLength={120} className='flex-1 min-w-[10rem] max-w-md px-3 py-1.5 text-sm font-medium border border-transparent hover:border-slate-300 focus:border-brand-500 rounded-md bg-transparent focus:outline-none' />
        <span className={`text-xs ${saveState === 'error' ? 'text-red-600' : 'text-slate-400'}`} data-testid='save-state'>
          {saveState === 'saving' ? 'Saving...' : saveState === 'error' ? 'Not saved - check connection' : 'All changes saved'}
        </span>
      </div>

      <nav aria-label='CV steps' className='flex gap-2 overflow-x-auto pb-2 mb-5'>
        {STEPS.map((name, i) => (
          <button key={name} type='button' onClick={() => goTo(i)} aria-current={i === step ? 'step' : undefined}
            className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm border transition ${i === step ? 'bg-brand-600 text-white border-brand-600' : i < step ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>
            <span className={`size-5 rounded-full text-xs flex items-center justify-center ${i === step ? 'bg-white/25' : 'bg-slate-100 text-slate-600'}`}>{i < step ? <LuCheck className='size-3' /> : i + 1}</span>{name}
          </button>
        ))}
      </nav>

      <div className='grid lg:grid-cols-12 gap-6 items-start'>
        <section className='lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm'>
          <h2 className='text-lg font-semibold text-slate-800 mb-4'>{STEPS[step]}</h2>
          {stepBody[step]}
          <div className='flex justify-between mt-6 pt-4 border-t border-slate-100'>
            <button type='button' disabled={step === 0} onClick={() => goTo(step - 1)} className='inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-full disabled:opacity-40 hover:bg-slate-50'><LuArrowLeft className='size-4' />Back</button>
            {step < STEPS.length - 1 && <button type='button' onClick={() => goTo(step + 1)} className='inline-flex items-center gap-2 px-5 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-full'>{step === STEPS.length - 2 ? 'Review & generate' : 'Next'}<LuArrowRight className='size-4' /></button>}
          </div>
        </section>

        <section className='lg:col-span-7 lg:sticky lg:top-4'>
          <div className='flex flex-wrap items-center gap-3 mb-3'>
            <div className='flex items-center gap-1.5' role='group' aria-label='Template'>
              {CV_TEMPLATES.map((t) => (
                <button key={t.id} type='button' title={t.desc} onClick={() => patch({ template: t.id })} className={`px-3 py-1.5 text-xs rounded-full border transition ${doc.template === t.id ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{t.name}</button>
              ))}
            </div>
            {doc.template !== 'classic' && (
              <div className='flex items-center gap-1.5' role='group' aria-label='Heading colour'>
                {COLORS.map((c) => <button key={c} type='button' aria-label={`Colour ${c}`} onClick={() => patch({ accent_color: c })} className={`size-5 rounded-full border-2 ${doc.accent_color === c ? 'border-slate-800' : 'border-white ring-1 ring-slate-300'}`} style={{ background: c }} />)}
              </div>
            )}
            <div className='flex gap-2 ml-auto'>
              <button type='button' onClick={copyText} disabled={!doc.generated} className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-300 rounded-full hover:bg-slate-50 disabled:opacity-40'><LuCopy className='size-3.5' />Copy text</button>
              <button type='button' onClick={() => window.print()} disabled={!doc.generated} className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-300 rounded-full hover:bg-slate-50 disabled:opacity-40'><LuPrinter className='size-3.5' />Print</button>
              <button type='button' onClick={download} disabled={!doc.generated} className='inline-flex items-center gap-1.5 px-4 py-1.5 text-xs bg-brand-600 hover:bg-brand-700 text-white rounded-full disabled:opacity-40'><LuDownload className='size-3.5' />Download PDF</button>
            </div>
          </div>
          <div className='overflow-auto max-h-[80vh] rounded-xl bg-slate-100 p-3'>
            <CvDocument cv={cv} personal={pi} template={doc.template} accentColor={doc.accent_color} level={level} />
          </div>
        </section>
      </div>
    </div>
  )
}

export default CvBuilder
