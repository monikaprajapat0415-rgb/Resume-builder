// Historical seed data only - the live /blog and /blog/:slug pages no longer read
// from this file. Blog posts are now admin-managed and stored in the database
// (see server/models/Blog.js, server/controllers/blogController.js, and the
// /admin/blogs portal). This file is kept only as the source for
// server/scripts/seedBlogs.js, which migrated these posts into the database -
// edit or add posts through /admin/blogs from now on, not here.
//
// Each post's `content` is an array of simple blocks: heading, paragraph, list -
// the same shape the admin editor and BlogPost page both use.

export const blogPosts = [
  {
    slug: 'how-to-write-a-resume-summary',
    title: 'How to Write a Resume Summary That Gets You Hired',
    description:
      'Learn how to write a resume summary recruiters actually read — with a simple formula, before/after examples, and mistakes to avoid.',
    keywords: 'resume summary, resume summary examples, how to write a resume summary, professional summary',
    excerpt:
      'A resume summary is the first thing a recruiter reads — and often the only thing, if it doesn’t land. Here’s a simple formula to write one that does.',
    date: '2026-09-15',
    readTime: '6 min read',
    content: [
      { type: 'paragraph', text: 'Recruiters spend an average of six to eight seconds scanning a resume before deciding whether to keep reading. In that window, your summary — the two or three lines at the very top — is doing more work than any other part of the page. Get it right and you earn a full read. Get it wrong (or skip it entirely) and a qualified candidate gets passed over.' },
      { type: 'heading', text: 'What a resume summary actually is' },
      { type: 'paragraph', text: 'A resume summary is a brief, punchy statement — usually two to three sentences — that sits directly under your name and contact details. Its job isn’t to repeat your job history; your experience section already does that. Its job is to answer one question fast: "why should I keep reading this resume?"' },
      { type: 'paragraph', text: 'This is different from an objective statement, which focuses on what you want from the job. A summary focuses on what you bring to it. Objectives were standard twenty years ago; summaries are what hiring managers expect today.' },
      { type: 'heading', text: 'The formula: role + experience + impact + skills' },
      { type: 'paragraph', text: 'A strong summary almost always has four ingredients, in roughly this order:' },
      { type: 'list', items: [
        'Your role or professional identity ("Backend engineer", "Marketing manager")',
        'Years of experience or relevant specialization',
        'A concrete result or impact you’ve delivered',
        'Two or three skills most relevant to the job you’re applying for',
      ] },
      { type: 'paragraph', text: 'Put together, that might read: "Backend engineer with 5 years of experience building high-throughput payment systems. Reduced API latency by 40% at my last company while leading a team of four. Strong in Node.js, PostgreSQL, and distributed systems design."' },
      { type: 'heading', text: 'Before and after' },
      { type: 'paragraph', text: 'Weak: "Hardworking and dedicated professional seeking a challenging role where I can utilize my skills and grow."' },
      { type: 'paragraph', text: 'This says nothing a recruiter can act on. There’s no role, no evidence, no skill a search algorithm or human eye can latch onto.' },
      { type: 'paragraph', text: 'Strong: "Digital marketing specialist with 3+ years driving organic growth for D2C brands. Grew one client’s email list from 2,000 to 40,000 subscribers in 11 months. Skilled in SEO, email automation, and Google Analytics."' },
      { type: 'paragraph', text: 'Notice the second version is almost entirely made of specifics — a title, a number, a tool. Specifics are what make a summary believable and scannable at the same time.' },
      { type: 'heading', text: 'Five mistakes that quietly weaken a summary' },
      { type: 'list', items: [
        'Using adjectives instead of evidence ("passionate", "results-driven") without a number to back them up',
        'Writing one generic summary and reusing it for every application, instead of tailoring the last line’s skills to match the job description',
        'Making it too long — if it runs past 3-4 lines, it stops being a summary',
        'Starting with "I am" or "I have" — drop the pronoun, résumés are written in a clipped, implied-first-person style',
        'Forgetting keywords from the job posting, which matters for ATS (applicant tracking system) scans as much as for human readers',
      ] },
      { type: 'heading', text: 'A quick template to adapt' },
      { type: 'paragraph', text: '"[Job title] with [X years] of experience in [industry/specialization]. [One quantified achievement]. Skilled in [2-3 keywords from the job description]."' },
      { type: 'paragraph', text: 'Fill that in for the specific role you’re applying to, swap the skills for whatever that posting emphasizes, and you have a summary that works both for the human reading it and the ATS software scanning it first.' },
    ],
  },
  {
    slug: 'ats-friendly-resume-format-guide',
    title: 'ATS-Friendly Resume Format: The Complete Guide',
    description:
      'A practical guide to formatting your resume so applicant tracking systems (ATS) can actually read it — fonts, layout, file type, and section headers that work.',
    keywords: 'ATS friendly resume, ATS resume format, applicant tracking system, resume format guide',
    excerpt:
      'Over 90% of large companies use an ATS to filter resumes before a human ever sees them. Here’s exactly what makes a resume format ATS-readable.',
    date: '2026-09-22',
    readTime: '7 min read',
    content: [
      { type: 'paragraph', text: 'An Applicant Tracking System (ATS) is software that companies use to collect, scan, and rank resumes before a recruiter looks at them. It parses your resume into fields — name, job titles, dates, skills — and scores how well those fields match the job posting. A beautifully designed resume that an ATS can’t parse correctly can get filtered out before a human ever sees it, regardless of how qualified you are.' },
      { type: 'heading', text: 'Why formatting matters more than people think' },
      { type: 'paragraph', text: 'ATS software reads resumes the way a very literal, not-very-smart robot would: left to right, top to bottom, looking for recognizable patterns. Visual elements that look great to a human — multi-column layouts, text boxes, graphics, tables — often confuse the parser, scrambling your work history or dropping sections entirely.' },
      { type: 'heading', text: 'The format rules that actually matter' },
      { type: 'list', items: [
        'Use a single-column layout. Multi-column resumes often get read out of order by an ATS, mixing up your job titles and dates.',
        'Stick to standard section headers: "Experience", "Education", "Skills". Creative headers like "Where I’ve Made an Impact" can go unrecognized.',
        'Avoid text boxes, tables, and headers/footers for content the ATS needs to read — many parsers skip these entirely.',
        'Use standard fonts (Arial, Calibri, Georgia, Helvetica) at 10-12pt. Decorative fonts can render as garbled characters after parsing.',
        'Save and submit as a .docx or a text-based PDF — never an image-based or scanned PDF, which the ATS can’t read at all.',
        'Spell out acronyms at least once ("Search Engine Optimization (SEO)") since the ATS may be matching on the exact keyword the employer typed into the job posting.',
        'Keep dates in a consistent, standard format (MM/YYYY) so the system can calculate your years of experience correctly.',
      ] },
      { type: 'heading', text: 'Keywords: the other half of the equation' },
      { type: 'paragraph', text: 'Format gets your resume parsed correctly — keywords get it ranked highly once it is. Most ATS tools score resumes by how closely their content matches the job description’s language, including specific tools, certifications, and skill names.' },
      { type: 'paragraph', text: 'The practical move: read the job posting closely and mirror its exact phrasing where it’s true of your experience. If the posting says "project management" and your resume says "managing projects", some stricter ATS configurations may not count that as a match. Small as that sounds, it is one of the most common reasons strong candidates get filtered out silently.' },
      { type: 'heading', text: 'A simple self-check before you submit' },
      { type: 'list', items: [
        'Copy and paste your resume into a plain text editor. If the text appears in a logical, readable order with no garbled symbols, that’s a good sign an ATS can parse it too.',
        'Check that your contact info isn’t inside a header or footer — some parsers skip those regions entirely.',
        'Confirm your file is named sensibly (e.g. "Firstname-Lastname-Resume.pdf") rather than "resume_final_v3_FINAL.pdf".',
      ] },
      { type: 'paragraph', text: 'None of this requires sacrificing a resume that looks professional to a human reader — clean, single-column, well-organized resumes read well for people and machines alike. The templates built into Prime Resume AI are structured this way by default, so the formatting side is handled; your job is to make sure the content matches the language of each job you apply to.' },
    ],
  },
  {
    slug: 'resume-bullet-point-examples',
    title: '20 Resume Bullet Point Examples That Get Noticed',
    description:
      '20 real resume bullet point examples across different roles, plus the formula behind what makes a bullet point effective instead of forgettable.',
    keywords: 'resume bullet points, resume bullet point examples, how to write resume bullet points, action verbs resume',
    excerpt:
      'Most resume bullet points describe a duty. The ones that get noticed describe a result. Here’s the difference, with 20 examples.',
    date: '2026-09-29',
    readTime: '8 min read',
    content: [
      { type: 'paragraph', text: 'There’s a specific failure mode that shows up on almost every weak resume: bullet points that describe what someone was responsible for, instead of what they actually did and changed. "Responsible for managing social media accounts" tells a recruiter your job title, not your value. The fix is a simple shift from duties to results.' },
      { type: 'heading', text: 'The formula: action verb + task + measurable result' },
      { type: 'paragraph', text: 'Strong bullet points follow a consistent structure: start with a strong action verb, describe what you did, and close with a number or outcome that shows the impact. Not every bullet will have a hard metric available, but aim for it wherever you can honestly find one — percentage improvements, dollar amounts, time saved, team size, scale of audience.' },
      { type: 'heading', text: '20 examples across common roles' },
      { type: 'list', items: [
        'Led a cross-functional team of 6 to launch a new product feature 3 weeks ahead of schedule',
        'Reduced customer churn by 18% by redesigning the onboarding email sequence',
        'Managed a $120K quarterly ad budget across Google and Meta, improving ROAS by 2.3x',
        'Built an internal dashboard in Python that cut weekly reporting time from 6 hours to 40 minutes',
        'Trained and onboarded 12 new hires, shortening average ramp-up time by two weeks',
        'Negotiated vendor contracts that saved the company $45,000 annually',
        'Designed and shipped a mobile checkout flow that increased conversion rate by 14%',
        'Resolved an average of 60+ customer support tickets per week with a 97% satisfaction score',
        'Migrated legacy infrastructure to AWS, reducing server costs by 30%',
        'Wrote and published 25+ SEO-optimized articles that drove a 3x increase in organic traffic',
        'Coordinated logistics for an event with 500+ attendees, coming in 8% under budget',
        'Automated a manual data-entry process, saving the team approximately 10 hours per week',
        'Mentored 4 junior developers, two of whom were promoted within a year',
        'Improved page load speed by 45% through image optimization and code splitting',
        'Closed $280K in new business within the first two quarters, exceeding quota by 22%',
        'Redesigned the company style guide, adopted across 5 product teams',
        'Conducted user research with 40+ participants that directly informed the product roadmap',
        'Cut production defects by 25% by implementing a new QA testing protocol',
        'Managed a portfolio of 15 enterprise accounts worth $1.2M in annual recurring revenue',
        'Streamlined the hiring process, reducing average time-to-hire from 45 to 28 days',
      ] },
      { type: 'heading', text: 'Strong action verbs to start with' },
      { type: 'paragraph', text: 'Vary your verbs across the resume rather than starting every bullet with "managed" or "responsible for". Some reliable options, grouped loosely by type of work:' },
      { type: 'list', items: [
        'Leadership: led, directed, coordinated, mentored, supervised',
        'Improvement: improved, streamlined, optimized, reduced, increased',
        'Creation: built, designed, launched, developed, created',
        'Analysis: analyzed, identified, researched, evaluated, forecasted',
        'Achievement: exceeded, achieved, delivered, secured, generated',
      ] },
      { type: 'heading', text: 'What to do when you don’t have a hard number' },
      { type: 'paragraph', text: 'Not every accomplishment comes with a clean metric, especially early in a career. In that case, scope and scale still count: "Supported a team of 8 across three concurrent client projects" or "Served as the primary point of contact for 15+ vendor relationships" both convey weight without a percentage. The goal is specificity — a number is the clearest form of it, but concrete scope is a reasonable substitute.' },
    ],
  },
  {
    slug: 'resume-vs-cv-difference',
    title: 'Resume vs. CV: What’s the Difference and Which One Do You Need?',
    description:
      'Resume or CV — they’re not interchangeable. Here’s the real difference, which one employers expect in your country and industry, and how to tell which to send.',
    keywords: 'resume vs cv, difference between resume and cv, cv or resume, what is a cv',
    excerpt:
      'Used interchangeably in casual conversation but not in hiring. Sending the wrong one can look like a small miss — or a sign you didn’t research the role.',
    date: '2026-10-01',
    readTime: '5 min read',
    content: [
      { type: 'paragraph', text: 'In the United States and Canada, "resume" and "CV" get used almost interchangeably in casual speech, but in a hiring context they mean different documents with different expectations. Knowing which one a job wants — and why — matters more than it seems.' },
      { type: 'heading', text: 'The core difference' },
      { type: 'paragraph', text: 'A resume is a brief, tailored summary of your relevant experience — typically one to two pages, customized for each job you apply to. A CV (curriculum vitae) is a complete, chronological record of your entire academic and professional history — publications, presentations, every degree, every role — and it grows longer over a career rather than staying fixed at one or two pages.' },
      { type: 'heading', text: 'Where each one is expected' },
      { type: 'list', items: [
        'United States and Canada: "resume" is the standard for nearly all jobs. "CV" is reserved for academic, research, and medical positions.',
        'United Kingdom, Ireland, and much of Europe: "CV" is the standard term for what Americans call a resume — it is the everyday job-application document, not a long academic record.',
        'Academia, scientific research, and medicine, globally: a true CV (complete history, publications included) is expected regardless of country.',
      ] },
      { type: 'paragraph', text: 'This means a UK job posting asking for a "CV" usually wants exactly what you’d call a resume at home — short, tailored, one to two pages. Don’t send a ten-page academic-style document unless the role is specifically academic or research-based.' },
      { type: 'heading', text: 'How to tell which one a specific application wants' },
      { type: 'list', items: [
        'Check the job posting’s country and industry first — that settles most cases',
        'If it’s an academic, postdoc, or research role, default to a full CV with publications regardless of location',
        'If in doubt and nothing in the post clarifies it, a tailored one-to-two-page resume is the safer default for any non-academic role',
      ] },
      { type: 'paragraph', text: 'If you do need a lengthy academic CV, most resume builders — including this one — are built around the shorter, tailored resume format, since that’s what the vast majority of job applications require. For a research or faculty position, a dedicated CV template elsewhere may serve you better.' },
    ],
  },
  {
    slug: 'how-long-should-a-resume-be',
    title: 'How Long Should a Resume Be? (By Experience Level)',
    description:
      'One page or two? Here’s a clear answer by career stage, why recruiters care about length, and how to cut a resume down without losing your best material.',
    keywords: 'how long should a resume be, one page resume, two page resume, resume length',
    excerpt:
      'The honest answer is "it depends" — but not vaguely. Here’s the actual rule by years of experience, and how to cut without losing your strongest material.',
    date: '2026-10-02',
    readTime: '5 min read',
    content: [
      { type: 'paragraph', text: 'Resume length advice online tends to repeat "keep it to one page" as a universal rule, which is true for some candidates and actively harmful for others. The real answer scales with experience.' },
      { type: 'heading', text: 'The guideline by career stage' },
      { type: 'list', items: [
        'Students and new graduates (0-2 years): one page. There usually isn’t enough relevant experience to justify more, and padding is easy to spot.',
        'Early-to-mid career (3-10 years): one page is still ideal, but a tight second page is acceptable if every line earns its place.',
        'Senior and executive (10+ years): two pages is standard and expected. Trying to cram 15 years onto one page usually means cutting the detail that actually demonstrates seniority.',
        'Academic, medical, or research CVs: length follows the full record — publications and all — rather than this scale.',
      ] },
      { type: 'heading', text: 'Why length matters to a recruiter' },
      { type: 'paragraph', text: 'Recruiters aren’t counting pages out of habit — length is a proxy for editing discipline. A resume that runs long because every job ever held is listed in equal detail signals the candidate hasn’t prioritized what actually matters for this role. A resume that is appropriately long because 12 years of increasing responsibility is laid out clearly signals the opposite.' },
      { type: 'heading', text: 'How to cut a resume that’s running too long' },
      { type: 'list', items: [
        'Drop roles older than 10-15 years, or compress them into a single "Earlier Experience" line with no bullets',
        'Cut bullet points that describe duties rather than results — if it doesn’t show impact, it’s a candidate for removal',
        'Limit each role to 3-5 bullet points; older or less relevant roles can have fewer',
        'Remove an "Objective" statement entirely — a modern resume summary does that job in less space',
        'Tighten the skills section to what’s actually relevant to the job, not every tool you’ve ever touched',
      ] },
      { type: 'paragraph', text: 'When in doubt, favor cutting over keeping. A recruiter spending six to eight seconds on first pass will reward a tight one-page resume over a sprawling two-page one almost every time, unless the extra length is genuinely earned by senior-level experience.' },
    ],
  },
  {
    slug: 'cover-letter-examples-that-work',
    title: 'Cover Letter Examples That Actually Get Read',
    description:
      'Most cover letters restate the resume and get skipped. Here’s what a cover letter should actually do, with a structure and example that gets read in full.',
    keywords: 'cover letter examples, how to write a cover letter, cover letter template, cover letter that gets read',
    excerpt:
      'A cover letter that just restates the resume gets skimmed and ignored. Here’s the structure of one that actually gets read start to finish.',
    date: '2026-10-03',
    readTime: '6 min read',
    content: [
      { type: 'paragraph', text: 'Most cover letters fail for the same reason: they summarize the resume in paragraph form. If a hiring manager has already seen the resume, repeating it adds nothing and the letter gets skimmed or skipped entirely. A cover letter earns its place by doing something the resume structurally can’t — telling a short, specific story about why this role, this company, right now.' },
      { type: 'heading', text: 'The three things a good cover letter does' },
      { type: 'list', items: [
        'Names something specific about the company or role — not a generic "I am excited about this opportunity"',
        'Connects one or two concrete achievements to what the job actually needs, rather than re-listing the whole resume',
        'Shows a little personality or motivation — the resume can’t convey why you want this job specifically, the letter can',
      ] },
      { type: 'heading', text: 'A structure that works' },
      { type: 'list', items: [
        'Opening line: a specific, non-generic reason you’re writing — reference the team, product, or a recent company milestone if you can',
        'Middle paragraph: one or two achievements, chosen because they map directly to what the job posting asks for — not your whole career',
        'Closing paragraph: a brief, confident note on what you’d bring going forward, plus a clear call to action (happy to discuss further, available for a call this week)',
      ] },
      { type: 'heading', text: 'Example' },
      { type: 'paragraph', text: '"I’ve used [Company]’s product for the past two years as a freelance designer, and when I saw the opening for a Product Designer on your growth team, the overlap with how I already work was hard to ignore. At my current role, I led a redesign of our onboarding flow that increased activation by 22% — the kind of problem your job posting describes as a priority for this team. I’d welcome the chance to talk through how I’d approach it at [Company]. I’m available for a call this week or next."' },
      { type: 'paragraph', text: 'Notice what it doesn’t do: it doesn’t restate a job history, doesn’t open with "I am writing to apply for," and doesn’t try to cover every qualification. It picks one relevant proof point and makes a direct case.' },
      { type: 'heading', text: 'A faster way to get there' },
      { type: 'paragraph', text: 'Writing a tailored letter for every application is real work, which is why Prime Resume AI’s cover letter generator takes your resume and a job description and drafts a first pass in this structure — you edit for tone and specifics rather than starting from a blank page each time.' },
    ],
  },
  {
    slug: 'how-to-list-skills-on-resume',
    title: 'How to List Skills on a Resume (With Examples by Industry)',
    description:
      'A skills section that actually helps you get past an ATS and impresses a recruiter — how to choose, group, and order skills, with examples across industries.',
    keywords: 'skills on resume, resume skills section, technical skills resume, soft skills resume examples',
    excerpt:
      'A skills section packed with buzzwords in no particular order helps no one. Here’s how to build one that gets past the ATS and makes sense to a human.',
    date: '2026-10-04',
    readTime: '6 min read',
    content: [
      { type: 'paragraph', text: 'A skills section is one of the most ATS-scanned parts of a resume, which tempts people to pack it with as many keywords as possible. That approach backfires with human reviewers, who scan the same section for signal, not volume. A good skills section is selective and organized, not exhaustive.' },
      { type: 'heading', text: 'Hard skills vs. soft skills' },
      { type: 'paragraph', text: 'Hard skills are specific, teachable, and verifiable — a programming language, a certification, a piece of software. Soft skills are behavioral — communication, leadership, adaptability. ATS systems and keyword matching lean almost entirely on hard skills; human interviewers weigh soft skills more, usually through how you describe your experience rather than a bullet list. Most resumes should lead with hard skills in the dedicated skills section, and demonstrate soft skills through achievements in the experience section instead of listing them as adjectives.' },
      { type: 'heading', text: 'How to choose which skills to include' },
      { type: 'list', items: [
        'Pull the exact terms from the job posting first — if it says "Figma", write "Figma", not "design tools"',
        'Only list skills you could speak to confidently in an interview — an exaggerated skills section is one of the fastest ways to lose credibility',
        'Group related skills together (e.g. "Languages", "Frameworks", "Tools") if you have more than 8-10, rather than one long unsorted line',
        'Order by relevance to the job, not alphabetically or by how comfortable you are with each one',
      ] },
      { type: 'heading', text: 'Examples by industry' },
      { type: 'list', items: [
        'Software engineering: JavaScript, React, Node.js, PostgreSQL, AWS, Git, REST APIs, Docker',
        'Marketing: SEO, Google Analytics, HubSpot, A/B testing, email automation, paid social (Meta & Google Ads), content strategy',
        'Finance/accounting: Financial modeling, GAAP, QuickBooks, Excel (advanced), variance analysis, forecasting, SAP',
        'Nursing/healthcare: Patient assessment, EHR systems (Epic, Cerner), IV therapy, BLS/ACLS certification, care coordination',
        'Project management: Agile/Scrum, JIRA, stakeholder management, budget tracking, risk management, PMP certification',
      ] },
      { type: 'paragraph', text: 'If you’re unsure which of your skills to prioritize for a specific application, Prime Resume AI’s ATS score checker compares your resume against a job description and flags which important keywords from the posting are missing from your skills section.' },
    ],
  },
]

export const getPostBySlug = (slug) => blogPosts.find((p) => p.slug === slug)
