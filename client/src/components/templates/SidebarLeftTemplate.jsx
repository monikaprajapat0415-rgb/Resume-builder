import Bullets from './Bullets'
import { contactParts, range, formatDate, printSafe } from './shared'

// Two columns: tinted left sidebar (contact, skills, education), main column on the right.
// The main column comes first in the file, so text read in source order starts with the summary and experience.
const SidebarLeftTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const SH = ({ children }) => <h2 className="mt-5 mb-1.5 text-[12px] font-bold uppercase tracking-wider text-white/90 border-b border-white/40 pb-1">{children}</h2>
  const MH = ({ children }) => <h2 className="mt-5 mb-2 text-[14px] font-bold uppercase tracking-wider pb-1 border-b" style={{ color: accentColor, borderColor: accentColor }}>{children}</h2>
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 text-[14px] leading-relaxed font-sans flex flex-row-reverse min-h-[11in]">
      <main className="flex-1 min-w-0 px-8 py-9">
        <h1 className="text-[32px] font-bold leading-tight text-gray-900">{p.full_name || 'Your Name'}</h1>
        {p.profession && <p className="text-[16px] text-gray-600">{p.profession}</p>}
        {data.professional_summary && <section><MH>Profile</MH><p className="whitespace-pre-line">{data.professional_summary}</p></section>}
        {data.experience?.length > 0 && <section><MH>Experience</MH><div className="space-y-4">{data.experience.map((e, i) => (
          <div key={i}><h3 className="font-bold">{e.position}</h3><p className="text-gray-600 text-[13px]">{e.company}  |  {range(e.start_date, e.end_date, e.is_current)}</p><Bullets className="mt-1 space-y-0.5" text={e.description} /></div>))}</div></section>}
        {data.project?.length > 0 && <section><MH>Projects</MH><div className="space-y-3">{data.project.map((pr, i) => (
          <div key={i}><h3 className="font-bold">{pr.name}{pr.type ? <span className="font-normal text-gray-600"> — {pr.type}</span> : null}</h3><Bullets text={pr.description} /></div>))}</div></section>}
      </main>
      <aside className="w-[32%] shrink-0 px-6 py-9 text-white text-[13px]" style={{ backgroundColor: accentColor, ...printSafe }}>
        <SH>Contact</SH>
        <ul className="space-y-1 break-words" role="list">{contactParts(p).map((c, i) => <li key={i}>{c}</li>)}</ul>
        {data.skills?.length > 0 && <><SH>Skills</SH><ul className="space-y-1" role="list">{data.skills.map((s, i) => <li key={i}>{s}</li>)}</ul></>}
        {data.education?.length > 0 && <><SH>Education</SH><div className="space-y-3">{data.education.map((e, i) => (
          <div key={i}><p className="font-bold">{e.degree}{e.field ? `, ${e.field}` : ''}</p><p>{e.institution}</p><p className="text-white/80">{formatDate(e.graduation_date)}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</p></div>))}</div></>}
      </aside>
    </div>
  )
}
export default SidebarLeftTemplate
