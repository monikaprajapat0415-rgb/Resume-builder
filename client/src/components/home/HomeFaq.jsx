import React from 'react'
import Title from './Title'

export const FAQ = [
  { q: 'Is Prime Resume AI free?', a: 'Yes. You can build a resume and download it for free. Some extras may need an account.' },
  { q: 'Are the resume templates ATS-friendly?', a: 'Yes. The templates use clean, single-flow layouts that applicant tracking systems can parse. You can also run your resume through the free ATS checker.' },
  { q: 'Can I use it if I have no office experience?', a: 'Yes. It supports factory, trade, driving, retail and other skilled jobs, and fresher resumes with no work history.' },
  { q: 'Does the AI write my resume for me?', a: 'It suggests wording for your summary and bullet points. You review and edit every line before you download.' },
  { q: 'How are salary figures and company reviews checked?', a: 'They are shared by members and reviewed before they appear. A salary range or an average rating is shown only after at least three reports agree.' },
  { q: 'Where can I find interview questions?', a: 'Under Jobs, Interview questions: questions for freshers and experienced candidates with model answers.' },
]

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

const HomeFaq = () => (
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

export default HomeFaq
