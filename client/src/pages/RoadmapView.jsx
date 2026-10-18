import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { dropServerJsonLd } from '../utils/seoDom'
import { LuCheck, LuClock, LuLightbulb, LuArrowRight } from 'react-icons/lu'

// Progress is kept in this browser only. Wrapped in try/catch because storage can be blocked.
const KEY = (slug) => `roadmap-progress:${slug}`
const readDone = (slug) => { try { return JSON.parse(localStorage.getItem(KEY(slug)) || '[]') } catch { return [] } }
const saveDone = (slug, v) => { try { localStorage.setItem(KEY(slug), JSON.stringify(v)) } catch { /* ignore */ } }

const isInternal = (u) => u.startsWith('/')

const RoadmapView = () => {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [state, setState] = useState('loading')
  const [done, setDone] = useState([])

  useEffect(() => {
    let live = true
    setState('loading')
    api.get(`/api/roadmaps/${slug}`)
      .then(({ data }) => { if (live) { setData(data); setDone(readDone(slug)); setState('ok') } })
      .catch((e) => { if (live) setState(e.response?.status === 404 ? 'missing' : 'error') })
    return () => { live = false }
  }, [slug])

  useEffect(() => { if (state !== 'loading') dropServerJsonLd() }, [state])

  const toggle = (i) => setDone((prev) => {
    const next = prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    saveDone(slug, next)
    return next
  })

  const r = data?.roadmap
  const total = r?.steps.length || 0
  const count = useMemo(() => done.filter((i) => i < total).length, [done, total])
  const pct = total ? Math.round((count / total) * 100) : 0

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
  return (
    <div>
      <SEO title={seo.title} description={seo.description} keywords={seo.keywords} path={`/roadmaps/${r.slug}`} canonical={seo.canonical} robots={seo.robots} image={seo.image} imageAlt={seo.imageAlt} structuredData={data.jsonLd} />
      <NavBar />
      <section className='max-w-3xl mx-auto px-4 py-10'>
        <div className='flex items-start gap-4'>
          <span aria-hidden='true' className='size-14 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0 text-lg'>{r.badge || r.title.slice(0, 2).toUpperCase()}</span>
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold text-slate-800 leading-tight'>{r.title}</h1>
            <p className='text-slate-500 mt-3'>{r.description}</p>
          </div>
        </div>

        <div className='mt-8 rounded-xl border border-slate-200 bg-white p-4' role='group' aria-label='Your progress'>
          <div className='flex items-center justify-between text-sm'>
            <span className='font-medium text-slate-700'>Your progress</span>
            <span className='text-slate-500'>{count} of {total} steps</span>
          </div>
          <div className='mt-2 h-2 rounded-full bg-slate-100 overflow-hidden' role='progressbar' aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <div className='h-full bg-brand-500 transition-all' style={{ width: `${pct}%` }} />
          </div>
          <p className='text-xs text-slate-400 mt-2'>Saved in this browser only. The pace shown is a suggestion, not a promise. Everyone moves at their own speed.</p>
        </div>

        <ol className='relative mt-10'>
          {r.steps.map((s, i) => {
            const checked = done.includes(i)
            return (
              <li key={i} className='relative pl-12 sm:pl-16 pb-8 last:pb-0'>
                {i < total - 1 && <span aria-hidden='true' className='absolute left-[1.15rem] sm:left-[1.4rem] top-10 bottom-0 w-0.5 bg-slate-200' />}
                <button
                  type='button'
                  onClick={() => toggle(i)}
                  aria-pressed={checked}
                  aria-label={`${checked ? 'Mark as not done' : 'Mark as done'}: ${s.title}`}
                  className={`absolute left-0 top-0 size-10 sm:size-12 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition active:scale-95 ${checked ? 'bg-brand-500 border-brand-500 text-white' : 'bg-white border-slate-300 text-slate-500 hover:border-brand-400'}`}
                >
                  {checked ? <LuCheck className='size-5' /> : i + 1}
                </button>
                <div className={`rounded-xl border bg-white p-5 transition ${checked ? 'border-brand-200 bg-brand-50/40' : 'border-slate-200'}`}>
                  {s.pace && <p className='inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-brand-50 rounded-full px-2.5 py-1'><LuClock className='size-3.5' />{s.pace}</p>}
                  <h2 className='text-lg font-semibold text-slate-800 mt-2'>{s.title}</h2>
                  <p className='text-slate-600 mt-2 leading-relaxed'>{s.description}</p>
                  {s.skills.length > 0 && (
                    <div className='mt-4'>
                      <h3 className='text-xs font-semibold uppercase tracking-wide text-slate-400'>Skills to build</h3>
                      <ul className='flex flex-wrap gap-2 mt-2'>
                        {s.skills.map((k) => <li key={k} className='text-sm bg-slate-100 text-slate-700 rounded-full px-3 py-1'>{k}</li>)}
                      </ul>
                    </div>
                  )}
                  {s.tips.length > 0 && (
                    <ul className='mt-4 space-y-2'>
                      {s.tips.map((t) => <li key={t} className='flex gap-2 text-sm text-slate-600'><LuLightbulb className='size-4 text-amber-500 shrink-0 mt-0.5' /><span>{t}</span></li>)}
                    </ul>
                  )}
                  {s.links.length > 0 && (
                    <div className='flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-slate-100'>
                      {s.links.map((l) => isInternal(l.url)
                        ? <Link key={l.url} to={l.url} className='inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline'>{l.label}<LuArrowRight className='size-3.5' /></Link>
                        : <a key={l.url} href={l.url} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline'>{l.label}<LuArrowRight className='size-3.5' /></a>)}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        {r.faqs.length > 0 && (
          <div className='mt-14'>
            <h2 className='text-2xl font-semibold text-slate-800 mb-4'>Frequently asked questions</h2>
            <div className='space-y-3'>
              {r.faqs.map((f) => (
                <details key={f.q} className='rounded-xl border border-slate-200 bg-white p-4 group'>
                  <summary className='font-medium text-slate-800 cursor-pointer'>{f.q}</summary>
                  <p className='text-slate-600 mt-2'>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        <div className='mt-12 rounded-xl bg-brand-50 border border-brand-100 p-6 text-center'>
          <h2 className='text-lg font-semibold text-slate-800'>Ready to take the next step?</h2>
          <p className='text-slate-600 mt-1'>Build a clear resume and see how it scores before you apply.</p>
          <div className='flex flex-wrap justify-center gap-3 mt-4'>
            <Link to='/cv-builder' className='px-5 py-2 bg-brand-500 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>Build your resume</Link>
            <Link to='/jobs' className='px-5 py-2 border border-slate-300 hover:bg-white rounded-full text-sm font-medium text-slate-700 transition'>Browse jobs</Link>
            <Link to='/roadmaps' className='px-5 py-2 border border-slate-300 hover:bg-white rounded-full text-sm font-medium text-slate-700 transition'>More roadmaps</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default RoadmapView
