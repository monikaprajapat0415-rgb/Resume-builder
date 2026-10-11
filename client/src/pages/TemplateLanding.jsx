import React from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import { getTemplateBySlug, resumeTemplates } from '../content/resumeTemplates'
import { LuArrowLeft, LuCheck } from 'react-icons/lu'

const TemplateLanding = () => {
  const { slug } = useParams()
  const template = getTemplateBySlug(slug)

  if (!template) {
    return <Navigate to='/templates' replace />
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: template.name,
    description: template.description,
    image: `https://primeresumeai.com${template.image}`,
    brand: { '@type': 'Organization', name: 'Prime Resume AI' },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  const other = resumeTemplates.filter((t) => t.slug !== template.slug).slice(0, 6)

  return (
    <div>
      <SEO
        title={`${template.name} — Free & ATS-Friendly`}
        description={template.description}
        keywords={template.keywords}
        path={`/templates/${template.slug}`}
        structuredData={structuredData}
      />
      <NavBar />
      <section className='max-w-5xl mx-auto px-4 py-14'>
        <Link to='/templates' className='inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition mb-8'>
          <LuArrowLeft className='size-4' />All templates
        </Link>

        <div className='grid md:grid-cols-2 gap-10 items-start'>
          <div className='h-[480px] overflow-hidden flex justify-center bg-gray-100 rounded-xl border border-slate-200'>
            <div className='w-[1000px] origin-top'>
              <img src={template.image} alt={template.name} loading='lazy' />
            </div>
          </div>

          <div>
            <h1 className='text-3xl sm:text-4xl font-bold text-slate-800 leading-tight'>{template.name}</h1>
            <p className='text-slate-500 mt-3 text-lg'>{template.tagline}</p>
            <p className='text-slate-600 mt-5 leading-relaxed'>{template.description}</p>

            <Link
              to={`/app?state=register&template=${template.id}`}
              className='inline-block mt-7 px-7 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition'
            >
              Use this template — it's free
            </Link>

            {template.ats && (
              <div className='mt-8 rounded-xl border border-green-100 bg-green-50/60 p-4'>
                <p className='text-sm font-semibold text-slate-800'>ATS-friendliness: <span className='text-green-700'>{template.ats.rating}</span></p>
                <ul className='mt-2 space-y-1.5'>
                  {template.ats.points.map((pt, i) => (
                    <li key={i} className='flex items-start gap-2 text-sm text-slate-600'><LuCheck className='size-4 text-green-600 mt-0.5 shrink-0' />{pt}</li>
                  ))}
                </ul>
                <p className='text-xs text-slate-400 mt-3'>Our own assessment of the layout. Always check your finished resume with the <Link to='/features/ats-checker' className='underline'>free ATS checker</Link>.</p>
              </div>
            )}

            <div className='mt-10'>
              <p className='text-sm font-semibold text-slate-800 mb-3'>Best for</p>
              <ul className='space-y-2'>
                {template.bestFor.map((item, i) => (
                  <li key={i} className='flex items-start gap-2 text-sm text-slate-600'>
                    <LuCheck className='size-4 text-brand-600 mt-0.5 shrink-0' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className='mt-8'>
              <p className='text-sm font-semibold text-slate-800 mb-3'>Template features</p>
              <ul className='space-y-2'>
                {template.features.map((item, i) => (
                  <li key={i} className='flex items-start gap-2 text-sm text-slate-600'>
                    <LuCheck className='size-4 text-brand-600 mt-0.5 shrink-0' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {other.length > 0 && (
          <div className='mt-16'>
            <p className='text-sm font-semibold text-slate-800 mb-4'>Other templates</p>
            <div className='grid sm:grid-cols-3 gap-4'>
              {other.map((t) => (
                <Link key={t.slug} to={`/templates/${t.slug}`} className='block rounded-lg border border-slate-200 p-4 hover:border-brand-200 hover:shadow-sm transition'>
                  <p className='text-sm font-medium text-slate-800'>{t.name}</p>
                  <p className='text-xs text-slate-500 mt-1'>{t.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}

export default TemplateLanding
