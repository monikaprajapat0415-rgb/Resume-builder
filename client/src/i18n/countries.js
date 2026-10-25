// Countries offered in the dashboard dropdown. Each one has the languages we have dictionaries for
// (the first is the default) and a short, honest hint about what CVs usually contain there.
// hint: 'plain'  = leave out photo, date of birth and marital status (anti-discrimination norms)
//       'common' = a photo / date of birth / nationality are common but optional
//       'follow' = no strong rule, follow the job advert
export const LANGS = {
  en: { name: 'English', native: 'English', dir: 'ltr' },
  es: { name: 'Spanish', native: 'Español', dir: 'ltr' },
  fr: { name: 'French', native: 'Français', dir: 'ltr' },
  pt: { name: 'Portuguese', native: 'Português', dir: 'ltr' },
  ar: { name: 'Arabic', native: 'العربية', dir: 'rtl' },
}

export const COUNTRIES = [
  { code: 'IN', name: 'India', langs: ['en'], hint: 'follow' },
  { code: 'GB', name: 'United Kingdom', langs: ['en'], hint: 'plain' },
  { code: 'CA', name: 'Canada', langs: ['en', 'fr'], hint: 'plain' },
  { code: 'US', name: 'United States', langs: ['en'], hint: 'plain' },
  { code: 'NG', name: 'Nigeria', langs: ['en'], hint: 'follow' },
  { code: 'KE', name: 'Kenya', langs: ['en'], hint: 'follow' },
  { code: 'GH', name: 'Ghana', langs: ['en'], hint: 'follow' },
  { code: 'ZA', name: 'South Africa', langs: ['en'], hint: 'follow' },
  { code: 'UG', name: 'Uganda', langs: ['en'], hint: 'follow' },
  { code: 'TZ', name: 'Tanzania', langs: ['en'], hint: 'follow' },
  { code: 'ES', name: 'Spain', langs: ['es'], hint: 'common' },
  { code: 'MX', name: 'Mexico', langs: ['es'], hint: 'common' },
  { code: 'AR', name: 'Argentina', langs: ['es'], hint: 'follow' },
  { code: 'CO', name: 'Colombia', langs: ['es'], hint: 'follow' },
  { code: 'CL', name: 'Chile', langs: ['es'], hint: 'follow' },
  { code: 'PE', name: 'Peru', langs: ['es'], hint: 'follow' },
  { code: 'FR', name: 'France', langs: ['fr'], hint: 'follow' },
  { code: 'BE', name: 'Belgium', langs: ['fr', 'en'], hint: 'follow' },
  { code: 'CH', name: 'Switzerland', langs: ['fr', 'en'], hint: 'common' },
  { code: 'SN', name: 'Senegal', langs: ['fr'], hint: 'follow' },
  { code: 'CI', name: "Côte d'Ivoire", langs: ['fr'], hint: 'follow' },
  { code: 'CM', name: 'Cameroon', langs: ['fr', 'en'], hint: 'follow' },
  { code: 'CD', name: 'DR Congo', langs: ['fr'], hint: 'follow' },
  { code: 'BR', name: 'Brazil', langs: ['pt'], hint: 'follow' },
  { code: 'PT', name: 'Portugal', langs: ['pt'], hint: 'follow' },
  { code: 'AO', name: 'Angola', langs: ['pt'], hint: 'follow' },
  { code: 'MZ', name: 'Mozambique', langs: ['pt'], hint: 'follow' },
  { code: 'AE', name: 'United Arab Emirates', langs: ['ar', 'en'], hint: 'common' },
  { code: 'SA', name: 'Saudi Arabia', langs: ['ar', 'en'], hint: 'common' },
  { code: 'QA', name: 'Qatar', langs: ['ar', 'en'], hint: 'common' },
  { code: 'KW', name: 'Kuwait', langs: ['ar', 'en'], hint: 'common' },
  { code: 'JO', name: 'Jordan', langs: ['ar', 'en'], hint: 'common' },
  { code: 'EG', name: 'Egypt', langs: ['ar', 'en'], hint: 'common' },
  { code: 'MA', name: 'Morocco', langs: ['ar', 'fr'], hint: 'follow' },
  { code: 'DZ', name: 'Algeria', langs: ['ar', 'fr'], hint: 'follow' },
  { code: 'TN', name: 'Tunisia', langs: ['ar', 'fr'], hint: 'follow' },
]

export const DEFAULT_LOCALE = { country: 'IN', lang: 'en' }
export const findCountry = (code) => COUNTRIES.find((c) => c.code === code)
export const US_PAPER = new Set(['US', 'CA', 'MX']) // (Letter) kept for reference; the layouts are not switched by country
