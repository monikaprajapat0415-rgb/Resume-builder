// Helpers shared by the ATS-focused templates. Everything here produces plain text so
// resume parsers read the same words a person sees (no icons, images or tables).
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const [year, month] = String(dateStr).split('-')
  if (!month) return year
  return new Date(year, month - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export const range = (start, end, current) => {
  const a = formatDate(start)
  const b = current ? 'Present' : formatDate(end)
  return [a, b].filter(Boolean).join(' – ')
}

// "description" is free text where each line is one achievement.
export const lines = (text) =>
  String(text || '')
    .split('\n')
    .map((l) => l.replace(/^\s*[•\-*·]\s*/, '').trim())
    .filter(Boolean)

export const contactParts = (p = {}) => [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean)

export const printSafe = { WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }
