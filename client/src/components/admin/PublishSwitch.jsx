import React, { useState } from 'react'

// One-click on/off switch used in the admin lists (published or draft, shown or hidden).
// `onChange(next)` should return a promise (the API call). The switch is disabled while it runs and
// always follows the real data afterwards, so it never shows a state the server did not accept.
const PublishSwitch = ({ on, onChange, labelOn = 'Published', labelOff = 'Draft', name = '', disabled = false, title }) => {
  const [busy, setBusy] = useState(false)
  const click = async () => {
    if (busy || disabled) return
    setBusy(true)
    try { await onChange(!on) } finally { setBusy(false) }
  }
  return (
    <button type='button' role='switch' aria-checked={on} aria-label={`${on ? labelOn : labelOff}${name ? `: ${name}` : ''}. Press to switch.`} title={title || (on ? `${labelOn}. Click to turn off.` : `${labelOff}. Click to turn on.`)}
      disabled={busy || disabled} onClick={click} className='inline-flex items-center gap-2 shrink-0 disabled:opacity-60'>
      <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${on ? 'bg-brand-600' : 'bg-slate-300'}`}>
        <span className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
      </span>
      <span className={`text-xs font-medium w-16 text-left ${on ? 'text-brand-700' : 'text-slate-500'}`}>{on ? labelOn : labelOff}</span>
    </button>
  )
}

export default PublishSwitch
