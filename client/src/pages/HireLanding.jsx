import React from 'react'
import { Link } from 'react-router-dom'
import { LuBuilding2, LuUserCheck, LuShieldCheck, LuEyeOff, LuSend, LuSearch, LuBadgeCheck, LuArrowRight } from 'react-icons/lu'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'

const FAQS = [
  ['Who is this for?', 'Office and corporate staff, factory and plant workers, skilled tradespeople such as electricians, welders, plumbers and drivers, and daily wage workers. It works in any country, from India, the UK, the US and Canada to Australia, the Gulf and across Africa.'],
  ['Who can see my profile if I mark myself as available?', 'Only employers we approved. They see your trade, experience, area, expected pay and when you can start. Your name, email and phone number stay hidden until you accept a request.'],
  ['Do I have to pay anything?', 'No. Listing yourself and answering employers is free. Employers must promise never to charge workers, and you should never pay anyone to get a job. Report any job that asks for money.'],
  ['How do employers contact me?', 'An approved employer sends you a message through the site and you get an email. You can accept, decline, or decline and block them. If you accept you choose whether to share your phone, WhatsApp and email.'],
  ['How do you check employers?', 'Every employer gives a phone number and either a company website or a registration number. A personal email such as Gmail is accepted only with a registration number. An admin approves each employer, and each job post is reviewed before it goes live.'],
  ['Can I hide my profile again?', 'Yes. Switch "Available to work" off at any time, or remove your profile completely.'],
]

const Step = ({ n, title, children }) => (
  <li className='flex gap-3'><span className='size-7 shrink-0 rounded-full bg-brand-600 text-white text-sm font-semibold flex items-center justify-center'>{n}</span><div><p className='font-medium text-slate-800'>{title}</p><p className='text-sm text-slate-600 mt-0.5'>{children}</p></div></li>
)

const HireLanding = () => (
  <div>
    <SEO title='Hire Workers or Find Work Worldwide' description='Workers anywhere can mark themselves available for office, factory, trade and daily wage work. Contact details stay private until the worker accepts.' keywords='hire workers worldwide, hire electrician, factory workers, daily wage workers, skilled labour, hire staff abroad, available to work' path='/hire' canonical='https://primeresumeai.com/hire'
      structuredData={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }} />
    <NavBar />
    <section className='max-w-5xl mx-auto px-4 py-14'>
      <div className='text-center max-w-2xl mx-auto'>
        <h1 className='text-4xl font-semibold text-slate-800'>Hire workers. Get found for work.</h1>
        <p className='text-slate-500 mt-4'>Office staff, factory workers, skilled trades and daily wage workers, in any country. Say you are available and approved employers reach out, or find workers ready to start. Contact details stay private until the worker says yes.</p>
      </div>
      <div className='grid md:grid-cols-2 gap-6 mt-10'>
        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          <LuUserCheck className='size-7 text-brand-600' />
          <h2 className='text-xl font-semibold text-slate-800 mt-3'>I am looking for work</h2>
          <ol className='space-y-4 mt-4'>
            <Step n='1' title='Choose your kind of work'>Office, factory, skilled trade or daily wage. Add your job, experience, area and expected pay. No name or phone number is shown.</Step>
            <Step n='2' title='Switch on "Available to work"'>Approved employers can find you, and you can say you can start now. Switch it off any time.</Step>
            <Step n='3' title='Reply to the ones you like'>Accept to share your phone, WhatsApp or email, decline, or block an employer.</Step>
          </ol>
          <Link to='/app/open-to-work' className='mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium'>I am available for work <LuArrowRight className='size-4' /></Link>
        </div>
        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          <LuBuilding2 className='size-7 text-brand-600' />
          <h2 className='text-xl font-semibold text-slate-800 mt-3'>I am hiring</h2>
          <ol className='space-y-4 mt-4'>
            <Step n='1' title='Apply as an employer'>Tell us about your business, with a phone number and a website or registration number. We approve every employer first.</Step>
            <Step n='2' title='Search available workers'>Filter by kind of work, country, trade, experience and who can start now.</Step>
            <Step n='3' title='Send a request and post jobs'>Workers who accept share their contact details. Your jobs also appear on our Jobs page.</Step>
          </ol>
          <Link to='/app/hire' className='mt-6 inline-flex items-center gap-2 px-6 py-2.5 border border-brand-600 text-brand-700 hover:bg-brand-50 rounded-full text-sm font-medium'>Start hiring <LuArrowRight className='size-4' /></Link>
        </div>
      </div>

      <div className='grid sm:grid-cols-3 gap-4 mt-10'>
        {[[LuEyeOff, 'Private by default', 'Names, emails and phone numbers are hidden until a worker accepts.'], [LuBadgeCheck, 'Approved employers only', 'Phone, website or registration number are checked before an employer can search.'], [LuShieldCheck, 'No fees, ever', 'Employers promise never to charge workers. Report any job that asks for money.']].map(([I, t, d]) => (
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
