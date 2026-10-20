import React from 'react'
import Title from './Title'
import { useSiteContent } from '../../utils/siteContent'

// Questions come from Admin > Homepage text, so the visible text and the FAQPage markup always match.
export const faqFrom = (site) => [1, 2, 3, 4, 5, 6].map((n) => ({ q: site[`faq_${n}_q`], a: site[`faq_${n}_a`] })).filter((f) => f.q && f.a)

export const faqJsonLd = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
})

const HomeFaq = () => {
  const FAQ = faqFrom(useSiteContent())
  if (!FAQ.length) return null
  return (
  <section id="faq" aria-labelledby="faq-h" className="py-14 px-4 bg-slate-50 scroll-mt-12">
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center"><Title title="Frequently asked questions" desciption="" /></div>
      <h2 id="faq-h" className="sr-only">Frequently asked questions</h2>
      <div className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {FAQ.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium text-slate-800">
              {f.q}<span aria-hidden="true" className="text-slate-400 group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-sm text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
  )
}

export default HomeFaq
