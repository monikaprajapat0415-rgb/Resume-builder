import { tr } from '../../i18n/engine'
import Bullets from './Bullets'
import { contactParts, range, formatDate } from './shared'

// Senior profile: dates sit in a left gutter, achievements to the right; large executive summary.
const LeadershipTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const H = ({ children }) => <h2 className="mt-7 mb-3 text-[13px] font-bold uppercase tracking-wider pb-1 border-b border-gray-300" style={{ color: accentColor }}>{children}</h2>
  const Row = ({ when, children }) => <div className="grid grid-cols-[110px_1fr] gap-4"><p className="text-[13px] text-gray-500 pt-0.5">{when}</p><div>{children}</div></div>
  return (
    <div className="max-w-4xl mx-auto px-10 py-10 bg-white text-gray-800 text-[14px] leading-relaxed" style={{ fontFamily: 'Cambria, Georgia, serif' }}>
      <header>
        <h1 className="text-[38px] font-bold leading-tight" style={{ color: accentColor }}>{p.full_name || tr('Your Name')}</h1>
        {p.profession && <p className="text-[18px] text-gray-700">{p.profession}</p>}
        <p className="mt-2 text-[13px] text-gray-600">{contactParts(p).join('  |  ')}</p>
      </header>
      {data.professional_summary && <section><H>{tr('Professional Summary')}</H><p className="text-[15px] whitespace-pre-line">{data.professional_summary}</p></section>}
      {data.experience?.length > 0 && <section><H>{tr('Professional Experience')}</H><div className="space-y-5">{data.experience.map((e, i) => (
        <Row key={i} when={range(e.start_date, e.end_date, e.is_current)}><h3 className="font-bold text-[15px]">{e.position}</h3><p className="text-gray-600 uppercase text-[12px] tracking-wider">{e.company}</p><Bullets className="mt-1 space-y-0.5" text={e.description} /></Row>))}</div></section>}
      {data.project?.length > 0 && <section><H>{tr('Selected Initiatives')}</H><div className="space-y-3">{data.project.map((pr, i) => (
        <Row key={i} when={pr.type || ''}><h3 className="font-bold">{pr.name}</h3><Bullets text={pr.description} /></Row>))}</div></section>}
      {data.education?.length > 0 && <section><H>{tr('Education')}</H><div className="space-y-2">{data.education.map((e, i) => (
        <Row key={i} when={formatDate(e.graduation_date)}><p><span className="font-bold">{e.degree}{e.field ? `, ${e.field}` : ''}</span>, {e.institution}{e.gpa ? ` (GPA: ${e.gpa})` : ''}</p></Row>))}</div></section>}
      {data.skills?.length > 0 && <section><H>{tr('Core Skills')}</H><p>{data.skills.join('  ·  ')}</p></section>}
    </div>
  )
}
export default LeadershipTemplate
