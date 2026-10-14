import React from 'react'
import { buildCvSections, contactLine } from '../../utils/cvModel'

// ATS-first CV: one column, real text, standard headings, no icons / tables / graphics.
// Template only changes typography and heading colour, never the structure.
const STYLES = {
  standard: { font: 'Helvetica, Arial, sans-serif', base: 13, name: 28, heading: 13, gap: 16, upper: true, coloured: true },
  classic: { font: 'Georgia, "Times New Roman", serif', base: 13.5, name: 28, heading: 13, gap: 16, upper: true, coloured: false },
  compact: { font: 'Helvetica, Arial, sans-serif', base: 11.5, name: 24, heading: 11.5, gap: 11, upper: true, coloured: true },
}

const CvDocument = ({ cv, personal = {}, template = 'standard', accentColor = '#1E3A8A', level = 'fresher', previewId = 'cv-preview' }) => {
  const st = STYLES[template] || STYLES.standard
  const color = st.coloured ? accentColor : '#111827'
  const sections = buildCvSections(cv || {}, personal, level)
  const contact = contactLine(personal)

  return (
    <div id={previewId} className='bg-white text-gray-900 mx-auto shadow-sm border border-gray-200'
      style={{ fontFamily: st.font, fontSize: st.base, lineHeight: 1.45, width: '100%', maxWidth: 794, minHeight: 1000, padding: '44px 48px', boxSizing: 'border-box' }}>
      <header style={{ textAlign: 'center', marginBottom: st.gap }}>
        <h1 style={{ fontSize: st.name, fontWeight: 700, margin: 0, color, letterSpacing: 0.3 }}>{personal.full_name || 'Your Name'}</h1>
        {contact.length > 0 && <p style={{ margin: '6px 0 0', color: '#374151' }}>{contact.join('  |  ')}</p>}
      </header>

      {sections.length === 0 && <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 60 }}>Your CV will appear here after you generate it.</p>}

      {sections.map((s) => (
        <section key={s.heading} style={{ marginBottom: st.gap }}>
          <h2 style={{ fontSize: st.heading, fontWeight: 700, color, textTransform: st.upper ? 'uppercase' : 'none', letterSpacing: 0.8, borderBottom: `1.5px solid ${color}`, paddingBottom: 2, margin: '0 0 6px' }}>{s.heading}</h2>
          {s.text && <p style={{ margin: 0 }}>{s.text}</p>}
          {s.bullets && <ul style={{ margin: 0, paddingLeft: 18, listStyle: 'disc' }}>{s.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
          {s.blocks && s.blocks.map((b, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <p style={{ margin: 0, fontWeight: 700 }}>{b.title}</p>
              {b.meta && <p style={{ margin: 0, color: '#4B5563', fontSize: st.base - 1 }}>{b.meta}</p>}
              {b.text && <p style={{ margin: '2px 0 0' }}>{b.text}</p>}
              {b.bullets?.length > 0 && <ul style={{ margin: '2px 0 0', paddingLeft: 18, listStyle: 'disc' }}>{b.bullets.map((x, j) => <li key={j}>{x}</li>)}</ul>}
            </div>
          ))}
        </section>
      ))}

      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          html, body { margin: 0; padding: 0; }
          body * { visibility: hidden; }
          #${previewId}, #${previewId} * { visibility: visible; }
          #${previewId} { position: fixed; left: 0; top: 0; width: 100% !important; max-width: none !important; border: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  )
}

export default CvDocument
