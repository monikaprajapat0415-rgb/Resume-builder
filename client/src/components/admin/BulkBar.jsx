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
const BulkBar = ({ resource, sel, auth, actions = ['publish', 'unpublish', 'delete'], noun = 'item', onDone }) => {
  const [busy, setBusy] = useState(false)
  if (!sel.ids.length) return null
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
      <button type='button' onClick={sel.clear} className='ml-auto text-xs text-slate-500 hover:text-slate-800'>Clear</button>
    </div>
  )
}
export default BulkBar
