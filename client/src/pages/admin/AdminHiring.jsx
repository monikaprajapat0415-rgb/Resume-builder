import React, { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuCheck, LuX, LuBan, LuExternalLink, LuTriangleAlert } from 'react-icons/lu'
import api from '../../configs/api'
import SEO from '../../components/SEO'
import { StatusBadge, timeShort, errMsg } from '../../components/hiring/ui'

const Stat = ({ n, label }) => <div className='rounded-xl bg-white border border-slate-200 px-4 py-3'><p className='text-2xl font-semibold text-slate-800'>{n ?? '-'}</p><p className='text-xs text-slate-500'>{label}</p></div>

const AdminHiring = () => {
  const { token } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const [tab, setTab] = useState('companies')
  const [stats, setStats] = useState({})
  const [cf, setCf] = useState('pending')
  const [jf, setJf] = useState('pending')
  const [companies, setCompanies] = useState(null)
  const [jobs, setJobs] = useState(null)

  const loadStats = () => api.get('/api/admin/hiring/stats', auth).then(({ data }) => setStats(data)).catch(() => {})
  const loadC = useCallback(() => api.get('/api/admin/hiring/employers', { ...auth, params: { status: cf } }).then(({ data }) => setCompanies(data.employers)).catch(() => setCompanies([])), [cf])
  const loadJ = useCallback(() => api.get('/api/admin/hiring/jobs', { ...auth, params: { status: jf } }).then(({ data }) => setJobs(data.jobs)).catch(() => setJobs([])), [jf])
  useEffect(() => { loadStats() }, [])
  useEffect(() => { loadC() }, [loadC])
  useEffect(() => { loadJ() }, [loadJ])
  useEffect(() => { loadStats(); tab === 'jobs' ? loadJ() : loadC() }, [tab])   // fresh list every time you switch tabs

  const review = async (kind, id, status) => {
    let note = ''
    if (status === 'rejected' || status === 'suspended') { note = window.prompt(status === 'suspended' ? 'Reason (shown to the company):' : 'What should they fix? (shown to the company)', '') ; if (note === null) return }
    try { await api.patch(`/api/admin/hiring/${kind}/${id}`, { status, note }, auth); toast.success('Updated'); loadStats(); kind === 'employers' ? loadC() : loadJ() }
    catch (e) { toast.error(errMsg(e, 'Could not update.')) }
  }

  return (
    <div>
      <SEO title='Admin: Hiring' noindex />
      <h1 className='text-2xl font-semibold text-slate-800 mb-1'>Hiring</h1>
      <p className='text-sm text-slate-500 mb-5'>Approve companies and review the jobs they post. Candidates are never shown to a company until it is approved.</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6'>
        <Stat n={stats.pendingEmployers} label='Companies waiting' /><Stat n={stats.pendingJobs} label='Jobs waiting' /><Stat n={stats.approvedEmployers} label='Approved companies' />
        <Stat n={stats.talentAvailable} label='Available candidates' /><Stat n={stats.talentTotal} label='Candidate profiles' /><Stat n={stats.requests} label='Contact requests' />
      </div>
      <div role='tablist' className='flex gap-1 border-b border-slate-200 mb-5'>
        {[['companies', 'Companies'], ['jobs', 'Job posts']].map(([id, l]) => <button key={id} role='tab' aria-selected={tab === id} onClick={() => setTab(id)} className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 ${tab === id ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500'}`}>{l}</button>)}
      </div>

      {tab === 'companies' && (
        <>
          <div className='flex flex-wrap gap-2 mb-4'>{['pending', 'approved', 'rejected', 'suspended', 'all'].map((s) => <button key={s} onClick={() => setCf(s)} aria-pressed={cf === s} className={`px-3 py-1 text-xs rounded-full border capitalize ${cf === s ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300 text-slate-600'}`}>{s}</button>)}</div>
          {!companies ? <p className='text-slate-400'>Loading…</p> : companies.length === 0 ? <p className='text-slate-400 text-sm'>Nothing here.</p> : (
            <ul className='space-y-3'>{companies.map((c) => (
              <li key={c.id} className='rounded-xl border border-slate-200 bg-white p-5'>
                <div className='flex flex-wrap items-start justify-between gap-3'>
                  <div><p className='font-semibold text-slate-800'>{c.companyName}</p>
                    <a href={c.website} target='_blank' rel='nofollow noopener noreferrer' className='text-xs text-brand-700 hover:underline inline-flex items-center gap-1'>{c.website}<LuExternalLink className='size-3' /></a></div>
                  <div className='text-right'><StatusBadge status={c.status} /><p className='text-xs text-slate-400 mt-1'>{timeShort(c.createdAt)}</p></div>
                </div>
                <dl className='grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-600 mt-3'>
                  <div>Work email: <strong>{c.workEmail}</strong> {c.domainMatch ? <span className='text-green-700 text-xs'>(matches website)</span> : <span className='text-amber-700 text-xs inline-flex items-center gap-1'><LuTriangleAlert className='size-3' />different domain from website</span>}</div>
                  <div>Contact: {c.contactName}{c.contactRole ? `, ${c.contactRole}` : ''}</div>
                  <div>Login account: {c.accountEmail}</div><div>{[c.industry, c.size && `${c.size} people`, c.location].filter(Boolean).join(' · ')}</div>
                  {c.phone && <div>Phone: {c.phone}</div>}<div>Open jobs: {c.openJobs} · Requests sent: {c.requestsSent}</div>
                </dl>
                {c.about && <p className='text-sm text-slate-600 mt-3 rounded-lg bg-slate-50 p-3 whitespace-pre-line'>{c.about}</p>}
                {c.reviewNote && <p className='text-xs text-slate-500 mt-2'>Note: {c.reviewNote}</p>}
                <div className='flex flex-wrap gap-2 mt-4'>
                  {c.status !== 'approved' && <button onClick={() => review('employers', c.id, 'approved')} className='inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm'><LuCheck className='size-4' />Approve</button>}
                  {c.status === 'pending' && <button onClick={() => review('employers', c.id, 'rejected')} className='inline-flex items-center gap-1.5 px-4 py-1.5 border border-slate-300 rounded-full text-sm hover:bg-slate-50'><LuX className='size-4' />Reject</button>}
                  {c.status === 'approved' && <button onClick={() => review('employers', c.id, 'suspended')} className='inline-flex items-center gap-1.5 px-4 py-1.5 border border-red-300 text-red-700 rounded-full text-sm hover:bg-red-50'><LuBan className='size-4' />Suspend</button>}
                </div>
              </li>
            ))}</ul>
          )}
        </>
      )}

      {tab === 'jobs' && (
        <>
          <div className='flex flex-wrap gap-2 mb-4'>{['pending', 'approved', 'rejected', 'all'].map((s) => <button key={s} onClick={() => setJf(s)} aria-pressed={jf === s} className={`px-3 py-1 text-xs rounded-full border capitalize ${jf === s ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300 text-slate-600'}`}>{s}</button>)}</div>
          {!jobs ? <p className='text-slate-400'>Loading…</p> : jobs.length === 0 ? <p className='text-slate-400 text-sm'>Nothing here.</p> : (
            <ul className='space-y-3'>{jobs.map((j) => (
              <li key={j.id} className='rounded-xl border border-slate-200 bg-white p-5'>
                <div className='flex flex-wrap items-start justify-between gap-3'>
                  <div><p className='font-semibold text-slate-800'>{j.title}</p><p className='text-sm text-slate-500'>{j.company} · {[j.location, j.employmentType, j.salary].filter(Boolean).join(' · ')}</p></div>
                  <StatusBadge status={j.reviewStatus} />
                </div>
                <p className='text-xs text-slate-500 mt-2'>Apply via: <span className='font-mono break-all'>{j.applyUrl}</span></p>
                <p className='text-sm text-slate-600 mt-3 rounded-lg bg-slate-50 p-3 whitespace-pre-line max-h-56 overflow-y-auto'>{j.description}</p>
                <div className='flex gap-2 mt-4'>
                  {j.reviewStatus !== 'approved' && <button onClick={() => review('jobs', j.id, 'approved')} className='inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm'><LuCheck className='size-4' />Approve</button>}
                  {j.reviewStatus !== 'rejected' && <button onClick={() => review('jobs', j.id, 'rejected')} className='inline-flex items-center gap-1.5 px-4 py-1.5 border border-slate-300 rounded-full text-sm hover:bg-slate-50'><LuX className='size-4' />Reject</button>}
                </div>
              </li>
            ))}</ul>
          )}
        </>
      )}
    </div>
  )
}

export default AdminHiring
