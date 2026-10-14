import jsPDF from 'jspdf'
import { buildCvSections, contactLine } from './cvModel'

// Text-based PDF (selectable / searchable text), which is what applicant tracking systems parse best.
// The resume's image-based export is fine to look at but an ATS cannot read it.
const hexToRgb = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '')
  if (!m) return [30, 58, 138]
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const CFG = {
  standard: { font: 'helvetica', base: 10.5, name: 22, head: 11, gap: 14, coloured: true },
  classic: { font: 'times', base: 11, name: 22, head: 11, gap: 14, coloured: false },
  compact: { font: 'helvetica', base: 9.5, name: 19, head: 10, gap: 10, coloured: true },
}

export const downloadCvPdf = ({ cv, personal, template = 'standard', accentColor, level, fileName = 'cv' }) => {
  const c = CFG[template] || CFG.standard
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  doc.setProperties({ title: `${personal?.full_name || 'CV'} - CV`, author: personal?.full_name || '' })
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight()
  const M = 46, maxW = W - M * 2
  const color = c.coloured ? hexToRgb(accentColor) : [17, 24, 39]
  const lh = (size) => size * 1.32
  let y = M

  const need = (h) => { if (y + h > H - M) { doc.addPage(); y = M } }
  const para = (text, { size = c.base, bold = false, indent = 0, gray = false, after = 0, bullet = false } = {}) => {
    doc.setFont(c.font, bold ? 'bold' : 'normal'); doc.setFontSize(size)
    doc.setTextColor(...(gray ? [75, 85, 99] : [17, 24, 39]))
    const w = maxW - indent - (bullet ? 12 : 0)
    const lines = doc.splitTextToSize(String(text), w)
    lines.forEach((ln, i) => {
      need(lh(size))
      y += lh(size) * 0.8
      if (bullet && i === 0) doc.text('•', M + indent, y)
      doc.text(ln, M + indent + (bullet ? 12 : 0), y)
      y += lh(size) * 0.2
    })
    y += after
  }

  // header
  doc.setFont(c.font, 'bold'); doc.setFontSize(c.name); doc.setTextColor(...color)
  need(c.name * 1.3); y += c.name
  doc.text(personal?.full_name || '', W / 2, y, { align: 'center' })
  y += 6
  const contact = contactLine(personal).join('  |  ')
  if (contact) {
    doc.setFont(c.font, 'normal'); doc.setFontSize(c.base); doc.setTextColor(55, 65, 81)
    doc.splitTextToSize(contact, maxW).forEach((ln) => { y += lh(c.base); doc.text(ln, W / 2, y, { align: 'center' }) })
  }
  y += c.gap

  buildCvSections(cv, personal, level).forEach((s) => {
    need(c.head * 3)
    doc.setFont(c.font, 'bold'); doc.setFontSize(c.head); doc.setTextColor(...color)
    y += c.head
    doc.text(s.heading.toUpperCase(), M, y)
    y += 3; doc.setDrawColor(...color); doc.setLineWidth(0.8); doc.line(M, y, W - M, y); y += 4
    if (s.text) para(s.text, { after: 2 })
    s.bullets?.forEach((b) => para(b, { bullet: true, indent: 4 }))
    s.blocks?.forEach((b) => {
      need(c.base * 4)
      para(b.title, { bold: true })
      if (b.meta) para(b.meta, { size: c.base - 1, gray: true })
      if (b.text) para(b.text)
      b.bullets?.forEach((x) => para(x, { bullet: true, indent: 4 }))
      y += 5
    })
    y += c.gap - 4
  })

  const safe = String(fileName || 'cv').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'cv'
  doc.save(`${safe}.pdf`)
}
