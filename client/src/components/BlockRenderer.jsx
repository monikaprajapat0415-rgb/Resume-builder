import React, { useState } from 'react'
import { renderInline } from '../utils/inlineText'

// Code sample with a language label and a copy button (tutorial lessons).
const CodeBlock = ({ lang, text }) => {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* clipboard blocked */ }
  }
  return (
    <div className='my-5 rounded-lg overflow-hidden bg-slate-900 text-slate-100'>
      <div className='flex items-center justify-between px-4 py-2 bg-slate-800 text-xs text-slate-300'>
        <span className='uppercase tracking-wide'>{lang || 'code'}</span>
        <button type='button' onClick={copy} className='px-2 py-0.5 rounded hover:bg-slate-700 transition'>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <pre className='p-4 overflow-x-auto text-[13px] leading-relaxed'><code className={lang ? `language-${lang}` : undefined} style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}>{text}</code></pre>
    </div>
  )
}

// Renders the heading / paragraph / list blocks used by blog posts and product
// descriptions. Paragraphs and list items support [text](url) links and **bold**.
const BlockRenderer = ({ blocks = [], variant = 'article' }) => (
  <>
    {blocks.map((block, i) => {
      if (block.type === 'heading') {
        return <h2 key={i} id={block.id} className={variant === 'page' ? 'text-xl font-semibold mt-6 mb-2' : 'text-2xl font-semibold text-slate-800 mt-10 mb-3 scroll-mt-24'}>{block.text}</h2>
      }
      if (block.type === 'code') return <CodeBlock key={i} lang={block.lang} text={block.text || ''} />
      if (block.type === 'note') {
        return (
          <aside key={i} className='my-5 rounded-lg border-l-4 border-brand-500 bg-brand-50/70 px-4 py-3 text-sm text-slate-700'>
            <strong className='text-brand-800'>Note: </strong>{renderInline(block.text)}
          </aside>
        )
      }
      if (block.type === 'image') {
        return (
          <figure key={i} className='my-6'>
            <img src={block.url} alt={block.alt || ''} loading='lazy' decoding='async' className='w-full h-auto rounded-lg border border-slate-100' />
            {block.caption && <figcaption className='text-xs text-slate-400 text-center mt-2'>{block.caption}</figcaption>}
          </figure>
        )
      }
      if (block.type === 'olist') {
        return (
          <ol key={i} className={`list-decimal list-outside pl-5 text-gray-600 ${variant === 'page' ? 'space-y-1 my-2' : 'space-y-2 my-4'}`}>
            {(block.items || []).map((item, j) => <li key={j}>{renderInline(item)}</li>)}
          </ol>
        )
      }
      if (block.type === 'list') {
        return (
          <ul key={i} className={`list-disc list-outside pl-5 text-gray-600 ${variant === 'page' ? 'space-y-1 my-2' : 'space-y-2 my-4'}`}>
            {(block.items || []).map((item, j) => <li key={j}>{renderInline(item)}</li>)}
          </ul>
        )
      }
      return <p key={i} className={`text-gray-600 ${variant === 'page' ? 'my-2' : 'leading-relaxed my-4'}`}>{renderInline(block.text)}</p>
    })}
  </>
)

export default BlockRenderer
