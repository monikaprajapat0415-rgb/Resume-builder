import { LuFileText, LuSparkles, LuFileCheck, LuTarget, LuListChecks, LuMail, LuLinkedin, LuScale, LuMessageSquare, LuBookOpen, LuZoomIn, LuFileImage } from 'react-icons/lu'

// The free tools shown on /products. One list so the hub, the tool pages ("More tools") and the menus agree.
// `flag` is the Admin > Free tools switch (tools without one are core and always shown). Taglines are plain and honest.
export const GROUPS = [
  { id: 'resume', title: 'Resume and CV', blurb: 'Build it, check it, tighten it.', tile: 'bg-brand-100 text-brand-700', ring: 'hover:border-brand-300' },
  { id: 'jobs', title: 'Job applications', blurb: 'Write, match and compare.', tile: 'bg-sky-100 text-sky-700', ring: 'hover:border-sky-300' },
  { id: 'interview', title: 'Interview practice', blurb: 'Practise before it counts.', tile: 'bg-violet-100 text-violet-700', ring: 'hover:border-violet-300' },
  { id: 'files', title: 'Photos and documents', blurb: 'Fix and convert pictures.', tile: 'bg-amber-100 text-amber-700', ring: 'hover:border-amber-300' },
]

export const TOOLS = [
  { id: 'builder', name: 'Resume builder', tagline: 'Pick a template, fill it in and download an ATS-friendly resume.', path: '/app', group: 'resume', icon: LuFileText, access: 'Free account' },
  { id: 'cv', name: 'AI CV builder', tagline: 'A tailored CV written from your real details and a job description.', path: '/cv-builder', group: 'resume', icon: LuSparkles, access: 'Free account', ai: true },
  { id: 'ats', name: 'ATS resume checker', tagline: 'Upload a PDF or Word resume and get a score with fixes.', path: '/features/ats-checker', group: 'resume', icon: LuFileCheck, access: 'Free account' },
  { id: 'bullets', name: 'Resume bullet improver', tagline: 'Turn weak lines into clear, action-led bullets without made-up numbers.', path: '/products/resume-bullet-improver', group: 'resume', icon: LuListChecks, access: 'Free account', ai: true, flag: 'bulletTool' },
  { id: 'jd', name: 'Job description matcher', tagline: 'See which keywords from a job advert your resume has and lacks.', path: '/resume-job-description-matcher', group: 'jobs', icon: LuTarget, access: 'No sign-in' },
  { id: 'cover', name: 'Cover letter generator', tagline: 'A short, honest draft from your experience and the job advert.', path: '/products/cover-letter-generator', group: 'jobs', icon: LuMail, access: 'Free account', ai: true, flag: 'coverLetterTool' },
  { id: 'linkedin', name: 'LinkedIn headline and About writer', tagline: 'Three headline options and an About section from your real facts.', path: '/products/linkedin-headline-about-generator', group: 'jobs', icon: LuLinkedin, access: 'Free account', ai: true, flag: 'linkedinTool' },
  { id: 'offer', name: 'Job offer comparison', tagline: 'Put two offers side by side: yearly total, benefits, costs and notice.', path: '/products/job-offer-comparison', group: 'jobs', icon: LuScale, access: 'No sign-in', flag: 'offerTool' },
  { id: 'mock', name: 'Mock interview practice', tagline: 'Answer a real question and get feedback against a model answer.', path: '/products/mock-interview-practice', group: 'interview', icon: LuMessageSquare, access: 'Free account', ai: true, flag: 'interviewTool' },
  { id: 'questions', name: 'Interview questions bank', tagline: 'Questions with model answers for freshers and experienced people.', path: '/jobs/interview-questions', group: 'interview', icon: LuBookOpen, access: 'No sign-in' },
  { id: 'enhancer', name: 'Image enhancer', tagline: 'Sharpen soft photos and enlarge them to 2K, 4K or 8K.', path: '/products/image-enhancer', group: 'files', icon: LuZoomIn, access: 'Free account', flag: 'imageEnhancer' },
  { id: 'converter', name: 'Image to PDF, Word and text', tagline: 'Combine pictures into one file, with OCR. Runs on your device.', path: '/products/image-converter', group: 'files', icon: LuFileImage, access: 'No sign-in' },
]

export const toolByPath = (p) => TOOLS.find((t) => t.path === p)
export const visibleTools = (settings) => TOOLS.filter((t) => !t.flag || settings?.[t.flag] !== false)
export const hiddenToolPaths = (settings) => TOOLS.filter((t) => t.flag && settings?.[t.flag] === false).map((t) => t.path)
