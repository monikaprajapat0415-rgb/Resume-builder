import TalentProfile from '../models/TalentProfile.js'
import ContactRequest from '../models/ContactRequest.js'
import Employer from '../models/Employer.js'
import Job from '../models/Job.js'
import User from '../models/User.js'
import { scrubPii, newPublicId, anonCard } from '../utils/talentPrivacy.js'
import { notify, escapeHtml, CLIENT_URL } from '../utils/notify.js'
import { CATEGORIES, COUNTRY_CODES, CURRENCIES, PAY_PER, AVAILABILITY, WORK_RIGHT, JOB_TYPES as ALL_JOB_TYPES, levelFromYears } from '../utils/workTaxonomy.js'

const LEVELS = ['fresher', 'junior', 'mid', 'senior', 'lead']
const JOB_TYPES = ALL_JOB_TYPES
const cleanList = (arr, n, len) => [...new Set((Array.isArray(arr) ? arr : []).map((x) => String(x || '').replace(/\s+/g, ' ').trim().slice(0, len)).filter(Boolean))].slice(0, n)
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const PAGE = 20
const DAILY_REQUESTS = 15

const cleanSkills = (arr) => {
    const seen = new Set(); const out = []
    for (const raw of Array.isArray(arr) ? arr : []) {
        const s = String(raw || '').replace(/\s+/g, ' ').trim().slice(0, 40)
        if (s && !seen.has(s.toLowerCase())) { seen.add(s.toLowerCase()); out.push(s) }
        if (out.length >= 25) break
    }
    return out
}

// the seeker's own view of their profile (includes phone, which companies never see)
const ownView = (t) => ({ ...anonCard(t), available: t.available, reminders: t.reminders !== false, phone: t.phone, blockedCount: (t.blockedEmployers || []).length })

// ---------------- Seeker ----------------

// GET /api/talent/me
export const getMyTalent = async (req, res) => {
    try {
        const t = await TalentProfile.findOne({ userId: req.userId })
        const pending = t ? await ContactRequest.countDocuments({ talentId: t._id, status: 'pending' }) : 0
        return res.status(200).json({ profile: t ? ownView(t) : null, pending })
    } catch (e) { return res.status(500).json({ message: 'Could not load your profile.' }) }
}

// PUT /api/talent/me  (creates or updates; `available` is the on/off switch)
export const saveMyTalent = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) return res.status(401).json({ message: 'Unauthorized' })
        if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email before listing yourself for companies.' })
        const b = req.body || {}
        const existing = await TalentProfile.findOne({ userId: req.userId })
        const set = {}
        if (b.category !== undefined || !existing) {
            if (!CATEGORIES.includes(b.category ?? 'corporate')) return res.status(400).json({ message: 'Choose the kind of work you do.' })
            set.category = b.category ?? 'corporate'
        }
        const category = set.category || existing?.category || 'corporate'
        if (b.headline !== undefined || !existing) {
            const headline = scrubPii(b.headline).slice(0, 100)
            if (headline.length < 2) return res.status(400).json({ message: category === 'corporate' ? 'Tell companies the role you are looking for, e.g. "Accounts Executive".' : 'Choose or type your job, e.g. "Electrician".' })
            set.headline = headline
        }
        if (b.country !== undefined || !existing) {
            const c = String(b.country ?? existing?.country ?? '').toUpperCase()
            if (!COUNTRY_CODES.includes(c)) return res.status(400).json({ message: 'Choose the country where you want to work.' })
            set.country = c
        }
        if (b.experienceYears !== undefined) { const n = Number(b.experienceYears); if (!(n >= 0 && n <= 50)) return res.status(400).json({ message: 'Years of experience must be between 0 and 50.' }); set.experienceYears = Math.round(n * 2) / 2 }
        if (b.level !== undefined) { if (!LEVELS.includes(b.level)) return res.status(400).json({ message: 'Choose your experience level.' }); set.level = b.level }
        else if (category !== 'corporate' && (set.experienceYears !== undefined || !existing)) set.level = levelFromYears(set.experienceYears ?? existing?.experienceYears ?? 0)   // trades: no level to pick, derive it
        if (b.skills !== undefined) { set.skills = cleanSkills(b.skills); if (!existing && category === 'corporate' && !set.skills.length) return res.status(400).json({ message: 'Add at least one skill.' }) }
        if (b.location !== undefined) set.location = scrubPii(b.location).slice(0, 100)
        if (b.remote !== undefined) set.remote = Boolean(b.remote)
        if (b.relocate !== undefined) set.relocate = Boolean(b.relocate)
        if (b.willingToTravel !== undefined) set.willingToTravel = Boolean(b.willingToTravel)
        if (b.ownTools !== undefined) set.ownTools = Boolean(b.ownTools)
        if (b.jobTypes !== undefined) set.jobTypes = (Array.isArray(b.jobTypes) ? b.jobTypes : []).filter((x) => JOB_TYPES.includes(x))
        if (b.expectedSalary !== undefined) set.expectedSalary = scrubPii(b.expectedSalary).slice(0, 60)
        if (b.payAmount !== undefined) {
            if (b.payAmount === '' || b.payAmount === null) { set.payAmount = null; set.payPer = ''; set.currency = '' }
            else {
                const n = Number(b.payAmount)
                if (!(n >= 0 && n <= 1e9)) return res.status(400).json({ message: 'Enter the pay you expect as a number.' })
                if (!PAY_PER.includes(b.payPer)) return res.status(400).json({ message: 'Choose per day, hour, week, month or year.' })
                if (!CURRENCIES.includes(b.currency)) return res.status(400).json({ message: 'Choose a currency.' })
                set.payAmount = n; set.payPer = b.payPer; set.currency = b.currency
            }
        }
        if (b.noticePeriod !== undefined) set.noticePeriod = scrubPii(b.noticePeriod).slice(0, 40)
        if (b.availability !== undefined) { if (b.availability && !AVAILABILITY.includes(b.availability)) return res.status(400).json({ message: 'Choose when you can start.' }); set.availability = b.availability || '' }
        if (b.workRight !== undefined) { if (b.workRight && !WORK_RIGHT.includes(b.workRight)) return res.status(400).json({ message: 'Invalid work permission option.' }); set.workRight = b.workRight || '' }
        if (b.languages !== undefined) set.languages = cleanList(b.languages, 8, 30)
        if (b.certifications !== undefined) set.certifications = cleanList(b.certifications.map?.(scrubPii) ?? [], 12, 60)
        if (b.summary !== undefined) set.summary = scrubPii(b.summary).slice(0, 600)
        if (b.phone !== undefined) { const p = String(b.phone || '').trim(); if (p && !/^[+\d][\d\s().-]{6,24}$/.test(p)) return res.status(400).json({ message: 'Enter a valid phone number or leave it empty.' }); set.phone = p }
        if (b.available !== undefined) set.available = Boolean(b.available)
        if (b.reminders !== undefined) set.reminders = Boolean(b.reminders)
        set.lastActiveAt = new Date()
        let t
        if (existing) t = await TalentProfile.findOneAndUpdate({ userId: req.userId }, { $set: set }, { returnDocument: 'after' })
        else {
            for (let i = 0; i < 5 && !t; i++) {
                try { t = await TalentProfile.create({ userId: req.userId, publicId: newPublicId(), available: true, ...set }) } catch (e) { if (e.code !== 11000 || i === 4) throw e }
            }
        }
        return res.status(200).json({ profile: ownView(t) })
    } catch (e) { return res.status(500).json({ message: 'Could not save your profile.' }) }
}

// DELETE /api/talent/me - removes the profile; open requests are declined
export const deleteMyTalent = async (req, res) => {
    try {
        const t = await TalentProfile.findOneAndDelete({ userId: req.userId })
        if (t) await ContactRequest.updateMany({ talentId: t._id, status: 'pending' }, { $set: { status: 'declined', respondedAt: new Date() } })
        return res.status(200).json({ message: 'Profile removed' })
    } catch (e) { return res.status(500).json({ message: 'Could not remove your profile.' }) }
}

// GET /api/talent/me/requests
export const myRequests = async (req, res) => {
    try {
        const t = await TalentProfile.findOne({ userId: req.userId })
        if (!t) return res.status(200).json({ requests: [] })
        const reqs = await ContactRequest.find({ talentId: t._id }).sort({ createdAt: -1 }).limit(100).lean()
        const [emps, jobs] = await Promise.all([
            Employer.find({ _id: { $in: reqs.map((r) => r.employerId) } }).select('companyName website industry size location about contactName contactRole status').lean(),
            Job.find({ _id: { $in: reqs.map((r) => r.jobId).filter(Boolean) } }).select('title slug').lean(),
        ])
        const E = Object.fromEntries(emps.map((e) => [String(e._id), e])); const J = Object.fromEntries(jobs.map((j) => [String(j._id), j]))
        return res.status(200).json({
            requests: reqs.map((r) => {
                const e = E[String(r.employerId)]
                return {
                    id: r._id, status: r.status, message: r.message, reply: r.reply, createdAt: r.createdAt, respondedAt: r.respondedAt,
                    company: e ? { name: e.companyName, website: e.website, industry: e.industry, size: e.size, location: e.location, about: e.about, contactName: e.contactName, contactRole: e.contactRole } : null,
                    job: r.jobId && J[String(r.jobId)] ? { title: J[String(r.jobId)].title, slug: J[String(r.jobId)].slug } : null,
                    shared: r.status === 'accepted' ? r.sharedContact : undefined,
                }
            }),
        })
    } catch (e) { return res.status(500).json({ message: 'Could not load requests.' }) }
}

// POST /api/talent/me/requests/:id/respond { action: 'accept'|'decline'|'block', reply, shareEmail, email, sharePhone, phone }
export const respondRequest = async (req, res) => {
    try {
        const t = await TalentProfile.findOne({ userId: req.userId })
        if (!t || !/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(404).json({ message: 'Request not found' })
        const r = await ContactRequest.findOne({ _id: req.params.id, talentId: t._id })
        if (!r) return res.status(404).json({ message: 'Request not found' })
        if (r.status === 'expired') return res.status(409).json({ message: 'This request expired because it was not answered in time.' })
        if (r.status !== 'pending') return res.status(409).json({ message: 'You already responded to this request.' })
        const { action } = req.body || {}
        const reply = scrubPii(req.body?.reply).slice(0, 600)
        const emp = await Employer.findById(r.employerId)
        if (action === 'decline' || action === 'block') {
            r.status = 'declined'; r.reply = reply; r.respondedAt = new Date(); await r.save()
            if (action === 'block') await TalentProfile.updateOne({ _id: t._id }, { $addToSet: { blockedEmployers: r.employerId } })
            return res.status(200).json({ status: 'declined', blocked: action === 'block' })
        }
        if (action !== 'accept') return res.status(400).json({ message: 'Choose accept or decline.' })
        const user = await User.findById(req.userId)
        const shareEmail = req.body?.shareEmail !== false
        const sharePhone = Boolean(req.body?.sharePhone)
        const email = shareEmail ? String(req.body?.email || user.email).trim() : ''
        const phone = sharePhone ? String(req.body?.phone || t.phone || '').trim() : ''
        if (shareEmail && !EMAIL_RX.test(email)) return res.status(400).json({ message: 'Enter a valid email to share.' })
        if (sharePhone && !/^[+\d][\d\s().-]{6,24}$/.test(phone)) return res.status(400).json({ message: 'Enter a valid phone number to share.' })
        if (!email && !phone) return res.status(400).json({ message: 'Share at least an email or a phone number so the company can reach you.' })
        r.status = 'accepted'; r.reply = reply; r.respondedAt = new Date()
        r.sharedContact = { name: user.name, email, phone, whatsapp: Boolean(phone && req.body?.whatsapp) }
        await r.save()
        if (emp) {
            const to = [...new Set([emp.workEmail, (await User.findById(emp.userId))?.email].filter(Boolean))]
            const html = `<h3>${escapeHtml(t.headline)} accepted your request</h3>
<p>Thanks for reaching out through Prime Resume AI. Here is how to contact them:</p>
<p><strong>${escapeHtml(user.name)}</strong>${email ? `<br>Email: ${escapeHtml(email)}` : ''}${phone ? `<br>Phone: ${escapeHtml(phone)}${req.body?.whatsapp ? ' (WhatsApp)' : ''}` : ''}</p>
${reply ? `<p>Their note: ${escapeHtml(reply)}</p>` : ''}<p>You can also see this in your <a href="${CLIENT_URL()}/app/hire">hiring dashboard</a>.</p>`
            await Promise.all(to.map((x) => notify(x, `${t.headline} accepted your request`, html)))
        }
        return res.status(200).json({ status: 'accepted' })
    } catch (e) { return res.status(500).json({ message: 'Could not save your response.' }) }
}

// ---------------- Company side (route-level `needEmployer` loads req.employer) ----------------

// GET /api/employers/talent?q=&skills=a,b&location=&level=&remote=1&minExp=&jobType=&page=
export const searchTalent = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1)
        const filter = { available: true, userId: { $ne: req.employer.userId }, blockedEmployers: { $ne: req.employer._id } }
        const and = []
        if (req.query.q && String(req.query.q).trim()) for (const w of String(req.query.q).trim().split(/\s+/).slice(0, 5)) { const rx = new RegExp(esc(w.slice(0, 40)), 'i'); and.push({ $or: [{ headline: rx }, { skills: rx }, { certifications: rx }, { summary: rx }] }) }
        const skills = String(req.query.skills || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 8)
        for (const sk of skills) and.push({ skills: new RegExp(`^${esc(sk.slice(0, 40))}$`, 'i') })   // every listed skill must be present
        if (req.query.location && String(req.query.location).trim()) { const rx = new RegExp(esc(String(req.query.location).trim().slice(0, 60)), 'i'); and.push({ $or: [{ location: rx }, { relocate: true }, { remote: true }, { willingToTravel: true }] }) }
        if (CATEGORIES.includes(req.query.category)) filter.category = req.query.category
        if (COUNTRY_CODES.includes(String(req.query.country || '').toUpperCase())) filter.country = String(req.query.country).toUpperCase()
        if (req.query.availableNow === '1') filter.availability = 'now'
        if (req.query.workRight === '1') filter.workRight = 'yes'
        if (req.query.travel === '1') filter.willingToTravel = true
        if (LEVELS.includes(req.query.level)) filter.level = req.query.level
        if (req.query.remote === '1') filter.remote = true
        if (JOB_TYPES.includes(req.query.jobType)) filter.jobTypes = req.query.jobType
        if (req.query.minExp !== undefined && req.query.minExp !== '' && !Number.isNaN(Number(req.query.minExp))) filter.experienceYears = { $gte: Number(req.query.minExp) }
        if (and.length) filter.$and = and
        const [rows, total] = await Promise.all([
            TalentProfile.find(filter).sort({ updatedAt: -1 }).skip((page - 1) * PAGE).limit(PAGE).lean(),
            TalentProfile.countDocuments(filter),
        ])
        const mine = await ContactRequest.find({ employerId: req.employer._id, talentId: { $in: rows.map((r) => r._id) } }).sort({ createdAt: 1 }).select('talentId status').lean()
        const state = {}; mine.forEach((m) => { state[String(m.talentId)] = m.status })
        return res.status(200).json({ talent: rows.map((r) => ({ ...anonCard(r), requestStatus: state[String(r._id)] || null })), total, page, pages: Math.max(1, Math.ceil(total / PAGE)) })
    } catch (e) { return res.status(500).json({ message: 'Could not search candidates.' }) }
}

// POST /api/employers/talent/:publicId/contact { message, jobId }
export const contactTalent = async (req, res) => {
    try {
        const emp = req.employer
        const t = await TalentProfile.findOne({ publicId: String(req.params.publicId).slice(0, 20), available: true })
        if (!t || String(t.userId) === String(emp.userId) || (t.blockedEmployers || []).some((x) => String(x) === String(emp._id))) return res.status(404).json({ message: 'This candidate is no longer available.' })
        const message = String(req.body?.message || '').trim()
        if (message.length < 30) return res.status(400).json({ message: 'Write a short note (at least 30 characters) about the role and why you are reaching out.' })
        if (message.length > 1200) return res.status(400).json({ message: 'Keep your message under 1200 characters.' })
        const recent = await ContactRequest.find({ employerId: emp._id, talentId: t._id }).sort({ createdAt: -1 }).limit(1).lean()
        if (recent[0]?.status === 'pending') return res.status(409).json({ message: 'You already sent this candidate a request. Wait for their reply.' })
        if (recent[0] && !['withdrawn', 'expired'].includes(recent[0].status) && Date.now() - new Date(recent[0].createdAt).getTime() < 30 * 864e5) return res.status(409).json({ message: recent[0].status === 'accepted' ? 'This candidate already shared their contact details with you.' : 'This candidate declined recently. You can try again after 30 days.' })
        const today = await ContactRequest.countDocuments({ employerId: emp._id, createdAt: { $gte: new Date(Date.now() - 864e5) } })
        if (today >= DAILY_REQUESTS) return res.status(429).json({ message: `You can send up to ${DAILY_REQUESTS} requests a day. Please try again tomorrow.` })
        let jobId
        if (req.body?.jobId && /^[a-f\d]{24}$/i.test(String(req.body.jobId))) {
            const j = await Job.findOne({ _id: req.body.jobId, employerId: emp._id, reviewStatus: 'approved', active: true }).select('_id')
            if (!j) return res.status(400).json({ message: 'Choose one of your approved, open jobs.' })
            jobId = j._id
        }
        const r = await ContactRequest.create({ employerId: emp._id, talentId: t._id, jobId, message })
        const user = await User.findById(t.userId).select('email name')
        if (user) notify(user.email, `${emp.companyName} would like to talk to you`, `<h3>${escapeHtml(emp.companyName)} is interested in you</h3>
<p>Hi ${escapeHtml(user.name)}, a company found your "open to work" profile on Prime Resume AI and sent you a message:</p>
<blockquote style="border-left:3px solid #ccc;padding-left:10px;white-space:pre-wrap">${escapeHtml(message)}</blockquote>
<p>Your contact details stay private. They are shared only if you accept.</p>
<p><a href="${CLIENT_URL()}/app/open-to-work">Review the request</a></p>`)
        return res.status(201).json({ request: { id: r._id, status: r.status } })
    } catch (e) { return res.status(500).json({ message: 'Could not send your request.' }) }
}

// GET /api/employers/requests
export const sentRequests = async (req, res) => {
    try {
        const reqs = await ContactRequest.find({ employerId: req.employer._id }).sort({ createdAt: -1 }).limit(200).lean()
        const talents = await TalentProfile.find({ _id: { $in: reqs.map((r) => r.talentId) } }).lean()
        const T = Object.fromEntries(talents.map((t) => [String(t._id), t]))
        const jobs = await Job.find({ _id: { $in: reqs.map((r) => r.jobId).filter(Boolean) } }).select('title slug').lean()
        const J = Object.fromEntries(jobs.map((j) => [String(j._id), j]))
        return res.status(200).json({
            requests: reqs.map((r) => ({
                id: r._id, status: r.status, message: r.message, createdAt: r.createdAt, respondedAt: r.respondedAt,
                candidate: T[String(r.talentId)] ? anonCard(T[String(r.talentId)]) : null,
                job: r.jobId && J[String(r.jobId)] ? { title: J[String(r.jobId)].title, slug: J[String(r.jobId)].slug } : null,
                // visible only after the seeker accepted
                reply: r.status === 'accepted' || r.status === 'declined' ? r.reply : undefined,
                contact: r.status === 'accepted' ? r.sharedContact : undefined,
            })),
        })
    } catch (e) { return res.status(500).json({ message: 'Could not load your requests.' }) }
}

// POST /api/employers/requests/:id/withdraw
export const withdrawRequest = async (req, res) => {
    try {
        if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(404).json({ message: 'Request not found' })
        const r = await ContactRequest.findOneAndUpdate({ _id: req.params.id, employerId: req.employer._id, status: 'pending' }, { $set: { status: 'withdrawn', respondedAt: new Date() } }, { returnDocument: 'after' })
        if (!r) return res.status(404).json({ message: 'Request not found or already answered.' })
        return res.status(200).json({ status: 'withdrawn' })
    } catch (e) { return res.status(500).json({ message: 'Could not withdraw the request.' }) }
}
