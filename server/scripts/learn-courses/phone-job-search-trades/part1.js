import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S1 = 'Get Ready';
const S2 = 'Find and Apply';

export const lessons = [
  // ---------------------------------------------------------------- 1
  les(S1, 'your-phone-is-your-job-tool', 'Your Phone Is Your Job Tool: Set It Up', 'Set Up Your Phone for Job Hunting',
    'Get your phone ready for job hunting: a simple email, a clear voicemail, a tidy photo, saved storage and a place for your papers. Plain words, no extra cost.', [
    P("Many people look for work only with a phone. That is fine. A phone can find jobs, make a resume, send papers and talk to employers. This course shows you how, step by step, in plain words. You do not need a computer. You do not need to pay anything for the lessons or the tools we show."),
    P("This first lesson is about getting ready. Ten minutes of setup now will save you a lot of trouble later. Employers are busy. If they cannot reach you, they call the next person."),
    H("1. A phone number that works"),
    L("Use one number for job hunting. Give only that number to employers.", "Keep it charged. Keep some balance or data on it. A job call that you miss may not come again.", "Save the numbers of employers when they call. Write their name and company, for example `Raj - Shah Builders`.", "Answer politely: *Hello, this is your name.* A calm voice makes a good first picture."),
    H("2. A voicemail or message that sounds good"),
    P("If you cannot answer, the caller may leave a message. Make sure your phone says your name, or at least says a normal voice mail. A funny song or a long joke can make an employer hang up. Check your voicemail every day. Call back the same day if you can."),
    H("3. A simple email address"),
    P("Most job sites and many employers need an email address. If you do not have one, make a free one. Keep the name simple and clear. Use your real name, such as `sunil.kumar.electrician` or `grace.mwangi.cook`. Do not use names like `cooldude99` or `lovely_girl`. Write down your password in a safe place, and do not share it. Turn on two-step sign in if the service offers it."),
    N("Never give your email password, your bank PIN or an OTP (one-time code) to anyone. An honest employer or job site will never ask for them."),
    H("4. Your photo and your name on apps"),
    L("If you use WhatsApp or Telegram for work, check your profile photo. Use a clear photo of your face, with plain clothes and a plain background.", "Use your real name.", "Look at your status and your pictures. If you contact employers, they may look at them."),
    H("5. Make space on your phone"),
    P("Photos and videos can fill the phone, so you cannot take a picture of your papers when you need to. Delete what you do not need. Move photos to a cloud service or to another phone if you can. A phone with free space is also faster."),
    H("6. A folder for your job papers"),
    P("Make one folder on your phone called `Jobs`. Put all your job papers in it: your resume, photos of your certificates, photos of your ID (keep these private), and a list of the jobs you applied to. When an employer asks, you find the file in seconds. Make a second copy. Send the folder to a family member you trust, or save it online, in case the phone is lost or broken."),
    H("7. Save data and battery"),
    L("Use Wi-Fi when you can, for example at home or at a library or a shop that allows it.", "Download big files only on Wi-Fi.", "Turn on battery saver. Carry a power bank if you have one.", "Keep your phone safe from water and dust on the job site."),
    H("8. Keep it safe"),
    L("Use a screen lock, a PIN or a pattern that others cannot guess.", "Keep your phone software updated when you can.", "Do not click on links in messages from people you do not know.", "Do not let anyone use your phone to log in to your accounts."),
    P("These steps look small. But together they make you look ready and trusted. They also keep you safe."),
    ...task("Check that your phone number works, has balance, and that your voicemail says something polite.", "Make or tidy one email address with your real name. Write the password in a safe place.", "Make a folder called `Jobs` on your phone.", "Free some space: delete five things that you do not need."),
    ...check("You can find your `Jobs` folder in less than ten seconds.", "Your email name looks serious, with your own name in it.", "You have at least 1 GB of free space, or enough to take 20 photos."),
  ], A('A phone ready for work', [
    n('phone', 'Your phone', 'charged, space free', 0, 0, 'user'), n('mail', 'Email + number', 'simple and clear', 1, 0, 'tool'),
    n('folder', 'Jobs folder', 'all papers in one place', 2, 0, 'data'), n('ready', 'Ready for work', 'reachable and safe', 3, 0, 'out'),
  ], [
    { say: 'Start with the phone you already have. Keep it charged and keep some space free.', on: ['phone'] },
    { say: 'Use one phone number and one simple email address with your real name.', flow: ['phone>mail:set up'] },
    { say: 'Make a Jobs folder and keep your resume and papers in it.', flow: ['mail>folder:save papers'] },
    { say: 'Now employers can reach you, and you can send papers in seconds.', flow: ['folder>ready:ready'] },
  ]), [
    faq('Do I need a computer to look for a job?', 'No. A phone is enough to find jobs, make a resume, send papers and talk to employers. This course is written for phone users.'),
    faq('What email name should I use?', 'Use your real name, for example sunil.kumar.electrician. Avoid nicknames and numbers that look like a joke.'),
  ]),

  // ---------------------------------------------------------------- 2
  les(S1, 'know-your-skills-and-write-them-down', 'Know Your Skills and Write Them Down', 'Know Your Work Skills and Write Them Down',
    'List what you can do: tasks, tools, machines, years and training. Use plain, true words so a resume and an interview are easy. Includes a worksheet.', [
    P("Many skilled people say: *I just do my work.* But an employer cannot see your work from a phone call. You must tell them clearly what you can do. The first step is to write it down for yourself. Take twenty minutes. It is the base of your resume, your messages and your interview."),
    H("Why this matters"),
    P("A person who says *I can do plumbing* sounds like many others. A person who says *I fix leaks, fit bathrooms and install water tanks. I have worked 6 years on houses and shops* sounds clear. Real details are easy to trust. Use real facts only. Do not add things that are not true. An employer may ask you to show it."),
    H("Step 1: Write what you do, in small tasks"),
    P("Think about a normal week of work. What do you do with your hands, your tools and your head? Write one line for each task. Use action words."),
    C('text', `Example: house electrician

- Fit switches, sockets and lights
- Find and fix wiring faults
- Install fans and meters
- Read simple wiring drawings
- Test circuits before I leave
- Talk to the house owner about work and cost`),
    H("Step 2: Write your tools and machines"),
    P("List the tools, machines and vehicles that you use well. For example: welding machine, angle grinder, forklift, tailor machine, sewing machine, drill, lathe, tractor, sprayer, POS machine, delivery bike. If you have a licence, write it. For example a driving licence, a forklift licence or a trade certificate."),
    H("Step 3: Write your years and places"),
    L("Where did you work? A company, a site, a shop, or on your own?", "For how long? Years and months are enough. If you do not remember exactly, write about.", "What did you build, fix or make there? Say what you are proud of.", "If you worked for family or on your own, that is also work. Write it."),
    H("Step 4: Training and papers"),
    P("List courses, trade tests, certificates and licences. Write the name, the place and the year. Also write the safety training you did. Many employers ask for it. Also note what languages you can speak. In many jobs, a second language is a real skill."),
    H("Step 5: Your good habits"),
    P("Employers like workers who come on time, finish work, keep the place clean and follow safety rules. If this is true for you, write one line with an example. For example: *I never missed a shift in two years.* Only write it if it is true."),
    H("A simple skills sheet"),
    P("Write this on paper, or in the notes app on your phone."),
    C('text', `My work: (for example welder, driver, cook, carpenter)
Years of work: 
Tasks I do well: 
Tools and machines I use: 
Licences and certificates: 
Places I worked: 
Languages: 
Where I can work (town or area): 
Hours I can work: 
When I can start: `),
    N("Do not write a skill that you do not have. If an employer finds out, you can lose the job. It is fine to say: *I am learning this.* Honest learners are welcome in many places."),
    H("What if you have little formal work?"),
    P("Do not worry. Think about work at home, on a farm, in a family shop, in a community or in a place of worship. Think about helping a relative with repair work. These show real skills. Write them as they are, in plain words."),
    ...task("Write your skills sheet. Fill every line that you can.", "List at least five tasks that you do well, one on each line.", "List your tools, machines, licences and certificates.", "Ask a friend or family member what they think you do best. Add one more line."),
    ...check("Your sheet has at least five true tasks, with clear action words.", "Every line on your sheet is true, and you can explain it.", "You can say in two sentences what work you do and for how long."),
  ], A('From work to words', [
    n('work', 'Your real work', 'tasks, tools, years', 0, 0, 'user'), n('write', 'Write it down', 'plain true words', 1, 0, 'tool'),
    n('sheet', 'Skills sheet', 'one page', 2, 0, 'data'), n('use', 'Use it', 'resume, messages, interview', 3, 0, 'out'),
  ], [
    { say: 'You already have real skills from your work, your tools and your years.', on: ['work'] },
    { say: 'Write them down in plain words, one task on each line. Use only true facts.', flow: ['work>write:note'] },
    { say: 'Put it all on one skills sheet.', flow: ['write>sheet:collect'] },
    { say: 'Use the sheet for your resume, your messages to employers and your interview answers.', flow: ['sheet>use:reuse'] },
  ]), [
    faq('What if I learned my trade without a certificate?', 'Many people do. Write your years of work and the tasks you can do. If you can, ask for a short trade test or a reference from a past employer.'),
    faq('Should I write skills that I am still learning?', 'Yes, but say it honestly, for example: learning to use a CNC machine. Do not say you are an expert when you are not.'),
  ]),

  // ---------------------------------------------------------------- 3
  les(S1, 'make-a-one-page-resume-on-your-phone', 'Make a One-Page Resume on Your Phone', 'Make a One-Page Resume on Your Phone',
    'Make a simple one-page resume on your phone for factory, trade, driving or service jobs: what to include and leave out, a sample, and saving a PDF.', [
    P("A resume is one page that tells an employer who you are and what work you can do. Many employers ask for one, even for trade and factory jobs. You can make it on your phone in about thirty minutes. Use the skills sheet from lesson 2."),
    H("What a good resume looks like"),
    L("**One page.** Short and easy to read.", "**Plain layout.** One column, simple letters, no pictures or colours that make it hard to read. Many companies use software to read resumes, and plain ones work best.", "**True facts.** Only what you really did.", "**Your newest work first.**", "**Clear contact details:** your name, phone number, email and town."),
    N("In some countries, employers like a photo, your age or your marital status on a resume. In other countries they do not. Check the job advert, or ask the employer. Never put your ID number or your bank details on a resume."),
    H("The parts, in order"),
    O("**Name and contact:** your name, phone, email, town.", "**Short summary:** two lines. Who you are, what work you do, how long.", "**Skills:** five to eight short points, from your skills sheet.", "**Work history:** place, job title, dates, and two or three lines about what you did.", "**Training and licences:** name, place, year.", "**Languages:** optional, but useful."),
    H("A made-up sample"),
    P("This person and company are made up. Use it as a guide for the shape, and write your own facts."),
    C('text', `SUNIL KUMAR
Phone: 98XXXXXXXX   Email: sunil.kumar.electrician@example.com
Town: Pune

SUMMARY
House and shop electrician with 6 years of work. I fit wiring, find
faults and finish work on time.

SKILLS
- Wiring for houses and shops
- Fitting lights, fans, switches and meters
- Finding and fixing electrical faults
- Reading simple wiring drawings
- Testing circuits and safety checks
- Working with customers politely

WORK
Electrician, Shah Builders, Pune        Jan 2020 - now
- Wired 40 houses in new buildings with a team of 4
- Fixed faults in shops and offices when called
- Trained 2 new helpers in safe work

Electrician helper, Raj Electricals, Pune   2018 - 2019
- Helped with wiring and repairs, learned the trade

TRAINING
- Electrician trade certificate, ITI Pune, 2018
- Basic first aid, 2021

LANGUAGES
Hindi, Marathi, basic English`),
    P("Notice the style. Every line is short. The numbers in this sample are made up. You should write your real numbers, or leave them out if you are not sure. Do not guess. Do not invent."),
    H("Make it on your phone"),
    O("Open the resume builder on this site, at [/app](/app). It works in a phone browser. Create a free account and choose a plain template.", "Type your details into the boxes, one section at a time.", "Check each line. Check your phone number and email twice. A wrong number means no calls.", "Look at the preview. It should be one page and easy to read.", "Download it as a PDF. A PDF looks the same on every phone and computer.", "Save it in your `Jobs` folder. Give it a clear file name, such as `Sunil-Kumar-Electrician-Resume.pdf`."),
    P("You can look at plain templates here: [resume templates](/templates). If you want ideas for factory, warehouse and trade resumes, read our guide [resume for factory, warehouse and skilled trade jobs](/blog/resume-for-factory-warehouse-skilled-trade-jobs). Habits are different from country to country, and our [resume format by country](/blog/resume-format-india-uk-canada-africa) guide explains them."),
    H("If you cannot make a resume yet"),
    P("Many daily wage and trade jobs do not ask for one. They ask for a call, a test or a visit. Still, a resume helps for bigger employers, for agencies and for job sites. Keep your skills sheet ready in your notes app. You can say the same things on the phone."),
    H("Common mistakes"),
    L("A wrong phone number or email.", "A long resume of three or four pages.", "Big words that you would not say.", "Spelling mistakes. Ask someone to read it.", "A funny email address.", "Lying about work, tools or papers."),
    ...task("Make your resume from your skills sheet, with the builder or in your notes app.", "Check the phone number and email letter by letter.", "Download it as a PDF and save it in your `Jobs` folder.", "Ask a friend to read it and tell you if anything is not clear."),
    ...check("Your resume fits on one page.", "A friend can say what work you do after reading it for thirty seconds.", "The PDF opens on your phone and shows the same text."),
  ], A('A resume on your phone', [
    n('sheet', 'Skills sheet', 'from lesson 2', 0, 0, 'data'), n('build', 'Resume builder', 'plain template', 1, 0, 'tool'),
    n('pdf', 'PDF file', 'one page', 2, 0, 'app'), n('send', 'Send to employers', 'from your Jobs folder', 3, 0, 'out'),
  ], [
    { say: 'Start from your skills sheet. All the facts are already there.', on: ['sheet'] },
    { say: 'Type them into a plain resume template, one section at a time.', flow: ['sheet>build:type'] },
    { say: 'Download one clean page as a PDF and save it in your Jobs folder.', flow: ['build>pdf:download'] },
    { say: 'Send the PDF to employers by message or email when they ask for it.', flow: ['pdf>send:share'] },
  ]), [
    faq('Should I put a photo on my resume?', 'It depends on the country and the employer. Check the job advert. Many employers do not need one. Never put your ID number or bank details.'),
    faq('Is the resume builder free?', 'You can create a resume on this site and check the current options on the page. If anything changes, the page will say so.'),
  ]),

  // ---------------------------------------------------------------- 4
  les(S1, 'photos-of-your-papers-and-privacy', 'Photos of Your Papers: Make Them Clear and Keep Them Safe', 'Photograph Your Papers and Keep Them Safe',
    'Take clear phone photos of certificates and licences, make a tidy PDF, name the files, and learn what to send to an employer and what to keep private.', [
    P("Employers may ask for copies of your papers: a certificate, a licence, a reference letter. You can take a picture with your phone. But a dark, bent or cut photo looks bad. And your papers have private information, so you must be careful about who gets them. This lesson shows both."),
    H("Take a clear photo"),
    O("Put the paper on a flat, plain surface, such as a table, with light from a window. Avoid shadows and the glare of a lamp.", "Hold the phone straight above the paper. Do not take it from the side.", "Make sure all four corners are in the picture, and the writing is sharp.", "Zoom in on the picture, and check that you can read every word. If you cannot, take it again.", "Many phones have a scan option in the camera or notes app. It makes the paper flat and clear. Try it."),
    H("Make it small and tidy"),
    L("Big photos are slow to send and may not go through on a bad network. Many phones let you share a smaller size. Most scan tools do this for you.", "A PDF is better than many loose photos. Put the pages of one paper into one PDF file. Free scanning apps and the built-in scan tool of many phones can do it.", "Check that the file is smaller than a few MB. Employers often have a limit.", "Name the files clearly: `Sunil-Electrician-Certificate-2018.pdf`. A name such as `IMG_4821.jpg` means nothing."),
    H("What you should show, and when"),
    P("Not every paper is for every employer. Think about **who** is asking and **why**."),
    L("**Safe to send early:** your resume, your trade certificate, your safety training, a reference letter, your driving or work licence (a real employer for a driving job will need to see it).", "**Send later, after you have an offer and have checked the employer:** a copy of your ID, your bank details, your tax or social number. A real employer needs them only for the paperwork of a real job.", "**Do not send:** your ATM card, your card PIN, your OTP codes, or your online banking password. Never. No honest employer asks for these."),
    N("If someone asks for your ID or bank details before they have given you a clear job, a written offer and a real address, stop. This is a common trick of thieves. Lesson 7 explains how to spot it."),
    H("Cover what is not needed"),
    P("When you must send a copy of an ID, you can write on it: *Copy for job application, name of company, date.* This stops others from reusing it. If you send a picture, add a note in the message: *Only for this job.* Some phone apps let you add this note on top of the picture."),
    H("Keep the originals safe"),
    L("Keep your original papers in a folder or a plastic cover, in a dry place.", "Do not leave original papers with an employer or agent. A copy is enough for most jobs. If someone insists on keeping your original certificate or passport, ask why, and ask for it in writing. In many places, this is a warning sign, and in some places it is against the rules.", "Keep a copy of every paper in your `Jobs` folder, and one more copy somewhere else."),
    H("Send safely"),
    L("Send papers to the exact person or company that you checked.", "Prefer email or the job site over a stranger's private chat.", "Delete the files from other people's group chats, and do not post them in public groups.", "Remember who got what, and when. Write it in your notes."),
    ...task("Take a clear photo of one certificate or licence. Zoom in and check you can read every word.", "Save it as a PDF with a clear file name in your `Jobs` folder.", "Write a short list: which papers you can send early, and which only after a real offer.", "Make a second copy of the folder and keep it in a safe place."),
    ...check("You can read all the words on your phone photo when you zoom in.", "Your files have clear names and are in one folder.", "You can name three things that you will never send to an employer."),
  ], A('Papers: share carefully', [
    n('paper', 'Paper', 'certificate, licence', 0, 0, 'data'), n('photo', 'Clear photo', 'flat, light, all corners', 1, 0, 'tool'),
    n('pdf', 'Named PDF', 'in Jobs folder', 2, 0, 'app'), n('check', 'Check first', 'who asks and why', 3, 0, 'check'),
  ], [
    { say: 'You have papers such as certificates and licences.', on: ['paper'] },
    { say: 'Take a clear photo or scan: flat paper, good light, all four corners.', flow: ['paper>photo:scan'] },
    { say: 'Save it as a PDF with a clear name in your Jobs folder.', flow: ['photo>pdf:save'] },
    { say: 'Before you send anything, check who is asking and why. Never send card PINs or OTP codes.', flow: ['pdf>check:before sending'] },
  ]), [
    faq('Can I send a photo of my ID to an employer?', 'Only after you have checked the employer, and usually only when you have a real job offer. Add a note that it is only for that job, and never send card PINs or OTP codes.'),
    faq('Should an agent keep my original certificate?', 'Be careful. A copy is enough for most jobs. If someone insists on keeping originals, ask why and get it in writing. It can be a warning sign.'),
  ]),

  // ---------------------------------------------------------------- 5
  les(S2, 'where-to-look-for-work', 'Where to Look for Work: Online and Offline', 'Where to Look for Work: Online and Offline',
    'Find real job openings with your phone and in your area: job sites, local contractors, licensed agencies, training centres and people you know.', [
    P("There is no single place for all jobs. People get work in many ways. The best plan is to use several at the same time. A phone helps with all of them. In this lesson you will learn where to look, and how to keep track."),
    H("1. Job websites and apps"),
    P("Many sites list jobs for drivers, cooks, electricians, security guards, warehouse workers and more. On this site, you can look at [jobs here](/jobs). You can also look at jobs by country. Use the search box with your trade and your town, for example *electrician Pune*. Use filters for the place and the type of work."),
    L("Open the job and read all of it, not only the title.", "Look for the company name, the town, the pay or pay range, the hours and how to apply.", "A job with no company name, no place and no clear work is a warning sign."),
    H("2. People you know"),
    P("Many jobs in trades and daily work come through people. Tell your family, neighbours, old colleagues and friends what work you want. Say it clearly: *I am a welder with 5 years of work. I am looking for work in this area.* Ask them to tell you if they hear of anything. A good word from a person who knows you is strong."),
    H("3. Local contractors, shops and factories"),
    P("Visit or call small and big businesses in your area: building companies, workshops, factories, restaurants, hotels, shops, farms. Look at the gates, noticeboards and shop windows. Ask politely if they need workers. Carry your resume or write your name and phone number clearly on paper."),
    H("4. Training centres and government help"),
    P("Many places have skill training centres, employment offices or job centres. Some give free training, trade tests or job lists. Ask what is in your area. Use official offices or websites. Do not pay a stranger who promises a government job."),
    H("5. Agencies"),
    P("Some agencies find workers for companies. A real agency is registered, has an office, and does not take a fee from you for finding a job in many countries, because the company pays them. Rules are different in different countries. Ask your local labour office. If an agency asks for money before you have a job, be very careful. Lesson 7 explains this more."),
    H("6. Groups on WhatsApp, Facebook or Telegram"),
    P("Some local groups share real jobs. Some share scams. Join groups with a known admin, with real local members. Do not share your ID or your bank details in a group. Contact the employer directly and check them before you share more."),
    H("7. Sites for employers: companies that hire you directly"),
    P("Look at the websites or social pages of companies that you like. Many have a Careers or Jobs page. Local newspapers and radio also list jobs in some places."),
    H("Keep a simple list"),
    P("Use the notes app, or a small notebook. For each place that you contact, write one line."),
    C('text', `Date | Company | What work | Who I spoke to | Phone | What next
12 Mar | Shah Builders | electrician | Mr Shah | 98XXXXXXXX | call again Friday
13 Mar | Green Hotel | maintenance | Reception | 02XXXXXXX | visit Monday 10 am`),
    P("This list stops you from forgetting names, and it helps you call back at the right time. It also shows you how much effort you have made."),
    N("Looking for work is hard work. Many people need weeks or months. Use many ways at once, be patient, and do not take the first offer without checking it. No course can promise a job, but a steady plan helps."),
    ...task("Search this site's jobs page, or another job site, for your trade and your town. Save two jobs that look real.", "Tell five people what work you want, in one clear sentence.", "Make a list of five places in your area to visit or call.", "Start your simple job list in the notes app."),
    ...check("You have at least two real openings, with a company name, place and way to apply.", "Five people know exactly what work you want.", "Your job list has your first three lines."),
  ], A('Many ways to find work', [
    n('you', 'You', 'clear about your work', 0, 0, 'user'), n('online', 'Online', 'job sites and apps', 1, 0, 'tool'),
    n('local', 'Offline', 'people, shops, centres', 1, 1, 'tool'), n('list', 'Your list', 'who, when, next step', 2, 0, 'data'),
  ], [
    { say: 'Start by being clear about what work you do and where.', on: ['you'] },
    { say: 'Look online, on job sites and apps, and read each job fully.', flow: ['you>online:search'] },
    { say: 'At the same time, ask people and visit local employers and training centres.', flow: ['you>local:ask'] },
    { say: 'Write every contact in a simple list, so you can follow up at the right time.', flow: ['online>list:note'] },
  ]), [
    faq('Is it better to look online or offline?', 'Use both. Many trade and daily jobs come through people and visits, and many companies post jobs online. More ways means more chances.'),
    faq('Should I pay an agency to find me a job?', 'Be very careful. In many places, real agencies are paid by the employer. Ask your local labour office what is allowed in your country, and never pay a stranger who promises a sure job.'),
  ]),
];
