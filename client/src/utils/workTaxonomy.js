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
  ['AF', 'Afghanistan', 'AFN'], ['AL', 'Albania', 'ALL'], ['DZ', 'Algeria', 'DZD'], ['AD', 'Andorra', 'EUR'],
  ['AO', 'Angola', 'AOA'], ['AR', 'Argentina', 'ARS'], ['AM', 'Armenia', 'AMD'], ['AU', 'Australia', 'AUD'],
  ['AT', 'Austria', 'EUR'], ['AZ', 'Azerbaijan', 'AZN'], ['BS', 'Bahamas', 'BSD'], ['BH', 'Bahrain', 'BHD'],
  ['BD', 'Bangladesh', 'BDT'], ['BB', 'Barbados', 'BBD'], ['BY', 'Belarus', 'BYN'], ['BE', 'Belgium', 'EUR'],
  ['BZ', 'Belize', 'BZD'], ['BJ', 'Benin', 'XOF'], ['BT', 'Bhutan', 'BTN'], ['BO', 'Bolivia', 'BOB'],
  ['BA', 'Bosnia and Herzegovina', 'BAM'], ['BW', 'Botswana', 'BWP'], ['BR', 'Brazil', 'BRL'], ['BN', 'Brunei', 'BND'],
  ['BG', 'Bulgaria', 'BGN'], ['BF', 'Burkina Faso', 'XOF'], ['BI', 'Burundi', 'BIF'], ['KH', 'Cambodia', 'KHR'],
  ['CM', 'Cameroon', 'XAF'], ['CA', 'Canada', 'CAD'], ['CV', 'Cape Verde', 'CVE'], ['CF', 'Central African Republic', 'XAF'],
  ['TD', 'Chad', 'XAF'], ['CL', 'Chile', 'CLP'], ['CN', 'China', 'CNY'], ['CO', 'Colombia', 'COP'],
  ['KM', 'Comoros', 'KMF'], ['CG', 'Congo', 'XAF'], ['CR', 'Costa Rica', 'CRC'], ['CI', "Cote d'Ivoire", 'XOF'],
  ['HR', 'Croatia', 'EUR'], ['CU', 'Cuba', 'CUP'], ['CY', 'Cyprus', 'EUR'], ['CZ', 'Czechia', 'CZK'],
  ['CD', 'Democratic Republic of the Congo', 'CDF'], ['DK', 'Denmark', 'DKK'], ['DJ', 'Djibouti', 'DJF'], ['DO', 'Dominican Republic', 'DOP'],
  ['EC', 'Ecuador', 'USD'], ['EG', 'Egypt', 'EGP'], ['SV', 'El Salvador', 'USD'], ['GQ', 'Equatorial Guinea', 'XAF'],
  ['ER', 'Eritrea', 'ERN'], ['EE', 'Estonia', 'EUR'], ['SZ', 'Eswatini', 'SZL'], ['ET', 'Ethiopia', 'ETB'],
  ['FJ', 'Fiji', 'FJD'], ['FI', 'Finland', 'EUR'], ['FR', 'France', 'EUR'], ['GA', 'Gabon', 'XAF'],
  ['GM', 'Gambia', 'GMD'], ['GE', 'Georgia', 'GEL'], ['DE', 'Germany', 'EUR'], ['GH', 'Ghana', 'GHS'],
  ['GR', 'Greece', 'EUR'], ['GT', 'Guatemala', 'GTQ'], ['GN', 'Guinea', 'GNF'], ['GW', 'Guinea-Bissau', 'XOF'],
  ['GY', 'Guyana', 'GYD'], ['HT', 'Haiti', 'HTG'], ['HN', 'Honduras', 'HNL'], ['HK', 'Hong Kong', 'HKD'],
  ['HU', 'Hungary', 'HUF'], ['IS', 'Iceland', 'ISK'], ['IN', 'India', 'INR'], ['ID', 'Indonesia', 'IDR'],
  ['IR', 'Iran', 'IRR'], ['IQ', 'Iraq', 'IQD'], ['IE', 'Ireland', 'EUR'], ['IL', 'Israel', 'ILS'],
  ['IT', 'Italy', 'EUR'], ['JM', 'Jamaica', 'JMD'], ['JP', 'Japan', 'JPY'], ['JO', 'Jordan', 'JOD'],
  ['KZ', 'Kazakhstan', 'KZT'], ['KE', 'Kenya', 'KES'], ['KW', 'Kuwait', 'KWD'], ['KG', 'Kyrgyzstan', 'KGS'],
  ['LA', 'Laos', 'LAK'], ['LV', 'Latvia', 'EUR'], ['LB', 'Lebanon', 'LBP'], ['LS', 'Lesotho', 'LSL'],
  ['LR', 'Liberia', 'LRD'], ['LY', 'Libya', 'LYD'], ['LT', 'Lithuania', 'EUR'], ['LU', 'Luxembourg', 'EUR'],
  ['MO', 'Macao', 'MOP'], ['MG', 'Madagascar', 'MGA'], ['MW', 'Malawi', 'MWK'], ['MY', 'Malaysia', 'MYR'],
  ['MV', 'Maldives', 'MVR'], ['ML', 'Mali', 'XOF'], ['MT', 'Malta', 'EUR'], ['MR', 'Mauritania', 'MRU'],
  ['MU', 'Mauritius', 'MUR'], ['MX', 'Mexico', 'MXN'], ['MD', 'Moldova', 'MDL'], ['MN', 'Mongolia', 'MNT'],
  ['ME', 'Montenegro', 'EUR'], ['MA', 'Morocco', 'MAD'], ['MZ', 'Mozambique', 'MZN'], ['MM', 'Myanmar', 'MMK'],
  ['NA', 'Namibia', 'NAD'], ['NP', 'Nepal', 'NPR'], ['NL', 'Netherlands', 'EUR'], ['NZ', 'New Zealand', 'NZD'],
  ['NI', 'Nicaragua', 'NIO'], ['NE', 'Niger', 'XOF'], ['NG', 'Nigeria', 'NGN'], ['MK', 'North Macedonia', 'MKD'],
  ['NO', 'Norway', 'NOK'], ['OM', 'Oman', 'OMR'], ['PK', 'Pakistan', 'PKR'], ['PS', 'Palestine', 'ILS'],
  ['PA', 'Panama', 'PAB'], ['PG', 'Papua New Guinea', 'PGK'], ['PY', 'Paraguay', 'PYG'], ['PE', 'Peru', 'PEN'],
  ['PH', 'Philippines', 'PHP'], ['PL', 'Poland', 'PLN'], ['PT', 'Portugal', 'EUR'], ['QA', 'Qatar', 'QAR'],
  ['RO', 'Romania', 'RON'], ['RU', 'Russia', 'RUB'], ['RW', 'Rwanda', 'RWF'], ['SA', 'Saudi Arabia', 'SAR'],
  ['SN', 'Senegal', 'XOF'], ['RS', 'Serbia', 'RSD'], ['SC', 'Seychelles', 'SCR'], ['SL', 'Sierra Leone', 'SLE'],
  ['SG', 'Singapore', 'SGD'], ['SK', 'Slovakia', 'EUR'], ['SI', 'Slovenia', 'EUR'], ['SO', 'Somalia', 'SOS'],
  ['ZA', 'South Africa', 'ZAR'], ['KR', 'South Korea', 'KRW'], ['SS', 'South Sudan', 'SSP'], ['ES', 'Spain', 'EUR'],
  ['LK', 'Sri Lanka', 'LKR'], ['SD', 'Sudan', 'SDG'], ['SR', 'Suriname', 'SRD'], ['SE', 'Sweden', 'SEK'],
  ['CH', 'Switzerland', 'CHF'], ['TW', 'Taiwan', 'TWD'], ['TJ', 'Tajikistan', 'TJS'], ['TZ', 'Tanzania', 'TZS'],
  ['TH', 'Thailand', 'THB'], ['TL', 'Timor-Leste', 'USD'], ['TG', 'Togo', 'XOF'], ['TT', 'Trinidad and Tobago', 'TTD'],
  ['TN', 'Tunisia', 'TND'], ['TR', 'Turkey', 'TRY'], ['TM', 'Turkmenistan', 'TMT'], ['UG', 'Uganda', 'UGX'],
  ['UA', 'Ukraine', 'UAH'], ['AE', 'United Arab Emirates', 'AED'], ['GB', 'United Kingdom', 'GBP'], ['US', 'United States', 'USD'],
  ['UY', 'Uruguay', 'UYU'], ['UZ', 'Uzbekistan', 'UZS'], ['VE', 'Venezuela', 'VES'], ['VN', 'Vietnam', 'VND'],
  ['YE', 'Yemen', 'YER'], ['ZM', 'Zambia', 'ZMW'], ['ZW', 'Zimbabwe', 'USD'],
  ['XX', 'Other country', 'USD'],
]
export const POPULAR = ['IN', 'US', 'GB', 'CA', 'AU', 'AE', 'NG', 'KE', 'ZA', 'SG']
export const countryName = (code) => COUNTRIES.find((c) => c[0] === code)?.[1] || code || ''
export const currencyFor = (code) => COUNTRIES.find((c) => c[0] === code)?.[2] || 'USD'
export const CURRENCIES = [...new Set([...COUNTRIES.map((c) => c[2]), 'EUR'])]
export const PAY_PER = [['day', 'per day'], ['hour', 'per hour'], ['week', 'per week'], ['month', 'per month'], ['year', 'per year']]
export const defaultPayPer = (cat) => (cat === 'daily_wage' ? 'day' : cat === 'skilled_trade' ? 'day' : cat === 'factory' ? 'month' : 'year')
export const AVAILABILITY = [['now', 'I can start now'], ['week', 'Within a week'], ['month', 'Within a month']]
export const availLabel = (v) => ({ now: 'Can start now', week: 'Can start within a week', month: 'Can start within a month' }[v] || '')
export const EMPLOYER_TYPES = [['company', 'Company / business'], ['factory', 'Factory / plant'], ['contractor', 'Contractor / site owner'], ['agency', 'Recruitment agency'], ['individual', 'Individual / household']]
export const JOB_TYPES_ALL = [['full-time', 'Full-time'], ['part-time', 'Part-time'], ['contract', 'Contract'], ['daily-wage', 'Daily wage'], ['temporary', 'Temporary / seasonal'], ['internship', 'Internship / apprentice']]

export const symbol = (cur) => ({ INR: '₹', GBP: '£', CAD: 'CA$', USD: '$', EUR: '€', AUD: 'A$', NZD: 'NZ$', SGD: 'S$', JPY: '¥' }[cur])
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
  US: ['OSHA 10 / OSHA 30 card', 'Forklift certification', 'CDL (commercial driver\'s licence)', 'Journeyman / trade licence', 'EPA 608', 'First aid / CPR', 'Welding certification (AWS)'],
  AU: ['White Card (construction induction)', 'Forklift licence', 'Trade qualification (Certificate III)', 'Driver licence (MR / HR / HC)', 'Working at heights', 'First aid', 'RSA / RSG'],
  GENERIC: ['Trade test certificate', "Driver's licence", 'Forklift licence', 'First aid', 'Safety training certificate', 'NVQ / vocational certificate', 'Technical college certificate'],
}
export const certsFor = (country) => CERTS[country] || CERTS.GENERIC
export const WORK_LANGS = ['English', 'Hindi', 'Punjabi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Urdu', 'Swahili', 'Yoruba', 'Hausa', 'Igbo', 'Twi', 'Zulu', 'Afrikaans', 'French', 'Arabic', 'Spanish', 'Portuguese', 'German', 'Chinese', 'Filipino', 'Indonesian', 'Nepali', 'Sinhala', 'Amharic', 'Somali', 'Russian', 'Turkish', 'Italian', 'Polish', 'Thai', 'Vietnamese', 'Malay']
export const PERKS = ['Accommodation', 'Food / meals', 'Transport', 'Safety gear (PPE)', 'Tools provided', 'Overtime pay', 'Insurance', 'Weekly payment', 'Daily payment']

// Best guess of the visitor's country: the time zone when it names one country, else the browser language (en-IN -> IN). They can change it.
const TZ = { Kolkata: 'IN', Calcutta: 'IN', London: 'GB', Dublin: 'IE', Dubai: 'AE', Riyadh: 'SA', Qatar: 'QA', Karachi: 'PK', Dhaka: 'BD', Kathmandu: 'NP', Colombo: 'LK', Manila: 'PH', Jakarta: 'ID', Kuala_Lumpur: 'MY', Singapore: 'SG', Bangkok: 'TH', Ho_Chi_Minh: 'VN', Tokyo: 'JP', Seoul: 'KR', Shanghai: 'CN', Hong_Kong: 'HK', Istanbul: 'TR', Tehran: 'IR', Baghdad: 'IQ', Kuwait: 'KW', Muscat: 'OM', Bahrain: 'BH', Amman: 'JO', Beirut: 'LB', Jerusalem: 'IL', Lagos: 'NG', Nairobi: 'KE', Accra: 'GH', Johannesburg: 'ZA', Dar_es_Salaam: 'TZ', Kampala: 'UG', Addis_Ababa: 'ET', Lusaka: 'ZM', Harare: 'ZW', Kigali: 'RW', Cairo: 'EG', Casablanca: 'MA', Algiers: 'DZ', Tunis: 'TN', Dakar: 'SN', Abidjan: 'CI', Douala: 'CM', Luanda: 'AO', Maputo: 'MZ', Gaborone: 'BW', Windhoek: 'NA', Blantyre: 'MW', Mogadishu: 'SO', Khartoum: 'SD', Paris: 'FR', Berlin: 'DE', Madrid: 'ES', Rome: 'IT', Amsterdam: 'NL', Brussels: 'BE', Vienna: 'AT', Zurich: 'CH', Stockholm: 'SE', Oslo: 'NO', Copenhagen: 'DK', Helsinki: 'FI', Warsaw: 'PL', Prague: 'CZ', Budapest: 'HU', Bucharest: 'RO', Athens: 'GR', Lisbon: 'PT', Kyiv: 'UA', Moscow: 'RU', Toronto: 'CA', Vancouver: 'CA', Edmonton: 'CA', Winnipeg: 'CA', Halifax: 'CA', Regina: 'CA', St_Johns: 'CA', Montreal: 'CA', Mexico_City: 'MX', Sao_Paulo: 'BR', Argentina: 'AR', Buenos_Aires: 'AR', Bogota: 'CO', Lima: 'PE', Santiago: 'CL', Sydney: 'AU', Melbourne: 'AU', Brisbane: 'AU', Perth: 'AU', Adelaide: 'AU', Auckland: 'NZ', New_York: 'US', Chicago: 'US', Denver: 'US', Los_Angeles: 'US', Phoenix: 'US', Anchorage: 'US', Honolulu: 'US' }
export const guessCountry = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    const fromTz = TZ[tz.split('/').pop()]
    if (fromTz) return fromTz
    const region = new Intl.Locale(navigator.language || '').region
    if (region && COUNTRIES.some((c) => c[0] === region)) return region
  } catch { /* ignore */ }
  return ''
}
