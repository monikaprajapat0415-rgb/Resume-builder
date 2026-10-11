// Template landing page content, data-driven like blogPosts.js so a new template
// page only requires adding an entry here (plus the template itself already existing
// in components/templates and TemplateSelector). The sitemap in vite.config.js reads
// slugs from the separate templateSlugs.js file instead of this one (this file imports
// images, which esbuild can't resolve inside vite.config.js) — keep the `slug` values
// below in sync with templateSlugs.js if either one changes.

import classicImg from '../assets/Classic.webp'
import modernImg from '../assets/modern.webp'
import minimalImg from '../assets/Minimal.webp'
import minimalImageImg from '../assets/MinimalwithImage.webp'
import executiveImg from '../assets/Executive.webp'
import compactImg from '../assets/Compact.webp'
import bannerImg from '../assets/Banner.webp'
import timelineImg from '../assets/Timeline.webp'
import graduateImg from '../assets/Graduate.webp'

// Every template carries an `ats` block: a plain-language rating and the concrete design
// choices behind it (what a resume parser needs: real text, simple order, standard headings).
// Ratings are our own assessment of the design, not a score from any employer's system.

export const resumeTemplates = [
  {
    id: 'classic',
    slug: 'classic-resume-template',
    name: 'Classic Resume Template',
    image: classicImg,
    tagline: 'A clean, timeless layout recruiters have trusted for decades.',
    description:
      'The Classic template uses a single-column, traditional structure with clear section headers and generous whitespace. It is the safest choice when you are not sure what a hiring manager or ATS prefers — nothing about the layout competes for attention with your content.',
    keywords: 'classic resume template, traditional resume format, simple resume template free',
    ats: { rating: 'Excellent', points: ['Single column, so text is read top to bottom in the right order', 'Standard section names: Summary, Experience, Education, Skills', 'Real text only: no photos or text boxes'] },
    bestFor: ['Corporate, finance, legal, and government roles', 'Experienced professionals with a long work history', 'Anyone applying through an ATS-heavy hiring process'],
    features: [
      'Single-column layout for reliable ATS parsing',
      'Traditional section order: summary, experience, education, skills',
      'Serif-influenced typography for a formal, established feel',
      'No graphics or color blocks that can confuse resume scanners',
    ],
  },
  {
    id: 'modern',
    slug: 'modern-resume-template',
    name: 'Modern Resume Template',
    image: modernImg,
    tagline: 'Bold typography and clear structure for roles that reward a sharper look.',
    description:
      'The Modern template keeps the ATS-friendly single-column foundation but uses bolder headers, a confident color accent, and tighter spacing to feel current. It is a strong default for most private-sector roles in 2026 — professional enough for a panel interview, distinctive enough to not blend into a stack of a hundred resumes.',
    keywords: 'modern resume template, professional resume template, best resume template 2026',
    ats: { rating: 'Excellent', points: ['Single column with standard section names', 'Colour is used only for accents, never to carry information', 'Real text only: no tables or text boxes'] },
    bestFor: ['Tech, marketing, product, and startup roles', 'Mid-career professionals who want to stand out slightly without looking unconventional', 'Remote job applications where first impressions matter more'],
    features: [
      'Accent color you can customize to match your personal brand',
      'Bold section headers that improve scannability',
      'Still fully single-column and ATS-safe',
      'Works well printed or viewed on screen',
    ],
  },
  {
    id: 'minimal',
    slug: 'minimal-resume-template',
    name: 'Minimal Resume Template',
    image: minimalImg,
    tagline: 'Maximum whitespace, zero distractions — built for readability.',
    description:
      'The Minimal template strips formatting back to the essentials: light dividers, restrained type, and generous margins. It is especially effective for candidates whose experience should do all the talking, and it is one of the fastest templates for a recruiter to skim in the six-to-eight seconds most resumes get.',
    keywords: 'minimal resume template, simple clean resume template, minimalist resume design',
    ats: { rating: 'Excellent', points: ['One simple column with generous spacing', 'Standard section names and plain dividers', 'No graphics, so every word is readable by a parser'] },
    bestFor: ['Design, writing, and research roles where restraint signals taste', 'Senior candidates with a long, strong track record', 'Anyone who wants the content, not the design, to be the focus'],
    features: [
      'Extra whitespace improves readability on screen and in print',
      'Understated dividers instead of boxes or shading',
      'Compact enough to fit more experience on one page',
      'Clean parsing for every major ATS',
    ],
  },
  {
    id: 'minimal-image',
    slug: 'resume-template-with-photo',
    name: 'Minimal with Photo Resume Template',
    image: minimalImageImg,
    tagline: 'The Minimal layout, with a profile photo for regions and roles where that helps.',
    description:
      'Identical to the Minimal template but with a dedicated space for a profile photo. In many countries outside the US and Canada, including a photo is standard practice; in creative or customer-facing roles elsewhere, it can also help put a face to the application. Skip it for US corporate and ATS-heavy applications, where a photo is generally discouraged.',
    keywords: 'resume template with photo, cv template with picture, resume with photo design',
    ats: { rating: 'Good', points: ['Same clean single-column text as Minimal', 'The photo is an image that parsers skip, which is harmless', 'Many US and UK employers prefer no photo, so remove it for those applications'] },
    bestFor: ['Applications in Europe, the Middle East, and Asia where a photo is customary', 'Sales, hospitality, and customer-facing roles', 'LinkedIn-style profile resumes for networking, not ATS submission'],
    features: [
      'Dedicated, proportioned photo placement that stays professional',
      'Same clean, minimal typography as the standard Minimal template',
      'Easy to remove the photo later if you need an ATS-safe version',
      'Works well for both local and international applications',
    ],
  },

  {
    id: 'executive',
    slug: 'executive-resume-template',
    name: 'Executive Resume Template',
    image: executiveImg,
    tagline: 'A formal, centred serif layout for senior and leadership roles.',
    description:
      'The Executive template uses a centred name block with a double rule, classic serif type and company-first experience entries. It reads like a printed business document, which suits managers, directors and anyone applying where tradition counts. Everything is plain text in a single column, so applicant tracking systems read it cleanly.',
    keywords: 'executive resume template, senior manager resume format, formal resume template ATS',
    ats: { rating: 'Excellent', points: ['Single column with standard section names', 'Serif body text and real bullet lists, with no icons or images', 'Dates sit beside each job in a consistent format parsers recognise'] },
    bestFor: ['Managers, directors and senior professionals', 'Finance, law, consulting and government roles', 'Candidates with a long, steady career history'],
    features: ['Centred header with a double rule', 'Company-first entries with the job title in italics', 'Pipe-separated contact line that parsers read in one go', 'Accent colour you can change'],
  },
  {
    id: 'compact',
    slug: 'compact-resume-template',
    name: 'Compact One-Page Resume Template',
    image: compactImg,
    tagline: 'Small, tight type that fits a long career onto one page.',
    description:
      'The Compact template trims spacing and type size so a long list of jobs, skills and projects fits on a single page. Skills come right after the summary so keyword matches show up early. It stays one plain column of text with standard headings, which keeps it easy for applicant tracking systems.',
    keywords: 'one page resume template, compact resume format, resume template for experienced professionals',
    ats: { rating: 'Excellent', points: ['Single column; skills listed as plain text near the top', 'Standard headings and real bullet lists', 'No icons, images, tables or text boxes'] },
    bestFor: ['Experienced candidates who must keep to one page', 'Engineering, operations and analyst roles', 'People with many skills or projects to show'],
    features: ['Skills placed right after the summary', 'Job title and company on one line', 'Education reduced to one line per degree', 'Fits more content without feeling crowded'],
  },
  {
    id: 'banner',
    slug: 'bold-header-resume-template',
    name: 'Bold Header Resume Template',
    image: bannerImg,
    tagline: 'A coloured header band that stands out, with a plain single-column body.',
    description:
      'The Bold Header template puts your name and contact details in a full-width coloured band, then continues in a clean single column. The band is real text on a colour background, not an image, so parsers still read your name and contacts. A good pick when you want a confident first impression without risking the ATS.',
    keywords: 'bold resume template, resume template with colored header, creative ATS friendly resume',
    ats: { rating: 'Very good', points: ['The header band is real text, not a picture', 'Body is a single column with standard section names', 'Skills are a text list; keep the colour dark enough to print clearly'] },
    bestFor: ['Marketing, sales, product and startup roles', 'Candidates who want a standout look', 'Applications read by both software and people'],
    features: ['Full-width coloured header with a white name', 'Accent bars on section headings', 'Skills shown as a list of short tags', 'Colour prints correctly on paper and PDF'],
  },
  {
    id: 'timeline',
    slug: 'timeline-resume-template',
    name: 'Timeline Resume Template',
    image: timelineImg,
    tagline: 'A vertical timeline that makes career progress easy to follow.',
    description:
      'The Timeline template marks each job and degree with a dot on a vertical line, with the dates shown above each entry. The line and dots are drawn with CSS, not images, so the text underneath is read in plain order. It shows growth over time while staying a single column.',
    keywords: 'timeline resume template, chronological resume format, career progress resume design',
    ats: { rating: 'Very good', points: ['The timeline is decoration only, so text order is unchanged', 'Single column with standard section names', 'Dates appear above each entry in a consistent format'] },
    bestFor: ['Steady career progression you want to show', 'Project, product and design roles', 'Candidates with several jobs over the years'],
    features: ['Dated entries on a vertical line', 'Light header with a coloured rule', 'Education shown on the same timeline', 'Skills as a plain text line at the end'],
  },
  {
    id: 'graduate',
    slug: 'graduate-resume-template',
    name: 'Graduate & Fresher Resume Template',
    image: graduateImg,
    tagline: 'Education and projects first, for students and early-career candidates.',
    description:
      'The Graduate template changes the order of sections to lead with Education, Skills and Projects, and puts Work Experience last. That helps when your degree and projects are stronger than your job history. Headings sit on light grey bars, and the page stays a single column of plain text.',
    keywords: 'fresher resume template, graduate resume template, student resume format ATS',
    ats: { rating: 'Excellent', points: ['Single column with standard section names', 'Education first is a common format parsers read well', 'Heading bars are background shading, so the text stays plain'] },
    bestFor: ['Fresh graduates and final-year students', 'Internship and first-job applications', 'Career changers whose projects matter more than past roles'],
    features: ['Education, skills and projects before experience', 'Grey heading bars for easy scanning', 'Space for GPA, degrees and project descriptions', 'Internships fit under Work Experience'],
  },
]

export const getTemplateBySlug = (slug) => resumeTemplates.find((t) => t.slug === slug)
