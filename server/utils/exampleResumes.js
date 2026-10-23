// Sample resumes and CVs for /examples. Every person and employer here is invented.
// Each example is checked with the same rule-based ATS checks as the free ATS checker (see CLAUDE.md,
// "Examples page"): the exported PDF must score 100 on formatting, sections, contact details and measurable
// results, with no issues. Re-run that check after editing any text here.
//
// kind 'resume' -> `data` is the resume builder shape, rendered with template `templateId`
// kind 'cv'     -> `personal` + `cv` are the CV builder shape, rendered with CV style `templateId`

const resume = (o) => ({ kind: 'resume', ...o });
const cvEx = (o) => ({ kind: 'cv', ...o });

export const EXAMPLES = [
    resume({
        slug: 'software-developer-resume-example',
        title: 'Software Developer Resume Example',
        role: 'Software Developer', region: 'India', level: 'experienced', templateId: 'developer',
        metaDescription: 'A software developer resume example for India that passes every automatic ATS check, with the exact wording, numbers and layout to copy.',
        intro: 'A mid-level full stack developer applying to product companies in Bengaluru, Pune and Hyderabad. Every bullet starts with a verb and ends with a number you could defend in an interview.',
        why: [
            'The summary names the role, the years of experience and the main tools in the first line, so a recruiter and a parser both see the match at once.',
            'Each bullet is one achievement with a measurable result: time saved, users reached, errors removed.',
            'Skills are listed as plain words that also appear in the job descriptions this person is targeting.',
            'Dates are written as month and year, and the headings are Summary, Work Experience, Projects, Education and Skills.',
        ],
        tips: ['Replace every number with your own. If you do not know the exact figure, give an honest range or leave the bullet out.', 'Copy two or three skills from each job advert into your skills line, but only the ones you really have.'],
        data: {
            personal_info: { full_name: 'Rohan Mehta', profession: 'Full Stack Developer', email: 'rohan.mehta@example.com', phone: '+91 90000 00000', location: 'Bengaluru, India', linkedin: 'linkedin.com/in/rohan-mehta-sample', website: 'github.com/rohan-mehta-sample' },
            professional_summary: 'Full stack developer with 5 years of experience building web applications in React, Node.js and PostgreSQL. Delivered features used by over 40,000 customers and cut page load time by 38%. Comfortable owning a feature from design to release and working closely with product and support teams.',
            skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST APIs', 'Docker', 'Git', 'Unit testing', 'AWS basics'],
            experience: [
                { company: 'Harbor Retail Technologies', position: 'Senior Software Developer', start_date: '2023-04', end_date: '', is_current: true, description: 'Rebuilt the checkout page in React and reduced page load time by 38% across 40,000 monthly shoppers.\nDesigned 14 REST APIs in Node.js that serve 3 internal teams and 12,000 daily requests.\nCut deployment time from 45 minutes to 8 minutes by adding an automated build and test pipeline.\nMentored 3 junior developers through weekly code reviews and pairing sessions.' },
                { company: 'Lumen Software Services', position: 'Software Developer', start_date: '2020-07', end_date: '2023-03', is_current: false, description: 'Built an online booking feature that handled 2,500 bookings a month without manual follow-up.\nMoved slow reports to PostgreSQL views, reducing report time from 6 minutes to 20 seconds.\nWrote 160 automated tests that lowered production bugs by 30% over two releases.\nFixed 45 customer-reported defects within agreed support deadlines.' },
            ],
            project: [
                { name: 'Team Task Tracker', type: 'Personal project', description: 'Built a task board with React and Express used by a 12-person study group.\nAdded role-based login and email reminders, which cut missed deadlines by 25%.' },
            ],
            education: [{ institution: 'Savitribai Phule Pune University', degree: 'Bachelor of Engineering', field: 'Computer Engineering', graduation_date: '2020-06', gpa: '8.4 CGPA' }],
        },
    }),
    resume({
        slug: 'fresher-resume-example',
        title: 'Fresher Resume Example',
        role: 'Fresh Graduate', region: 'India', level: 'fresher', templateId: 'graduate',
        metaDescription: 'A fresher resume example for graduates with no work history: projects, internship and skills arranged so ATS software reads every section.',
        intro: 'A final-year graduate with one internship and two college projects. With no full-time job to show, the proof comes from projects, a short internship and numbers from each.',
        why: [
            'Education sits near the top because it is the strongest section for a fresher, and it carries the year of graduation.',
            'The internship and projects are written like jobs: what was built, with which tools, and what changed.',
            'Numbers are small and honest: 3 team members, 120 users, 15 hours saved. Small real numbers beat big vague claims.',
            'Skills are grouped as one plain line, so the ATS can match each word without reading a table.',
        ],
        tips: ['If you had no internship, move the best project into the Experience section and describe it the same way.', 'Keep it to one page. Recruiters spend seconds on a fresher resume.'],
        data: {
            personal_info: { full_name: 'Ananya Iyer', profession: 'Computer Science Graduate', email: 'ananya.iyer@example.com', phone: '+91 90000 00001', location: 'Chennai, India', linkedin: 'linkedin.com/in/ananya-iyer-sample', website: 'github.com/ananya-iyer-sample' },
            professional_summary: 'Computer science graduate with a 3-month web development internship and 2 team projects completed in 2025. Built and tested features in React and Node.js, and presented a project used by 120 classmates. Looking for a junior software developer role where I can keep learning from experienced engineers.',
            skills: ['Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'HTML and CSS', 'Git', 'Problem solving', 'Teamwork', 'Written communication'],
            experience: [
                { company: 'Nilgiri Web Studio', position: 'Web Development Intern', start_date: '2025-01', end_date: '2025-03', is_current: false, description: 'Built 6 responsive pages in React for a local shop, which now receives about 200 visits a week.\nFixed 18 layout and form errors reported by the client during testing.\nWrote clear notes for 4 reusable components so the next developer could continue the work.\nWorked in a team of 5 and shared progress in a short update every day.\nLearned the company code review process and made 22 small improvements suggested by senior developers.\nPresented the finished pages to the shop owner and trained 2 staff members to update prices on their own.' },
            ],
            project: [
                { name: 'Campus Notes Exchange', type: 'Final year project', description: 'Built a notes sharing website with React, Express and MySQL for a team of 3 students.\nAdded search and login, and 120 classmates used it during the semester exams.' },
                { name: 'Expense Tracker App', type: 'Course project', description: 'Created a simple expense tracker in Java that saves 100 entries to a file.\nTested 25 cases and fixed 9 defects before the final demo.' },
            ],
            education: [{ institution: 'Anna University', degree: 'Bachelor of Engineering', field: 'Computer Science and Engineering', graduation_date: '2025-05', gpa: '8.1 CGPA' }],
        },
    }),
    resume({
        slug: 'customer-service-resume-example',
        title: 'Customer Service Resume Example',
        role: 'Customer Service Executive', region: 'Kenya', level: 'experienced', templateId: 'professional',
        metaDescription: 'A customer service resume example with measurable results, clear headings and plain text that an ATS reads correctly. Free to copy and adapt.',
        intro: 'A customer service executive from Nairobi applying to call centres, banks and telecom companies. The numbers show speed, quality and volume, which is what these employers measure.',
        why: [
            'Results use the same measures a support manager tracks: calls per day, first-contact resolution and satisfaction score.',
            'The summary says the languages spoken, which matters for many support roles in East Africa and the UK.',
            'There are no icons, photos or tables, so the file reads the same in every system.',
            'The headings are standard, so each section is found without guessing.',
        ],
        tips: ['Ask your manager for your real figures. Many call centres share them in monthly reviews.', 'List every language you can use with customers, and your level in each.'],
        data: {
            personal_info: { full_name: 'Grace Wanjiru', profession: 'Customer Service Executive', email: 'grace.wanjiru@example.com', phone: '+254 700 000 000', location: 'Nairobi, Kenya', linkedin: 'linkedin.com/in/grace-wanjiru-sample', website: '' },
            professional_summary: 'Customer service executive with 6 years of experience in telecom and banking support. Handles 70 calls and chats a day with a 94% customer satisfaction score. Fluent in English and Swahili, calm under pressure and skilled at turning unhappy customers into repeat customers.',
            skills: ['Inbound and outbound calls', 'Live chat support', 'Complaint handling', 'CRM software', 'Zendesk', 'MS Excel', 'Typing 55 words per minute', 'English', 'Swahili'],
            experience: [
                { company: 'Savanna Mobile Care Centre', position: 'Senior Customer Service Executive', start_date: '2022-02', end_date: '', is_current: true, description: 'Handle about 70 calls and chats a day and keep a 94% customer satisfaction score.\nResolve 82% of issues on the first contact, 9 points above the team target.\nTrained 12 new agents on the CRM system and complaint process in their first 2 weeks.\nWrote 15 help articles that reduced repeat questions by 20%.\nCoach 6 colleagues each month on listening skills and polite call closing, which lifted their scores by 8 points.\nHandle escalated complaints from 25 business customers and keep each one informed until the issue is closed.' },
                { company: 'Rift Valley Bank', position: 'Customer Service Representative', start_date: '2019-05', end_date: '2022-01', is_current: false, description: 'Served 45 walk-in and phone customers a day on accounts, cards and mobile banking.\nCut average waiting time from 12 minutes to 7 minutes by organising the queue by request type.\nRecorded every complaint in the system and closed 96% within 48 hours.\nReceived 3 monthly service awards from the branch manager.\nExplained new mobile banking features to 300 customers during the branch awareness campaign.' },
            ],
            project: [],
            education: [{ institution: 'Kenyatta University', degree: 'Diploma', field: 'Business Management', graduation_date: '2019-03', gpa: '' }],
        },
    }),
    resume({
        slug: 'electrician-resume-example',
        title: 'Electrician Resume Example',
        role: 'Electrician', region: 'Canada', level: 'experienced', templateId: 'skilled-trades',
        metaDescription: 'An electrician resume example for Canada with licence, safety training and job results written so ATS software and site supervisors can read them.',
        intro: 'A licensed electrician applying to contractors and facility teams in Ontario. Trade employers look for a licence, safety tickets and the size of the work, so those come first.',
        why: [
            'Licences and safety tickets are written in full words, because an ATS looks for exact terms such as "Red Seal".',
            'Each job names the type of site and the scale of the work: units, circuits, amps, crew size.',
            'Safety results are shown with numbers, for example days without a lost-time incident.',
            'Plain bullets and standard headings keep the file readable when uploaded to a job portal.',
        ],
        tips: ['Write your licence number only on forms that ask for it, not in a public resume.', 'List the tools and codes you really use, for example the Canadian Electrical Code and the site test equipment.'],
        data: {
            personal_info: { full_name: 'Daniel Okafor', profession: 'Red Seal Electrician', email: 'daniel.okafor@example.com', phone: '+1 416 555 0123', location: 'Mississauga, Ontario, Canada', linkedin: 'linkedin.com/in/daniel-okafor-sample', website: '' },
            professional_summary: 'Red Seal electrician with 9 years of experience in residential, commercial and light industrial wiring. Completed over 60 projects on time, from 24-unit apartment buildings to factory upgrades. Works safely, reads drawings accurately and keeps clear records for inspections.',
            skills: ['Red Seal Electrician', 'Canadian Electrical Code', 'Conduit and cable installation', 'Panel upgrades up to 400 amp', 'Troubleshooting', 'Blueprint reading', 'Fire alarm wiring', 'Working at heights', 'WHMIS', 'First aid and CPR'],
            experience: [
                { company: 'Great Lakes Electrical Contractors', position: 'Journeyman Electrician', start_date: '2020-03', end_date: '', is_current: true, description: 'Wired 3 apartment buildings with a total of 96 units, finishing each one within the agreed schedule.\nUpgraded 40 main panels to 200 and 400 amp service with no failed inspections.\nLed a crew of 4 and checked all work against drawings and the Canadian Electrical Code.\nWorked 2,100 days without a lost-time incident and ran weekly toolbox safety talks.\nCoordinated with plumbers, carpenters and inspectors so electrical work never delayed other trades.' },
                { company: 'Northline Building Services', position: 'Electrician', start_date: '2016-06', end_date: '2020-02', is_current: false, description: 'Installed and tested lighting and power circuits in 30 office and retail fit-outs.\nTraced and repaired 120 faults, reducing repeat call-backs by 25%.\nInstalled 18 fire alarm and emergency lighting systems and signed off each test sheet.\nTrained 3 apprentices on conduit bending and safe isolation.\nCompleted 95% of service calls on the first visit by carrying the right parts and test equipment.' },
            ],
            project: [],
            education: [{ institution: 'Humber College', degree: 'Certificate of Qualification', field: 'Construction and Maintenance Electrician (309A)', graduation_date: '2016-05', gpa: '' }],
        },
    }),
    resume({
        slug: 'sales-manager-resume-example',
        title: 'Sales Manager Resume Example',
        role: 'Sales Manager', region: 'United Kingdom', level: 'experienced', templateId: 'leadership',
        metaDescription: 'A sales manager resume example for the UK with revenue, team and target results that pass every automatic ATS check. Copy the structure.',
        intro: 'A regional sales manager applying for a senior role in the UK. Leadership resumes are judged on the size of the team, the target and the result, so those three appear in nearly every bullet.',
        why: [
            'The first line of the summary gives the years in sales, the size of the team and the revenue managed.',
            'Results are written against a target, which tells a hiring manager more than a raw number.',
            'Leadership is shown by what the team achieved, not by adjectives such as "dynamic" or "results-driven".',
            'Two roles are described in detail and earlier ones are shortened, which keeps the resume to a single page.',
        ],
        tips: ['Use figures your finance team has signed off. Hiring managers often check them at reference stage.', 'Spell out the market: region, customer type and deal size.'],
        data: {
            personal_info: { full_name: 'Olivia Hartley', profession: 'Regional Sales Manager', email: 'olivia.hartley@example.com', phone: '+44 7700 900123', location: 'Manchester, United Kingdom', linkedin: 'linkedin.com/in/olivia-hartley-sample', website: '' },
            professional_summary: 'Regional sales manager with 11 years in business-to-business sales and 6 years leading teams of up to 14 people. Grew regional revenue from £2.1 million to £3.4 million in three years. Known for coaching new starters to target within their first 6 months.',
            skills: ['Team leadership', 'Sales forecasting', 'Key account management', 'Negotiation', 'Pipeline management', 'Salesforce CRM', 'Coaching and training', 'Budget management', 'Public speaking'],
            experience: [
                { company: 'Pennine Office Supplies', position: 'Regional Sales Manager', start_date: '2021-01', end_date: '', is_current: true, description: 'Lead a team of 14 sales executives and exceeded the annual target of £3 million by 13%.\nGrew regional revenue from £2.1 million to £3.4 million in 3 years through key account plans.\nReduced staff turnover from 28% to 12% with monthly coaching and a clear bonus plan.\nWon 9 new accounts worth over £50,000 each by working with the marketing team on local events.\nRun a weekly forecast meeting and keep forecast accuracy within 5% of the final monthly result.\nIntroduced a 90-day plan for new starters that shortened the time to their first sale from 10 weeks to 6 weeks.' },
                { company: 'Mersey Industrial Supplies', position: 'Senior Account Manager', start_date: '2016-04', end_date: '2020-12', is_current: false, description: 'Managed 65 business accounts worth £1.6 million a year and renewed 92% of them.\nIncreased average order value by 18% by proposing bundled product packages.\nTrained 5 new account managers, all of whom reached target within 6 months.\nResolved 30 service complaints directly with customers and kept 28 of them as active accounts.' },
            ],
            project: [],
            education: [{ institution: 'University of Salford', degree: 'Bachelor of Arts', field: 'Business and Management', graduation_date: '2013-07', gpa: '2:1' }],
        },
    }),
    resume({
        slug: 'accountant-resume-example',
        title: 'Accountant Resume Example',
        role: 'Accountant', region: 'Nigeria', level: 'experienced', templateId: 'corporate',
        metaDescription: 'An accountant resume example with qualifications, software and measurable results arranged for ATS software. Free to copy and adapt to your own career.',
        intro: 'An accountant from Lagos applying to banks, audit firms and manufacturing companies. Employers in finance look for professional qualifications, systems and accuracy, so each has its own line.',
        why: [
            'Professional qualifications are listed in full, with the awarding body, because finance recruiters filter on them.',
            'Software skills use the exact product names, such as Sage, QuickBooks and Excel.',
            'Results show accuracy and speed: close time, error rate and amounts managed.',
            'The tone is plain and factual, which suits finance employers and parsers alike.',
        ],
        tips: ['Never include client names or confidential figures. Describe the size of the work instead.', 'Add the year you were admitted to your professional body.'],
        data: {
            personal_info: { full_name: 'Chidinma Eze', profession: 'ACA Accountant', email: 'chidinma.eze@example.com', phone: '+234 800 000 0000', location: 'Lagos, Nigeria', linkedin: 'linkedin.com/in/chidinma-eze-sample', website: '' },
            professional_summary: 'Chartered accountant (ICAN) with 8 years of experience in financial reporting, audit and tax compliance. Prepared monthly accounts for a company with annual revenue above NGN 4 billion and shortened the month-end close from 10 days to 6 days. Careful, accurate and comfortable working with auditors and regulators.',
            skills: ['Financial reporting (IFRS)', 'Month-end close', 'Tax compliance', 'Budgeting and forecasting', 'Bank reconciliation', 'Sage 50', 'QuickBooks', 'Advanced Excel', 'Internal audit', 'Payroll review'],
            experience: [
                { company: 'Lagoon Foods and Beverages', position: 'Senior Accountant', start_date: '2021-02', end_date: '', is_current: true, description: 'Prepare monthly management accounts for revenue above NGN 4 billion and present them to 5 directors.\nShortened the month-end close from 10 days to 6 days by standardising 30 reconciliation checklists.\nFiled all tax returns on time for 3 consecutive years with no penalties.\nSupervise 4 accounts clerks and review about 600 supplier invoices a month.\nReconcile 12 bank accounts every month and clear differences above NGN 50,000 within 3 working days.\nProvide schedules for external auditors and closed 35 audit queries before the deadline last year.' },
                { company: 'Adeyemi and Partners (Audit Firm)', position: 'Audit Associate', start_date: '2017-09', end_date: '2021-01', is_current: false, description: 'Worked on 25 audits across manufacturing, retail and logistics clients.\nFound 40 control weaknesses and recommended fixes that clients adopted in 70% of cases.\nReduced time spent on sample testing by 20% with a reusable Excel workbook.\nPrepared draft financial statements for 8 clients and answered partner review comments within 2 days.' },
            ],
            project: [],
            education: [
                { institution: 'Institute of Chartered Accountants of Nigeria (ICAN)', degree: 'Associate Chartered Accountant (ACA)', field: 'Professional qualification', graduation_date: '2019-11', gpa: '' },
                { institution: 'University of Lagos', degree: 'Bachelor of Science', field: 'Accounting', graduation_date: '2016-07', gpa: 'Second Class Upper' },
            ],
        },
    }),

    cvEx({
        slug: 'nurse-cv-example',
        title: 'Nurse CV Example',
        role: 'Registered Nurse', region: 'United Kingdom', level: 'experienced', templateId: 'classic',
        metaDescription: 'A registered nurse CV example for the UK that passes every automatic ATS check. See the headings, registration details and results to copy.',
        intro: 'A registered nurse applying to NHS trusts and private hospitals. UK nursing CVs lead with registration and clinical experience, and they keep personal details light.',
        why: [
            'Registration with the Nursing and Midwifery Council is stated in the summary, because every employer checks it first.',
            'Each ward role gives the number of beds, the patient group and a measurable result.',
            'Training and mandatory courses are listed with their year, which employers verify.',
            'No photo, date of birth or marital status, in line with UK practice.',
        ],
        tips: ['Add your NMC PIN only when an application form asks for it.', 'Describe your own work, not the ward\'s. Use "I" less and strong verbs more.'],
        personal: { full_name: 'Priya Nair', email: 'priya.nair@example.com', phone: '+44 7700 900456', location: 'Leeds, United Kingdom', linkedin: 'linkedin.com/in/priya-nair-sample', website: '' },
        cv: {
            professional_summary: 'Registered nurse (NMC registered) with 7 years of experience on medical and surgical wards. Cares for up to 12 patients per shift, supports 6 student nurses a year and keeps hospital-acquired infection rates below the ward target. Calm, observant and committed to safe, kind care.',
            skills: ['Patient assessment', 'Medication administration', 'Wound care', 'IV therapy', 'Infection control', 'Early warning score monitoring', 'Discharge planning', 'Electronic patient records', 'Basic and immediate life support'],
            experience: [
                { job_title: 'Staff Nurse, Surgical Ward', company: 'Calder Valley NHS Trust', location: 'Leeds', start_date: 'Mar 2021', end_date: 'Present', responsibilities: ['Care for up to 12 patients per shift on a 28-bed surgical ward, including before and after operations.', 'Cut medication errors on the ward by 30% in 12 months by leading a double-check routine.', 'Supported 6 student nurses each year and received positive written feedback from all of them.', 'Raised the discharge-before-noon rate from 22% to 35% by planning discharges on the day before.'] },
                { job_title: 'Staff Nurse, Medical Ward', company: 'Aire Community Hospital', location: 'Bradford', start_date: 'Sep 2017', end_date: 'Feb 2021', responsibilities: ['Looked after up to 10 patients per shift with heart, lung and kidney conditions.', 'Completed 100% of observations on time for 3 months running after starting a hourly check board.', 'Trained 20 healthcare assistants in pressure ulcer prevention.'] },
            ],
            projects: [], internships: [],
            education: [{ qualification: 'BSc (Hons) Adult Nursing', institution: 'University of Leeds', graduation_year: '2017' }],
            certifications: ['Nursing and Midwifery Council (NMC) registered, since 2017', 'Immediate Life Support (ILS), renewed 2025', 'Venepuncture and Cannulation, 2019', 'Mentorship and Practice Assessor course, 2022'],
            achievements: ['Ward Nurse of the Year, Calder Valley NHS Trust, 2023', 'Led a falls prevention project that reduced patient falls by 28% in 2024'],
            languages: ['English (fluent)', 'Malayalam (fluent)', 'Hindi (conversational)'], additional_information: [],
        },
    }),
    cvEx({
        slug: 'production-supervisor-cv-example',
        title: 'Production Supervisor CV Example',
        role: 'Production Supervisor', region: 'India', level: 'experienced', templateId: 'large-print',
        metaDescription: 'A production supervisor CV example for factory and plant roles with output, safety and quality results that an ATS can read. Free to copy.',
        intro: 'A shop floor supervisor applying to factories in Pune, Chennai and Ahmedabad. Plant managers want output, rejection rate and safety, so this CV leads with those numbers in plain large print.',
        why: [
            'The large print style is easy to read on a printout and on a phone, which suits applications handed in at the factory gate or sent by WhatsApp.',
            'Every bullet states shift size, output or rejection rate, the three things a plant manager checks.',
            'Training such as 5S, Kaizen and safety courses is named exactly, the way job adverts write them.',
            'A short, plain summary replaces long self-praise.',
        ],
        tips: ['Keep a printed copy as well as the PDF. Many factories still ask for paper.', 'Write the machines and systems you have really operated, not a long list of everything you have seen.'],
        personal: { full_name: 'Suresh Patil', email: 'suresh.patil@example.com', phone: '+91 90000 00002', location: 'Pune, Maharashtra, India', linkedin: 'linkedin.com/in/suresh-patil-sample', website: '' },
        cv: {
            professional_summary: 'Production supervisor with 12 years of experience in automotive component manufacturing. Leads shifts of up to 45 operators and reached 98% of the daily output target for 18 months. Strong on safety, 5S and quality, with a record of reducing rejections and machine downtime.',
            skills: ['Shift planning', 'Production scheduling', 'CNC and press shop operations', '5S and Kaizen', 'Quality inspection', 'Root cause analysis', 'Preventive maintenance coordination', 'Safety management', 'MS Excel', 'Team leadership'],
            experience: [
                { job_title: 'Production Supervisor', company: 'Sahyadri Auto Components Pvt Ltd', location: 'Pune', start_date: 'Apr 2019', end_date: 'Present', responsibilities: ['Lead a shift of 45 operators across 3 press lines producing 8,000 parts a day.', 'Reached 98% of the daily output target for 18 months in a row.', 'Reduced rejections from 3.2% to 1.8% by adding a first-piece check at every shift start.', 'Cut machine downtime by 22% by working with maintenance on a weekly checklist.', 'Completed 2 years with no lost-time accident on the shift.'] },
                { job_title: 'Senior Machine Operator', company: 'Bhima Engineering Works', location: 'Pune', start_date: 'Jun 2013', end_date: 'Mar 2019', responsibilities: ['Operated 4 CNC machines and trained 15 new operators on setup and tool changes.', 'Suggested a fixture change that saved 12 minutes per batch.', 'Kept 100% of inspection records complete for 5 years.'] },
            ],
            projects: [], internships: [],
            education: [{ qualification: 'Diploma in Mechanical Engineering', institution: 'Government Polytechnic Pune', graduation_year: '2013' }],
            certifications: ['5S and Kaizen Practitioner, 2020', 'Industrial Safety Course, 2021', 'First Aid and Fire Fighting Training, 2023'],
            achievements: ['Best Supervisor of the Year, Sahyadri Auto Components, 2022'],
            languages: ['Marathi (native)', 'Hindi (fluent)', 'English (working level)'], additional_information: [],
        },
    }),
    cvEx({
        slug: 'teacher-cv-example',
        title: 'Teacher CV Example',
        role: 'Secondary School Teacher', region: 'Canada', level: 'experienced', templateId: 'soft',
        metaDescription: 'A teacher CV example for Canadian schools with certification, classroom results and clear headings that ATS software reads correctly.',
        intro: 'A secondary school mathematics teacher applying to school boards in Ontario and Alberta. Boards check certification first, then classroom experience and what students achieved.',
        why: [
            'Teaching certification and the province are listed in the summary and again under certifications.',
            'Classroom results use class size, pass rates and test score gains, which boards recognise.',
            'Extra duties such as coaching and tutoring are shown with the time spent.',
            'The soft style has friendly headings, and the structure is still a single column of plain text.',
        ],
        tips: ['Add your Ontario College of Teachers or provincial registration number only when an application asks for it.', 'Change the subjects and grade levels to match each posting.'],
        personal: { full_name: 'Michael Thompson', email: 'michael.thompson@example.com', phone: '+1 905 555 0147', location: 'Brampton, Ontario, Canada', linkedin: 'linkedin.com/in/michael-thompson-sample', website: '' },
        cv: {
            professional_summary: 'Certified Ontario teacher with 8 years of experience teaching mathematics to grades 9 to 12. Teaches classes of up to 30 students and raised the grade 10 pass rate from 78% to 91% in two years. Plans clear lessons, supports students who are behind and works well with families and colleagues.',
            skills: ['Lesson planning', 'Classroom management', 'Differentiated instruction', 'Assessment and feedback', 'Google Classroom', 'Desmos and GeoGebra', 'Parent communication', 'Special education support', 'Mentoring new teachers'],
            experience: [
                { job_title: 'Mathematics Teacher, Grades 9 to 12', company: 'Peel Valley Secondary School', location: 'Brampton, Ontario', start_date: 'Sep 2019', end_date: 'Present', responsibilities: ['Teach 4 mathematics classes of about 28 students each, from grade 9 to grade 12.', 'Raised the grade 10 pass rate from 78% to 91% in 2 years with weekly short quizzes and feedback.', 'Run a lunchtime help club for 35 students and a free exam review before each term.', 'Mentor 2 new teachers a year and lead a department meeting every month.'] },
                { job_title: 'Mathematics Teacher, Grades 7 to 9', company: 'Lakeshore Public School', location: 'Mississauga, Ontario', start_date: 'Sep 2016', end_date: 'Jun 2019', responsibilities: ['Taught 3 classes of 25 students and improved the average test score by 9 points.', 'Coached the school mathematics team that placed in the top 10 of 60 teams in the regional contest.'] },
            ],
            projects: [], internships: [],
            education: [
                { qualification: 'Bachelor of Education', institution: 'University of Toronto', graduation_year: '2016' },
                { qualification: 'Bachelor of Science in Mathematics', institution: 'York University', graduation_year: '2015' },
            ],
            certifications: ['Ontario College of Teachers certified, since 2016', 'Additional Qualification in Special Education, 2021', 'Standard First Aid and CPR, 2024'],
            achievements: ['Teacher of the Year nomination, Peel Valley Secondary School, 2023'],
            languages: ['English (native)', 'French (intermediate)'], additional_information: [],
        },
    }),
    cvEx({
        slug: 'fresher-engineer-cv-example',
        title: 'Fresher Engineer CV Example',
        role: 'Graduate Engineer Trainee', region: 'India', level: 'fresher', templateId: 'fresher',
        metaDescription: 'A fresher engineer CV example with projects, internship and skills arranged so ATS software reads every section. Free to copy and adapt.',
        intro: 'A mechanical engineering graduate applying for graduate engineer trainee roles. With no job history, education, an internship and projects carry the CV, and each has numbers.',
        why: [
            'Education comes first for a fresher, with the year and the final result stated plainly.',
            'The internship is written as real work: machines, parts and measured results.',
            'Projects name the tools used (SolidWorks, ANSYS) so keyword matching works.',
            'The CV fits on one page and uses a clear, large name and bold black headings.',
        ],
        tips: ['Keep marks in the form the employer asks for: CGPA, percentage or class.', 'Link a short project report or portfolio if you have one.'],
        personal: { full_name: 'Vikram Choudhary', email: 'vikram.choudhary@example.com', phone: '+91 90000 00003', location: 'Jaipur, Rajasthan, India', linkedin: 'linkedin.com/in/vikram-choudhary-sample', website: '' },
        cv: {
            professional_summary: 'Mechanical engineering graduate (2025) with a 2-month plant internship and 3 design projects. Modelled and tested parts in SolidWorks and ANSYS, and helped a plant team cut a rework rate by 15%. Looking for a graduate engineer trainee role in design or manufacturing.',
            skills: ['SolidWorks', 'AutoCAD', 'ANSYS basics', 'GD&T basics', 'Lathe and milling practice', 'MS Excel', 'Technical drawing', 'Problem solving', 'Teamwork'],
            experience: [],
            internships: [
                { job_title: 'Production Engineering Intern', company: 'Marwar Precision Tools Pvt Ltd', location: 'Jaipur', start_date: 'Jun 2024', end_date: 'Jul 2024', responsibilities: ['Measured and recorded 150 parts a day with vernier calipers and micrometers.', 'Found the cause of a repeating burr defect and helped cut rework by 15% in 4 weeks.', 'Updated 12 process sheets so each operator step was clear and complete.', 'Presented findings to a team of 8 engineers on the last day.'] },
            ],
            projects: [
                { project_name: 'Low-cost Hand Press Design', technologies: ['SolidWorks', 'ANSYS'], description: 'Designed a manual press for a small workshop as a team of 4 students.', achievements: ['Reduced the estimated part weight by 18% after a stress simulation.', 'Built a working prototype within a budget of INR 6,000.'] },
                { project_name: 'Solar Water Heater Test Rig', technologies: ['AutoCAD', 'MS Excel'], description: 'Built a test rig to compare 2 collector designs.', achievements: ['Recorded 60 temperature readings over 5 days and charted the difference between designs.'] },
            ],
            education: [{ qualification: 'Bachelor of Technology in Mechanical Engineering (8.3 CGPA)', institution: 'Malaviya National Institute of Technology Jaipur', graduation_year: '2025' }],
            certifications: ['SolidWorks Associate course, 2024', 'Industrial Safety Basics, 2024'],
            achievements: ['Second place in the college design competition among 40 teams, 2024'],
            languages: ['Hindi (native)', 'English (fluent)'], additional_information: [],
        },
    }),
];

export const getExample = (slug) => EXAMPLES.find((e) => e.slug === slug) || null;

// List view: no body text.
export const exampleSummary = (e) => ({ slug: e.slug, kind: e.kind, title: e.title, role: e.role, region: e.region, level: e.level, templateId: e.templateId, metaDescription: e.metaDescription, intro: e.intro });
