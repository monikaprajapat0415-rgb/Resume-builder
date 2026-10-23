import { SITE_NAME, siteUrl, escapeHtml as esc, seoTitle } from './blogSeo.js';
import { EXAMPLES } from './exampleResumes.js';

// What a resume or CV example looks like as plain text sections. The server page prints this for crawlers;
// the browser page draws the real template. Dates follow the builders ("2023-04" -> "Apr 2023").
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fm = (d) => { const m = /^(\d{4})-(\d{2})$/.exec(String(d || '').trim()); return m && MONTHS[+m[2] - 1] ? `${MONTHS[+m[2] - 1]} ${m[1]}` : String(d || ''); };
const span = (s, e, cur) => [fm(s), cur ? 'Present' : fm(e)].filter(Boolean).join(' – ');
const lines = (t) => String(t || '').split('\n').map((x) => x.trim()).filter(Boolean);

export const exampleSections = (e) => {
    if (e.kind === 'resume') {
        const d = e.data;
        const out = [];
        if (d.professional_summary) out.push({ heading: 'Summary', text: d.professional_summary });
        if (d.experience?.length) out.push({ heading: 'Work Experience', blocks: d.experience.map((x) => ({ title: `${x.position}, ${x.company}`, meta: span(x.start_date, x.end_date, x.is_current), bullets: lines(x.description) })) });
        if (d.project?.length) out.push({ heading: 'Projects', blocks: d.project.map((x) => ({ title: x.name, meta: x.type, bullets: lines(x.description) })) });
        if (d.education?.length) out.push({ heading: 'Education', blocks: d.education.map((x) => ({ title: [x.degree, x.field].filter(Boolean).join(', '), meta: [x.institution, fm(x.graduation_date), x.gpa].filter(Boolean).join(' | ') })) });
        if (d.skills?.length) out.push({ heading: 'Skills', text: d.skills.join(', ') });
        return out;
    }
    const c = e.cv;
    const job = (x) => ({ title: [x.job_title, x.company].filter(Boolean).join(', '), meta: [[x.start_date, x.end_date].filter(Boolean).join(' – '), x.location].filter(Boolean).join(' | '), bullets: x.responsibilities || [] });
    const order = e.level === 'experienced' ? ['summary', 'skills', 'experience', 'internships', 'projects', 'education', 'certifications', 'achievements', 'languages'] : ['summary', 'education', 'internships', 'projects', 'skills', 'experience', 'certifications', 'achievements', 'languages'];
    const map = {
        summary: () => c.professional_summary && { heading: 'Professional Summary', text: c.professional_summary },
        skills: () => c.skills?.length && { heading: 'Technical Skills', text: c.skills.join(', ') },
        experience: () => c.experience?.length && { heading: 'Professional Experience', blocks: c.experience.map(job) },
        internships: () => c.internships?.length && { heading: 'Internships', blocks: c.internships.map(job) },
        projects: () => c.projects?.length && { heading: 'Projects', blocks: c.projects.map((p) => ({ title: p.project_name, meta: p.technologies?.length ? `Technologies: ${p.technologies.join(', ')}` : '', text: p.description, bullets: p.achievements || [] })) },
        education: () => c.education?.length && { heading: 'Education', blocks: c.education.map((x) => ({ title: x.qualification, meta: [x.institution, x.graduation_year].filter(Boolean).join(' | ') })) },
        certifications: () => c.certifications?.length && { heading: 'Certifications', bullets: c.certifications },
        achievements: () => c.achievements?.length && { heading: 'Achievements', bullets: c.achievements },
        languages: () => c.languages?.length && { heading: 'Languages', text: c.languages.join(', ') },
    };
    return order.map((k) => map[k]?.()).filter(Boolean);
};

export const examplePerson = (e) => (e.kind === 'resume' ? e.data.personal_info : e.personal);
const contact = (p) => [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).join(' | ');

export const exampleTypeName = (e) => (e.kind === 'cv' ? 'CV' : 'resume');
const url = (slug) => `${siteUrl()}/examples${slug ? `/${slug}` : ''}`;
const crumbLd = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })) });
const crumbHtml = (items) => `<nav aria-label="Breadcrumb">${items.map((b, i) => (b.href ? `<a href="${esc(b.href)}">${esc(b.name)}</a>` : esc(b.name)) + (i < items.length - 1 ? ' › ' : '')).join('')}</nav>`;

export const EXAMPLES_TITLE = '100/100 ATS Resume and CV Examples';
export const EXAMPLES_DESC = 'Ten real resume and CV examples for developers, nurses, electricians, teachers and more. Each one passes every automatic ATS check. Copy the format.';
export const EXAMPLES_HOW = 'Each example was exported as a PDF and run through the same rule-based checks as our free ATS checker: readable text, standard section headings, contact details, bullet points, dates and measurable results. All ten score 100 on every one of those checks. The checker also gives a content and keyword score that depends on the job you are applying for, so use your own job advert and check your finished file.';

export const examplesIndexJsonLd = () => [
    {
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: EXAMPLES_TITLE, url: url(), description: EXAMPLES_DESC, inLanguage: 'en',
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: siteUrl() },
        mainEntity: { '@type': 'ItemList', numberOfItems: EXAMPLES.length, itemListElement: EXAMPLES.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: url(e.slug), name: e.title })) },
    },
    crumbLd([{ name: 'Home', url: `${siteUrl()}/` }, { name: 'Examples', url: url() }]),
];

export const examplesIndexHtml = () => `
<section class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Examples' }])}
  <h1>Resume and CV examples that score 100/100 on every ATS check</h1>
  <p>${esc(EXAMPLES_HOW)}</p>
  ${[['resume', 'Resume examples'], ['cv', 'CV examples']].map(([k, h]) => `<h2>${h}</h2><ul>${EXAMPLES.filter((e) => e.kind === k).map((e) => `<li><a href="/examples/${esc(e.slug)}">${esc(e.title)}</a> (${esc(e.region)}): ${esc(e.intro)}</li>`).join('')}</ul>`).join('')}
  <p><a href="/app?state=register">Build your own with the AI resume builder and CV maker</a> · <a href="/features/ats-checker">Check your file with the free ATS checker</a> · <a href="/templates">Browse resume templates</a></p>
</section>`;

export const exampleView = (e) => {
    const link = url(e.slug);
    const seo = { title: e.title, fullTitle: seoTitle(e.title), description: e.metaDescription, keywords: `${e.role.toLowerCase()} ${exampleTypeName(e)} example, ${e.role.toLowerCase()} ${exampleTypeName(e)} sample, ats friendly ${exampleTypeName(e)}`, canonical: link, robots: 'index, follow, max-image-preview:large', type: 'article', url: link };
    const jsonLd = [
        { '@context': 'https://schema.org', '@type': 'WebPage', '@id': link, url: link, name: e.title, description: e.metaDescription, inLanguage: 'en', isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: siteUrl() } },
        crumbLd([{ name: 'Home', url: `${siteUrl()}/` }, { name: 'Examples', url: url() }, { name: e.title, url: link }]),
    ];
    return { seo, jsonLd };
};

export const exampleHtml = (e) => {
    const p = examplePerson(e);
    const block = (b) => `<div><h3>${esc(b.title)}</h3>${b.meta ? `<p>${esc(b.meta)}</p>` : ''}${b.text ? `<p>${esc(b.text)}</p>` : ''}${b.bullets?.length ? `<ul>${b.bullets.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>`;
    const others = EXAMPLES.filter((x) => x.slug !== e.slug && x.kind === e.kind).slice(0, 3).concat(EXAMPLES.filter((x) => x.slug !== e.slug && x.kind !== e.kind).slice(0, 2));
    return `
<article class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Examples', href: '/examples' }, { name: e.title }])}
  <h1>${esc(e.title)}</h1>
  <p>${esc(e.intro)}</p>
  <p>This is a sample ${exampleTypeName(e)} for a made-up person. It scores 100 on every automatic ATS check (readable text, standard headings, contact details, bullet points and measurable results). Replace every detail with your own.</p>
  <h2>The example</h2>
  <section aria-label="Sample ${exampleTypeName(e)} text">
    <h3>${esc(p.full_name)}${p.profession ? `, ${esc(p.profession)}` : ''}</h3>
    <p>${esc(contact(p))}</p>
    ${exampleSections(e).map((s) => `<h4>${esc(s.heading)}</h4>${s.text ? `<p>${esc(s.text)}</p>` : ''}${s.bullets ? `<ul>${s.bullets.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${s.blocks ? s.blocks.map(block).join('') : ''}`).join('')}
  </section>
  <h2>Why this ${exampleTypeName(e)} works</h2>
  <ul>${e.why.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
  <h2>Before you copy it</h2>
  <ul>${e.tips.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
  <p><a href="${e.kind === 'cv' ? '/cv-builder' : `/app?state=register&template=${esc(e.templateId)}`}">${e.kind === 'cv' ? 'Make your CV' : 'Use this layout for your resume'}</a> · <a href="/features/ats-checker">Check your file with the free ATS checker</a></p>
  <h2>More examples</h2>
  <ul>${others.map((x) => `<li><a href="/examples/${esc(x.slug)}">${esc(x.title)}</a></li>`).join('')}</ul>
</article>`;
};
