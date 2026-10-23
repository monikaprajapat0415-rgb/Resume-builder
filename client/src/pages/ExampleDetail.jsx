import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import ResumePreview from '../components/ResumePreview'
import CvDocument from '../components/cv/CvDocument'
import api from '../configs/api'
import { dropServerJsonLd } from '../utils/seoDom'
import { LuCircleCheck, LuLightbulb, LuArrowRight } from 'react-icons/lu'

const SITE = 'https://primeresumeai.com'

// The resume templates are drawn 816px wide; shrink the whole page to fit a narrow screen (never re-wrap it).
const FitPage = ({ width = 816, children }) => {
  const box = useRef(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = box.current
    if (!el) return undefined
    const fit = () => setScale(Math.min(1, el.clientWidth / width))
    fit()
    const ro = new ResizeObserver(fit); ro.observe(el)
    return () => ro.disconnect()
  }, [width])
  return (
    <div ref={box} className='w-full min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100'>
      <div style={{ zoom: scale, width }} className='mx-auto bg-white'>{children}</div>
    </div>
  )
}

const ExampleDetail = () => {
  const { slug } = useParams()
  const [state, setState] = useState({ status: 'loading', example: null, others: [] })

  useEffect(() => {
    let live = true
    setState({ status: 'loading', example: null, others: [] })
    api.get(`/api/examples/${slug}`)
      .then(({ data }) => { if (live) setState({ status: 'ready', example: data.example, others: data.others || [] }) })
      .catch((e) => { if (live) setState({ status: e.response?.status === 404 ? 'missing' : 'error', example: null, others: [] }) })
    return () => { live = false }
  }, [slug])
  useEffect(() => { if (state.status !== 'loading') dropServerJsonLd() }, [state.status])

  const e = state.example
  if (state.status === 'missing') {
    return (
      <div>
        <SEO title='Example not found' description='This example could not be found.' noindex path={`/examples/${slug}`} />
        <NavBar />
        <section className='max-w-3xl mx-auto px-4 py-20 text-center'>
          <h1 className='text-2xl font-semibold text-slate-800'>We could not find that example</h1>
          <p className='mt-3 text-slate-500'>It may have moved. <Link to='/examples' className='text-brand-600 underline'>See all resume and CV examples</Link>.</p>
        </section>
        <Footer />
      </div>
    )
  }

  const typeName = e?.kind === 'cv' ? 'CV' : 'resume'
  const structuredData = e ? {
    '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${SITE}/examples/${e.slug}`, url: `${SITE}/examples/${e.slug}`,
    name: e.title, description: e.metaDescription, inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: 'Prime Resume AI', url: SITE },
  } : undefined
  const person = e ? (e.kind === 'cv' ? e.personal : e.data.personal_info) : null

  return (
    <div>
      {e ? <SEO title={e.title} description={e.metaDescription} keywords={`${e.role.toLowerCase()} ${typeName} example, ${e.role.toLowerCase()} ${typeName} sample, ats friendly ${typeName}`} path={`/examples/${e.slug}`} type='article' structuredData={structuredData} />
        : <SEO title='Resume and CV examples' description='Resume and CV examples that pass every automatic ATS check.' path={`/examples/${slug}`} />}
      <NavBar />
      <section className='max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12'>
        {state.status === 'loading' && <p className='text-slate-400'>Loading…</p>}
        {state.status === 'error' && <p className='text-slate-500'>This example could not be loaded. Please refresh the page.</p>}
        {e && (
          <>
            <div className='max-w-3xl'>
              <span className='inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-full px-2.5 py-1'><LuCircleCheck className='size-3.5' /> Passes all automatic ATS checks · {e.region}</span>
              <h1 className='text-3xl sm:text-4xl font-bold text-slate-800 leading-tight mt-3'>{e.title}</h1>
              <p className='text-slate-600 mt-4 leading-relaxed'>{e.intro}</p>
              <p className='text-sm text-slate-400 mt-3'>This is a sample {typeName} for a made-up person. Replace every detail with your own.</p>
            </div>

            <div className='grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 mt-8 items-start'>
              <div className='min-w-0'>
                {e.kind === 'resume'
                  ? <FitPage width={816}><ResumePreview data={e.data} template={e.templateId} accentColor='#1d4ed8' /></FitPage>
                  : <CvDocument cv={e.cv} personal={e.personal} template={e.templateId} accentColor='#1E3A8A' level={e.level} previewId='example-cv' />}
                <p className='sr-only'>{person.full_name}, {person.email}</p>
              </div>

              <aside className='space-y-6'>
                <div className='rounded-xl border border-slate-200 bg-white p-5'>
                  <h2 className='text-base font-semibold text-slate-800'>Why this {typeName} works</h2>
                  <ul className='mt-3 space-y-2.5'>
                    {e.why.map((x, i) => <li key={i} className='flex items-start gap-2 text-sm text-slate-600'><LuCircleCheck className='size-4 text-green-600 mt-0.5 shrink-0' />{x}</li>)}
                  </ul>
                </div>
                <div className='rounded-xl border border-amber-100 bg-amber-50/60 p-5'>
                  <h2 className='text-base font-semibold text-slate-800 flex items-center gap-2'><LuLightbulb className='size-4 text-amber-600' /> Before you copy it</h2>
                  <ul className='mt-3 space-y-2.5 list-disc pl-5 text-sm text-slate-600'>
                    {e.tips.map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                </div>
                <div className='rounded-xl border border-slate-200 bg-white p-5'>
                  <Link to={e.kind === 'cv' ? '/cv-builder' : `/app?state=register&template=${e.templateId}`} className='block text-center px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>
                    {e.kind === 'cv' ? 'Make your CV' : 'Use this layout for your resume'}
                  </Link>
                  <Link to='/features/ats-checker' className='block text-center mt-3 text-sm text-brand-600 underline'>Check your file with the free ATS checker</Link>
                </div>
              </aside>
            </div>

            {state.others.length > 0 && (
              <div className='mt-14'>
                <h2 className='text-lg font-semibold text-slate-800'>More examples</h2>
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                  {[...state.others.filter((o) => o.kind === e.kind).slice(0, 3), ...state.others.filter((o) => o.kind !== e.kind).slice(0, 2)].map((o) => (
                    <Link key={o.slug} to={`/examples/${o.slug}`} className='block rounded-lg border border-slate-200 p-4 hover:border-brand-200 hover:shadow-sm transition'>
                      <p className='text-sm font-medium text-slate-800'>{o.title}</p>
                      <p className='text-xs text-slate-500 mt-1'>{o.region}</p>
                    </Link>
                  ))}
                </div>
                <Link to='/examples' className='inline-flex items-center gap-1 mt-5 text-sm text-brand-600'>All resume and CV examples <LuArrowRight className='size-4' /></Link>
              </div>
            )}
          </>
        )}
      </section>
      <Footer />
    </div>
  )
}

export default ExampleDetail
