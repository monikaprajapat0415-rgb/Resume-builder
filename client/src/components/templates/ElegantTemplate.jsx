import Bullets from './Bullets'
import { contactParts, range, formatDate } from './shared'

// Centred serif page: letter-spaced name between hairlines, centred headings, italic role lines.
const ElegantTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const H = ({ children }) => <h2 className="mt-6 mb-2 text-center text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ color: accentColor }}>{children}</h2>
  return (
    <div className="max-w-4xl mx-auto px-12 py-10 bg-white text-gray-800 text-[14px] leading-relaxed" style={{ fontFamily: 'Garamond, Georgia, "Times New Roman", serif' }}>
      <header className="text-center">
        <div className="border-t border-gray-400 w-24 mx-auto mb-4" />
        <h1 className="text-[34px] font-normal uppercase tracking-[0.22em] text-gray-900">{p.full_name || 'Your Name'}</h1>
        {p.profession && <p className="mt-1 italic text-[16px] text-gray-600">{p.profession}</p>}
        <p className="mt-2 text-[13px] text-gray-600">{contactParts(p).join('  ·  ')}</p>
        <div className="border-t border-gray-400 w-24 mx-auto mt-4" />
      </header>
      {data.professional_summary && <section><H>Profile</H><p className="text-center whitespace-pre-line">{data.professional_summary}</p></section>}
      {data.experience?.length > 0 && <section><H>Experience</H><div className="space-y-4">{data.experience.map((e, i) => (
        <div key={i}>
          <div className="flex justify-between items-baseline gap-4"><h3 className="font-bold text-[15px]">{e.company}</h3><span className="text-[13px] italic text-gray-600 whitespace-nowrap">{range(e.start_date, e.end_date, e.is_current)}</span></div>
          <p className="italic text-gray-700">{e.position}</p>
          <Bullets className="mt-1 space-y-0.5" text={e.description} />
        </div>))}</div></section>}
      {data.project?.length > 0 && <section><H>Projects</H><div className="space-y-3">{data.project.map((pr, i) => (
        <div key={i}><h3 className="font-bold">{pr.name}{pr.type ? <span className="font-normal italic text-gray-600"> — {pr.type}</span> : null}</h3><Bullets text={pr.description} /></div>))}</div></section>}
      {data.education?.length > 0 && <section><H>Education</H><div className="space-y-2">{data.education.map((e, i) => (
        <div key={i} className="flex justify-between items-baseline gap-4"><div><h3 className="font-bold">{e.degree}{e.field ? `, ${e.field}` : ''}</h3><p className="italic text-gray-700">{e.institution}{e.gpa ? ` — GPA: ${e.gpa}` : ''}</p></div><span className="text-[13px] italic text-gray-600 whitespace-nowrap">{formatDate(e.graduation_date)}</span></div>))}</div></section>}
      {data.skills?.length > 0 && <section><H>Skills</H><p className="text-center">{data.skills.join('  ·  ')}</p></section>}
    </div>
  )
}
export default ElegantTemplate
