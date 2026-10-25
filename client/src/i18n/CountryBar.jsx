import React from 'react'
import { useI18n } from './I18nProvider'
import CountrySelect from './CountrySelect'

const HINTS = {
  plain: 'In {country}, leave your photo, date of birth and marital status off your CV or resume.',
  common: 'In {country}, a photo and date of birth are common but optional. Leave them out if the job advert does not ask.',
  follow: 'Follow the job advert: add a photo or date of birth only if it asks for one.',
}

// Slim strip at the top of the home page: pick a country and the site (home, menus, resume and CV labels) switches to its language.
export default function CountryBar() {
  const { t, countryInfo } = useI18n()
  return (
    <div className='border-b border-slate-200 bg-white/80'>
      <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6 lg:px-8'>
        <p className='min-w-0 text-xs text-slate-500'>{t(HINTS[countryInfo?.hint] || HINTS.follow, { country: countryInfo?.name || '' })}</p>
        <CountrySelect />
      </div>
    </div>
  )
}
