// Starter career roadmaps. Safe to re-run: roadmaps that already exist (same slug) are left alone,
// so edits made in Admin > Roadmaps are never overwritten. Use --replace to reset them.
//   node scripts/seedRoadmaps.js [--replace]
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../configs/db.js';
import Roadmap from '../models/Roadmap.js';

const L = (label, url) => ({ label, url });
const CV = L('Build your resume', '/cv-builder');
const TPL = L('Resume templates', '/templates');
const ATS = L('Check your resume (ATS)', '/features/ats-checker');
const MATCH = L('Match your resume to a job', '/resume-job-description-matcher');
const JOBS = L('Browse jobs', '/jobs');
const S = (title, pace, description, skills, tips, links = []) => ({ title, pace, description, skills, tips, links });

const roadmaps = [
  {
    slug: 'warehouse-worker-to-supervisor', title: 'Warehouse Worker to Supervisor: Career Roadmap', badge: 'WH', audience: 'Factory & warehouse', order: 1,
    summary: 'From picking and packing to leading a shift: the skills, habits and resume changes that get you noticed.',
    description: 'A step-by-step roadmap for warehouse and logistics workers who want to become a team leader or supervisor: safety, accuracy, systems, leading people and how to show it on your resume.',
    tags: ['warehouse', 'supervisor', 'logistics', 'career path'], keywords: 'warehouse supervisor career path, how to become a warehouse supervisor, warehouse worker promotion',
    steps: [
      S('Be the person who is reliable', 'First months', 'Supervisors are chosen from people the team already trusts. Arrive on time, follow safety rules every day and finish the job properly even when nobody is checking.', ['Punctuality', 'Safety rules', 'Following instructions'], ['Ask your supervisor what a good week looks like for your role, then aim for that.', 'Keep a small notebook of problems you solved. You will use it for your resume.']),
      S('Master your own work and the basics of the site', 'Months 2 to 6', 'Learn every task in your area: receiving, put-away, picking, packing and loading. Learn how stock is counted and how mistakes are found. Knowing the whole flow lets you help others and spot problems early.', ['Picking and packing accuracy', 'Stock counting', 'Loading and unloading', 'Safe lifting'], ['Offer to cover other stations. Cross-trained people are the first ones asked to lead.']),
      S('Learn the systems and equipment', 'Months 4 to 9', 'Most sites use a warehouse management system, scanners and machinery such as pallet trucks or forklifts. Ask for training, and get any licence or certificate your country requires before you operate equipment.', ['Handheld scanners', 'Warehouse management software', 'Forklift or pallet truck (with the required licence)', 'Basic spreadsheets'], ['Never operate equipment you are not certified for. Ask for the training instead.'], [L('Free tutorials on Learn', '/learn')]),
      S('Show you can lead without a title', 'Months 6 to 12', 'Train new starters, suggest a better way to arrange stock, or lead a small task. Leading is mostly helping others do the work well and speaking up politely when something is unsafe or wrong.', ['Training new staff', 'Clear communication', 'Problem solving', 'Teamwork'], ['Be calm and fair. People follow supervisors who treat everybody the same.']),
      S('Update your resume with results', 'Before you apply', 'Turn your notebook into short bullet points that start with an action word and show a result, such as fewer picking errors or faster loading. Only write what is true and that you can explain in an interview.', ['Resume writing', 'Action verbs', 'Measuring results'], ['Use a plain, one-column template so job systems can read it.'], [CV, TPL, ATS]),
      S('Apply for team leader and supervisor roles', 'When you are ready', 'Ask your own manager first. Many promotions happen inside the same company. At the same time, look at supervisor and team leader openings and match your resume to each advert.', ['Interview preparation', 'Matching a resume to a job'], ['Prepare two or three real stories: a time you solved a problem, trained someone, and improved safety.'], [MATCH, JOBS]),
      S('Grow into the role', 'After you are promoted', 'Your job now is to get results through other people: planning the shift, keeping people safe, giving clear instructions and reporting problems early. Keep learning about planning, performance numbers and people management.', ['Shift planning', 'Giving feedback', 'Reporting and basic data', 'Health and safety'], ['Ask your manager for feedback every month, and thank your team in public.']),
    ],
    faqs: [
      { q: 'Do I need a degree to become a warehouse supervisor?', a: 'Usually not. Employers mostly look for experience, a good safety and attendance record, and the ability to lead. Some companies ask for a certificate in warehousing or safety. Check the adverts in your area.' },
      { q: 'How long does it take to become a supervisor?', a: 'It depends on the company, your results and how many positions open. Many people move up after one to a few years of steady, reliable work. This roadmap shows a suggested order of steps, not a promise of timing.' },
      { q: 'What should a warehouse supervisor resume include?', a: 'Your equipment and systems experience, safety training, any training of new staff, and results with numbers you can prove. Keep it to one or two pages in a simple layout.' },
    ],
  },
  {
    slug: 'delivery-driver-to-dispatcher', title: 'Delivery Driver to Dispatcher or Fleet Coordinator: Career Roadmap', badge: 'DR', audience: 'Drivers & transport', order: 2,
    summary: 'Move from driving routes to planning them: licences, records, route skills and how to present your driving history.',
    description: 'A roadmap for delivery and truck drivers who want to move into dispatch, route planning or fleet coordination: a clean record, route knowledge, simple software skills and a resume that shows reliability.',
    tags: ['driver', 'dispatcher', 'fleet', 'transport'], keywords: 'driver to dispatcher career path, how to become a dispatcher, fleet coordinator career',
    steps: [
      S('Keep a clean licence and a safe record', 'Always', 'Your driving record is your main proof of trust. Follow the rules, keep your vehicle documents up to date and report accidents or damage honestly and quickly.', ['Safe driving', 'Vehicle checks', 'Following traffic law'], ['Take a photo of your vehicle check before you start each day if your employer allows it.']),
      S('Learn your routes and your customers', 'First months', 'Know the roads, the best times, the loading points and the customers who need extra care. Dispatchers are people who understand how a route works in real life.', ['Route knowledge', 'Time management', 'Customer service'], ['Tell dispatch early when a delay is coming. Early news helps everyone plan.']),
      S('Get comfortable with phones, maps and delivery apps', 'Months 2 to 4', 'Learn to use navigation, delivery proof and messaging tools well. Simple digital skills open the door to office-based transport jobs.', ['GPS and route apps', 'Delivery proof and scanning', 'Basic spreadsheets'], ['Practise on a free spreadsheet: list deliveries, times and distances.'], [L('Free tutorials on Learn', '/learn')]),
      S('Understand the paperwork and rules', 'Months 3 to 8', 'Learn about delivery notes, invoices, working-hour rules, vehicle load limits and insurance in your country. Ask your employer or your local transport authority where to find official rules.', ['Delivery documents', 'Driver hours rules', 'Load safety', 'Basic invoicing'], ['Rules differ by country and by vehicle type. Always check the official source.']),
      S('Help the office', 'Months 6 to 12', 'Offer to help plan a route, check a delivery list or train a new driver. Show that you can think about the whole day for many drivers and not only your own truck.', ['Planning', 'Communication', 'Problem solving'], ['Write down one route you improved and what changed.']),
      S('Prepare your resume and apply', 'When you are ready', 'Put your clean record, years of experience and any systems you used at the top. Then apply for dispatcher, transport coordinator and fleet assistant roles.', ['Resume writing', 'Interview preparation'], ['Use simple words and short bullet points.'], [CV, TPL, ATS, MATCH, JOBS]),
    ],
    faqs: [
      { q: 'Can a driver become a dispatcher without a degree?', a: 'Often yes. Many dispatch roles value road experience, reliability and good communication more than a degree. Some employers prefer basic computer skills or a short course.' },
      { q: 'What skills does a dispatcher need?', a: 'Clear communication, calm decision making, route knowledge, careful record keeping and comfort with phones, maps and simple software.' },
    ],
  },
  {
    slug: 'skilled-trade-apprentice-to-contractor', title: 'Skilled Trades: From Helper to Independent Contractor', badge: 'ST', audience: 'Skilled trades', order: 3,
    summary: 'For electricians, plumbers, welders, fitters and carpenters: build skills, get certified, and start taking your own jobs.',
    description: 'A roadmap for skilled trades workers: learn on the job, get the right certificate or licence, build a portfolio of finished work and start working independently with a simple resume and clear quotes.',
    tags: ['electrician', 'plumber', 'welder', 'skilled trades', 'contractor'], keywords: 'skilled trades career path, electrician apprentice to contractor, how to become an independent tradesperson',
    steps: [
      S('Start as a helper or apprentice', 'Start here', 'Find an employer or a master tradesperson who will teach you. Watch closely, ask questions and keep your tools and workplace safe. Good habits at the start last for your whole career.', ['Tool care', 'Workplace safety', 'Reading basic drawings'], ['Keep a notebook of every job type you have seen and what you learned.']),
      S('Learn the core skills properly', 'First years', 'Practise the main tasks of your trade until they are neat and safe, not only fast. Learn to measure, to read plans and to test your work.', ['Core trade tasks', 'Measuring and marking', 'Testing and inspection'], ['Quality work brings customers who recommend you.']),
      S('Get certified or licensed', 'As soon as you are eligible', 'Many trades need a certificate or a licence to work independently, especially for electrical and gas work. Check the official body in your country and ask what training and exams are needed.', ['Trade certificate', 'Safety regulations', 'Codes and standards'], ['Only use official sources for licence rules. Requirements differ widely.']),
      S('Build proof of your work', 'Ongoing', 'Take clear before-and-after photos (with the customer’s permission), keep references and write short descriptions of the jobs. A simple portfolio turns your skill into something a customer can see.', ['Photography basics', 'Customer references'], ['Never share a customer’s address or personal details.']),
      S('Learn the business side', 'Before you go independent', 'Learn to estimate time and material, write a clear quote, keep invoices and records, and understand insurance and tax rules where you live. A small mistake in pricing can turn a good job into a loss.', ['Quoting', 'Invoicing', 'Basic bookkeeping', 'Insurance basics'], ['Ask an accountant or a local small-business office about registration and tax.']),
      S('Make your resume and profile', 'When you are ready', 'Whether you want a better employed role or your own customers, list your certificates, tools and systems you can work with, and the types of jobs you have completed.', ['Resume writing', 'Presenting your experience'], ['Put licences and certificates near the top.'], [CV, TPL, ATS]),
      S('Find work', 'Ongoing', 'Look for supervisor, site lead and specialist roles, or start taking small jobs from people you know and grow by referrals.', ['Networking', 'Customer service'], ['Reply to enquiries quickly and be honest about when you can start.'], [JOBS]),
    ],
    faqs: [
      { q: 'Do I need a licence to work as a tradesperson?', a: 'In many countries some trades, such as electrical and gas work, require a licence or registration to work independently. Check the official body for your trade and location before you take paid work on your own.' },
      { q: 'How do I show my skills if I have no formal certificate?', a: 'Use a portfolio of finished jobs with photos, references from employers or customers, and a clear list of tasks you can do. A certificate is still valuable, so plan to get one.' },
    ],
  },
  {
    slug: 'fresher-first-job', title: 'Fresher: How to Get Your First Job', badge: 'FJ', audience: 'Freshers & students', order: 4,
    summary: 'No experience yet? Choose a direction, build proof, write a clear resume and apply in a way that gets replies.',
    description: 'A practical roadmap for freshers and recent graduates: choose a direction, learn the basic skills, build small projects as proof, write an ATS-friendly resume and apply smartly.',
    tags: ['fresher', 'first job', 'graduate', 'career start'], keywords: 'how to get your first job, fresher resume, job search for freshers, first job roadmap',
    steps: [
      S('Choose a direction, not a perfect job', 'Week 1', 'Pick two or three kinds of roles that fit your studies and interests. A direction helps you decide what to learn and which jobs to apply for.', ['Self-assessment', 'Researching job roles'], ['Read real job adverts for each role and note the skills that appear again and again.'], [JOBS]),
      S('Learn the skills the adverts ask for', 'Weeks 2 to 8', 'Choose the three most common skills and learn them with free resources. Practise a little every day instead of a lot once a week.', ['Role-specific skills', 'Computer basics', 'Communication in English'], ['Use free tutorials and keep notes of what you have completed.'], [L('Free tutorials on Learn', '/learn')]),
      S('Build proof of what you can do', 'Weeks 4 to 10', 'Employers want evidence. Finish two small projects, a volunteer task, an internship or a class assignment you can describe clearly. Say what the problem was, what you did and the result.', ['Projects', 'Teamwork', 'Documentation'], ['One finished project is worth more than five unfinished ones.']),
      S('Write a clear resume', 'Week 6', 'Use a simple single-column layout. Put your skills, projects and education in a clear order. Write bullets that start with an action word and say what you did. Do not copy a template full of fake claims.', ['Resume writing', 'Honest self-presentation'], ['Ask a friend to read it and explain it back to you. If they cannot, simplify it.'], [CV, TPL, ATS]),
      S('Match your resume to each job', 'Every application', 'Read the advert, then adjust your summary and skills to use the same words honestly. Applications that match the role are much more likely to pass the first screen.', ['Keyword matching', 'Cover letters'], ['Apply to fewer jobs but match each one.'], [MATCH]),
      S('Apply, follow up and keep a log', 'Weeks 8 and onward', 'Keep a simple list of where you applied, the date and the next step. Follow up politely after a week. Rejections are normal. Use each one to improve your resume and answers.', ['Organisation', 'Professional email'], ['Check your email and phone every day during your search.'], [JOBS]),
      S('Prepare for interviews', 'Before each interview', 'Practise answering: tell me about yourself, why this job, and a time you solved a problem. Learn about the company. Arrive early and ask one or two thoughtful questions.', ['Interview skills', 'Confidence', 'Time management'], ['Practise out loud with a friend or in front of a mirror.']),
    ],
    faqs: [
      { q: 'What should a fresher put on a resume with no experience?', a: 'Education, skills, projects, internships, volunteering, certificates and achievements from college. Describe what you did and the result, and keep everything true.' },
      { q: 'How many jobs should I apply for?', a: 'There is no fixed number. It is better to send well-matched applications than many identical ones. Track each application and learn from the replies.' },
    ],
  },
  {
    slug: 'customer-support-to-team-lead', title: 'Customer Support Agent to Team Lead: Career Roadmap', badge: 'CS', audience: 'Customer service', order: 5,
    summary: 'Grow from answering customers to coaching a team: quality, tools, calm communication and leadership habits.',
    description: 'A roadmap for customer support and call-centre agents who want to become team leaders: quality, product knowledge, tools, coaching others and showing results on your resume.',
    tags: ['customer support', 'call centre', 'team lead', 'bpo'], keywords: 'customer support career path, call centre team leader, how to become a team lead',
    steps: [
      S('Deliver consistently good service', 'First months', 'Learn the product, the policies and the tone your company wants. Solve problems on the first contact where you can, and be honest when you cannot.', ['Product knowledge', 'Active listening', 'Clear writing'], ['Write down the questions you hear most often and the best answers.']),
      S('Learn the tools', 'Months 2 to 5', 'Master the ticket or call system, the knowledge base and the reports your team uses. Efficient use of tools means more time for the customer.', ['Help desk software', 'Knowledge bases', 'Basic spreadsheets'], ['Learn keyboard shortcuts for your main tools.']),
      S('Understand the numbers', 'Months 4 to 9', 'Learn what your team is measured on: response time, resolution, customer ratings and quality scores. Learn why they matter and how your work changes them.', ['Reading reports', 'Quality standards'], ['Pick one measure to improve and test one change at a time.']),
      S('Help others', 'Months 6 to 12', 'Share your answers with new team members, join quality reviews and volunteer for training sessions. Coaching is the main part of a team leader’s job.', ['Coaching', 'Giving feedback', 'Patience'], ['Give feedback on one thing at a time, kindly and with an example.']),
      S('Handle hard conversations', 'Ongoing', 'Practise staying calm with upset customers and with colleagues. Learn when to escalate a problem and how to write a clear handover.', ['De-escalation', 'Escalation handling', 'Empathy'], ['Repeat the problem back in your own words before offering a solution.']),
      S('Show your results on your resume', 'Before you apply', 'List the tools you use, your quality results and any training you did. Keep numbers honest and easy to explain.', ['Resume writing', 'Presenting results'], ['Use a simple layout that job systems can read.'], [CV, TPL, ATS]),
      S('Apply for team lead roles', 'When you are ready', 'Tell your manager you want to grow, and watch for team lead and senior agent openings inside and outside your company.', ['Interview preparation', 'Leadership basics'], ['Prepare examples of a time you helped a team member and a time you improved a process.'], [MATCH, JOBS]),
    ],
    faqs: [
      { q: 'What does a call-centre team leader do?', a: 'They guide a small team, support agents on difficult cases, review quality, give feedback, handle escalations and report on team results.' },
      { q: 'Do I need a degree to become a team leader?', a: 'Many companies promote from within based on performance and attitude. Some roles ask for a degree or a leadership course. Read the advert for the role you want.' },
    ],
  },
  {
    slug: 'office-assistant-to-accounts-executive', title: 'Office Assistant to Accounts Executive: Career Roadmap', badge: 'AC', audience: 'Office & accounts', order: 6,
    summary: 'Build the spreadsheet, bookkeeping and accounting-software skills that move you from admin tasks to accounts work.',
    description: 'A roadmap for office assistants and data-entry staff who want to move into accounts: spreadsheet skills, bookkeeping basics, accounting software, accuracy habits and how to present your skills on a resume.',
    tags: ['accounts', 'bookkeeping', 'office assistant', 'excel'], keywords: 'office assistant to accountant career path, accounts executive roadmap, bookkeeping skills for beginners',
    steps: [
      S('Be accurate and organised', 'Always', 'Accounts work depends on accuracy. Check your numbers twice, keep files in order and meet deadlines. Small mistakes in money matters are costly, so build the habit of checking early.', ['Attention to detail', 'Filing and records', 'Time management'], ['Make a short checklist for every repeated task.']),
      S('Get strong at spreadsheets', 'Months 1 to 4', 'Learn formulas, sorting, filtering, totals, simple charts and how to keep tidy sheets. Spreadsheets are used in almost every accounts team.', ['Spreadsheet formulas', 'Sorting and filtering', 'Pivot tables', 'Data entry accuracy'], ['Practise by tracking your own monthly spending.'], [L('Free tutorials on Learn', '/learn')]),
      S('Learn bookkeeping basics', 'Months 3 to 8', 'Understand income, expenses, assets, liabilities, debit and credit, invoices, receipts and bank reconciliation. Use free courses or a short certificate from a recognised institute in your country.', ['Bookkeeping', 'Invoices and receipts', 'Bank reconciliation'], ['Learn the terms in plain words first, then practise with small examples.']),
      S('Learn accounting software', 'Months 6 to 10', 'Most companies use accounting software. Learn one of the popular ones used in your country, and practise entering invoices, payments and reports.', ['Accounting software', 'Reports'], ['Many tools offer free trials or training videos.']),
      S('Understand tax and compliance basics', 'Months 8 to 14', 'Learn how tax, payroll and filing deadlines work where you live. Always use the official tax authority or a qualified accountant for rules, since they change.', ['Tax basics', 'Payroll basics'], ['Do not give tax advice yourself until you are qualified. Ask a qualified person.']),
      S('Ask for accounts tasks at work', 'Ongoing', 'Offer to help with invoicing, expense checks or month-end tasks. Real examples make your resume far stronger.', ['Initiative', 'Communication'], ['Write down what you did each month and the result.']),
      S('Update your resume and apply', 'When you are ready', 'List the software, the tasks and the training. Apply for accounts assistant, accounts executive and junior bookkeeper roles.', ['Resume writing', 'Interview preparation'], ['Keep the layout simple and the facts true.'], [CV, TPL, ATS, MATCH, JOBS]),
    ],
    faqs: [
      { q: 'Do I need to be a qualified accountant to start in accounts?', a: 'No, many entry roles such as accounts assistant or junior bookkeeper do not require full qualification. Professional qualifications help you grow later. Check the adverts in your area.' },
      { q: 'Which accounting software should I learn?', a: 'Look at job adverts in your area and learn the software that appears most often. Many of them work in similar ways, so the skills transfer.' },
    ],
  },
];

const replace = process.argv.includes('--replace');
await connectDB();
for (const r of roadmaps) {
  const exists = await Roadmap.exists({ slug: r.slug });
  if (exists && !replace) { console.log(`skip   ${r.slug} (already exists)`); continue; }
  await Roadmap.findOneAndUpdate({ slug: r.slug }, { ...r, published: true, modifiedAt: new Date() }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
  console.log(`${exists ? 'reset ' : 'added '} ${r.slug} (${r.steps.length} steps)`);
}
await mongoose.disconnect();
