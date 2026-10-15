import crypto from 'crypto'
// Seekers describe themselves in free text. Strip anything that would let a company identify or contact
// them before they have accepted a request: emails, phone numbers, links and @handles.
export const scrubPii = (text) => String(text || '')
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '')
    .replace(/https?:\/\/\S+|www\.\S+|\b(?:linkedin|github|twitter|instagram|facebook)\.com\S*/gi, '')
    .replace(/(?:\+?\d[\s().-]*){9,}/g, '')
    .replace(/(^|\s)@\w{2,}/g, '$1')
    .replace(/[ \t]{2,}/g, ' ').trim()

const ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'   // no 0/O/1/I/L
export const newPublicId = () => 'T-' + Array.from(crypto.randomBytes(8), (b) => ALPHA[b % ALPHA.length]).join('')

// The ONLY shape of a seeker that is ever sent to a company before they accept. No userId, name, email or phone.
export const anonCard = (t) => ({
    id: t.publicId, headline: t.headline, level: t.level, experienceYears: t.experienceYears,
    skills: t.skills || [], location: t.location, remote: t.remote, relocate: t.relocate,
    jobTypes: t.jobTypes || [], expectedSalary: t.expectedSalary, noticePeriod: t.noticePeriod,
    summary: t.summary, updatedAt: t.updatedAt,
})
