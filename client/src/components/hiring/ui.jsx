import React, { useEffect } from 'react'
import { LuMapPin, LuWifi, LuBriefcase, LuClock, LuX, LuIndianRupee } from 'react-icons/lu'

export const LEVELS = [['fresher', 'Fresher'], ['junior', 'Junior (1-2 yrs)'], ['mid', 'Mid (3-5 yrs)'], ['senior', 'Senior (6+ yrs)'], ['lead', 'Lead / Manager']]
export const levelLabel = (v) => (LEVELS.find(([k]) => k === v) || [, v])[1]
export const JOB_TYPES = [['full-time', 'Full-time'], ['part-time', 'Part-time'], ['contract', 'Contract'], ['internship', 'Internship']]
export const NOTICE = ['Immediate', '15 days', '30 days', '60 days', '90 days']
export const SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+']

const TONE = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200', approved: 'bg-green-50 text-green-800 border-green-200', accepted: 'bg-green-50 text-green-800 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200', declined: 'bg-slate-100 text-slate-600 border-slate-200', suspended: 'bg-red-50 text-red-700 border-red-200',
  withdrawn: 'bg-slate-100 text-slate-500 border-slate-200', expired: 'bg-slate-100 text-slate-500 border-slate-200',
}
export const StatusBadge = ({ status, children }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium capitalize ${TONE[status] || TONE.declined}`}>{children || status}</span>
)

// What a company is allowed to see about a job seeker: no name, email or phone.
export const TalentCard = ({ t, action, compact }) => (
  <div className='rounded-xl border border-slate-200 bg-white p-5'>
    <div className='flex items-start justify-between gap-3'>
      <div className='min-w-0'>
        <h3 className='text-lg font-semibold text-slate-800'>{t.headline}</h3>
        <p className='text-xs text-slate-400 mt-0.5'>Candidate {t.id} · {levelLabel(t.level)}{t.experienceYears ? ` · ${t.experienceYears} yr${t.experienceYears === 1 ? '' : 's'} experience` : ''}</p>
      </div>
      {action}
    </div>
    <p className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-3'>
      {t.location && <span className='inline-flex items-center gap-1'><LuMapPin className='size-3.5' />{t.location}</span>}
      {t.remote && <span className='inline-flex items-center gap-1'><LuWifi className='size-3.5' />Open to remote</span>}
      {t.relocate && <span>Open to relocate</span>}
      {t.jobTypes?.length > 0 && <span className='inline-flex items-center gap-1'><LuBriefcase className='size-3.5' />{t.jobTypes.join(', ')}</span>}
      {t.noticePeriod && <span className='inline-flex items-center gap-1'><LuClock className='size-3.5' />Notice: {t.noticePeriod}</span>}
      {t.expectedSalary && <span className='inline-flex items-center gap-1'><LuIndianRupee className='size-3.5' />{t.expectedSalary}</span>}
    </p>
    {t.skills?.length > 0 && <ul className='flex flex-wrap gap-1.5 mt-3'>{t.skills.slice(0, compact ? 8 : 25).map((s) => <li key={s} className='px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 text-xs'>{s}</li>)}</ul>}
    {t.summary && !compact && <p className='text-sm text-slate-600 mt-3 whitespace-pre-line'>{t.summary}</p>}
  </div>
)

export const Modal = ({ title, onClose, children, wide }) => {
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k) }, [onClose])
  return (
    <div className='fixed inset-0 z-50 bg-black/40 flex items-start sm:items-center justify-center p-4 overflow-y-auto' onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role='dialog' aria-modal='true' aria-label={title} className={`bg-white rounded-2xl shadow-xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} p-5 sm:p-6 my-8`}>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-slate-800'>{title}</h2>
          <button type='button' onClick={onClose} aria-label='Close' className='p-1 rounded hover:bg-slate-100'><LuX className='size-5' /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const Switch = ({ checked, onChange, label, disabled }) => (
  <button type='button' role='switch' aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)}
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:opacity-50 ${checked ? 'bg-brand-600' : 'bg-slate-300'}`}>
    <span className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
)

export const timeShort = (d) => { try { return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' } }
export const errMsg = (e, fallback) => e?.response?.data?.message || fallback
