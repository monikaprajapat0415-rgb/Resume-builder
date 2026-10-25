import { tr } from '../../i18n/engine'
import Bullets from './Bullets'
import { contactParts, range, formatDate, printSafe } from './shared'

// Two-tone name (first name light, last name bold) and filled accent heading tags. Single column of plain text.
const TwoToneTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const parts = String(p.full_name || tr('Your Name')).trim().split(/\s+/)
  const last = parts.length > 1 ? parts.pop() : ''
  const first = parts.join(' ')
  const H = ({ children }) => <h2 className="mt-6 mb-2 inline-block px-3 py-0.5 rounded-full text-[12px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: accentColor, ...printSafe }}>{children}</h2>
  return (
    <div className="max-w-4xl mx-auto px-10 py-9 bg-white text-gray-800 text-[14px] leading-relaxed font-sans">
      <header>
        <h1 className="text-[38px] leading-tight text-gray-900"><span className="font-light">{first}</span>{last && <span className="font-extrabold" style={{ color: accentColor }}> {last}</span>}</h1>
        {p.profession && <p className="text-[16px] text-gray-600">{p.profession}</p>}
        <p className="mt-2 text-[13px] text-gray-600">{contactParts(p).join('   •   ')}</p>
      </header>
      {data.professional_summary && <section><div><H>{tr('Summary')}</H></div><p className="whitespace-pre-line">{data.professional_summary}</p></section>}
      {data.experience?.length > 0 && <section><div><H>{tr('Experience')}</H></div><div className="space-y-4">{data.experience.map((e, i) => (
        <div key={i}>
          <div className="flex justify-between items-baseline gap-4"><h3 className="font-bold">{e.position} · <span className="font-semibold text-gray-700">{e.company}</span></h3><span className="text-[13px] text-gray-500 whitespace-nowrap">{range(e.start_date, e.end_date, e.is_current)}</span></div>
          <Bullets className="mt-1 space-y-0.5" text={e.description} />
        </div>))}</div></section>}
      {data.project?.length > 0 && <section><div><H>{tr('Projects')}</H></div><div className="space-y-3">{data.project.map((pr, i) => (
        <div key={i}><h3 className="font-bold">{pr.name}{pr.type ? <span className="font-normal text-gray-600"> · {pr.type}</span> : null}</h3><Bullets text={pr.description} /></div>))}</div></section>}
      {data.education?.length > 0 && <section><div><H>{tr('Education')}</H></div><div className="space-y-2">{data.education.map((e, i) => (
        <div key={i} className="flex justify-between items-baseline gap-4"><p><span className="font-bold">{e.degree}{e.field ? `, ${e.field}` : ''}</span> · {e.institution}{e.gpa ? ` (GPA: ${e.gpa})` : ''}</p><span className="text-[13px] text-gray-500 whitespace-nowrap">{formatDate(e.graduation_date)}</span></div>))}</div></section>}
      {data.skills?.length > 0 && <section><div><H>{tr('Skills')}</H></div><p>{data.skills.join(', ')}</p></section>}
    </div>
  )
}
export default TwoToneTemplate
