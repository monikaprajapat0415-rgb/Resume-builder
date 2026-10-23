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
import professionalImg from '../assets/Professional.webp'
import corporateImg from '../assets/Corporate.webp'
import elegantImg from '../assets/Elegant.webp'
import sidebarImg from '../assets/SidebarLeft.webp'
import two_columnImg from '../assets/TwoColumn.webp'
import developerImg from '../assets/Developer.webp'
import skilled_tradesImg from '../assets/SkilledTrades.webp'
import career_changeImg from '../assets/CareerChange.webp'
import leadershipImg from '../assets/Leadership.webp'
import two_toneImg from '../assets/TwoTone.webp'

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
  {
    id: 'professional',
    slug: 'professional-resume-template',
    metaDescription: 'Free Professional resume template: single column, heavy accent rule, job titles first. ATS rating Excellent. Customise it online and download as PDF.',
    name: 'Professional Resume Template',
    image: professionalImg,
    tagline: 'A confident left-aligned layout with a strong accent rule under your name.',
    description:
      'The Professional template puts your name and role on the left above a heavy accent rule, then runs a single column of summary, experience, projects, education and skills. Job titles lead each role and dates sit on the right, so a recruiter sees what you did and when in one glance. It is a dependable all-rounder for most office and corporate roles.',
    keywords: 'professional resume template, resume template single column, ATS professional resume format',
    ats: { rating: 'Excellent', points: ['Single column read top to bottom', 'Standard section names: Summary, Experience, Projects, Education, Skills', 'Plain text only: the accent colour never carries meaning'] },
    bestFor: ['Office, operations, HR and administration roles', 'Mid-career applicants with two to ten years of experience', 'Anyone who wants a clean look that is not plain black and white'],
    features: ['Heavy accent rule under the header', 'Job title first, company second, dates on the right', 'Skills in one readable line', 'Fits most careers on one to two pages'],
  },
  {
    id: 'corporate',
    slug: 'corporate-resume-template',
    metaDescription: 'Free Corporate resume template with stacked contact details and accent-bar headings. ATS rating Excellent. Build it online and download a PDF.',
    name: 'Corporate Resume Template',
    image: corporateImg,
    tagline: 'Name on the left, contact details stacked on the right, accent bars on every heading.',
    description:
      'The Corporate template splits the header in two: your name and role on the left and your contact details in a tidy right-hand stack. Each section heading carries a thick accent bar, which makes long histories easy to scan. The page is still one column of real text underneath.',
    keywords: 'corporate resume template, business resume template, finance resume format',
    ats: { rating: 'Excellent', points: ['One column of text under a two-part header', 'Contact details are ordinary text lines, not icons', 'Headings use standard names such as Professional Experience and Core Skills'] },
    bestFor: ['Banking, finance, consulting and business roles', 'Managers and team leads', 'Applications to large companies that use an ATS'],
    features: ['Stacked contact block for easy copying', 'Accent bar on every heading', 'Role and company on one line to save space', 'Core Skills list at the end'],
  },
  {
    id: 'elegant',
    slug: 'elegant-resume-template',
    metaDescription: 'Free Elegant resume template: centred serif page with a letter-spaced name and hairlines. ATS rating Excellent. Edit online, download as PDF.',
    name: 'Elegant Resume Template',
    image: elegantImg,
    tagline: 'Centred serif page with a letter-spaced name and quiet hairlines.',
    description:
      'The Elegant template centres everything under a widely spaced name, with thin rules above and below and small capital headings. Serif type and italic role lines give it a calm, formal feel without any graphics. It suits roles where tone and polish matter as much as technical keywords.',
    keywords: 'elegant resume template, serif resume template, formal resume layout',
    ats: { rating: 'Excellent', points: ['Single column with centred headings', 'Serif type that prints and exports cleanly', 'No images, tables or text boxes'] },
    bestFor: ['Law, education, publishing, hospitality and luxury retail', 'Writers, editors and communications specialists', 'Candidates who want a formal, understated page'],
    features: ['Letter-spaced name between hairlines', 'Italic role and date lines', 'Centred section headings', 'Prints well in black and white'],
  },
  {
    id: 'sidebar',
    slug: 'sidebar-resume-template',
    metaDescription: 'Free Sidebar resume template with a coloured left column for contact and skills. Honest ATS rating: Good. Customise online and download a PDF.',
    name: 'Sidebar Resume Template',
    image: sidebarImg,
    tagline: 'A coloured left sidebar for contact, skills and education, with experience in the main column.',
    description:
      'The Sidebar template moves your contact details, skills and education into a coloured left column and gives the wide right column to your profile, experience and projects. It makes good use of space for people with long skills lists. Because it uses two columns, we rate it Good rather than Excellent for ATS: the text is real and the main column comes first in the file, but some older systems can mix the columns.',
    keywords: 'sidebar resume template, two column resume template with colour, resume with skills sidebar',
    ats: { rating: 'Good', points: ['Real text in both columns, no icons or images', 'The main column (profile, experience) comes first in reading order', 'Two columns can confuse a few older parsers, so keep a plain version for portals that ask for one'] },
    bestFor: ['Designers, marketers and customer-facing roles', 'Candidates with a long skills or tools list', 'Direct applications and emails to a person, rather than portals'],
    features: ['Coloured sidebar in your accent colour', 'Contact, skills and education kept together', 'Wide column for achievements', 'Text stays plain and selectable'],
  },
  {
    id: 'two-column',
    slug: 'two-column-resume-template',
    metaDescription: 'Free Two-Column resume template: wide main column plus a slim right column on a white page. ATS rating Very good. Edit online, download PDF.',
    name: 'Two-Column Resume Template',
    image: two_columnImg,
    tagline: 'A wide main column with a slim right column, on a white page.',
    description:
      'The Two-Column template keeps the page white and puts a narrow column on the right for contact details, skills and education, under a full-width name and accent line. The main column holds your profile, experience and projects. It saves vertical space for people who want everything on a single page, with less colour than the Sidebar template.',
    keywords: 'two column resume template, resume with right column skills, one page resume layout',
    ats: { rating: 'Very good', points: ['Main column is first in reading order', 'No shading or graphics, only text and one accent line', 'Standard headings in both columns'] },
    bestFor: ['One-page resumes with a lot to say', 'Engineers, analysts and project coordinators', 'Applicants who want two columns without a coloured block'],
    features: ['Slim right column for skills and education', 'Full-width name and accent line', 'White page that prints cheaply', 'Short lines are easy to scan'],
  },
  {
    id: 'developer',
    slug: 'developer-resume-template',
    metaDescription: 'Free Developer resume template: skills first, projects before education, monospace headings. ATS rating Excellent. Build online, download PDF.',
    name: 'Developer Resume Template',
    image: developerImg,
    tagline: 'Skills first, monospace headings, and projects before education.',
    description:
      'The Developer template opens with a Summary and your technical skills, then experience and projects, and puts education last. Monospace headings and a soft tinted tag behind each one give it a technical feel, but the page is still one column of plain text. Put the tools you actually use in the skills line, because that is what recruiters and parsers search for first.',
    keywords: 'developer resume template, software engineer resume format, tech resume template ATS',
    ats: { rating: 'Excellent', points: ['One column of plain text', 'Technical Skills listed in one line, easy for keyword matching', 'Standard headings (Summary, Technical Skills, Experience, Projects, Education) in a monospace font'] },
    bestFor: ['Software, data, DevOps and IT support roles', 'Bootcamp graduates and self-taught developers', 'Applicants with strong projects or open-source work'],
    features: ['Technical Skills near the top', 'Projects before education', 'Role @ company format for each job', 'Tinted heading tags that print safely'],
  },
  {
    id: 'skilled-trades',
    slug: 'skilled-trades-resume-template',
    metaDescription: 'Free Skilled Trades resume template for factory, driving and technician jobs: large text, skills and licences first. ATS Excellent. Download PDF.',
    name: 'Skilled Trades Resume Template',
    image: skilled_tradesImg,
    tagline: 'Large, easy-to-read text with a clear skills and licences list near the top.',
    description:
      'The Skilled Trades template uses bigger type, strong headings and a three-column bulleted list for skills and licences right under your profile. It is built for hands-on work such as factory, warehouse, driving, electrical, plumbing, construction and maintenance, where certificates, tickets and machines matter more than long paragraphs. Work history follows with simple role, employer and dates.',
    keywords: 'trades resume template, factory worker resume format, driver resume template, technician resume template',
    ats: { rating: 'Excellent', points: ['Single column with real bullet characters', 'Skills and Licences is a plain list, which parsers read as keywords', 'Standard Work History and Education headings'] },
    bestFor: ['Factory, warehouse, driving, construction and maintenance jobs', 'Electricians, welders, mechanics and technicians', 'Applicants whose licences and machine experience should be seen first'],
    features: ['Larger, easier-to-read type', 'Skills and Licences list near the top', 'Short role, employer, dates lines', 'Training and projects section for courses and apprenticeships'],
  },
  {
    id: 'career-change',
    slug: 'career-change-resume-template',
    metaDescription: 'Free Career Change resume template with a highlighted summary and key skills first. ATS rating Excellent. Customise online, download PDF.',
    name: 'Career Change Resume Template',
    image: career_changeImg,
    tagline: 'A highlighted profile and transferable-skills block lead, work history follows.',
    description:
      'The Career Change template starts with a shaded Professional Summary box where you explain the move in two or three lines, then a Key Skills section, then Work Experience. This helps when your most recent job title does not match the role you want. Choose which achievements to keep, and word them in the language of the new field.',
    keywords: 'career change resume template, transferable skills resume format, switch careers resume',
    ats: { rating: 'Excellent', points: ['Single column with standard headings', 'Shaded profile box is background colour, so the text stays plain', 'Skills written in one line for keyword matching'] },
    bestFor: ['People moving between industries', 'Returners to work after a break', 'Applicants whose past job titles do not match the new role'],
    features: ['Highlighted summary box', 'Key skills before history', 'Work Experience limited to roles that matter for the new field', 'Education kept short and clear'],
  },
  {
    id: 'leadership',
    slug: 'leadership-resume-template',
    metaDescription: 'Free Leadership resume template for managers: summary, date gutter, core skills. ATS rating Very good. Edit online, download PDF.',
    name: 'Leadership Resume Template',
    image: leadershipImg,
    tagline: 'Dates in a left gutter, achievements to the right, and a larger professional summary.',
    description:
      'The Leadership template gives managers and senior professionals a larger professional summary and a date gutter on the left of each role, so a long career reads like a clear timeline. Company names appear in small capitals under each title, and core skills close the page. We rate it Very good: the text is real, and each entry places the date before the details, which most parsers handle but a few read in a different order.',
    keywords: 'leadership resume template, executive resume format, senior manager resume template',
    ats: { rating: 'Very good', points: ['Real text only; no tables, images or icons', 'Entries read date first, then title, company and achievements', 'Standard headings: Professional Summary, Professional Experience, Education, Core Skills'] },
    bestFor: ['Managers, directors and senior specialists', 'Candidates with ten or more years of experience', 'Roles where a clear career timeline helps'],
    features: ['Larger professional summary', 'Left date gutter on every role', 'Selected Initiatives section for projects', 'Core Skills at the end'],
  },
  {
    id: 'two-tone',
    slug: 'two-tone-resume-template',
    metaDescription: 'Free Two-Tone resume template with a bold accent name and filled heading tags. ATS rating Excellent. Customise online and download as PDF.',
    name: 'Two-Tone Resume Template',
    image: two_toneImg,
    tagline: 'A two-tone name and filled heading tags, for a modern look that stays plain underneath.',
    description:
      'The Two-Tone template sets your first name in a light weight and your last name in bold accent colour, with rounded filled tags for each section heading. It is a friendlier, more current alternative to the Modern template, and the layout is still a single column of ordinary text. Pick an accent colour that suits your field.',
    keywords: 'modern resume template colour, creative resume template ATS, two tone resume design',
    ats: { rating: 'Excellent', points: ['Single column read top to bottom', 'Colour is decoration only; every word is plain text', 'Standard section names'] },
    bestFor: ['Marketing, sales, design support and customer success roles', 'Early- and mid-career applicants', 'Anyone who wants colour without losing ATS safety'],
    features: ['Two-tone name in your accent colour', 'Rounded filled heading tags', 'Role and company on one line', 'Prints well in colour or grey'],
  },
]

export const getTemplateBySlug = (slug) => resumeTemplates.find((t) => t.slug === slug)
