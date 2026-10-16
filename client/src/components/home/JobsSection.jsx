import React from 'react'
import { Link } from 'react-router-dom'
import { LuBriefcase, LuSearch, LuUserCheck, LuBuilding2, LuArrowRight, LuShieldCheck } from 'react-icons/lu'
import Title from './Title'
import { CATEGORIES } from '../../utils/workTaxonomy'

const CARDS = [
  { to: '/jobs', icon: LuSearch, tone: 'text-brand-600 bg-brand-100 border-brand-300', title: 'Find a job', text: 'Browse open jobs in any country: office, factory, skilled trade and daily wage work. Apply directly with the employer.', cta: 'Browse jobs' },
  { to: '/app/open-to-work', icon: LuUserCheck, tone: 'text-violet-600 bg-violet-100 border-violet-300', title: 'I am looking for work', text: 'Say you are available. Approved employers see your trade, experience and pay. Your name and phone stay private until you accept.', cta: 'Show I am available' },
  { to: '/hire', icon: LuBuilding2, tone: 'text-orange-600 bg-orange-100 border-orange-300', title: 'I am hiring', text: 'Post a job and contact available workers. Every employer is checked before they can see anyone.', cta: 'Start hiring' },
]

const JobsSection = () => (
  <section id='jobs' aria-labelledby='home-jobs-h' className='flex flex-col items-center my-16 px-4 scroll-mt-12'>
    <div className='flex items-center gap-2 text-sm text-brand-600 bg-brand-400/10 rounded-full px-6 py-1.5'>
      <LuBriefcase width={14} />
      <span>Jobs and hiring</span>
    </div>
    <Title title='Find work. Find workers.' desciption='A jobs board and an "available to work" list for office staff, factory workers, skilled trades and daily wage workers, worldwide.' />
    <h2 id='home-jobs-h' className='sr-only'>Jobs and hiring</h2>

    <ul className='grid md:grid-cols-3 gap-5 mt-10 max-w-5xl w-full'>
      {CARDS.map((c) => (
        <li key={c.title}>
          <Link to={c.to} className='group h-full flex flex-col rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md hover:border-slate-300 transition'>
            <span className={`size-11 rounded-xl border flex items-center justify-center ${c.tone}`}><c.icon className='size-5' /></span>
            <h3 className='text-lg font-semibold text-slate-800 mt-4'>{c.title}</h3>
            <p className='text-sm text-slate-600 mt-2 flex-1'>{c.text}</p>
            <span className='mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700'>{c.cta}<LuArrowRight className='size-4 group-hover:translate-x-1 transition' /></span>
          </Link>
        </li>
      ))}
    </ul>

    <ul className='flex flex-wrap justify-center gap-2 mt-8 max-w-3xl' aria-label='Kinds of work'>
      {CATEGORIES.map((c) => (
        <li key={c.id}><Link to={`/jobs?category=${c.id}`} className='inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 transition'><span aria-hidden='true'>{c.icon}</span>{c.label}</Link></li>
      ))}
    </ul>
    <p className='mt-5 inline-flex items-center gap-2 text-sm text-slate-500'><LuShieldCheck className='size-4 text-green-600' />Free for workers. Never pay anyone to get a job.</p>
  </section>
)

export default JobsSection
