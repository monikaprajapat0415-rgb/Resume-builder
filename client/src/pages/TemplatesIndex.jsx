import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import { resumeTemplates } from '../content/resumeTemplates'
import { LuArrowRight } from 'react-icons/lu'

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
        title="Free ATS-Friendly Resume Templates"
        description="Browse 9 free, professionally designed resume templates: Classic, Modern, Minimal, Executive, Compact, Bold Header, Timeline, Graduate and more. ATS-friendly and fully customizable online."
        keywords="resume templates, free resume templates, ATS resume templates, professional resume templates"
        path="/templates"
        structuredData={structuredData}
      />
      <NavBar />
      <section className='max-w-5xl mx-auto px-4 py-16'>
        <div className='text-center max-w-2xl mx-auto mb-14'>
          <h1 className='text-4xl font-semibold text-slate-800'>Free Resume Templates</h1>
          <p className='text-slate-500 mt-3'>Every template is built as plain, readable text so applicant tracking systems can parse it, and each one shows its ATS rating. Pick a style and fill it in online — no design software needed.</p>
        </div>

        <div className='grid sm:grid-cols-2 gap-8'>
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
      </section>
      <Footer />
    </div>
  )
}

export default TemplatesIndex
