import { lines } from './shared'

// The bullet is a real "•" character (not a CSS list marker). PDF exports drop CSS markers,
// so resume parsers and the ATS checker would otherwise see a plain run of sentences.
const Bullets = ({ text, className = '', indent = '1.1em' }) => {
  const items = lines(text)
  if (!items.length) return null
  return (
    <ul className={className} role="list">
      {items.map((l, i) => (
        <li key={i} style={{ paddingLeft: indent, textIndent: `-${indent}`, listStyle: 'none' }}>{'• '}{l}</li>
      ))}
    </ul>
  )
}

export default Bullets
