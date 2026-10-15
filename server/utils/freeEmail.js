// Personal mailbox providers. A company signing up must use an address on its own domain.
const FREE = new Set(['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.in', 'ymail.com', 'hotmail.com', 'outlook.com', 'live.com', 'msn.com',
    'rediffmail.com', 'icloud.com', 'me.com', 'aol.com', 'proton.me', 'protonmail.com', 'gmx.com', 'mail.com', 'zoho.com', 'yandex.com', 'rocketmail.com'])
export const emailDomain = (e) => String(e || '').split('@')[1]?.toLowerCase().trim() || ''
export const isFreeEmail = (e) => FREE.has(emailDomain(e))
export const hostOf = (url) => { try { return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname.replace(/^www\./, '').toLowerCase() } catch { return '' } }
// true when the work email is on the company's website domain (or a sub-domain of it)
export const domainMatches = (email, website) => { const d = emailDomain(email), h = hostOf(website); return !!d && !!h && (d === h || d.endsWith('.' + h) || h.endsWith('.' + d)) }
