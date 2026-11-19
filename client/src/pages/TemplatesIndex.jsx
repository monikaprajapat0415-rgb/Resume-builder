import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import { resumeTemplates } from '../content/resumeTemplates'
import { LuArrowRight } from 'react-icons/lu'

const CHOOSE = [
  ["graduate-resume-template", "Student or fresher:", "Graduate & Fresher", " puts education and projects first."],
  ["skilled-trades-resume-template", "Factory, warehouse or trade work:", "Skilled Trades", " uses large, easy-to-read text with your skills and licences near the top."],
  ["developer-resume-template", "Developer or IT:", "Developer", " lists skills first and puts projects before education."],
  ["career-change-resume-template", "Changing careers:", "Career Change", " leads with a profile and your transferable skills."],
  ["executive-resume-template", "Senior roles:", "Executive", " is a formal serif layout for senior and leadership roles."],
  ["classic-resume-template", "Not sure:", "Classic", ", Minimal and Professional are plain single-column layouts rated Excellent for ATS. Start with one of them."],
]
const CHOOSE_NOTE = "Sidebar, Two-Column and the photo version are rated Good or Very good, not Excellent, because some applicant tracking systems can read columns out of order. Photo customs differ by country, so follow the job post."

const TemplatesIndex = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Resume Templates',
    description: 'Free, ATS-friendly resume templates you can customize online.',
    url: 'https://primeresumeai.com/templates',
  }

  return (
    <div>
      <SEO
        title={`${resumeTemplates.length} Free ATS-Friendly Resume Templates`}
        description={`Pick from ${resumeTemplates.length} free resume templates: classic, modern, developer, skilled trades, career change and more. Each shows its ATS rating. Edit online and download.`}
        keywords="resume templates, free resume templates, ATS resume templates, professional resume templates"
        path="/templates"
        structuredData={structuredData}
      />
      <NavBar />
      <section className='site-w py-16'>
        <div className='text-center max-w-2xl mx-auto mb-14'>
          <h1 className='text-4xl font-semibold text-slate-800'>Free Resume Templates</h1>
          <p className='text-slate-500 mt-3'>Every template is built as plain, readable text so applicant tracking systems can parse it, and each one shows its ATS rating. Pick a style and fill it in online — no design software needed.</p>
        </div>

        <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-8'>
          {resumeTemplates.map((t) => (
            <Link
              key={t.slug}
              to={`/templates/${t.slug}`}
              className='group block rounded-xl border border-slate-200 overflow-hidden bg-white hover:shadow-md hover:border-brand-200 transition'
            >
              <div className='h-[280px] overflow-hidden flex justify-center bg-gray-100'>
                <div className='w-[1000px] origin-top'>
                  <img src={t.image} alt={t.name} loading='lazy' />
                </div>
              </div>
              <div className='p-5'>
                <div className='flex items-center justify-between gap-3'><h2 className='text-lg font-semibold text-slate-800 group-hover:text-brand-600 transition'>{t.name}</h2>{t.ats && <span className='shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700'>ATS: {t.ats.rating}</span>}</div>
                <p className='text-sm text-slate-500 mt-2'>{t.tagline}</p>
                <span className='inline-flex items-center gap-1 text-sm text-brand-600 font-medium mt-4'>
                  View template <LuArrowRight className='size-4 group-hover:translate-x-1 transition-transform' />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <section className='max-w-3xl mx-auto mt-14'>
          <h2 className='text-2xl font-semibold text-slate-800'>How to choose a resume template</h2>
          <ul className='mt-4 space-y-2 text-slate-600 list-disc ps-5'>
            {CHOOSE.map(([slug, lead, name, rest]) => (
              <li key={slug}><strong className='text-slate-800'>{lead}</strong> <Link to={`/templates/${slug}`} className='text-brand-700 underline'>{name}</Link>{rest}</li>
            ))}
          </ul>
          <p className='mt-4 text-sm text-slate-600'>{CHOOSE_NOTE}</p>
        </section>
        <p className='text-center text-sm text-slate-600 mt-12'>Want to see a finished one first? Browse <Link to='/examples' className='text-brand-700 underline'>resume and CV examples that score 100/100</Link> on every automatic ATS check.</p>
      </section>
      <Footer />
    </div>
  )
}

export default TemplatesIndex
