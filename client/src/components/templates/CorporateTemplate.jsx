import Bullets from './Bullets'
import { contactParts, range, formatDate } from './shared'

// Name on the left, contact lines stacked on the right; headings carry a thick accent bar at the left.
const CorporateTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const H = ({ children }) => <h2 className="mt-6 mb-2 pl-3 border-l-4 text-[15px] font-bold text-gray-900" style={{ borderColor: accentColor }}>{children}</h2>
  return (
    <div className="max-w-4xl mx-auto px-10 py-9 bg-white text-gray-800 text-[14px] leading-relaxed font-sans">
      <header className="flex justify-between items-start gap-6 pb-4 border-b border-gray-300">
        <div>
          <h1 className="text-[32px] font-extrabold leading-tight text-gray-900">{p.full_name || 'Your Name'}</h1>
          {p.profession && <p className="text-[15px] font-semibold" style={{ color: accentColor }}>{p.profession}</p>}
        </div>
        <ul className="text-right text-[13px] text-gray-600 space-y-0.5" role="list">{contactParts(p).map((c, i) => <li key={i}>{c}</li>)}</ul>
      </header>
      {data.professional_summary && <section><H>Profile</H><p className="whitespace-pre-line">{data.professional_summary}</p></section>}
      {data.experience?.length > 0 && <section><H>Professional Experience</H><div className="space-y-4">{data.experience.map((e, i) => (
        <div key={i}>
          <div className="flex justify-between items-baseline gap-4"><h3 className="font-bold">{e.position}, <span className="font-semibold text-gray-700">{e.company}</span></h3><span className="text-[13px] text-gray-500 whitespace-nowrap">{range(e.start_date, e.end_date, e.is_current)}</span></div>
          <Bullets className="mt-1 space-y-0.5" text={e.description} />
        </div>))}</div></section>}
      {data.project?.length > 0 && <section><H>Key Projects</H><div className="space-y-3">{data.project.map((pr, i) => (
        <div key={i}><h3 className="font-bold">{pr.name}{pr.type ? <span className="font-normal text-gray-600"> ({pr.type})</span> : null}</h3><Bullets text={pr.description} /></div>))}</div></section>}
      {data.education?.length > 0 && <section><H>Education</H><div className="space-y-2">{data.education.map((e, i) => (
        <div key={i} className="flex justify-between items-baseline gap-4"><p><span className="font-bold">{e.degree}{e.field ? `, ${e.field}` : ''}</span> — {e.institution}{e.gpa ? ` (GPA: ${e.gpa})` : ''}</p><span className="text-[13px] text-gray-500 whitespace-nowrap">{formatDate(e.graduation_date)}</span></div>))}</div></section>}
      {data.skills?.length > 0 && <section><H>Core Skills</H><p>{data.skills.join(', ')}</p></section>}
    </div>
  )
}
export default CorporateTemplate
