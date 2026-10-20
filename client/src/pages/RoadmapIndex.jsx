import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { dropServerJsonLd } from '../utils/seoDom'
import { LuArrowRight, LuRoute, LuSparkles, LuUserRound } from 'react-icons/lu'

const SITE = 'https://primeresumeai.com'
const DESC = 'Step-by-step career roadmaps for job seekers: what to learn, in what order, and which tools to use to get from your first job to the next one.'

const RoadmapIndex = () => {
  const { token } = useSelector((st) => st.auth)
  const [fit, setFit] = useState(null)
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let live = true
    api.get('/api/roadmaps')
      .then(({ data }) => { if (live) setRoadmaps(data.roadmaps || []) })
      .catch(() => { if (live) setFailed(true) })
      .finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [])

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

  const groups = [...new Set(roadmaps.map((r) => r.audience || 'Career paths'))]
  const structuredData = loading ? undefined : [
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Career roadmaps for job seekers', url: `${SITE}/roadmaps`, inLanguage: 'en',
      mainEntity: { '@type': 'ItemList', itemListElement: roadmaps.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/roadmaps/${r.slug}`, name: r.title })) },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Home', url: `${SITE}/` }, { name: 'Career roadmaps', url: `${SITE}/roadmaps` }].map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
    },
  ]

  return (
    <div>
      <SEO title='Career roadmaps: step-by-step plans for job seekers' description={DESC} keywords='career roadmap, career path, how to get promoted, job seeker guide' path='/roadmaps' structuredData={structuredData} />
      <NavBar />
      <section className='max-w-5xl mx-auto px-4 py-12'>
        <div className='text-center max-w-2xl mx-auto mb-12'>
          <h1 className='text-4xl font-semibold text-slate-800'>Career roadmaps</h1>
          <p className='text-slate-500 mt-3'>Pick where you are and where you want to go. Each roadmap shows the steps in order, what to learn at each stage, and the tools to help. Tick off steps as you go.</p>
        </div>

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
          : roadmaps.length === 0 ? <p className='text-center text-slate-400'>New roadmaps are on the way. Check back soon.</p>
          : groups.map((g) => (
            <div key={g} className='mb-12'>
              {groups.length > 1 && <h2 className='text-sm font-semibold uppercase tracking-wide text-slate-400 mb-4'>{g}</h2>}
              <div className='grid sm:grid-cols-2 gap-5'>
                {roadmaps.filter((r) => (r.audience || 'Career paths') === g).map((r) => (
                  <Link key={r.slug} to={`/roadmaps/${r.slug}`} className='group flex gap-4 rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md hover:border-brand-200 transition'>
                    <span aria-hidden='true' className='size-14 rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0 text-lg'>{r.badge || r.title.slice(0, 2).toUpperCase()}</span>
                    <div className='min-w-0'>
                      <h3 className='text-lg font-semibold text-slate-800 group-hover:text-brand-600 transition'>{r.title.replace(/: Career Roadmap$/, '')}</h3>
                      <p className='text-sm text-slate-500 mt-1 line-clamp-3'>{r.summary}</p>
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
