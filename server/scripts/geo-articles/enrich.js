import { SRC } from './helpers.js';
// Adds GEO fields (key takeaways, FAQ, sources) to the posts that already exist. Text is never touched.
export const enrich = {
  'how-to-write-a-resume-summary': {
    takeaways: ['A summary is two or three lines at the top: your role, your level of experience and your strongest relevant skills.', 'Write it for the job you are applying to, using true words from the job post.', 'Skip empty adjectives such as "hardworking" unless you back them with a fact.'],
    faqs: [{ q: 'How long should a resume summary be?', a: 'Two to three lines, or about 40 to 60 words. Long enough to show fit, short enough to read in seconds.' }, { q: 'Should a fresher write a summary?', a: 'Yes. Name your field, your training or projects, and what role you want.' }, { q: 'Should I write it in the first person?', a: 'Most resumes drop "I" and use short phrases, such as "Customer support specialist with 3 years of experience."' }],
    sources: [SRC.uk],
  },
  'ats-friendly-resume-format-guide': {
    takeaways: ['Use one column, standard headings and real text. Software reads in order from top to bottom.', 'Avoid tables, text boxes, icons and key details inside headers or footers.', 'Send a text-based PDF unless the employer asks for Word.'],
    faqs: [{ q: 'What does ATS mean?', a: 'Applicant tracking system, software that employers use to collect, store and search job applications.' }, { q: 'Does ATS give a pass or fail?', a: 'It depends on the system and the employer. Many mainly store and parse your resume so a recruiter can search it. A clean format helps the text be read correctly.' }, { q: 'Which file type is safest?', a: 'A text-based PDF or a Word file. Scanned images of text cannot be read as text.' }],
    sources: [SRC.uk],
  },
  'resume-bullet-point-examples': {
    takeaways: ['Start each bullet with an action verb and say what you did and what happened.', 'Add a number only when it is real. If you do not have one, describe the task clearly.', 'Put the most relevant bullets first under each job.'],
    faqs: [{ q: 'How many bullets per job?', a: 'Three to six for recent roles, fewer for older ones. Quality matters more than the count.' }, { q: 'What if I do not have numbers?', a: 'Use scale or frequency in plain words, such as "daily" or "for a team of eight", and describe the result. Never invent figures.' }, { q: 'Which tense should I use?', a: 'Present tense for your current role and past tense for earlier ones.' }],
    sources: [SRC.uk],
  },
  'resume-vs-cv-difference': {
    takeaways: ['In the UK, Ireland and many African countries "CV" is the usual word for a job application document.', 'In Canada and the US, "resume" is the usual word, and "CV" often means a longer academic document.', 'When unsure, use the word in the job post and keep to one or two pages.'],
    faqs: [{ q: 'Are a resume and a CV the same?', a: 'In many countries they mean the same document. Academic and research CVs are longer and list publications and teaching.' }, { q: 'Which should I send?', a: 'Use the term in the job post. If it says CV, send a CV. If it says resume, send a resume.' }, { q: 'How long should each be?', a: 'One or two pages for most jobs.' }],
    sources: [SRC.uk, SRC.jobbank, SRC.ncs],
  },
  'how-long-should-a-resume-be': {
    takeaways: ['One page is enough for most freshers and early-career workers.', 'Two pages suit people with many years of relevant experience.', 'Cut older or unrelated jobs before you reduce the font size.'],
    faqs: [{ q: 'Is a two-page resume bad?', a: 'No, if both pages are relevant and the first page has your best content.' }, { q: 'Can I use a small font to fit one page?', a: 'Keep text readable. Cut content instead of shrinking it.' }, { q: 'Does length matter to ATS?', a: 'Not much. Readability and relevance matter more.' }],
    sources: [SRC.uk, SRC.jobbank],
  },
  'cover-letter-examples-that-work': {
    takeaways: ['Keep a cover letter to one page, addressed to a real person when you can find the name.', 'Say why this job and this company, then give one or two honest examples of fit.', 'Do not repeat your resume. Add the story behind it.'],
    faqs: [{ q: 'Do I always need a cover letter?', a: 'Not always, but when the job post asks for one, write one. A short, specific letter can help when your resume alone does not explain your fit.' }, { q: 'How long should it be?', a: 'Three or four short paragraphs, under one page.' }, { q: 'Should I send the same letter to every employer?', a: 'No. Change the company name, the role and the examples each time.' }],
    sources: [SRC.uk],
  },
  'how-to-list-skills-on-resume': {
    takeaways: ['List skills you can honestly demonstrate, and use the job post\'s words when they are true.', 'Group them, for example tools, technical skills and strengths.', 'Show the important skills again inside your bullets as proof.'],
    faqs: [{ q: 'How many skills should I list?', a: 'Eight to fifteen relevant ones is usual. More than that dilutes the list.' }, { q: 'Should I rate my skills with bars or stars?', a: 'No. They are hard for software to read and are subjective.' }, { q: 'What is the difference between hard and soft skills?', a: 'Hard skills are teachable abilities and tools. Soft skills are habits such as communication. Show soft skills through examples.' }],
    sources: [SRC.ncs],
  },
};
