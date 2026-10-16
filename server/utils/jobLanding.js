import { CATEGORIES, COUNTRIES, POPULAR } from './workTaxonomy.js';
import { SITE_NAME, siteUrl, escapeHtml, seoTitle } from './blogSeo.js';

// Landing pages that rank for searches like "factory jobs in India" or "electrician jobs UK":
//   /jobs/in/<country>            e.g. /jobs/in/india
//   /jobs/in/<country>/<kind>     e.g. /jobs/in/india/factory-jobs
// They are built from live jobs, so a page with no jobs is noindex and left out of the sitemap.

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const COUNTRY_SLUGS = Object.fromEntries(COUNTRIES.filter((c) => c[0] !== 'XX').map((c) => [slug(c[1]), { code: c[0], name: c[1] }]));
export const slugOfCountry = (code) => Object.keys(COUNTRY_SLUGS).find((k) => COUNTRY_SLUGS[k].code === code);

const KINDS = {
    'office-jobs': { id: 'corporate', label: 'Office and corporate jobs', noun: 'office jobs', who: 'office staff, IT, sales, finance, HR and admin' },
    'factory-jobs': { id: 'factory', label: 'Factory and warehouse jobs', noun: 'factory and warehouse jobs', who: 'machine operators, packers, assemblers, forklift drivers and store staff' },
    'skilled-trade-jobs': { id: 'skilled_trade', label: 'Skilled trade jobs', noun: 'skilled trade jobs', who: 'electricians, plumbers, welders, carpenters, mechanics and drivers' },
    'daily-wage-jobs': { id: 'daily_wage', label: 'Daily wage jobs', noun: 'daily wage jobs', who: 'site helpers, loaders, cleaners, security guards, farm and domestic workers' },
};
export const KIND_SLUGS = Object.keys(KINDS);
export const kindSlugOf = (id) => KIND_SLUGS.find((k) => KINDS[k].id === id);
void CATEGORIES;

// What to have ready, by country. General guidance only, not legal advice.
const COUNTRY_TIPS = {
    IN: ['Keep your Aadhaar or another photo ID, and a bank account in your own name, ready.', 'Carry skill or ITI certificates and your previous employers\' contact details.', 'Ask whether pay is per day, per week or per month, and when it is paid.'],
    GB: ['Have proof of your right to work in the UK ready. Employers must check it.', 'Have your National Insurance number and a UK bank account. Construction and site work often needs a CSCS card.', 'Ask for the hourly rate, hours and how overtime is paid. Pay must meet the legal minimum wage for your age.'],
    CA: ['Have your Social Insurance Number and proof you can work in Canada (citizen, permanent resident or a valid work permit).', 'Safety tickets such as WHMIS or first aid are often asked for. Trades may ask for Red Seal or provincial certification.', 'Ask for the hourly rate, hours and pay period in writing.'],
    US: ['Have proof you are allowed to work in the US ready. Employers must check it (Form I-9).', 'Have your Social Security number and a bank account. Construction and warehouse work may ask for an OSHA card or forklift certification.', 'Ask for the hourly rate, hours and pay day in writing. Overtime rules are set by law.'],
    AU: ['Have proof of your right to work in Australia (citizen, permanent resident or a visa with work rights).', 'Have your tax file number and an Australian bank account. Construction sites need a White Card.', 'Ask for the pay rate, hours and award or agreement that applies, in writing.'],
    AE: ['Your employer arranges your work visa and Emirates ID. Do not pay anyone for a visa or job offer.', 'Never hand your passport to an employer to keep.', 'Get the job offer and contract in writing before you travel, and check the pay, hours and housing.'],
    ZA: ['Have your South African ID or a valid work permit, and a bank account.', 'Security work needs PSIRA registration. Many trades ask for a trade test certificate.', 'Ask for the daily or monthly rate in writing before you start.'],
    DEFAULT: ['Keep a photo ID and your trade or skill certificates ready, and the names of people who can vouch for your work.', 'Ask for the pay, hours and place of work in writing before you start.', 'Meet at the workplace or somewhere public, and tell someone where you are going.'],
};
const KIND_TIPS = {
    corporate: ['Match your resume to the job description and keep it to one or two pages.', 'Put numbers on your results, such as sales closed or time saved.'],
    factory: ['Say which machines and shifts you have worked on, and any forklift or safety training.', 'Ask whether shifts, overtime and transport or meals are included.'],
    skilled_trade: ['List the work you have done, such as wiring, welding or plumbing, and any licence or certificate.', 'Say if you bring your own tools and whether you can travel to sites.'],
    daily_wage: ['Ask if payment is daily or weekly and who pays, the employer or a contractor.', 'Check the work place, hours and safety gear before you agree.'],
};

const faqsFor = (country, kind) => {
    const where = country ? country.name : 'your country';
    const what = kind ? KINDS[kind].noun : 'jobs';
    return [
        { q: `How do I find ${what} in ${where}?`, a: `Browse the open ${what} on this page, open a job and apply with the employer. You can also create a free "available to work" profile so approved employers can contact you.` },
        { q: 'Do I have to pay to get a job?', a: 'No. A genuine employer never charges a fee, deposit or commission for a job. If someone asks for money, do not pay and report the job using the Report button on the job page.' },
        { q: 'Can employers find me without my phone number being shown?', a: 'Yes. Employers see your trade, experience, area and expected pay. Your name, phone and email stay hidden until you accept a request.' },
    ];
};

export const resolveLanding = (countrySlug, kindSlug) => {
    const country = COUNTRY_SLUGS[String(countrySlug || '').toLowerCase()];
    if (!country) return null;
    if (kindSlug === undefined || kindSlug === null || kindSlug === '') return { country, kindSlug: null, kind: null };
    const kind = KINDS[String(kindSlug).toLowerCase()];
    return kind ? { country, kindSlug: String(kindSlug).toLowerCase(), kind } : null;
};

export const landingPath = (country, kindSlug) => `/jobs/in/${slugOfCountry(country.code)}${kindSlug ? `/${kindSlug}` : ''}`;

export const landingContent = ({ country, kindSlug, kind }, total) => {
    const place = country.name;
    const h1 = kind ? `${kind.label} in ${place}` : `Jobs in ${place}`;
    const intro = kind
        ? `Find ${kind.noun} in ${place}: roles for ${kind.who}. ${total ? `${total} open ${total === 1 ? 'job' : 'jobs'} right now.` : 'New jobs are added often.'} Apply directly with the employer, or list yourself as available and let employers contact you.`
        : `Find office, factory, skilled trade and daily wage jobs in ${place}. ${total ? `${total} open ${total === 1 ? 'job' : 'jobs'} right now.` : 'New jobs are added often.'} Apply directly with the employer, or list yourself as available and let employers contact you.`;
    const tips = [...(kind ? KIND_TIPS[kind.id] : []), ...(COUNTRY_TIPS[country.code] || COUNTRY_TIPS.DEFAULT)];
    const links = [
        ...(kindSlug ? [{ name: `All jobs in ${place}`, path: landingPath(country) }] : []),
        ...KIND_SLUGS.filter((k) => k !== kindSlug).map((k) => ({ name: `${KINDS[k].label} in ${place}`, path: landingPath(country, k) })),
        ...POPULAR.filter((c) => c !== country.code).slice(0, 6).map((code) => COUNTRIES.find((c) => c[0] === code)).filter(Boolean).map((c) => ({ name: kind ? `${kind.label} in ${c[1]}` : `Jobs in ${c[1]}`, path: landingPath({ code: c[0] }, kindSlug) })),
    ];
    return { h1, intro, tips, faqs: faqsFor(country, kindSlug), links, path: landingPath(country, kindSlug) };
};

export const landingSeo = (res, content, total, jobs) => {
    const url = `${siteUrl()}${content.path}`;
    const crumbs = [{ name: 'Home', url: `${siteUrl()}/` }, { name: 'Jobs', url: `${siteUrl()}/jobs` }, { name: res.kind ? res.country.name : content.h1, url: `${siteUrl()}${landingPath(res.country)}` }, ...(res.kind ? [{ name: res.kind.label, url }] : [])];
    return {
        fullTitle: seoTitle(`${content.h1}${total ? ` (${total} open)` : ''}`),
        description: `${content.intro}`.slice(0, 160),
        canonical: url, robots: total > 0 ? 'index, follow' : 'noindex, follow', type: 'website',
        keywords: [content.h1, `${res.kind ? res.kind.noun : 'jobs'} ${res.country.name}`, 'apply', 'no fee'].join(', '),
        jsonLd: [
            { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })) },
            ...(jobs.length ? [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: jobs.map((j, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteUrl()}/jobs/${j.slug}`, name: j.title })) }] : []),
            { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: content.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
        ],
    };
};

export const landingHtml = (res, content, jobs) => `
<section class="ssr-article">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/jobs">Jobs</a> › ${res.kind ? `<a href="${escapeHtml(landingPath(res.country))}">${escapeHtml(res.country.name)}</a> › ${escapeHtml(res.kind.label)}` : escapeHtml(res.country.name)}</nav>
  <h1>${escapeHtml(content.h1)}</h1>
  <p>${escapeHtml(content.intro)}</p>
  ${jobs.length ? `<ul>${jobs.map((j) => `<li><h2><a href="/jobs/${escapeHtml(j.slug)}">${escapeHtml(j.title)}</a></h2><p>${escapeHtml(j.company)}${j.location ? ` · ${escapeHtml(j.location)}` : ''}${j.salary ? ` · ${escapeHtml(j.salary)}` : ''}</p></li>`).join('')}</ul>` : '<p>There are no open jobs here right now. Check back soon, or list yourself as available to work.</p>'}
  <h2>Before you apply</h2><ul>${content.tips.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
  <h2>Questions</h2>${content.faqs.map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`).join('')}
  <h2>More jobs</h2><ul>${content.links.map((l) => `<li><a href="${escapeHtml(l.path)}">${escapeHtml(l.name)}</a></li>`).join('')}</ul>
</section>`;

export const landingNotFound = (path) => ({
    fullTitle: `Page not found | ${SITE_NAME}`, description: 'This page could not be found.', canonical: `${siteUrl()}${path}`, robots: 'noindex, nofollow',
    body: '<section class="ssr-article"><h1>Page not found</h1><p><a href="/jobs">See all open jobs</a></p></section>', jsonLd: [],
});
