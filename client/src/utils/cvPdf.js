import jsPDF from 'jspdf'
import { buildCvSections, contactLine, cvStyle, cvRule, CV_SPACE, CV_PAGE, CV_LINE } from './cvModel'

// Text-based PDF (selectable / searchable text), which is what applicant tracking systems parse best.
// Sizes, margins, spacing and colours come from the same spec as the on-screen preview and the Word file.
const rgb = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '')
  if (!m) return [30, 58, 138]
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export const downloadCvPdf = ({ cv, personal, template = 'standard', accentColor, level, fileName = 'cv' }) => {
  const c = cvStyle(template)
  const rl = cvRule(c)
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  doc.setProperties({ title: `${personal?.full_name || 'CV'} - CV`, author: personal?.full_name || '' })
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight()
  const MX = CV_PAGE.mx, MY = CV_PAGE.my, maxW = W - MX * 2
  const color = rgb(c.coloured ? accentColor : CV_SPACE.classicColor)
  const headColor = rgb(c.coloured && !c.inkHead ? accentColor : CV_SPACE.classicColor)
  const hx = c.align === 'left' ? MX : W / 2, hopt = c.align === 'left' ? undefined : { align: 'center' }
  let y = MY

  const need = (h) => { if (y + h > H - MY) { doc.addPage(); y = MY } }
  // One line box = size * CV_LINE tall, text centred in it (this is how the browser lays out a line).
  const line = (txt, size, x, opts) => {
    const lh = size * CV_LINE
    need(lh)
    doc.text(txt, x, y + lh / 2 + size * 0.33, opts)
    y += lh
  }
  const para = (text, { size = c.base, bold = false, indent = 0, rgbColor = rgb(CV_SPACE.text), bullet = false } = {}) => {
    doc.setFont(c.pdfFont, bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(...rgbColor)
    const off = indent + (bullet ? CV_SPACE.bulletIndent : 0)
    doc.splitTextToSize(String(text), maxW - off).forEach((ln, i) => {
      if (bullet && i === 0) { need(size * CV_LINE); doc.text('•', MX + CV_SPACE.bulletIndent - 8, y + size * CV_LINE / 2 + size * 0.33) }
      line(ln, size, MX + off)
    })
  }

  // header
  doc.setFont(c.pdfFont, 'bold'); doc.setFontSize(c.name); doc.setTextColor(...color)
  line(c.nameCase === 'upper' ? String(personal?.full_name || '').toUpperCase() : (personal?.full_name || ''), c.name, hx, hopt)
  const contact = contactLine(personal).join(c.sep)
  if (contact) {
    y += CV_SPACE.contactTop
    doc.setFont(c.pdfFont, 'normal'); doc.setFontSize(c.base); doc.setTextColor(...rgb(CV_SPACE.contact))
    doc.splitTextToSize(contact, maxW).forEach((ln) => line(ln, c.base, hx, hopt))
  }
  y += c.gap

  buildCvSections(cv, personal, level).forEach((s) => {
    const first = s.blocks?.[0]
    need(c.head * CV_LINE + CV_SPACE.headAfter + rl.w + rl.pad + c.base * CV_LINE * (first ? 2 : 1)) // keep the heading with its first lines
    const rule = (at) => {
      doc.setDrawColor(...headColor)
      if (c.rule === 'double') { const t = CV_SPACE.headRule; doc.setLineWidth(t); doc.line(MX, at + t / 2, W - MX, at + t / 2); doc.line(MX, at + t * 2.5, W - MX, at + t * 2.5) }
      else { doc.setLineWidth(rl.w); doc.line(MX, at + rl.w / 2, W - MX, at + rl.w / 2) }
    }
    if (c.rule === 'over') { rule(y); y += rl.w + rl.pad }
    doc.setFont(c.pdfFont, 'bold'); doc.setFontSize(c.head); doc.setTextColor(...headColor)
    line(c.headCase === 'upper' ? s.heading.toUpperCase() : s.heading, c.head, MX, { charSpace: c.track })
    if (c.rule === 'under' || c.rule === 'double') { y += rl.pad; rule(y); y += rl.w }
    y += CV_SPACE.headAfter
    if (s.text) para(s.text)
    s.bullets?.forEach((b) => para(b, { bullet: true }))
    s.blocks?.forEach((b, i) => {
      need(c.base * CV_LINE * (b.meta ? 3 : 2))
      para(b.title, { bold: true })
      if (b.meta) para(b.meta, { size: c.base - CV_SPACE.metaDrop, rgbColor: rgb(CV_SPACE.meta) })
      if (b.text) { y += CV_SPACE.blockInner; para(b.text) }
      if (b.bullets?.length) { y += CV_SPACE.blockInner; b.bullets.forEach((x) => para(x, { bullet: true })) }
      if (i < s.blocks.length - 1) y += CV_SPACE.blockAfter
    })
    // the last block's bottom margin merges with the section gap in the preview, so only the larger one counts
    y += s.blocks ? Math.max(CV_SPACE.blockAfter, c.gap) : c.gap
  })

  const safe = String(fileName || 'cv').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'cv'
  doc.save(`${safe}.pdf`)
}
