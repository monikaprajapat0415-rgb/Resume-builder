import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S2 = 'Find and Apply';
const S3 = 'Stay Safe and Succeed';

export const lessons = [
  // ---------------------------------------------------------------- 6
  les(S2, 'apply-by-phone-messages-and-follow-up', 'Apply by Phone: Messages, Calls and Follow-Up', 'Apply for Jobs by Phone: Messages and Calls',
    'Write a short message or email to apply, make a clear phone call, send your resume and follow up politely. Simple scripts you can copy and change.', [
    P("When you find a job, you must contact the employer. Many people lose the chance because the message is too long, not clear, or never sent. Employers are busy. They like short, clear and polite messages. This lesson gives you simple scripts. Change the names and facts to your own. Use your own language if the employer uses it. The examples are in simple English."),
    H("A short message to apply"),
    P("Use this when you contact an employer by WhatsApp, text or email. Keep it to a few lines."),
    C('text', `Good morning, Mr Shah.
My name is Sunil Kumar. I saw your advert for an electrician in Pune.
I have 6 years of work with wiring in houses and shops. My resume
is attached.
I can start in one week. Please call me on 98XXXXXXXX.
Thank you.
Sunil Kumar`),
    L("Say hello and use the person's name if you know it.", "Say who you are, and which job you want.", "Say one or two real reasons you are a good choice.", "Say that your resume is attached, and attach it.", "Say when you can start, and how to reach you.", "Say thank you. Sign with your name."),
    H("An email needs a subject line"),
    P("If you apply by email, the subject line should say the job and your name, for example: `Application: Electrician - Sunil Kumar`. This helps the employer find your message. Attach your resume as a PDF with a clear file name."),
    H("Making a phone call"),
    O("**Prepare.** Write down your name, the job and two facts about you. Read the job advert again.", "**Choose a good time.** Not too early, not at lunch time or late in the evening. Try mid-morning.", "**Find a quiet place** with a good signal.", "**Say who you are:** *Good morning. My name is Sunil Kumar. I am calling about the electrician job.*", "**Ask a clear question:** *Is the job still open? May I send my resume?*", "**Listen and write.** Write down the name, the address and the time. Repeat it back to check.", "**Thank them,** even if the answer is no."),
    C('text', `Caller:  Good morning. My name is Sunil Kumar. I am calling about
         the electrician job in Pune. Is it still open?
Employer: Yes, it is.
Caller:  Thank you. May I send my resume by WhatsApp? I have 6
         years of work with house and shop wiring.
Employer: Send it, we will see.
Caller:  Thank you. I will send it now. Can I call you again on
         Friday?`),
    N("If you do not understand, say so politely: *Sorry, can you say that again, please?* It is better to ask than to guess a time or an address."),
    H("Voice notes"),
    P("Some people like voice notes. But many employers do not listen to long ones. If you use one, keep it under 30 seconds. Say your name, your job and your phone number slowly. Text is usually better for numbers and addresses."),
    H("Follow up, politely"),
    P("If nobody answers, do not give up and do not send ten messages in one hour. Wait two or three days, then send one short message."),
    C('text', `Good morning Mr Shah. This is Sunil Kumar. I sent my resume
for the electrician job on Monday. I am still interested. Please
tell me if you need anything more. Thank you.`),
    L("Follow up once or twice. After that, move on.", "If someone says no, say thank you. Doors may open later.", "If someone says *call me next week*, write it in your list and call at the right time."),
    H("Keep a record"),
    P("Use your job list from lesson 5. After each message or call, write the date and what happened. It will help you when an employer calls back and you must remember who they are."),
    H("When employers call you"),
    L("Answer in a calm voice, even if you are at work. If you cannot talk, say: *I am at work. May I call you back at 6?* and do it.", "Keep a pen or your notes app ready.", "Do not say yes to everything. If you need to think, say so politely.", "Save the number with the company name."),
    ...task("Write a message to apply for one real or sample job, using the script.", "Say the phone call aloud three times with a friend, then make a real or practice call.", "Write a follow-up message that you could send after three days.", "Add the contact to your job list with the date and the next step."),
    ...check("Your message has your name, the job, one or two facts, your resume and your phone number.", "Your friend understood your call in the first twenty seconds.", "Your list shows the date of each message and the next step."),
  ], A('Apply and follow up', [
    n('find', 'Find a job', 'read all of it', 0, 0, 'data'), n('msg', 'Short message', 'name, job, resume', 1, 0, 'tool'),
    n('wait', 'Wait 2-3 days', 'then one follow-up', 2, 0, 'check'), n('note', 'Write it down', 'date and next step', 3, 0, 'out'),
  ], [
    { say: 'Find a real job and read all of the advert.', on: ['find'] },
    { say: 'Send a short, polite message or call. Say your name, the job, one or two facts, and attach your resume.', flow: ['find>msg:apply'] },
    { say: 'Wait two or three days. Then send one polite follow-up message.', flow: ['msg>wait:wait'] },
    { say: 'Write every contact in your list, with the date and what to do next.', flow: ['wait>note:record'] },
  ]), [
    faq('How long should I wait before following up?', 'Two or three days is usually fine. Send one short, polite message. If there is no answer after one or two follow-ups, move on to other jobs.'),
    faq('Should I send a voice note or a text?', 'Short text is usually better, especially for numbers and addresses. If you use a voice note, keep it under 30 seconds and speak slowly.'),
  ]),

  // ---------------------------------------------------------------- 7
  les(S3, 'spot-job-scams-and-stay-safe', 'Spot Job Scams and Stay Safe', 'Spot Job Scams and Stay Safe',
    'Learn the warning signs of fake job offers: fees, advance money, OTP requests, too-good pay and fake agents. Simple checks, what to do, and where to report.', [
    P("Most employers are honest. But thieves know that people need work, and they make fake job offers. They want your money, your ID or your bank details. Anyone can be tricked, even smart people, especially when they are in a hurry. This lesson is about staying safe. Read it carefully, and tell your family and friends."),
    H("Warning signs"),
    L("**They ask you to pay money** before you start: for a form, a medical test, a uniform, training, a visa, a security deposit or *registration*. Real employers pay you. They do not charge you for a job. Some legal agencies for work abroad may charge in some countries, but there are strict rules about this. Check with your government before you pay anyone.", "**The pay is too good.** A very high salary for easy work, with no experience, is a trap.", "**They ask for your ID, bank details, ATM card, PIN or OTP** before a real offer.", "**They hurry you:** *Pay today or lose the job.* Pressure is a sign of a trick.", "**No real address, no company name, or a company that you cannot find.** Only a mobile number or a free email address.", "**The offer comes from a person you do not know,** by message, and you never apply.", "**They want to talk only on chat,** and refuse a call or a meeting at a real office.", "**Bad writing,** a strange link, or a request to click and sign in to a website.", "**A job that sends you money first** and then asks you to send some back. This is a cheque or payment trick."),
    H("Simple checks before you trust"),
    O("**Search the company name.** Do they have a website, an address and a phone number that match? Do other people say it is a real company?", "**Call them.** Use the number from their official website, not only the number in the message.", "**Ask for the offer in writing,** with the company name, address, job, pay, hours and start date.", "**Visit the place** in daytime if you can, and take a friend or tell a family member where you are going.", "**Ask a person you trust,** such as a teacher, an older relative, a union representative or a local employment office.", "**Slow down.** A real job will still be there tomorrow."),
    H("What to do if you think it is a scam"),
    L("Stop. Do not send money or papers.", "Do not click on strange links.", "Save the messages and numbers as proof. Do not delete them.", "Block the number.", "If you shared your bank or card details, call your bank at once, using the number on your bank card, not the number in the message.", "If you paid money, report it to the police or the local cybercrime service in your country, and tell your bank. Many countries have an online place to report fraud. Ask your local police station or look for the official government website.", "Warn your friends and family."),
    N("A person who has been tricked is not stupid and should not feel ashamed. Reporting helps others. Thieves often try again, so be careful for a while."),
    H("Work in another country"),
    P("Many people dream of work abroad. It is also where many big scams happen, with fake visas and fake contracts. Be very careful."),
    L("Use only official government channels and licensed agents in your country. Your government's labour or overseas employment office can tell you which agents are licensed.", "Check the job with the **employer** in the other country, and ask your own embassy or labour office if the company is real.", "Never travel on a *tourist visa* for a job unless an official source says it is allowed. Get the contract and read it, in a language you understand, before you pay or travel.", "Never give your passport to an agent to keep.", "If it sounds too easy, stop and ask an official office."),
    H("Safety at interviews and first days"),
    L("Meet at a business place, in daytime, and not in a private home or a hotel room.", "Tell someone where you are and when you will be back. Keep your phone charged and share your location with a person you trust if you can.", "If something feels wrong, leave. It is okay to say *I am sorry, I have to go*.", "Women and young people should take extra care, and bring a friend if possible."),
    H("Protect your accounts"),
    L("Never share OTP codes, passwords or PINs with anyone, even a person who says they are from a bank or a job site.", "Use a different password for your email.", "Do not use public computers or open Wi-Fi to sign in to important accounts."),
    P("Remember this rule: **a real job never needs you to pay first, and never needs your PIN or OTP.**"),
    ...task("Read the warning signs again. Say three of them aloud to a family member or friend.", "Write the rule in your own words, and put it in your notes app.", "Take one real job advert that you saw and check it: search the company, find a phone number and call it.", "Find the official way to report fraud in your country, and save the web address or phone number in your phone."),
    ...check("You can list at least five warning signs without looking.", "You have saved the official place to report fraud or scams in your country.", "You know the rule about fees, PINs and OTP codes."),
  ], A('Check before you trust', [
    n('offer', 'A job offer', 'by message or advert', 0, 0, 'data'), n('signs', 'Warning signs?', 'fee, hurry, OTP, high pay', 1, 0, 'check'),
    n('check', 'Check it', 'search, call, written offer', 2, 0, 'tool'), n('act', 'Decide', 'continue or stop and report', 3, 0, 'out'),
  ], [
    { say: 'You get a job offer by message or from an advert.', on: ['offer'] },
    { say: 'Look for warning signs: fees, pressure, requests for OTP or ID, or pay that is too good.', flow: ['offer>signs:look'] },
    { say: 'Check the company: search for it, call a number you found yourself, and ask for the offer in writing.', flow: ['signs>check:verify'] },
    { say: 'If it is real, go on. If not, stop, keep the messages and report it.', flow: ['check>act:decide'] },
  ]), [
    faq('Is it normal to pay a fee to get a job?', 'Honest employers pay you, they do not charge you. Some licensed agencies for work abroad may charge in some countries, under strict rules. Always check with your government labour office before paying anyone.'),
    faq('What should I do if I already sent money to a scammer?', 'Stop sending more, tell your bank, keep all messages as proof, and report it to the police or the official fraud reporting service in your country. Warn others.'),
  ]),

  // ---------------------------------------------------------------- 8
  les(S3, 'prepare-for-the-interview-and-trade-test', 'Prepare for the Interview and Trade Test', 'Prepare for the Interview and Trade Test',
    'Get ready for an interview or practical test: what to bring, how to arrive, simple answers, safety questions and what to ask about pay and hours.', [
    P("An interview for a trade, factory, driving or service job is often short and simple. Many employers also give a practical test: they ask you to show your work. If you prepare a little, you will feel calmer and do better. This lesson tells you how."),
    H("Before the day"),
    O("**Confirm.** Send a short message: *Thank you. I will come on Monday at 10 am to your address.* Check the place on a map and how long the trip takes.", "**Plan the way.** Leave early. Plan for traffic and for a late bus.", "**Prepare your clothes.** Clean, plain clothes. If you have work shoes or tools that you need for the test, bring them if allowed.", "**Prepare your papers.** A few copies of your resume, your certificates and licences, and your ID. Put them in a clean folder or a plastic cover.", "**Rest.** Sleep early. Eat something. Drink water.", "**Practise your answers** aloud, with a friend."),
    H("What to bring"),
    L("Your resume, 2 or 3 copies.", "Your trade certificates and licences, copies and, if asked, the originals to show.", "Your ID. Show it only to the employer when asked, and take it back.", "A pen and a small notebook.", "Your phone, on silent.", "Water, and money for transport."),
    H("On the day"),
    L("Arrive ten or fifteen minutes early. If you will be late, call or message and say so.", "Be polite to everyone, from the guard to the manager.", "Greet, smile, and give your name. Stand or sit up straight.", "Listen to the question fully before you answer.", "Speak clearly and not too fast. If you do not understand, ask them to repeat.", "Look at the person, if this is polite in your culture."),
    H("Common questions and simple answers"),
    P("These answers are made-up examples. Use your own true words."),
    C('text', `Q: Tell me about yourself.
A: My name is Sunil. I am an electrician with 6 years of work in
   houses and shops. I like to find faults and finish work on time.

Q: Why do you want this job?
A: I want to work with a good team and grow my skills. Your company
   does work that I know.

Q: What work have you done?
A: I wired houses in new buildings, fixed faults and fitted fans
   and meters.

Q: What is your biggest strength?
A: I am careful and I check my work before I leave.

Q: Can you start soon? Can you work shifts?
A: Yes, I can start in one week. I can work day and evening shifts.`),
    P("Our page of [interview questions](/jobs/interview-questions) has more to practise, and our guide to [telling about yourself](/blog/tell-me-about-yourself-interview-answer) can help with the first question."),
    H("Safety questions"),
    P("In many trade and factory jobs, the employer will ask about safety. It is a good sign. Safe workers are valued. Be ready to say what you do to stay safe: you wear helmets, gloves and boots, you check tools before you use them, you switch off power before repair, you ask if you are not sure. Do not say you never need safety gear. If you have safety training, mention it."),
    H("The practical test"),
    L("Listen to the task. Ask a short question if something is not clear.", "Check your tools first.", "Work safely and keep the place clean. Employers watch how you work, not only the result.", "Do not rush. A careful, correct job is better than a fast, wrong one.", "If you make a mistake, say so calmly and fix it. Honest people are trusted.", "Say thank you at the end, whatever happens."),
    H("Your questions to them"),
    P("It is normal and polite to ask about the job. Ask clearly, near the end of the talk."),
    L("What are the working hours and days, and is there overtime?", "What is the pay, and how and when is it paid?", "Is there a written agreement or contract?", "What safety gear and training do you give?", "Where will I work, and how will I get there?", "When will I know your decision?"),
    N("Do not start with *how much money?* before they know your skills. But do ask about pay, hours and safety before you accept. It is your right to understand the job."),
    H("After the interview"),
    P("Send a short thank-you message the same day or the next morning. *Thank you for your time today. I am interested in the job. I hope to hear from you.* Write in your job list what was said and when they will decide. If you do not hear back by that date, follow up once."),
    ...task("Practise the five questions aloud, with a friend, in your own true words.", "Prepare your folder with copies of your resume and certificates.", "Write five questions you will ask the employer about hours, pay and safety.", "Plan your trip to a place: how long does it take, and when must you leave?"),
    ...check("You can answer the first question in about 30 seconds without reading.", "Your folder has copies of your resume and papers.", "You have your questions about pay, hours and safety written down."),
  ], A('Interview day', [
    n('prep', 'Prepare', 'papers, answers, trip', 0, 0, 'data'), n('arrive', 'Arrive early', '10-15 minutes', 1, 0, 'user'),
    n('show', 'Talk and show', 'honest, safe, polite', 2, 0, 'app'), n('after', 'Thank and note', 'message, list', 3, 0, 'out'),
  ], [
    { say: 'Prepare your papers, your answers and your trip the day before.', on: ['prep'] },
    { say: 'Arrive ten or fifteen minutes early, or message if you will be late.', flow: ['prep>arrive:go'] },
    { say: 'Answer honestly, work safely in the test, and ask your questions about pay, hours and safety.', flow: ['arrive>show:interview'] },
    { say: 'Send a short thank-you message and write down what they said and when they will decide.', flow: ['show>after:follow up'] },
  ]), [
    faq('What should I wear to a trade or factory interview?', 'Clean, plain clothes. If a practical test is possible, ask the employer what to bring, and wear safe shoes. Being neat shows respect.'),
    faq('Is it rude to ask about pay?', 'No, if you ask politely, and preferably after you have talked about your skills. You have a right to know the hours, pay and safety before you accept.'),
  ]),

  // ---------------------------------------------------------------- 9
  les(S3, 'know-your-rights-pay-and-written-agreements', 'Know Your Rights: Pay, Hours and a Written Agreement', 'Know Your Work Rights: Pay and Agreements',
    'Know the basics before you start work: a written agreement, clear pay and pay days, hours, safety and keeping proof. General information, not legal advice.', [
    P("You got the job. Good! Before you start, take a little time to understand what you have agreed to. Many problems at work, such as late pay, unpaid hours or unsafe places, start because nothing was clear at the beginning. This lesson gives you a short list of things to check, and ideas to protect yourself. It is **general information, not legal advice**. Rules are different in each country and each state, so always check your local rules."),
    H("Ask for the offer in writing"),
    P("A written offer or agreement does not have to be long. It should say clearly the things below. If an employer does not give anything in writing, you can write it yourself and send it by message: *Thank you for the job. I understand that I will work as a welder from Monday, 8 am to 5 pm, for 600 per day, paid every Saturday. Please confirm.* A reply of *yes* is proof. Keep it."),
    L("The name and address of the employer or company.", "Your job and place of work.", "The start date.", "Pay: the amount, and whether it is by day, week, hour or month.", "When and how you are paid: on which day, in cash, to a bank account or by mobile money.", "Working hours, rest days, breaks and overtime pay.", "Any trial period, and how much notice is needed if you or the employer want to stop.", "What the employer will give: safety gear, tools, transport, food or a place to sleep."),
    N("If you cannot read the agreement well, ask a trusted person to read it with you before you sign. Do not sign a blank page, and do not sign what you do not understand."),
    H("Pay"),
    L("Pay for all the work you do, on the day that was agreed.", "Ask for a **payslip** or a note that shows the hours, the pay and what was taken out, if the employer gives one. In some places it is required. If the employer pays in cash, write down the date and the amount, and ask for a signed note if you can.", "In many countries there is a **minimum wage**, a legal lowest pay. Ask your local labour office or look at the official government website to see what it is where you work.", "Deductions, such as tax, social insurance or fines, should be explained. Ask if something is taken out and why."),
    H("Hours and rest"),
    P("Ask what the normal hours are, and how overtime is paid. Many countries have rules about the length of the working day and the weekly rest day. If you work extra hours, write them down: date, start time, end time. Also note any break."),
    H("Safety"),
    L("You have a right in many places to a safe workplace. The employer should give safety gear and training for risky work.", "If a machine or a place is not safe, tell your supervisor. Do not do work that you have not been trained for and that could hurt you.", "Know where the first aid box and the exits are.", "If you are hurt at work, tell a supervisor at once, ask for first aid and write down what happened. Keep your medical papers."),
    H("Keep proof"),
    P("Proof protects you if there is a problem. Keep them in your `Jobs` folder, and keep a second copy."),
    L("The offer or agreement, and messages that confirm the job.", "Payslips or notes of pay, with dates.", "A list of your days and hours.", "Photos of the place and of your work if it matters, and if photos are allowed.", "Names and phone numbers of the supervisor and the company."),
    H("If something goes wrong"),
    O("Stay calm. Talk to your supervisor or employer politely and clearly, and say what you need: *My pay for last week was not paid. Please tell me when I will get it.*", "Put it in writing, in a message. Keep a copy.", "Ask a trusted person, such as a union representative, a worker centre or a community group, for help.", "Contact your local labour office, labour inspector or legal aid service. Many countries have free or low-cost help for workers. Search for the official government website, and be careful of people who ask you for money to *fix* it.", "Do not sign papers that you do not understand, and do not hand over your original documents."),
    P("Different groups of workers have different rules. Daily wage workers, domestic workers, farm workers and migrant workers may be treated differently by the law in your country. Ask a local worker organisation or official office what applies to you."),
    ...task("Write a message that you could send to an employer to confirm a job: place, start date, pay, pay day and hours.", "Find your country's labour office or worker help service and save its web address or phone number.", "Make a simple table in your notes app to write your days and hours: date, start, end.", "Put a copy of your agreement and your contacts in the `Jobs` folder."),
    ...check("Your message has the pay, the pay day, the hours and the start date.", "You have saved one official place to ask about work rights.", "You can name three kinds of proof to keep."),
  ], A('Clear start, safe work', [
    n('offer', 'Written offer', 'pay, hours, place', 0, 0, 'data'), n('keep', 'Keep proof', 'messages, payslips', 1, 0, 'tool'),
    n('safe', 'Safe work', 'gear and training', 2, 0, 'check'), n('help', 'Ask for help', 'office, union, legal aid', 3, 0, 'out'),
  ], [
    { say: 'Before you start, get the offer in writing: pay, pay day, hours and place.', on: ['offer'] },
    { say: 'Keep proof, such as messages, payslips and a list of your days and hours.', flow: ['offer>keep:save'] },
    { say: 'Check that the place is safe and that you have gear and training for risky work.', flow: ['keep>safe:check'] },
    { say: 'If something goes wrong, talk, write it down, and ask an official office or a worker group for help.', flow: ['safe>help:if needed'] },
  ]), [
    faq('Do I need a written agreement for a short or daily job?', 'It is wise. It can be a simple message that both sides confirm. Rules about written agreements are different in each country, so ask your local labour office.'),
    faq('Where can I get help if my pay is not paid?', 'Talk to your employer in writing first, then ask a local worker group or union, or your government labour office or legal aid service. Use official channels and do not pay people who promise to fix it.'),
  ]),

  // ---------------------------------------------------------------- 10
  les(S3, 'keep-learning-and-your-seven-day-plan', 'Keep Learning and Your Seven-Day Plan', 'Keep Learning and Your Seven-Day Plan',
    'Choose a skill to learn next, find free learning on your phone, and follow a simple seven-day plan to start your job search with what you made.', [
    P("You have set up your phone, listed your skills, made a resume, found places to look, learned how to apply, avoid scams and prepare. Now it is time to put it into action. This last lesson gives you a simple plan for seven days, and ideas to keep learning so that better work comes your way. No plan can promise a job, but steady work, little by little, gives you the best chance."),
    H("A seven-day plan"),
    O("**Day 1: Phone.** Do lesson 1. Charge it, free some space, make the `Jobs` folder, check your email and voicemail.", "**Day 2: Skills.** Write your skills sheet. Ask one person what you do best.", "**Day 3: Resume.** Make your one-page resume and save the PDF. Ask a friend to read it.", "**Day 4: Papers.** Take clear photos of your certificates and licences. Name the files.", "**Day 5: Look.** Search for jobs online and tell five people what work you want. Start your job list.", "**Day 6: Apply.** Send three messages or make three calls using the scripts. Write them in your list.", "**Day 7: Check.** Follow up where it is time. Check for scam signs again. Plan the next week."),
    P("Repeat Days 5 to 7 each week. Do a little every day. Looking for work is a job in itself. Many people find that doing something small each day is easier than a big push once a month."),
    H("Keep your energy up"),
    L("Rest, eat and move. Tired people give up.", "Talk to a friend or family member about how it feels. A bad week is normal.", "Celebrate small wins: a call back, a reply, a new contact.", "If you feel very low or cannot cope, talk to someone you trust, or to a local health or support service. You are not alone."),
    H("Learn one new thing"),
    P("A new skill can open more jobs. Pick one that fits your work and your time. Some ideas:"),
    L("A safety course or first aid.", "A licence, such as for driving, forklift or machines, if it fits your work.", "Basic maths for measuring and cost. It helps in almost every trade.", "Basic English or the language of your region, for speaking with customers. Our course [Workplace English](/learn/workplace-english-course) teaches phrases for calls, messages and work.", "Simple phone and computer skills, such as spreadsheets for jobs. Our [Excel for Jobs](/learn/excel-for-jobs-course) course can help if you work with lists and numbers.", "A trade upgrade, for example from helper to skilled worker."),
    H("Ways to learn on your phone"),
    L("Free video lessons and local training channels in your language.", "Library, community centre or training centre courses. Many have free or low-cost classes.", "Lessons on this site: see all [free courses](/learn).", "Ask a person with more experience if you can watch and learn for a short time."),
    H("See where your skills can go"),
    P("Look at our [career roadmaps](/roadmaps). They show steps and skills for different kinds of work, and you may see a next step that you can reach. Roadmaps are guides, not promises. Use them to choose what to learn next."),
    H("A short note for helpers"),
    P("If you are teaching a family member or a friend, sit with them and do the lessons together. Many people are shy about asking for help. Be patient. Let them do the typing, and you can explain."),
    N("This course gives practical steps. It cannot promise that you will find a job, or tell you the exact rules in your country. Use it with local advice from official offices, worker organisations and people you trust."),
    ...task("Write your seven-day plan in your notes app, with the day and the time of each step.", "Do Day 1 today.", "Choose one skill that you want to learn in the next three months, and write the first step.", "Tell one person about your plan, and ask them to check on you in one week."),
    ...check("You have a plan with seven days and a clear first step.", "You did Day 1: your phone, your folder and your email are ready.", "You know one skill that you want to learn next."),
  ], A('Seven days, one step at a time', [
    n('d1', 'Days 1-2', 'phone and skills', 0, 0, 'data'), n('d3', 'Days 3-4', 'resume and papers', 1, 0, 'tool'),
    n('d5', 'Days 5-6', 'look and apply', 2, 0, 'app'), n('d7', 'Day 7', 'check and plan next week', 3, 0, 'out'),
  ], [
    { say: 'Days 1 and 2: set up your phone and write your skills.', on: ['d1'] },
    { say: 'Days 3 and 4: make your resume and take clear photos of your papers.', flow: ['d1>d3:next'] },
    { say: 'Days 5 and 6: look for jobs, tell people, and send three messages or calls.', flow: ['d3>d5:next'] },
    { say: 'Day 7: follow up, check for scam signs and plan the next week. Then repeat.', flow: ['d5>d7:next'] },
  ]), [
    faq('How long will it take to find a job?', 'Nobody can say. It depends on your trade, your area and the season. Use many ways at once, work a little every day, and stay patient.'),
    faq('What should I learn next to get better work?', 'Choose a skill that fits your trade, such as safety training, a licence, basic maths, or the local language for talking to customers. Check the career roadmaps for ideas.'),
  ]),
];
