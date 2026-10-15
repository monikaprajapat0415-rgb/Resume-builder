import crypto from 'crypto'
import Employer from '../models/Employer.js'
import TalentProfile from '../models/TalentProfile.js'
import ContactRequest from '../models/ContactRequest.js'
import Job from '../models/Job.js'
import User from '../models/User.js'
import { isDisposableEmail } from '../utils/disposableEmail.js'
import { isFreeEmail, domainMatches, hostOf } from '../utils/freeEmail.js'
import { slugify, isSafeUrl } from '../utils/slugify.js'
import { notify, notifyAdmin, escapeHtml, CLIENT_URL } from '../utils/notify.js'
import { CATEGORIES, COUNTRY_CODES, CURRENCIES, PAY_PER, EMPLOYER_TYPES, JOB_TYPES, formatPay } from '../utils/workTaxonomy.js'

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+']
const TYPES = JOB_TYPES
const MAX_OPEN_JOBS = 20, DAILY_JOBS = 10
const idOk = (id) => /^[a-f\d]{24}$/i.test(String(id))
const str = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n)

// Runs after `protect`. Loads the caller's employer profile; only approved companies pass.
export const needEmployer = async (req, res, next) => {
    try {
        const emp = await Employer.findOne({ userId: req.userId })
        if (!emp) return res.status(403).json({ message: 'Set up your company profile first.', code: 'no_employer' })
        if (emp.status !== 'approved') return res.status(403).json({ message: emp.status === 'pending' ? 'Your company is waiting for approval.' : 'Your company is not approved for hiring.', code: emp.status })
        req.employer = emp
        next()
    } catch (e) { return res.status(500).json({ message: 'Something went wrong.' }) }
}

const empView = (e) => ({ id: e._id, employerType: e.employerType, country: e.country, registrationNo: e.registrationNo, noFeeConfirmedAt: e.noFeeConfirmedAt, companyName: e.companyName, website: e.website, workEmail: e.workEmail, contactName: e.contactName, contactRole: e.contactRole, phone: e.phone, industry: e.industry, size: e.size, location: e.location, about: e.about, status: e.status, reviewNote: e.reviewNote, createdAt: e.createdAt })

const readCompany = (b, partial, existing) => {
    const out = {}
    const need = (k, label, min = 2, max = 150) => { if (!partial || b[k] !== undefined) { out[k] = str(b[k], max); if (out[k].length < min) throw new Error(`${label} is required.`) } }
    need('companyName', 'Business name'); need('contactName', 'Your name', 2, 100)
    if (!partial || b.employerType !== undefined) { const t = b.employerType || 'company'; if (!EMPLOYER_TYPES.includes(t)) throw new Error('Choose what kind of employer you are.'); out.employerType = t }
    if (!partial || b.country !== undefined) { const c = String(b.country || 'IN').toUpperCase(); if (!COUNTRY_CODES.includes(c)) throw new Error('Choose your country.'); out.country = c }
    if (!partial || b.website !== undefined) {
        let w = str(b.website, 300)
        if (w) {
            if (!/^https?:\/\//i.test(w)) w = 'https://' + w
            if (!hostOf(w) || !hostOf(w).includes('.') || !isSafeUrl(w)) throw new Error('Enter a valid website, e.g. https://example.com, or leave it empty.')
        }
        out.website = w
    }
    if (b.registrationNo !== undefined) out.registrationNo = str(b.registrationNo, 60)
    if (!partial || b.workEmail !== undefined) {
        const e = str(b.workEmail, 200).toLowerCase()
        if (!EMAIL_RX.test(e)) throw new Error('Enter a valid email address.')
        if (isDisposableEmail(e)) throw new Error('Temporary email addresses are not accepted. Please use your real email.')
        out.workEmail = e
    }
    if (b.contactRole !== undefined) out.contactRole = str(b.contactRole, 100)
    if (!partial || b.phone !== undefined) { const p = str(b.phone, 30); if (!/^[+\d][\d\s().-]{6,24}$/.test(p)) throw new Error('Enter your phone number so we can reach you if needed.'); out.phone = p }
    if (b.industry !== undefined) out.industry = str(b.industry, 100)
    if (b.size !== undefined) { if (b.size && !SIZES.includes(b.size)) throw new Error('Choose a size.'); out.size = b.size || '' }
    if (b.location !== undefined) out.location = str(b.location, 150)
    if (b.about !== undefined) { out.about = String(b.about || '').trim().slice(0, 1000); if (!partial && out.about.length < 30) throw new Error('Tell workers a little about your business (at least 30 characters).') }
    // identity checks on the final values (merge with what is already saved when updating)
    const final = { website: out.website ?? existing?.website ?? '', registrationNo: out.registrationNo ?? existing?.registrationNo ?? '', workEmail: out.workEmail ?? existing?.workEmail ?? '' }
    if (!final.website && !final.registrationNo) throw new Error('Add your website or your business registration number (GST, company number, trade licence) so we can verify you.')
    if (isFreeEmail(final.workEmail) && !final.registrationNo) throw new Error('You are using a personal email (like Gmail). Please add your business registration number, or use an email on your company website.')
    if (!partial && b.noFee !== true) throw new Error('Please confirm that you will never charge workers any fee to get a job.')
    return out
}

// POST /api/employers  - apply to hire
export const applyEmployer = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) return res.status(401).json({ message: 'Unauthorized' })
        if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email address first.' })
        if (await Employer.findOne({ userId: req.userId })) return res.status(409).json({ message: 'You already have a company profile.' })
        let data
        try { data = readCompany(req.body || {}, false) } catch (e) { return res.status(400).json({ message: e.message }) }
        const emp = await Employer.create({ userId: req.userId, ...data, noFeeConfirmedAt: new Date() })
        notifyAdmin(`New company waiting for approval: ${emp.companyName}`, `<p><strong>${escapeHtml(emp.companyName)}</strong> (${escapeHtml(emp.website || emp.registrationNo || 'no website')}) applied to hire (${escapeHtml(emp.employerType)}, ${escapeHtml(emp.country)}).</p><p>Email: ${escapeHtml(emp.workEmail)} ${emp.website ? (domainMatches(emp.workEmail, emp.website) ? '(matches website domain)' : '(does NOT match the website domain)') : ''}</p><p>Review it in Admin &gt; Hiring.</p>`)
        return res.status(201).json({ employer: empView(emp) })
    } catch (e) { return res.status(500).json({ message: 'Could not submit your company.' }) }
}

// GET /api/employers/me
export const myEmployer = async (req, res) => {
    try {
        const emp = await Employer.findOne({ userId: req.userId })
        if (!emp) return res.status(200).json({ employer: null })
        return res.status(200).json({ employer: empView(emp) })
    } catch (e) { return res.status(500).json({ message: 'Could not load your company.' }) }
}

// PUT /api/employers/me - changing name / website / work email sends an approved company back for review
export const updateEmployer = async (req, res) => {
    try {
        const emp = await Employer.findOne({ userId: req.userId })
        if (!emp) return res.status(404).json({ message: 'Company not found' })
        if (emp.status === 'suspended') return res.status(403).json({ message: 'This company is suspended. Contact us for help.' })
        let data
        try { data = readCompany(req.body || {}, true, emp) } catch (e) { return res.status(400).json({ message: e.message }) }
        const sensitive = ['companyName', 'website', 'workEmail', 'registrationNo', 'employerType', 'country'].some((k) => data[k] !== undefined && data[k] !== emp[k])
        Object.assign(emp, data)
        if (emp.status === 'rejected' || (emp.status === 'approved' && sensitive)) { emp.status = 'pending'; emp.reviewNote = '' }
        await emp.save()
        if (emp.status === 'pending') notifyAdmin(`Company waiting for approval: ${emp.companyName}`, `<p>${escapeHtml(emp.companyName)} updated its details and needs review in Admin &gt; Hiring.</p>`)
        return res.status(200).json({ employer: empView(emp) })
    } catch (e) { return res.status(500).json({ message: 'Could not update your company.' }) }
}

// ---------------- Company job posts ----------------

const jobView = (j) => ({ id: j._id, category: j.category, country: j.country, payMin: j.payMin, payMax: j.payMax, currency: j.currency, payPer: j.payPer, openings: j.openings, perks: j.perks || [], slug: j.slug, title: j.title, location: j.location, remote: j.remote, employmentType: j.employmentType, department: j.department, salary: j.salary, description: j.description, applyUrl: j.applyUrl, active: j.active, reviewStatus: j.reviewStatus, reviewNote: j.reviewNote, postedAt: j.postedAt, createdAt: j.createdAt })

const readJob = (b, company) => {
    const title = str(b.title, 200); if (title.length < 3) throw new Error('Enter the job title.')
    const category = b.category || 'corporate'; if (!CATEGORIES.includes(category)) throw new Error('Choose the kind of work.')
    const description = String(b.description || '').replace(/\r/g, '').trim().slice(0, 20000)
    if (description.length < (category === 'corporate' ? 80 : 30)) throw new Error(category === 'corporate' ? 'Describe the role in at least 80 characters: duties, requirements, how to apply.' : 'Describe the work: what the person will do, hours, and where. At least 30 characters.')
    const employmentType = str(b.employmentType, 40).toLowerCase(); if (employmentType && !TYPES.includes(employmentType)) throw new Error('Choose a job type.')
    const country = String(b.country || company.country || 'IN').toUpperCase(); if (!COUNTRY_CODES.includes(country)) throw new Error('Choose the country of the job.')
    let applyUrl = str(b.applyUrl, 1000); const applyEmail = str(b.applyEmail, 200)
    if (applyUrl) { if (!/^https?:\/\//i.test(applyUrl)) applyUrl = 'https://' + applyUrl; if (!hostOf(applyUrl).includes('.')) throw new Error('Enter a valid apply link.') }
    else if (applyEmail) { if (!EMAIL_RX.test(applyEmail)) throw new Error('Enter a valid apply email.'); applyUrl = `mailto:${applyEmail}` }
    else throw new Error('Add an apply link or an apply email.')
    const num = (v) => (v === '' || v === undefined || v === null ? undefined : Number(v))
    let payMin = num(b.payMin), payMax = num(b.payMax)
    for (const v of [payMin, payMax]) if (v !== undefined && !(v >= 0 && v <= 1e9)) throw new Error('Pay must be a number.')
    if (payMin > payMax) [payMin, payMax] = [payMax, payMin]
    let currency = '', payPer = ''
    if (payMin || payMax) {
        currency = String(b.currency || '').toUpperCase(); payPer = String(b.payPer || '')
        if (!CURRENCIES.includes(currency)) throw new Error('Choose the pay currency.')
        if (!PAY_PER.includes(payPer)) throw new Error('Choose how the pay is counted: per day, hour, week, month or year.')
    }
    const openings = num(b.openings); if (openings !== undefined && !(openings >= 1 && openings <= 1000)) throw new Error('Number of openings must be between 1 and 1000.')
    const perks = [...new Set((Array.isArray(b.perks) ? b.perks : []).map((x) => str(x, 40)).filter(Boolean))].slice(0, 10)
    const salary = payMin || payMax ? formatPay({ payMin, payMax, currency, payPer }) : str(b.salary, 120)
    return { title, description, category, country, employmentType, applyUrl, location: str(b.location, 200), remote: Boolean(b.remote), department: str(b.department, 120), salary, payMin: payMin || undefined, payMax: payMax || undefined, currency, payPer, openings: openings ? Math.round(openings) : undefined, perks, company: company.companyName }
}

// GET /api/employers/jobs
export const myJobs = async (req, res) => {
    try { const jobs = await Job.find({ employerId: req.employer._id }).sort({ createdAt: -1 }).lean(); return res.status(200).json({ jobs: jobs.map(jobView) }) }
    catch (e) { return res.status(500).json({ message: 'Could not load your jobs.' }) }
}

// POST /api/employers/jobs - goes live only after an admin approves it
export const createJob = async (req, res) => {
    try {
        let data
        try { data = readJob(req.body || {}, req.employer) } catch (e) { return res.status(400).json({ message: e.message }) }
        const [open, today] = await Promise.all([
            Job.countDocuments({ employerId: req.employer._id, active: true }),
            Job.countDocuments({ employerId: req.employer._id, createdAt: { $gte: new Date(Date.now() - 864e5) } }),
        ])
        if (open >= MAX_OPEN_JOBS) return res.status(400).json({ message: `You can keep up to ${MAX_OPEN_JOBS} jobs open. Close one first.` })
        if (today >= DAILY_JOBS) return res.status(429).json({ message: 'You have posted several jobs today. Please try again tomorrow.' })
        const rand = crypto.randomBytes(3).toString('hex')
        const job = await Job.create({
            ...data, employerId: req.employer._id, sourceType: 'employer', externalId: `emp-${req.employer._id}-${rand}`,
            slug: `${slugify(`${data.title} ${data.company}`).slice(0, 90)}-${rand}`, lastSeenAt: new Date(), active: true, reviewStatus: 'pending',
        })
        notifyAdmin(`Job waiting for review: ${job.title}`, `<p><strong>${escapeHtml(job.title)}</strong> at ${escapeHtml(job.company)} needs review in Admin &gt; Hiring.</p>`)
        return res.status(201).json({ job: jobView(job) })
    } catch (e) { return res.status(500).json({ message: 'Could not save the job.' }) }
}

// PUT /api/employers/jobs/:id - any content change goes back to review
export const updateJob = async (req, res) => {
    try {
        if (!idOk(req.params.id)) return res.status(404).json({ message: 'Job not found' })
        const job = await Job.findOne({ _id: req.params.id, employerId: req.employer._id })
        if (!job) return res.status(404).json({ message: 'Job not found' })
        let data
        try { data = readJob(req.body || {}, req.employer) } catch (e) { return res.status(400).json({ message: e.message }) }
        Object.assign(job, data, { reviewStatus: 'pending', reviewNote: '' })
        await job.save()
        notifyAdmin(`Job waiting for review: ${job.title}`, `<p>${escapeHtml(job.title)} at ${escapeHtml(job.company)} was edited and needs review in Admin &gt; Hiring.</p>`)
        return res.status(200).json({ job: jobView(job) })
    } catch (e) { return res.status(500).json({ message: 'Could not update the job.' }) }
}

// PATCH /api/employers/jobs/:id { active }  - close or reopen (no re-review needed)
export const setJobActive = async (req, res) => {
    try {
        if (!idOk(req.params.id)) return res.status(404).json({ message: 'Job not found' })
        const job = await Job.findOneAndUpdate({ _id: req.params.id, employerId: req.employer._id }, { $set: { active: Boolean(req.body?.active) } }, { returnDocument: 'after' })
        if (!job) return res.status(404).json({ message: 'Job not found' })
        return res.status(200).json({ job: jobView(job) })
    } catch (e) { return res.status(500).json({ message: 'Could not update the job.' }) }
}

// DELETE /api/employers/jobs/:id
export const deleteJob = async (req, res) => {
    try {
        if (!idOk(req.params.id)) return res.status(404).json({ message: 'Job not found' })
        const j = await Job.findOneAndDelete({ _id: req.params.id, employerId: req.employer._id })
        if (!j) return res.status(404).json({ message: 'Job not found' })
        return res.status(200).json({ message: 'Deleted' })
    } catch (e) { return res.status(500).json({ message: 'Could not delete the job.' }) }
}

// ---------------- Admin ----------------

// GET /api/admin/hiring/stats
export const hiringStats = async (req, res) => {
    try {
        const [pendingEmployers, approvedEmployers, pendingJobs, talentTotal, talentAvailable, requests] = await Promise.all([
            Employer.countDocuments({ status: 'pending' }), Employer.countDocuments({ status: 'approved' }),
            Job.countDocuments({ sourceType: 'employer', reviewStatus: 'pending' }),
            TalentProfile.countDocuments({}), TalentProfile.countDocuments({ available: true }), ContactRequest.countDocuments({}),
        ])
        return res.status(200).json({ pendingEmployers, approvedEmployers, pendingJobs, talentTotal, talentAvailable, requests })
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

// GET /api/admin/hiring/employers?status=pending|approved|rejected|suspended|all
export const adminEmployers = async (req, res) => {
    try {
        const status = ['pending', 'approved', 'rejected', 'suspended'].includes(req.query.status) ? req.query.status : undefined
        const rows = await Employer.find(status ? { status } : {}).sort({ createdAt: -1 }).limit(200).lean()
        const users = await User.find({ _id: { $in: rows.map((r) => r.userId) } }).select('email name').lean()
        const U = Object.fromEntries(users.map((u) => [String(u._id), u]))
        const [openJobs, sent] = await Promise.all([
            Job.aggregate([{ $match: { employerId: { $in: rows.map((r) => r._id) }, active: true } }, { $group: { _id: '$employerId', n: { $sum: 1 } } }]),
            ContactRequest.aggregate([{ $match: { employerId: { $in: rows.map((r) => r._id) } } }, { $group: { _id: '$employerId', n: { $sum: 1 } } }]),
        ])
        const OJ = Object.fromEntries(openJobs.map((x) => [String(x._id), x.n])); const S = Object.fromEntries(sent.map((x) => [String(x._id), x.n]))
        return res.status(200).json({ employers: rows.map((e) => ({ ...empView(e), accountEmail: U[String(e.userId)]?.email, accountName: U[String(e.userId)]?.name, domainMatch: e.website ? domainMatches(e.workEmail, e.website) : null, personalEmail: isFreeEmail(e.workEmail), noFeeConfirmed: Boolean(e.noFeeConfirmedAt), openJobs: OJ[String(e._id)] || 0, requestsSent: S[String(e._id)] || 0 })) })
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

// PATCH /api/admin/hiring/employers/:id { status, note }
export const reviewEmployer = async (req, res) => {
    try {
        if (!idOk(req.params.id)) return res.status(404).json({ message: 'Company not found' })
        const status = req.body?.status
        if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) return res.status(400).json({ message: 'Invalid status' })
        const note = str(req.body?.note, 500)
        const emp = await Employer.findByIdAndUpdate(req.params.id, { $set: { status, reviewNote: status === 'approved' ? '' : note, reviewedAt: new Date() } }, { returnDocument: 'after' })
        if (!emp) return res.status(404).json({ message: 'Company not found' })
        if (status === 'suspended') await Job.updateMany({ employerId: emp._id }, { $set: { hidden: true } })
        if (status === 'approved') await Job.updateMany({ employerId: emp._id }, { $set: { hidden: false } })
        const user = await User.findById(emp.userId).select('email')
        if (status === 'approved') notify(user?.email, 'Your company is approved on Prime Resume AI', `<h3>You're approved</h3><p>${escapeHtml(emp.companyName)} can now find available candidates and post jobs.</p><p><a href="${CLIENT_URL()}/app/hire">Open your hiring dashboard</a></p>`)
        else if (status === 'rejected') notify(user?.email, 'Your company application on Prime Resume AI', `<p>We could not approve ${escapeHtml(emp.companyName)} yet.</p>${note ? `<p>${escapeHtml(note)}</p>` : ''}<p>You can update your details and apply again from your <a href="${CLIENT_URL()}/app/hire">hiring page</a>.</p>`)
        return res.status(200).json({ employer: empView(emp) })
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

// GET /api/admin/hiring/jobs?status=pending|approved|rejected|all
export const adminEmployerJobs = async (req, res) => {
    try {
        const st = ['pending', 'approved', 'rejected'].includes(req.query.status) ? req.query.status : undefined
        const rows = await Job.find({ sourceType: 'employer', ...(st ? { reviewStatus: st } : {}) }).sort({ createdAt: -1 }).limit(200).lean()
        return res.status(200).json({ jobs: rows.map((j) => ({ ...jobView(j), company: j.company })) })
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

// PATCH /api/admin/hiring/jobs/:id { status: approved|rejected, note }
export const reviewJob = async (req, res) => {
    try {
        if (!idOk(req.params.id)) return res.status(404).json({ message: 'Job not found' })
        const status = req.body?.status
        if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' })
        const job = await Job.findOne({ _id: req.params.id, sourceType: 'employer' })
        if (!job) return res.status(404).json({ message: 'Job not found' })
        job.reviewStatus = status; job.reviewNote = status === 'approved' ? '' : str(req.body?.note, 500)
        if (status === 'approved') { job.postedAt = new Date(); job.hidden = false }
        await job.save()
        const emp = await Employer.findById(job.employerId); const user = emp && await User.findById(emp.userId).select('email')
        if (user) notify(user.email, status === 'approved' ? `Your job is live: ${job.title}` : `Your job needs changes: ${job.title}`,
            status === 'approved' ? `<p><strong>${escapeHtml(job.title)}</strong> is now live on <a href="${CLIENT_URL()}/jobs/${job.slug}">Prime Resume AI Jobs</a>.</p>` : `<p><strong>${escapeHtml(job.title)}</strong> was not approved.</p>${job.reviewNote ? `<p>${escapeHtml(job.reviewNote)}</p>` : ''}<p>Edit it in your <a href="${CLIENT_URL()}/app/hire">hiring dashboard</a> and it will be reviewed again.</p>`)
        return res.status(200).json({ job: jobView(job) })
    } catch (e) { return res.status(500).json({ message: e.message }) }
}
