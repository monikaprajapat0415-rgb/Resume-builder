import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { invalidatePlan } from '../../utils/plan'

const input = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-300 focus:border-brand-400'
const Field = ({ label, hint, children }) => (
  <label className='block'><span className='block text-xs font-medium text-slate-600 mb-1'>{label}</span>{children}{hint && <span className='block text-xs text-slate-400 mt-1'>{hint}</span>}</label>
)


// Automatic switch-on from a payment provider. Separate component so it has its own hooks.
const WebhookPanel = ({ headers }) => {
  const [d, setD] = useState(null)
  const [fix, setFix] = useState({})
  const load = () => api.get('/api/admin/plan/events', headers).then(({ data }) => setD(data)).catch(() => toast.error('Could not load payment events.'))
  useEffect(() => { load() // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const retry = async (ev) => {
    try { await api.post(`/api/admin/plan/events/${ev._id}/retry`, { email: fix[ev._id] || ev.email }, headers); toast.success('Plan switched on.'); load() }
    catch (e) { toast.error(e.response?.data?.message || 'Could not match this payment.') }
  }
  if (!d) return null
  return (
    <div className='mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600'>
      <p className='font-medium text-slate-800'>Automatic switch-on (payment webhook)</p>
      <p className={`mt-1 ${d.secretSet ? 'text-green-700' : 'text-amber-700'}`}>{d.secretSet ? 'Ready: a secret is set on the server.' : 'Not active: set PLAN_WEBHOOK_SECRET in the server environment (a long random string), restart, then paste this address and the same secret into your payment provider.'}</p>
      <p className='mt-2 text-xs text-slate-500'>Webhook address</p>
      <code className='block rounded bg-slate-50 px-2 py-1 text-xs break-all'>{d.url}</code>
      <ul className='list-disc ml-5 mt-2 space-y-1 text-xs text-slate-500'>
        <li>Every notice must carry a valid signature (HMAC-SHA256 of the body, in the <code>x-signature</code> header). Anything else is refused.</li>
        <li>The person is matched by the email on the payment, so they must pay with the email they sign in with. A payment with no matching account is kept below for you.</li>
        <li>The same notice can never grant twice. Days come from the notice; if it has none, the plan's billing period above is used (month 30 days, year 365, one-off lifetime).</li>
        <li>Two formats are understood: our own simple JSON ({'{'}id, type: "payment.succeeded", email, amount, currency, days{'}'}) and Razorpay's payment.captured (put <code>days</code> in the payment notes). Other providers need an adapter. Until this is tested with your provider's test mode, keep switching people on by hand when a payment does not show up here.</li>
      </ul>
      <p className='font-medium text-slate-800 mt-4 mb-1'>Recent payment notices</p>
      {d.events.length === 0 ? <p className='text-xs text-slate-400'>None yet.</p> : (
        <div className='divide-y divide-slate-100'>
          {d.events.map((ev) => (
            <div key={ev._id} className='py-2 flex flex-wrap items-center gap-2 text-xs'>
              <span className={`px-2 py-0.5 rounded-full ${ev.status === 'granted' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{ev.status}</span>
              <span className='text-slate-700'>{ev.email || 'no email'}</span>
              <span className='text-slate-400'>{ev.provider} · {ev.amount} {ev.currency} · {new Date(ev.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })}</span>
              {ev.note && <span className='text-slate-400'>{ev.note}</span>}
              {ev.status !== 'granted' && (
                <span className='ml-auto flex items-center gap-1'>
                  <input aria-label='Email of the account' placeholder='account email' defaultValue={ev.email} onChange={(e) => setFix({ ...fix, [ev._id]: e.target.value })} className='px-2 py-1 border border-slate-200 rounded text-xs' />
                  <button type='button' onClick={() => retry(ev)} className='px-3 py-1 rounded-full bg-brand-600 text-white'>Switch on</button>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const AdminPlan = () => {
  const { token } = useSelector((s) => s.auth)
  const headers = { headers: { Authorization: token } }
  const [f, setF] = useState(null)
  const [labels, setLabels] = useState({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.get('/api/admin/plan', headers).then(({ data }) => { setF(data.settings); setLabels(data.gateLabels) }).catch(() => toast.error('Could not load the plan settings.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!f) return <p className='text-slate-400'>Loading…</p>
  const set = (p) => setF((x) => ({ ...x, ...p }))
  const lines = (arr) => (arr || []).join('\n')
  const fromLines = (t) => t.split('\n').map((x) => x.trim()).filter(Boolean)

  const save = async (patch = {}) => {
    setBusy(true)
    try {
      const body = { ...f, ...patch }
      const { data } = await api.put('/api/admin/plan', body, headers)
      setF(data.settings); invalidatePlan(); toast.success(data.message)
    } catch (e) { toast.error(e.response?.data?.message || 'Could not save.') }
    setBusy(false)
  }

  return (
    <div className='max-w-3xl'>
      <h1 className='text-2xl font-semibold text-slate-800 mb-1'>Paid plan</h1>
      <p className='text-sm text-slate-500 mb-5'>One switch controls it. While it is off, the whole site is free and nothing about prices is shown. You can change everything here later.</p>

      <div className={`rounded-xl border p-4 mb-6 flex flex-wrap items-center justify-between gap-3 ${f.enabled ? 'border-brand-300 bg-brand-50/50' : 'border-slate-200 bg-slate-50'}`}>
        <div>
          <p className='font-semibold text-slate-800'>Paid plan is {f.enabled ? 'ON' : 'OFF'}</p>
          <p className='text-sm text-slate-500'>{f.enabled ? 'The ticked features below need the plan. The /pricing page is public and in the sitemap.' : 'Everything is free. /pricing says so and is hidden from search engines.'}</p>
        </div>
        <button type='button' disabled={busy} onClick={() => save({ enabled: !f.enabled })}
          className={`rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60 ${f.enabled ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
          {f.enabled ? 'Turn off' : 'Turn on'}
        </button>
      </div>

      <div className='space-y-4 bg-white rounded-xl border border-slate-200 p-5'>
        <div className='grid sm:grid-cols-2 gap-4'>
          <Field label='Plan name'><input className={input} value={f.planName} maxLength={40} onChange={(e) => set({ planName: e.target.value })} /></Field>
          <Field label='Short line under the heading'><input className={input} value={f.tagline} maxLength={160} onChange={(e) => set({ tagline: e.target.value })} /></Field>
          <Field label='Price'><input type='number' min='0' className={input} value={f.price} onChange={(e) => set({ price: e.target.value })} /></Field>
          <Field label='Currency code' hint='For example INR, USD, GBP, CAD, NGN, KES'><input className={input} value={f.currency} maxLength={6} onChange={(e) => set({ currency: e.target.value.toUpperCase() })} /></Field>
          <Field label='Billing'>
            <select className={input} value={f.period} onChange={(e) => set({ period: e.target.value })}>
              <option value='month'>Per month</option><option value='year'>Per year</option><option value='once'>One-time</option>
            </select>
          </Field>
        </div>

        <fieldset>
          <legend className='text-xs font-medium text-slate-600 mb-2'>Which features need the paid plan</legend>
          <div className='space-y-2'>
            {Object.entries(labels).map(([k, label]) => (
              <label key={k} className='flex items-center gap-2 text-sm'><input type='checkbox' checked={!!f.gates?.[k]} onChange={(e) => set({ gates: { ...f.gates, [k]: e.target.checked } })} />{label}</label>
            ))}
          </div>
          <p className='text-xs text-slate-400 mt-2'>Anything not ticked stays free. Admins always have access.</p>
        </fieldset>

        <div className='grid sm:grid-cols-2 gap-4'>
          <Field label='Paid plan includes (one per line)'><textarea rows={5} className={input} value={lines(f.features)} onChange={(e) => set({ features: fromLines(e.target.value) })} /></Field>
          <Field label='Free plan includes (one per line)'><textarea rows={5} className={input} value={lines(f.freeFeatures)} onChange={(e) => set({ freeFeatures: fromLines(e.target.value) })} /></Field>
        </div>
        <Field label='Payment link' hint='A link made in your own payment account (Razorpay, Stripe, Paystack, PayPal...). Must start with https://. Payments go to your account, not through this site.'>
          <input className={input} value={f.paymentLink} maxLength={500} onChange={(e) => set({ paymentLink: e.target.value })} placeholder='https://...' />
        </Field>
        <Field label='Payment instructions (optional if you have a link)' hint='For example: "After paying, WhatsApp the receipt to +91..." Shown under the button.'>
          <textarea rows={2} className={input} maxLength={300} value={f.payInstructions} onChange={(e) => set({ payInstructions: e.target.value })} />
        </Field>
        <div className='flex flex-wrap gap-3 items-center'>
          <button type='button' disabled={busy} onClick={() => save()} className='rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60'>{busy ? 'Saving…' : 'Save'}</button>
          <a href='/pricing' target='_blank' rel='noopener' className='text-sm text-brand-700 hover:underline'>Open /pricing</a>
        </div>
      </div>

      <div className='mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600'>
        <p className='font-medium text-slate-800'>How a person gets the plan</p>
        <ol className='list-decimal ml-5 mt-1 space-y-1'>
          <li>They open /pricing and pay using your payment link, with the email they sign in with.</li>
          <li>You see the payment in your payment account.</li>
          <li>Go to Admin, Users, and press <strong>Plan</strong> next to that email to switch it on for 30 days, a year, or for life.</li>
        </ol>
        <p className='mt-2 text-xs text-slate-500'>Switching it on by hand keeps things safe and simple. Automatic switching on payment can be added later once you pick a payment provider.</p>
      </div>
      <WebhookPanel headers={headers} />
    </div>
  )
}

export default AdminPlan
