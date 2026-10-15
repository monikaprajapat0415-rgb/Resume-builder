import { buildCvSections, contactLine, CV_STYLE, CV_SPACE, CV_PAGE, CV_LINE } from './cvModel'

// Word (.docx) export. Plain paragraphs and real bullet lists only (no tables or text boxes) so it stays ATS-friendly.
// Sizes, margins, line height, spacing and colours come from the same spec as the on-screen preview and the PDF.
// The docx library is loaded on demand so it does not slow down the rest of the site.
const hex = (v) => String(v).replace('#', '').padEnd(6, '0').slice(0, 6).toUpperCase()
const tw = (pt) => Math.round(pt * 20) // points -> twips

export const downloadCvDocx = async ({ cv, personal, template = 'standard', accentColor = '#1E3A8A', level, fileName = 'cv' }) => {
  const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, LevelFormat, LineRuleType } = await import('docx')
  const c = CV_STYLE[template] || CV_STYLE.standard
  const font = c.docxFont
  const color = hex(c.coloured ? accentColor : CV_SPACE.classicColor)
  const body = hex(CV_SPACE.text)

  // Every paragraph gets an exact line height (size x CV_LINE) and all vertical gaps go in "after",
  // which is how the preview lays things out, so the three outputs line up.
  const sp = (size, after = 0) => ({ before: 0, after: tw(after), line: tw(size * CV_LINE), lineRule: LineRuleType.EXACT })
  const run = (text, size, o = {}) => new TextRun({ text, size: Math.round(size * 2), font, color: body, ...o })
  const para = (text, size, o = {}, after = 0, extra = {}) => new Paragraph({ spacing: sp(size, after), children: [run(text, size, o)], ...extra })

  const bullet = (t, after = 0) => new Paragraph({
    numbering: { reference: 'cv-bullets', level: 0 }, spacing: sp(c.base, after),
    children: [run(t, c.base)],
  })

  const kids = [para(personal?.full_name || '', c.name, { bold: true, color }, 0, { alignment: AlignmentType.CENTER })]
  const contact = contactLine(personal).join('  |  ')
  const afterHeader = c.gap
  if (contact) {
    kids[0] = para(personal?.full_name || '', c.name, { bold: true, color }, CV_SPACE.contactTop, { alignment: AlignmentType.CENTER })
    kids.push(para(contact, c.base, { color: hex(CV_SPACE.contact) }, afterHeader, { alignment: AlignmentType.CENTER }))
  } else {
    kids[0] = para(personal?.full_name || '', c.name, { bold: true, color }, afterHeader, { alignment: AlignmentType.CENTER })
  }

  buildCvSections(cv, personal, level).forEach((s) => {
    kids.push(new Paragraph({
      keepNext: true, spacing: sp(c.head, CV_SPACE.headAfter),
      border: { bottom: { style: BorderStyle.SINGLE, size: Math.round(CV_SPACE.headRule * 8), color, space: CV_SPACE.headPad } },
      children: [run(s.heading.toUpperCase(), c.head, { bold: true, color, characterSpacing: tw(CV_SPACE.headTrack) })],
    }))
    // spacing after the section's last paragraph = section gap (merged with the block gap like the preview)
    const endGap = s.blocks ? Math.max(CV_SPACE.blockAfter, c.gap) : c.gap
    if (s.text) kids.push(para(s.text, c.base, {}, s.bullets || s.blocks ? 0 : endGap))
    s.bullets?.forEach((b, i) => kids.push(bullet(b, i === s.bullets.length - 1 ? endGap : 0)))
    s.blocks?.forEach((b, bi) => {
      const last = bi === s.blocks.length - 1
      const tail = last ? endGap : CV_SPACE.blockAfter
      const hasMore = !!(b.meta || b.text || b.bullets?.length)
      const g = CV_SPACE.blockInner
      kids.push(para(b.title || '', c.base, { bold: true }, b.meta ? 0 : hasMore ? g : tail, { keepNext: hasMore }))
      if (b.meta) {
        const more = !!(b.text || b.bullets?.length)
        kids.push(para(b.meta, c.base - CV_SPACE.metaDrop, { color: hex(CV_SPACE.meta) }, more ? g : tail, { keepNext: more }))
      }
      if (b.text) kids.push(para(b.text, c.base, {}, b.bullets?.length ? g : tail))
      b.bullets?.forEach((x, i) => kids.push(bullet(x, i === b.bullets.length - 1 ? tail : 0)))
    })
  })

  const doc = new Document({
    title: `${personal?.full_name || 'CV'} - CV`,
    creator: personal?.full_name || 'Prime Resume AI',
    styles: { default: { document: { run: { font, size: Math.round(c.base * 2), color: body } } } },
    numbering: { config: [{ reference: 'cv-bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: tw(CV_SPACE.bulletIndent), hanging: tw(CV_SPACE.bulletIndent - 4) } } } }] }] },
    sections: [{ properties: { page: { size: { width: tw(CV_PAGE.w), height: tw(CV_PAGE.h) }, margin: { top: tw(CV_PAGE.my), bottom: tw(CV_PAGE.my), left: tw(CV_PAGE.mx), right: tw(CV_PAGE.mx) } } }, children: kids }],
  })
  const blob = await Packer.toBlob(doc)
  const safe = String(fileName || 'cv').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'cv'
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `${safe}.docx`; document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
