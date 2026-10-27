import React from 'react'
import { IN, GB, CA, US, NG, KE, GH, ZA, UG, TZ, ES, MX, AR, CO, CL, PE, FR, BE, CH, SN, CI, CM, CD, BR, PT, AO, MZ, AE, SA, QA, KW, JO, EG, MA, DZ, TN } from 'country-flag-icons/react/3x2'

const FLAGS = { IN, GB, CA, US, NG, KE, GH, ZA, UG, TZ, ES, MX, AR, CO, CL, PE, FR, BE, CH, SN, CI, CM, CD, BR, PT, AO, MZ, AE, SA, QA, KW, JO, EG, MA, DZ, TN }

// Small flag drawn as an inline SVG (no image requests, works on Windows where flag emoji do not).
export default function CountryFlag({ code, className = 'h-4 w-6' }) {
  const F = FLAGS[code]
  if (!F) return <span className={`inline-block rounded-sm bg-slate-200 ${className}`} aria-hidden />
  return <F className={`rounded-[3px] shadow-[0_0_0_1px_rgba(15,23,42,0.12)] ${className}`} aria-hidden='true' focusable='false' />
}
