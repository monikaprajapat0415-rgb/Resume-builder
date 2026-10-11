import Bullets from './Bullets'
import { contactParts, range, formatDate } from './shared'

// A vertical line with dots drawn in CSS (empty elements), so a parser still reads
// plain, in-order text. Single column.
const TimelineTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const Heading = ({ children }) => (
    <h2 className="mt-7 mb-3 text-[13px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>{children}</h2>
  )
  const Entry = ({ children }) => (
    <div className="relative pl-6 pb-5 border-l-2 last:pb-0" style={{ borderColor: accentColor }}>
      <span aria-hidden="true" className="absolute -left-[7px] top-1.5 size-3 rounded-full bg-white border-2" style={{ borderColor: accentColor }} />
      {children}
    </div>
  )
  return (
    <div className="max-w-4xl mx-auto px-10 py-9 bg-white text-gray-800 text-[14px] leading-relaxed font-sans">
      <header className="pb-4 border-b-2" style={{ borderColor: accentColor }}>
        <h1 className="text-[34px] font-light tracking-tight text-gray-900">{p.full_name || 'Your Name'}</h1>
        {p.profession && <p className="text-lg font-medium" style={{ color: accentColor }}>{p.profession}</p>}
        <p className="mt-2 text-[13px] text-gray-600">{contactParts(p).join('  •  ')}</p>
      </header>

      {data.professional_summary && (
        <section>
          <Heading>Professional Summary</Heading>
          <p className="whitespace-pre-line">{data.professional_summary}</p>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section>
          <Heading>Work Experience</Heading>
          <div className="ml-1.5">
            {data.experience.map((exp, i) => (
              <Entry key={i}>
                <p className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: accentColor }}>{range(exp.start_date, exp.end_date, exp.is_current)}</p>
                <h3 className="font-bold text-[15px] text-gray-900">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <Bullets className="mt-1   space-y-0.5" text={exp.description} />
              </Entry>
            ))}
          </div>
        </section>
      )}

      {data.education?.length > 0 && (
        <section>
          <Heading>Education</Heading>
          <div className="ml-1.5">
            {data.education.map((e, i) => (
              <Entry key={i}>
                <p className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: accentColor }}>{formatDate(e.graduation_date)}</p>
                <h3 className="font-bold text-gray-900">{e.degree}{e.field ? ` in ${e.field}` : ''}</h3>
                <p className="text-gray-600">{e.institution}{e.gpa ? ` — GPA: ${e.gpa}` : ''}</p>
              </Entry>
            ))}
          </div>
        </section>
      )}

      {data.project?.length > 0 && (
        <section>
          <Heading>Projects</Heading>
          <div className="space-y-3">
            {data.project.map((pr, i) => (
              <div key={i}>
                <h3 className="font-bold text-gray-900">{pr.name}</h3>
                <Bullets className="" text={pr.description} />
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills?.length > 0 && (
        <section>
          <Heading>Skills</Heading>
          <p>{data.skills.join(', ')}</p>
        </section>
      )}
    </div>
  )
}

export default TimelineTemplate
