import { tr } from '../../i18n/engine'
import Bullets from './Bullets'
import { contactParts, range, formatDate } from './shared'

// Wide main column on the left, slim right column for skills, education and contact. White background, accent headings.
const TwoColumnTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const H = ({ children }) => <h2 className="mt-5 mb-1.5 text-[13px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>{children}</h2>
  return (
    <div className="max-w-4xl mx-auto px-9 py-9 bg-white text-gray-800 text-[14px] leading-relaxed font-sans">
      <header className="pb-3">
        <h1 className="text-[34px] font-bold leading-tight text-gray-900">{p.full_name || tr('Your Name')}</h1>
        {p.profession && <p className="text-[16px] font-medium" style={{ color: accentColor }}>{p.profession}</p>}
      </header>
      <div className="flex gap-8 border-t-2 pt-1" style={{ borderColor: accentColor }}>
        <main className="flex-1 min-w-0">
          {data.professional_summary && <section><H>{tr('Profile')}</H><p className="whitespace-pre-line">{data.professional_summary}</p></section>}
          {data.experience?.length > 0 && <section><H>{tr('Experience')}</H><div className="space-y-4">{data.experience.map((e, i) => (
            <div key={i}><h3 className="font-bold">{e.position}</h3><p className="text-gray-600 text-[13px]">{e.company}  |  {range(e.start_date, e.end_date, e.is_current)}</p><Bullets className="mt-1 space-y-0.5" text={e.description} /></div>))}</div></section>}
          {data.project?.length > 0 && <section><H>{tr('Projects')}</H><div className="space-y-3">{data.project.map((pr, i) => (
            <div key={i}><h3 className="font-bold">{pr.name}{pr.type ? <span className="font-normal text-gray-600"> — {pr.type}</span> : null}</h3><Bullets text={pr.description} /></div>))}</div></section>}
        </main>
        <aside className="w-[30%] shrink-0 text-[13px]">
          <H>{tr('Contact')}</H>
          <ul className="space-y-1 break-words" role="list">{contactParts(p).map((c, i) => <li key={i}>{c}</li>)}</ul>
          {data.skills?.length > 0 && <><H>{tr('Skills')}</H><ul className="space-y-1" role="list">{data.skills.map((s, i) => <li key={i}>{s}</li>)}</ul></>}
          {data.education?.length > 0 && <><H>{tr('Education')}</H><div className="space-y-3">{data.education.map((e, i) => (
            <div key={i}><p className="font-bold">{e.degree}{e.field ? `, ${e.field}` : ''}</p><p>{e.institution}</p><p className="text-gray-500">{formatDate(e.graduation_date)}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</p></div>))}</div></>}
        </aside>
      </div>
    </div>
  )
}
export default TwoColumnTemplate
