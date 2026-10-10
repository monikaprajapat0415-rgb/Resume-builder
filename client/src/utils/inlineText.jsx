import React from 'react'
import { Link } from 'react-router-dom'

// Inline formatting used inside blog/product paragraphs and list items:
//   [link text](https://example.com)   -> link (opens in a new tab if external)
//   [link text](/templates)            -> internal link (client-side navigation)
//   **bold text**                      -> bold
//   `code`                             -> inline code
// Plain text is rendered as text (never as HTML), and only http(s), mailto, tel,
// site-relative and #anchor URLs become links, so pasted javascript: URLs are inert.

export const isSafeUrl = (url) => /^(https?:\/\/|mailto:|tel:|\/|#)/i.test((url || '').trim())

const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`\n]+)`/g
const linkClass = 'text-brand-600 underline underline-offset-2 hover:text-brand-700'

export const renderInline = (text = '') => {
  const out = []
  let last = 0
  let match
  let n = 0
  TOKEN.lastIndex = 0
  while ((match = TOKEN.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index))
    const key = `i${n++}`
    if (match[3] !== undefined) {
      out.push(<strong key={key} className='font-semibold text-slate-800'>{match[3]}</strong>)
    } else if (match[4] !== undefined) {
      out.push(<code key={key} className='px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-[0.9em]' style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}>{match[4]}</code>)
    } else if (!isSafeUrl(match[2])) {
      out.push(match[1]) // unsafe URL: keep the words, drop the link
    } else if (/^\/(?!\/)/.test(match[2])) {
      out.push(<Link key={key} to={match[2]} className={linkClass}>{match[1]}</Link>)
    } else if (match[2].startsWith('#')) {
      out.push(<a key={key} href={match[2]} className={linkClass}>{match[1]}</a>)
    } else {
      const external = /^https?:/i.test(match[2])
      out.push(
        <a key={key} href={match[2]} className={linkClass}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {match[1]}
        </a>
      )
    }
    last = match.index + match[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

// Plain-text version (strips the markup) for meta descriptions, previews, etc.
export const stripInline = (text = '') => text.replace(TOKEN, (_, label, _url, bold, code) => label ?? bold ?? code)

export const formatPrice = (amount, currency = 'INR') => {
  try {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency', currency, maximumFractionDigits: amount % 1 ? 2 : 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}
