import React from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../../components/SEO'
import { Shell, NotFound } from '../../components/community/Shell'
import { AnswerForm, ReportButton } from '../../components/community/Forms'
import { useCommunity, timeAgo } from './useCommunity'
import { LEVELS } from './levels'

const Paras = ({ text }) => String(text || '').split(/(```[\w-]*\n[\s\S]*?\n?```)/g).filter((x) => x.trim()).flatMap((x, i) => {
  if (x.startsWith('```')) return [<pre key={`c${i}`} className='mt-3 overflow-x-auto rounded-lg bg-slate-900 text-slate-100 text-[13px] leading-relaxed p-4'><code>{x.replace(/^```[\w-]*\n/, '').replace(/\n?```$/, '')}</code></pre>]
  return x.split(/\n{2,}/).filter(Boolean).map((p, j) => <p key={`${i}-${j}`} className='mt-3 text-slate-700 leading-relaxed whitespace-pre-line'>{p}</p>)
})

const InterviewQuestionView = () => {
  const { slug } = useParams()
  const { state, data } = useCommunity(`/api/community/questions/${slug}`)
  if (state === 'loading') return <Shell active='questions'><p className='text-slate-400 py-16 text-center'>Loading…</p></Shell>
  if (state !== 'ok') return <Shell active='questions'><SEO title='Question not found' description='This question could not be found.' noindex /><NotFound what='Question' back='/jobs/interview-questions' backLabel='See all interview questions' /></Shell>
  const { question: q, answers, related, seo } = data
  const lp = q.level === 'both' ? null : LEVELS[q.level]
  const crumbs = [{ name: 'Home', to: '/' }, { name: 'Jobs', to: '/jobs' }, { name: 'Interview questions', to: '/jobs/interview-questions' }, ...(lp ? [{ name: lp.name, to: lp.path }] : []), { name: q.question.length > 50 ? q.question.slice(0, 47) + '…' : q.question }]
  return (
    <Shell active='questions' crumbs={crumbs}>
      <SEO title={seo.title} description={seo.description} keywords={seo.keywords} path={`/jobs/interview-questions/${q.slug}`} canonical={seo.canonical} robots={seo.robots} structuredData={data.jsonLd} />
      <div className='grid lg:grid-cols-[minmax(0,1fr)_400px] gap-x-12 items-start'>
      <div>
      <article>
        <p className='text-sm text-slate-400'>{q.category} · {q.level === 'both' ? 'Freshers and experienced' : q.level === 'fresher' ? 'Freshers' : 'Experienced'}</p>
        <h1 className='text-3xl font-semibold text-slate-800 mt-1'>{q.question}</h1>
        {q.modelAnswer && (<><h2 className='text-xl font-semibold text-slate-800 mt-8'>Model answer</h2><Paras text={q.modelAnswer} /></>)}
        {q.tips?.length > 0 && (
          <div className='mt-6 rounded-lg bg-brand-50 border border-brand-100 px-4 py-3'>
            <h2 className='text-sm font-semibold text-brand-700'>Tips</h2>
            <ul className='list-disc pl-5 mt-1 text-sm text-slate-700 space-y-1'>{q.tips.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        )}
        {/practical coding/i.test(q.category) && (
          <p className='mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-slate-700'>
            Practise it yourself: <Link to='/products/code-playground' className='font-medium text-emerald-800 underline'>open the React and Angular code playground</Link> and try this exercise in your browser.
          </p>
        )}
        {q.learn && (
          <p className='mt-6 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700'>
            Learn this topic: <Link to={q.learn.url} className='text-brand-700 underline font-medium'>{q.learn.title}</Link>{q.learn.title !== q.learn.courseTitle && <> in the course {q.learn.courseTitle}</>}.
          </p>
        )}
      </article>

      <section className='mt-10' aria-labelledby='shared'>
        <h2 id='shared' className='text-xl font-semibold text-slate-800'>Answers from other job seekers {answers.length > 0 && <span className='text-slate-400 font-normal'>({answers.length})</span>}</h2>
        {answers.length === 0 && <p className='text-slate-500 mt-2 text-sm'>No shared answers yet. Be the first to add one.</p>}
        <div className='mt-3 space-y-3'>
          {answers.map((a) => (
            <blockquote key={a._id} className='rounded-xl border border-slate-200 bg-white p-4'>
              <Paras text={a.body} />
              <footer className='mt-3 flex items-center justify-between text-xs text-slate-400'><span>{a.displayName} · {timeAgo(a.createdAt)}</span><ReportButton type='answers' id={a._id} /></footer>
            </blockquote>
          ))}
        </div>
      </section>

      </div>
      <aside className='lg:sticky lg:top-6 lg:[&>section:first-child]:mt-0'>
      <section className='mt-10 rounded-xl border border-slate-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-slate-800 mb-3'>Add your answer</h2>
        <AnswerForm slug={q.slug} />
      </section>

      {related?.length > 0 && (
        <section className='mt-10'>
          <h2 className='text-lg font-semibold text-slate-800 mb-3'>More {q.category.toLowerCase()} questions</h2>
          <ul className='space-y-2'>{related.map((r) => <li key={r.slug}><Link to={`/jobs/interview-questions/${r.slug}`} className='text-brand-600 hover:underline'>{r.question}</Link></li>)}</ul>
        </section>
      )}
      </aside>
      </div>
    </Shell>
  )
}
export default InterviewQuestionView
