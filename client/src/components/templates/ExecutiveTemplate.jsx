import Bullets from './Bullets'
import { contactParts, range, formatDate } from './shared'

// Formal, centred, serif. Single column, real <ul> bullets, no icons.
const ExecutiveTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const Heading = ({ children }) => (
    <h2 className="mt-6 mb-2 pb-1 text-[13px] font-bold uppercase tracking-wider border-b" style={{ color: accentColor, borderColor: accentColor }}>{children}</h2>
  )
  return (
    <div className="max-w-4xl mx-auto px-10 py-9 bg-white text-gray-900 text-[14px] leading-relaxed" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <header className="text-center pb-4 border-y-4 border-double py-5" style={{ borderColor: accentColor }}>
        <h1 className="text-[32px] font-bold uppercase tracking-wide">{p.full_name || 'Your Name'}</h1>
        {p.profession && <p className="mt-1 text-base italic text-gray-600">{p.profession}</p>}
        <p className="mt-2 text-[13px] text-gray-700">{contactParts(p).join('  |  ')}</p>
      </header>

      {data.professional_summary && (
        <section>
          <Heading>Professional Summary</Heading>
          <p className="text-gray-800 whitespace-pre-line">{data.professional_summary}</p>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section>
          <Heading>Work Experience</Heading>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="font-bold text-[15px]">{exp.company}</h3>
                  <span className="text-[13px] text-gray-600 whitespace-nowrap">{range(exp.start_date, exp.end_date, exp.is_current)}</span>
                </div>
                <p className="italic text-gray-700">{exp.position}</p>
                <Bullets className="mt-1   space-y-0.5 text-gray-800" text={exp.description} />
              </div>
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
                <h3 className="font-bold">{pr.name}{pr.type ? <span className="font-normal italic text-gray-600"> — {pr.type}</span> : null}</h3>
                <Bullets className="text-gray-800" text={pr.description} />
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education?.length > 0 && (
        <section>
          <Heading>Education</Heading>
          <div className="space-y-2">
            {data.education.map((e, i) => (
              <div key={i} className="flex justify-between items-baseline gap-4">
                <div>
                  <h3 className="font-bold">{e.degree}{e.field ? `, ${e.field}` : ''}</h3>
                  <p className="text-gray-700">{e.institution}{e.gpa ? ` — GPA: ${e.gpa}` : ''}</p>
                </div>
                <span className="text-[13px] text-gray-600 whitespace-nowrap">{formatDate(e.graduation_date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills?.length > 0 && (
        <section>
          <Heading>Skills</Heading>
          <p className="text-gray-800">{data.skills.join(', ')}</p>
        </section>
      )}
    </div>
  )
}

export default ExecutiveTemplate
