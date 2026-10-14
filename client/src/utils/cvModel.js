// Shared by the CV preview (HTML) and the CV PDF so both always show the same content in the same order.

export const CV_TEMPLATES = [
  { id: 'standard', name: 'Standard', desc: 'Clean sans-serif with coloured headings' },
  { id: 'classic', name: 'Classic', desc: 'Traditional serif, black and white' },
  { id: 'compact', name: 'Compact', desc: 'Smaller type to fit more on one page' },
]

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
