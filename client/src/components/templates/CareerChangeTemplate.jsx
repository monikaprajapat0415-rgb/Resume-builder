import Bullets from './Bullets'
import { contactParts, range, formatDate, printSafe } from './shared'

// For people changing field: a highlighted profile box and a skills block lead, work history follows.
const CareerChangeTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const H = ({ children }) => <h2 className="mt-6 mb-2 text-[14px] font-bold uppercase tracking-wide text-gray-900">{children}</h2>
  return (
    <div className="max-w-4xl mx-auto px-10 py-9 bg-white text-gray-800 text-[14px] leading-relaxed font-sans">
      <header className="text-center">
        <h1 className="text-[32px] font-bold leading-tight text-gray-900">{p.full_name || 'Your Name'}</h1>
        {p.profession && <p className="text-[16px] font-medium" style={{ color: accentColor }}>{p.profession}</p>}
        <p className="mt-1.5 text-[13px] text-gray-600">{contactParts(p).join('  |  ')}</p>
      </header>
      {data.professional_summary && <section className="mt-5 rounded-md border-l-4 px-4 py-3 bg-gray-50" style={{ borderColor: accentColor, ...printSafe }}><h2 className="mb-1 text-[13px] font-bold uppercase tracking-wide" style={{ color: accentColor }}>Professional Summary</h2><p className="whitespace-pre-line">{data.professional_summary}</p></section>}
      {data.skills?.length > 0 && <section><H>Key Skills</H><p>{data.skills.join('  •  ')}</p></section>}
      {data.experience?.length > 0 && <section><H>Work Experience</H><div className="space-y-4">{data.experience.map((e, i) => (
        <div key={i}>
          <div className="flex justify-between items-baseline gap-4"><h3 className="font-bold">{e.position} — {e.company}</h3><span className="text-[13px] text-gray-500 whitespace-nowrap">{range(e.start_date, e.end_date, e.is_current)}</span></div>
          <Bullets className="mt-1 space-y-0.5" text={e.description} />
        </div>))}</div></section>}
      {data.project?.length > 0 && <section><H>Projects and Training</H><div className="space-y-3">{data.project.map((pr, i) => (
        <div key={i}><h3 className="font-bold">{pr.name}{pr.type ? <span className="font-normal text-gray-600"> — {pr.type}</span> : null}</h3><Bullets text={pr.description} /></div>))}</div></section>}
      {data.education?.length > 0 && <section><H>Education</H><div className="space-y-2">{data.education.map((e, i) => (
        <div key={i} className="flex justify-between items-baseline gap-4"><p><span className="font-bold">{e.degree}{e.field ? `, ${e.field}` : ''}</span> — {e.institution}{e.gpa ? ` (GPA: ${e.gpa})` : ''}</p><span className="text-[13px] text-gray-500 whitespace-nowrap">{formatDate(e.graduation_date)}</span></div>))}</div></section>}
    </div>
  )
}
export default CareerChangeTemplate
