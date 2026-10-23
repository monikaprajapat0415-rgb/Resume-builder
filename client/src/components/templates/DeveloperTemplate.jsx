import Bullets from './Bullets'
import { contactParts, range, formatDate, printSafe } from './shared'

// For engineers and analysts: monospace headings, skills first, projects before education. Still one column of plain text.
const DeveloperTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const H = ({ children }) => <h2 className="mt-5 mb-2 font-mono text-[13px] font-bold px-2 py-0.5 inline-block rounded-sm" style={{ color: accentColor, backgroundColor: `${accentColor}1A`, ...printSafe }}>{children}</h2>
  return (
    <div className="max-w-4xl mx-auto px-9 py-9 bg-white text-gray-800 text-[14px] leading-relaxed font-sans">
      <header>
        <h1 className="text-[30px] font-bold leading-tight text-gray-900">{p.full_name || 'Your Name'}</h1>
        {p.profession && <p className="font-mono text-[14px]" style={{ color: accentColor }}>{p.profession}</p>}
        <p className="mt-1 font-mono text-[12px] text-gray-600">{contactParts(p).join('  /  ')}</p>
      </header>
      {data.professional_summary && <section><H>Summary</H><p className="whitespace-pre-line">{data.professional_summary}</p></section>}
      {data.skills?.length > 0 && <section><H>Technical Skills</H><p className="font-mono text-[13px]">{data.skills.join(', ')}</p></section>}
      {data.experience?.length > 0 && <section><H>Experience</H><div className="space-y-4">{data.experience.map((e, i) => (
        <div key={i}>
          <div className="flex justify-between items-baseline gap-4"><h3 className="font-bold">{e.position} <span className="font-normal text-gray-600">@ {e.company}</span></h3><span className="font-mono text-[12px] text-gray-500 whitespace-nowrap">{range(e.start_date, e.end_date, e.is_current)}</span></div>
          <Bullets className="mt-1 space-y-0.5" text={e.description} />
        </div>))}</div></section>}
      {data.project?.length > 0 && <section><H>Projects</H><div className="space-y-3">{data.project.map((pr, i) => (
        <div key={i}><h3 className="font-bold">{pr.name}{pr.type ? <span className="font-mono text-[12px] font-normal text-gray-600"> [{pr.type}]</span> : null}</h3><Bullets text={pr.description} /></div>))}</div></section>}
      {data.education?.length > 0 && <section><H>Education</H><div className="space-y-2">{data.education.map((e, i) => (
        <div key={i} className="flex justify-between items-baseline gap-4"><p><span className="font-bold">{e.degree}{e.field ? `, ${e.field}` : ''}</span> — {e.institution}{e.gpa ? ` (GPA: ${e.gpa})` : ''}</p><span className="font-mono text-[12px] text-gray-500 whitespace-nowrap">{formatDate(e.graduation_date)}</span></div>))}</div></section>}
    </div>
  )
}
export default DeveloperTemplate
