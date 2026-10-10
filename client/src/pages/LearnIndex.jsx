import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import NavBar from '../components/home/NavBar'
import Footer from '../components/home/Footer'
import api from '../configs/api'
import { stripInline } from '../utils/inlineText'
import { dropServerJsonLd } from '../utils/seoDom'
import { LuArrowRight, LuBookOpen } from 'react-icons/lu'

const SITE = 'https://primeresumeai.com'
const DESC = 'Free, step-by-step tutorials for new technologies, with clear explanations and working code examples.'

export const CourseBadge = ({ course, className = 'size-14 text-lg' }) => (
  course.coverImage
    ? <img src={course.coverImage} alt={course.coverAlt || course.title} loading='lazy' className={`${className} rounded-xl object-cover border border-slate-100`} />
    : <span aria-hidden='true' className={`${className} rounded-xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0`}>{course.badge || course.title.slice(0, 2).toUpperCase()}</span>
)

const LearnIndex = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let live = true
    api.get('/api/learn')
      .then(({ data }) => { if (live) setCourses(data.courses || []) })
      .catch(() => { if (live) setFailed(true) })
      .finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [])

  useEffect(() => { if (!loading) dropServerJsonLd() }, [loading])

  const topics = [...new Set(courses.map((c) => c.topic || 'Tutorials'))]
  const structuredData = loading ? undefined : [
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Learn new technologies', url: `${SITE}/learn`, inLanguage: 'en',
      mainEntity: { '@type': 'ItemList', itemListElement: courses.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/learn/${c.slug}`, name: c.title })) },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Home', url: `${SITE}/` }, { name: 'Learn', url: `${SITE}/learn` }].map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
    },
  ]

  return (
    <div>
      <SEO title='Learn new technologies: free step-by-step tutorials' description={DESC} keywords='tutorials, learn programming, free courses, web development tutorials' path='/learn' structuredData={structuredData} />
      <NavBar />
      <section className='max-w-5xl mx-auto px-4 py-16'>
        <nav aria-label='Breadcrumb' className='text-xs text-slate-400 mb-6'>
          <Link to='/' className='hover:text-slate-600'>Home</Link> › <span>Learn</span>
        </nav>
        <div className='text-center max-w-2xl mx-auto mb-12'>
          <h1 className='text-4xl font-semibold text-slate-800'>Learn new technologies</h1>
          <p className='text-slate-500 mt-3'>{DESC}</p>
        </div>

        {loading ? <p className='text-center text-slate-400'>Loading tutorials…</p>
          : failed ? <p className='text-center text-slate-500'>Could not load the tutorials. Please refresh the page.</p>
          : courses.length === 0 ? <p className='text-center text-slate-400'>New tutorials are on the way. Check back soon.</p>
          : topics.map((topic) => (
            <div key={topic} className='mb-12'>
              {topics.length > 1 && <h2 className='text-sm font-semibold uppercase tracking-wide text-slate-400 mb-4'>{topic}</h2>}
              <div className='grid sm:grid-cols-2 gap-5'>
                {courses.filter((c) => (c.topic || 'Tutorials') === topic).map((c) => (
                  <Link key={c.slug} to={`/learn/${c.slug}`} className='group flex gap-4 rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md hover:border-brand-200 transition'>
                    <CourseBadge course={c} />
                    <div className='min-w-0'>
                      <h3 className='text-lg font-semibold text-slate-800 group-hover:text-brand-600 transition'>{c.title}</h3>
                      <p className='text-sm text-slate-500 mt-1 line-clamp-2'>{stripInline(c.summary)}</p>
                      <p className='flex items-center gap-3 text-xs text-slate-400 mt-3'>
                        <span className='inline-flex items-center gap-1'><LuBookOpen className='size-3.5' />{c.lessonCount} lessons</span>
                        <span>{c.level}</span>
                      </p>
                    </div>
                    <LuArrowRight className='size-5 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition shrink-0 self-center ml-auto' />
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </section>
      <Footer />
    </div>
  )
}

export default LearnIndex
