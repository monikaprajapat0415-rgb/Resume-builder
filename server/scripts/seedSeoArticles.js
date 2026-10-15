// Adds the first supporting articles from the 2026 SEO plan as DRAFTS (not public) so you can review them,
// add your own screenshots, and publish from /admin/blogs. Safe to re-run: matched by slug, existing posts
// are not overwritten unless you pass --force.
//
// Usage (from server/):  node scripts/seedSeoArticles.js            -> create drafts
//                        node scripts/seedSeoArticles.js --publish  -> create and publish immediately
import "dotenv/config";
import connectDB from "../configs/db.js";
import Blog from "../models/Blog.js";

const publish = process.argv.includes('--publish');
const force = process.argv.includes('--force');
const P = (text) => ({ type: 'paragraph', text });
const H = (text) => ({ type: 'heading', text });
const L = (...items) => ({ type: 'list', items });
const O = (...items) => ({ type: 'olist', items });

const posts = [
  {
    slug: 'how-to-tailor-your-resume-to-a-job-description',
    title: 'How to Tailor Your Resume to a Job Description (Step by Step)',
    description: 'A practical, honest method to tailor your resume to any job description: find the keywords that matter, match them to your real experience, and avoid common mistakes.',
    keywords: 'tailor resume to job description, resume keywords, job specific resume, resume job match',
    excerpt: 'Sending the same resume to every job is the quickest way to get ignored. Here is a five-step method to tailor yours in about 20 minutes, without exaggerating anything.',
    readTime: '7 min read',
    content: [
      P('A generic resume describes what you have done. A tailored resume shows how that matches what one specific employer needs. Recruiters and applicant tracking systems (ATS) both look for that match, and the job description tells you exactly what they are looking for.'),
      P('Tailoring does not mean rewriting your whole resume or claiming skills you do not have. It means choosing which true things to put first, and describing them in the employer\'s words. This guide shows a method you can repeat for every application.'),
      H('Step 1: Read the job description like a checklist'),
      P('Copy the job post into a document and mark three things: the job title, the skills and tools that are mentioned more than once, and the responsibilities listed first. Employers usually list the most important requirements near the top and repeat what they care about most.'),
      L('Hard skills and tools (for example Excel, Python, Salesforce, AutoCAD).', 'Responsibilities (for example "manage vendor relationships" or "build REST APIs").', 'Soft skills only when they are specific (for example "present to senior stakeholders").', 'The exact job title, because ATS searches often use it.'),
      H('Step 2: Compare it with your real experience'),
      P('Put your resume next to your list. For each item, ask: have I done this, even under a different name? Be strict. Only items you can discuss in an interview belong on your resume. Our free [resume job description matcher](/resume-job-description-matcher) does this comparison for you: paste both texts and it shows which keywords are strong, weak or missing.'),
      H('Step 3: Rewrite your summary for this job'),
      P('Your summary is the best place to show fit quickly. Name the target role, your years or level of experience, and two or three of the most relevant strengths. Keep it to two or three lines.'),
      { type: 'note', text: 'Before: "Hardworking professional seeking a challenging role." After: "Customer support specialist with 3 years of experience resolving billing and technical tickets in SaaS, skilled in Zendesk and escalation handling." Use only facts that are true for you.' },
      H('Step 4: Reorder and reword your bullet points'),
      P('Move the achievements most relevant to this job to the top of each role. Where you used different words for the same activity, switch to the employer\'s wording. If the post says "stakeholder management" and your bullet says "worked with clients", rewrite it to describe what you did using their term.'),
      L('Start each bullet with an action verb (built, led, reduced, launched).', 'Add a number only when you actually have one: percentages, users, money, time saved.', 'Cut bullets that have nothing to do with the job to make room for the ones that do.'),
      H('Step 5: Check the skills section and the format'),
      P('List the skills the job asks for that you genuinely have, in a plain skills line or section. Then make sure the layout is readable by software: one column, standard headings, no tables or text boxes, and a text-based PDF or Word file. Our [free ATS checker](/features/ats-checker) reviews the structure and tells you what to fix.'),
      H('Common mistakes to avoid'),
      L('Copying whole sentences from the job post. It reads as generic and can contradict your experience.', 'Adding skills you do not have. You will be asked about them.', 'Stuffing keywords in white text or hidden text. Many systems flag it and recruiters dislike it.', 'Forgetting to save a separate copy for each application, so you lose track of what you sent.'),
      H('How long should tailoring take?'),
      P('Once you have a strong base resume, about 15 to 20 minutes per job: read the post, adjust the summary, reorder a few bullets, and check the keywords. If you are applying to many similar roles, keep one tailored version per role type rather than per company.'),
      H('Quick checklist'),
      O('Job title matches the role you are applying for (where honest).', 'Summary names the role and your top strengths for it.', 'The most relevant achievements come first.', 'Important keywords from the job appear in context, not only in a list.', 'Layout is a single column with standard headings.'),
      P('Ready to apply? Run your resume and the job post through the [job description matcher](/resume-job-description-matcher), then build or edit your resume in [Prime Resume AI](/app) and use the [CV builder](/cv-builder) if the employer asks for a CV.'),
    ],
    focusKeyword: 'tailor resume to job description',
    takeaways: ['Tailor the summary, the order of your bullets and the skills line, not your whole resume.', 'Only add keywords that are true for you, and use them inside bullets that show results.', 'Keep a separate saved copy per application.'],
    faqs: [
      { q: 'Should I tailor my resume for every job?', a: 'Yes, at least lightly. You do not need a full rewrite: update the summary, reorder bullets and align the key skills with each job post.' },
      { q: 'Can ATS tell if I added keywords I do not have?', a: 'The software cannot, but a recruiter or interviewer can. Only include skills you can talk about.' },
    ],
  },
  {
    slug: 'how-to-check-your-resume-for-ats-compatibility',
    title: 'How to Check Your Resume for ATS Compatibility',
    description: 'Learn what an applicant tracking system reads, the formatting mistakes that cause problems, and a simple checklist to test whether your resume is ATS-friendly.',
    keywords: 'check resume for ATS, ATS compatibility, ATS friendly resume check, resume scanner',
    excerpt: 'Many employers use an applicant tracking system to store and search resumes. Here is what it reads, what breaks it, and how to test your own resume in minutes.',
    readTime: '6 min read',
    content: [
      P('An applicant tracking system (ATS) is software that employers use to collect applications, store resumes and let recruiters search them. When you upload a resume, the system tries to turn it into structured data: your name, contact details, job titles, dates, education and skills. If it cannot read part of your file, that information may be missing or mixed up in the recruiter\'s view.'),
      P('No tool can promise that a resume will pass every ATS, because each system works differently and employers set their own filters. What you can do is remove the common problems and make your resume easy to read for both software and people.'),
      H('What an ATS needs from your resume'),
      L('Real text it can select and copy, not an image of text.', 'Standard section headings such as Experience, Education and Skills.', 'A simple order: contact details, summary, experience, education, skills.', 'Clear dates and job titles for every role.'),
      H('Formatting that commonly causes problems'),
      L('Tables, text boxes and multi-column layouts, which can scramble the reading order.', 'Information placed in headers or footers, which some systems skip.', 'Icons, graphics, skill-rating bars and photos that carry meaning.', 'Resumes exported as images or scanned PDFs.', 'Unusual section names such as "My Journey" instead of "Experience".', 'Special bullet symbols or fonts that do not copy as normal text.'),
      H('A five-minute manual test'),
      O('Open your resume PDF and try to select the text with your mouse. If you cannot, it is probably an image.', 'Copy everything and paste it into a plain text editor. Read the result from top to bottom.', 'Check that your name, email, phone and job titles appear in a sensible order.', 'Check that dates stay next to the right job and nothing is merged or missing.', 'Check that headings are standard and the skills list is readable.'),
      P('If the pasted text looks jumbled, a system will probably see the same thing. Fix the layout before you worry about keywords.'),
      H('Use a checker to catch what you miss'),
      P('Our [free ATS resume checker](/features/ats-checker) reads your PDF or Word file the way parsing software does and reports problems with structure, sections and keywords, with specific fixes. It is a guide, not a guarantee, but it quickly shows the issues worth fixing.'),
      H('Then check the keywords for the job'),
      P('Formatting gets your resume read; keywords help it get found. Compare your resume with the job post using the [job description matcher](/resume-job-description-matcher) and add missing skills only where they are true. Our guide on [tailoring your resume to a job description](/blog/how-to-tailor-your-resume-to-a-job-description) explains how.'),
      H('Start with an ATS-friendly layout'),
      P('The easiest way to avoid formatting problems is to start from a simple, single-column layout. Prime Resume AI\'s [templates](/templates) and [CV builder](/cv-builder) use clean text-based layouts, and the CV builder exports a PDF with selectable text.'),
      H('Quick checklist'),
      L('Single column, no tables or text boxes.', 'Standard headings and consistent dates.', 'Text can be selected and copied from the PDF.', 'Contact details are in the main body, not the header.', 'Keywords from the job appear in your experience and skills.'),
    ],
    focusKeyword: 'check resume for ATS',
    takeaways: ['An ATS turns your resume into structured data; tables, columns and images can break that.', 'Test it yourself: select the text in your PDF, paste it into a plain text editor and read it top to bottom.', 'No tool can guarantee passing every ATS, so use checkers as guides.'],
    faqs: [
      { q: 'Is there a perfect ATS score?', a: 'No. Every system and every employer is different. Scores from checkers are guides that point out fixable problems.' },
      { q: 'Should I upload a PDF or a Word file?', a: 'Follow the employer\'s instructions. If none are given, a text-based PDF or a .docx file usually works. Avoid scanned or image-only files.' },
    ],
  },
];

await connectDB();
for (const p of posts) {
    const exists = await Blog.findOne({ slug: p.slug });
    if (exists && !force) { console.log(`Exists, skipped: ${p.slug}${exists.published ? ' (published)' : ' (draft)'}`); continue; }
    const doc = await Blog.findOneAndUpdate({ slug: p.slug }, { ...p, date: new Date(), published: publish }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
    console.log(`${publish ? 'Published' : 'Draft saved'}: ${doc.slug}`);
}
process.exit(0);
