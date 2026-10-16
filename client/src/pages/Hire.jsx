import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuSearch, LuSend, LuClock, LuPlus, LuMail, LuPhone, LuUser, LuMessageCircle } from 'react-icons/lu'
import { BiLoaderAlt } from 'react-icons/bi'
import SEO from '../components/SEO'
import api from '../configs/api'
import { trackEvent } from '../components/Analytics'
import { Text, Area, Field, inputCls } from '../components/cv/CvFields'
import { CATEGORIES, COUNTRIES, CURRENCIES, PAY_PER, EMPLOYER_TYPES, JOB_TYPES_ALL, PERKS, isLabour, catShort, currencyFor, defaultPayPer, payText, guessCountry } from '../utils/workTaxonomy'
import { LEVELS, SIZES, TalentCard, StatusBadge, Modal, timeShort, errMsg } from '../components/hiring/ui'

const BLANK_CO = { employerType: 'company', country: '', registrationNo: '', companyName: '', website: '', workEmail: '', contactName: '', contactRole: '', phone: '', industry: '', size: '', location: '', about: '' }
const TABS = [['talent', 'Find talent'], ['requests', 'Requests'], ['jobs', 'My jobs'], ['company', 'Company']]

// Company side: apply, wait for approval, then search available candidates, contact them and post jobs.
const Hire = () => {
  const { token, user } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const [emp, setEmp] = useState(undefined)   // undefined = loading, null = none
  const [tab, setTab] = useState('talent')
  useEffect(() => { api.get('/api/employers/me', auth).then(({ data }) => setEmp(data.employer)).catch(() => { setEmp(null); toast.error('Could not load your company.') }) }, [])

  if (emp === undefined) return <div className='max-w-5xl mx-auto px-4 py-16 text-center text-slate-400'>Loading…</div>
  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <SEO title='Hire talent' description='Find available candidates and post jobs.' noindex />
      {(!emp || emp.status === 'rejected') && <CompanyForm key={emp?.id || 'new'} emp={emp} auth={auth} defaults={{ contactName: user?.name || '' }} onSaved={setEmp} />}
      {emp?.status === 'pending' && <Waiting emp={emp} auth={auth} onSaved={setEmp} />}
      {emp?.status === 'suspended' && <div className='rounded-2xl border border-red-200 bg-red-50 p-6'><h1 className='text-xl font-semibold text-red-800'>Your company is suspended</h1><p className='text-sm text-red-700 mt-2'>{emp.reviewNote || 'Hiring access has been paused.'} Please <Link to='/contact-us' className='underline'>contact us</Link> if you think this is a mistake.</p></div>}
      {emp?.status === 'approved' && (
        <>
          <div className='flex flex-wrap items-center justify-between gap-3 mb-5'>
            <div><h1 className='text-2xl font-semibold text-slate-800'>{emp.companyName}</h1><p className='text-sm text-slate-500'>Hiring dashboard</p></div>
            <StatusBadge status='approved'>Approved company</StatusBadge>
          </div>
          <div role='tablist' className='flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto'>
            {TABS.map(([id, label]) => <button key={id} role='tab' aria-selected={tab === id} onClick={() => setTab(id)} className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 whitespace-nowrap transition ${tab === id ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{label}</button>)}
          </div>
          {tab === 'talent' && <FindTalent auth={auth} goRequests={() => setTab('requests')} />}
          {tab === 'requests' && <Requests auth={auth} />}
          {tab === 'jobs' && <MyJobs auth={auth} country={emp.country} />}
          {tab === 'company' && <CompanyForm emp={emp} auth={auth} onSaved={(e) => { setEmp(e); if (e.status !== 'approved') toast('Changes to name, website or email need a quick re-approval.') }} />}
        </>
      )}
    </div>
  )
}

const CompanyForm = ({ emp, auth, onSaved, defaults = {} }) => {
  const [f, setF] = useState({ ...BLANK_CO, country: guessCountry(), ...defaults, ...(emp ? Object.fromEntries(Object.keys(BLANK_CO).map((k) => [k, emp[k] || ''])) : {}) })
  const [busy, setBusy] = useState(false)
  const set = (p) => setF((x) => ({ ...x, ...p }))
  const [noFee, setNoFee] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    if (!f.country) return toast.error('Choose your country.')
    if (!emp && !noFee) return toast.error('Please confirm you will never charge workers a fee.')
    setBusy(true)
    try {
      const body = emp ? f : { ...f, noFee: true }
      const { data } = emp ? await api.put('/api/employers/me', body, auth) : await api.post('/api/employers', body, auth)
      if (!emp) trackEvent('employer_applied')
      onSaved(data.employer); toast.success(emp ? 'Saved' : 'Submitted for approval')
    } catch (err) { toast.error(errMsg(err, 'Could not save.')) } finally { setBusy(false) }
  }
  const isNew = !emp
  return (
    <form onSubmit={submit} className='bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 max-w-3xl'>
      <div>
        <h1 className='text-2xl font-semibold text-slate-800'>{isNew ? 'Hire talent on Prime Resume AI' : emp.status === 'rejected' ? 'Update your company details' : 'Company details'}</h1>
        {isNew && <p className='text-sm text-slate-500 mt-1'>Tell us about your company. We approve every company before it can see candidates, which keeps job seekers safe. It usually takes a day or two.</p>}
        {emp?.status === 'rejected' && <p className='mt-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2'>Not approved yet{emp.reviewNote ? `: ${emp.reviewNote}` : '.'} Fix the details below and submit again.</p>}
      </div>
      <div className='grid sm:grid-cols-2 gap-4'>
        <Field label='Who is hiring?' required><select className={inputCls} value={f.employerType} onChange={(e) => set({ employerType: e.target.value })}>{EMPLOYER_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
        <Field label='Country' required><select className={inputCls} value={f.country} onChange={(e) => set({ country: e.target.value })}><option value=''>Select country</option>{COUNTRIES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}</select></Field>
        <Text label='Business name' required value={f.companyName} onChange={(v) => set({ companyName: v })} maxLength={150} />
        <Text label='Registration number' hint='GST, CIN, Companies House, CRA or local registration. Needed if you have no company website.' value={f.registrationNo} onChange={(v) => set({ registrationNo: v })} maxLength={60} />
        <Text label='Website (optional)' value={f.website} onChange={(v) => set({ website: v })} placeholder='https://example.com' />
        <Text label='Email' required hint='A company email is best. A Gmail or similar address is accepted only with a registration number.' type='email' value={f.workEmail} onChange={(v) => set({ workEmail: v })} placeholder='you@yourcompany.com' />
        <Text label='Your name' required value={f.contactName} onChange={(v) => set({ contactName: v })} maxLength={100} />
        <Text label='Your role' value={f.contactRole} onChange={(v) => set({ contactRole: v })} placeholder='e.g. HR Manager' maxLength={100} />
        <Text label='Phone / WhatsApp' required type='tel' inputMode='tel' value={f.phone} onChange={(v) => set({ phone: v })} maxLength={30} />
        <Text label='Industry' value={f.industry} onChange={(v) => set({ industry: v })} placeholder='e.g. Software, Manufacturing' maxLength={100} />
        <Field label='Company size'><select className={inputCls} value={f.size} onChange={(e) => set({ size: e.target.value })}><option value=''>Select</option>{SIZES.map((s) => <option key={s} value={s}>{s} people</option>)}</select></Field>
      </div>
      <Text label='Location' value={f.location} onChange={(v) => set({ location: v })} placeholder='e.g. Pune, India' maxLength={150} />
      <Area label='About your company' required hint={`${f.about.length}/1000. Workers read this before they decide to reply.`} rows={4} value={f.about} onChange={(v) => set({ about: v.slice(0, 1000) })} />
      {isNew ? <label className='flex items-start gap-2 text-sm text-slate-700 rounded-lg border border-amber-200 bg-amber-50 p-3'><input type='checkbox' className='mt-1' checked={noFee} onChange={(e) => setNoFee(e.target.checked)} /><span>I confirm that we will <strong>never ask workers to pay</strong> any fee, deposit or commission to get a job, and that every job we post is real. Breaking this gets the account removed.</span></label> : emp.noFeeConfirmedAt && <p className='text-xs text-slate-500'>No-fee pledge confirmed.</p>}
      <button disabled={busy} className='inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-full text-sm font-medium'>{busy && <BiLoaderAlt className='size-4 animate-spin' />}{isNew ? 'Submit for approval' : emp.status === 'rejected' ? 'Submit again' : 'Save changes'}</button>
    </form>
  )
}

const Waiting = ({ emp, auth, onSaved }) => {
  const [edit, setEdit] = useState(false)
  if (edit) return <CompanyForm emp={emp} auth={auth} onSaved={(e) => { onSaved(e); setEdit(false) }} />
  return (
    <div className='rounded-2xl border border-amber-200 bg-amber-50 p-6 max-w-2xl'>
      <p className='inline-flex items-center gap-2 text-amber-800 font-semibold'><LuClock className='size-5' />Waiting for approval</p>
      <h1 className='text-xl font-semibold text-slate-800 mt-2'>{emp.companyName} is under review</h1>
      <p className='text-sm text-slate-600 mt-2'>We check each company before it can see candidates. You will get an email at {emp.workEmail} as soon as it is approved. Meanwhile, you can still browse <Link to='/jobs' className='text-brand-700 underline'>open jobs</Link>.</p>
      <button onClick={() => setEdit(true)} className='mt-4 text-sm text-brand-700 hover:underline'>Edit my details</button>
    </div>
  )
}

const FindTalent = ({ auth, goRequests }) => {
  const [q, setQ] = useState({ q: '', skills: '', location: '', level: '', remote: false, minExp: '', category: '', country: '', availableNow: false, workRight: false, travel: false })
  const [data, setData] = useState({ talent: [], total: 0, pages: 1 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [contact, setContact] = useState(null)
  const [applied, setApplied] = useState(q)

  const load = useCallback(() => {
    setLoading(true)
    const p = { ...applied, remote: applied.remote ? 1 : undefined, availableNow: applied.availableNow ? 1 : undefined, workRight: applied.workRight ? 1 : undefined, travel: applied.travel ? 1 : undefined, page }
    Object.keys(p).forEach((k) => (p[k] === '' || p[k] === undefined) && delete p[k])
    api.get('/api/employers/talent', { ...auth, params: p }).then(({ data }) => setData(data)).catch((e) => toast.error(errMsg(e, 'Could not search.'))).finally(() => setLoading(false))
  }, [applied, page])
  useEffect(() => { load() }, [load])
  const submit = (e) => { e.preventDefault(); setPage(1); setApplied(q) }

  return (
    <div>
      <div className='flex flex-wrap gap-2 mb-3' role='group' aria-label='Kind of worker'>
        {[{ id: '', label: 'All workers' }, ...CATEGORIES].map((c) => <button key={c.id} type='button' aria-pressed={q.category === c.id} onClick={() => { const n = { ...q, category: c.id }; setQ(n); setApplied(n); setPage(1) }} className={`px-4 py-2 text-sm rounded-full border ${q.category === c.id ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{c.icon ? `${c.icon} ` : ''}{c.label}</button>)}
      </div>
      <form onSubmit={submit} className='grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4'>
        <label className='relative sm:col-span-2'><span className='sr-only'>Role or skill</span><LuSearch className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400' /><input value={q.q} onChange={(e) => setQ({ ...q, q: e.target.value })} placeholder='Job or keyword, e.g. electrician, welder, accountant' className='w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-full text-sm bg-white' /></label>
        <input aria-label='Skills (comma separated)' value={q.skills} onChange={(e) => setQ({ ...q, skills: e.target.value })} placeholder='Must-have skills: React, Node.js' className='px-4 py-2.5 border border-slate-200 rounded-full text-sm bg-white' />
        <input aria-label='Location' value={q.location} onChange={(e) => setQ({ ...q, location: e.target.value })} placeholder='City' className='px-4 py-2.5 border border-slate-200 rounded-full text-sm bg-white' />
        <select aria-label='Country' value={q.country} onChange={(e) => setQ({ ...q, country: e.target.value })} className='px-3 py-2.5 border border-slate-200 rounded-full text-sm bg-white text-slate-600'><option value=''>Any country</option>{COUNTRIES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}</select>
        <select aria-label='Experience level' value={q.level} onChange={(e) => setQ({ ...q, level: e.target.value })} className='px-3 py-2.5 border border-slate-200 rounded-full text-sm bg-white text-slate-600'><option value=''>Any level</option>{LEVELS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <input aria-label='Minimum years' type='number' min='0' value={q.minExp} onChange={(e) => setQ({ ...q, minExp: e.target.value })} placeholder='Min. years' className='px-4 py-2.5 border border-slate-200 rounded-full text-sm bg-white' />
        <div className='flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 px-2 items-center sm:col-span-2'>
          <label className='inline-flex items-center gap-2'><input type='checkbox' checked={q.availableNow} onChange={(e) => setQ({ ...q, availableNow: e.target.checked })} /> Can start now</label>
          <label className='inline-flex items-center gap-2'><input type='checkbox' checked={q.workRight} onChange={(e) => setQ({ ...q, workRight: e.target.checked })} /> Has right to work</label>
          <label className='inline-flex items-center gap-2'><input type='checkbox' checked={q.travel} onChange={(e) => setQ({ ...q, travel: e.target.checked })} /> Can travel</label>
          <label className='inline-flex items-center gap-2'><input type='checkbox' checked={q.remote} onChange={(e) => setQ({ ...q, remote: e.target.checked })} /> Remote</label>
        </div>
        <button className='px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium'>Search</button>
      </form>
      <p className='text-xs text-slate-500 mb-4'>Workers are anonymous until they accept your request. Contact details are never shown before that.</p>
      {loading ? <p className='text-center text-slate-400 py-10'>Searching…</p> : data.talent.length === 0 ? <p className='text-center text-slate-400 py-10'>No available candidates match. Try fewer filters.</p> : (
        <>
          <p className='text-sm text-slate-400 mb-3'>{data.total} available candidate{data.total === 1 ? '' : 's'}</p>
          <ul className='grid gap-3'>{data.talent.map((t) => (
            <li key={t.id}><TalentCard t={t} action={
              t.requestStatus === 'pending' ? <StatusBadge status='pending'>Request sent</StatusBadge>
                : t.requestStatus === 'accepted' ? <button onClick={goRequests} className='text-xs text-green-700 underline'>View contact</button>
                : t.requestStatus === 'declined' ? <StatusBadge status='declined'>Declined</StatusBadge>
                : <button onClick={() => setContact(t)} className='inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm shrink-0'><LuSend className='size-3.5' />Contact</button>} /></li>
          ))}</ul>
          {data.pages > 1 && <nav aria-label='Pages' className='flex items-center justify-between mt-6 text-sm text-slate-500'>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className='px-4 py-2 rounded-full border border-slate-200 disabled:opacity-40'>← Previous</button><span>Page {page} of {data.pages}</span>
            <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className='px-4 py-2 rounded-full border border-slate-200 disabled:opacity-40'>Next →</button></nav>}
        </>
      )}
      {contact && <ContactModal t={contact} auth={auth} onClose={() => setContact(null)} onSent={() => { setContact(null); load() }} />}
    </div>
  )
}

const ContactModal = ({ t, auth, onClose, onSent }) => {
  const [message, setMessage] = useState('')
  const [jobId, setJobId] = useState('')
  const [jobs, setJobs] = useState([])
  const [busy, setBusy] = useState(false)
  useEffect(() => { api.get('/api/employers/jobs', auth).then(({ data }) => setJobs(data.jobs.filter((j) => j.reviewStatus === 'approved' && j.active))).catch(() => {}) }, [])
  const send = async (e) => {
    e.preventDefault(); setBusy(true)
    try { await api.post(`/api/employers/talent/${t.id}/contact`, { message, jobId: jobId || undefined }, auth); trackEvent('talent_contact_sent'); toast.success('Request sent. We emailed the candidate.'); onSent() }
    catch (err) { toast.error(errMsg(err, 'Could not send.')) } finally { setBusy(false) }
  }
  return (
    <Modal title={`Contact ${t.headline}`} onClose={onClose}>
      <form onSubmit={send} className='space-y-4'>
        <p className='text-sm text-slate-500'>Introduce the role and your company. The candidate sees your message and company profile, then chooses whether to share their contact details.</p>
        {jobs.length > 0 && <Field label='About one of your jobs (optional)'><select className={inputCls} value={jobId} onChange={(e) => setJobId(e.target.value)}><option value=''>General introduction</option>{jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}</select></Field>}
        <Area label='Your message' required rows={6} hint={`${message.length}/1200. At least 30 characters.`} value={message} onChange={(v) => setMessage(v.slice(0, 1200))} placeholder='Hi, we are hiring a ... in ... and your skills in ... look like a great match. Could we speak this week?' />
        <div className='flex gap-2 justify-end'><button type='button' onClick={onClose} className='px-4 py-2 text-sm text-slate-600'>Cancel</button><button disabled={busy || message.trim().length < 30} className='inline-flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-full text-sm'>{busy && <BiLoaderAlt className='size-4 animate-spin' />}Send request</button></div>
      </form>
    </Modal>
  )
}

const Requests = ({ auth }) => {
  const [rows, setRows] = useState(null)
  const load = () => api.get('/api/employers/requests', auth).then(({ data }) => setRows(data.requests)).catch(() => setRows([]))
  useEffect(() => { load() }, [])
  const withdraw = async (id) => { try { await api.post(`/api/employers/requests/${id}/withdraw`, {}, auth); toast.success('Request withdrawn'); load() } catch (e) { toast.error(errMsg(e, 'Could not withdraw.')) } }
  if (!rows) return <p className='text-center text-slate-400 py-10'>Loading…</p>
  if (!rows.length) return <p className='text-sm text-slate-500 rounded-xl border border-dashed border-slate-300 p-8 text-center'>You have not contacted anyone yet. Use "Find talent" to reach available candidates.</p>
  return (
    <ul className='space-y-3'>{rows.map((r) => (
      <li key={r.id} className='rounded-xl border border-slate-200 bg-white p-5'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div><p className='font-semibold text-slate-800'>{r.candidate?.headline || 'Candidate'} <span className='text-xs font-normal text-slate-400'>{r.candidate?.id}</span></p>{r.job && <p className='text-xs text-slate-500'>About: {r.job.title}</p>}</div>
          <div className='text-right'><StatusBadge status={r.status} /><p className='text-xs text-slate-400 mt-1'>{timeShort(r.createdAt)}</p></div>
        </div>
        <p className='text-sm text-slate-600 mt-3 whitespace-pre-line rounded-lg bg-slate-50 p-3'>{r.message}</p>
        {r.status === 'accepted' && r.contact && (
          <div className='mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900'>
            <p className='font-medium'>Shared contact details</p>
            <p className='mt-1 inline-flex items-center gap-1.5'><LuUser className='size-4' />{r.contact.name}</p>
            {r.contact.email && <p className='inline-flex items-center gap-1.5 ml-4'><LuMail className='size-4' /><a href={`mailto:${r.contact.email}`} className='underline'>{r.contact.email}</a></p>}
            {r.contact.phone && <p className='inline-flex items-center gap-1.5 ml-4'><LuPhone className='size-4' />{r.contact.phone}</p>}
            {r.contact.whatsapp && r.contact.phone && <a href={`https://wa.me/${String(r.contact.phone).replace(/\D/g, '')}`} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1.5 ml-4 underline'><LuMessageCircle className='size-4' />WhatsApp</a>}
            {r.reply && <p className='mt-2 text-green-800'>"{r.reply}"</p>}
          </div>
        )}
        {r.status === 'declined' && r.reply && <p className='text-xs text-slate-500 mt-2'>Their note: {r.reply}</p>}
        {r.status === 'pending' && <button onClick={() => withdraw(r.id)} className='mt-3 text-sm text-slate-500 hover:underline'>Withdraw request</button>}
      </li>
    ))}</ul>
  )
}

const BLANK_JOB = { category: 'corporate', country: '', title: '', location: '', remote: false, employmentType: 'full-time', department: '', payMin: '', payMax: '', payPer: 'year', currency: 'USD', openings: '', perks: [], description: '', applyUrl: '', applyEmail: '' }

const MyJobs = ({ auth, country }) => {
  const [jobs, setJobs] = useState(null)
  const [edit, setEdit] = useState(null)   // null | {} (new) | job
  const load = () => api.get('/api/employers/jobs', auth).then(({ data }) => setJobs(data.jobs)).catch(() => setJobs([]))
  useEffect(() => { load() }, [])
  const act = async (fn, ok) => { try { await fn(); toast.success(ok); load() } catch (e) { toast.error(errMsg(e, 'Something went wrong.')) } }
  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <p className='text-sm text-slate-500'>Jobs you post appear on the <Link to='/jobs' className='text-brand-700 underline'>Jobs page</Link> after a quick review.</p>
        <button onClick={() => setEdit({})} className='inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm'><LuPlus className='size-4' />Post a job</button>
      </div>
      {!jobs ? <p className='text-center text-slate-400 py-10'>Loading…</p> : jobs.length === 0 ? <p className='text-sm text-slate-500 rounded-xl border border-dashed border-slate-300 p-8 text-center'>No jobs posted yet.</p> : (
        <ul className='space-y-3'>{jobs.map((j) => (
          <li key={j.id} className='rounded-xl border border-slate-200 bg-white p-5'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div><p className='font-semibold text-slate-800'>{j.title}</p><p className='text-xs text-slate-500'>{[catShort(j.category), j.location, j.employmentType, j.salary].filter(Boolean).join(' · ')}</p></div>
              <div className='flex items-center gap-2'><StatusBadge status={j.reviewStatus}>{j.reviewStatus === 'approved' ? (j.active ? 'Live' : 'Closed') : j.reviewStatus === 'pending' ? 'In review' : 'Needs changes'}</StatusBadge></div>
            </div>
            {j.reviewStatus === 'rejected' && j.reviewNote && <p className='text-sm text-red-700 mt-2'>Reviewer note: {j.reviewNote}</p>}
            <div className='flex flex-wrap gap-4 mt-3 text-sm'>
              {j.reviewStatus === 'approved' && <Link to={`/jobs/${j.slug}`} className='text-brand-700 hover:underline'>View</Link>}
              <button onClick={() => setEdit(j)} className='text-slate-600 hover:underline'>Edit</button>
              {j.reviewStatus === 'approved' && <button onClick={() => act(() => api.patch(`/api/employers/jobs/${j.id}`, { active: !j.active }, auth), j.active ? 'Job closed' : 'Job reopened')} className='text-slate-600 hover:underline'>{j.active ? 'Close' : 'Reopen'}</button>}
              <button onClick={() => window.confirm('Delete this job?') && act(() => api.delete(`/api/employers/jobs/${j.id}`, auth), 'Deleted')} className='text-red-600 hover:underline'>Delete</button>
            </div>
          </li>
        ))}</ul>
      )}
      {edit && <JobModal job={edit} country={country} auth={auth} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); load() }} />}
    </div>
  )
}

const JobModal = ({ job, country, auth, onClose, onSaved }) => {
  const editing = Boolean(job.id)
  const [f, setF] = useState({ ...BLANK_JOB, ...(country ? { country, currency: currencyFor(country) } : {}), ...Object.fromEntries(Object.keys(BLANK_JOB).filter((k) => job[k] !== undefined && job[k] !== null).map((k) => [k, job[k]])), applyUrl: job.applyUrl?.startsWith('mailto:') ? '' : job.applyUrl || '', applyEmail: job.applyUrl?.startsWith('mailto:') ? job.applyUrl.slice(7) : '' })
  const [busy, setBusy] = useState(false)
  const set = (p) => setF((x) => ({ ...x, ...p }))
  const save = async (e) => {
    e.preventDefault(); setBusy(true)
    try { editing ? await api.put(`/api/employers/jobs/${job.id}`, f, auth) : await api.post('/api/employers/jobs', f, auth); trackEvent('employer_job_posted'); toast.success('Sent for review. We will email you when it is live.'); onSaved() }
    catch (err) { toast.error(errMsg(err, 'Could not save the job.')) } finally { setBusy(false) }
  }
  return (
    <Modal title={editing ? 'Edit job' : 'Post a job'} onClose={onClose} wide>
      <form onSubmit={save} className='space-y-4'>
        <fieldset><legend className='block text-sm font-medium text-slate-700 mb-1.5'>Kind of work</legend>
          <div className='flex flex-wrap gap-2'>{CATEGORIES.map((c) => <button key={c.id} type='button' aria-pressed={f.category === c.id} onClick={() => set({ category: c.id, payPer: defaultPayPer(c.id), employmentType: c.id === 'daily_wage' ? 'daily-wage' : f.employmentType })} className={`px-3.5 py-2 text-sm rounded-full border ${f.category === c.id ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{c.icon} {c.label}</button>)}</div></fieldset>
        <Text label='Job title' required value={f.title} onChange={(v) => set({ title: v })} maxLength={200} placeholder={isLabour(f.category) ? 'e.g. Electrician for factory maintenance' : 'e.g. Accounts Executive'} />
        <div className='grid sm:grid-cols-2 gap-4'>
          <Field label='Country' required><select className={inputCls} value={f.country} onChange={(e) => set({ country: e.target.value, currency: currencyFor(e.target.value) })}>{COUNTRIES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}</select></Field>
          <Text label='Location' value={f.location} onChange={(v) => set({ location: v })} placeholder='e.g. Pune' maxLength={200} />
          <Field label='Job type'><select className={inputCls} value={f.employmentType} onChange={(e) => set({ employmentType: e.target.value })}>{JOB_TYPES_ALL.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
          <Text label='Openings' type='number' inputMode='numeric' value={f.openings} onChange={(v) => set({ openings: v })} placeholder='How many people?' />
          {!isLabour(f.category) && <Text label='Department (optional)' value={f.department} onChange={(v) => set({ department: v })} maxLength={120} />}
        </div>
        <fieldset><legend className='block text-sm font-medium text-slate-700 mb-1.5'>Pay (optional, but jobs with pay get more replies)</legend>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
            <input aria-label='Minimum pay' type='number' inputMode='decimal' min='0' className={inputCls} value={f.payMin} onChange={(e) => set({ payMin: e.target.value })} placeholder='From' />
            <input aria-label='Maximum pay' type='number' inputMode='decimal' min='0' className={inputCls} value={f.payMax} onChange={(e) => set({ payMax: e.target.value })} placeholder='To' />
            <select aria-label='Currency' className={inputCls} value={f.currency} onChange={(e) => set({ currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>
            <select aria-label='Pay period' className={inputCls} value={f.payPer} onChange={(e) => set({ payPer: e.target.value })}>{PAY_PER.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          </div>
          {(f.payMin || f.payMax) && <p className='text-xs text-slate-500 mt-1'>Workers will see: {payText({ payMin: Number(f.payMin), payMax: Number(f.payMax), currency: f.currency, payPer: f.payPer })}</p>}
        </fieldset>
        {isLabour(f.category) && <fieldset><legend className='block text-sm font-medium text-slate-700 mb-1.5'>What do you provide?</legend>
          <div className='flex flex-wrap gap-2'>{PERKS.map((p) => { const on = f.perks.includes(p); return <button key={p} type='button' aria-pressed={on} onClick={() => set({ perks: on ? f.perks.filter((x) => x !== p) : [...f.perks, p] })} className={`px-3 py-1.5 text-sm rounded-full border ${on ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{p}</button> })}</div></fieldset>}
        <label className='inline-flex items-center gap-2 text-sm text-slate-700'><input type='checkbox' checked={f.remote} onChange={(e) => set({ remote: e.target.checked })} /> Remote friendly</label>
        <Area label='Description' required rows={9} hint={`Duties, hours, place of work and how to apply. Start a line with "- " for bullet points. At least ${isLabour(f.category) ? 30 : 80} characters. Do not ask workers for money.`} value={f.description} onChange={(v) => set({ description: v })} />
        <div className='grid sm:grid-cols-2 gap-4'>
          <Text label='Apply link' hint='Your careers page or form (or use email)' value={f.applyUrl} onChange={(v) => set({ applyUrl: v })} placeholder='https://...' />
          <Text label='...or apply email' type='email' value={f.applyEmail} onChange={(v) => set({ applyEmail: v })} placeholder='jobs@yourcompany.com' />
        </div>
        <p className='text-xs text-slate-500'>Every job is reviewed before it goes live. Editing a live job sends it for review again.</p>
        <div className='flex gap-2 justify-end'><button type='button' onClick={onClose} className='px-4 py-2 text-sm text-slate-600'>Cancel</button><button disabled={busy} className='inline-flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-full text-sm'>{busy && <BiLoaderAlt className='size-4 animate-spin' />}{editing ? 'Save and resubmit' : 'Submit for review'}</button></div>
      </form>
    </Modal>
  )
}

export default Hire
