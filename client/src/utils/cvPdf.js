import jsPDF from 'jspdf'
import { buildCvSections, contactLine, CV_STYLE, CV_SPACE, CV_PAGE, CV_LINE } from './cvModel'

// Text-based PDF (selectable / searchable text), which is what applicant tracking systems parse best.
// Sizes, margins, spacing and colours come from the same spec as the on-screen preview and the Word file.
const rgb = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '')
  if (!m) return [30, 58, 138]
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export const downloadCvPdf = ({ cv, personal, template = 'standard', accentColor, level, fileName = 'cv' }) => {
  const c = CV_STYLE[template] || CV_STYLE.standard
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  doc.setProperties({ title: `${personal?.full_name || 'CV'} - CV`, author: personal?.full_name || '' })
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight()
  const MX = CV_PAGE.mx, MY = CV_PAGE.my, maxW = W - MX * 2
  const color = rgb(c.coloured ? accentColor : CV_SPACE.classicColor)
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
  line(personal?.full_name || '', c.name, W / 2, { align: 'center' })
  const contact = contactLine(personal).join('  |  ')
  if (contact) {
    y += CV_SPACE.contactTop
    doc.setFont(c.pdfFont, 'normal'); doc.setFontSize(c.base); doc.setTextColor(...rgb(CV_SPACE.contact))
    doc.splitTextToSize(contact, maxW).forEach((ln) => line(ln, c.base, W / 2, { align: 'center' }))
  }
  y += c.gap

  buildCvSections(cv, personal, level).forEach((s) => {
    const first = s.blocks?.[0]
    need(c.head * CV_LINE + CV_SPACE.headAfter + 4 + c.base * CV_LINE * (first ? 2 : 1)) // keep the heading with its first lines
    doc.setFont(c.pdfFont, 'bold'); doc.setFontSize(c.head); doc.setTextColor(...color)
    line(s.heading.toUpperCase(), c.head, MX, { charSpace: CV_SPACE.headTrack })
    y += CV_SPACE.headPad
    doc.setDrawColor(...color); doc.setLineWidth(CV_SPACE.headRule); doc.line(MX, y + CV_SPACE.headRule / 2, W - MX, y + CV_SPACE.headRule / 2)
    y += CV_SPACE.headRule + CV_SPACE.headAfter
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
