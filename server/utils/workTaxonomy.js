// Shared vocabulary for the Jobs / Hire features. The client has a matching file with labels and suggestions
// (client/src/utils/workTaxonomy.js). Keep the CODES in sync; the server validates against these lists.

export const CATEGORIES = ['corporate', 'factory', 'skilled_trade', 'daily_wage']
export const LABOUR_CATEGORIES = ['factory', 'skilled_trade', 'daily_wage']

// Every country (ISO 3166-1 alpha-2), with its usual currency. 'XX' = a country not listed.
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
// shown first in links and suggestions
export const POPULAR = ['IN', 'US', 'GB', 'CA', 'AU', 'AE', 'NG', 'KE', 'ZA', 'SG']
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
    const sym = { INR: '₹', GBP: '£', CAD: 'CA$', USD: '$', EUR: '€', AUD: 'A$', NZD: 'NZ$', SGD: 'S$', JPY: '¥' }[currency]
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
