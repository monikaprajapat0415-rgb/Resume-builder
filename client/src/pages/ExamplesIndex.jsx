import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { dropServerJsonLd } from '../utils/seoDom'
import { LuAward, LuArrowRight, LuFileText, LuCircleCheck } from 'react-icons/lu'

const SITE = 'https://primeresumeai.com'
const TITLE = '100/100 ATS Resume and CV Examples'
const DESC = 'Ten real resume and CV examples for developers, nurses, electricians, teachers and more. Each one passes every automatic ATS check. Copy the format.'
const HOW = 'Each example was exported as a PDF and run through the same rule-based checks as our free ATS checker: readable text, standard section headings, contact details, bullet points, dates and measurable results. All ten score 100 on every one of those checks. The checker also gives a content and keyword score that depends on the job you are applying for, so use your own job advert and check your finished file.'

const ExamplesIndex = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let live = true
    api.get('/api/examples')
      .then(({ data }) => { if (live) setList(data.examples || []) })
      .catch(() => { if (live) setFailed(true) })
      .finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [])
  useEffect(() => { if (!loading) dropServerJsonLd() }, [loading])

  const structuredData = loading || !list.length ? undefined : {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: TITLE, url: `${SITE}/examples`, description: DESC, inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: 'Prime Resume AI', url: SITE },
    mainEntity: { '@type': 'ItemList', numberOfItems: list.length, itemListElement: list.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/examples/${e.slug}`, name: e.title })) },
  }

  const groups = [['resume', 'Resume examples'], ['cv', 'CV examples']]

  return (
    <div>
      <SEO title={TITLE} description={DESC} keywords='resume examples, cv examples, ats friendly resume example, 100 ats score resume' path='/examples' structuredData={structuredData} />
      <NavBar />
      <section className='max-w-page xl:px-10 mx-auto px-4 sm:px-6 py-10 sm:py-14'>
        <div className='flex items-center gap-2 text-brand-600 text-sm font-medium'><LuAward className='size-4' /> Samples that pass every automatic check</div>
        <h1 className='text-3xl sm:text-4xl font-bold text-slate-800 leading-tight mt-2'>Resume and CV examples that score 100/100 on every ATS check</h1>
        <p className='text-slate-600 mt-4 max-w-3xl leading-relaxed'>{HOW}</p>
        <div className='flex flex-wrap gap-3 mt-6'>
          <Link to='/app?state=register' className='px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'>Build yours with the AI resume builder</Link>
          <Link to='/features/ats-checker' className='px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full text-sm font-medium transition'>Check your own file</Link>
        </div>

        {loading && <p className='mt-10 text-slate-400'>Loading examples…</p>}
        {failed && <p className='mt-10 text-slate-500'>The examples could not be loaded. Please refresh the page.</p>}

        {groups.map(([kind, heading]) => {
          const items = list.filter((e) => e.kind === kind)
          return items.length ? (
            <div key={kind} className='mt-12'>
              <h2 className='text-xl font-semibold text-slate-800'>{heading}</h2>
              <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
                {items.map((e) => (
                  <Link key={e.slug} to={`/examples/${e.slug}`} className='group block rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-300 hover:shadow-sm transition'>
                    <div className='flex items-center justify-between gap-3'>
                      <span className='inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-full px-2.5 py-1'><LuCircleCheck className='size-3.5' /> 100/100 checks</span>
                      <span className='text-xs text-slate-400'>{e.region}</span>
                    </div>
                    <h3 className='mt-3 text-base font-semibold text-slate-800 group-hover:text-brand-600 transition'>{e.title}</h3>
                    <p className='mt-1.5 text-sm text-slate-500 leading-relaxed'>{e.intro}</p>
                    <span className='mt-3 inline-flex items-center gap-1 text-sm text-brand-600'>See the example <LuArrowRight className='size-4' /></span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null
        })}

        <div className='mt-14 rounded-xl border border-slate-200 bg-slate-50 p-6'>
          <h2 className='text-lg font-semibold text-slate-800 flex items-center gap-2'><LuFileText className='size-5 text-brand-600' /> Using an example</h2>
          <ul className='mt-3 space-y-2 text-sm text-slate-600 list-disc pl-5'>
            <li>Every person and employer shown is made up. Copy the structure and style, then write your own facts.</li>
            <li>Use only numbers you can explain in an interview. A smaller true number is better than a big guess.</li>
            <li>See all <Link to='/templates' className='text-brand-600 underline'>resume templates</Link> or the <Link to='/cv-builder' className='text-brand-600 underline'>CV builder</Link> to pick the layout.</li>
          </ul>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default ExamplesIndex
