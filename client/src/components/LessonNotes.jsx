import React, { useEffect } from 'react'
import { renderInline } from '../utils/inlineText'

// "My notes" card: the key points of a lesson in a handwriting font on ruled paper.
// The handwriting font (Caveat) is only fetched when a lesson that has notes is opened.
const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&display=swap'
const FONT_ID = 'caveat-font'

const LessonNotes = ({ notes }) => {
  useEffect(() => {
    if (!Array.isArray(notes) || notes.length === 0) return
    if (document.getElementById(FONT_ID)) return
    const link = document.createElement('link')
    link.id = FONT_ID
    link.rel = 'stylesheet'
    link.href = FONT_HREF
    document.head.appendChild(link)
  }, [notes])

  if (!Array.isArray(notes) || notes.length === 0) return null

  return (
    <section aria-labelledby='lesson-notes' className='mt-12 print:break-inside-avoid'>
      <div
        className='relative mx-auto max-w-2xl rounded-md border border-amber-200 bg-[#fffdf3] px-6 pb-6 pt-8 shadow-sm sm:px-9 sm:rotate-[-0.4deg]'
        style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 33px, rgba(96,165,250,.28) 33px, rgba(96,165,250,.28) 34px)', backgroundPosition: '0 14px' }}
      >
        <span aria-hidden='true' className='absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-2deg] rounded-sm bg-amber-200/70 shadow-sm' />
        <span aria-hidden='true' className='absolute inset-y-0 left-4 w-px bg-rose-300/60 sm:left-6' />
        <h2 id='lesson-notes' className='hand mb-2 pl-3 text-3xl font-semibold text-slate-800'>
          My notes
        </h2>
        <ul className='space-y-0 pl-3'>
          {notes.map((n, i) => (
            <li key={i} className='hand flex gap-2 text-[1.5rem] leading-[34px] text-slate-700 [&_code]:rounded [&_code]:bg-amber-100/70 [&_code]:px-1 [&_code]:text-[0.95em]'>
              <span aria-hidden='true' className='text-rose-500'>✓</span>
              <span>{renderInline(n)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default LessonNotes
