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
    </div>
  )
}
export default OfferComparer
