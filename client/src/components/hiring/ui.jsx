import React, { useEffect } from 'react'
import { LuMapPin, LuWifi, LuBriefcase, LuClock, LuX, LuBanknote, LuWrench, LuShieldCheck } from 'react-icons/lu'
import { isLabour, catShort, countryName, availLabel, payText } from '../../utils/workTaxonomy'

export const LEVELS = [['fresher', 'Fresher'], ['junior', 'Junior (1-2 yrs)'], ['mid', 'Mid (3-5 yrs)'], ['senior', 'Senior (6+ yrs)'], ['lead', 'Lead / Manager']]
export const levelLabel = (v) => (LEVELS.find(([k]) => k === v) || [, v])[1]
export { JOB_TYPES_ALL as JOB_TYPES } from '../../utils/workTaxonomy'
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
export const TalentCard = ({ t, action, compact }) => {
  const labour = isLabour(t.category)
  const pay = t.payAmount > 0 ? payText({ payMin: t.payAmount, currency: t.currency, payPer: t.payPer }) : t.expectedSalary
  const years = t.experienceYears ? `${t.experienceYears} yr${t.experienceYears === 1 ? '' : 's'} experience` : labour ? 'New to this work' : ''
  return (
    <div className='rounded-xl border border-slate-200 bg-white p-5'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <h3 className='text-lg font-semibold text-slate-800'>{t.headline}</h3>
          <p className='text-xs text-slate-400 mt-0.5'>Candidate {t.id} · {catShort(t.category || 'corporate')}{t.country ? ` · ${countryName(t.country)}` : ''}{!labour && t.level ? ` · ${levelLabel(t.level)}` : ''}{years ? ` · ${years}` : ''}</p>
        </div>
        {action}
      </div>
      <p className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-3'>
        {t.location && <span className='inline-flex items-center gap-1'><LuMapPin className='size-3.5' />{t.location}</span>}
        {t.availability && <span className='inline-flex items-center gap-1 text-green-700 font-medium'><LuClock className='size-3.5' />{availLabel(t.availability)}</span>}
        {pay && <span className='inline-flex items-center gap-1 font-medium text-slate-700'><LuBanknote className='size-3.5' />{pay}</span>}
        {t.remote && <span className='inline-flex items-center gap-1'><LuWifi className='size-3.5' />Open to remote</span>}
        {t.willingToTravel && <span>Will travel to site</span>}
        {t.relocate && <span>Open to relocate</span>}
        {t.ownTools && <span className='inline-flex items-center gap-1'><LuWrench className='size-3.5' />Has own tools</span>}
        {t.jobTypes?.length > 0 && <span className='inline-flex items-center gap-1'><LuBriefcase className='size-3.5' />{t.jobTypes.join(', ')}</span>}
        {!labour && t.noticePeriod && <span>Notice: {t.noticePeriod}</span>}
        {t.workRight === 'yes' && <span className='inline-flex items-center gap-1'><LuShieldCheck className='size-3.5' />Says they can work in {countryName(t.country)}</span>}
        {t.workRight === 'need_sponsorship' && <span>Needs visa sponsorship</span>}
      </p>
      {t.certifications?.length > 0 && <ul className='flex flex-wrap gap-1.5 mt-3' aria-label='Licences and certificates'>{t.certifications.map((c) => <li key={c} className='px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-100 text-xs'>{c}</li>)}</ul>}
      {t.skills?.length > 0 && <ul className='flex flex-wrap gap-1.5 mt-2'>{t.skills.slice(0, compact ? 8 : 25).map((s) => <li key={s} className='px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 text-xs'>{s}</li>)}</ul>}
      {t.languages?.length > 0 && <p className='text-xs text-slate-500 mt-2'>Speaks: {t.languages.join(', ')}</p>}
      {t.summary && !compact && <p className='text-sm text-slate-600 mt-3 whitespace-pre-line'>{t.summary}</p>}
    </div>
  )
}

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
