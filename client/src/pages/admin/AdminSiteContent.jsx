import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../configs/api'
import { invalidateSiteContent } from '../../utils/siteContent'

const input = 'w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-300 focus:border-green-400'

const AdminSiteContent = () => {
  const { token } = useSelector(state => state.auth)
  const headers = { headers: { Authorization: token } }
  const [fields, setFields] = useState(null)
  const [saved, setSaved] = useState({})
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/api/admin/site-content', headers)
      .then(({ data }) => { setFields(data.fields); setSaved(data.values); setValues(data.values) })
      .catch((e) => { setFields([]); toast.error(e.response?.data?.message || 'Could not load.') })
  }, [])

  const groups = useMemo(() => {
    const g = {}
    ;(fields || []).forEach((f) => { (g[f.group] ||= []).push(f) })
    return Object.entries(g)
  }, [fields])

  const dirty = fields?.some((f) => (values[f.key] ?? '') !== (saved[f.key] ?? ''))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put('/api/admin/site-content', { values }, headers)
      setSaved(data.values); setValues(data.values); invalidateSiteContent()
      toast.success('Saved. The site now shows the new text.')
    } catch (err) { toast.error(err.response?.data?.message || 'Could not save.') }
    finally { setSaving(false) }
  }

  const resetField = (f) => setValues({ ...values, [f.key]: f.value })

  if (!fields) return <p className='text-slate-400'>Loading…</p>

  return (
    <form onSubmit={save} className='max-w-2xl'>
      <h1 className='text-2xl font-semibold text-slate-800 mb-1'>Homepage text</h1>
      <p className='text-sm text-slate-500 mb-6'>Change the wording on the homepage and the Contact page. Clearing a field or using “Reset” brings back the original text.</p>
      <div className='space-y-5'>
        {groups.map(([group, items]) => (
          <div key={group} className='bg-white rounded-xl border border-slate-200 p-5 space-y-4'>
            <p className='text-sm font-semibold text-slate-800'>{group}</p>
            {items.map((f) => (
              <div key={f.key}>
                <div className='flex items-center justify-between'>
                  <label htmlFor={f.key} className='text-xs text-slate-500'>{f.label}</label>
                  {(values[f.key] ?? '') !== f.value && <button type='button' onClick={() => resetField(f)} className='text-[11px] text-slate-400 hover:text-green-700'>Reset</button>}
                </div>
                {f.type === 'toggle' ? (
                  <label className='inline-flex items-center gap-2 text-sm text-slate-700 mt-1'>
                    <input id={f.key} type='checkbox' checked={values[f.key] !== 'false'} onChange={(e) => setValues({ ...values, [f.key]: e.target.checked ? 'true' : 'false' })} /> Yes
                  </label>
                ) : f.type === 'textarea' ? (
                  <textarea id={f.key} rows={2} maxLength={400} value={values[f.key] ?? ''} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} className={input} />
                ) : (
                  <input id={f.key} maxLength={400} value={values[f.key] ?? ''} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} className={input} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className='flex items-center gap-4 mt-6'>
        <button disabled={saving || !dirty} className='px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-full text-sm font-medium transition'>{saving ? 'Saving…' : 'Save changes'}</button>
        <a href='/' target='_blank' rel='noreferrer' className='text-sm text-green-700 hover:underline'>View homepage</a>
      </div>
    </form>
  )
}

export default AdminSiteContent
