// Pure helpers for the Applications board (no browser APIs, tested in Node).
export const COLUMNS = [
  { id: 'saved', label: 'Saved', hint: 'Jobs you plan to apply for' },
  { id: 'applied', label: 'Applied', hint: 'Applications you have sent' },
  { id: 'interview', label: 'Interview', hint: 'Calls, tests and interviews' },
  { id: 'offer', label: 'Offer', hint: 'Offers received' },
  { id: 'closed', label: 'Closed', hint: 'Rejected, withdrawn or filled' },
]

// A date such as 2026-11-28 or a full ISO string -> 'YYYY-MM-DD' (what an <input type=date> uses). Empty for nothing.
export const dayValue = (v) => (v ? String(v).slice(0, 10) : '')

// Reminder state of a card relative to `today` ('YYYY-MM-DD'). Closed and offer cards never nag.
export const dueState = (card, today) => {
  const f = dayValue(card.followUpOn)
  if (!f || card.status === 'closed' || card.status === 'offer') return null
  if (f < today) return 'overdue'
  if (f === today) return 'today'
  return null
}

export const dueCount = (cards, today) => cards.filter((c) => dueState(c, today)).length

// Cards per column. Inside a column, cards that are due come first, then the most recently changed.
export const groupByStatus = (cards, today) => {
  const out = Object.fromEntries(COLUMNS.map((c) => [c.id, []]))
  for (const c of cards) (out[c.status] || out.applied).push(c)
  const rank = (c) => (dueState(c, today) === 'overdue' ? 0 : dueState(c, today) === 'today' ? 1 : 2)
  for (const k of Object.keys(out)) out[k].sort((a, b) => rank(a) - rank(b) || String(b.updatedAt).localeCompare(String(a.updatedAt)))
  return out
}

export const todayLocal = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const prettyDay = (v) => {
  const s = dayValue(v)
  if (!s) return ''
  const [y, m, d] = s.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}
