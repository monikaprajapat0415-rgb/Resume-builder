import React from 'react'
import { Link } from 'react-router-dom'

const LEVEL = { fresher: ['Basic', 'bg-emerald-50 text-emerald-700 ring-emerald-100'], experienced: ['Advanced', 'bg-amber-50 text-amber-700 ring-amber-100'] }

const Row = ({ x, n }) => (
  <li>
    <Link to={`/jobs/interview-questions/${x.slug}`} className='group flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none transition-colors'>
      <span className='shrink-0 w-6 pt-0.5 text-right text-xs tabular-nums text-slate-300' aria-hidden='true'>{n}</span>
      <span className='min-w-0 flex-1'>
        <span className='block text-[15px] leading-snug text-slate-800 group-hover:text-brand-700'>{x.question}</span>
        {(LEVEL[x.level] || x.answerCount > 0) && (
          <span className='mt-1.5 flex flex-wrap items-center gap-2'>
            {LEVEL[x.level] && <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${LEVEL[x.level][1]}`}>{LEVEL[x.level][0]}</span>}
            {x.answerCount > 0 && <span className='text-xs text-slate-400'>{x.answerCount} shared answer{x.answerCount > 1 ? 's' : ''}</span>}
          </span>
        )}
      </span>
      <svg className='mt-1 h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-600 transition' viewBox='0 0 20 20' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M7 4l6 6-6 6' /></svg>
    </Link>
  </li>
)

// Questions grouped by category: a card per category with a count, numbered rows, level pill and answer count.
export const QuestionGroups = ({ questions, cats, anchors = false }) => (
  <div className='grid lg:grid-cols-2 gap-x-8 gap-y-2 items-start'>
    {cats.map((c) => {
      const rows = questions.filter((x) => x.category === c)
      return (
        <section key={c} id={anchors ? `cat-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : undefined} className='mt-8 scroll-mt-24' aria-label={c}>
          <div className='flex items-baseline justify-between gap-3 mb-3 px-1'>
            <h2 className='text-base font-semibold text-slate-800'>{c}</h2>
            <span className='text-xs text-slate-400'>{rows.length} question{rows.length === 1 ? '' : 's'}</span>
          </div>
          <ul className='divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
            {rows.map((x, i) => <Row key={x.slug} x={x} n={i + 1} />)}
          </ul>
        </section>
      )
    })}
  </div>
)
