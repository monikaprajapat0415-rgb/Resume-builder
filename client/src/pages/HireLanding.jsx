import React from 'react'
import { Link } from 'react-router-dom'
import { LuBuilding2, LuUserCheck, LuShieldCheck, LuEyeOff, LuSend, LuSearch, LuBadgeCheck, LuArrowRight } from 'react-icons/lu'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'

const FAQS = [
  ['Who can see my profile if I mark myself as available?', 'Only companies that we have approved. They see your role, skills, experience, city, expected salary and notice period. Your name, email and phone number stay hidden until you accept a request.'],
  ['How do companies contact me?', 'A company writes you a message through the site and you get an email. You can accept, decline, or decline and block that company. If you accept you choose exactly which details to share.'],
  ['Can I hide my profile again?', 'Yes. Switch "Available to work" off at any time and you disappear from company searches, or remove your profile completely.'],
  ['How do you check companies?', 'Every company applies with a work email on its own domain and its website. An admin approves it before it can search candidates or post jobs, and every job post is reviewed before it goes live.'],
  ['Is it free?', 'Creating an account, listing yourself as available and answering requests is free for job seekers.'],
]

const Step = ({ n, title, children }) => (
  <li className='flex gap-3'><span className='size-7 shrink-0 rounded-full bg-brand-600 text-white text-sm font-semibold flex items-center justify-center'>{n}</span><div><p className='font-medium text-slate-800'>{title}</p><p className='text-sm text-slate-600 mt-0.5'>{children}</p></div></li>
)

const HireLanding = () => (
  <div>
    <SEO title='Hire talent or get hired: open to work profiles' description='Job seekers can mark themselves available to work and companies can contact them, with contact details kept private until the candidate accepts. Companies are approved before they can search.' keywords='hire developers India, open to work, find candidates, hire freshers, job seekers available' path='/hire' canonical='https://primeresumeai.com/hire'
      structuredData={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }} />
    <NavBar />
    <section className='max-w-5xl mx-auto px-4 py-14'>
      <div className='text-center max-w-2xl mx-auto'>
        <h1 className='text-4xl font-semibold text-slate-800'>Companies hire. Job seekers get found.</h1>
        <p className='text-slate-500 mt-4'>Mark yourself available to work and let approved companies reach out, or find candidates who are ready to start. Contact details stay private until the candidate says yes.</p>
      </div>
      <div className='grid md:grid-cols-2 gap-6 mt-10'>
        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          <LuUserCheck className='size-7 text-brand-600' />
          <h2 className='text-xl font-semibold text-slate-800 mt-3'>I am looking for work</h2>
          <ol className='space-y-4 mt-4'>
            <Step n='1' title='Create a short profile'>Your role, skills, experience, city and notice period. No name or contact details are shown.</Step>
            <Step n='2' title='Switch on "Available to work"'>Approved companies can find you. Switch it off any time.</Step>
            <Step n='3' title='Reply to the ones you like'>Accept to share your email or phone, decline, or block a company.</Step>
          </ol>
          <Link to='/app/open-to-work' className='mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium'>Make me available <LuArrowRight className='size-4' /></Link>
        </div>
        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          <LuBuilding2 className='size-7 text-brand-600' />
          <h2 className='text-xl font-semibold text-slate-800 mt-3'>I am hiring</h2>
          <ol className='space-y-4 mt-4'>
            <Step n='1' title='Apply with your work email'>Tell us about your company. We approve every company before it can see candidates.</Step>
            <Step n='2' title='Search available candidates'>Filter by skills, level, location and notice period.</Step>
            <Step n='3' title='Send a request and post jobs'>Candidates who accept share their contact details. Your jobs also appear on our Jobs page.</Step>
          </ol>
          <Link to='/app/hire' className='mt-6 inline-flex items-center gap-2 px-6 py-2.5 border border-brand-600 text-brand-700 hover:bg-brand-50 rounded-full text-sm font-medium'>Start hiring <LuArrowRight className='size-4' /></Link>
        </div>
      </div>

      <div className='grid sm:grid-cols-3 gap-4 mt-10'>
        {[[LuEyeOff, 'Private by default', 'Names, emails and phone numbers are hidden until a candidate accepts.'], [LuBadgeCheck, 'Approved companies only', 'Work email and website are checked before a company can search.'], [LuShieldCheck, 'You stay in control', 'Decline, block or hide your profile whenever you like.']].map(([I, t, d]) => (
          <div key={t} className='rounded-xl bg-slate-50 p-5'><I className='size-5 text-brand-600' /><p className='font-medium text-slate-800 mt-2'>{t}</p><p className='text-sm text-slate-600 mt-1'>{d}</p></div>
        ))}
      </div>

      <section className='max-w-3xl mx-auto mt-14' aria-labelledby='hire-faq'>
        <h2 id='hire-faq' className='text-2xl font-semibold text-slate-800 text-center'>Questions</h2>
        <div className='mt-5 divide-y divide-slate-100'>{FAQS.map(([q, a]) => <details key={q} className='py-3 group'><summary className='cursor-pointer font-medium text-slate-800'>{q}</summary><p className='text-sm text-slate-600 mt-2'>{a}</p></details>)}</div>
        <p className='text-center text-sm text-slate-500 mt-8'>Want a stronger profile first? <Link to='/cv-builder' className='text-brand-700 hover:underline'>Build your CV</Link> or <Link to='/features/ats-checker' className='text-brand-700 hover:underline'>check your resume</Link>.</p>
      </section>
    </section>
    <Footer />
  </div>
)

export default HireLanding
