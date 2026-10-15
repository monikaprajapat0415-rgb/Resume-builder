// Shared vocabulary for the Jobs / Hire features. The client has a matching file with labels and suggestions
// (client/src/utils/workTaxonomy.js). Keep the CODES in sync; the server validates against these lists.

export const CATEGORIES = ['corporate', 'factory', 'skilled_trade', 'daily_wage']
export const LABOUR_CATEGORIES = ['factory', 'skilled_trade', 'daily_wage']

// code, name, default currency
export const COUNTRIES = [
    ['IN', 'India', 'INR'], ['GB', 'United Kingdom', 'GBP'], ['CA', 'Canada', 'CAD'],
    ['NG', 'Nigeria', 'NGN'], ['KE', 'Kenya', 'KES'], ['GH', 'Ghana', 'GHS'], ['ZA', 'South Africa', 'ZAR'],
    ['TZ', 'Tanzania', 'TZS'], ['UG', 'Uganda', 'UGX'], ['ET', 'Ethiopia', 'ETB'], ['ZM', 'Zambia', 'ZMW'],
    ['ZW', 'Zimbabwe', 'USD'], ['RW', 'Rwanda', 'RWF'], ['EG', 'Egypt', 'EGP'], ['MA', 'Morocco', 'MAD'],
    ['XX', 'Other country', 'USD'],
]
export const COUNTRY_CODES = COUNTRIES.map((c) => c[0])
export const CURRENCIES = [...new Set([...COUNTRIES.map((c) => c[2]), 'USD', 'EUR'])]
export const PAY_PER = ['day', 'hour', 'week', 'month', 'year']
export const AVAILABILITY = ['now', 'week', 'month']          // can start: immediately / within a week / within a month
export const WORK_RIGHT = ['yes', 'need_sponsorship']           // self-declared, shown to companies as such
export const EMPLOYER_TYPES = ['company', 'factory', 'contractor', 'agency', 'individual']
export const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'temporary', 'daily-wage']

// Rough level from years, for profiles where the person never picks a "level" (trades, daily wage).
export const levelFromYears = (y) => (y >= 8 ? 'senior' : y >= 4 ? 'mid' : y >= 1 ? 'junior' : 'fresher')

// "₹800 / day", "£18 - £22 / hour", "KES 1,500 / day". Used for the salary text on jobs and candidate cards.
export const formatPay = ({ payMin, payMax, currency, payPer }) => {
    if (!(payMin > 0) && !(payMax > 0)) return ''
    const sym = { INR: '₹', GBP: '£', CAD: 'CA$', USD: '$', EUR: '€' }[currency]
    const n = (v) => Math.round(v).toLocaleString('en-US')
    const money = (v) => (sym ? `${sym}${n(v)}` : `${currency} ${n(v)}`)
    const lo = payMin > 0 ? payMin : payMax, hi = payMax > 0 ? payMax : payMin
    return `${lo === hi ? money(lo) : `${money(lo)} - ${money(hi)}`}${payPer ? ` / ${payPer}` : ''}`
}

// Best-guess category for jobs we import (they have no category field). Title + department only.
const RX = {
    daily_wage: /\b(daily wage|day labou?r|labou?rer|helper|loader|unloader|cleaner|sweeper|security guard|watchman|peon|gardener|farm (hand|worker)|domestic|househelp|house help|porter|janitor|general worker|construction (worker|helper))\b/i,
    skilled_trade: /\b(electrician|plumber|welder|carpenter|painter|mason|bricklayer|plasterer|tiler|fitter|mechanic|technician|hvac|roofer|scaffolder|joiner|fabricator|machinist|driver|crane operator|excavator|heavy equipment|lineman|installer|boilermaker|pipefitter|glazier|tailor)\b/i,
    factory: /\b(factory|production (operator|worker|associate)|machine operator|assembly|assembler|packer|packing|warehouse|forklift|picker|quality inspector|cnc|operator|manufacturing|plant|shop ?floor|stores? (assistant|keeper)|line worker)\b/i,
}
export const inferCategory = (title = '', department = '') => {
    const text = `${title} ${department}`
    if (RX.skilled_trade.test(title)) return 'skilled_trade'
    if (RX.daily_wage.test(title)) return 'daily_wage'
    if (RX.factory.test(text)) return 'factory'
    return 'corporate'
}
