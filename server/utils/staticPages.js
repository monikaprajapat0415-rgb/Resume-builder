import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE_NAME, siteUrl, seoTitle, escapeHtml as esc } from './blogSeo.js';

// Server-rendered copy of the public pages that are not stored in the database (home, features, templates...).
// Search engines read this HTML; AI crawlers (GPTBot, ClaudeBot, PerplexityBot...) mostly do NOT run JavaScript, so
// without it they would see an empty page. React replaces it as soon as the app loads.
// Titles and descriptions must match the <SEO /> of the matching client page. Template and FAQ text is copied from the
// client source by scripts/exportStaticSeoData.mjs (staticSeoData.json), so there is one place to edit it.

const here = path.dirname(fileURLToPath(import.meta.url));
let DATA = null;
const data = () => (DATA ||= JSON.parse(fs.readFileSync(path.join(here, 'staticSeoData.json'), 'utf8')));
export const templateMeta = () => data().templates;

const crumbs = (items) => ({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${siteUrl()}${p}` })),
});
const faqLd = (faqs) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });

const a = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const faqHtml = (faqs) => faqs.length ? `<h2>Frequently asked questions</h2>${faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}` : '';
const wrap = (inner) => `<main class="ssr-article">${inner}</main>`;
const links = (items) => ul(items.map(([t, h, d]) => `${a(h, t)}${d ? `: ${esc(d)}` : ''}`));

const page = ({ path: p, title, description, keywords, body, jsonLd = [], robots }) => ({
    fullTitle: seoTitle(title), description, keywords, canonical: `${siteUrl()}${p}`,
    robots: robots || 'index, follow, max-image-preview:large', type: 'website', body: wrap(body), jsonLd,
});

export const flags = { imageEnhancer: true, tools: {} };   // set from Admin > Free tools by staticSeoController before a page is built
const MAIN_LINKS_ALL = [
    ['Free resume builder', '/app', 'build and download an ATS-friendly resume'],
    ['Resume templates', '/templates', 'free ATS-friendly layouts, each with an honest ATS rating'],
    ['Free ATS resume checker', '/features/ats-checker', 'upload a PDF or Word resume and get a score with fixes'],
    ['AI CV builder', '/cv-builder', 'a tailored, ATS-friendly CV from your real details'],
    ['Resume job description matcher', '/resume-job-description-matcher', 'see which job keywords your resume has and lacks'],
    ['Resume and CV examples', '/examples', 'ten sample resumes and CVs'],
    ['Image enhancer', '/products/image-enhancer', 'sharpen photos and upscale them to 2K, 4K or 8K'],
    ['Free career tools', '/products', 'cover letter, resume bullets, mock interview, offer comparison, LinkedIn text, ATS checker and image tools'],
    ['Jobs', '/jobs', 'open jobs for office, factory and skilled work'],
    ['Career roadmaps', '/roadmaps', 'step-by-step paths for careers and technologies'],
    ['Free tutorials', '/learn', 'courses with lessons, tasks and downloads'],
    ['Blog', '/blog', 'resume writing and career advice'],
];
const mainLinks = () => MAIN_LINKS_ALL.filter(([, h]) => flags.imageEnhancer || h !== '/products/image-enhancer');

// ---- Home. `site` is the merged Admin > Homepage text, so the server copy follows what the admin edits.
export const homePage = (site) => {
    const faqs = [1, 2, 3, 4, 5, 6].map((n) => ({ q: site[`faq_${n}_q`], a: site[`faq_${n}_a`] })).filter((f) => f.q && f.a);
    const chips = String(site.hero_chips || '').split(',').map((t) => t.trim()).filter(Boolean);
    const body = `
<h1>${esc(`${site.hero_line1} ${site.hero_highlight} ${site.hero_line2}`)}</h1>
<p>${esc(site.hero_subtext)}</p>
${chips.length ? ul(chips.map(esc)) : ''}
<p>${a('/app', site.hero_button)} · ${a('/features/ats-checker', 'Check my resume (ATS)')}</p>
<h2>${esc(site.why_title)}</h2>
${ul([
    '<strong>Built for every kind of job.</strong> Templates and examples for office roles as well as factory, trade and field work, not only tech.',
    '<strong>ATS-friendly by design.</strong> Clean layouts that applicant tracking systems can read, plus a checker to test your own resume.',
    '<strong>You control the content.</strong> AI suggests wording for your summary and bullet points. You review and edit everything before you download.',
    '<strong>Free to start.</strong> Build and download without paying. Create an account to save your resumes and apply to jobs.',
])}
<h2>Our working process</h2>
<ol>
<li><strong>Add your details.</strong> Enter your experience, education and skills, or start from an example. Nothing is shared with employers.</li>
<li><strong>Pick a template and polish it.</strong> Choose an ATS-friendly layout and use AI suggestions for your summary and bullet points. You stay in control of every word.</li>
<li><strong>Download, check and apply.</strong> Download your resume, test it with the ATS checker, then find jobs and prepare with interview questions.</li>
</ol>
<h2>What you can do here</h2>
${links(mainLinks())}
<h2>${esc(site.career_title)}</h2>
<p>${esc(site.career_text)}</p>
${links([['Interview questions', '/jobs/interview-questions', 'with short model answers'], ['Salaries', '/jobs/salaries', 'ranges shown only when several reports agree'], ['Company reviews', '/jobs/company-reviews', 'ratings shown only with enough reviews'], ['Career roadmaps', '/roadmaps']])}
${faqHtml(faqs)}`;
    return page({
        path: '/', title: 'Prime Resume AI – Free AI Resume Builder & CV Maker Online',
        description: 'Create professional resumes in minutes with AI. Choose ATS-friendly templates and download your CV. Free resume builder for freshers and professionals. ',
        keywords: 'resume builder, AI resume builder, free resume maker, CV generator, ATS friendly resume',
        body, jsonLd: faqs.length ? [faqLd(faqs)] : [],
    });
};

// ---- Features
export const featuresPage = () => page({
    path: '/features', title: 'Features: Resume Builder & ATS Checker',
    description: 'Everything in Prime Resume AI: a free ATS resume checker, AI writing help, ATS-friendly templates, resume import and AI cover letters.',
    body: `<h1>Everything you need to get shortlisted</h1>
<p>Build, check and improve your resume with AI, all in one place.</p>
<h2>ATS Resume Checker</h2>
<p>Drop your resume (PDF or Word) and get an ATS score with a full report: formatting, sections, keywords, and exactly what to fix. ${a('/features/ats-checker', 'Open the ATS checker')}.</p>
<h2>What the builder offers</h2>
${ul([
    '<strong>ATS match for a job.</strong> Paste a job description inside the builder and see which keywords your resume is missing.',
    '<strong>AI writing help.</strong> Let AI polish your professional summary and turn job duties into achievement-focused bullet points.',
    `<strong>ATS-friendly templates.</strong> Clean, recruiter-tested layouts. Change colours and templates any time without losing your content. ${a('/templates', 'Browse templates')}.`,
    '<strong>Import your old resume.</strong> Upload a PDF and we fill the builder for you, so you edit instead of retyping.',
    '<strong>AI cover letters.</strong> Generate a cover letter tailored to the job and company from your resume details.',
    `<strong>AI CV builder.</strong> Enter the job and your details and AI writes a tailored, ATS-friendly CV using only your real experience. ${a('/cv-builder', 'Build a CV')}.`,
    `<strong>Resume job match.</strong> Paste a job post and your resume to see which keywords match, which are weak and which are missing. Free and private. ${a('/resume-job-description-matcher', 'Try the matcher')}.`,
    '<strong>Download or share.</strong> Download your resume or share a public link with recruiters in one click.',
])}
<p>${a('/app', 'Create my resume')}</p>`,
    jsonLd: [crumbs([['Home', '/'], ['Features', '/features']])],
});

// ---- Free ATS checker
export const atsCheckerPage = () => page({
    path: '/features/ats-checker', title: 'Free ATS Resume Checker & Score',
    description: 'Upload your resume (PDF or Word) and get a free ATS score with a detailed report: formatting, keywords, sections and what to fix. Free first check.',
    keywords: 'ATS resume checker, free ATS score, resume checker, ATS friendly resume, resume scanner',
    body: `<h1>Free ATS Resume Checker</h1>
<p>Drop your resume and see how an Applicant Tracking System reads it: your score, what is hurting it, and exactly how to fix it.</p>
<p>Upload a PDF or Word (.docx) file up to 5 MB, optionally with a job description. Every account gets 5 free checks. The report is saved to your account so you can reopen it without using another check, and an "Apply fixes" button can build an improved copy of your resume that you can edit.</p>
<h2>What the ATS checker looks at</h2>
${ul([
    '<strong>Readability.</strong> Can software read your file, or is it an image, table or icon-heavy layout?',
    '<strong>Sections and structure.</strong> Clear Experience, Education and Skills headings, plus dates.',
    '<strong>Keywords.</strong> The skills recruiters search for, and which ones you are missing.',
    '<strong>Content and impact.</strong> Action verbs and measurable results that make bullets stand out.',
])}
<p>Scores are an estimate: every company's ATS works a little differently, and no tool can promise a result.</p>
<p>${a('/app', 'Sign in to check my resume')} · ${a('/templates', 'ATS-friendly templates')} · ${a('/examples', 'Examples that score 100/100 on the rule-based checks')}</p>`,
    jsonLd: [crumbs([['Home', '/'], ['Features', '/features'], ['ATS Checker', '/features/ats-checker']])],
});

// ---- CV builder
export const cvBuilderPage = () => page({
    path: '/cv-builder', title: 'Free AI CV Builder, ATS-Friendly',
    description: 'Build a professional, ATS-friendly CV in minutes. Enter your details and the target job, and AI writes a tailored CV. Text-based PDF download.',
    keywords: 'CV builder, AI CV maker, ATS friendly CV, CV for freshers, create CV online, free CV builder',
    body: `<h1>AI CV Builder</h1>
<p>Build a professional, ATS-friendly CV in minutes. Enter your details and the target job, and AI writes a tailored CV using only your real facts.</p>
<h2>How it works</h2>
<ol>
<li><strong>Tell us the job.</strong> Enter the role and paste the job description so your CV uses the right keywords.</li>
<li><strong>Add your details.</strong> Education, experience, internships, projects and skills. Short notes are enough.</li>
<li><strong>AI writes your CV.</strong> A polished summary and achievement-focused bullets, using only your facts.</li>
<li><strong>Review and download.</strong> Edit anything, pick a template and download a text-based PDF.</li>
</ol>
${faqHtml(data().faqs.cv)}
<p>${a('/app?state=register&next=/cv-builder', 'Start my CV')} · ${a('/examples', 'See CV examples')}</p>`,
    jsonLd: [crumbs([['Home', '/'], ['CV Builder', '/cv-builder']]), faqLd(data().faqs.cv)],
});

// ---- JD matcher
export const matcherPage = () => page({
    path: '/resume-job-description-matcher', title: 'Resume Job Description Matcher (Free)',
    description: 'Paste your resume and a job description to see which keywords match, which are weak and which are missing. Free, instant, and private: it runs in your browser.',
    keywords: 'tailor resume to job description, resume job match, resume keyword scanner, job description matcher, resume keyword match',
    body: `<h1>Resume Job Description Matcher</h1>
<p>Paste your resume and a job description to see which keywords match, which are weak and which are missing. It runs in your browser, so your resume text is not sent to our servers by this tool.</p>
${faqHtml(data().faqs.matcher)}
<p>${a('/features/ats-checker', 'Run the free ATS checker')} · ${a('/app', 'Open the resume builder')}</p>`,
    jsonLd: [crumbs([['Home', '/'], ['Job Match Tool', '/resume-job-description-matcher']]), faqLd(data().faqs.matcher)],
});

// ---- Templates
export const templatesIndexPage = () => {
    const t = data().templates;
    return page({
        path: '/templates', title: 'Free ATS-Friendly Resume Templates',
        description: `Browse ${t.length} free resume templates: classic, modern, sidebar, developer, skilled trades, career change and more. Each shows its ATS rating. Customize online.`,
        keywords: 'resume templates, free resume templates, ATS resume templates, professional resume templates',
        body: `<h1>Free ATS-Friendly Resume Templates</h1>
<p>${t.length} resume templates. Each one shows an honest ATS rating and the design choices behind it. Ratings are our own assessment of the design, not a score from any employer's system.</p>
<ul>${t.map((x) => `<li>${a(`/templates/${x.slug}`, x.name)}: ${esc(x.tagline)} ATS rating: ${esc(x.ats?.rating || '')}.</li>`).join('')}</ul>
<p>${a('/app', 'Create my resume')} · ${a('/examples', 'See filled-in examples')}</p>`,
        jsonLd: [crumbs([['Home', '/'], ['Templates', '/templates']]), {
            '@context': 'https://schema.org', '@type': 'ItemList', name: 'Free ATS-friendly resume templates',
            itemListElement: t.map((x, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteUrl()}/templates/${x.slug}`, name: x.name })),
        }],
    });
};

const shortDescription = (d) => {
    if (d.length <= 158) return d;
    const cut = d.slice(0, 158);
    const stop = cut.lastIndexOf('. ');
    return stop > 70 ? cut.slice(0, stop + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};

export const templatePage = (slug) => {
    const t = data().templates.find((x) => x.slug === slug);
    if (!t) return null;
    const others = data().templates.filter((x) => x.slug !== slug).slice(0, 6);
    return page({
        path: `/templates/${t.slug}`, title: `${t.name} — Free & ATS-Friendly`,
        description: t.metaDescription || shortDescription(t.description), keywords: t.keywords,
        body: `<nav aria-label="Breadcrumb">${a('/', 'Home')} › ${a('/templates', 'Templates')} › ${esc(t.name)}</nav>
<h1>${esc(t.name)}</h1>
<p>${esc(t.tagline)}</p>
<p>${esc(t.description)}</p>
<h2>ATS rating: ${esc(t.ats?.rating || '')}</h2>
${ul((t.ats?.points || []).map(esc))}
<h2>Best for</h2>
${ul(t.bestFor.map(esc))}
<h2>Features</h2>
${ul(t.features.map(esc))}
<p>${a(`/app?state=register&template=${t.id}`, 'Use this template')}</p>
<h2>More templates</h2>
${ul(others.map((x) => a(`/templates/${x.slug}`, x.name)))}`,
        jsonLd: [crumbs([['Home', '/'], ['Templates', '/templates'], [t.name, `/templates/${t.slug}`]]), {
            '@context': 'https://schema.org', '@type': 'Product', name: t.name, description: t.description,
            brand: { '@type': 'Organization', name: SITE_NAME }, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }],
    });
};

// ---- Hire
export const hirePage = () => page({
    path: '/hire', title: 'Hire Workers or Find Work Worldwide',
    description: 'Workers anywhere can mark themselves available for office, factory, trade and daily wage work. Contact details stay private until the worker accepts.',
    keywords: 'hire workers worldwide, hire electrician, factory workers, daily wage workers, skilled labour, hire staff abroad, available to work',
    body: `<h1>Hire workers. Get found for work.</h1>
<p>Office staff, factory workers, skilled trades and daily wage workers, in any country. Say you are available and approved employers reach out, or find workers ready to start. Contact details stay private until the worker says yes.</p>
${faqHtml(data().faqs.hire)}
<p>${a('/jobs', 'Browse jobs')} · ${a('/app', 'Create an account')}</p>`,
    jsonLd: [crumbs([['Home', '/'], ['Hire', '/hire']]), faqLd(data().faqs.hire)],
});

// ---- Contact, Privacy Policy, Terms. Short server copy so the page has its own canonical in the HTML; React shows the full text.
export const contactPage = () => page({
    path: '/contact-us', title: 'Contact Us',
    description: 'Get in touch with Prime Resume AI for any inquiries or support. We are here to help you create the perfect resume.',
    keywords: 'contact prime resume ai, resume builder support',
    body: `<h1>Contact Prime Resume AI</h1>
<p>Questions about the resume builder, your account or a job listing? Send us a message with the form on this page and we will reply by email.</p>
<p>${a('/', 'Home')} · ${a('/privacy-policy', 'Privacy Policy')} · ${a('/terms-and-conditions', 'Terms and Conditions')}</p>`,
    jsonLd: [crumbs([['Home', '/'], ['Contact Us', '/contact-us']])],
});
export const privacyPage = () => page({
    path: '/privacy-policy', title: 'Privacy Policy',
    description: "Read Prime Resume AI's Privacy Policy to learn how we collect, use, and protect your information when you use our resume builder.",
    body: `<h1>Privacy Policy</h1>
<p>This policy explains what information Prime Resume AI collects, how we use it, how we protect it and the choices you have.</p>
<p>${a('/contact-us', 'Contact us')} · ${a('/terms-and-conditions', 'Terms and Conditions')}</p>`,
    jsonLd: [crumbs([['Home', '/'], ['Privacy Policy', '/privacy-policy']])],
});
export const termsPage = () => page({
    path: '/terms-and-conditions', title: 'Terms & Conditions',
    description: "Read the Terms & Conditions for using Prime Resume AI's resume builder platform.",
    body: `<h1>Terms and Conditions</h1>
<p>These terms describe the rules for using Prime Resume AI and its resume builder.</p>
<p>${a('/contact-us', 'Contact us')} · ${a('/privacy-policy', 'Privacy Policy')}</p>`,
    jsonLd: [crumbs([['Home', '/'], ['Terms & Conditions', '/terms-and-conditions']])],
});

// ---- Image converter (free tool that runs in the browser). Copy comes from client/src/content/imageConverter.json.
export const imageConverterPage = () => {
    const c = data().imageConverter;
    return page({
        path: c.path, title: c.title, description: c.description, keywords: c.keywords,
        body: `<h1>${esc(c.h1)}</h1>
<p>${esc(c.intro)}</p>
<h2>How it works</h2>
<ol>${c.how.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
<h2>What to expect</h2>
<p>${esc(c.honest)}</p>
<h3>Works well for</h3>${ul(c.good.map(esc))}
<h3>Not a fit for</h3>${ul(c.limits.map(esc))}
<h2>Privacy</h2>
<p>${esc(c.privacy)}</p>
${faqHtml(c.faqs)}
<p>${a('/products', 'More products')} · ${a('/app', 'Free resume builder')} · ${a('/features/ats-checker', 'ATS resume checker')}</p>`,
        jsonLd: [
            crumbs([['Home', '/'], ['Products', '/products'], [c.name, c.path]]),
            { '@context': 'https://schema.org', '@type': 'WebApplication', name: `Prime Resume AI ${c.name}`, url: `${siteUrl()}${c.path}`, applicationCategory: 'MultimediaApplication', operatingSystem: 'Web', description: c.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
            faqLd(c.faqs),
        ],
    });
};

// ---- Image enhancer (a product: tool page). Copy comes from client/src/content/imageEnhancer.json.
export const imageEnhancerPage = () => {
    if (!flags.imageEnhancer) return null;   // hidden by the admin: the caller answers 404
    const c = data().imageEnhancer;
    return page({
        path: c.path, title: c.title, description: c.description, keywords: c.keywords,
        body: `<h1>${esc(c.h1)}</h1>
<p>${esc(c.intro)}</p>
<h2>How it works</h2>
<ol>${c.how.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
<h2>What to expect</h2>
<p>${esc(c.honest)}</p>
<h3>Works well for</h3>${ul(c.good.map(esc))}
<h3>Not a fit for</h3>${ul(c.limits.map(esc))}
<h2>Privacy</h2>
<p>${esc(c.privacy)}</p>
${faqHtml(c.faqs)}
<p>${a('/app?state=register&next=/products/image-enhancer', 'Sign in and enhance a photo')} · ${a('/products', 'More products')} · ${a('/templates', 'Resume templates')}</p>`,
        jsonLd: [
            crumbs([['Home', '/'], ['Products', '/products'], [c.name, c.path]]),
            { '@context': 'https://schema.org', '@type': 'WebApplication', name: `Prime Resume AI ${c.name}`, url: `${siteUrl()}${c.path}`, applicationCategory: 'MultimediaApplication', operatingSystem: 'Web', description: c.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
            faqLd(c.faqs),
        ],
    });
};

// ---- Free career tools (/products/<slug>, listed on /products; the old /tools URLs redirect). Copy comes from client/src/content/careerTools.json (copied to
// utils/careerToolsData.json: keep both the same). A tool the admin switched off answers 404 and leaves the lists.
let CAREER = null;
export const careerData = () => (CAREER ||= JSON.parse(fs.readFileSync(path.join(here, 'careerToolsData.json'), 'utf8')));
export const careerToolPaths = () => careerData().tools.map((t) => t.path);
export const hiddenCareerPaths = (settings) => careerData().tools.filter((t) => settings?.[t.flag] === false).map((t) => t.path);
const toolOn = (t) => flags.tools?.[t.flag] !== false;

export const careerToolPage = (slug) => {
    const c = careerData().tools.find((t) => t.slug === slug);
    if (!c || !toolOn(c)) return null;
    return page({
        path: c.path, title: c.title, description: c.description,
        body: `<h1>${esc(c.h1)}</h1><p>${esc(c.intro)}</p>
<h2>How it works</h2><ol>${c.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
<h2>Good to know</h2><p>${esc(c.note)}</p>
${faqHtml(c.faqs)}
<p>${a('/products', 'All free tools')} · ${a('/app', 'Free resume builder')} · ${a('/jobs/interview-questions', 'Interview questions')}</p>`,
        jsonLd: [
            crumbs([['Home', '/'], ['Products', '/products'], [c.name, c.path]]),
            { '@context': 'https://schema.org', '@type': 'WebApplication', name: `Prime Resume AI ${c.name}`, url: `${siteUrl()}${c.path}`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', description: c.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
            faqLd(c.faqs),
        ],
    });
};
