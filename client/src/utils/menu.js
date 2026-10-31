import { useEffect, useState } from 'react'
import api from '../configs/api'

// Same items the site shipped with (mirrors server/utils/menuDefaults.js). Rendered
// immediately and whenever the menu API can't be reached, so the nav is never empty.
export const DEFAULT_MENU = {
  header: [
    { _id: 'h-home', label: 'Home', url: '/' },
    { _id: 'h-features', label: 'Features', url: '/features' },
    { _id: 'h-testimonials', label: 'Testimonials', url: '/#testimonials' },
    { _id: 'h-builder', label: 'Builder', url: '/app', children: [
      { _id: 'h-builder-app', label: 'AI Resume builder & CV maker', url: '/app', icon: 'sparkles', description: 'Build, edit and download an ATS-friendly resume or CV' },
      { _id: 'h-builder-examples', label: 'Examples of 100/100 CV and resume', url: '/examples', icon: 'award', description: 'Real samples that pass every automatic ATS check' },
    ] },
    { _id: 'h-templates', label: 'Templates', url: '/templates' },
    { _id: 'h-cv', label: 'CV Builder', url: '/cv-builder' },
    { _id: 'h-products', label: 'Products', url: '/products', children: [
      { _id: 'h-products-all', label: 'All free tools', url: '/products', icon: 'layout', description: 'Every tool in one place, with search' },
      { _id: 'h-products-builder', label: 'Resume builder', url: '/app', icon: 'file-text', description: 'Build and download an ATS-friendly resume' },
      { _id: 'h-products-cv', label: 'AI CV builder', url: '/cv-builder', icon: 'sparkles', description: 'A tailored CV from your real details' },
      { _id: 'h-products-ats', label: 'ATS resume checker', url: '/features/ats-checker', icon: 'file-check', description: 'Upload a resume and get a score with fixes' },
      { _id: 'h-products-bullets', label: 'Resume bullet improver', url: '/products/resume-bullet-improver', icon: 'list-checks', description: 'Make weak resume lines clear and strong' },
      { _id: 'h-products-jd', label: 'Job description matcher', url: '/resume-job-description-matcher', icon: 'target', description: 'See which job keywords your resume lacks' },
      { _id: 'h-products-cover', label: 'Cover letter generator', url: '/products/cover-letter-generator', icon: 'mail', description: 'A short, honest draft for any job advert' },
      { _id: 'h-products-playground', label: 'React and Angular playground', url: '/products/code-playground', icon: 'code', description: 'Write code on the left, see it run on the right' },
      { _id: 'h-products-linkedin', label: 'LinkedIn headline and About', url: '/products/linkedin-headline-about-generator', icon: 'linkedin', description: 'Headline options and an About section' },
      { _id: 'h-products-offer', label: 'Job offer comparison', url: '/products/job-offer-comparison', icon: 'scale', description: 'Compare two job offers side by side' },
      { _id: 'h-products-mock', label: 'Mock interview practice', url: '/products/mock-interview-practice', icon: 'message-square', description: 'Answer real questions and get feedback' },
      { _id: 'h-products-questions', label: 'Interview questions bank', url: '/jobs/interview-questions', icon: 'book-open', description: 'Questions with model answers' },
      { _id: 'h-products-enhancer', label: 'Image enhancer', url: '/products/image-enhancer', icon: 'zoom-in', description: 'Sharpen photos and enlarge them to 4K or 8K' },
      { _id: 'h-products-converter', label: 'Image to PDF, Word and text', url: '/products/image-converter', icon: 'file-image', description: 'Pictures to one PDF, Word or text file' },
    ] },
    { _id: 'h-blog', label: 'Blog', url: '/blog' },
    { _id: 'h-learn', label: 'Learn', url: '/learn', children: [
      { _id: 'h-learn-tutorials', label: 'Tutorials', url: '/learn' },
      { _id: 'h-learn-roadmaps', label: 'All roadmaps', url: '/roadmaps' },
      { _id: 'h-learn-roles', label: 'Role roadmaps', url: '/roadmaps?kind=role' },
      { _id: 'h-learn-tech', label: 'Technology roadmaps', url: '/roadmaps?kind=technology' },
      { _id: 'h-learn-career', label: 'Career paths', url: '/roadmaps?kind=career' },
    ] },
    { _id: 'h-jobs', label: 'Jobs', url: '/jobs', children: [
      { _id: 'h-jobs-browse', label: 'Browse jobs', url: '/jobs' },
      { _id: 'h-jobs-interview', label: 'Interview questions', url: '/jobs/interview-questions' },
      { _id: 'h-jobs-salaries', label: 'Salaries', url: '/jobs/salaries' },
      { _id: 'h-jobs-reviews', label: 'Company reviews', url: '/jobs/company-reviews' },
    ] },
    { _id: 'h-contact', label: 'Contact Us', url: '/#contact-us' },
  ],
  footer_product: [
    { _id: 'fp-home', label: 'Home', url: '/' },
    { _id: 'fp-support', label: 'Support', url: '/' },
    { _id: 'fp-pricing', label: 'Pricing', url: '/' },
    { _id: 'fp-affiliate', label: 'Affiliate', url: '/' },
  ],
  footer_resources: [
    { _id: 'fr-templates', label: 'Templates', url: '/templates' },
    { _id: 'fr-ats', label: 'ATS Checker', url: '/features/ats-checker' },
    { _id: 'fr-cv', label: 'CV Builder', url: '/cv-builder' },
    { _id: 'fr-examples', label: '100/100 Resume Examples', url: '/examples' },
    { _id: 'fr-match', label: 'Job Match Tool', url: '/resume-job-description-matcher' },
    { _id: 'fr-products', label: 'Products', url: '/products' },
    { _id: 'fr-blog', label: 'Blog', url: '/blog' },
    { _id: 'fr-learn', label: 'Learn', url: '/learn' },
    { _id: 'fr-roadmaps', label: 'Roadmaps', url: '/roadmaps' },
    { _id: 'fr-interview', label: 'Interview Questions', url: '/jobs/interview-questions' },
    { _id: 'fr-salaries', label: 'Salaries', url: '/jobs/salaries' },
    { _id: 'fr-reviews', label: 'Company Reviews', url: '/jobs/company-reviews' },
    { _id: 'fr-jobs', label: 'Jobs', url: '/jobs' },
    { _id: 'fr-hire', label: 'Hire Talent', url: '/hire' },
    { _id: 'fr-contact', label: 'Contact', url: '/contact-us' },
  ],
  footer_legal: [
    { _id: 'fl-privacy', label: 'Privacy', url: '/privacy-policy' },
    { _id: 'fl-terms', label: 'Terms', url: '/terms-and-conditions' },
  ],
}

// One shared request for the whole page load (NavBar and Footer both ask), reused
// for 30 seconds while the visitor moves between pages.
let cache = null
let cachedAt = 0
let inflight = null

// The API sends a flat list where a sub-link carries its parent's id; turn that into
// top-level items with a `children` array. A sub-link whose parent is hidden is dropped with it.
const nest = (menu) => {
  const list = menu.header || []
  const top = list.filter((i) => !i.parent).map((i) => ({ ...i, children: list.filter((c) => c.parent === i._id) }))
  return { ...menu, header: top }
}

const fetchMenu = () => {
  if (cache && Date.now() - cachedAt < 30000) return Promise.resolve(cache)
  if (!inflight) {
    inflight = api.get('/api/menu')
      .then(({ data }) => { cache = nest({ ...DEFAULT_MENU, ...data.menu }); cachedAt = Date.now(); return cache })
      .catch(() => cache || DEFAULT_MENU)
      .finally(() => { inflight = null })
  }
  return inflight
}

// Call after the admin edits the menu so the live nav refreshes immediately.
export const invalidateMenu = () => { cache = null; cachedAt = 0 }

export const useMenu = () => {
  const [menu, setMenu] = useState(cache || DEFAULT_MENU)
  useEffect(() => {
    let live = true
    fetchMenu().then((m) => { if (live) setMenu(m) })
    return () => { live = false }
  }, [])
  return menu
}
