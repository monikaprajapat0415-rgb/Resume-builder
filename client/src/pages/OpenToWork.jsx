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
import { CATEGORIES, isLabour, COUNTRIES, countryName, currencyFor, CURRENCIES, PAY_PER, defaultPayPer, AVAILABILITY, TRADES, certsFor, WORK_LANGS, JOB_TYPES_ALL } from '../utils/workTaxonomy'
import { LEVELS, NOTICE, TalentCard, StatusBadge, Switch, timeShort, errMsg } from '../components/hiring/ui'

// Best guess of the visitor's country from their time zone (they can change it).
const guessCountry = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (/Calcutta|Kolkata/.test(tz)) return 'IN'
    if (/London/.test(tz)) return 'GB'
    if (/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Montreal)/.test(tz)) return 'CA'
    const m = { Lagos: 'NG', Nairobi: 'KE', Accra: 'GH', Johannesburg: 'ZA', 'Dar_es_Salaam': 'TZ', Kampala: 'UG', 'Addis_Ababa': 'ET', Lusaka: 'ZM', Harare: 'ZW', Kigali: 'RW', Cairo: 'EG', Casablanca: 'MA' }
    const city = tz.split('/')[1]
    if (tz.startsWith('Africa/') && m[city]) return m[city]
  } catch { /* ignore */ }
  return 'IN'
}
const DEFAULT_TYPES = { corporate: ['full-time'], factory: ['full-time', 'contract'], skilled_trade: ['contract', 'full-time'], daily_wage: ['daily-wage', 'temporary'] }
const BLANK = { category: '', headline: '', country: '', level: 'fresher', experienceYears: '', skills: [], location: '', remote: false, relocate: false, willingToTravel: false, ownTools: false, jobTypes: [], payAmount: '', payPer: '', currency: '', availability: '', workRight: '', languages: [], certifications: [], noticePeriod: '', summary: '', phone: '', reminders: true }

const Section = ({ n, title, children }) => (
  <fieldset className='space-y-3'>
    <legend className='flex items-center gap-2 text-base font-semibold text-slate-800 mb-1'><span className='size-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center'>{n}</span>{title}</legend>
    {children}
  </fieldset>
)
const Pill = ({ on, children, ...rest }) => <button type='button' aria-pressed={on} className={`px-3.5 py-2 text-sm rounded-full border transition ${on ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`} {...rest}>{children}</button>

// Job seeker side: say what work you do, where, for what pay, and when you can start. Companies see this without your name or contact details.
const OpenToWork = () => {
  const { token, user } = useSelector((s) => s.auth)
  const auth = { headers: { Authorization: token } }
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ ...BLANK })
  const [saving, setSaving] = useState(false)
  const [requests, setRequests] = useState([])
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const labour = isLabour(form.category)

  const loadRequests = () => api.get('/api/talent/me/requests', auth).then(({ data }) => setRequests(data.requests)).catch(() => {})
  useEffect(() => {
    api.get('/api/talent/me', auth).then(({ data }) => {
      setProfile(data.profile)
      if (data.profile) { const p = data.profile; setForm({ ...BLANK, ...Object.fromEntries(Object.keys(BLANK).map((k) => [k, p[k] ?? BLANK[k]])), payAmount: p.payAmount ?? '', reminders: p.reminders !== false }); loadRequests() }
      else set({ country: guessCountry() })
    }).catch(() => toast.error('Could not load your profile.')).finally(() => setLoading(false))
  }, [])

  const pickCategory = (category) => set({ category, payPer: form.payPer || defaultPayPer(category), jobTypes: form.jobTypes.length ? form.jobTypes : DEFAULT_TYPES[category], headline: TRADES[category]?.includes(form.headline) || !form.headline ? (TRADES[category]?.includes(form.headline) ? form.headline : '') : form.headline })
  const pickCountry = (country) => set({ country, currency: !form.payAmount || form.currency === currencyFor(form.country) ? currencyFor(country) : form.currency })

  const groups = useMemo(() => (form.category === 'corporate' ? buildSkillSuggestions({ jobTitle: form.headline, input: {}, have: form.skills }) : []), [form.category, form.headline, form.skills])
  const certGroups = useMemo(() => [{ id: 'certs', label: `Common in ${countryName(form.country) || 'your country'} (add only if you have it)`, items: certsFor(form.country).filter((c) => !form.certifications.some((x) => x.toLowerCase() === c.toLowerCase())) }].filter((g) => g.items.length), [form.country, form.certifications])
  const langGroups = useMemo(() => [{ id: 'langs', label: 'Languages', items: WORK_LANGS.filter((l) => !form.languages.some((x) => x.toLowerCase() === l.toLowerCase())) }], [form.languages])
  const preview = { id: profile?.id || 'T-XXXXXXXX', ...form, payAmount: Number(form.payAmount) || null, currency: form.currency || currencyFor(form.country), experienceYears: Number(form.experienceYears) || 0, updatedAt: new Date() }

  const save = async (e) => {
    e?.preventDefault()
    if (!form.category) return toast.error('First choose the kind of work you do.')
    setSaving(true)
    try {
      const body = { ...form, experienceYears: Number(form.experienceYears) || 0, payAmount: form.payAmount === '' ? '' : Number(form.payAmount), currency: form.currency || currencyFor(form.country), payPer: form.payPer || defaultPayPer(form.category) }
      const { data } = await api.put('/api/talent/me', body, auth)
      if (!profile) trackEvent('talent_profile_created', { category: form.category, country: form.country })
      setProfile(data.profile); setForm((f) => ({ ...f, headline: data.profile.headline, summary: data.profile.summary, location: data.profile.location }))
      toast.success(profile ? 'Profile saved' : 'You are now visible to employers')
      loadRequests()
    } catch (err) { toast.error(errMsg(err, 'Could not save.')) } finally { setSaving(false) }
  }
  const toggle = async (on) => {
    try { const { data } = await api.put('/api/talent/me', { available: on }, auth); setProfile(data.profile); toast.success(on ? 'Employers can find you again' : 'You are hidden from employers') }
    catch (err) { toast.error(errMsg(err, 'Could not change this.')) }
  }
  const remove = async () => {
    if (!window.confirm('Remove your profile? Employers will no longer see you and open requests will be declined.')) return
    try { await api.delete('/api/talent/me', auth); setProfile(null); setForm({ ...BLANK, country: guessCountry() }); setRequests([]); toast.success('Profile removed') } catch (err) { toast.error(errMsg(err, 'Could not remove.')) }
  }

  if (loading) return <div className='max-w-5xl mx-auto px-4 py-16 text-center text-slate-400'>Loading…</div>
  const pending = requests.filter((r) => r.status === 'pending')

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <SEO title='Open to work' description='Tell employers you are available to work.' noindex />
      <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-800'>I am available to work</h1>
          <p className='text-slate-500 text-sm mt-1'>Tell employers what work you do. They see your skills and pay, not your name or phone number. You decide who can contact you.</p>
        </div>
        {profile && (
          <div className='flex items-center gap-3 rounded-full border border-slate-200 bg-white pl-4 pr-3 py-2'>
            <span className={`text-sm font-medium ${profile.available ? 'text-green-700' : 'text-slate-500'}`}>{profile.available ? 'Available to work' : 'Hidden from employers'}</span>
            <Switch checked={profile.available} onChange={toggle} label='Available to work' />
          </div>
        )}
      </div>

      {pending.length > 0 && <p role='status' className='mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2.5'>{pending.length} employer{pending.length === 1 ? ' wants' : 's want'} to talk to you. Scroll down to reply.</p>}

      <div className='grid lg:grid-cols-[1fr_340px] gap-6 items-start'>
        <form onSubmit={save} className='bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-7'>
          <Section n='1' title='What kind of work do you do?'>
            <div className='grid sm:grid-cols-2 gap-3' role='group' aria-label='Kind of work'>
              {CATEGORIES.map((c) => (
                <button key={c.id} type='button' aria-pressed={form.category === c.id} onClick={() => pickCategory(c.id)}
                  className={`text-left rounded-xl border-2 p-4 transition ${form.category === c.id ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <span className='text-2xl' aria-hidden='true'>{c.icon}</span>
                  <span className='block font-medium text-slate-800 mt-1'>{c.label}</span>
                  <span className='block text-xs text-slate-500 mt-0.5'>{c.desc}</span>
                </button>
              ))}
            </div>
          </Section>

          {form.category && (
            <>
              <Section n='2' title={labour ? 'Your job' : 'Role you are looking for'}>
                {labour && <div className='flex flex-wrap gap-2'>{TRADES[form.category].map((t) => <Pill key={t} on={form.headline === t} onClick={() => set({ headline: t })}>{t}</Pill>)}</div>}
                <Text label={labour ? 'Or type your job' : 'Job title'} required value={form.headline} onChange={(v) => set({ headline: v })} placeholder={labour ? 'e.g. Electrician' : 'e.g. Accounts Executive'} maxLength={100} />
                <div>
                  <Field label='Years of experience'><input type='number' inputMode='numeric' min='0' max='50' step='0.5' className={`${inputCls} max-w-[10rem]`} value={form.experienceYears} onChange={(e) => set({ experienceYears: e.target.value })} placeholder='0' /></Field>
                  <div className='flex flex-wrap gap-1.5 mt-2'>{[0, 1, 2, 3, 5, 8, 10].map((n) => <button key={n} type='button' onClick={() => set({ experienceYears: String(n) })} className='px-3 py-1 text-xs rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50'>{n === 0 ? 'New' : `${n} yr${n > 1 ? 's' : ''}`}</button>)}</div>
                </div>
                {!labour && (
                  <fieldset><legend className='block text-sm font-medium text-slate-700 mb-1.5'>Experience level</legend>
                    <div className='flex flex-wrap gap-2'>{LEVELS.map(([k, l]) => <Pill key={k} on={form.level === k} onClick={() => set({ level: k })}>{l}</Pill>)}</div></fieldset>
                )}
              </Section>

              <Section n='3' title='Where do you want to work?'>
                <div className='grid sm:grid-cols-2 gap-4'>
                  <Field label='Country' required><select className={inputCls} value={form.country} onChange={(e) => pickCountry(e.target.value)}>{COUNTRIES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}</select></Field>
                  <Text label='City / area' value={form.location} onChange={(v) => set({ location: v })} placeholder='e.g. Jaipur, Leeds, Toronto, Nairobi' />
                </div>
                <div className='flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700'>
                  {labour ? <label className='inline-flex items-center gap-2'><input type='checkbox' checked={form.willingToTravel} onChange={(e) => set({ willingToTravel: e.target.checked })} /> I can travel to a work site</label>
                    : <label className='inline-flex items-center gap-2'><input type='checkbox' checked={form.remote} onChange={(e) => set({ remote: e.target.checked })} /> Open to remote work</label>}
                  <label className='inline-flex items-center gap-2'><input type='checkbox' checked={form.relocate} onChange={(e) => set({ relocate: e.target.checked })} /> I can move to another city</label>
                  {labour && <label className='inline-flex items-center gap-2'><input type='checkbox' checked={form.ownTools} onChange={(e) => set({ ownTools: e.target.checked })} /> I have my own tools</label>}
                </div>
                <Field label='Permission to work in this country (optional)' hint='What you tell employers. They may ask for proof later.'>
                  <select className={inputCls} value={form.workRight} onChange={(e) => set({ workRight: e.target.value })}>
                    <option value=''>Not stated</option>
                    <option value='yes'>I have the right to work in {countryName(form.country) || 'this country'}</option>
                    <option value='need_sponsorship'>I need a visa or sponsorship</option>
                  </select>
                </Field>
              </Section>

              <Section n='4' title='Pay and when you can start'>
                <div className='grid grid-cols-[1fr_auto_auto] gap-2 items-end'>
                  <Field label='Pay you expect (optional)'><input type='number' inputMode='decimal' min='0' className={inputCls} value={form.payAmount} onChange={(e) => set({ payAmount: e.target.value })} placeholder={form.category === 'daily_wage' ? 'e.g. 600' : 'e.g. 25000'} /></Field>
                  <label className='block'><span className='sr-only'>Currency</span><select aria-label='Currency' className={inputCls} value={form.currency || currencyFor(form.country)} onChange={(e) => set({ currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></label>
                  <label className='block'><span className='sr-only'>Per</span><select aria-label='Pay period' className={inputCls} value={form.payPer || defaultPayPer(form.category)} onChange={(e) => set({ payPer: e.target.value })}>{PAY_PER.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
                </div>
                <fieldset><legend className='block text-sm font-medium text-slate-700 mb-1.5'>When can you start?</legend>
                  <div className='flex flex-wrap gap-2'>{AVAILABILITY.map(([k, l]) => <Pill key={k} on={form.availability === k} onClick={() => set({ availability: form.availability === k ? '' : k })}>{l}</Pill>)}</div></fieldset>
                <fieldset><legend className='block text-sm font-medium text-slate-700 mb-1.5'>Type of work you want</legend>
                  <div className='flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700'>{JOB_TYPES_ALL.map(([k, l]) => <label key={k} className='inline-flex items-center gap-2'><input type='checkbox' checked={form.jobTypes.includes(k)} onChange={(e) => set({ jobTypes: e.target.checked ? [...form.jobTypes, k] : form.jobTypes.filter((x) => x !== k) })} /> {l}</label>)}</div></fieldset>
                {!labour && (
                  <div><Text label='Notice period' value={form.noticePeriod} onChange={(v) => set({ noticePeriod: v })} placeholder='e.g. 30 days' maxLength={40} />
                    <div className='flex flex-wrap gap-1.5 mt-1.5'>{NOTICE.map((n) => <button key={n} type='button' onClick={() => set({ noticePeriod: n })} className='px-2.5 py-0.5 text-xs rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50'>{n}</button>)}</div></div>
                )}
              </Section>

              <Section n='5' title='Skills, licences and languages'>
                <ChipInput label={form.category === 'corporate' ? 'Skills' : 'Other skills (optional)'} value={form.skills} onChange={(v) => set({ skills: v })} max={25} maxLen={40} placeholder='Type a skill and press Enter' suggestionGroups={groups} countHint={form.category === 'corporate' ? (n) => `${n}/25 · aim for 6-15` : undefined} />
                <ChipInput label='Licences and certificates' value={form.certifications} onChange={(v) => set({ certifications: v })} max={12} maxLen={60} placeholder='e.g. ITI certificate, CSCS card' suggestionGroups={certGroups} />
                <ChipInput label='Languages you speak' value={form.languages} onChange={(v) => set({ languages: v })} max={8} maxLen={30} placeholder='Type or tap a language' suggestionGroups={langGroups} />
              </Section>

              <Section n='6' title='About you'>
                <Area label='Short introduction (optional)' hint={`${form.summary.length}/600. What work have you done and what are you looking for? Do not write your name, phone, email or links; we remove them.`} rows={4} value={form.summary} onChange={(v) => set({ summary: v.slice(0, 600) })} />
                <Text label='Your phone number' hint='Employers never see it. It is shared only if you accept a request and choose to share it.' type='tel' inputMode='tel' value={form.phone} onChange={(v) => set({ phone: v })} placeholder='+91 ...' maxLength={30} />
                <label className='flex items-start gap-2 text-sm text-slate-700'><input type='checkbox' className='mt-1' checked={form.reminders} onChange={(e) => set({ reminders: e.target.checked })} /><span>Email me one reminder if an employer is waiting for my answer for 3 days</span></label>
              </Section>

              <div className='flex flex-wrap items-center gap-3'>
                <button type='submit' disabled={saving} className='inline-flex items-center gap-2 px-7 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-full text-base font-medium transition'>
                  {saving && <BiLoaderAlt className='size-4 animate-spin' />}{profile ? 'Save changes' : 'Make me visible to employers'}
                </button>
                {profile && <button type='button' onClick={remove} className='inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline'><LuTrash2 className='size-4' />Remove my profile</button>}
              </div>
            </>
          )}
        </form>

        <aside className='space-y-4 lg:sticky lg:top-4'>
          <div className='rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900'>
            <p className='font-semibold inline-flex items-center gap-2'><LuShieldCheck className='size-4' />Your privacy and safety</p>
            <ul className='mt-2 space-y-1.5 list-disc pl-5'>
              <li>Only employers we approved can see this.</li>
              <li>Your name, email and phone stay hidden until you accept a request.</li>
              <li>You can decline, block an employer, or hide yourself at any time.</li>
              <li><strong>Never pay anyone to get a job.</strong> Real employers do not charge workers.</li>
            </ul>
          </div>
          {form.category && <div>
            <p className='text-xs font-medium text-slate-500 mb-2 inline-flex items-center gap-1.5'><LuEyeOff className='size-3.5' />What employers see</p>
            <TalentCard t={preview} compact />
          </div>}
        </aside>
      </div>

      {profile && (
        <section className='mt-10' aria-labelledby='req-h'>
          <h2 id='req-h' className='text-lg font-semibold text-slate-800 mb-3'>Requests from employers</h2>
          {requests.length === 0 ? <p className='text-sm text-slate-500 rounded-xl border border-dashed border-slate-300 p-6 text-center'>No requests yet. Keep your profile up to date and employers will find you.</p>
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
  const [whatsapp, setWhatsapp] = useState(false)
  const send = async (action) => {
    setBusy(true)
    try { await api.post(`/api/talent/me/requests/${r.id}/respond`, { action, reply, shareEmail, email, sharePhone, phone, whatsapp }, auth); toast.success(action === 'accept' ? 'Your details were shared with the company' : action === 'block' ? 'Declined and blocked' : 'Declined'); trackEvent('talent_request_answered', { action }); onChange() }
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
          {sharePhone && <label className='flex items-center gap-2 text-sm ml-6'><input type='checkbox' checked={whatsapp} onChange={(e) => setWhatsapp(e.target.checked)} /> This number is on WhatsApp</label>}
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
