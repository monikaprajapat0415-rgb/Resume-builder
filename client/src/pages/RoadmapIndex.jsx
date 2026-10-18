import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { dropServerJsonLd } from '../utils/seoDom'
import { LuArrowRight, LuRoute } from 'react-icons/lu'

const SITE = 'https://primeresumeai.com'
const DESC = 'Step-by-step career roadmaps for job seekers: what to learn, in what order, and which tools to use to get from your first job to the next one.'

const RoadmapIndex = () => {
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
                      <p className='inline-flex items-center gap-1 text-xs text-slate-400 mt-3'><LuRoute className='size-3.5' />{r.stepCount} steps</p>
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
