import React from 'react'
import Title from './Title'
import Reveal from '../Reveal'
import { useHomeTrust } from '../../utils/homeTrust'
import { LuStar, LuQuote } from 'react-icons/lu'

const Stars = ({ n }) => n > 0 ? (
  <span className="flex gap-0.5" role="img" aria-label={`${n} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => <LuStar key={i} className={`size-4 ${i <= n ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} aria-hidden="true" />)}
  </span>
) : null

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('')

// Customer and employer feedback. Shown only when an admin has published real reviews (with permission to show them).
const ReviewsSection = () => {
  const trust = useHomeTrust()
  const reviews = trust?.reviews || []
  if (!reviews.length) return null
  return (
    <section id="reviews" aria-label="Reviews from job seekers and employers" className="py-14 px-4 scroll-mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center"><Title title="What people say" desciption="Feedback from job seekers and employers who used Prime Resume AI." /></div>
        <ul className="mt-10 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
          {reviews.map((r, i) => (
            <Reveal as="li" key={r.id} delay={(i % 3) * 110} className="snap-center shrink-0 w-[85%] sm:w-auto lift rounded-2xl border border-slate-200 bg-white p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <Stars n={r.rating} />
                <LuQuote className="size-6 text-brand-200" aria-hidden="true" />
              </div>
              <blockquote className="mt-4 text-slate-600 text-sm leading-relaxed flex-1">“{r.quote}”</blockquote>
              <div className="mt-5 flex items-center gap-3">
                {r.logoUrl
                  ? <img src={r.logoUrl} alt="" loading="lazy" className="size-10 rounded-full object-cover" />
                  : <span className="grid size-10 place-items-center rounded-full bg-brand-100 text-brand-800 text-sm font-semibold" aria-hidden="true">{initials(r.name)}</span>}
                <span className="text-sm">
                  <span className="block font-medium text-slate-800">{r.name}</span>
                  <span className="block text-slate-500">{[r.role, r.company].filter(Boolean).join(', ')}{r.location ? ` · ${r.location}` : ''}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ReviewsSection
