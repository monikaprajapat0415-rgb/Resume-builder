import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { dropServerJsonLd } from '../utils/seoDom'
import { LuArrowRight, LuRoute, LuSearch, LuSparkles, LuUserRound } from 'react-icons/lu'

const SITE = 'https://primeresumeai.com'
const DESC = 'Roadmaps for jobs and technologies: full stack, frontend, SQL, data, DevOps and more. See the stack end to end and the best places to learn it.'
const KINDS = [['', 'All'], ['role', 'Job roles'], ['technology', 'Technologies'], ['career', 'Career paths']]
const KIND_HEAD = { role: 'Job role roadmaps', technology: 'Technology roadmaps', career: 'Career path roadmaps' }
const EXAMPLES = ['Full Stack Developer', 'SQL Developer', 'Frontend Developer', 'DevOps', 'Data Analyst', 'React']

const RoadmapIndex = () => {
  const { token } = useSelector((st) => st.auth)
  const [fit, setFit] = useState(null)
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  // the search box and kind chips live in the address (?q=react&kind=technology) so a result page can be shared
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const kind = KINDS.some(([k]) => k === params.get('kind')) ? (params.get('kind') || '') : ''
  const [text, setText] = useState(q)
  const filtered = Boolean(q || kind)
  const setFilter = (next) => setParams((p) => { const n = new URLSearchParams(p); Object.entries(next).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k))); return n }, { replace: true })

  useEffect(() => { const t = setTimeout(() => { if (text !== q) setFilter({ q: text.trim() }) }, 250); return () => clearTimeout(t) }, [text])

  useEffect(() => {
    let live = true
    api.get('/api/roadmaps', { params: { q: q || undefined, kind: kind || undefined } })
      .then(({ data }) => { if (live) { setRoadmaps(data.roadmaps || []); setFailed(false) } })
      .catch(() => { if (live) setFailed(true) })
      .finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [q, kind])

  useEffect(() => { if (!loading) dropServerJsonLd() }, [loading])

  // roadmaps matched to the signed-in user's own resume, CV or open-to-work profile
  useEffect(() => {
    if (!token) { setFit(null); return }
    let live = true
    api.get('/api/roadmaps/for-me', { headers: { Authorization: token } })
      .then(({ data }) => { if (live) setFit(data) })
      .catch(() => { if (live) setFit({ hasData: false, failed: true }) })
    return () => { live = false }
  }, [token])
  const fitOf = (slug) => fit?.all?.find((r) => r.slug === slug)

  // browsing: one block per kind. searching: one flat list, best match first
  const groups = filtered && q ? ['Results'] : ['role', 'technology', 'career'].filter((k) => roadmaps.some((r) => (r.kind || 'career') === k && (!kind || kind === k)))
  const inGroup = (g) => (g === 'Results' ? roadmaps : roadmaps.filter((r) => (r.kind || 'career') === g))
  const structuredData = loading ? undefined : [
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Roadmaps for jobs and technologies', url: `${SITE}/roadmaps`, inLanguage: 'en',
      mainEntity: { '@type': 'ItemList', itemListElement: roadmaps.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/roadmaps/${r.slug}`, name: r.title })) },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Home', url: `${SITE}/` }, { name: 'Roadmaps', url: `${SITE}/roadmaps` }].map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
    },
  ]

  return (
    <div>
      <SEO title='Developer and Career Roadmaps' description={DESC} keywords='developer roadmap, full stack developer roadmap, sql developer roadmap, frontend roadmap, career path' path='/roadmaps' canonical={`${SITE}/roadmaps`} robots={filtered ? 'noindex, follow' : undefined} structuredData={structuredData} />
      <NavBar />
      <section className='max-w-5xl mx-auto px-4 py-12'>
        <div className='text-center max-w-2xl mx-auto mb-12'>
          <h1 className='text-4xl font-semibold text-slate-800'>Roadmaps for jobs and technologies</h1>
          <p className='text-slate-500 mt-3'>Search a job title or a technology. Each roadmap shows the whole stack end to end, the steps in order, and the best places to learn each one. Tick off steps as you go.</p>
        </div>

        <form role='search' onSubmit={(e) => { e.preventDefault(); setFilter({ q: text.trim() }) }} className='max-w-2xl mx-auto mb-3'>
          <label htmlFor='rm-search' className='sr-only'>Search roadmaps by job title or technology</label>
          <div className='relative'>
            <LuSearch className='absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-slate-400' aria-hidden='true' />
            <input id='rm-search' type='search' value={text} onChange={(e) => setText(e.target.value)} placeholder='Search: full stack, SQL developer, React, DevOps…' className='w-full rounded-full border-2 border-slate-900 bg-white py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-brand-200' />
          </div>
        </form>
        <div className='flex flex-wrap items-center justify-center gap-2 mb-8'>
          {KINDS.map(([id, label]) => (
            <button key={id} type='button' aria-pressed={kind === id} onClick={() => setFilter({ kind: id })} className={`px-4 py-1.5 rounded-full text-sm border transition ${kind === id ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'}`}>{label}</button>
          ))}
        </div>
        {!filtered && (
          <p className='text-center text-xs text-slate-400 -mt-4 mb-8'>Try: {EXAMPLES.map((x, i) => <span key={x}><button type='button' onClick={() => { setText(x); setFilter({ q: x }) }} className='text-brand-600 hover:underline'>{x}</button>{i < EXAMPLES.length - 1 ? ', ' : ''}</span>)}</p>
        )}

        <div className='mb-10 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900'>
          {!token ? (
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <span className='flex items-center gap-2'><LuUserRound className='size-4 shrink-0' />Log in to get roadmaps matched to your own resume and skills.</span>
              <Link to='/app?state=login' className='rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700'>Log in</Link>
            </div>
          ) : !fit ? <span className='flex items-center gap-2'><LuSparkles className='size-4' />Checking your profile…</span>
          : !fit.hasData ? (
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <span className='flex items-center gap-2'><LuUserRound className='size-4 shrink-0' />{fit.failed ? 'Could not read your profile just now.' : 'Add skills and experience to a resume and we will match roadmaps to you.'}</span>
              {!fit.failed && <Link to='/cv-builder' className='rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700'>Build your resume</Link>}
            </div>
          ) : fit.recommended.length === 0 ? <span className='flex items-center gap-2'><LuSparkles className='size-4' />We could not match your profile to a roadmap yet. Adding job titles and skills to your resume helps.</span>
          : (
            <div>
              <p className='flex items-center gap-2 font-medium'><LuSparkles className='size-4' />Recommended for you, from your {fit.sources.join(', ')}</p>
              <div className='mt-3 grid sm:grid-cols-3 gap-3'>
                {fit.recommended.map((r) => (
                  <Link key={r.slug} to={`/roadmaps/${r.slug}`} className='rounded-md border-2 border-slate-900 bg-yellow-300 hover:bg-yellow-200 px-3 py-2.5 text-slate-900 shadow-[3px_3px_0_0_#0f172a] transition'>
                    <span className='block text-sm font-semibold leading-snug'>{r.title.replace(/: Career Roadmap$/, '')}</span>
                    <span className='block text-xs mt-1 text-slate-700'>You show {r.matched} of {r.total} skills ({r.percent}%)</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading ? <p className='text-center text-slate-400'>Loading roadmaps…</p>
          : failed ? <p className='text-center text-slate-500'>Could not load the roadmaps. Please refresh the page.</p>
          : roadmaps.length === 0 ? <p className='text-center text-slate-500'>{filtered ? <>No roadmap matches that search yet. Try a shorter word such as “sql” or “data”, or <button type='button' onClick={() => { setText(''); setParams({}, { replace: true }) }} className='text-brand-600 hover:underline'>see all roadmaps</button>.</> : 'New roadmaps are on the way. Check back soon.'}</p>
          : groups.map((g) => (
            <div key={g} className='mb-12'>
              <h2 className='text-sm font-semibold uppercase tracking-wide text-slate-400 mb-4'>{g === 'Results' ? `${roadmaps.length} result${roadmaps.length > 1 ? 's' : ''} for “${q}”` : KIND_HEAD[g]}</h2>
              <div className='grid sm:grid-cols-2 gap-5'>
                {inGroup(g).map((r) => (
                  <Link key={r.slug} to={`/roadmaps/${r.slug}`} className='group flex gap-4 rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md hover:border-brand-200 transition'>
                    <span aria-hidden='true' className='size-14 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0 text-lg'>{r.badge || r.title.slice(0, 2).toUpperCase()}</span>
                    <div className='min-w-0'>
                      <h3 className='text-lg font-semibold text-slate-800 group-hover:text-brand-600 transition'>{r.title.replace(/: Career Roadmap$/, '')}</h3>
                      <p className='text-sm text-slate-500 mt-1 line-clamp-3'>{r.summary}</p>
                      {r.layers?.length > 1 && <p className='text-xs text-slate-400 mt-2'>Stack: {r.layers.filter((l) => l !== 'Get hired').join(' · ')}</p>}
                      <p className='inline-flex items-center gap-3 text-xs text-slate-400 mt-3'><span className='inline-flex items-center gap-1'><LuRoute className='size-3.5' />{r.stepCount} steps</span>{fitOf(r.slug)?.matched > 0 && <span className='text-green-700 font-medium'>{fitOf(r.slug).percent}% match</span>}</p>
                    </div>
                    <LuArrowRight className='size-5 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition shrink-0 self-center ml-auto' />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        <p className='text-center text-sm text-slate-400'>Looking for the technical side? See the <Link to='/learn' className='text-brand-600 hover:underline'>free tutorials</Link>. Ready to apply? <Link to='/jobs' className='text-brand-600 hover:underline'>Browse jobs</Link>.</p>
      </section>
      <Footer />
    </div>
  )
}

export default RoadmapIndex
