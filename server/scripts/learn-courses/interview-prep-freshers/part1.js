import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S1 = 'Before the Interview';
const S2 = 'Common Questions';

export const lessons = [
  // ---------------------------------------------------------------- 1
  les(S1, 'how-fresher-interviews-work', 'How Fresher Interviews Work: Rounds and What to Expect', 'How Fresher Interviews Work: Rounds',
    'Understand the usual stages of a fresher hiring process, from application to offer, and what each round is really testing, in India, the UK, Canada and Africa.', [
    P("Your first interview feels scary mostly because it is unknown. Nobody has told you what happens, how long it takes, or what the people on the other side are looking for. This lesson removes the mystery. When you can picture the whole process, from the moment you apply to the moment you get an answer, each step becomes a smaller problem that you can prepare for."),
    P("One honest note first. Hiring processes differ between companies, industries and countries. A large company that visits colleges hires in a very different way from a small workshop, a shop or an agency. What follows is the common pattern, not a rule. Always read the message you receive from the employer, because it usually tells you what to expect."),
    H("The usual stages"),
    O("**Application.** You send your resume or CV, sometimes with a cover letter or a form. Many companies use software to read it first. A clear, plain resume helps here.", "**Screening.** A recruiter or HR person checks your details by phone, video or message. They confirm that you meet the basic needs and ask simple questions: where you live, when you can start, what pay you expect, whether you can work in that country.", "**Written or online test.** Common for larger employers and for technical and finance roles. It can test aptitude (numbers, logic, English), subject knowledge or coding.", "**Interview rounds.** One to four conversations. They may be technical (the work itself), managerial (the person you would work for) and HR (fit, pay, rules).", "**Offer and checks.** An offer, then document checks and sometimes a reference or background check, then a joining date."),
    P("Not every job has all of these. A shop assistant job might be one conversation on the same day. A campus placement drive might run a test, a group discussion and two interviews in a single day. A graduate scheme in the UK may have an online form, a video exercise and an assessment day that takes many weeks. Expect more steps for bigger employers and fewer for small ones."),
    H("What each round is really testing"),
    P("Knowing the purpose of each stage helps you decide how to prepare."),
    L("**The screening call** tests whether you are reachable, clear and basically suitable. Be on time, speak clearly and have your facts ready. This stage removes many candidates who forgot to prepare for it.", "**The test** checks a basic skill level at scale. It is usually about accuracy under time pressure, so practice with a timer.", "**The technical or skills round** checks whether you can do the work or learn it. Interviewers know you are a fresher. They look for solid basics, honest answers and how you think when you do not know something.", "**The managerial round** asks whether they would like to work with you every day. Attitude, curiosity and reliability matter a lot here.", "**The HR round** checks fit, expectations and logistics: pay, notice period, location, the company rules. It is also a chance for you to ask your questions."),
    H("How it differs by country"),
    P("These are general habits, not laws, and they change between companies."),
    L("**India.** Large employers often recruit through campus drives, with a written round, group discussion, technical interview and an HR interview. Questions about family background, marital status and similar topics sometimes come up. You may politely answer briefly and steer back to your skills. Notice periods and joining dates are discussed openly.", "**United Kingdom.** Many employers use competency-based questions (“tell me about a time when...”) and ask about your right to work in the UK. Graduate employers often use online tests and assessment centres. Equality rules mean personal questions such as age or marital status should not be used in hiring decisions.", "**Canada.** Behavioural questions are very common, and employers often ask for examples of teamwork and problem solving. Clear, direct answers and concrete examples are valued. Questions about age, family status or religion are not appropriate in hiring.", "**African countries.** Practice varies widely between countries and sectors. Large companies and organisations often use written tests and panel interviews. Smaller firms may rely on one conversation and references from people they trust. Bring clear copies of your documents."),
    P("If anything in an interview makes you uncomfortable, such as being asked to pay a fee or share a bank password, stop. Lesson 14 explains how to spot fake job offers."),
    H("How long does it take?"),
    P("There is no fixed time. Some small employers decide within a day. Large employers can take weeks or months, and sometimes never reply. Do not stop applying while you wait for one answer. A calm approach is to apply to several roles at once, keep a simple list of what you sent, when and to whom, and follow up politely after a week or two if they gave no date."),
    H("Types of interview formats"),
    L("**One to one.** You and one interviewer. The most common format.", "**Panel.** Two to five interviewers. Look at the person who asks the question, but include the others when you answer.", "**Group interview or group discussion.** Several candidates together. They watch how you listen and contribute.", "**Phone or video.** Common for screening. Lesson 12 covers how to set up well.", "**Walk-in.** You arrive at a set time and wait your turn. Bring copies of documents and be ready for a quick conversation."),
    H("Your first checklist"),
    P("Before you study any questions, set up the basics. These take an hour and remove many small worries."),
    O("Make sure your resume is clear and honest. You can build one with the [free resume builder](/app) on this site and check how software reads it with the [ATS checker](/features/ats-checker).", "Write a list of the companies and roles you applied to, with dates.", "Set up a professional email address and a phone voicemail message. Check them daily.", "Prepare a folder, on your phone and on paper, with your certificates, ID, photos and copies of your resume.", "Choose a quiet place and a time for phone calls."),
    N("An interview is a two-way conversation. The employer is also trying to win you. You are allowed to ask questions and to decide that a job is not right for you."),
    ...task("Write the stages you think the last job you applied for will use. Then check the job advert or message for clues.", "List the people you could ask for a reference (a teacher, lecturer, previous manager or community leader) and ask their permission.", "Create the document folder described above."),
    ...check("You can name the usual five stages in order.", "You know which stage you find hardest and can name one thing you will do about it.", "Your documents and a copy of your resume are ready on paper and on your phone."),
  ], A('The usual hiring path', [
    n('apply', 'Apply', 'resume or CV', 0, 0, 'user'), n('screen', 'Screening', 'call or message', 1, 0, 'check'),
    n('test', 'Test', 'aptitude or skills', 2, 0, 'tool'), n('talk', 'Interviews', 'technical, manager, HR', 3, 0, 'app'), n('offer', 'Offer', 'checks, joining date', 3, 1, 'out'),
  ], [
    { say: 'You apply with a clear resume. Software or a person reads it first.', on: ['apply'] },
    { say: 'A short screening call or message confirms the basics.', flow: ['apply>screen:shortlisted'] },
    { say: 'Many employers add a written or online test to check basic skills.', flow: ['screen>test:passed'] },
    { say: 'You then meet one to four interviewers: technical, manager and HR.', flow: ['test>talk:passed'] },
    { say: 'If it goes well, you get an offer and document checks before the joining date.', flow: ['talk>offer:selected'] },
  ]), [
    faq('How many interview rounds are normal for a fresher?', 'It varies. A small employer may hold one conversation. Larger employers often have a test and two or three interviews. Read the message from the employer for the exact steps.'),
    faq('Is it normal to be asked about marital status or family in an interview?', 'It happens in some places, but in many countries such questions should not be used in hiring. You can answer briefly and politely and return to your skills and availability.'),
  ]),

  // ---------------------------------------------------------------- 2
  les(S1, 'research-the-company-and-role', 'Research the Company and the Role Before You Go', 'Research the Company Before an Interview',
    'Learn quick, honest research: read the job advert closely, understand the company, find the skills they need and prepare your own questions.', [
    P("Many fresh candidates walk into an interview knowing only the name of the company. Interviewers notice this immediately. The question “What do you know about us?” is common and easy to prepare for. One hour of good research makes you more confident, gives you better answers and shows you are serious about this job, not just any job."),
    H("Start with the job advert"),
    P("The job advert is the best clue to what the employer wants. Read it slowly, twice. Then do this."),
    O("Copy the advert into a document so you do not lose it if the link disappears.", "Underline every skill, tool and duty it mentions. These are the words the interviewer will use.", "Split them into two groups: **must have** and **nice to have**. Adverts often list too many things. The first items and repeated items are usually the important ones.", "Next to each must-have, write one real example from your life where you used or learned it: a college project, an internship, volunteer work, a part-time job, a course."),
    P("Now you have a map. For each key requirement, you already hold a short story. That story becomes your answer when the interviewer asks about it. It also shows you where you have gaps, so you can prepare an honest reply for them (lesson 8)."),
    N("Do not claim skills you do not have. A fresher who says “I have not used that tool yet, but I have used a similar one and I learn quickly” is trusted more than someone who bluffs and is caught in the next question."),
    H("Learn about the company"),
    P("You do not need to know everything. You need a few clear facts and your own thoughts about them. Look at these places."),
    L("**The company website.** Read the About page, the products or services, and any news or blog. Notice who their customers are.", "**Their social media or LinkedIn page.** See what they share and how they describe themselves.", "**Recent news.** Search for the company name with the word “news”. Look for something recent and positive, such as a new product, a new branch or an award.", "**Company reviews.** On this site and elsewhere, employees sometimes describe working there. Read them carefully, remember that they are one person's view, and look for patterns.", "**The people.** If you know who will interview you, look at their role. Never contact them in a way that feels intrusive."),
    P("Write five lines: what the company does, who it serves, how big it is (if you can tell), one recent thing you noticed, and one thing you like about it. This takes about twenty minutes and gives you material for “Tell me what you know about us” and “Why do you want to work here?”."),
    H("Understand the role in daily terms"),
    P("A job title does not tell you what a person does all day. Try to picture a normal Tuesday in the role. What tasks will you do? Who will you work with? What does a good day look like? You can find clues in the advert, in descriptions of similar roles, and in the roadmap pages on this site, which explain typical steps and skills for many careers."),
    P("If you know someone who works in a similar role, ask them for ten minutes. Good questions are: What is a normal day like? What do you wish you had known when you started? What do new people struggle with? Say thank you, and do not ask for a job in the same breath."),
    H("Know the basics of the industry"),
    P("A little background helps. If you apply to a bank, know what kind of customers a bank serves. If you apply to a hospital, understand the roles of the people around you. If you apply to a factory or workshop, be familiar with safety rules and shifts. For a technical role, read about the main tools in your field. You do not need to be an expert. You need to sound like someone who has taken an interest."),
    H("Prepare your own questions"),
    P("Almost every interview ends with “Do you have any questions for us?”. Saying “No” sounds uninterested. Prepare three to five real questions, based on your research. Good examples:"),
    L("“What would a successful first three months look like in this role?”", "“How does the team work together day to day?”", "“What training or support do new people receive?”", "“What are the biggest challenges the team faces right now?”", "“What are the next steps in the process?”"),
    P("Avoid asking about pay, leave or perks as your first question. These matter, and you should learn about them, but they are better raised later, or when the interviewer brings them up (lesson 13)."),
    H("A one-page prep sheet"),
    P("Put what you learned on a single page you can read quickly before the interview."),
    C('text', `COMPANY: what they do, who they serve, one recent fact
ROLE: three main tasks, three skills they ask for
MY EXAMPLES: one real story for each skill
GAPS: what I have not done yet and how I will learn it
QUESTIONS: 3 to 5 questions I will ask
LOGISTICS: place, time, who to ask for, phone number`),
    P("Reading this page for ten minutes before you go is more helpful than a long night of panic study. Keep your prep sheets for each application. They are a record, and you can reuse parts for similar roles."),
    H("What not to do"),
    L("Do not repeat the company's slogan as your answer. Say it in your own words.", "Do not criticise a competitor or a previous employer.", "Do not pretend to know more than you do. A sincere “I read that you are expanding into the city, and I would like to learn how that works” is better than a made-up opinion.", "Do not rely on a single source. Read more than one."),
    ...task("Choose a real job advert. Mark the must-haves and write one real example from your life for each of the top five.", "Write your five-line company summary, using the company's website and one news search.", "Write three questions you would ask the interviewer.", "Fill in the one-page prep sheet."),
    ...check("Every top requirement has a real example next to it, or a gap that you named honestly.", "Your questions are about the job and team, not only about pay.", "You can say in two sentences what the company does and why you want to work there."),
  ], A('Turn research into answers', [
    n('ad', 'Job advert', 'must-haves', 0, 0, 'data'), n('co', 'Company facts', 'website, news', 0, 1, 'data'),
    n('map', 'Your examples', 'stories for each skill', 1, 0, 'user'), n('sheet', 'Prep sheet', 'one page', 2, 0, 'tool'), n('int', 'Interview', 'calm and specific', 3, 0, 'out'),
  ], [
    { say: 'Read the job advert closely and mark the skills it asks for.', on: ['ad'] },
    { say: 'Find a few real facts about the company from its own website and recent news.', on: ['co'] },
    { say: 'Match each key skill with one real example from your studies, work or projects.', flow: ['ad>map:must-haves'] },
    { say: 'Put the facts, examples, gaps and your questions on one page.', flow: ['map>sheet:summarise', 'co>map:facts'] },
    { say: 'In the interview your answers are specific, and your questions show real interest.', flow: ['sheet>int:ready'] },
  ]), [
    faq('How much research is enough?', 'About an hour is enough for most fresher roles. Read the job advert closely, learn what the company does, find one recent fact, and prepare a few questions.'),
    faq('What if I cannot find anything about a small company?', 'Use the job advert, the owner or team page if any, and ask the recruiter a few questions. Showing curiosity about a small business is itself a good sign.'),
  ]),

  // ---------------------------------------------------------------- 3
  les(S1, 'know-your-resume-and-projects', 'Know Your Resume: Projects, Internships and Skills', 'Know Your Resume Before the Interview',
    'Interviewers ask about everything on your resume. Learn to prepare each line, explain projects clearly and answer follow-up questions honestly.', [
    P("Your resume is a list of promises. Every line says: ask me about this, I know it. Interviewers do exactly that. They pick something from your page and dig. “You wrote Excel. What is a pivot table?” “You listed a project on student attendance. What was your part in it?” Candidates who cannot explain their own resume lose trust fast. This lesson shows you how to prepare so that your own page becomes your biggest strength."),
    H("The rule: only write what you can explain"),
    P("Go through your resume line by line. For each skill, tool, project and responsibility ask three questions. Can I explain it in two sentences? Can I give an example of using it? If the interviewer asks one more question, can I answer honestly? If the answer to any of these is no, either learn it before the interview or remove it. Our resume checker and templates push you to put real, checkable facts on the page, and not to pad it with keywords you cannot back up."),
    N("Being honest protects you. Exaggerated claims are easy to test in an interview, and on the job they can be found out later, which can cost you the role."),
    H("The three-part story for each project"),
    P("Freshers often have more projects than jobs, so projects carry your resume. Prepare each one with this three-part story. It takes about a minute to say."),
    O("**The problem.** What was the project for? Who would use it? “We built a small app to help our college library track borrowed books.”", "**Your part.** What did you personally do? Use “I”, not only “we”. “I designed the database tables and wrote the search page.”", "**The result and the lesson.** What happened, and what did you learn? “It handled about 200 books in our test, and I learned how important it is to check user input.”"),
    P("Only give numbers that are true. If you did not measure anything, do not invent a figure. Say what you observed instead: “Our teacher and four classmates tested it and found two bugs I then fixed.” That is believable and specific."),
    P("Then prepare for the follow-up questions every project invites."),
    L("What was the hardest part and how did you solve it?", "What would you do differently now?", "Why did you choose this tool or method?", "How did you work with others? What if someone disagreed with you?", "What happened when it did not work?"),
    H("Internships, part-time jobs and volunteering"),
    P("For each experience, be ready to describe what you did on a normal day, one thing you are proud of, one difficulty you solved, and what you learned about working with other people. Jobs that seem small, such as serving in a shop, helping in a family business or tutoring younger students, show reliability, patience, customer care and responsibility. These are things every employer wants. Do not apologise for them. Explain what they taught you."),
    H("Skills: prove each one"),
    P("A skills list is the easiest part of a resume to challenge. Prepare a quick proof for each skill."),
    C('text', `Skill: Microsoft Excel
Proof: Used it to track my family shop's weekly sales for six months;
       learned SUM, filters and a simple pivot table.

Skill: Python (basic)
Proof: Wrote a script that renamed 300 photos by date; finished a
       beginner course; can explain loops and functions.

Skill: Customer service
Proof: Worked weekends at a phone shop; handled returns and complaints.`),
    P("When a skill is basic, say so with the level: “basic”, “working knowledge”, “comfortable”. Interviewers respect honest levels and will not expect you to be an expert in something you list as basic."),
    H("Education: be ready for details"),
    P("Know your marks or grades, your main subjects, and why you chose your course. Be ready for questions about a low result or a failed subject. Answer calmly: what happened, what you did about it, what you learned. Blaming teachers or other people sounds weak, and a clear and brief explanation of what changed sounds strong."),
    H("Check the facts on the page"),
    P("Small mistakes cause large doubts. Before every interview, check these things on the version you sent that employer."),
    L("Dates are correct and match your documents.", "Names of companies, colleges and tools are spelled correctly.", "Your phone number and email work. Call yourself from another phone to be sure.", "Anything you claim, such as a certificate, can be shown if asked.", "The resume is your latest version. Keep a copy of exactly what you sent each employer, because you might have tailored it."),
    P("If you want a clean starting point, build your resume with the [free tools on this site](/templates), then print it. The [ATS checker](/features/ats-checker) also shows you what a reading program can and cannot extract from your file, which is useful before you hit send."),
    H("Practise out loud"),
    P("Reading in your head is not the same as speaking. Ask a friend or family member to pick any line from your resume and ask “Tell me about this”. Do it ten times. You will notice which lines you explain well and which make you stumble. Fix the stumbling ones with more practice or by changing the resume. Record yourself on your phone and listen once. Everyone dislikes their own voice, but it is the fastest way to catch “um”, “like” and very long answers."),
    ...task("Print your resume. Next to each project and skill, write the three-part story or the one-line proof.", "Ask a friend to question you on three random lines for five minutes each. Note any line you struggled with.", "Remove or fix any claim you could not support."),
    ...check("Every project has a problem, your part and a result written in your own words.", "You can talk about each project for one minute without reading.", "There is nothing on your resume that you would be embarrassed to be asked about."),
  ], A('Every line can become a question', [
    n('line', 'Resume line', 'project, skill, job', 0, 0, 'data'), n('story', 'Your short story', 'problem, part, result', 1, 0, 'user'),
    n('ask', 'Interviewer asks', 'tell me more', 2, 0, 'app'), n('trust', 'Trust', 'clear honest answer', 3, 0, 'out'),
  ], [
    { say: 'Every line on your resume is something the interviewer may ask about.', on: ['line'] },
    { say: 'For each line, you prepare a short true story: the problem, your part and the result.', flow: ['line>story:prepare'] },
    { say: 'The interviewer picks a line and asks you to tell more, or asks a follow-up question.', flow: ['story>ask:question'] },
    { say: 'A clear, honest answer builds trust. A claim you cannot explain loses it quickly.', flow: ['ask>trust:honest answer'] },
  ]), [
    faq('What if I have no projects or internships?', 'Use coursework, volunteering, family business help, part-time work, or a small project you do on your own. The lesson on having no experience shows how to talk about these honestly.'),
    faq('Should I remove skills I only know a little?', 'You can keep them if you mark the level honestly, such as basic, and you can explain what you have done with them. Remove anything you could not discuss for two minutes.'),
  ]),

  // ---------------------------------------------------------------- 4
  les(S2, 'tell-me-about-yourself-answer', 'Tell Me About Yourself: A Simple Answer That Works', 'Tell Me About Yourself: Fresher Answer',
    'Build a 60-second answer to the most common opening question using a clear structure: who you are, what you can do, and why this job. Made-up samples included.', [
    P("“Tell me about yourself.” Almost every interview begins with it. It sounds friendly and open, which is exactly why candidates ramble, start from childhood or read their resume aloud. The interviewer is not asking for your life story. They want to know in about a minute: Who are you now? What can you do? Why are you here? A simple structure answers all three."),
    P("There is also a longer [guide on this question](/blog/tell-me-about-yourself-interview-answer) on this site. This lesson gives the practical method and lets you build and practise your own answer."),
    H("The three-part structure: Present, Past, Future"),
    O("**Present.** Who are you right now? Your current studies or job, and what you are focused on.", "**Past.** The two or three most relevant things you have done, such as projects, internships or skills, that connect to this role.", "**Future.** Why you want this job and what you hope to do or learn there."),
    P("Keep it to about 60 to 90 seconds, which is roughly 150 to 200 words. A good answer ends with a clear link to the role, so the interviewer can ask their next question easily."),
    H("A made-up sample for a college graduate"),
    P("The names and facts below are invented, to show the shape. Use your own true details."),
    C('text', `"I'm Anjali, and I've just finished my B.Com at a college in Pune.
I enjoyed accounting and spreadsheets most. During my final year I
helped my uncle's hardware shop keep its monthly sales records in
Excel, which cut the time he spent on it each week. I also finished
a short online course in Tally basics. I'm looking for my first
role in accounts, and your junior accounts assistant job interested
me because it involves invoices and reconciliation, which are the
parts I enjoy. I want to learn how a larger team handles them."`),
    P("Notice what this does. In the present, Anjali is a recent graduate. In the past, one concrete experience and one skill. In the future, she names the role and what she wants to learn. It has no exaggeration, and each sentence invites a follow-up question: “How did you set up the records?”"),
    H("A made-up sample for a school leaver or skilled trade applicant"),
    C('text', `"My name is Samuel. I finished secondary school last year and
since then I've been helping my cousin, who is an electrician. I
can wire a room, fit sockets and switches, and I've learned to read
a simple circuit diagram. I have a safe working record and I'm
learning for my trade certificate. I'm applying here because you
are hiring a trainee electrician and I want to learn from a
company that does bigger installations."`),
    P("Simple words, true facts, and a clear reason. Interviewers for practical roles care about reliability, safety and willingness to learn. This answer says all three without bragging."),
    H("What to include, what to leave out"),
    L("**Include** facts that match the job: skills, studies, experience, an achievement.", "**Include** one personal touch if it is natural and relevant, such as a hobby that shows teamwork or discipline. One line is enough.", "**Leave out** your full life story, your age and family details, and anything that is not connected to the job.", "**Leave out** negative comments about people or places.", "**Leave out** things you cannot discuss in more detail if asked."),
    H("Common mistakes"),
    L("Starting with “My name is...” and then reading your resume in order. The interviewer has already read it.", "Being too long. After two minutes, people stop listening.", "Being too short: “I am a hard-working fresher.” That gives them nothing to work with.", "Using the same answer for every job without changing the last part.", "Memorising word for word. It sounds stiff and you panic if you forget a line. Memorise the three parts and a few key facts instead."),
    H("How to build your own answer"),
    O("Write the present in one sentence: who you are and what you are doing now.", "Choose two things from the past that fit this job. Write one sentence each, with a real detail.", "Write the future in one or two sentences: why this role and what you want to learn.", "Read it aloud and time it. Cut to 60 to 90 seconds.", "Practise with three versions of the ending for three different jobs."),
    P("For example, a template you can fill in:"),
    C('text', `"I'm [name]. I [studied / worked / trained] in [subject or field]
and I'm currently [what you do now].
Recently I [one concrete thing you did] and I [second thing / skill].
I'm interested in this [role] because [one honest reason linked to
the job], and I'd like to [what you want to learn or contribute]."`),
    H("Special cases"),
    L("**Career gap.** Mention it briefly in the past part if it matters, with what you did or learned, then move on. The lesson on gaps and having no experience gives wording.", "**Career change.** In the past part, explain the skills you bring from your earlier work, and say why you chose this new direction.", "**Nervous?** Slow down and breathe before you start. A calm first sentence sets the tone for the whole interview.", "**Online interview.** Look at the camera, and keep your notes out of view, with a few key words only."),
    ...task("Write your own present, past and future answer using the template and keep it under 200 words.", "Say it aloud while timing yourself. Aim for 60 to 90 seconds.", "Change only the last sentence for two different jobs.", "Say it to one person and ask: What would you ask me next?"),
    ...check("The answer takes 60 to 90 seconds and contains no untrue claims.", "Each part has at least one concrete detail.", "Your listener could name your main strength afterwards."),
  ], A('Present, past, future', [
    n('pres', 'Present', 'who you are now', 0, 0, 'user'), n('past', 'Past', '2 relevant things', 1, 0, 'data'),
    n('fut', 'Future', 'why this job', 2, 0, 'app'), n('next', 'Next question', 'they pick a detail', 3, 0, 'out'),
  ], [
    { say: 'Start with the present: who you are and what you are doing now, in one sentence.', on: ['pres'] },
    { say: 'Move to the past: two real things that fit this job, with one concrete detail each.', flow: ['pres>past:then'] },
    { say: 'Finish with the future: why this role, and what you want to learn there.', flow: ['past>fut:then'] },
    { say: 'In about 60 to 90 seconds you have given the interviewer an easy next question.', flow: ['fut>next:invites a question'] },
  ]), [
    faq('How long should my answer to tell me about yourself be?', 'About 60 to 90 seconds, or roughly 150 to 200 words. Long enough to give facts, short enough to keep attention.'),
    faq('Should I mention my family or hobbies?', 'Keep the focus on the job. One short, natural line about a hobby that shows a useful quality is fine. Leave out family details unless they are directly relevant.'),
  ]),

  // ---------------------------------------------------------------- 5
  les(S2, 'strengths-and-weaknesses-answers', 'Strengths and Weaknesses: Honest Answers Without Cliches', 'Strengths and Weaknesses Interview Answers',
    'Answer the strengths and weaknesses questions with real examples and honest, safe weaknesses. Learn what to avoid and how to show progress.', [
    P("Two questions come up in a huge number of interviews: “What are your strengths?” and “What is your biggest weakness?”. They seem simple, but they are easy to answer badly. Candidates say “I am hard-working and a perfectionist” and everyone in the room has heard it a hundred times. This lesson shows a better way: choose honestly, use a small example, and show how you work on it."),
    H("Strengths: say it, then prove it"),
    P("A strength is only believable with evidence. A claim alone (“I am a good team player”) is weak. A claim with a short example is strong. Use this pattern: **the strength, a short example, why it matters for this job**."),
    C('text', `Weak:   "I am very hard-working and a quick learner."

Better: "I learn new tools quickly. In my final year I had two weeks
        to learn basic SQL for a project, and I finished with a
        working report. In this role you'll use new software often,
        so I think that will help."`),
    P("How do you choose which strengths to talk about? Look at your prep sheet from lesson 2. Pick two or three strengths that match the job's top requirements and that you can support with real examples."),
    H("Ideas for fresher strengths"),
    P("Pick what is true for you. Here are some real strengths that employers value, with the kind of evidence you can give."),
    L("**Learning fast.** You picked up a tool, language or process in a short time. Say what and how long.", "**Reliability.** You never missed a shift or deadline in a job or project. Say for how long.", "**Teamwork.** You worked with others and helped finish a group project. Say what your role was.", "**Communication.** You explained things to customers, classmates or younger students.", "**Attention to detail.** You found mistakes in a report, a count or a design before they caused problems.", "**Problem solving.** You faced a problem and worked out a way through it.", "**Responsibility.** You looked after a shop, a younger sibling or a group's money. Real life counts."),
    H("Weaknesses: be honest, be safe, show progress"),
    P("Interviewers do not ask this to catch you out. They want to know whether you know yourself, whether you can be honest, and whether you work on improving. A good weakness answer has three parts: **a real, small weakness, what you do about it, and the progress you have seen**."),
    C('text', `"I used to get nervous speaking in front of groups and avoided it.
I knew that would hold me back, so in college I volunteered to present
in two classes. It's still not my favourite thing, but I now prepare
a short outline and practise once aloud, and my last presentation
went well. I'm still working on it."`),
    P("This answer is honest (it names a real weakness), safe (public speaking is not a core requirement for most entry-level roles) and shows action and progress. It also sounds like a real person."),
    H("Choose a safe weakness"),
    P("A safe weakness is real, is not essential to the job, and can be improved. Examples: nervousness when speaking, being new to a particular tool, taking on too much and having to learn to prioritise, finding it hard to say no to extra requests, or finding it hard to ask for help at first."),
    P("Avoid these."),
    L("**Cliches.** “I'm a perfectionist” or “I work too hard”. They sound like a trick and interviewers dislike them.", "**Weaknesses that hurt the role.** Saying you are always late when applying to a job that needs punctuality, or that you cannot work in a team for a team role.", "**Blaming others.** “My weakness is that other people are lazy.”", "**Saying you have none.** Everyone has areas to improve."),
    H("Say what you do about it"),
    P("The most important part is what you do. Name a specific habit, tool or action. “I use a to-do list and check it twice a day” beats “I am working on it”. If you have only started, say so: “I am only beginning, but I have started...”."),
    H("Related questions"),
    L("**“What is your biggest achievement?”** Use the same pattern as strengths: the situation, what you did, the result. It does not need to be big. A fresher's real achievement can be finishing a hard course, a project or helping a team win a college event.", "**“How would your friends or teachers describe you?”** Choose a quality and add a short example. Use words that someone would really say about you.", "**“What do you do when you do not know something?”** Honest answer: you try to find out first (documentation, notes, searching), then you ask a colleague, and you note it down for next time."),
    H("Practise the delivery"),
    P("Say your answers aloud. Keep strengths to one or two sentences plus an example. Keep the weakness answer to about thirty seconds. Smile naturally and speak at a normal pace. If an interviewer follows up (“And how is that going?”), give a short true update. You will sound confident because you are being honest."),
    N("If you cannot think of examples, ask a friend, a teacher or a family member: “When have you seen me do something well?” You may be surprised by what they remember."),
    ...task("Choose two strengths from your prep sheet and write one real example for each, using the strength-example-relevance pattern.", "Choose one safe weakness and write the three parts: the weakness, what you do, the progress.", "Write one answer to “What is your biggest achievement?”."),
    ...check("Each strength has a small true example attached.", "Your weakness is real, not a cliche, and you can describe one action you have taken.", "You can say each answer aloud in under a minute."),
  ], A('A believable strength answer', [
    n('claim', 'Strength', 'quick learner', 0, 0, 'user'), n('proof', 'Short example', 'what you really did', 1, 0, 'data'),
    n('why', 'Why it matters', 'for this job', 2, 0, 'check'), n('trust', 'Believable', 'specific, not a cliche', 3, 0, 'out'),
  ], [
    { say: 'Name one real strength that fits the job, such as learning new tools quickly.', on: ['claim'] },
    { say: 'Back it with a short example: what you did, in what time and with what result.', flow: ['claim>proof:example'] },
    { say: 'Link it to the job so the interviewer sees why it helps them.', flow: ['proof>why:link'] },
    { say: 'An answer with proof sounds believable. A list of adjectives does not.', flow: ['why>trust:believable'] },
  ]), [
    faq('What is a good weakness to say in an interview?', 'Choose a real weakness that is not essential to the job, such as nervousness speaking to groups or being new to a tool, and explain what you are doing to improve it.'),
    faq('Is it bad to say I am a perfectionist?', 'It is a cliche that most interviewers have heard many times and often find unconvincing. A specific, honest weakness with an action plan is more credible.'),
  ]),
];
