import React, { useMemo, useState } from 'react'

// Job offer comparison. Runs only in the browser: no AI, no server, nothing stored. It does NOT work out tax; the user
// enters take-home pay. All sums are simple and shown on screen so they can be checked by hand.
const blank = { name: '', monthly: '', months: '12', bonus: '', benefits: '', costs: '', notice: '', hours: '' }
const num = (v) => { const n = parseFloat(String(v).replace(/,/g, '')); return Number.isFinite(n) && n >= 0 ? n : 0 }
const box = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-300'

const FIELDS = [
  ['name', 'Offer name', 'text', 'e.g. Company A'],
  ['monthly', 'Take-home pay per month', 'number', 'After tax'],
  ['months', 'Months paid per year', 'number', 'Usually 12'],
  ['bonus', 'Yearly bonus (after tax)', 'number', 'Only what is guaranteed'],
  ['benefits', 'Yearly value of benefits you would use', 'number', 'Health cover, meals, transport'],
  ['costs', 'Extra costs per month', 'number', 'Commute, rent difference, uniform'],
  ['notice', 'Notice period (days)', 'number', 'Optional'],
  ['hours', 'Working hours per week', 'number', 'Optional'],
]

const total = (o) => num(o.monthly) * num(o.months) + num(o.bonus) + num(o.benefits) - num(o.costs) * 12

const OfferComparer = () => {
  const [cur, setCur] = useState('')
  const [a, setA] = useState({ ...blank, name: 'Offer A' })
  const [b, setB] = useState({ ...blank, name: 'Offer B' })
  const fmt = (n) => `${cur ? cur + ' ' : ''}${Math.round(n).toLocaleString()}`
  const rows = useMemo(() => [a, b].map((o) => {
    const t = total(o), hrs = num(o.hours)
    return { t, month: t / 12, hour: hrs ? t / (hrs * 52) : null }
  }), [a, b])
  const ready = num(a.monthly) > 0 && num(b.monthly) > 0
  const diff = rows[0].t - rows[1].t
  const nameOf = (o, i) => o.name.trim() || `Offer ${'AB'[i]}`

  const Col = ({ o, set, i }) => (
    <fieldset className='rounded-2xl border border-slate-200 bg-white p-5 space-y-3'>
      <legend className='px-2 text-sm font-semibold text-slate-700'>{nameOf(o, i)}</legend>
      {FIELDS.map(([k, label, type, hint]) => (
        <div key={k}>
          <label htmlFor={`o${i}-${k}`} className='block text-xs font-medium text-slate-600'>{label}</label>
          <input id={`o${i}-${k}`} type={type === 'number' ? 'text' : 'text'} inputMode={type === 'number' ? 'decimal' : 'text'} maxLength={k === 'name' ? 40 : 12} placeholder={hint} value={o[k]} onChange={(e) => set((x) => ({ ...x, [k]: e.target.value }))} className={`${box} mt-1`} />
        </div>
      ))}
    </fieldset>
  )

  return (
    <div>
      <div className='max-w-xs mb-5'>
        <label htmlFor='cur' className='block text-sm font-medium text-slate-700'>Currency symbol (optional)</label>
        <input id='cur' maxLength={4} value={cur} onChange={(e) => setCur(e.target.value)} placeholder='₹, £, $, R' className={`${box} mt-1.5`} />
      </div>
      <div className='grid md:grid-cols-2 gap-6'>
        <Col o={a} set={setA} i={0} />
        <Col o={b} set={setB} i={1} />
      </div>

      <section aria-live='polite' className='mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-5'>
        <h2 className='text-lg font-semibold text-slate-800'>Side by side</h2>
        {!ready ? <p className='text-sm text-slate-500 mt-2'>Enter the monthly take-home pay for both offers to see the comparison.</p> : (
          <>
            <div className='overflow-x-auto mt-3'>
              <table className='w-full text-sm text-left'>
                <caption className='sr-only'>Comparison of the two job offers</caption>
                <thead><tr className='text-slate-500'><th className='py-2 pr-4 font-medium'>&nbsp;</th>{[a, b].map((o, i) => <th key={i} className='py-2 pr-4 font-semibold text-slate-800'>{nameOf(o, i)}</th>)}</tr></thead>
                <tbody className='divide-y divide-slate-200 text-slate-700'>
                  <tr><th scope='row' className='py-2 pr-4 font-medium'>Yearly total after extra costs</th>{rows.map((r, i) => <td key={i} className='py-2 pr-4 font-semibold'>{fmt(r.t)}</td>)}</tr>
                  <tr><th scope='row' className='py-2 pr-4 font-medium'>Average per month</th>{rows.map((r, i) => <td key={i} className='py-2 pr-4'>{fmt(r.month)}</td>)}</tr>
                  <tr><th scope='row' className='py-2 pr-4 font-medium'>Per working hour</th>{rows.map((r, i) => <td key={i} className='py-2 pr-4'>{r.hour == null ? 'Add hours per week' : fmt(r.hour)}</td>)}</tr>
                  <tr><th scope='row' className='py-2 pr-4 font-medium'>Notice period</th>{[a, b].map((o, i) => <td key={i} className='py-2 pr-4'>{o.notice ? `${num(o.notice)} days` : 'Not entered'}</td>)}</tr>
                </tbody>
              </table>
            </div>
            <p className='mt-4 text-slate-800'>{diff === 0 ? 'The two offers give the same yearly total on these numbers.' : <><strong>{nameOf(diff > 0 ? a : b, diff > 0 ? 0 : 1)}</strong> comes to {fmt(Math.abs(diff))} more per year ({fmt(Math.abs(diff) / 12)} per month) on these numbers.</>}</p>
            <p className='text-xs text-slate-500 mt-3'>Yearly total = monthly take-home × months paid + bonus + benefits value − extra costs × 12. Tax is not calculated. Pay is only one part of a job: also compare growth, hours, the people and the commute.</p>
          </>
        )}
      </section>

      <details className='mt-6 rounded-2xl border border-slate-200 bg-white p-5 group' data-testid='offer-negotiate'>
        <summary className='cursor-pointer list-none flex items-center justify-between gap-3 text-lg font-semibold text-slate-800'>Before you ask for more<span className='text-slate-400 group-open:rotate-45 transition'>+</span></summary>
        <p className='text-sm text-slate-600 mt-3'>You can often ask, but not every employer will change an offer, and customs differ by country and company. Nothing here promises a result.</p>
        <ol className='list-decimal pl-5 mt-3 space-y-1.5 text-sm text-slate-700'>
          <li><strong>Decide what matters.</strong> Pay is one part. Start date, holiday, remote days, training budget and notice period can matter just as much.</li>
          <li><strong>Know your reasons.</strong> Point to your real skills and results, and to what similar roles pay in your area. Use sources you can name, and do not invent figures.</li>
          <li><strong>Ask once, in writing, kindly.</strong> A short message is easier to answer well than a long one.</li>
          <li><strong>Be ready for any answer.</strong> Decide your lowest acceptable offer before you ask, and do not accept or refuse in the heat of the moment. It is fine to ask for a day to think.</li>
          <li><strong>Get the final terms in writing</strong> before you give notice at your current job.</li>
        </ol>
        <p className='text-sm font-medium text-slate-800 mt-4'>A message you can adapt</p>
        <pre className='mt-1.5 whitespace-pre-wrap rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm text-slate-700 font-sans'>{`Hello [name],

Thank you for the offer. I am excited about the role and the team.

Before I decide, I would like to ask whether there is room to discuss [pay / start date / remote days / training]. Based on [your skills and results, or a source you can name], I was hoping for [your request].

I understand if this is not possible, and I would be glad to talk it through.

Thank you again,
[your name]`}</pre>
        <button type='button' className='mt-2 text-xs text-brand-700 hover:underline' onClick={() => navigator.clipboard?.writeText('Hello [name],\n\nThank you for the offer. I am excited about the role and the team.\n\nBefore I decide, I would like to ask whether there is room to discuss [pay / start date / remote days / training]. Based on [your skills and results, or a source you can name], I was hoping for [your request].\n\nI understand if this is not possible, and I would be glad to talk it through.\n\nThank you again,\n[your name]')}>Copy the message</button>
      </details>
    </div>
  )
}
export default OfferComparer
