import React from 'react'
import Title from './Title'
import { useSiteContent } from '../../utils/siteContent'

// Honest value points instead of invented customer quotes.
// Keeps id="testimonials" so the existing "/#testimonials" menu link still scrolls here.
const POINTS = [
  { title: 'Built for every kind of job', text: 'Templates and examples for office roles as well as factory, trade and field work, not only tech.' },
  { title: 'ATS-friendly by design', text: 'Clean layouts that applicant tracking systems can read, plus a checker to test your own resume.' },
  { title: 'You control the content', text: 'AI suggests wording for your summary and bullet points. You review and edit everything before you download.' },
  { title: 'Free to start', text: 'Build and download without paying. Create an account to save your resumes and apply to jobs.' },
]

const Testimonials = () => {
  const site = useSiteContent()
  return (
  <section id="testimonials" aria-labelledby="why-h" className="py-14 px-4 scroll-mt-12">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col items-center">
        <Title title={site.why_title} desciption="What you get, in plain words." />
      </div>
      <h2 id="why-h" className="sr-only">Why use Prime Resume AI</h2>
      <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {POINTS.map((p) => (
          <li key={p.title} className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-medium text-slate-800">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{p.text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
  )
}

export default Testimonials
