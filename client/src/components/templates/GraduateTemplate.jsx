import Bullets from './Bullets'
import { contactParts, range, formatDate, printSafe } from './shared'

// For students and early-career candidates: Education and Projects come before Experience.
const GraduateTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const Heading = ({ children }) => (
    <h2 className="mt-5 mb-2 px-2.5 py-1 text-[13px] font-bold uppercase tracking-wider bg-gray-100" style={{ color: accentColor, ...printSafe }}>{children}</h2>
  )
  return (
    <div className="max-w-4xl mx-auto px-9 py-8 bg-white text-gray-800 text-[14px] leading-relaxed font-sans">
      <header className="text-center">
        <h1 className="text-[30px] font-bold text-gray-900">{p.full_name || 'Your Name'}</h1>
        {p.profession && <p className="font-medium" style={{ color: accentColor }}>{p.profession}</p>}
        <p className="mt-1.5 text-[13px] text-gray-600">{contactParts(p).join('  |  ')}</p>
      </header>

      {data.professional_summary && (
        <section>
          <Heading>Professional Summary</Heading>
          <p className="whitespace-pre-line">{data.professional_summary}</p>
        </section>
      )}

      {data.education?.length > 0 && (
        <section>
          <Heading>Education</Heading>
          <div className="space-y-2">
            {data.education.map((e, i) => (
              <div key={i} className="flex justify-between items-baseline gap-4">
                <div>
                  <h3 className="font-bold">{e.degree}{e.field ? ` in ${e.field}` : ''}</h3>
                  <p className="text-gray-600">{e.institution}{e.gpa ? ` — GPA: ${e.gpa}` : ''}</p>
                </div>
                <span className="text-[13px] text-gray-500 whitespace-nowrap">{formatDate(e.graduation_date)}</span>
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

      {data.project?.length > 0 && (
        <section>
          <Heading>Projects</Heading>
          <div className="space-y-3">
            {data.project.map((pr, i) => (
              <div key={i}>
                <h3 className="font-bold">{pr.name}{pr.type ? <span className="font-normal text-gray-500"> — {pr.type}</span> : null}</h3>
                <Bullets className="" text={pr.description} />
              </div>
            ))}
          </div>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section>
          <Heading>Work Experience</Heading>
          <div className="space-y-3">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="font-bold">{exp.position}, {exp.company}</h3>
                  <span className="text-[13px] text-gray-500 whitespace-nowrap">{range(exp.start_date, exp.end_date, exp.is_current)}</span>
                </div>
                <Bullets className="mt-0.5   space-y-0.5" text={exp.description} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default GraduateTemplate
