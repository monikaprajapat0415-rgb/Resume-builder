import React from 'react'

// "Publish at" for drafts, plus a Preview link. `value` is an ISO string or ''. Only shown while the item is a draft.
const toLocal = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(+d)) return ''
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

const PublishAt = ({ published, value, onChange, previewPath }) => (
  <div className='text-sm'>
    {!published && (
      <label className='block text-slate-700'>Publish at <span className='text-slate-400'>(optional: the draft goes live by itself at this time; checked every minute; your browser's time zone)</span>
        <div className='mt-1 flex flex-wrap items-center gap-2'>
          <input type='datetime-local' value={toLocal(value)} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : '')} className='px-3 py-2 border border-slate-200 rounded-md text-sm bg-white' />
          {value && <button type='button' onClick={() => onChange('')} className='text-xs text-slate-500 hover:text-slate-800 underline'>Clear</button>}
        </div>
        {value && <span className='block text-xs text-amber-700 mt-1'>Scheduled for {new Date(value).toLocaleString()}. Save to keep it.</span>}
      </label>
    )}
    {previewPath && <a href={`${previewPath}?preview=1`} target='_blank' rel='opener' onClick={(e) => { e.preventDefault(); window.open(`${previewPath}?preview=1`) }} className='mt-2 inline-block text-brand-700 hover:underline'>Preview as a reader (opens in a new tab, admins only)</a>}
  </div>
)
export default PublishAt
