import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import NavBar from '../../components/home/NavBar'
import Footer from '../../components/home/Footer'
import { useToolSettings } from '../../utils/toolSettings'
import C from '../../content/careerTools.json'

// /tools: list of the free career tools. The admin can hide any of them (Admin > Free tools); hidden ones leave this list.
const ToolsIndex = () => {
  const s = useToolSettings()
  const list = C.tools.filter((t) => s[t.flag] !== false)
  const structured = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ['Free tools', '/tools']].map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `https://primeresumeai.com${p}` })) },
    { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: list.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: `https://primeresumeai.com${t.path}` })) },
  ]
  return (
    <>
      <SEO title={C.indexTitle} description={C.indexDescription} path='/tools' structuredData={structured} noindex={s.loaded && list.length === 0} />
      <NavBar />
      <main className='max-w-page xl:px-10 mx-auto px-4 py-12'>
        <h1 className='text-3xl sm:text-4xl font-bold text-slate-800'>{C.indexTitle}</h1>
        <p className='text-slate-600 mt-3 max-w-3xl'>{C.indexIntro}</p>
        {s.loaded && list.length === 0 && <p className='text-slate-500 mt-8'>The tools are not available right now. Please check back later.</p>}
        <ul className='mt-8 grid sm:grid-cols-2 xl:grid-cols-3 gap-5'>
          {list.map((t) => (
            <li key={t.slug}>
              <Link to={t.path} className='group block h-full rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300 hover:shadow-md transition'>
                <h2 className='text-lg font-semibold text-slate-800 group-hover:text-brand-700'>{t.name}</h2>
                <p className='text-sm text-slate-600 mt-2'>{t.intro}</p>
                <span className='block mt-4 text-sm font-medium text-brand-700'>{t.needsLogin ? 'Free with an account' : 'Free, no sign-in'} →</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className='text-sm text-slate-500 mt-10'>More: <Link to='/features/ats-checker' className='text-brand-700 underline'>ATS resume checker</Link>, <Link to='/resume-job-description-matcher' className='text-brand-700 underline'>job description matcher</Link>, <Link to='/products/image-enhancer' className='text-brand-700 underline'>image enhancer</Link>, <Link to='/jobs/interview-questions' className='text-brand-700 underline'>interview questions</Link>.</p>
      </main>
      <Footer />
    </>
  )
}
export default ToolsIndex
