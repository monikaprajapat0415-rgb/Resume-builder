// Template landing page content, data-driven like blogPosts.js so a new template
// page only requires adding an entry here (plus the template itself already existing
// in components/templates and TemplateSelector). The sitemap in vite.config.js reads
// slugs from the separate templateSlugs.js file instead of this one (this file imports
// images, which esbuild can't resolve inside vite.config.js) — keep the `slug` values
// below in sync with templateSlugs.js if either one changes.

import classicImg from '../assets/Classic.png'
import modernImg from '../assets/modern.png'
import minimalImg from '../assets/Minimal.png'
import minimalImageImg from '../assets/MinimalwithImage.png'

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
    bestFor: ['Applications in Europe, the Middle East, and Asia where a photo is customary', 'Sales, hospitality, and customer-facing roles', 'LinkedIn-style profile resumes for networking, not ATS submission'],
    features: [
      'Dedicated, proportioned photo placement that stays professional',
      'Same clean, minimal typography as the standard Minimal template',
      'Easy to remove the photo later if you need an ATS-safe version',
      'Works well for both local and international applications',
    ],
  },
]

export const getTemplateBySlug = (slug) => resumeTemplates.find((t) => t.slug === slug)
