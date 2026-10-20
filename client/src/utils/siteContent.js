import { useEffect, useState } from 'react'
import api from '../configs/api'

// Mirrors server/utils/siteContentDefaults.js. Used immediately on first paint and
// whenever the API is unreachable, so the homepage text is never blank.
export const DEFAULT_SITE = {
  banner_show: 'true',
  banner_badge: 'New',
  banner_text: 'AI Feature Added',
  hero_line1: 'Land your dream job with',
  hero_highlight: 'AI-powered',
  hero_line2: 'resumes.',
  hero_subtext: 'Create, edit, and download professional resumes with AI-powered assistance.',
  hero_button: 'Create my resume',
  hero_chips: 'Free to start, ATS-friendly templates, For office, factory and skilled jobs',
  career_title: 'Grow your career, not just your resume',
  career_text: 'Find what to learn next, prepare for interviews, and check pay and employers before you apply. All free to read.',
  career_chips: 'Full Stack Developer, Frontend Developer, SQL Developer, DevOps Engineer, Data Analyst, React',
  why_title: 'Why job seekers use Prime Resume AI',
  faq_1_q: 'Is Prime Resume AI free?',
  faq_1_a: 'Yes. You can build a resume and download it for free. Some extras may need an account.',
  faq_2_q: 'Are the resume templates ATS-friendly?',
  faq_2_a: 'Yes. The templates use clean, single-flow layouts that applicant tracking systems can parse. You can also run your resume through the free ATS checker.',
  faq_3_q: 'Can I use it if I have no office experience?',
  faq_3_a: 'Yes. It supports factory, trade, driving, retail and other skilled jobs, and fresher resumes with no work history.',
  faq_4_q: 'Does the AI write my resume for me?',
  faq_4_a: 'It suggests wording for your summary and bullet points. You review and edit every line before you download.',
  faq_5_q: 'How are salary figures and company reviews checked?',
  faq_5_a: 'They are shared by members and reviewed before they appear. A salary range or an average rating is shown only after at least three reports agree.',
  faq_6_q: 'Where can I find interview questions?',
  faq_6_a: 'Under Jobs, Interview questions: questions for freshers and experienced candidates with model answers.',
  cta_text: 'Build a Professional Resume That Help You Stand Out and Get Hired',
  cta_button: 'Get Started',
  contact_email: 'support@primeresumeai.com',
  contact_phone: '+91 7976204889',
  contact_address: 'New Delhi, India',
  theme_primary: '#00a63e',
  feature_cover_letter: 'false',
}

let cache = null
let cachedAt = 0
let inflight = null

const fetchSite = () => {
  if (cache && Date.now() - cachedAt < 30000) return Promise.resolve(cache)
  if (!inflight) {
    inflight = api.get('/api/site-content')
      .then(({ data }) => { cache = { ...DEFAULT_SITE, ...data.values }; cachedAt = Date.now(); return cache })
      .catch(() => cache || DEFAULT_SITE)
      .finally(() => { inflight = null })
  }
  return inflight
}

export const invalidateSiteContent = () => { cache = null; cachedAt = 0 }

export const useSiteContent = () => {
  const [site, setSite] = useState(cache || DEFAULT_SITE)
  useEffect(() => {
    let live = true
    fetchSite().then((v) => { if (live) setSite(v) })
    return () => { live = false }
  }, [])
  return site
}
