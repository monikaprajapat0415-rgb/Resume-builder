import React from 'react'
import { LuCircleCheck, LuCircleAlert, LuX, LuUndo2 } from 'react-icons/lu'

// Shown in the resume builder after "Apply fixes": what was changed, and what only the person can add.
// The resume is a normal resume from here on, so everything can be edited.
export default function AtsFixNotice({ applied = [], needsYou = [], onUndo, onClose }) {
  return (
    <div className='max-w-7xl mx-auto px-4 pb-4 print:hidden' data-no-i18n>
      <section aria-label='ATS fixes applied' className='relative rounded-xl border border-green-200 bg-green-50/60 p-4 sm:p-5'>
        <button type='button' onClick={onClose} aria-label='Close this notice' className='absolute top-3 right-3 text-slate-400 hover:text-slate-700'><LuX className='size-5' /></button>
        <p className='font-semibold text-slate-800 pr-8'>We applied the ATS fixes. Please read through and edit anything you like.</p>
        <div className='mt-3 grid md:grid-cols-2 gap-4 text-sm'>
          <div>
            <p className='font-medium text-slate-700 mb-1'>What we changed</p>
            {applied.length ? <ul className='space-y-1'>{applied.map((a, i) => <li key={i} className='flex gap-2 text-slate-700'><LuCircleCheck className='size-4 mt-0.5 shrink-0 text-green-600' aria-hidden='true' />{a}</li>)}</ul> : <p className='text-slate-500'>Wording and layout were tidied.</p>}
          </div>
          <div>
            <p className='font-medium text-slate-700 mb-1'>Only you can add these</p>
            {needsYou.length ? <ul className='space-y-1'>{needsYou.map((a, i) => <li key={i} className='flex gap-2 text-slate-700'><LuCircleAlert className='size-4 mt-0.5 shrink-0 text-amber-600' aria-hidden='true' />{a}</li>)}</ul> : <p className='text-slate-500'>Nothing else needed from the checker.</p>}
          </div>
        </div>
        <p className='mt-3 text-xs text-slate-500'>We never add numbers, skills or jobs you did not write. Check every line is true before you apply.</p>
        {onUndo && <button type='button' onClick={onUndo} className='mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50'><LuUndo2 className='size-4' aria-hidden='true' />Undo these changes</button>}
      </section>
    </div>
  )
}
