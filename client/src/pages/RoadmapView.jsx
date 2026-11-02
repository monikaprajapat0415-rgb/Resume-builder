import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import RoadmapPlan from '../components/RoadmapPlan'
import { useToolSettings } from '../utils/toolSettings'
import { dropServerJsonLd } from '../utils/seoDom'
import { LuBookOpen, LuCheck, LuClock, LuLayers, LuLightbulb, LuSparkles, LuUserRound } from 'react-icons/lu'

// Progress lives in this browser only. Storage can be blocked, so every access is wrapped.
const KEY = (slug) => `roadmap-progress:v2:${slug}`
const read = (slug) => { try { const v = JSON.parse(localStorage.getItem(KEY(slug)) || '{}'); return { steps: v.steps || [], skills: v.skills || [] } } catch { return { steps: [], skills: [] } } }
const write = (slug, v) => { try { localStorage.setItem(KEY(slug), JSON.stringify(v)) } catch { /* ignore */ } }

// small round badge in the corner of a box, like the ticks on roadmap.sh
const Badge = ({ kind }) => (
  <span aria-hidden='true' className={`absolute -right-2.5 -top-2.5 size-5 rounded-full flex items-center justify-center text-white ${kind === 'done' ? 'bg-purple-600' : 'bg-green-600'}`}>
    <LuCheck className='size-3' strokeWidth={3} />
  </span>
)

const RoadmapView = () => {
  const { slug } = useParams()
  const { user, token } = useSelector((s) => s.auth)
  const [data, setData] = useState(null)
  const [state, setState] = useState('loading')
  const tools = useToolSettings()
  const [mine, setMine] = useState({ steps: [], skills: [] })
  const [fit, setFit] = useState(null)          // what the profile shows: { hasData, steps: [{matched,status}], ... }
  const [showFit, setShowFit] = useState(true)
  const [more, setMore] = useState([])

  useEffect(() => {
    let live = true
    setState('loading'); setFit(null)
    api.get(`/api/roadmaps/${slug}`)
      .then(({ data }) => {
        if (!live) return
        setData(data); setMine(read(slug)); setState('ok')
        // related: other roadmaps of the same kind (role with role, technology with technology)
        api.get(`/api/roadmaps?kind=${data.roadmap.kind || 'career'}`).then(({ data: d }) => { if (live) setMore((d.roadmaps || []).filter((x) => x.slug !== slug).slice(0, 6)) }).catch(() => {})
      })
      .catch((e) => { if (live) setState(e.response?.status === 404 ? 'missing' : 'error') })
    return () => { live = false }
  }, [slug])

  // personal view: only for a signed-in user, from their own resume / CV / open-to-work profile
  useEffect(() => {
    if (!token) return
    let live = true
    api.get(`/api/roadmaps/${slug}/for-me`, { headers: { Authorization: token } })
      .then(({ data }) => { if (live) setFit(data) })
      .catch(() => { if (live) setFit({ hasData: false, failed: true }) })
    return () => { live = false }
  }, [slug, token])

  useEffect(() => { if (state !== 'loading') dropServerJsonLd() }, [state])

  const r = data?.roadmap
  const total = r ? r.steps.length + r.steps.reduce((n, s) => n + s.skills.length, 0) : 0
  const count = useMemo(() => (r ? mine.steps.filter((i) => i < r.steps.length).length + mine.skills.filter((k) => r.steps.some((s, i) => s.skills.some((x) => `${i}:${x}` === k))).length : 0), [mine, r])
  const pct = total ? Math.round((count / total) * 100) : 0

  const flip = (kind, id) => setMine((prev) => {
    const list = prev[kind]
    const next = { ...prev, [kind]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] }
    write(slug, next)
    return next
  })

  if (state === 'loading') return <div><NavBar /><p className='text-center text-slate-400 py-24'>Loading roadmap…</p></div>
  if (state !== 'ok') {
    return (
      <div>
        <SEO title='Roadmap not found' description='This roadmap could not be found.' noindex />
        <NavBar />
        <section className='max-w-2xl mx-auto px-4 py-24 text-center'>
          <h1 className='text-2xl font-semibold text-slate-800'>{state === 'missing' ? 'This roadmap does not exist' : 'Could not load this roadmap'}</h1>
          <p className='text-slate-500 mt-3'>{state === 'missing' ? 'It may have been moved or removed.' : 'Please refresh the page.'}</p>
          <Link to='/roadmaps' className='inline-block mt-6 text-brand-600 hover:underline'>See all career roadmaps</Link>
        </section>
        <Footer />
      </div>
    )
  }

  const seo = data.seo
  const personal = showFit && fit?.hasData
  const stepFit = (i) => (personal ? fit.steps[i] : null)

  // the banner under the title: sign in / add a profile / what the profile shows
  let banner
  if (!token) {
    banner = (
      <>
        <span className='flex items-center gap-2'><LuUserRound className='size-4 shrink-0' />See which steps you already cover, based on your own resume.</span>
        <Link to='/app?state=login' className='shrink-0 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700'>Log in to personalise</Link>
      </>
    )
  } else if (!fit) {
    banner = <span className='flex items-center gap-2'><LuSparkles className='size-4' />Checking your profile…</span>
  } else if (!fit.hasData) {
    banner = (
      <>
        <span className='flex items-center gap-2'><LuUserRound className='size-4 shrink-0' />{fit.failed ? 'Could not read your profile just now.' : 'Add your skills and experience to a resume and this roadmap will show what you already cover.'}</span>
        {!fit.failed && <Link to='/cv-builder' className='shrink-0 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700'>Build your resume</Link>}
      </>
    )
  } else {
    banner = (
      <>
        <span className='flex items-center gap-2'>
          <LuSparkles className='size-4 shrink-0' />
          <span>From your {fit.sources.join(', ')}: you already show <strong>{fit.matched} of {fit.total}</strong> skills ({fit.percent}%).{fit.nextStep !== null && <> Start at <strong>step {fit.nextStep + 1}</strong>.</>}</span>
        </span>
        <label className='flex shrink-0 items-center gap-2 text-xs cursor-pointer'>
          <input type='checkbox' checked={showFit} onChange={(e) => setShowFit(e.target.checked)} /> Show my matches
        </label>
      </>
    )
  }

  return (
    <div>
      <SEO title={seo.title} description={seo.description} keywords={seo.keywords} path={`/roadmaps/${r.slug}`} canonical={seo.canonical} robots={seo.robots} image={seo.image} imageAlt={seo.imageAlt} structuredData={data.jsonLd} />
      <NavBar />
      <section className='max-w-7xl mx-auto px-4 py-8'>
        <h1 className='text-3xl sm:text-4xl font-bold text-slate-900 leading-tight'>{r.title}</h1>
        <p className='text-slate-600 mt-3 max-w-3xl'>{r.description}</p>

        <div className='mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900'>{banner}</div>

        <div className='mt-4 grid gap-4 md:grid-cols-[1fr_auto] items-start'>
          <div className='rounded-lg border border-slate-200 bg-white p-4' role='group' aria-label='Your progress'>
            <div className='flex items-center justify-between text-sm'>
              <span className='font-medium text-slate-700'>Your progress</span>
              <span className='text-slate-500'>{count} of {total} ticked</span>
            </div>
            <div className='mt-2 h-2 rounded-full bg-slate-100 overflow-hidden' role='progressbar' aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
              <div className='h-full bg-purple-600 transition-all' style={{ width: `${pct}%` }} />
            </div>
            <p className='text-xs text-slate-400 mt-2'>Click a box to tick it. Saved in this browser only. The pace shown is a suggestion, not a promise.</p>
          </div>
          <ul className='rounded-lg border-2 border-slate-900 bg-white p-3 text-sm space-y-2 md:min-w-60' aria-label='What the ticks mean'>
            <li className='flex items-center gap-2'><span className='size-4 rounded-full bg-purple-600 flex items-center justify-center'><LuCheck className='size-2.5 text-white' strokeWidth={3} /></span>Done (ticked by you)</li>
            <li className='flex items-center gap-2'><span className='size-4 rounded-full bg-green-600 flex items-center justify-center'><LuCheck className='size-2.5 text-white' strokeWidth={3} /></span>Found in your profile</li>
            <li className='flex items-center gap-2'><span className='size-4 rounded border-2 border-slate-900 bg-yellow-300' />To do</li>
          </ul>
        </div>

        {tools.planTool !== false && r.steps.length > 0 && <RoadmapPlan roadmap={r} doneSteps={mine.steps} />}

        {r.stack?.length > 0 && (
          <section className='mt-8 rounded-lg border-2 border-slate-900 bg-white p-4 sm:p-5' aria-labelledby='stack-h'>
            <h2 id='stack-h' className='flex items-center gap-2 text-lg font-semibold text-slate-900'><LuLayers className='size-5' />The stack, end to end</h2>
            <p className='text-sm text-slate-500 mt-1'>Everything this path covers, grouped by layer. The step numbers show where each layer is learned.</p>
            <ul className='mt-4 space-y-2.5'>
              {r.stack.map((l) => (
                <li key={l.layer} className='grid sm:grid-cols-[9rem_1fr] gap-x-4 gap-y-1.5 items-start'>
                  <p className='text-sm font-semibold text-slate-800'>{l.layer}<span className='block text-xs font-normal text-slate-400'>step{l.steps.length > 1 ? 's' : ''} {l.steps.join(', ')}</span></p>
                  <ul className='flex flex-wrap gap-1.5'>{l.skills.map((k) => <li key={k} className='rounded-md border-2 border-slate-900 bg-yellow-200 px-2.5 py-1 text-xs font-medium text-slate-900'>{k}</li>)}</ul>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ol className='mt-10'>
          {r.steps.map((s, i) => {
            const sf = stepFit(i)
            const done = mine.steps.includes(i)
            const covered = sf?.status === 'have'
            const isNext = personal && fit.nextStep === i
            return (
              <li key={i} className='relative flex flex-col py-4 md:py-6 pl-6 md:pl-0 border-l-2 border-blue-500 md:border-l-0 ml-2 md:ml-0 md:grid md:grid-cols-[1fr_17rem_1fr] md:items-center md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-0.5 md:before:-translate-x-1/2 md:before:bg-blue-500'>
                {/* left: the explanation, like the note boxes on roadmap.sh */}
                <div className='md:relative md:pr-10 md:col-start-1 md:row-start-1 order-2 md:order-none mt-4 md:mt-0'>
                  <div className='hidden md:block absolute right-0 top-1/2 w-10 border-t-2 border-dotted border-blue-500' aria-hidden='true' />
                  <div className='rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 leading-relaxed'>
                    {s.pace && <p className='inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-2'><LuClock className='size-3.5' />{s.pace}</p>}
                    <p>{s.description}</p>
                    {s.tips.length > 0 && (
                      <ul className='mt-3 space-y-1.5'>
                        {s.tips.map((t) => <li key={t} className='flex gap-2 text-slate-600'><LuLightbulb className='size-4 text-amber-500 shrink-0 mt-0.5' /><span>{t}</span></li>)}
                      </ul>
                    )}
                    {s.resources?.length > 0 && (
                      <div className='mt-4'>
                        <p className='flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500'><LuBookOpen className='size-3.5' />Best places to learn</p>
                        <ul className='mt-1.5 space-y-1'>
                          {s.resources.map((x) => (
                            <li key={x.url} className='flex flex-wrap items-baseline gap-x-2'>
                              <a href={x.url} target='_blank' rel='noopener noreferrer' className='text-brand-700 hover:underline font-medium'>{x.label}</a>
                              <span className='text-xs text-slate-400'>{x.type}{x.free ? ' · free' : ' · paid or free trial'}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {s.links.length > 0 && (
                      <div className='mt-3 flex flex-wrap gap-2'>
                        {s.links.map((l) => (l.url.startsWith('/')
                          ? <Link key={l.url} to={l.url} className='rounded-md bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800 transition'>{l.label}</Link>
                          : <a key={l.url} href={l.url} target='_blank' rel='noopener noreferrer' className='rounded-md bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800 transition'>{l.label}</a>))}
                      </div>
                    )}
                  </div>
                </div>

                {/* centre: the step on the spine */}
                <div className='md:col-start-2 md:row-start-1 relative z-10 order-1 md:order-none flex justify-center'>
                  {isNext && <span className='absolute -top-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white whitespace-nowrap'>Start here</span>}
                  <button
                    type='button'
                    onClick={() => flip('steps', i)}
                    aria-pressed={done}
                    className={`relative w-full md:w-64 rounded-md border-2 border-slate-900 px-4 py-3 text-left font-semibold text-slate-900 shadow-[3px_3px_0_0_#0f172a] transition active:translate-x-px active:translate-y-px ${done ? 'bg-yellow-200' : 'bg-yellow-300 hover:bg-yellow-200'} ${isNext ? 'ring-4 ring-slate-900/15' : ''}`}
                  >
                    <span className='text-xs font-medium text-slate-700 block'>Step {i + 1}</span>
                    {s.title}
                    {done && <Badge kind='done' />}
                    {!done && covered && <Badge kind='found' />}
                  </button>
                </div>

                {/* right: the skills, branching off with dotted lines */}
                <div className='md:relative md:pl-10 md:col-start-3 md:row-start-1 order-3 md:order-none mt-4 md:mt-0'>
                  {s.skills.length > 0 && <div className='hidden md:block absolute left-0 top-1/2 w-10 border-t-2 border-dotted border-blue-500' aria-hidden='true' />}
                  <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2.5'>
                    {s.skills.map((k) => {
                      const id = `${i}:${k}`
                      const kDone = mine.skills.includes(id)
                      const found = !!sf && sf.matched.includes(k)
                      return (
                        <li key={k}>
                          <button
                            type='button'
                            onClick={() => flip('skills', id)}
                            aria-pressed={kDone}
                            title={found ? 'Found in your profile' : undefined}
                            className={`relative w-full rounded-md border-2 border-slate-900 px-3 py-2 text-left text-sm font-medium text-slate-900 transition ${kDone ? 'bg-yellow-100' : 'bg-yellow-200 hover:bg-yellow-100'}`}
                          >
                            {k}
                            {kDone ? <Badge kind='done' /> : found ? <Badge kind='found' /> : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </li>
            )
          })}
        </ol>

        {r.faqs.length > 0 && (
          <div className='mt-14 max-w-3xl mx-auto'>
            <h2 className='text-2xl font-semibold text-slate-800 mb-4'>Frequently asked questions</h2>
            <div className='space-y-3'>
              {r.faqs.map((f) => (
                <details key={f.q} className='rounded-xl border border-slate-200 bg-white p-4'>
                  <summary className='font-medium text-slate-800 cursor-pointer'>{f.q}</summary>
                  <p className='text-slate-600 mt-2'>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {more.length > 0 && (
          <div className='mt-12 rounded-lg border-2 border-slate-900 bg-white p-5 max-w-3xl mx-auto'>
            <h2 className='font-semibold text-slate-900'>Related roadmaps</h2>
            <ul className='mt-3 space-y-2'>
              {more.map((m) => <li key={m.slug}><Link to={`/roadmaps/${m.slug}`} className='text-sm text-slate-700 hover:text-brand-600 hover:underline'>{m.title.replace(/: Career Roadmap$/, '')}</Link></li>)}
            </ul>
          </div>
        )}

        <div className='mt-10 rounded-xl bg-brand-50 border border-brand-100 p-6 text-center max-w-3xl mx-auto'>
          <h2 className='text-lg font-semibold text-slate-800'>Ready to take the next step?</h2>
          <p className='text-slate-600 mt-1'>Build a clear resume and see how it scores before you apply.</p>
          <div className='flex flex-wrap justify-center gap-3 mt-4'>
            <Link to='/cv-builder' className='px-5 py-2 bg-brand-500 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>Build your resume</Link>
            <Link to='/jobs' className='px-5 py-2 border border-slate-300 hover:bg-white rounded-full text-sm font-medium text-slate-700 transition'>Browse jobs</Link>
            <Link to='/roadmaps' className='px-5 py-2 border border-slate-300 hover:bg-white rounded-full text-sm font-medium text-slate-700 transition'>All roadmaps</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default RoadmapView
