import React from 'react'
import { renderInline } from '../utils/inlineText'

// Renders the heading / paragraph / list blocks used by blog posts and product
// descriptions. Paragraphs and list items support [text](url) links and **bold**.
const BlockRenderer = ({ blocks = [], variant = 'article' }) => (
  <>
    {blocks.map((block, i) => {
      if (block.type === 'heading') {
        return <h2 key={i} className={variant === 'page' ? 'text-xl font-semibold mt-6 mb-2' : 'text-2xl font-semibold text-slate-800 mt-10 mb-3'}>{block.text}</h2>
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
