import { sendEmail } from '../thirdPartyAPIs/userEmail.js'
export const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
export const CLIENT_URL = () => (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')

// Best-effort email: the action is already saved, so a mail problem must never fail the request.
export const notify = (to, subject, html) => {
    if (!to || !process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) return Promise.resolve(false)
    return sendEmail(to, '', subject, html).then(() => true).catch((e) => { console.warn('[notify] email failed:', e.message); return false })
}
export const notifyAdmin = (subject, html) => notify(process.env.ADMIN_EMAIL, subject, html)
