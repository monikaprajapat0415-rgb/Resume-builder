import Bullets from './Bullets'
import { contactParts, range, formatDate } from './shared'

// Dense, small type: fits a long career on one page. Single column, no icons.
const CompactTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const Heading = ({ children }) => (
    <h2 className="mt-4 mb-1.5 text-[11.5px] font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5" style={{ color: accentColor }}>{children}</h2>
  )
  return (
    <div className="max-w-4xl mx-auto px-8 py-7 bg-white text-gray-900 text-[12.5px] leading-snug font-sans">
      <header>
        <div className="flex justify-between items-end gap-4">
          <h1 className="text-[26px] font-extrabold leading-none">{p.full_name || 'Your Name'}</h1>
          {p.profession && <p className="text-[13px] font-semibold text-gray-600">{p.profession}</p>}
        </div>
        <p className="mt-1.5 text-[12px] text-gray-600">{contactParts(p).join(' • ')}</p>
      </header>

      {data.professional_summary && (
        <section>
          <Heading>Professional Summary</Heading>
          <p className="text-gray-800 whitespace-pre-line">{data.professional_summary}</p>
        </section>
      )}

      {data.skills?.length > 0 && (
        <section>
          <Heading>Skills</Heading>
          <p className="text-gray-800">{data.skills.join(' • ')}</p>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section>
          <Heading>Work Experience</Heading>
          <div className="space-y-2.5">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="font-bold">{exp.position}<span className="font-normal text-gray-600">, {exp.company}</span></h3>
                  <span className="text-[11.5px] text-gray-500 whitespace-nowrap">{range(exp.start_date, exp.end_date, exp.is_current)}</span>
                </div>
                <Bullets className="text-gray-800" text={exp.description} />
              </div>
            ))}
          </div>
        </section>
      )}

      {data.project?.length > 0 && (
        <section>
          <Heading>Projects</Heading>
          <div className="space-y-1.5">
            {data.project.map((pr, i) => (
              <div key={i}>
                <h3 className="font-bold">{pr.name}{pr.type ? <span className="font-normal text-gray-500"> — {pr.type}</span> : null}</h3>
                <Bullets className="text-gray-800" text={pr.description} />
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education?.length > 0 && (
        <section>
          <Heading>Education</Heading>
          <ul className="space-y-0.5">
            {data.education.map((e, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span><b>{e.degree}{e.field ? `, ${e.field}` : ''}</b>, {e.institution}{e.gpa ? ` (GPA: ${e.gpa})` : ''}</span>
                <span className="text-[11.5px] text-gray-500 whitespace-nowrap">{formatDate(e.graduation_date)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default CompactTemplate
