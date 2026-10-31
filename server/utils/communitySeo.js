import { SITE_NAME, siteUrl, escapeHtml, seoTitle } from './blogSeo.js';
import { SALARY_MIN, REVIEW_MIN, money, PERIOD_LABEL } from './communityCore.js';

const abs = (p) => `${siteUrl()}${p}`;
const e = escapeHtml;
const breadcrumbLd = (items) => ({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: b.url })),
});
const crumbHtml = (items) => `<nav aria-label="Breadcrumb">${items.map((b, i) => (b.href ? `<a href="${e(b.href)}">${e(b.name)}</a>` : e(b.name)) + (i < items.length - 1 ? ' › ' : '')).join('')}</nav>`;
const paragraphs = (t) => String(t || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
const paraHtml = (t) => paragraphs(t).map((p) => `<p>${e(p).replace(/\n/g, '<br>')}</p>`).join('');
const trim = (t, n) => (t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t);
const ROBOTS_ON = 'index, follow, max-image-preview:large';

const pageSeo = (o) => ({ fullTitle: seoTitle(o.title), title: o.title, description: o.description, keywords: o.keywords || '', canonical: abs(o.path), robots: o.index ? ROBOTS_ON : 'noindex, follow', image: abs('/og-image.png'), imageAlt: o.title, type: 'website', url: abs(o.path) });

export const LEVEL_PAGES = {
    fresher: { path: '/jobs/interview-questions/fresher', name: 'Fresher', h1: 'Interview questions and answers for freshers',
        title: 'Fresher Interview Questions and Answers', description: 'Common interview questions for freshers and first-job seekers, with a model answer for each and answers shared by other job seekers.' },
    experienced: { path: '/jobs/interview-questions/experienced', name: 'Experienced', h1: 'Interview questions and answers for experienced candidates',
        title: 'Interview Questions for Experienced Candidates', description: 'Interview questions for people with work experience: career moves, leadership, tough situations and role-specific topics, with model answers.' },
};

// ---------- interview questions ----------
export const questionsIndexView = ({ questions, level }) => {
    const lp = level ? LEVEL_PAGES[level] : null;
    const path = lp ? lp.path : '/jobs/interview-questions';
    const title = lp ? lp.title : 'Interview Questions and Answers';
    const description = lp ? lp.description : 'Interview questions with model answers for freshers and experienced candidates, in tech and non-tech jobs. Read how others answered and add your own.';
    const crumbs = [{ name: 'Home', url: abs('/') }, { name: 'Jobs', url: abs('/jobs') }, { name: 'Interview questions', url: abs('/jobs/interview-questions') }, ...(lp ? [{ name: lp.name, url: abs(lp.path) }] : [])];
    return {
        seo: pageSeo({ title, description, path, index: questions.length > 0, keywords: 'interview questions, interview questions and answers, fresher interview questions, experienced interview questions' }),
        jsonLd: [
            { '@context': 'https://schema.org', '@type': 'CollectionPage', name: lp ? lp.h1 : 'Interview questions and answers', url: abs(path), inLanguage: 'en',
                mainEntity: { '@type': 'ItemList', itemListElement: questions.slice(0, 100).map((q, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/jobs/interview-questions/${q.slug}`), name: q.question })) } },
            breadcrumbLd(crumbs),
        ],
        breadcrumbs: crumbs,
    };
};

export const questionsIndexHtml = ({ questions, level }) => {
    const lp = level ? LEVEL_PAGES[level] : null;
    const cats = [...new Set(questions.map((q) => q.category))];
    return `<section class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Jobs', href: '/jobs' }, { name: 'Interview questions', href: lp ? '/jobs/interview-questions' : undefined }, ...(lp ? [{ name: lp.name }] : [])].filter(Boolean))}
  <h1>${e(lp ? lp.h1 : 'Interview questions and answers')}</h1>
  <p>${e(lp ? lp.description : 'Practise the questions employers really ask. Each has a model answer, and you can read answers from other job seekers or add your own.')}</p>
  <p><a href="/jobs/interview-questions/fresher">Fresher questions</a> · <a href="/jobs/interview-questions/experienced">Experienced questions</a> · <a href="/jobs/salaries">Salaries</a> · <a href="/jobs/company-reviews">Company reviews</a></p>
  ${cats.map((c) => `<h2>${e(c)}</h2><ul>${questions.filter((q) => q.category === c).map((q) => `<li><a href="/jobs/interview-questions/${e(q.slug)}">${e(q.question)}</a></li>`).join('')}</ul>`).join('')}
</section>`;
};

const authorOrg = { '@type': 'Organization', name: SITE_NAME, url: siteUrl() };
export const questionView = ({ q, answers, related }) => {
    const path = `/jobs/interview-questions/${q.slug}`;
    const levelName = q.level === 'fresher' ? 'freshers' : q.level === 'experienced' ? 'experienced candidates' : 'freshers and experienced candidates';
    const title = trim(q.question, 42);
    const lead = paragraphs(q.modelAnswer)[0] || '';
    const description = trim(`How to answer "${q.question}" A model answer for ${levelName}, plus answers from other job seekers.`, 145);
    const hasAnswer = Boolean(lead) || answers.length > 0;
    const lp = q.level === 'fresher' ? LEVEL_PAGES.fresher : q.level === 'experienced' ? LEVEL_PAGES.experienced : null;
    const crumbs = [{ name: 'Home', url: abs('/') }, { name: 'Jobs', url: abs('/jobs') }, { name: 'Interview questions', url: abs('/jobs/interview-questions') }, ...(lp ? [{ name: lp.name, url: abs(lp.path) }] : []), { name: trim(q.question, 60), url: abs(path) }];
    const question = {
        '@type': 'Question', name: q.question, text: q.question, answerCount: (lead ? 1 : 0) + answers.length,
        ...(q.createdAt ? { dateCreated: new Date(q.createdAt).toISOString() } : {}),
        author: authorOrg,
        ...(lead ? { acceptedAnswer: { '@type': 'Answer', text: q.modelAnswer, author: authorOrg, url: abs(path) } } : {}),
        ...(answers.length ? { suggestedAnswer: answers.slice(0, 5).map((a) => ({ '@type': 'Answer', text: a.body, author: { '@type': 'Person', name: a.displayName }, dateCreated: new Date(a.createdAt).toISOString(), url: abs(path) })) } : {}),
    };
    return {
        seo: pageSeo({ title, description, path, index: hasAnswer, keywords: `${q.question}, interview question, ${q.category}` }),
        jsonLd: [{ '@context': 'https://schema.org', '@type': 'QAPage', url: abs(path), name: q.question, inLanguage: 'en', mainEntity: question }, breadcrumbLd(crumbs)],
        breadcrumbs: crumbs, related,
    };
};

export const questionHtml = ({ q, answers, related }) => `<article class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Jobs', href: '/jobs' }, { name: 'Interview questions', href: '/jobs/interview-questions' }, { name: q.question }])}
  <h1>${e(q.question)}</h1>
  <p class="meta">${e(q.category)} · ${q.level === 'both' ? 'Freshers and experienced' : q.level === 'fresher' ? 'Freshers' : 'Experienced'}</p>
  ${q.modelAnswer ? `<h2>Model answer</h2>${paraHtml(q.modelAnswer)}` : ''}
  ${q.tips?.length ? `<h2>Tips</h2><ul>${q.tips.map((t) => `<li>${e(t)}</li>`).join('')}</ul>` : ''}
  ${q.learn ? `<h2>Learn this topic</h2><p><a href="${e(q.learn.url)}">${e(q.learn.title)}</a> ${q.learn.title !== q.learn.courseTitle ? ` in the course ${e(q.learn.courseTitle)}` : ''}.</p>` : ''}
  ${answers.length ? `<h2>Answers from other job seekers</h2>${answers.map((a) => `<blockquote>${paraHtml(a.body)}<p class="meta">${e(a.displayName)}</p></blockquote>`).join('')}` : ''}
  <p>Sign in to add your own answer.</p>
  ${related?.length ? `<h2>More questions</h2><ul>${related.map((r) => `<li><a href="/jobs/interview-questions/${e(r.slug)}">${e(r.question)}</a></li>`).join('')}</ul>` : ''}
</article>`;

// ---------- salaries ----------
export const salariesIndexView = ({ roles, ready }) => {
    const crumbs = [{ name: 'Home', url: abs('/') }, { name: 'Jobs', url: abs('/jobs') }, { name: 'Salaries', url: abs('/jobs/salaries') }];
    return {
        seo: pageSeo({ title: 'Salaries by Job Role, Shared by Workers', description: 'Pay ranges for jobs, built from salaries shared by real workers. Share yours anonymously. A range appears once enough reports are in.', path: '/jobs/salaries', index: Boolean(ready), keywords: 'salary, salary by job, how much do jobs pay, wages' }),
        jsonLd: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Salaries by job role', url: abs('/jobs/salaries'), inLanguage: 'en', mainEntity: { '@type': 'ItemList', itemListElement: roles.slice(0, 100).map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/jobs/salaries/${r.slug}`), name: `${r.title} salary` })) } }, breadcrumbLd(crumbs)],
        breadcrumbs: crumbs,
    };
};
export const salariesIndexHtml = ({ roles }) => `<section class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Jobs', href: '/jobs' }, { name: 'Salaries' }])}
  <h1>Salaries by job role</h1>
  <p>Pay shared by people who do the job. Figures are self-reported, reviewed before they appear, and never mixed across currencies. A range is shown only when at least ${SALARY_MIN} reports back it.</p>
  ${roles.length ? `<ul>${roles.map((r) => `<li><a href="/jobs/salaries/${e(r.slug)}">${e(r.title)}</a> <span class="meta">${r.count} report${r.count === 1 ? '' : 's'}</span></li>`).join('')}</ul>` : '<p>No salaries have been shared yet. Be the first to add one.</p>'}
</section>`;

const PERIOD_ISO = { hour: 'PT1H', day: 'P1D', month: 'P1M', year: 'P1Y' };
export const salaryRoleView = ({ title, slug, groups, recent }) => {
    const path = `/jobs/salaries/${slug}`;
    const ready = groups.filter((g) => g.enough);
    const lead = ready[0];
    const description = lead
        ? trim(`${title} salary in ${lead.country}: ${money(lead.min, lead.currency)} to ${money(lead.max, lead.currency)} ${PERIOD_LABEL[lead.period]}, median ${money(lead.median, lead.currency)}, from ${lead.count} worker reports.`, 158)
        : trim(`What does a ${title} earn? Salary reports for this role are still being collected. Share yours anonymously.`, 158);
    const crumbs = [{ name: 'Home', url: abs('/') }, { name: 'Jobs', url: abs('/jobs') }, { name: 'Salaries', url: abs('/jobs/salaries') }, { name: `${title} salary`, url: abs(path) }];
    const jsonLd = [breadcrumbLd(crumbs)];
    if (ready.length) {
        jsonLd.unshift({
            '@context': 'https://schema.org', '@type': 'Occupation', name: title, url: abs(path),
            estimatedSalary: ready.map((g) => ({ '@type': 'MonetaryAmountDistribution', name: 'Reported pay', currency: g.currency, duration: PERIOD_ISO[g.period], minValue: g.min, median: g.median, maxValue: g.max })),
            occupationLocation: ready.map((g) => ({ '@type': 'Country', name: g.country })),
        });
    }
    return { seo: pageSeo({ title: trim(`${title} Salary${lead ? ` in ${lead.country}` : ''}`, 42), description, path, index: ready.length > 0, keywords: `${title} salary, ${title} pay` }), jsonLd, breadcrumbs: crumbs };
};
export const salaryRoleHtml = ({ title, groups, recent }) => `<article class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Jobs', href: '/jobs' }, { name: 'Salaries', href: '/jobs/salaries' }, { name: `${title} salary` }])}
  <h1>${e(title)} salary</h1>
  ${groups.length ? groups.map((g) => g.enough
        ? `<h2>${e(g.country)}</h2><p>Reported pay ${PERIOD_LABEL[g.period]}: lowest ${e(money(g.min, g.currency))}, median ${e(money(g.median, g.currency))}, highest ${e(money(g.max, g.currency))}. Based on ${g.count} reports.</p>`
        : `<h2>${e(g.country)}</h2><p>${g.totalReports} report${g.totalReports === 1 ? '' : 's'} so far. A range appears once at least ${SALARY_MIN} agree on the currency and pay period.</p>`).join('')
    : '<p>No approved salary reports for this role yet.</p>'}
  <p class="meta">Self-reported and reviewed before publishing. Real pay depends on employer, city and experience.</p>
</article>`;

// ---------- company reviews ----------
export const companiesIndexView = ({ companies, ready }) => {
    const crumbs = [{ name: 'Home', url: abs('/') }, { name: 'Jobs', url: abs('/jobs') }, { name: 'Company reviews', url: abs('/jobs/company-reviews') }];
    return {
        seo: pageSeo({ title: 'Company Reviews from Employees', description: 'Read honest reviews of employers from people who worked or interviewed there, or add your own anonymously. Every review is checked before it appears.', path: '/jobs/company-reviews', index: Boolean(ready), keywords: 'company reviews, employer reviews, working at' }),
        jsonLd: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Company reviews', url: abs('/jobs/company-reviews'), inLanguage: 'en', mainEntity: { '@type': 'ItemList', itemListElement: companies.slice(0, 100).map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/jobs/company-reviews/${c.slug}`), name: c.company })) } }, breadcrumbLd(crumbs)],
        breadcrumbs: crumbs,
    };
};
export const companiesIndexHtml = ({ companies }) => `<section class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Jobs', href: '/jobs' }, { name: 'Company reviews' }])}
  <h1>Company reviews</h1>
  <p>Reviews from people who worked at, or interviewed with, an employer. Each one is read before it is published.</p>
  ${companies.length ? `<ul>${companies.map((c) => `<li><a href="/jobs/company-reviews/${e(c.slug)}">${e(c.company)}</a> <span class="meta">${c.avg.toFixed(1)} / 5 from ${c.count} review${c.count === 1 ? '' : 's'}</span></li>`).join('')}</ul>` : '<p>No reviews yet. Be the first to review an employer.</p>'}
</section>`;

export const companyView = ({ company, slug, avg, count, reviews }) => {
    const path = `/jobs/company-reviews/${slug}`;
    const enough = count >= REVIEW_MIN;
    const crumbs = [{ name: 'Home', url: abs('/') }, { name: 'Jobs', url: abs('/jobs') }, { name: 'Company reviews', url: abs('/jobs/company-reviews') }, { name: company, url: abs(path) }];
    const description = trim(enough ? `${company} reviews: ${avg.toFixed(1)} out of 5 from ${count} employees and candidates. Read the pros and cons, or add your own review.` : `Reviews of ${company} from people who worked or interviewed there. Add your own review anonymously.`, 158);
    const org = { '@context': 'https://schema.org', '@type': 'Organization', name: company, url: abs(path) };
    if (enough) {
        org.aggregateRating = { '@type': 'AggregateRating', ratingValue: Number(avg.toFixed(1)), reviewCount: count, bestRating: 5, worstRating: 1 };
        org.review = reviews.slice(0, 5).map((r) => ({ '@type': 'Review', name: r.title, reviewBody: [r.pros && `Pros: ${r.pros}`, r.cons && `Cons: ${r.cons}`].filter(Boolean).join(' '), reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 }, author: { '@type': 'Person', name: r.displayName }, datePublished: new Date(r.createdAt).toISOString() }));
    }
    return { seo: pageSeo({ title: trim(`${company} Reviews`, 42), description, path, index: enough, keywords: `${company} reviews, working at ${company}` }), jsonLd: [org, breadcrumbLd(crumbs)], breadcrumbs: crumbs };
};
export const companyHtml = ({ company, avg, count, reviews }) => `<article class="ssr-article">
  ${crumbHtml([{ name: 'Home', href: '/' }, { name: 'Jobs', href: '/jobs' }, { name: 'Company reviews', href: '/jobs/company-reviews' }, { name: company }])}
  <h1>${e(company)} reviews</h1>
  ${count ? `<p>${avg.toFixed(1)} out of 5 from ${count} review${count === 1 ? '' : 's'}.</p>` : '<p>No approved reviews yet.</p>'}
  ${reviews.map((r) => `<section><h2>${e(r.title)}</h2><p class="meta">${r.rating} / 5 · ${e(r.displayName)}${r.jobTitle ? ` · ${e(r.jobTitle)}` : ''}</p>${r.pros ? `<p><strong>Pros:</strong> ${e(r.pros)}</p>` : ''}${r.cons ? `<p><strong>Cons:</strong> ${e(r.cons)}</p>` : ''}</section>`).join('')}
  <p class="meta">Reviews are personal opinions of the people who wrote them.</p>
</article>`;
