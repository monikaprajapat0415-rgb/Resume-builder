import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S2 = 'Common Questions';
const S3 = 'Tests and Technical Rounds';

export const lessons = [
  // ---------------------------------------------------------------- 6
  les(S2, 'why-this-company-why-hire-you', 'Why Do You Want This Job? Why Should We Hire You?', 'Why This Job? Why Should We Hire You?',
    'Answer the two big motivation questions with honest, specific reasons. Learn to link your skills to the employer needs without bragging.', [
    P("After the opening, interviewers usually test your motivation with two questions: “Why do you want to work here?” and “Why should we hire you?”. They are the same question from two sides. The first asks what draws you to the company. The second asks what you bring to it. Both are chances to show that you did your homework (lesson 2) and that you understand what the employer needs."),
    H("Why do you want to work here?"),
    P("A weak answer talks only about you: “I need a job” or “It is a big company with a good salary”. These may be true, but they give the employer no reason to choose you. A strong answer has two parts: something real about the company or the role, and how it matches something you care about or want to learn."),
    C('text', `Weak:   "I want a job in IT and your company is well known."

Better: "I've followed your work on school management software. I did
        a small project for my college's attendance, so I can see
        how much time good software saves teachers. I'd like to
        learn how a professional team builds that kind of product."`),
    P("The better answer shows a real link (the attendance project), real interest (school software) and a learning goal (how a team builds it). The reasons are honest. They do not need to be dramatic."),
    H("Where do honest reasons come from?"),
    L("**The work itself.** The tasks in the advert match what you enjoy or are good at.", "**What you can learn.** Training, tools, mentors or kinds of customers you want to meet.", "**The company's product or mission.** Something real that you noticed in your research.", "**Location and practical fit.** Distance, shifts or hours that you can sustain. This is a valid reason when stated politely and not as the only one.", "**Growth.** A path from trainee to a more senior role, if the company has described one."),
    P("It is fine to also need the income. You do not have to hide that you need a job. Just do not make it the only reason. Pair it with a reason that is about the work."),
    H("Why should we hire you?"),
    P("This question can feel like asking you to boast. Think of it as a short summary: **what the job needs, what you have, and the proof**. You are connecting your best two or three matches from the prep sheet to the employer's top needs."),
    C('text', `"From your advert I understand you need someone who can handle
customer calls calmly and keep accurate records. I worked weekends
at a phone shop for a year, where I handled returns and complaints
and kept the daily sales sheet, which my manager checked and found
correct. I'm also quick to learn new software. I think that
combination would help me do well in this role quickly."`),
    P("Notice that it does not compare you to other candidates, and it does not claim you are the best. You cannot know who else applied. Say what you offer and why it fits."),
    H("A simple formula"),
    O("**Need.** Say what you understand the job requires.", "**Match.** Tell the interviewer two things you have that fit.", "**Proof.** Give one short real example.", "**Close.** One sentence about how this would help the team."),
    H("Related questions you may meet"),
    L("**“What do you know about our company?”** Use the five lines from your research. Mention what they do, who they serve and one recent fact.", "**“Where do you see yourself in five years?”** Interviewers want to see ambition that fits the role. An honest answer sounds like: “I would like to have grown into a confident member of the team, taking on more responsibility, and learning skills such as ... ”. Avoid naming a job at the company that is far above the role. Avoid saying that you will probably leave.", "**“Why did you choose this career or course?”** Tell the true story in a few sentences: what interested you, what you did to find out more, what you enjoy.", "**“What other jobs are you applying for?”** You can say you are looking at similar roles in the same field, without naming other companies. Be honest, and say this role is a strong interest."),
    H("Avoid these answers"),
    L("Answers that could be said about any company. If you could swap the company's name and the answer still works, it is too general.", "Saying money is the main reason. You may be paid for your work, but employers prefer people who care about the job as well.", "Criticising a previous employer, college or teacher.", "Over-flattery. “It is the best company in the world” sounds fake. Be specific and sincere instead."),
    N("If you honestly do not know much about the company, say so in a positive way: “I have only had a few days to learn about you, but what I have found is X. I would like to learn more.” Then ask a good question. Honest curiosity works better than pretending."),
    ...task("Write your answer to “Why do you want to work here?” for one real company, using one fact from your research and one reason that is about you.", "Write your answer to “Why should we hire you?” using the need, match, proof and close pattern.", "Write an honest, short answer to “Where do you see yourself in five years?”."),
    ...check("Your answers mention something specific that could not be said about every company.", "Your hire-you answer has one real example and does not compare you with other people.", "None of your answers criticises anyone."),
  ], A('Need, match, proof', [
    n('need', 'Their need', 'from the advert', 0, 0, 'data'), n('match', 'Your match', 'two real strengths', 1, 0, 'user'),
    n('proof', 'Proof', 'one short example', 2, 0, 'check'), n('close', 'Close', 'how it helps the team', 3, 0, 'out'),
  ], [
    { say: 'Start with what the job needs, using the words from the advert.', on: ['need'] },
    { say: 'Say two things you have that match that need.', flow: ['need>match:match it'] },
    { say: 'Give one short, true example as proof.', flow: ['match>proof:show it'] },
    { say: 'Finish with one sentence on how this would help the team.', flow: ['proof>close:finish'] },
  ]), [
    faq('Is it wrong to say I need the job?', 'No. Many people need income. Just do not make it your only reason. Add something specific about the work, the company or what you want to learn.'),
    faq('How do I answer where I see myself in five years?', 'Describe growth that fits the role, such as becoming confident, taking on more responsibility and learning specific skills. Avoid naming a far higher job or saying you plan to leave.'),
  ]),

  // ---------------------------------------------------------------- 7
  les(S2, 'behavioural-questions-star-method', 'Behavioural Questions and the STAR Method', 'Behavioural Interview Questions: STAR',
    'Answer questions that start with "Tell me about a time when..." using the STAR method. Includes made-up samples, example questions and fresher-friendly stories.', [
    P("“Tell me about a time when you worked in a team.” “Describe a situation where you handled a difficult customer.” These are **behavioural questions**, and they are standard in many UK and Canadian interviews and increasingly in India and across Africa. The idea is simple: past behaviour is a good guide to future behaviour. So instead of asking what you would do, the interviewer asks what you did."),
    P("Freshers often say: “I have no work experience, so I have nothing to say.” This is not true. You have stories from college, projects, sports, volunteering, family work and part-time jobs. This lesson shows you how to find them and tell them clearly with the STAR method."),
    H("What is STAR?"),
    P("STAR is a way to organise a story in four short parts."),
    L("**S: Situation.** Set the scene in one or two sentences. Where were you, and what was happening?", "**T: Task.** What was your job or the problem to solve?", "**A: Action.** What did you do? This is the longest part. Use “I”, and say what you personally did and why.", "**R: Result.** What happened? Add what you learned. If you can, say what you would do differently."),
    P("A good STAR answer takes one to two minutes. The most common mistake is spending too long on the situation and too little on the action and result."),
    H("A made-up sample: teamwork"),
    P("Question: “Tell me about a time you worked in a team.” The story below is invented to show the shape."),
    C('text', `S: "In my final year, four of us had to build a mini-project for our
   database course. One teammate stopped replying a week before the
   deadline."
T: "I was the group's coordinator, so I had to make sure we still
   delivered."
A: "I messaged him and he said he was struggling with a family issue.
   I asked what part he could still do, and he agreed to write the test
   cases. I took over his coding part and split the rest between the two
   others. I also set up a shared checklist so we could all see what was
   left."
R: "We submitted on time and got a good grade. I learned that asking
   what someone can do works better than blaming, and I now check in
   with the team earlier."`),
    P("The story is honest, ordinary and specific. There is no hero speech. Notice the action: it shows communication, kindness and organisation, qualities teams like."),
    H("Another made-up sample: a difficult customer"),
    C('text', `S: "I worked weekends at a mobile accessories shop. One Saturday a
   customer came back angry because a charger had stopped working."
T: "I had to help him without a long argument, and follow the shop's
   return rule."
A: "I listened without interrupting, apologised that it hadn't worked,
   checked the receipt and the warranty, and offered a replacement as
   the rule allowed. I explained how to check the cable too."
R: "He thanked me and bought a case. My manager said the way I handled
   it was good. I learned to stay calm and let people finish talking."`),
    H("Common behavioural questions for freshers"),
    L("Tell me about a time you worked in a team.", "Describe a time you had a disagreement with someone. What happened?", "Tell me about a time you made a mistake. What did you do?", "Give an example of a time you had to learn something quickly.", "Tell me about a time you met a tight deadline.", "Describe a time you helped someone.", "Tell me about a time you took the lead.", "Describe a goal you set and how you reached it.", "Tell me about a time you handled pressure or a lot of tasks at once."),
    H("Build a story bank"),
    P("You do not need a new story for each question. Prepare five to seven good stories, and a story can answer several questions if you shift the emphasis. A group project story can answer teamwork, leadership, conflict and deadline questions."),
    O("List ten moments from college, work, volunteering, sports, hobbies or family life where something happened and you did something. Include moments that did not go well.", "Choose the five to seven that show your qualities best and that you can explain in detail.", "Write each as a short STAR outline of four lines.", "Beside each, write which questions it could answer.", "Practise telling each in under two minutes."),
    H("Stories about mistakes and failures"),
    P("Interviewers ask about mistakes because they want to see honesty, responsibility and learning. A good answer: you own the mistake, you fix it, you learn. A bad answer: you blame others, or pretend you never made one. Pick a mistake that is real but not serious, and make the Result part about what you changed."),
    H("Tips for telling the story"),
    L("Say what **you** did. Even in a team story, interviewers need to know your contribution.", "Keep names out. Say “a teammate” instead of using real names, to be polite.", "Avoid exaggeration. A small, true story is better than a huge claim.", "Finish with what you learned. It shows you grow from experience.", "It is fine to pause and think. “That is a good question. Let me think of an example” is a natural thing to say."),
    N("In some countries, including the UK and Canada, interviewers may score your answer against a fixed checklist, so being specific and complete matters. In other places, the interview is more of a conversation. The STAR method works well in both."),
    ...task("Write six moments in your life where you did something useful. Choose four and write them as short STAR outlines.", "Practise one aloud and time it. Cut it to under two minutes.", "Write one honest mistake story with a clear lesson.", "Match each story to at least two questions from the list."),
    ...check("Each story has all four parts, and the Action part is the longest.", "You used “I” for your own actions.", "You have at least five stories ready."),
  ], A('The four parts of STAR', [
    n('s', 'Situation', 'set the scene', 0, 0, 'data'), n('t', 'Task', 'your job or problem', 1, 0, 'check'),
    n('a', 'Action', 'what you did', 2, 0, 'user'), n('r', 'Result', 'outcome and lesson', 3, 0, 'out'),
  ], [
    { say: 'Situation: set the scene in one or two sentences, where and when.', on: ['s'] },
    { say: 'Task: say what your job or problem was in that situation.', flow: ['s>t:then'] },
    { say: 'Action: explain what you personally did and why. This is the longest part.', flow: ['t>a:then'] },
    { say: 'Result: what happened, what you learned, and what you would change.', flow: ['a>r:then'] },
  ]), [
    faq('What if I have no work experience for STAR stories?', 'Use college projects, group work, sports, volunteering, part-time jobs and family responsibilities. Interviewers expect freshers to use these.'),
    faq('How long should a STAR answer be?', 'About one to two minutes. Spend most of the time on the Action and the Result.'),
  ]),

  // ---------------------------------------------------------------- 8
  les(S2, 'no-experience-gaps-career-change-questions', 'No Experience, a Gap or a Career Change: Honest Answers', 'No Experience, Gaps, Career Change Answers',
    'How to answer the hard questions: "You have no experience", "Why is there a gap?", "Why change careers?", low marks and a failed subject.', [
    P("Almost everyone has something they worry the interviewer will ask about. You may have no work experience. You may have taken a break for health, family, money or because you could not find a job. Maybe your marks were low in one year. Maybe you are changing careers. The good news is that these are normal, interviewers have heard them before, and the way you answer matters more than the fact itself."),
    P("This lesson gives you a calm approach and sample wording for each. The samples are made up to show the shape, so use your own true facts. Never invent an explanation."),
    H("The calm formula for any hard question"),
    O("**Acknowledge it simply.** Do not argue or get defensive. “Yes, that is right.”", "**Give a short, honest reason.** One or two sentences. You do not owe more private detail than you want to share.", "**Show what you did meanwhile.** Learning, working, caring, building.", "**Return to the present and the job.** End by connecting to why you are ready now."),
    P("Practise saying it aloud, because the tone matters as much as the words. Aim for calm and matter-of-fact."),
    H("“You have no experience”"),
    P("This is the most common challenge for freshers. Do not apologise. Instead, say what you do have: learning, projects, relevant practice, and enthusiasm to learn."),
    C('text', `"That's true, I haven't had a full-time job in this field yet. What I
do have is two projects and a course in it, and I helped my family's
shop with its accounts for two years. I learn quickly and I'm
looking for a place to build real experience, and your trainee
programme looked like a good place to do that."`),
    P("Practical ideas to build evidence before the interview: do a small project, volunteer for a local organisation, take a short course and finish it, help a small business with a real task, or contribute to a group effort. Even one or two real things change the conversation."),
    P("There is a full guide for resumes with no experience on this site, called [fresher resume with no experience](/blog/fresher-resume-no-experience), which helps you present these things on paper as well."),
    H("An employment gap"),
    P("A gap is time between jobs or studies. Employers see gaps for many reasons. Health, family care, moving, a business that closed, searching for work, or study. They are mainly worried about two things: Are you reliable? Are your skills still current? Answer both."),
    C('text', `"After my diploma I took about a year out to look after my
father while he recovered from surgery. During that time I kept my
skills fresh by taking an online bookkeeping course and doing
the accounts for a neighbour's shop. He's recovered well, and I'm
ready to work full time."`),
    L("State the reason briefly. You do not have to share medical or family details.", "Say what you did to stay active or learn, if anything. If you did nothing formal, caring for someone or searching for work is real work, and you can say so.", "Say you are ready now, and give your availability.", "Do not lie about dates to hide a gap. Dates are easy to check."),
    P("More ideas are in our guide to [explaining an employment gap](/blog/how-to-explain-employment-gap-on-resume)."),
    H("A career change"),
    P("Interviewers will ask: why leave a field where you have experience? Show that your move is a thought-out decision and that your old skills carry over."),
    C('text', `"I worked for three years in retail, mainly in customer service and
stock control. I became interested in data when I started tracking
our sales on a spreadsheet. I've since done an Excel and SQL course
and a small analysis project. The customer knowledge and attention
to accuracy from retail fits this analyst role, and I'm ready to
start on a junior level."`),
    L("Name the old skills that carry over, such as customer care, accuracy, planning and teamwork.", "Show steps you took to learn the new field.", "Be ready to accept a more junior start. Saying you understand this shows realism."),
    P("See also our [career change guide](/blog/career-change-resume-guide)."),
    H("Low marks or a failed subject"),
    P("Do not blame teachers or bad luck. Say what happened simply, what you did, and what changed."),
    C('text', `"I did poorly in my second year because I was working part-time
and not managing my time well. I failed one subject and passed it on
the retake. After that I made a weekly plan, and my marks in the
final year were much better."`),
    P("Interviewers like to see that you learn from setbacks. If you have more recent results or projects that show your ability, point to them."),
    H("Being asked something you cannot answer"),
    P("Sometimes you simply do not know the answer. It is normal. Stay calm and say so honestly: “I haven't come across that. Here is how I would find out ...”. Then describe your approach: who you would ask, what you would read, what you would test. Interviewers are often more interested in how you think than in a memorised fact."),
    H("Questions you may be asked that are not appropriate"),
    P("Some interviewers ask about age, marriage, children, religion, health or family plans. In many countries, including the UK and Canada, these should not influence hiring, and asking can be against the law. In others, it is common for personal questions to be asked. You have choices. You can answer briefly and move on. You can politely redirect: “I'm happy to talk about my availability and how I would manage the job.” Or you can decline to answer. Choose what feels right and safe for you."),
    N("If you feel you are being treated unfairly, remember that you can leave an interview, and that you can report serious concerns to the relevant authority in your country. You do not have to accept disrespect to get a job."),
    ...task("Write short honest answers for the questions that worry you most from the list above.", "Check each answer for the four parts: acknowledge, short reason, what you did meanwhile, return to the present.", "Say each aloud until it sounds calm. Time it. Each should be under 45 seconds."),
    ...check("Your answers are true and use no invented reasons.", "None of them blames anyone else.", "Each ends by returning to why you are ready now."),
  ], A('Answer a hard question calmly', [
    n('q', 'Hard question', 'gap, no experience', 0, 0, 'data'), n('ack', 'Acknowledge', 'short and calm', 1, 0, 'user'),
    n('did', 'What you did', 'learned, worked, cared', 2, 0, 'tool'), n('now', 'Ready now', 'back to the job', 3, 0, 'out'),
  ], [
    { say: 'A hard question comes up, such as a gap or no experience. Stay calm.', on: ['q'] },
    { say: 'Acknowledge it simply and give a short, honest reason.', flow: ['q>ack:answer'] },
    { say: 'Say what you did in that time, such as learning, work or caring for someone.', flow: ['ack>did:then'] },
    { say: 'Return to the present: you are ready now and here is why you fit the job.', flow: ['did>now:finish'] },
  ]), [
    faq('Should I hide a gap on my resume?', 'Do not falsify dates. Be brief and honest, and say what you did in that time. Many employers care more about whether your skills are current than about the gap itself.'),
    faq('How do I answer a personal question I think is inappropriate?', 'You can answer briefly, politely steer back to your skills and availability, or decline to answer. Choose what feels right to you.'),
  ]),

  // ---------------------------------------------------------------- 9
  les(S3, 'aptitude-and-written-tests', 'Aptitude and Written Tests: How to Prepare', 'Aptitude Tests: How to Prepare',
    'Prepare for numerical, verbal and logical tests with a simple weekly plan, timing habits and calm test-day tactics. No tricks, just practice.', [
    P("Many large employers, campus drives and graduate schemes start with a written or online test. You may see it called an aptitude test, a screening test, a psychometric test or an online assessment. The reason is simple: when thousands of people apply, a test is a fast, fair-looking way to reduce the list. This lesson tells you what these tests usually contain and how to prepare in a sensible way."),
    P("A note first. Do not pay anyone who promises you a pass or sells leaked papers. They are scams or cheating, and the second can end your career before it starts. Real preparation is free or cheap and takes steady practice."),
    H("What is usually tested"),
    L("**Numerical ability.** Percentages, ratios, averages, simple interest, profit and loss, time and work, reading tables and charts.", "**Verbal ability.** Reading short passages and answering questions, grammar, synonyms and antonyms, sentence correction, filling gaps.", "**Logical reasoning.** Number and letter series, patterns, coding and decoding, puzzles, seating arrangements, statements and conclusions.", "**Subject or technical questions.** Basics of your degree or the job, such as accounting, programming, engineering or computer basics.", "**Situational judgement.** Short workplace situations where you choose the best response, used often by UK employers.", "**Typing or computer skills tests** for office roles, and **trade or practical tests** for skilled jobs."),
    P("The test described in the job advert or invitation is the one that matters. Look for the name of the test provider and the topics. If the message does not say, ask the recruiter politely what to expect."),
    H("Know the format"),
    P("Before you study, learn how the test works."),
    L("How many questions and how long? This tells you the time per question.", "Is there negative marking, meaning points lost for wrong answers? If so, guessing carefully matters.", "Can you go back to earlier questions, or is it one question at a time?", "Is it on a computer or paper? A calculator allowed or not?", "Is there a section cut-off, meaning a minimum score in each section?"),
    P("Time per question is the key number. A test with 30 questions in 30 minutes gives you about a minute each. Some questions take 20 seconds, so you can spend longer on harder ones, but you must learn to leave a question and move on."),
    H("A four-week plan"),
    P("A little each day beats a long study night. About 45 minutes a day is a good rhythm."),
    O("**Week 1: Basics.** Revisit the school-level topics: percentages, fractions, ratios and averages. Revise grammar rules. Take one short test to see where you are.", "**Week 2: Topic practice.** Spend two days on each topic, with untimed practice at first, then timed sets of ten questions. Keep a notebook of mistakes.", "**Week 3: Speed.** Do mixed timed sets. Learn shortcuts that you understand, not ones you memorise without meaning.", "**Week 4: Full mock tests.** Take full-length timed tests, at the real time of day if possible. Review every wrong answer."),
    H("Habits that raise your score"),
    L("**Keep an error log.** Write every mistake and why it happened: a calculation slip, not reading carefully, not knowing the method. Review the log each weekend.", "**Learn to estimate.** In a numbers question, rounding to nearby values often shows which option is right.", "**Read the question twice.** Many wrong answers come from missing the word “not” or the units.", "**Skip and return.** If a question takes too long, mark it and move on. Easy marks wait later in the paper.", "**Practise mental maths.** Times tables up to 20 and common fractions as percentages (one eighth is 12.5 per cent) save time.", "**Read English daily.** A newspaper article or a news website for 15 minutes a day builds speed for verbal passages."),
    H("Good practice sources"),
    P("Use free and low-cost resources and avoid paying large amounts. Past-paper style questions from your college, reputable free practice websites, school textbooks for the maths basics, and free mock tests offered by many employers and test providers themselves, which show you the real interface. Practise on the kind of device you will use."),
    H("Test-day tactics"),
    O("Sleep and eat before the test. A tired brain makes silly mistakes.", "Arrive early, or log in early for online tests, and check your internet and device.", "Bring what is needed: ID, pens, a calculator if allowed, and a watch.", "Read the instructions fully before starting the timer.", "Do the questions you know first. Keep an eye on the clock.", "If there is negative marking, only guess when you can remove at least one or two options.", "In the last minutes, check that every question has an answer, unless guessing costs marks."),
    P("If you feel a panic wave, close your eyes for five seconds, breathe out slowly, and restart with the next question. One bad question does not decide your result."),
    H("Typing and computer skills tests"),
    P("Office roles may test typing speed and accuracy and basic Word and Excel tasks. Practise typing with free tools for ten minutes a day. Focus on accuracy first, then speed. Learn basic Excel tasks such as sum, sort and filter. Our [Excel for jobs course](/learn/excel-for-jobs-course) on this site is a good place to start."),
    H("Practical and trade tests"),
    P("For skilled trades, the test may be practical: wiring a board, welding a joint, using a machine or reading a drawing. Safety comes first in these tests. Show that you check safety, use tools correctly and keep the work area tidy. Ask if you do not understand an instruction. Doing it slowly and safely beats doing it fast and unsafe."),
    N("If you do not pass a test, you can try again with other employers, and you will already know the format. Many successful candidates failed several tests first. Review your error log and keep going."),
    ...task("Choose the next test you expect to take. Find out the format: number of questions, time, negative marking.", "Make a four-week plan with 45 minutes a day. Write the days and topics on a calendar.", "Start an error log in a notebook. Add every mistake from your first practice set.", "Take one timed practice set and calculate the time per question."),
    ...check("You know the time per question for your test.", "Your error log has at least ten entries with a reason for each.", "You have booked time each day for practice."),
  ], A('Practise, review, repeat', [
    n('fmt', 'Know the format', 'time, marking', 0, 0, 'data'), n('prac', 'Timed practice', 'daily sets', 1, 0, 'user'),
    n('log', 'Error log', 'why you were wrong', 2, 0, 'check'), n('mock', 'Full mock test', 'review every mistake', 3, 0, 'out'),
  ], [
    { say: 'First learn the format: the number of questions, the time and whether wrong answers lose marks.', on: ['fmt'] },
    { say: 'Practise a little each day with timed sets of questions.', flow: ['fmt>prac:plan'] },
    { say: 'Write each mistake and its reason in an error log, and review the log each week.', flow: ['prac>log:mistakes'] },
    { say: 'Finish with full timed mock tests, and review every wrong answer.', flow: ['log>mock:improve'] },
  ]), [
    faq('How long should I prepare for an aptitude test?', 'About four weeks at 45 minutes a day suits many people. Start earlier if the basics such as percentages and grammar feel weak.'),
    faq('Is it worth paying for leaked papers or a guaranteed pass?', 'No. These are usually scams, and using leaked papers is cheating. Real preparation uses free or low-cost practice and steady review.'),
  ]),

  // ---------------------------------------------------------------- 10
  les(S3, 'technical-round-preparation', 'The Technical Round: Basics, Projects and Thinking Aloud', 'Technical Interview Round: How to Prepare',
    'Prepare for the technical interview as a fresher: know the basics, explain your projects, think aloud and handle questions you cannot answer.', [
    P("The technical round is where an interviewer checks that you can do the work, or learn it. It could be about programming, accounting, electrical wiring, customer support tools, design, laboratory methods or machine operation. The subject changes. The pattern stays the same: they test your basics, your projects and the way you think. Freshers are not expected to know everything. They are expected to know the basics well and to be honest and curious."),
    H("What interviewers look for in a fresher"),
    L("**Strong basics.** Not tricks. The core ideas from your degree or training, explained clearly.", "**Your own work.** Evidence that you have used what you learned: projects, practicals, a workshop, a lab.", "**Clear thinking.** How you approach a problem, even if you do not reach the answer.", "**Honesty.** Saying “I don't know” and then reasoning, instead of guessing wildly.", "**Willingness to learn.** Interest in the field outside class, such as reading, tools you tried, small experiments."),
    H("Prepare the basics properly"),
    P("Go back to the main topics of your subject and the job advert. For each topic, you should be able to explain it simply, give an example, and say where it is used. Explaining to a friend or a younger student is a strong test. If you cannot explain a topic simply, you have not fully learned it yet."),
    P("Use a short list. Choose 15 to 25 core topics for the role. For a software role they could be variables and loops, functions, object-oriented ideas, a database basic, how the web works and one language in depth. For an accounts role: the accounting equation, debit and credit, journal and ledger, bank reconciliation and common spreadsheet functions. For an electrical or mechanical trade role: safety rules, tools, reading drawings, basic measurements and common faults. Revise one topic a day and say it aloud."),
    N("Depth beats breadth. Knowing eight topics deeply is better than knowing thirty at name level. If you say you know a topic, expect a second and third question on it."),
    H("Explain your projects"),
    P("Your resume projects are the most likely start of a technical conversation. Prepare them as in lesson 3, and also prepare the technical side: the tools you used and why, the design in simple terms, the part you found hardest, what you would improve, and how you tested that it worked. If you used a framework or tutorial, say so honestly, and be clear about what you built yourself."),
    H("Think aloud"),
    P("When you get a problem, say what you are thinking. Silence is hard for an interviewer to judge. This is especially true for coding or calculation questions. A good pattern:"),
    O("**Repeat the problem** in your own words to be sure you understand. Ask a clarifying question if needed.", "**Give a simple example** to show you understand: “If the input is 3 and 5, the answer should be ...”.", "**Start with an obvious approach**, even if it is not the best, and say it.", "**Work through it step by step** while talking. If you hit a wall, say so and try a different angle.", "**Check your answer** with your example, and think of edge cases, such as an empty list or zero.", "**Say how you could improve it** if you have time."),
    P("Interviewers like candidates who stay calm, ask good questions and correct their own mistakes. That matters more than a flawless answer."),
    H("Coding and technical exercises"),
    P("For programming roles, you may get a coding exercise on paper, on a whiteboard, in a browser or as a take-home task. Practise on small problems regularly in the language you list. Free practice sites exist for this. Start with simple loops and strings, then lists and dictionaries, then basic searching and sorting ideas. Type the code yourself rather than reading solutions. After you solve a problem, ask what edge cases you missed."),
    P("For take-home tasks, read the instructions carefully, keep the solution clear and simple, add a short README on how to run it, and submit before the deadline. Do not copy another person's solution. Interviewers often ask you to explain every line."),
    H("When you do not know the answer"),
    P("It will happen. Here is a calm way to handle it."),
    O("Say honestly: “I'm not sure about that.”", "Share what you do know that is related: “I know how X works, so I think Y may be similar.”", "Reason aloud to a sensible guess, and mark it as a guess.", "If you are stuck, ask for a hint. It is a normal thing to do, and how you use the hint is informative.", "Afterwards, look up the answer and add it to your notes. The same question may come back."),
    P("Never invent a confident wrong answer. A wrong answer said confidently is worse than an honest “I don't know, but here's how I would find out”."),
    H("Practical and trade interviews"),
    P("For hands-on roles you may be asked about a job you did: “Tell me how you would fix a motor that won't start” or “What do you check before using this machine?”. Answer in order, in plain words, starting with safety. If you have worked on real equipment, describe it. If not, describe how you learned and what you practised."),
    H("Ask a good question at the end"),
    P("A thoughtful technical question shows interest: “What tools does the team use day to day?” or “What would I learn in the first month?”. It is a chance to show you think about the work."),
    ...task("List 15 to 25 core topics for the role you want. Mark each one as strong, medium or weak.", "Pick three weak ones and spend a week turning them to strong. Explain each aloud to someone.", "Write the technical summary for each of your projects: tools, design, hardest part, testing, improvement.", "Practise one problem aloud, using the six-step thinking-aloud method."),
    ...check("You can explain every item on your topic list in simple words.", "You have a technical summary of each project that you can say in two minutes.", "You have a calm plan for a question you cannot answer."),
  ], A('Think aloud on a problem', [
    n('rep', 'Repeat it', 'confirm the problem', 0, 0, 'user'), n('ex', 'Simple example', 'check your idea', 1, 0, 'data'),
    n('try', 'Try an approach', 'talk through steps', 2, 0, 'tool'), n('chk', 'Check and improve', 'edge cases', 3, 0, 'check'),
  ], [
    { say: 'Repeat the problem in your own words, and ask a question if anything is unclear.', on: ['rep'] },
    { say: 'Give a small example to show you understand what is wanted.', flow: ['rep>ex:example'] },
    { say: 'Start with an obvious approach and explain each step as you go.', flow: ['ex>try:approach'] },
    { say: 'Check it against your example and edge cases, then say how you could improve it.', flow: ['try>chk:verify'] },
  ]), [
    faq('What if I do not know the answer in a technical interview?', 'Say so honestly, share what you do know that is related, and reason aloud. Asking for a hint is acceptable. Never invent a confident wrong answer.'),
    faq('How much should a fresher know?', 'Interviewers expect solid basics and your own projects, not expert knowledge. Depth on the core topics matters more than a long list of names.'),
  ]),
];
