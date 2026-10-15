import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { LuShieldCheck, LuEyeOff, LuCheck, LuX, LuBan, LuBuilding2, LuTrash2 } from 'react-icons/lu'
import { BiLoaderAlt } from 'react-icons/bi'
import SEO from '../components/SEO'
import api from '../configs/api'
import { trackEvent } from '../components/Analytics'
import { Text, Area, Field, inputCls } from '../components/cv/CvFields'
import { ChipInput } from '../components/cv/CvChips'
import { buildSkillSuggestions } from '../utils/cvSuggestions'
import { LEVELS, JOB_TYPES, NOTICE, TalentCard, StatusBadge, Switch, timeShort, errMsg } from '../components/hiring/ui'

const BLANK = { headline: '', level: 'fresher', experienceYears: 0, skills: [], location: '', remote: false, relocate: false, jobTypes: ['full-time'], expectedSalary: '', noticePeriod: '', summary: '', phone: '', reminders: true }

// Job seeker side: switch "available to work" on, describe yourself anonymously, and answer company requests.
const OpenToWork = () => {
  const { token, user } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [requests, setRequests] = useState([])
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const loadRequests = () => api.get('/api/talent/me/requests', auth).then(({ data }) => setRequests(data.requests)).catch(() => {})
  useEffect(() => {
    api.get('/api/talent/me', auth).then(({ data }) => {
      setProfile(data.profile)
      if (data.profile) { const p = data.profile; setForm({ ...BLANK, headline: p.headline, level: p.level, experienceYears: p.experienceYears, skills: p.skills, location: p.location, remote: p.remote, relocate: p.relocate, jobTypes: p.jobTypes, expectedSalary: p.expectedSalary, noticePeriod: p.noticePeriod, summary: p.summary, phone: p.phone || '', reminders: p.reminders !== false }); loadRequests() }
    }).catch(() => toast.error('Could not load your profile.')).finally(() => setLoading(false))
  }, [])

  const groups = useMemo(() => buildSkillSuggestions({ jobTitle: form.headline, input: {}, have: form.skills }), [form.headline, form.skills])
  const preview = { id: profile?.id || 'T-XXXXXXXX', ...form, experienceYears: Number(form.experienceYears) || 0, updatedAt: new Date() }

  const save = async (e) => {
    e?.preventDefault(); setSaving(true)
    try {
      const { data } = await api.put('/api/talent/me', { ...form, experienceYears: Number(form.experienceYears) || 0 }, auth)
      if (!profile) trackEvent('talent_profile_created')
      setProfile(data.profile); setForm((f) => ({ ...f, headline: data.profile.headline, summary: data.profile.summary, location: data.profile.location }))
      toast.success(profile ? 'Profile saved' : 'You are now visible to companies')
      loadRequests()
    } catch (err) { toast.error(errMsg(err, 'Could not save.')) } finally { setSaving(false) }
  }
  const toggle = async (on) => {
    try { const { data } = await api.put('/api/talent/me', { available: on }, auth); setProfile(data.profile); toast.success(on ? 'Companies can find you again' : 'You are hidden from companies') }
    catch (err) { toast.error(errMsg(err, 'Could not change this.')) }
  }
  const remove = async () => {
    if (!window.confirm('Remove your profile? Companies will no longer see you and open requests will be declined.')) return
    try { await api.delete('/api/talent/me', auth); setProfile(null); setForm(BLANK); setRequests([]); toast.success('Profile removed') } catch (err) { toast.error(errMsg(err, 'Could not remove.')) }
  }

  if (loading) return <div className='max-w-5xl mx-auto px-4 py-16 text-center text-slate-400'>Loading…</div>
  const pending = requests.filter((r) => r.status === 'pending')

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <SEO title='Open to work' description='Tell companies you are available to work.' noindex />
      <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-800'>Open to work</h1>
          <p className='text-slate-500 text-sm mt-1'>Let companies find you. They see your skills, not your name or contact details, and you decide who gets to talk to you.</p>
        </div>
        {profile && (
          <div className='flex items-center gap-3 rounded-full border border-slate-200 bg-white pl-4 pr-3 py-2'>
            <span className={`text-sm font-medium ${profile.available ? 'text-green-700' : 'text-slate-500'}`}>{profile.available ? 'Available to work' : 'Hidden from companies'}</span>
            <Switch checked={profile.available} onChange={toggle} label='Available to work' />
          </div>
        )}
      </div>

      {pending.length > 0 && <p role='status' className='mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2.5'>{pending.length} compan{pending.length === 1 ? 'y wants' : 'ies want'} to talk to you. Scroll down to reply.</p>}

      <div className='grid lg:grid-cols-[1fr_340px] gap-6 items-start'>
        <form onSubmit={save} className='bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5'>
          <h2 className='font-semibold text-slate-800'>{profile ? 'Your profile' : 'Create your profile'}</h2>
          <Text label='Role you are looking for' required value={form.headline} onChange={(v) => set({ headline: v })} placeholder='e.g. Full Stack Developer' maxLength={100} />
          <fieldset>
            <legend className='block text-sm font-medium text-slate-700 mb-1.5'>Experience level</legend>
            <div className='flex flex-wrap gap-2'>
              {LEVELS.map(([k, l]) => <button key={k} type='button' aria-pressed={form.level === k} onClick={() => set({ level: k })} className={`px-3 py-1.5 text-xs rounded-full border transition ${form.level === k ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{l}</button>)}
            </div>
          </fieldset>
          <div className='grid sm:grid-cols-2 gap-4'>
            <Field label='Years of experience'><input type='number' min='0' max='50' step='0.5' className={inputCls} value={form.experienceYears} onChange={(e) => set({ experienceYears: e.target.value })} /></Field>
            <Text label='City' value={form.location} onChange={(v) => set({ location: v })} placeholder='e.g. Pune' />
          </div>
          <div className='flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700'>
            <label className='inline-flex items-center gap-2'><input type='checkbox' checked={form.remote} onChange={(e) => set({ remote: e.target.checked })} /> Open to remote work</label>
            <label className='inline-flex items-center gap-2'><input type='checkbox' checked={form.relocate} onChange={(e) => set({ relocate: e.target.checked })} /> Open to relocate</label>
          </div>
          <fieldset>
            <legend className='block text-sm font-medium text-slate-700 mb-1.5'>Job types</legend>
            <div className='flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700'>
              {JOB_TYPES.map(([k, l]) => <label key={k} className='inline-flex items-center gap-2'><input type='checkbox' checked={form.jobTypes.includes(k)} onChange={(e) => set({ jobTypes: e.target.checked ? [...form.jobTypes, k] : form.jobTypes.filter((x) => x !== k) })} /> {l}</label>)}
            </div>
          </fieldset>
          <ChipInput label='Skills' value={form.skills} onChange={(v) => set({ skills: v })} max={25} maxLen={40} placeholder='Type a skill and press Enter' suggestionGroups={groups} countHint={(n) => `${n}/25 · aim for 6-15`} />
          <div className='grid sm:grid-cols-2 gap-4'>
            <Text label='Expected salary (optional)' value={form.expectedSalary} onChange={(v) => set({ expectedSalary: v })} placeholder='e.g. 8-12 LPA' maxLength={60} />
            <div>
              <Text label='Notice period' value={form.noticePeriod} onChange={(v) => set({ noticePeriod: v })} placeholder='e.g. 30 days' maxLength={40} />
              <div className='flex flex-wrap gap-1.5 mt-1.5'>{NOTICE.map((n) => <button key={n} type='button' onClick={() => set({ noticePeriod: n })} className='px-2.5 py-0.5 text-xs rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50'>{n}</button>)}</div>
            </div>
          </div>
          <Area label='Short introduction' hint={`${form.summary.length}/600. Describe what you do and what you are looking for. Do not include your name, email, phone or links; we remove them.`} rows={4} value={form.summary} onChange={(v) => set({ summary: v.slice(0, 600) })} />
          <Text label='Phone (optional)' hint='Never shown to companies. Shared only if you choose to when you accept a request.' value={form.phone} onChange={(v) => set({ phone: v })} placeholder='+91 ...' maxLength={30} />
          <label className='flex items-start gap-2 text-sm text-slate-700'><input type='checkbox' className='mt-1' checked={form.reminders} onChange={(e) => set({ reminders: e.target.checked })} /><span>Email me one reminder if a company is waiting for my answer for 3 days</span></label>
          <div className='flex flex-wrap items-center gap-3'>
            <button type='submit' disabled={saving} className='inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-full text-sm font-medium transition'>
              {saving && <BiLoaderAlt className='size-4 animate-spin' />}{profile ? 'Save changes' : 'Make me visible to companies'}
            </button>
            {profile && <button type='button' onClick={remove} className='inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline'><LuTrash2 className='size-4' />Remove my profile</button>}
          </div>
        </form>

        <aside className='space-y-4 lg:sticky lg:top-4'>
          <div className='rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900'>
            <p className='font-semibold inline-flex items-center gap-2'><LuShieldCheck className='size-4' />Your privacy</p>
            <ul className='mt-2 space-y-1.5 list-disc pl-5'>
              <li>Only companies we approved can see this.</li>
              <li>Your name, email and phone stay hidden until you accept a request.</li>
              <li>You can decline, block a company, or hide yourself at any time.</li>
            </ul>
          </div>
          <div>
            <p className='text-xs font-medium text-slate-500 mb-2 inline-flex items-center gap-1.5'><LuEyeOff className='size-3.5' />What companies see</p>
            <TalentCard t={preview} compact />
          </div>
        </aside>
      </div>

      {profile && (
        <section className='mt-10' aria-labelledby='req-h'>
          <h2 id='req-h' className='text-lg font-semibold text-slate-800 mb-3'>Requests from companies</h2>
          {requests.length === 0 ? <p className='text-sm text-slate-500 rounded-xl border border-dashed border-slate-300 p-6 text-center'>No requests yet. Keep your profile up to date and companies will find you.</p>
            : <ul className='space-y-3'>{requests.map((r) => <RequestCard key={r.id} r={r} user={user} profile={profile} auth={auth} onChange={loadRequests} />)}</ul>}
        </section>
      )}
      <p className='text-xs text-slate-400 mt-8'>Looking for jobs yourself? <Link to='/jobs' className='text-brand-700 hover:underline'>Browse open jobs</Link>.</p>
    </div>
  )
}

const RequestCard = ({ r, user, profile, auth, onChange }) => {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [reply, setReply] = useState('')
  const [shareEmail, setShareEmail] = useState(true)
  const [email, setEmail] = useState(user?.email || '')
  const [sharePhone, setSharePhone] = useState(Boolean(profile.phone))
  const [phone, setPhone] = useState(profile.phone || '')
  const send = async (action) => {
    setBusy(true)
    try { await api.post(`/api/talent/me/requests/${r.id}/respond`, { action, reply, shareEmail, email, sharePhone, phone }, auth); toast.success(action === 'accept' ? 'Your details were shared with the company' : action === 'block' ? 'Declined and blocked' : 'Declined'); trackEvent('talent_request_answered', { action }); onChange() }
    catch (err) { toast.error(errMsg(err, 'Could not send your answer.')) } finally { setBusy(false) }
  }
  const c = r.company
  return (
    <li className='rounded-xl border border-slate-200 bg-white p-5'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='font-semibold text-slate-800 inline-flex items-center gap-2'><LuBuilding2 className='size-4 text-slate-400' />{c?.name || 'Company'}</p>
          {c && <p className='text-xs text-slate-500 mt-0.5'>{[c.industry, c.size && `${c.size} people`, c.location].filter(Boolean).join(' · ')}{c.website && <> · <a href={c.website} target='_blank' rel='nofollow noopener noreferrer' className='text-brand-700 hover:underline'>{c.website.replace(/^https?:\/\//, '')}</a></>}</p>}
        </div>
        <div className='text-right'><StatusBadge status={r.status} /><p className='text-xs text-slate-400 mt-1'>{timeShort(r.createdAt)}</p></div>
      </div>
      {r.job && <p className='text-xs text-slate-500 mt-2'>About the role: <Link to={`/jobs/${r.job.slug}`} className='text-brand-700 hover:underline'>{r.job.title}</Link></p>}
      <p className='text-sm text-slate-700 mt-3 whitespace-pre-line rounded-lg bg-slate-50 p-3'>{r.message}</p>
      {c?.about && <p className='text-xs text-slate-500 mt-2'><span className='font-medium'>About the company:</span> {c.about}</p>}
      {r.status === 'accepted' && r.shared && <p className='text-xs text-green-700 mt-3'>You shared: {[r.shared.email, r.shared.phone].filter(Boolean).join(' · ')}</p>}
      {r.status === 'pending' && !open && (
        <div className='flex flex-wrap gap-2 mt-4'>
          <button onClick={() => setOpen(true)} className='inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm'><LuCheck className='size-4' />Accept and share my details</button>
          <button disabled={busy} onClick={() => send('decline')} className='inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-full text-sm hover:bg-slate-50'><LuX className='size-4' />Decline</button>
          <button disabled={busy} onClick={() => window.confirm(`Decline and never show your profile to ${c?.name || 'this company'} again?`) && send('block')} className='inline-flex items-center gap-1.5 px-4 py-2 text-sm text-red-600 hover:underline'><LuBan className='size-4' />Decline and block</button>
        </div>
      )}
      {r.status === 'pending' && open && (
        <div className='mt-4 rounded-lg border border-brand-200 bg-brand-50/40 p-4 space-y-3'>
          <p className='text-sm font-medium text-slate-800'>Choose what {c?.name || 'the company'} will receive. Your name is included.</p>
          <label className='flex items-center gap-2 text-sm'><input type='checkbox' checked={shareEmail} onChange={(e) => setShareEmail(e.target.checked)} /> Email <input aria-label='Email to share' disabled={!shareEmail} className={`${inputCls} max-w-xs`} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className='flex items-center gap-2 text-sm'><input type='checkbox' checked={sharePhone} onChange={(e) => setSharePhone(e.target.checked)} /> Phone <input aria-label='Phone to share' disabled={!sharePhone} className={`${inputCls} max-w-xs`} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='+91 ...' /></label>
          <Area label='Message (optional)' rows={2} value={reply} onChange={(v) => setReply(v.slice(0, 600))} placeholder='e.g. Happy to chat. Mornings work best.' />
          <div className='flex gap-2'>
            <button disabled={busy} onClick={() => send('accept')} className='inline-flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-full text-sm'>{busy && <BiLoaderAlt className='size-4 animate-spin' />}Share my details</button>
            <button onClick={() => setOpen(false)} className='px-4 py-2 text-sm text-slate-600 hover:underline'>Back</button>
          </div>
        </div>
      )}
    </li>
  )
}

export default OpenToWork
