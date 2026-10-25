import React from 'react'
import { useI18n } from './I18nProvider'
import CountrySelect from './CountrySelect'

const HINTS = {
  plain: 'In {country}, leave your photo, date of birth and marital status off your CV or resume.',
  common: 'In {country}, a photo and date of birth are common but optional. Leave them out if the job advert does not ask.',
  follow: 'Follow the job advert: add a photo or date of birth only if it asks for one.',
}

// Bar at the top of the dashboard: pick a country, and the app, resume and CV labels switch to its language.
export default function CountryBar() {
  const { t, countryInfo } = useI18n()
  return (
    <div className='mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3'>
      <div className='min-w-0'>
        <p className='text-sm font-medium text-slate-800'>{t('Country and language')}</p>
        <p className='text-xs text-slate-500'>{t(HINTS[countryInfo?.hint] || HINTS.follow, { country: countryInfo?.name || '' })}</p>
      </div>
      <CountrySelect />
    </div>
  )
}
