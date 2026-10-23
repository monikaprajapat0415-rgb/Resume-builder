import Bullets from './Bullets'
import { contactParts, range, formatDate } from './shared'

// Left-aligned header over a heavy accent rule; spaced capital headings; dates on the right.
const ProfessionalTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const H = ({ children }) => <h2 className="mt-5 mb-1.5 text-[12px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>{children}</h2>
  return (
    <div className="max-w-4xl mx-auto px-10 py-9 bg-white text-gray-800 text-[14px] leading-relaxed font-sans">
      <header className="pb-3 border-b-[3px]" style={{ borderColor: accentColor }}>
        <h1 className="text-[34px] font-bold leading-tight text-gray-900">{p.full_name || 'Your Name'}</h1>
        {p.profession && <p className="text-[16px] text-gray-600">{p.profession}</p>}
        <p className="mt-1.5 text-[13px] text-gray-600">{contactParts(p).join('   ·   ')}</p>
      </header>
      {data.professional_summary && <section><H>Summary</H><p className="whitespace-pre-line">{data.professional_summary}</p></section>}
      {data.experience?.length > 0 && <section><H>Experience</H><div className="space-y-4">{data.experience.map((e, i) => (
        <div key={i}>
          <div className="flex justify-between items-baseline gap-4"><h3 className="font-bold text-[15px] text-gray-900">{e.position}</h3><span className="text-[13px] text-gray-500 whitespace-nowrap">{range(e.start_date, e.end_date, e.is_current)}</span></div>
          <p className="text-gray-600">{e.company}</p>
          <Bullets className="mt-1 space-y-0.5" text={e.description} />
        </div>))}</div></section>}
      {data.project?.length > 0 && <section><H>Projects</H><div className="space-y-3">{data.project.map((pr, i) => (
        <div key={i}><h3 className="font-bold text-gray-900">{pr.name}{pr.type ? <span className="font-normal text-gray-600"> · {pr.type}</span> : null}</h3><Bullets text={pr.description} /></div>))}</div></section>}
      {data.education?.length > 0 && <section><H>Education</H><div className="space-y-2">{data.education.map((e, i) => (
        <div key={i} className="flex justify-between items-baseline gap-4"><div><h3 className="font-bold text-gray-900">{e.degree}{e.field ? `, ${e.field}` : ''}</h3><p className="text-gray-600">{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</p></div><span className="text-[13px] text-gray-500 whitespace-nowrap">{formatDate(e.graduation_date)}</span></div>))}</div></section>}
      {data.skills?.length > 0 && <section><H>Skills</H><p>{data.skills.join(' · ')}</p></section>}
    </div>
  )
}
export default ProfessionalTemplate
