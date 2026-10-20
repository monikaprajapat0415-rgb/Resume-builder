import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import { Shell, input } from '../../components/community/Shell'
import { useCommunity } from './useCommunity'
import { LEVELS } from './levels'

const InterviewQuestions = ({ level = '' }) => {
  const lp = LEVELS[level]
  const { state, data } = useCommunity(`/api/community/questions${level ? `?level=${level}` : ''}`)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')

  const shown = useMemo(() => (data?.questions || []).filter((x) => (!cat || x.category === cat) && (!q || x.question.toLowerCase().includes(q.toLowerCase()))), [data, q, cat])
  const cats = [...new Set(shown.map((x) => x.category))]
  const crumbs = [{ name: 'Home', to: '/' }, { name: 'Jobs', to: '/jobs' }, lp ? { name: 'Interview questions', to: '/jobs/interview-questions' } : { name: 'Interview questions' }, ...(lp ? [{ name: lp.name }] : [])]

  return (
    <Shell active='questions' crumbs={crumbs}>
      {state === 'ok' && <SEO title={data.seo.title} description={data.seo.description} keywords={data.seo.keywords} path={lp ? lp.path : '/jobs/interview-questions'} canonical={data.seo.canonical} robots={data.seo.robots} structuredData={data.jsonLd} />}
      <h1 className='text-3xl font-semibold text-slate-800'>{lp ? lp.h1 : 'Interview questions and answers'}</h1>
      <p className='text-slate-500 mt-3 max-w-2xl'>{lp ? lp.intro : 'Practise the questions employers really ask, in office, technical, customer-facing, warehouse and skilled jobs. Every question has a model answer. Read how other job seekers answered, and add your own.'}</p>

      <div className='flex flex-wrap gap-2 mt-5'>
        {[['', 'All questions', '/jobs/interview-questions'], ['fresher', 'Freshers', '/jobs/interview-questions/fresher'], ['experienced', 'Experienced', '/jobs/interview-questions/experienced']].map(([id, label, to]) => (
          <Link key={id} to={to} aria-current={level === id ? 'page' : undefined} className={`px-3.5 py-1 rounded-full text-sm border ${level === id ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}>{label}</Link>
        ))}
      </div>

      {state === 'loading' && <p className='text-slate-400 mt-10'>Loading questions…</p>}
      {state === 'error' && <p className='text-slate-500 mt-10'>Could not load the questions. Please refresh the page.</p>}
      {state === 'ok' && (
        data.questions.length === 0 ? <p className='text-slate-400 mt-10'>Questions are on the way. Check back soon.</p> : (
          <>
            <div className='grid sm:grid-cols-[1fr_auto] gap-3 mt-6'>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Search questions' aria-label='Search questions' className={input} />
              <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label='Category' className={input}>
                <option value=''>All categories</option>
                {data.categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            {shown.length === 0 && <p className='text-slate-400 mt-8'>No question matches that search.</p>}
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
          </>
        )
      )}
    </Shell>
  )
}
export default InterviewQuestions
