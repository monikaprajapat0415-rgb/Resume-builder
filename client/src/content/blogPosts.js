// Blog content, stored as structured data rather than markdown so each post renders
// through the same BlogPost page without adding a markdown-parsing dependency.
// Each post's `content` is an array of simple blocks: heading, paragraph, list.
//
// To add a new post: add an object here with a unique `slug`, then it automatically
// appears on /blog and is reachable at /blog/:slug - no route changes needed.

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
]

export const getPostBySlug = (slug) => blogPosts.find((p) => p.slug === slug)
