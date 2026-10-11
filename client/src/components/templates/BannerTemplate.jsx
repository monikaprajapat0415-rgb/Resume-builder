import Bullets from './Bullets'
import { contactParts, range, formatDate, printSafe } from './shared'

// Coloured header band with the name as real text (not an image). Body is single column.
const BannerTemplate = ({ data, accentColor }) => {
  const p = data.personal_info || {}
  const Heading = ({ children }) => (
    <h2 className="mt-6 mb-3 pl-3 text-[15px] font-bold uppercase tracking-wide border-l-4" style={{ borderColor: accentColor, color: accentColor }}>{children}</h2>
  )
  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 text-[14px] leading-relaxed font-sans">
      <header className="px-9 py-8 text-white" style={{ backgroundColor: accentColor, ...printSafe }}>
        <h1 className="text-[34px] font-extrabold leading-tight">{p.full_name || 'Your Name'}</h1>
        {p.profession && <p className="text-lg opacity-95">{p.profession}</p>}
        <p className="mt-3 text-[13px] opacity-95">{contactParts(p).join('  •  ')}</p>
      </header>
      <div className="px-9 pb-9">
        {data.professional_summary && (
          <section>
            <Heading>Professional Summary</Heading>
            <p className="whitespace-pre-line">{data.professional_summary}</p>
          </section>
        )}

        {data.skills?.length > 0 && (
          <section>
            <Heading>Skills</Heading>
            <ul className="flex flex-wrap gap-2">
              {data.skills.map((s, i) => <li key={i} className="px-2.5 py-0.5 rounded bg-gray-100 text-[13px]" style={printSafe}>{s}</li>)}
            </ul>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section>
            <Heading>Work Experience</Heading>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline gap-4">
                    <h3 className="font-bold text-[15px]">{exp.position}</h3>
                    <span className="text-[13px] text-gray-500 whitespace-nowrap">{range(exp.start_date, exp.end_date, exp.is_current)}</span>
                  </div>
                  <p className="font-medium text-gray-600">{exp.company}</p>
                  <Bullets className="mt-1   space-y-0.5" text={exp.description} />
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
                  <h3 className="font-bold">{pr.name}</h3>
                  <Bullets className="" text={pr.description} />
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
                    <h3 className="font-bold">{e.degree}{e.field ? ` in ${e.field}` : ''}</h3>
                    <p className="text-gray-600">{e.institution}{e.gpa ? ` — GPA: ${e.gpa}` : ''}</p>
                  </div>
                  <span className="text-[13px] text-gray-500 whitespace-nowrap">{formatDate(e.graduation_date)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default BannerTemplate
