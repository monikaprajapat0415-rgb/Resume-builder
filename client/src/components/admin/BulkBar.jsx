import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../configs/api'

// Selection helper: ids picked in a list, with "select all shown".
export const useSelection = () => {
  const [ids, setIds] = useState([])
  const has = (id) => ids.includes(id)
  const toggle = (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const setAll = (list, on) => setIds(on ? list : [])
  return { ids, has, toggle, setAll, clear: () => setIds([]) }
}

// Header checkbox for a list ("select all that are shown").
export const SelectAll = ({ shownIds, sel, label = 'Select all shown' }) => {
  const all = shownIds.length > 0 && shownIds.every(sel.has)
  return <input type='checkbox' aria-label={label} title={label} checked={all} onChange={(e) => sel.setAll(shownIds, e.target.checked)} />
}

// The bar that appears once something is ticked. Calls POST /api/admin/bulk (admin only, logged
// in Admin > Activity). `actions` is a subset of publish, unpublish, delete.
const NAMES = { publish: 'Publish', unpublish: 'Unpublish', delete: 'Delete' }
// setFields: optional "change a field on all selected" control, e.g. [{ field: 'level', label: 'Level', options: ['fresher', 'experienced', 'both'] }, { field: 'tag', label: 'Technology tag' }]
const BulkBar = ({ resource, sel, auth, actions = ['publish', 'unpublish', 'delete'], noun = 'item', setFields = [], suggestions = {}, onDone }) => {
  const [busy, setBusy] = useState(false)
  const [field, setField] = useState('')
  const [value, setValue] = useState('')
  if (!sel.ids.length) return null
  const cfg = setFields.find((f) => f.field === field)
  const runSet = async () => {
    const n = sel.ids.length
    if (!cfg || !value.trim()) return
    if (!window.confirm(`Set ${cfg.label.toLowerCase()} to "${value.trim()}" on ${n} ${noun}${n === 1 ? '' : 's'}?`)) return
    setBusy(true)
    try {
      const { data } = await api.post('/api/admin/bulk', { resource, action: 'set', field, value: value.trim(), ids: sel.ids }, auth)
      toast.success(`${cfg.label} changed on ${data.done} of ${data.requested}.`)
      sel.clear(); setField(''); setValue(''); onDone?.('set')
    } catch (e) { toast.error(e.response?.data?.message || 'Could not complete the bulk change.') }
    setBusy(false)
  }
  const run = async (action) => {
    const n = sel.ids.length
    const word = `${n} ${noun}${n === 1 ? '' : 's'}`
    const msg = action === 'delete' ? `Delete ${word}? This can't be undone.` : `${NAMES[action]} ${word}?`
    if (!window.confirm(msg)) return
    setBusy(true)
    try {
      const { data } = await api.post('/api/admin/bulk', { resource, action, ids: sel.ids }, auth)
      toast.success(`${NAMES[action]}: ${data.done} of ${data.requested} done.`)
      sel.clear(); onDone?.(action)
    } catch (e) { toast.error(e.response?.data?.message || 'Could not complete the bulk action.') }
    setBusy(false)
  }
  return (
    <div className='sticky top-2 z-10 mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm shadow-sm' role='region' aria-label='Bulk actions'>
      <span className='font-medium text-slate-800'>{sel.ids.length} selected</span>
      {actions.map((a) => (
        <button key={a} type='button' disabled={busy} onClick={() => run(a)}
          className={`rounded-full px-3 py-1 text-xs font-medium disabled:opacity-60 ${a === 'delete' ? 'border border-red-300 bg-white text-red-600 hover:bg-red-50' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}>{NAMES[a]}</button>
      ))}
      {setFields.length > 0 && (
        <span className='flex flex-wrap items-center gap-1.5'>
          <select aria-label='Field to change' value={field} onChange={(e) => { setField(e.target.value); setValue('') }} className='rounded-md border border-slate-300 bg-white px-2 py-1 text-xs'>
            <option value=''>Change…</option>
            {setFields.map((f) => <option key={f.field} value={f.field}>{f.label}</option>)}
          </select>
          {cfg && (cfg.options ? (
            <select aria-label={cfg.label} value={value} onChange={(e) => setValue(e.target.value)} className='rounded-md border border-slate-300 bg-white px-2 py-1 text-xs'>
              <option value=''>Choose…</option>{cfg.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <>
              <input aria-label={cfg.label} list={`bulk-${field}`} value={value} onChange={(e) => setValue(e.target.value)} placeholder={cfg.label} className='w-40 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs' />
              <datalist id={`bulk-${field}`}>{(suggestions[field] || []).map((o) => <option key={o} value={o} />)}</datalist>
            </>
          ))}
          {cfg && <button type='button' disabled={busy || !value.trim()} onClick={runSet} className='rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50'>Apply</button>}
        </span>
      )}
      <button type='button' onClick={sel.clear} className='ml-auto text-xs text-slate-500 hover:text-slate-800'>Clear</button>
    </div>
  )
}
export default BulkBar
