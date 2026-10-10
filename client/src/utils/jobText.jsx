import React from 'react'

export const timeAgo = (d) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (!Number.isFinite(days) || days < 0) return ''
  if (days < 1) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const m = Math.floor(days / 30)
  return m === 1 ? '1 month ago' : `${m} months ago`
}

// Plain text with paragraphs and "- " bullet lines -> React elements (never raw HTML).
export const JobDescription = ({ text }) => {
  const blocks = String(text || '').split(/\n{2,}/).map((b) => b.split('\n').filter((l) => l.trim())).filter((l) => l.length)
  return blocks.map((lines, i) => {
    const out = []; let list = []; let para = []
    const flushList = () => { if (list.length) { out.push(<ul key={`u${out.length}`} className='list-disc pl-5 space-y-1'>{list.map((l, k) => <li key={k}>{l}</li>)}</ul>); list = [] } }
    const flushPara = () => { if (para.length) { out.push(<p key={`p${out.length}`}>{para.map((l, k) => <React.Fragment key={k}>{k > 0 && <br />}{l}</React.Fragment>)}</p>); para = [] } }
    for (const l of lines) {
      if (/^- /.test(l)) { flushPara(); list.push(l.slice(2).trim()) } else { flushList(); para.push(l.trim()) }
    }
    flushList(); flushPara()
    return <div key={i} className='space-y-2'>{out}</div>
  })
}
