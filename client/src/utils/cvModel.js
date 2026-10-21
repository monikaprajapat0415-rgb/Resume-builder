// Shared by the CV preview (HTML) and the CV PDF so both always show the same content in the same order.

export const CV_TEMPLATES = [
  { id: 'standard', name: 'Standard', desc: 'Clean sans-serif with coloured headings' },
  { id: 'classic', name: 'Classic', desc: 'Traditional serif, black and white' },
  { id: 'compact', name: 'Compact', desc: 'Smaller type to fit more on one page' },
  { id: 'modern', name: 'Modern', desc: 'Left-aligned header, sans-serif, coloured headings with a rule' },
  { id: 'elegant', name: 'Elegant', desc: 'Centred serif, headings in title case with a line above' },
  { id: 'fresher', name: 'Fresher', desc: 'Larger text, bold black headings, coloured name' },
  { id: 'executive', name: 'Executive', desc: 'Formal serif, capital name, double rule, black and white' },
  { id: 'minimal', name: 'Minimal', desc: 'Airy, no rules, quiet headings' },
  { id: 'tech', name: 'Tech', desc: 'Monospace type for engineering and IT roles' },
  { id: 'dense', name: 'Dense serif', desc: 'Small serif type for long work histories' },
  { id: 'bold', name: 'Bold name', desc: 'Large name and a thick line above each heading' },
  { id: 'soft', name: 'Soft', desc: 'Centred, friendly, title-case headings, no rules' },
  { id: 'large-print', name: 'Large print', desc: 'Bigger type for easy reading, for hands-on and trade roles' },
]

// ONE style spec for the preview, the PDF and the Word file, so all three look the same.
// All sizes are in points (pt). The preview converts to CSS px (1pt = 4/3 px).
// Page is A4 (595 x 842 pt) with the same margins everywhere: 36pt left/right, 33pt top/bottom.
export const CV_PAGE = { w: 595.28, h: 841.89, mx: 36, my: 33 }
export const CV_LINE = 1.4 // line height as a multiple of the font size
export const CV_STYLE = {
  standard: { css: 'Helvetica, Arial, sans-serif', pdfFont: 'helvetica', docxFont: 'Arial', base: 10, name: 21, head: 10, gap: 12, coloured: true },
  classic: { css: '"Times New Roman", Times, serif', pdfFont: 'times', docxFont: 'Times New Roman', base: 10.5, name: 21, head: 10.5, gap: 12, coloured: false },
  compact: { css: 'Helvetica, Arial, sans-serif', pdfFont: 'helvetica', docxFont: 'Arial', base: 9, name: 18, head: 9, gap: 8, coloured: true },
  // Added styles. Optional fields (see cvStyle below): align, rule (under | over | double | none), thick, headCase (upper | title),
  // nameCase (as | upper), sep, inkHead (headings in black while the name keeps the accent colour), track.
  modern: { css: 'Helvetica, Arial, sans-serif', pdfFont: 'helvetica', docxFont: 'Arial', base: 10, name: 24, head: 10, gap: 12, coloured: true, align: 'left', sep: '  ·  ' },
  elegant: { css: '"Times New Roman", Times, serif', pdfFont: 'times', docxFont: 'Times New Roman', base: 10.5, name: 22, head: 11, gap: 13, coloured: true, nameCase: 'upper', headCase: 'title', rule: 'over' },
  fresher: { css: 'Helvetica, Arial, sans-serif', pdfFont: 'helvetica', docxFont: 'Arial', base: 10.5, name: 22, head: 11, gap: 12, coloured: true, align: 'left', inkHead: true, thick: true },
  executive: { css: '"Times New Roman", Times, serif', pdfFont: 'times', docxFont: 'Times New Roman', base: 11, name: 22, head: 11, gap: 12, coloured: false, nameCase: 'upper', rule: 'double' },
  minimal: { css: 'Helvetica, Arial, sans-serif', pdfFont: 'helvetica', docxFont: 'Arial', base: 10, name: 22, head: 11, gap: 14, coloured: true, align: 'left', headCase: 'title', rule: 'none' },
  tech: { css: '"Courier New", Courier, monospace', pdfFont: 'courier', docxFont: 'Courier New', base: 9.5, name: 18, head: 9.5, gap: 11, coloured: true, align: 'left', rule: 'none', sep: '  /  ' },
  dense: { css: '"Times New Roman", Times, serif', pdfFont: 'times', docxFont: 'Times New Roman', base: 9.5, name: 18, head: 9.5, gap: 8, coloured: false, align: 'left' },
  bold: { css: 'Helvetica, Arial, sans-serif', pdfFont: 'helvetica', docxFont: 'Arial', base: 10, name: 28, head: 11, gap: 13, coloured: true, align: 'left', rule: 'over', thick: true },
  soft: { css: 'Helvetica, Arial, sans-serif', pdfFont: 'helvetica', docxFont: 'Arial', base: 10.5, name: 22, head: 11.5, gap: 14, coloured: true, headCase: 'title', rule: 'none', sep: '  •  ' },
  'large-print': { css: 'Helvetica, Arial, sans-serif', pdfFont: 'helvetica', docxFont: 'Arial', base: 11, name: 24, head: 12, gap: 13, coloured: true, align: 'left', inkHead: true, thick: true },
}
// A style with every optional field filled in. The preview, the PDF and the Word file all read styles through this.
export const cvStyle = (template) => {
  const st = CV_STYLE[template] || CV_STYLE.standard
  return { align: 'center', rule: 'under', thick: false, headCase: 'upper', nameCase: 'as', sep: '  |  ', inkHead: false, track: st.headCase === 'title' ? 0 : 0.6, ...st }
}
// Heading line: thickness (pt) and the gap between the text and the line (pt). Under and over use the same height.
export const cvRule = (st) => {
  if (st.rule === 'none') return { w: 0, pad: 0 }
  const base = 1.1
  return { w: st.rule === 'double' ? base * 3 : base * (st.thick ? 2 : 1), pad: 1.5 }
}
export const CV_SPACE = {
  contactTop: 4.5, headAfter: 4.5, headPad: 1.5, headRule: 1.1, headTrack: 0.6,
  blockAfter: 6, blockInner: 1.5, bulletIndent: 13.5, metaDrop: 1, // meta text is this many pt smaller than body
  text: '#111827', contact: '#374151', meta: '#4B5563', classicColor: '#111827',
}

export const emptyCv = () => ({
  cv_title: '', professional_summary: '', skills: [], experience: [], projects: [], education: [],
  certifications: [], internships: [], achievements: [], languages: [], additional_information: [],
  missing_information: [], ats_recommendations: [],
})

export const emptyInput = () => ({
  summary_notes: '', skills: [], experience: [], internships: [], projects: [], education: [],
  certifications: [], achievements: [], languages: [], additional_information: [],
})

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const fmtMonth = (d) => {
  const m = /^(\d{4})-(\d{2})$/.exec(String(d || '').trim())
  return m && MONTHS[+m[2] - 1] ? `${MONTHS[+m[2] - 1]} ${m[1]}` : String(d || '')
}

const dates = (e) => [e.start_date, e.end_date].filter(Boolean).join(' – ')

// Fresher: education and projects lead. Experienced: experience leads.
export const sectionOrder = (level) => level === 'experienced'
  ? ['summary', 'skills', 'experience', 'internships', 'projects', 'education', 'certifications', 'achievements', 'languages', 'additional']
  : ['summary', 'education', 'internships', 'projects', 'skills', 'experience', 'certifications', 'achievements', 'languages', 'additional']

// Turns the CV + contact details into an ordered list of sections with plain-text blocks.
export const buildCvSections = (cv, personal = {}, level = 'fresher') => {
  const out = []
  const jobBlock = (e) => ({
    title: [e.job_title, e.company].filter(Boolean).join(', '),
    meta: [dates(e), e.location].filter(Boolean).join('  |  '),
    bullets: e.responsibilities || [],
  })
  const map = {
    summary: () => cv.professional_summary && { heading: 'Professional Summary', text: cv.professional_summary },
    skills: () => cv.skills?.length && { heading: 'Technical Skills', text: cv.skills.join(', ') },
    experience: () => cv.experience?.length && { heading: 'Professional Experience', blocks: cv.experience.map(jobBlock) },
    internships: () => cv.internships?.length && { heading: 'Internships', blocks: cv.internships.map(jobBlock) },
    projects: () => cv.projects?.length && {
      heading: 'Projects',
      blocks: cv.projects.map((p) => ({
        title: p.project_name,
        meta: p.technologies?.length ? `Technologies: ${p.technologies.join(', ')}` : '',
        text: p.description,
        bullets: p.achievements || [],
      })),
    },
    education: () => cv.education?.length && {
      heading: 'Education',
      blocks: cv.education.map((e) => ({ title: e.qualification, meta: [e.institution, e.graduation_year].filter(Boolean).join('  |  ') })),
    },
    certifications: () => cv.certifications?.length && { heading: 'Certifications', bullets: cv.certifications },
    achievements: () => cv.achievements?.length && { heading: 'Achievements', bullets: cv.achievements },
    languages: () => cv.languages?.length && { heading: 'Languages', text: cv.languages.join(', ') },
    additional: () => cv.additional_information?.length && { heading: 'Additional Information', bullets: cv.additional_information },
  }
  sectionOrder(level).forEach((k) => { const s = map[k]?.(); if (s) out.push(s) })
  return out
}

export const contactLine = (p = {}) => [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean)

// Plain-text version (copy to clipboard / paste into online application forms).
export const cvToText = (cv, personal, level) => {
  const lines = [(personal?.full_name || '').toUpperCase(), contactLine(personal).join(' | '), '']
  buildCvSections(cv, personal, level).forEach((s) => {
    lines.push(s.heading.toUpperCase())
    if (s.text) lines.push(s.text)
    s.bullets?.forEach((b) => lines.push(`- ${b}`))
    s.blocks?.forEach((b) => {
      lines.push(b.title); if (b.meta) lines.push(b.meta); if (b.text) lines.push(b.text)
      b.bullets?.forEach((x) => lines.push(`- ${x}`))
      lines.push('')
    })
    lines.push('')
  })
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}
