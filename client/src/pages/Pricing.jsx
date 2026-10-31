import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import { usePlan, isPaid } from '../utils/plan'
import { LuCheck } from 'react-icons/lu'

const money = (p) => {
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: p.currency, maximumFractionDigits: p.price % 1 ? 2 : 0 }).format(p.price) }
  catch { return `${p.currency} ${p.price}` }
}
const PERIOD = { month: 'per month', year: 'per year', once: 'one-time' }

const Pricing = () => {
  const plan = usePlan()
  const { user } = useSelector((s) => s.auth)
  const on = plan?.enabled

  return (
    <div>
      {/* Not indexed while the plan is off, so a page that says "everything is free" never competes with real pages. */}
      <SEO title={on ? `${plan.planName} plan and pricing | Prime Resume AI` : 'Pricing | Prime Resume AI'}
        description={on ? `See what is free and what the ${plan.planName} plan adds on Prime Resume AI.` : 'Prime Resume AI is free to use right now.'}
        path='/pricing' noindex={!on} />
      <NavBar />
      <section className='max-w-6xl mx-auto px-4 py-14'>
        {plan === null && <p className='text-center text-slate-400'>Loading…</p>}
        {plan && !on && (
          <div className='text-center'>
            <h1 className='text-3xl sm:text-4xl font-bold text-slate-800'>Everything is free right now</h1>
            <p className='mt-4 text-slate-600 max-w-xl mx-auto'>Build resumes, check them with the ATS checker, use the AI helpers and learn from every course without paying.</p>
            <Link to='/app' className='inline-block mt-6 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700'>Create my resume</Link>
          </div>
        )}
        {plan && on && (
          <>
            <div className='text-center'>
              <h1 className='text-3xl sm:text-4xl font-bold text-slate-800'>Free, or go {plan.planName}</h1>
              {plan.tagline && <p className='mt-3 text-slate-600 max-w-xl mx-auto'>{plan.tagline}</p>}
            </div>
            <div className='mt-10 grid md:grid-cols-2 gap-6'>
              <div className='rounded-2xl border border-slate-200 bg-white p-6'>
                <h2 className='text-xl font-semibold text-slate-800'>Free</h2>
                <p className='mt-2 text-3xl font-semibold text-slate-800'>{money({ ...plan, price: 0 })}</p>
                <ul className='mt-5 space-y-2 text-sm text-slate-700'>
                  {plan.freeFeatures.map((f) => <li key={f} className='flex gap-2'><LuCheck className='size-4 mt-0.5 shrink-0 text-brand-600' aria-hidden='true' />{f}</li>)}
                </ul>
                <Link to='/app' className='mt-6 inline-block rounded-full border border-slate-300 px-5 py-2 text-sm text-slate-700 hover:bg-slate-50'>Start free</Link>
              </div>
              <div className='rounded-2xl border-2 border-brand-400 bg-brand-50/30 p-6'>
                <h2 className='text-xl font-semibold text-slate-800'>{plan.planName}</h2>
                <p className='mt-2 text-3xl font-semibold text-slate-800'>{money(plan)} <span className='text-sm font-normal text-slate-500'>{PERIOD[plan.period]}</span></p>
                <ul className='mt-5 space-y-2 text-sm text-slate-700'>
                  {plan.freeFeatures.length > 0 && <li className='text-slate-500'>Everything in Free, plus:</li>}
                  {plan.features.map((f) => <li key={f} className='flex gap-2'><LuCheck className='size-4 mt-0.5 shrink-0 text-brand-600' aria-hidden='true' />{f}</li>)}
                </ul>
                {isPaid(user)
                  ? <p className='mt-6 text-sm font-medium text-brand-700'>You already have the {plan.planName} plan{user.role !== 'admin' && user.planUntil && new Date(user.planUntil).getFullYear() < 2900 ? `, active until ${new Date(user.planUntil).toLocaleDateString()}` : ''}.</p>
                  : <div className='mt-6'>
                      {plan.paymentLink && <a href={plan.paymentLink} target='_blank' rel='noopener noreferrer nofollow' className='inline-block rounded-full bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700'>Pay and upgrade</a>}
                      {plan.payInstructions && <p className='mt-3 text-sm text-slate-600'>{plan.payInstructions}</p>}
                      <p className='mt-3 text-xs text-slate-500'>{user ? `Use the email you sign in with (${user.email}) when you pay, so we can switch your plan on.` : 'Sign in first, then use the same email when you pay, so we can switch your plan on.'}</p>
                    </div>}
              </div>
            </div>
          </>
        )}
      </section>
      <Footer />
    </div>
  )
}

export default Pricing
