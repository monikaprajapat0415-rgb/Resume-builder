import { buildCvSections, contactLine } from './cvModel'

// Word (.docx) export. Plain paragraphs and real bullet lists only (no tables or text boxes) so it stays ATS-friendly.
// The docx library is loaded on demand so it does not slow down the rest of the site.
export const downloadCvDocx = async ({ cv, personal, template = 'standard', accentColor = '#1E3A8A', level, fileName = 'cv' }) => {
  const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, LevelFormat } = await import('docx')
  const font = template === 'classic' ? 'Times New Roman' : 'Arial'
  const base = template === 'compact' ? 19 : 21 // half-points
  const color = template === 'classic' ? '111827' : String(accentColor).replace('#', '').padEnd(6, '0').slice(0, 6)

  const kids = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: personal?.full_name || '', bold: true, size: 44, color, font })] }),
  ]
  const contact = contactLine(personal).join('  |  ')
  if (contact) kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: contact, size: base, font, color: '374151' })] }))

  const bullet = (t) => new Paragraph({ numbering: { reference: 'cv-bullets', level: 0 }, spacing: { after: 40 }, children: [new TextRun({ text: t, size: base, font })] })

  buildCvSections(cv, personal, level).forEach((s) => {
    kids.push(new Paragraph({
      spacing: { before: 200, after: 80 }, keepNext: true,
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color, space: 2 } },
      children: [new TextRun({ text: s.heading.toUpperCase(), bold: true, size: base + 2, color, font })],
    }))
    if (s.text) kids.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: s.text, size: base, font })] }))
    s.bullets?.forEach((b) => kids.push(bullet(b)))
    s.blocks?.forEach((b) => {
      kids.push(new Paragraph({ keepNext: true, spacing: { before: 80 }, children: [new TextRun({ text: b.title || '', bold: true, size: base, font })] }))
      if (b.meta) kids.push(new Paragraph({ keepNext: true, children: [new TextRun({ text: b.meta, size: base - 2, font, color: '4B5563' })] }))
      if (b.text) kids.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: b.text, size: base, font })] }))
      b.bullets?.forEach((x) => kids.push(bullet(x)))
    })
  })

  const doc = new Document({
    title: `${personal?.full_name || 'CV'} - CV`,
    creator: personal?.full_name || 'Prime Resume AI',
    numbering: { config: [{ reference: 'cv-bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }] },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } }, children: kids }],
  })
  const blob = await Packer.toBlob(doc)
  const safe = String(fileName || 'cv').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'cv'
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `${safe}.docx`; document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
