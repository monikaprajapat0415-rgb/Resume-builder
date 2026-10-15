// Client side of the shared vocabulary (see server/utils/workTaxonomy.js). Codes must match the server.

export const CATEGORIES = [
  { id: 'corporate', label: 'Office / corporate', short: 'Office', desc: 'IT, sales, finance, HR, admin, management', icon: '🏢' },
  { id: 'factory', label: 'Factory & warehouse', short: 'Factory', desc: 'Machine operator, packing, assembly, forklift, stores', icon: '🏭' },
  { id: 'skilled_trade', label: 'Skilled trade', short: 'Skilled trade', desc: 'Electrician, plumber, welder, carpenter, driver, mechanic', icon: '🔧' },
  { id: 'daily_wage', label: 'Daily wage / helper', short: 'Daily wage', desc: 'Site helper, loader, cleaner, security, farm and domestic work', icon: '👷' },
]
export const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || ''
export const catShort = (id) => CATEGORIES.find((c) => c.id === id)?.short || ''
export const isLabour = (id) => id && id !== 'corporate'

export const COUNTRIES = [
  ['IN', 'India', 'INR'], ['GB', 'United Kingdom', 'GBP'], ['CA', 'Canada', 'CAD'],
  ['NG', 'Nigeria', 'NGN'], ['KE', 'Kenya', 'KES'], ['GH', 'Ghana', 'GHS'], ['ZA', 'South Africa', 'ZAR'],
  ['TZ', 'Tanzania', 'TZS'], ['UG', 'Uganda', 'UGX'], ['ET', 'Ethiopia', 'ETB'], ['ZM', 'Zambia', 'ZMW'],
  ['ZW', 'Zimbabwe', 'USD'], ['RW', 'Rwanda', 'RWF'], ['EG', 'Egypt', 'EGP'], ['MA', 'Morocco', 'MAD'],
  ['XX', 'Other country', 'USD'],
]
export const countryName = (code) => COUNTRIES.find((c) => c[0] === code)?.[1] || code || ''
export const currencyFor = (code) => COUNTRIES.find((c) => c[0] === code)?.[2] || 'USD'
export const CURRENCIES = [...new Set([...COUNTRIES.map((c) => c[2]), 'EUR'])]
export const PAY_PER = [['day', 'per day'], ['hour', 'per hour'], ['week', 'per week'], ['month', 'per month'], ['year', 'per year']]
export const defaultPayPer = (cat) => (cat === 'daily_wage' ? 'day' : cat === 'skilled_trade' ? 'day' : cat === 'factory' ? 'month' : 'year')
export const AVAILABILITY = [['now', 'I can start now'], ['week', 'Within a week'], ['month', 'Within a month']]
export const availLabel = (v) => ({ now: 'Can start now', week: 'Can start within a week', month: 'Can start within a month' }[v] || '')
export const EMPLOYER_TYPES = [['company', 'Company / business'], ['factory', 'Factory / plant'], ['contractor', 'Contractor / site owner'], ['agency', 'Recruitment agency'], ['individual', 'Individual / household']]
export const JOB_TYPES_ALL = [['full-time', 'Full-time'], ['part-time', 'Part-time'], ['contract', 'Contract'], ['daily-wage', 'Daily wage'], ['temporary', 'Temporary / seasonal'], ['internship', 'Internship / apprentice']]

export const symbol = (cur) => ({ INR: '₹', GBP: '£', CAD: 'CA$', USD: '$', EUR: '€' }[cur])
export const money = (v, cur) => { const n = Math.round(v).toLocaleString('en-US'); const s = symbol(cur); return s ? `${s}${n}` : `${cur} ${n}` }
// "₹800 / day", "£18 - £22 / hour"
export const payText = ({ payMin, payMax, currency, payPer }) => {
  if (!(payMin > 0) && !(payMax > 0)) return ''
  const lo = payMin > 0 ? payMin : payMax, hi = payMax > 0 ? payMax : payMin
  return `${lo === hi ? money(lo, currency) : `${money(lo, currency)} - ${money(hi, currency)}`}${payPer ? ` / ${payPer}` : ''}`
}

// Common jobs people pick with one tap (headline / job title).
export const TRADES = {
  factory: ['Machine operator', 'Assembly line worker', 'Packer', 'Warehouse worker', 'Forklift operator', 'Quality inspector', 'CNC operator', 'Production supervisor', 'Stores / inventory assistant', 'Loader / unloader', 'Welder (factory)', 'Maintenance technician'],
  skilled_trade: ['Electrician', 'Plumber', 'Welder', 'Carpenter', 'Painter', 'Mason / bricklayer', 'Tiler', 'Fitter', 'Mechanic', 'AC / HVAC technician', 'Driver', 'Crane / JCB operator', 'Roofer', 'Scaffolder', 'Plasterer', 'Tailor'],
  daily_wage: ['Construction helper', 'Mason helper', 'Loader', 'Cleaner', 'Security guard', 'Gardener', 'Farm worker', 'Cook / kitchen helper', 'Domestic helper', 'Delivery helper', 'Painter helper', 'General labour'],
}

// Tickets and licences people actually carry, by country. Shown as suggestions ("add only if you hold it").
export const CERTS = {
  IN: ['ITI certificate', 'NCVT / Skill India certificate', 'Driving licence (LMV)', 'Driving licence (HMV)', 'Electrician licence', 'Welding certificate', 'Forklift certificate', 'First aid', 'Safety training (NEBOSH / IOSH)'],
  GB: ['CSCS card', 'Gas Safe registered', 'NICEIC / electrical qualification', 'City & Guilds / NVQ', 'IPAF / PASMA', 'SIA licence', 'Forklift (RTITB)', 'Full UK driving licence', 'First aid at work', 'Working at height'],
  CA: ['Red Seal certificate', 'WHMIS', 'Working at heights', 'Forklift ticket', "Class 1 / 3 driver's licence", 'First aid / CPR', 'Provincial trade licence', 'H2S Alive', 'Valid driver\'s licence'],
  ZA: ['Trade test certificate (Red Seal)', 'Code 10 / 14 driver licence', 'PDP (professional driving permit)', 'Forklift licence', 'First aid', 'Safety / SHEQ training', 'N2 / N3 certificate'],
  AFRICA: ['Trade test certificate', "Driver's licence", 'Forklift licence', 'First aid', 'Safety training certificate', 'NVQ / vocational certificate', 'Technical college certificate'],
}
export const certsFor = (country) => CERTS[country] || (['NG', 'KE', 'GH', 'TZ', 'UG', 'ET', 'ZM', 'ZW', 'RW', 'EG', 'MA'].includes(country) ? CERTS.AFRICA : CERTS.IN)
export const WORK_LANGS = ['English', 'Hindi', 'Punjabi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Urdu', 'Swahili', 'Yoruba', 'Hausa', 'Igbo', 'Twi', 'Zulu', 'Afrikaans', 'French', 'Arabic']
export const PERKS = ['Accommodation', 'Food / meals', 'Transport', 'Safety gear (PPE)', 'Tools provided', 'Overtime pay', 'Insurance', 'Weekly payment', 'Daily payment']
