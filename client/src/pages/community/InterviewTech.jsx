import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../../components/SEO'
import { Shell, NotFound, input } from '../../components/community/Shell'
import { useCommunity } from './useCommunity'

const LEVEL_CHIPS = [['', 'All levels'], ['fresher', 'Basic (freshers)'], ['experienced', 'Advanced (experienced)']]

// One technology: its questions grouped by category. Each question opens the model-answer page.
const InterviewTech = () => {
  const { tech: slug } = useParams()
  const { state, data } = useCommunity(`/api/community/questions/tech/${slug}`)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [level, setLevel] = useState('')

  const shown = useMemo(() => (data?.questions || []).filter((x) => (!cat || x.category === cat)
    && (!level || x.level === level || x.level === 'both') && (!q || x.question.toLowerCase().includes(q.toLowerCase()))), [data, q, cat, level])
  const cats = [...new Set(shown.map((x) => x.category))]

  if (state === 'loading') return <Shell active='questions'><p className='text-slate-400 py-16 text-center'>Loading…</p></Shell>
  if (state !== 'ok') return <Shell active='questions'><SEO title='Technology not found' description='No interview questions were found for this technology.' noindex /><NotFound what='Technology' back='/jobs/interview-questions' backLabel='See all interview questions' /></Shell>

  const { tech } = data
  const crumbs = [{ name: 'Home', to: '/' }, { name: 'Jobs', to: '/jobs' }, { name: 'Interview questions', to: '/jobs/interview-questions' }, { name: tech.name }]
  return (
    <Shell active='questions' crumbs={crumbs}>
      <SEO title={data.seo.title} description={data.seo.description} keywords={data.seo.keywords} path={`/jobs/interview-questions/tech/${tech.slug}`} canonical={data.seo.canonical} robots={data.seo.robots} structuredData={data.jsonLd} />
      <h1 className='text-3xl font-semibold text-slate-800'>{tech.name} interview questions and answers</h1>
      <p className='text-slate-500 mt-3 max-w-2xl'>{tech.blurb} {data.questions.length} questions with a model answer for each. Open a question to read the answer and see how other job seekers answered.</p>

      <div className='flex flex-wrap gap-2 mt-5'>
        {LEVEL_CHIPS.map(([id, label]) => (
          <button key={id} type='button' onClick={() => setLevel(id)} aria-pressed={level === id} className={`px-3.5 py-1 rounded-full text-sm border ${level === id ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}>{label}</button>
        ))}
      </div>

      <div className='grid sm:grid-cols-[1fr_auto] gap-3 mt-4'>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${tech.name} questions`} aria-label='Search questions' className={input} />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label='Category' className={input}>
          <option value=''>All categories</option>
          {data.categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      {shown.length === 0 && <p className='text-slate-400 mt-8'>No question matches that filter.</p>}
      <div className='grid lg:grid-cols-2 gap-x-8 items-start'>
        {cats.map((c) => (
          <div key={c} className='mt-8'>
            <h2 className='text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3'>{c}</h2>
            <ul className='divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white'>
              {shown.filter((x) => x.category === c).map((x) => (
                <li key={x.slug}>
                  <Link to={`/jobs/interview-questions/${x.slug}`} className='flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50'>
                    <span className='text-slate-800'>{x.question}</span>
                    <span className='shrink-0 text-xs text-slate-400'>{x.answerCount ? `${x.answerCount} shared answer${x.answerCount > 1 ? 's' : ''}` : x.level === 'both' ? '' : x.level}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className='mt-10 text-sm'><Link to='/jobs/interview-questions' className='text-brand-600 hover:underline'>← All technologies</Link></p>
    </Shell>
  )
}
export default InterviewTech
