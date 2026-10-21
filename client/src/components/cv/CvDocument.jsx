import React, { useEffect, useRef, useState } from 'react'
import { buildCvSections, contactLine, cvStyle, cvRule, CV_SPACE, CV_PAGE, CV_LINE } from '../../utils/cvModel'

// ATS-first CV: one column, real text, standard headings, no icons / tables / graphics.
// Template only changes typography and heading colour, never the structure.
// Sizes come from the shared spec in cvModel so the PDF and Word file match this preview.
const px = (pt) => `${+(pt * 4 / 3).toFixed(2)}px`

// The page is always laid out at the real A4 width, so line breaks match the PDF and Word file exactly.
// On a narrower screen the whole page is scaled down (never re-wrapped).
const PAGE_PX = CV_PAGE.w * 4 / 3
const MIN_SCALE = 0.4

const CvDocument = ({ cv, personal = {}, template = 'standard', accentColor = '#1E3A8A', level = 'fresher', previewId = 'cv-preview' }) => {
  const box = useRef(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = box.current
    if (!el) return undefined
    const fit = () => setScale(Math.max(MIN_SCALE, Math.min(1, el.clientWidth / PAGE_PX)))
    fit()
    if (typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(fit); ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const st = cvStyle(template)
  const color = st.coloured ? accentColor : CV_SPACE.classicColor   // the name
  const headColor = st.coloured && !st.inkHead ? accentColor : CV_SPACE.classicColor
  const rl = cvRule(st)
  const ruleCss = rl.w ? { [st.rule === 'over' ? 'borderTop' : 'borderBottom']: `${px(rl.w)} ${st.rule === 'double' ? 'double' : 'solid'} ${headColor}`, [st.rule === 'over' ? 'paddingTop' : 'paddingBottom']: px(rl.pad) } : {}
  const sections = buildCvSections(cv || {}, personal, level)
  const contact = contactLine(personal)
  const li = { margin: 0 }
  const ul = (extra) => ({ margin: extra ? `${px(CV_SPACE.blockInner)} 0 0` : 0, paddingLeft: px(CV_SPACE.bulletIndent), listStyle: 'disc' })

  return (
    <div ref={box} className={`${previewId}-fit`} style={{ width: '100%', minWidth: 0, maxWidth: '100%', contain: 'inline-size', overflowX: scale <= MIN_SCALE ? 'auto' : 'visible' }}>
    <div style={{ zoom: scale, width: px(CV_PAGE.w), margin: '0 auto' }} className={`${previewId}-zoom`}>
    <div id={previewId} className='bg-white shadow-sm border border-gray-200'
      style={{ color: CV_SPACE.text, fontFamily: st.css, fontSize: px(st.base), lineHeight: CV_LINE, width: px(CV_PAGE.w), minHeight: px(CV_PAGE.h), padding: `${px(CV_PAGE.my)} ${px(CV_PAGE.mx)}`, boxSizing: 'border-box' }}>
      <header style={{ textAlign: st.align, marginBottom: px(st.gap) }}>
        <h1 style={{ fontSize: px(st.name), fontWeight: 700, margin: 0, color, lineHeight: CV_LINE, textTransform: st.nameCase === 'upper' ? 'uppercase' : 'none' }}>{personal.full_name || 'Your Name'}</h1>
        {contact.length > 0 && <p style={{ margin: `${px(CV_SPACE.contactTop)} 0 0`, color: CV_SPACE.contact }}>{contact.join(st.sep)}</p>}
      </header>

      {sections.length === 0 && <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 60 }}>Your CV will appear here after you generate it.</p>}

      {sections.map((s) => (
        <section key={s.heading} style={{ marginBottom: px(st.gap) }}>
          <h2 style={{ fontSize: px(st.head), fontWeight: 700, color: headColor, textTransform: st.headCase === 'upper' ? 'uppercase' : 'none', letterSpacing: px(st.track), lineHeight: CV_LINE, ...ruleCss, margin: `0 0 ${px(CV_SPACE.headAfter)}` }}>{s.heading}</h2>
          {s.text && <p style={{ margin: 0 }}>{s.text}</p>}
          {s.bullets && <ul style={ul(false)}>{s.bullets.map((b, i) => <li key={i} style={li}>{b}</li>)}</ul>}
          {s.blocks && s.blocks.map((b, i) => (
            <div key={i} style={{ marginBottom: px(CV_SPACE.blockAfter) }}>
              <p style={{ margin: 0, fontWeight: 700 }}>{b.title}</p>
              {b.meta && <p style={{ margin: 0, color: CV_SPACE.meta, fontSize: px(st.base - CV_SPACE.metaDrop) }}>{b.meta}</p>}
              {b.text && <p style={{ margin: `${px(CV_SPACE.blockInner)} 0 0` }}>{b.text}</p>}
              {b.bullets?.length > 0 && <ul style={ul(true)}>{b.bullets.map((x, j) => <li key={j} style={li}>{x}</li>)}</ul>}
            </div>
          ))}
        </section>
      ))}

      <style>{`
        #${previewId} { box-sizing: border-box; white-space: pre-wrap; }
        #${previewId} * { font-family: inherit; }
        @page { size: A4; margin: ${CV_PAGE.my}pt ${CV_PAGE.mx}pt; }
        @media print {
          html, body { margin: 0; padding: 0; }
          /* print only the CV: hide everything except the preview and the elements that contain it */
          body *:not(:has(#${previewId})):not(#${previewId}):not(#${previewId} *) { display: none !important; }
          html, body, #root, body *:has(#${previewId}) { display: block !important; position: static !important; margin: 0 !important; padding: 0 !important; width: auto !important; max-width: none !important; height: auto !important; min-height: 0 !important; overflow: visible !important; border: none !important; box-shadow: none !important; background: none !important; }
          .${previewId}-fit { contain: none !important; }
          .${previewId}-zoom { zoom: 1 !important; width: auto !important; margin: 0 !important; }
          #${previewId} { position: static !important; width: 100% !important; min-height: 0 !important; padding: 0 !important; max-width: none !important; border: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
    </div>
    </div>
  )
}

export default CvDocument
