import { SITE_NAME, siteUrl, escapeHtml, seoTitle } from './blogSeo.js';

const crumbHtml = (items) => `<nav aria-label="Breadcrumb">${items.map((b, i) => (b.href ? `<a href="${escapeHtml(b.href)}">${escapeHtml(b.name)}</a>` : escapeHtml(b.name)) + (i < items.length - 1 ? ' › ' : '')).join('')}</nav>`;
const day = (d) => new Date(d).toISOString().slice(0, 10);

// plain text (paragraphs, "- " bullet lines) -> safe HTML
export const textToHtml = (text) => {
    const blocks = String(text || '').split(/\n{2,}/);
    return blocks.map((b) => {
        const lines = b.split('\n').filter((l) => l.trim());
        if (!lines.length) return '';
        const out = []; let list = [];
        const flush = () => { if (list.length) { out.push(`<ul>${list.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul>`); list = []; } };
        let para = [];
        const flushP = () => { if (para.length) { out.push(`<p>${para.map(escapeHtml).join('<br>')}</p>`); para = []; } };
        for (const l of lines) {
            if (/^- /.test(l)) { flushP(); list.push(l.slice(2).trim()); } else { flush(); para.push(l.trim()); }
        }
        flush(); flushP();
        return out.join('');
    }).join('');
};

const TYPE_LD = { 'full-time': 'FULL_TIME', 'part-time': 'PART_TIME', contract: 'CONTRACTOR', internship: 'INTERN', temporary: 'TEMPORARY' };

export const jobPostingLd = (job) => {
    const ld = {
        '@context': 'https://schema.org', '@type': 'JobPosting',
        title: job.title,
        description: textToHtml(job.description) || `<p>${escapeHtml(job.title)} at ${escapeHtml(job.company)}.</p>`,
        datePosted: day(job.postedAt || job.createdAt),
        hiringOrganization: { '@type': 'Organization', name: job.company },
        url: `${siteUrl()}/jobs/${job.slug}`,
        directApply: false,
        identifier: { '@type': 'PropertyValue', name: job.company, value: job.externalId },
    };
    const et = TYPE_LD[String(job.employmentType || '').toLowerCase()];
    if (et) ld.employmentType = et;
    if (job.location) {
        const address = { '@type': 'PostalAddress', addressLocality: job.location };
        if (job.country) address.addressCountry = job.country;
        ld.jobLocation = { '@type': 'Place', address };
    }
    if (job.remote) {
        ld.jobLocationType = 'TELECOMMUTE';
        if (job.country) ld.applicantLocationRequirements = { '@type': 'Country', name: job.country };
    }
    return ld;
};

const breadcrumbLd = (items) => ({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
});

export const jobsIndexHtml = ({ jobs, total }) => `
<section class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Jobs' }])}
  <h1>Latest jobs from top companies</h1>
  <p>${total} open jobs from company career pages. Apply on each employer's own site.</p>
  <ul>${jobs.map((j) => `<li><h2><a href="/jobs/${escapeHtml(j.slug)}">${escapeHtml(j.title)}</a></h2><p>${escapeHtml(j.company)}${j.location ? ` · ${escapeHtml(j.location)}` : ''}${j.remote ? ' · Remote' : ''}${j.employmentType ? ` · ${escapeHtml(j.employmentType)}` : ''}</p></li>`).join('')}</ul>
</section>`;

export const jobHtml = ({ job, more }) => `
<article class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Jobs', href: '/jobs' }, { name: job.title }])}
  <h1>${escapeHtml(job.title)}</h1>
  <p class="meta">${escapeHtml(job.company)}${job.location ? ` · ${escapeHtml(job.location)}` : ''}${job.remote ? ' · Remote' : ''}${job.employmentType ? ` · ${escapeHtml(job.employmentType)}` : ''} · Posted <time datetime="${day(job.postedAt || job.createdAt)}">${day(job.postedAt || job.createdAt)}</time></p>
  <div>${textToHtml(job.description)}</div>
  <p><a href="${escapeHtml(job.applyUrl)}" rel="nofollow noopener noreferrer">Apply on the ${escapeHtml(job.company)} website</a></p>
  ${more.length ? `<h2>More jobs at ${escapeHtml(job.company)}</h2><ul>${more.map((m) => `<li><a href="/jobs/${escapeHtml(m.slug)}">${escapeHtml(m.title)}</a>${m.location ? ` · ${escapeHtml(m.location)}` : ''}</li>`).join('')}</ul>` : ''}
</article>`;

export const jobSeo = (job) => {
    const where = job.location ? ` in ${job.location}` : '';
    const desc = `${job.title} at ${job.company}${where}. ${String(job.description || '').replace(/\s+/g, ' ').slice(0, 110)}`.trim().slice(0, 160);
    return {
        fullTitle: seoTitle(`${job.title} at ${job.company}${where}`),
        description: desc, canonical: `${siteUrl()}/jobs/${job.slug}`, robots: 'index, follow', type: 'website',
        keywords: [job.title, job.company, job.location, 'jobs', 'apply'].filter(Boolean).join(', '),
        jsonLd: [jobPostingLd(job), breadcrumbLd([{ name: 'Home', url: `${siteUrl()}/` }, { name: 'Jobs', url: `${siteUrl()}/jobs` }, { name: job.title, url: `${siteUrl()}/jobs/${job.slug}` }])],
    };
};

export const jobsIndexSeo = () => ({
    fullTitle: seoTitle('Latest jobs from top companies'),
    description: 'Browse open jobs collected from company career pages. Search by role, company, location or remote, then apply on the employer site.',
    canonical: `${siteUrl()}/jobs`, robots: 'index, follow', type: 'website', keywords: 'jobs, careers, job openings, remote jobs, software jobs India',
    jsonLd: [breadcrumbLd([{ name: 'Home', url: `${siteUrl()}/` }, { name: 'Jobs', url: `${siteUrl()}/jobs` }])],
});

export const jobNotFound = (path) => ({
    fullTitle: `Job not found | ${SITE_NAME}`, description: 'This job is no longer available.', canonical: `${siteUrl()}${path}`, robots: 'noindex, nofollow',
    body: '<section class="ssr-article"><h1>This job is no longer available</h1><p><a href="/jobs">See all open jobs</a></p></section>', jsonLd: [],
});
