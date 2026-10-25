import { tr } from '../../i18n/engine'
import Bullets from './Bullets'
import { contactParts, range, formatDate } from './shared'

// For factory, warehouse, driving, technician and other hands-on jobs: bigger type, skills in a clear list at the top.
const SkilledTradesTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const H = ({ children }) => <h2 className="mt-6 mb-2 pb-1 text-[16px] font-extrabold uppercase border-b-[3px]" style={{ color: accentColor, borderColor: accentColor }}>{children}</h2>
  return (
    <div className="max-w-4xl mx-auto px-10 py-9 bg-white text-gray-900 text-[15px] leading-relaxed font-sans">
      <header>
        <h1 className="text-[36px] font-extrabold leading-tight">{p.full_name || tr('Your Name')}</h1>
        {p.profession && <p className="text-[18px] font-semibold text-gray-700">{p.profession}</p>}
        <p className="mt-2 text-[14px] text-gray-700">{contactParts(p).join('   |   ')}</p>
      </header>
      {data.professional_summary && <section><H>{tr('About Me')}</H><p className="whitespace-pre-line">{data.professional_summary}</p></section>}
      {data.skills?.length > 0 && <section><H>{tr('Skills and Licences')}</H><ul className="columns-2 sm:columns-3 gap-6" role="list">{data.skills.map((s, i) => <li key={i} className="break-inside-avoid" style={{ listStyle: 'none' }}>{'• '}{s}</li>)}</ul></section>}
      {data.experience?.length > 0 && <section><H>{tr('Work History')}</H><div className="space-y-4">{data.experience.map((e, i) => (
        <div key={i}>
          <h3 className="font-bold text-[16px]">{e.position}</h3>
          <p className="text-gray-700">{e.company}  |  {range(e.start_date, e.end_date, e.is_current)}</p>
          <Bullets className="mt-1 space-y-0.5" text={e.description} />
        </div>))}</div></section>}
      {data.project?.length > 0 && <section><H>{tr('Projects and Training')}</H><div className="space-y-3">{data.project.map((pr, i) => (
        <div key={i}><h3 className="font-bold">{pr.name}{pr.type ? <span className="font-normal text-gray-700"> — {pr.type}</span> : null}</h3><Bullets text={pr.description} /></div>))}</div></section>}
      {data.education?.length > 0 && <section><H>{tr('Education')}</H><div className="space-y-2">{data.education.map((e, i) => (
        <div key={i}><p><span className="font-bold">{e.degree}{e.field ? `, ${e.field}` : ''}</span></p><p className="text-gray-700">{e.institution}  |  {formatDate(e.graduation_date)}{e.gpa ? `  |  Grade: ${e.gpa}` : ''}</p></div>))}</div></section>}
    </div>
  )
}
export default SkilledTradesTemplate
