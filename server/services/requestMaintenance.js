import ContactRequest from '../models/ContactRequest.js'
import TalentProfile from '../models/TalentProfile.js'
import Employer from '../models/Employer.js'
import User from '../models/User.js'
import { notify, escapeHtml, CLIENT_URL } from '../utils/notify.js'

const DAY = 864e5
const days = (name, fallback) => Math.max(0.0001, Number(process.env[name]) || fallback)

// Runs hourly:
//  - a request nobody answered for REQUEST_REMIND_DAYS (3) gets ONE reminder email to the seeker (if they allow reminders)
//  - a request nobody answered for REQUEST_EXPIRE_DAYS (30) expires, and the company is told
// Each request is "claimed" with an atomic update before any email, so a request is never emailed twice.
export const runRequestMaintenance = async (now = Date.now()) => {
    const remindAt = new Date(now - days('REQUEST_REMIND_DAYS', 3) * DAY)
    const expireAt = new Date(now - days('REQUEST_EXPIRE_DAYS', 30) * DAY)
    const out = { reminded: 0, expired: 0 }

    // expire first, so an old request is never reminded about
    const old = await ContactRequest.find({ status: 'pending', createdAt: { $lte: expireAt } }).limit(200)
    for (const r of old) {
        const claimed = await ContactRequest.findOneAndUpdate({ _id: r._id, status: 'pending' }, { $set: { status: 'expired', respondedAt: new Date(now) } }, { returnDocument: 'after' })
        if (!claimed) continue
        out.expired++
        const [emp, t] = await Promise.all([Employer.findById(r.employerId), TalentProfile.findById(r.talentId)])
        if (!emp) continue
        const to = [...new Set([emp.workEmail, (await User.findById(emp.userId))?.email].filter(Boolean))]
        const html = `<p>Your request to <strong>${escapeHtml(t?.headline || 'a candidate')}</strong> was not answered within ${Math.round(days('REQUEST_EXPIRE_DAYS', 30))} days, so it has expired.</p><p>You can send a new request any time from your <a href="${CLIENT_URL()}/app/hire">hiring dashboard</a>.</p>`
        await Promise.all(to.map((x) => notify(x, 'Your request to a candidate expired', html)))
    }

    const due = await ContactRequest.find({ status: 'pending', createdAt: { $lte: remindAt }, remindedAt: { $exists: false } }).limit(200)
    for (const r of due) {
        const claimed = await ContactRequest.findOneAndUpdate({ _id: r._id, status: 'pending', remindedAt: { $exists: false } }, { $set: { remindedAt: new Date(now) } })
        if (!claimed) continue
        const t = await TalentProfile.findById(r.talentId)
        if (!t || t.reminders === false) continue
        const [user, emp] = await Promise.all([User.findById(t.userId).select('email name'), Employer.findById(r.employerId).select('companyName')])
        if (!user) continue
        out.reminded++
        await notify(user.email, `${emp?.companyName || 'A company'} is still waiting to hear from you`, `<h3>A company is waiting for your answer</h3>
<p>Hi ${escapeHtml(user.name)}, ${escapeHtml(emp?.companyName || 'a company')} sent you a message a few days ago and has not heard back.</p>
<p>Your contact details stay private unless you accept. You can accept, decline or block them in one click.</p>
<p><a href="${CLIENT_URL()}/app/open-to-work">Review the request</a></p>
<p style="color:#666;font-size:12px">You can turn these reminders off in your Open to work profile.</p>`)
    }
    return out
}

export const startRequestMaintenance = () => {
    if (process.env.REQUEST_MAINTENANCE === 'false') return
    const run = () => runRequestMaintenance().then((r) => (r.reminded || r.expired) && console.log(`[requests] reminded ${r.reminded}, expired ${r.expired}`)).catch((e) => console.error('[requests] maintenance failed:', e.message))
    setTimeout(run, 120 * 1000).unref?.()
    setInterval(run, 3600 * 1000).unref?.()
}
