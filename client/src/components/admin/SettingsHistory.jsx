import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'

// Recent changes to one settings screen, old and new values, with a button to put the old ones back.
// `settingsKey`: 'ads' | 'nudge' | 'site'. `prefix` limits 'site' to fields that start with it (for example theme_).
const show = (v) => { const s = typeof v === 'boolean' ? (v ? 'on' : 'off') : String(v ?? ''); return s === '' ? '(empty)' : s.length > 50 ? `${s.slice(0, 50)}…` : s }

const SettingsHistory = ({ settingsKey, prefix = '', onRestored }) => {
  const { token } = useSelector((s) => s.auth)
  const [rows, setRows] = useState(null)
  const [busy, setBusy] = useState('')
  const [open, setOpen] = useState(false)

  const load = useCallback(() => {
    api.get('/api/admin/settings-history', { headers: { Authorization: token }, params: { key: settingsKey, prefix } })
      .then(({ data }) => setRows(data.rows)).catch(() => setRows([]))
  }, [token, settingsKey, prefix])
  useEffect(() => { if (open && rows === null) load() }, [open, rows, load])

  const restore = async (r) => {
    if (!window.confirm('Put the earlier values back?')) return
    setBusy(r._id)
    try {
      await api.post(`/api/admin/settings-history/${r._id}/restore`, {}, { headers: { Authorization: token } })
      toast.success('Restored.'); load(); onRestored?.()
    } catch (e) { toast.error(e.response?.data?.message || 'Could not restore.') }
    setBusy('')
  }

  return (
    <section className='mt-6 rounded-xl border border-slate-200 bg-white p-5'>
      <button type='button' onClick={() => setOpen((o) => !o)} aria-expanded={open} className='flex w-full items-center justify-between text-left'>
        <span className='font-semibold text-slate-800'>Change history</span>
        <span className='text-xs text-brand-700'>{open ? 'Hide' : 'Show'}</span>
      </button>
      {open && (rows === null ? <p className='mt-3 text-sm text-slate-400'>Loading…</p> : rows.length === 0 ? <p className='mt-3 text-sm text-slate-400'>No changes recorded yet. Changes made from now on appear here for 180 days.</p> : (
        <ul className='mt-3 divide-y divide-slate-100'>
          {rows.map((r) => (
            <li key={r._id} className='flex flex-wrap items-start justify-between gap-3 py-3 text-sm'>
              <div className='min-w-0'>
                <p className='text-xs text-slate-400'>{new Date(r.at).toLocaleString()} · {r.adminEmail || 'admin'}{r.restoredFrom ? ' · restore' : ''}</p>
                <ul className='mt-1 space-y-0.5'>
                  {Object.keys(r.after).filter((k) => !prefix || k.startsWith(prefix)).map((k) => (
                    <li key={k} className='text-slate-700'><span className='font-medium'>{k}</span>: <span className='text-slate-400 line-through'>{show(r.before[k])}</span> → {show(r.after[k])}</li>
                  ))}
                </ul>
              </div>
              <button type='button' disabled={busy === r._id} onClick={() => restore(r)} className='shrink-0 rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50'>Restore old values</button>
            </li>
          ))}
        </ul>
      ))}
    </section>
  )
}
export default SettingsHistory
