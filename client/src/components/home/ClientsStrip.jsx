import React from 'react'
import Reveal from '../Reveal'
import { useHomeTrust } from '../../utils/homeTrust'

const Logo = ({ c }) => {
  const inner = c.logoUrl
    ? <img src={c.logoUrl} alt={c.name} loading="lazy" decoding="async" className="h-9 w-auto max-w-[9rem] object-contain grayscale opacity-70 transition group-hover:grayscale-0 group-hover:opacity-100" />
    : <span className="text-lg font-semibold text-slate-500 group-hover:text-slate-800 transition whitespace-nowrap">{c.name}</span>
  return c.url
    ? <a href={c.url} target="_blank" rel="noopener noreferrer nofollow" aria-label={c.name} className="group inline-flex items-center px-6">{inner}</a>
    : <span className="group inline-flex items-center px-6">{inner}</span>
}

// "Trusted by": shown only when an admin has published at least one real client. Scrolls slowly, pauses on hover.
const ClientsStrip = () => {
  const trust = useHomeTrust()
  const clients = trust?.clients || []
  if (!clients.length) return null
  const loop = clients.length >= 4   // a few logos just sit in a row; more than that scroll
  return (
    <section aria-labelledby="clients-h" className="px-4 py-8">
      <Reveal className="max-w-6xl mx-auto">
        <h2 id="clients-h" className="text-center text-xs sm:text-sm font-medium uppercase tracking-wider text-slate-400">Trusted by teams and employers</h2>
        <div className={`marquee mt-5 overflow-hidden ${loop ? '[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]' : ''}`}>
          {loop ? (
            <div className="marquee-track flex w-max items-center">
              {clients.map((c) => <Logo key={c.id} c={c} />)}
              <div className="flex items-center" aria-hidden="true">{clients.map((c) => <span key={c.id} className="px-6">{c.logoUrl ? <img src={c.logoUrl} alt="" loading="lazy" className="h-9 w-auto max-w-[9rem] object-contain grayscale opacity-70" /> : <span className="text-lg font-semibold text-slate-500 whitespace-nowrap">{c.name}</span>}</span>)}</div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-y-3">{clients.map((c) => <Logo key={c.id} c={c} />)}</div>
          )}
        </div>
      </Reveal>
    </section>
  )
}

export default ClientsStrip
