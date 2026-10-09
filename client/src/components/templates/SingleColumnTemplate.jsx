export default function SingleColumnTemplate({ data }) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-10 text-gray-900">
      {/* HEADER */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{data.personal.fullName}</h1>
        <p className="text-lg text-gray-600">{data.personal.title}</p>
        <p className="text-sm mt-2">
          {data.personal.location} | {data.personal.email} | {data.personal.linkedin}
        </p>
      </header>

      {/* SUMMARY */}
      <section className="mb-6">
        <h2 className="font-semibold text-lg border-b pb-1 mb-2">
          Professional Summary
        </h2>
        <p className="text-sm leading-relaxed">{data.summary}</p>
      </section>

      {/* SKILLS */}
      <section className="mb-6">
        <h2 className="font-semibold text-lg border-b pb-1 mb-2">
          Key Skills
        </h2>
        <ul className="flex flex-wrap gap-2 text-sm">
          {data.skills.map((skill, i) => (
            <li key={i} className="px-2 py-1 border rounded">
              {skill}
            </li>
          ))}
        </ul>
      </section>

      {/* EXPERIENCE */}
      <section className="mb-6">
        <h2 className="font-semibold text-lg border-b pb-1 mb-2">
          Experience
        </h2>
        {data.experience.map((job, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-semibold">
              {job.jobTitle} | {job.company}
            </h3>
            <p className="text-xs text-gray-500">
              {job.startDate} – {job.endDate} | {job.location}
            </p>
            <ul className="list-disc ml-5 text-sm mt-2 space-y-1">
              {job.achievements.map((a, idx) => (
                <li key={idx}>{a}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* EDUCATION */}
      <section className="mb-6">
        <h2 className="font-semibold text-lg border-b pb-1 mb-2">
          Education
        </h2>
        {data.education.map((edu, i) => (
          <div key={i}>
            <h3 className="font-semibold">
              {edu.degree} in {edu.major}
            </h3>
            <p className="text-sm">
              {edu.university} | {edu.year}
            </p>
          </div>
        ))}
      </section>

      {/* PROJECTS */}
      <section className="mb-6">
        <h2 className="font-semibold text-lg border-b pb-1 mb-2">
          Projects
        </h2>
        {data.projects.map((project, i) => (
          <div key={i} className="mb-3">
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-sm">{project.description}</p>
            <p className="text-xs text-gray-600">
              Tech: {project.technologies.join(", ")}
            </p>
          </div>
        ))}
      </section>

      {/* CERTIFICATIONS */}
      {data.certifications.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg border-b pb-1 mb-2">
            Certifications
          </h2>
          {data.certifications.map((cert, i) => (
            <p key={i} className="text-sm">
              {cert.name} – {cert.organization} ({cert.year})
            </p>
          ))}
        </section>
      )}
    </div>
  );
}
