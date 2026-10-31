// Starter interview questions with model answers. Safe to re-run: questions that already exist (same slug)
// are left alone so admin edits are never overwritten. Use --replace to reset them.
//   node scripts/seedInterviewQuestions.js [--replace]
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../configs/db.js';
import InterviewQuestion from '../models/InterviewQuestion.js';
import { slugify } from '../utils/slugify.js';
import { allInterviewQuestions } from './interview/index.mjs';   // 100 questions each for Angular, React, Node/Express/MERN, Python and SQL, basic to advanced

const Q = (category, level, question, modelAnswer, tips = []) => ({ category, level, question, modelAnswer, tips });

const questions = [
  // ---- General / HR ----
  Q('HR and behavioural', 'both', 'Tell me about yourself.',
`Keep it to about a minute and shape it as present, past, future. Start with what you do now or have just finished (your job, course or training). Then give one or two things from your past that prove you can do this job, such as a result, a skill or a responsibility. End with why this role is the next step for you.

Example for a fresher: "I have just finished my diploma in electronics. During my final project I built and tested a small sensor circuit with two classmates, which taught me to read circuit diagrams and work to a deadline. I am looking for a technician role where I can keep learning on real equipment, and your company's repair work is exactly that."

Do not read out your whole resume or share family and personal details that have nothing to do with the job.`,
    ['Practise it aloud until it sounds natural, not memorised.', 'Mention one skill that appears in the job advert.']),
  Q('HR and behavioural', 'both', 'What are your strengths and weaknesses?',
`Choose two or three strengths that match the job and back each with a real example. "I am reliable: in my last job I did not miss a single shift in a year" is stronger than "I am reliable".

For a weakness, pick something real that is not essential to the job, and say what you are doing about it. For example: "I used to hesitate to ask for help, which slowed me down. Now I ask after trying for 15 minutes, and my work has become faster." Avoid fake weaknesses such as "I work too hard", and never name a weakness the job depends on.`,
    ['Show improvement, not perfection.']),
  Q('HR and behavioural', 'both', 'Why do you want to work for our company?',
`Show that you chose this company, not just any job. Before the interview, read the website, the job advert and recent news. Then give two reasons: one about the work (what you will do, what you can learn) and one about the company (its products, values, reputation, location or growth).

Example: "I have seen that you serve customers across three cities and invest in training new staff. I want to build a long-term career, and I can contribute with my customer-service experience." If you do not know much, say honestly what you found and ask a question about the rest.`,
    ['Do not say the pay or short travel time is your only reason.']),
  Q('HR and behavioural', 'both', 'Where do you see yourself in five years?',
`Employers want to know you will stay and grow with them. Talk about skills and responsibility rather than exact titles: "In five years I would like to be doing this work confidently, training new colleagues, and ready to take on more responsibility such as leading a small team."

Keep it realistic and connected to this company. Avoid saying you plan to start your own business, change career or leave, unless you can tie it to the role.`,
    ['Mention learning and responsibility, not only promotion.']),
  Q('HR and behavioural', 'both', 'Why should we hire you?',
`Answer with fit, proof and attitude. Fit: list two or three requirements from the advert you meet. Proof: give one short example of doing something similar. Attitude: say you learn quickly and take work seriously.

Example: "You need someone who can handle customer calls calmly and record every request accurately. In my previous job I handled around forty calls a day and kept a clean record of each. I am punctual and I take feedback well." Use a number only if it is true.`,
    ['Stay confident, not boastful. Never run other candidates down.']),
  Q('HR and behavioural', 'both', 'Tell me about a time you faced a difficult situation at work or study.',
`Use the STAR method: Situation (the context in one or two sentences), Task (what you were responsible for), Action (what you personally did, step by step), Result (what happened, and what you learned).

Example: "A customer was upset because an order was late (situation). I had to calm them and fix it (task). I apologised, checked the order status, arranged a faster delivery and called them with an update (action). They accepted the new time and later placed another order (result)." Choose a real example, keep it positive and finish with what you learned.`,
    ['Have two or three STAR stories ready: a problem, a teamwork moment, and a mistake you fixed.']),
  Q('HR and behavioural', 'both', 'What are your salary expectations?',
`Research first: check typical pay for the role in your city (see the salary pages on this site and the job advert). If you can, let them give the range first: "What is the budgeted range for this position?" If you must give a number, give a range based on your research and your experience, and say you are open to discussion depending on the full package.

Example: "Based on my research and my skills, I am looking for something in the range of X to Y, and I am flexible depending on the benefits and growth." Never invent a figure you cannot support, and do not lie about your current pay.`,
    ['Check your local rules on asking about current pay.']),
  Q('HR and behavioural', 'both', 'Why did you leave your last job (or why is there a gap in your resume)?',
`Be honest, brief and positive. Good reasons: seeking growth, a contract ended, relocation, a company closure, family or health responsibilities, or study. Do not criticise your former employer.

For a gap: say what happened in one sentence and what you did to stay ready, such as short courses, part-time or casual work, caring for a relative, or job searching. "I took six months to care for my father; since then I completed a stock-control course and I am ready to work full time." Then move the conversation back to what you can do now.`,
    ['Short and calm beats long and defensive.']),
  Q('HR and behavioural', 'experienced', 'How do you handle a disagreement with your manager or a team member?',
`Explain a respectful process: listen first, understand their view, state yours with facts, look for a shared goal, and agree the next step. If it is still unresolved, ask for a neutral conversation or involve a senior person calmly.

Example: "My supervisor wanted a different shift plan. I asked about the reason, showed the figures I had on delays, and we agreed to trial my change for two weeks and review the results." Show that you can disagree without making it personal, and that you accept the final decision when it is made.`,
    ['Pick an example that ended well, even if you did not get your way.']),
  Q('HR and behavioural', 'experienced', 'Why are you looking to change jobs now?',
`Focus on what you are moving towards. Good themes: more responsibility, new skills, a bigger challenge, a better fit with the work you enjoy, or a company that matches your goals. Keep it specific to this role.

Example: "I have learned a lot in my current role and led a team of four for two years. I want to work on larger projects, and this role offers that." Avoid complaining about pay, boss or colleagues. If you were laid off, say so plainly and move on to what you have done since.`,
    ['Do not badmouth your employer.']),
  Q('HR and behavioural', 'experienced', 'Describe a time you led a team or took responsibility beyond your role.',
`Use STAR. Choose an example with a clear goal, a few people and a result. Explain how you planned the work, shared tasks, supported the team, and what you did when something went wrong.

Example: "When our supervisor was absent for a week, I organised the daily plan for six colleagues, checked quality at the end of each shift and reported to the manager. Output stayed on target and no complaints came in." Be generous with credit to the team; say what you learned about leading.`,
    ['Even without a title, leading a task counts.']),
  Q('HR and behavioural', 'fresher', 'You have no experience. Why should we hire you?',
`Everyone starts somewhere. Show that you are ready to learn and that you already have related experience from study, projects, volunteering, part-time or family work. Name the skills that carry over: punctuality, teamwork, communication, basic computer use, hands-on practice.

Example: "I have not held a full-time job yet, but I completed a six-month training programme, did a three-week placement and organised a college event for 200 people. I learn fast, I follow instructions carefully and I am committed to building my career here." Then ask what the first months of training look like.`,
    ['Bring proof: a certificate, project or reference.']),

  // ---- Customer service, sales, office ----
  Q('Customer service', 'both', 'How would you handle an angry customer?',
`Stay calm, listen without interrupting, and let them finish. Acknowledge the feeling ("I understand why this is frustrating"), apologise for the experience without blaming anyone, then ask questions to understand the problem. Offer a clear solution or the next step with a time, and follow up. If it is beyond your authority, pass it to your supervisor and tell the customer what will happen.

Finish by checking they are satisfied, and record the case so the same problem is not repeated.`,
    ['Never argue or promise something you cannot deliver.']),
  Q('Sales', 'both', 'How do you handle rejection or a customer saying no?',
`Treat a no as information, not a verdict. Stay polite, ask what held them back (price, timing, need), and answer honestly if you can help. If it is not the right time, ask permission to follow up later. After each no, reflect on whether something in your approach can be improved.

Example: "I keep a note of the reasons customers give. Over a month I noticed many asked about delivery time, so I started explaining delivery at the start, and my conversions improved." Only quote results that are true.`,
    ['Show resilience and learning.']),
  Q('Office and accounts', 'both', 'How do you prioritise when you have many tasks and short deadlines?',
`Explain a simple method: list everything, mark what is urgent and what is important, check deadlines and who is waiting on you, then start with the high-impact tasks. Communicate early if deadlines clash, and ask your manager which one comes first.

Example: "I write the day's tasks in the morning, number them, and update at lunch. If two urgent requests arrive, I tell both people when I can finish each, and ask my manager if priorities need to change." Mention tools you use, such as a to-do list or calendar.`,
    ['Show that you ask, not guess, when priorities clash.']),
  Q('Office and accounts', 'both', 'How do you make sure your work is accurate?',
`Describe the habits: double-check numbers, use a checklist, compare totals against a source, take a short break before final review, and ask a colleague to review important work. Mention formulas, validation or tools you use.

Example: "In data entry, I compare my totals with the source document at the end of each batch and flag differences before submitting. I keep a log of errors I find so I can avoid repeating them." Give an example where you caught a mistake before it caused trouble.`,
    ['Accuracy means catching your own mistakes.']),

  // ---- Warehouse, driving, skilled trades ----
  Q('Warehouse and logistics', 'both', 'What safety precautions do you follow in a warehouse?',
`Talk about the basics you would follow every day: wear the required protective equipment, keep walkways clear, lift correctly (bend knees, keep the load close, ask for help with heavy items), follow the rules for pallet trucks and forklifts, never use equipment you are not trained and licensed for, report hazards and near-misses straight away, and know the emergency exits and fire points.

Say that you follow the company's procedures and local regulations, and that you would ask a supervisor if unsure.`,
    ['Mention training and licences you actually hold.']),
  Q('Warehouse and logistics', 'both', 'How do you keep stock records accurate?',
`Explain how you would count and record items: check deliveries against the delivery note, record any damage or shortage immediately, put items in their correct location, update the system or sheet as soon as stock moves, and take part in regular stock counts. When a difference appears, trace it back (picked wrongly, mislabelled, wrongly recorded) and correct the cause, not just the number.

If you have used a stock system or barcode scanner, say which.`,
    ['Accuracy and speed both matter. Show you value accuracy first.']),
  Q('Driving and delivery', 'both', 'What do you do before starting a delivery route?',
`Describe a routine: check the vehicle (tyres, lights, fluids, brakes, load security), confirm the day's route and delivery list, check documents and your licence, plan around traffic or weather, and make sure the load is secured. During the route, follow traffic and rest-time rules and keep customers informed of delays. At the end, record deliveries and report any vehicle faults.

Safety and honesty about rest times matter more than speed.`,
    ['Mention the licence and checks that apply in your country.']),
  Q('Skilled trades', 'both', 'Tell me about a job you completed that you are proud of.',
`Choose a real job and describe it from start to finish: what the customer needed, how you planned and measured, which tools and materials you used, any problem you solved on the way and the quality check at the end. Mention safety steps.

Example: "I had to replace a damaged section of pipe in a tight space. I isolated the supply, measured twice, fitted the new section, pressure tested it and cleaned up. The customer called again for another job." Photos or references help if you can bring them.`,
    ['Use real detail. Interviewers can tell when it is rehearsed fiction.']),

  // ---- Technology ----
  Q('Technology', 'fresher', 'Explain the difference between a database and a spreadsheet.',
`A spreadsheet is a grid of cells, good for small amounts of data, calculations and charts used by one person or a small team. A database stores large amounts of structured data in related tables, lets many users read and write at once, enforces rules (such as unique IDs) and answers questions quickly using a query language such as SQL.

Example: a shop can track a few products in a spreadsheet, but an online store with thousands of customers, orders and payments needs a database so the information stays consistent and fast to search.`,
    ['Give a small example, not just definitions.']),
  Q('Technology', 'both', 'What is the difference between frontend and backend development?',
`The frontend is everything the user sees and interacts with in the browser or app: pages, buttons, forms and layout, usually built with HTML, CSS and JavaScript or a framework such as React. The backend runs on a server and handles the logic behind it: storing data in a database, checking logins, processing payments and sending responses through an API.

A full stack developer works on both. For example, when you submit a login form, the frontend collects your details, and the backend checks them against the database and replies.`,
    ['Say which side you are stronger in, and why.']),
  Q('Technology', 'experienced', 'How do you approach debugging a problem you have never seen before?',
`Describe a calm, repeatable method: reproduce the problem reliably; read the error messages and logs; narrow down where it happens by testing one thing at a time (or using version history to find when it began); form a hypothesis and test it; fix the cause, not the symptom; add a test or note so it does not return. Ask a colleague when you have been stuck longer than a set time, and document what you learned.

Give a short real example: what the symptom was, how you narrowed it and what the fix was.`,
    ['Interviewers value a method more than a lucky guess.']),
  Q('Technology', 'experienced', 'Tell me about a mistake you made at work and what you learned.',
`Pick a real mistake with a limited impact, own it without blaming others, and focus on the fix and the lesson. Structure: what happened, how you noticed and told the right people quickly, what you did to correct it, and what you changed afterwards (a checklist, a test, a review step).

Example: "I once released a change without testing one scenario and it caused errors for a few users. I told my lead immediately, rolled it back within the hour, and added that scenario to our checklist." Interviewers want honesty and growth, not a perfect record.`,
    ['Never claim you have never made a mistake.']),

  // ---- Closing ----
  Q('Closing the interview', 'both', 'Do you have any questions for us?',
`Always ask two or three. Good ones: "What does a typical day look like in this role?", "How will success be measured in the first three months?", "What training or development is available?", "What are the next steps in the process?" Questions show interest and help you decide whether the job suits you.

Avoid asking only about pay, leave or how quickly you can be promoted in the first interview. Do not say "No questions"; if everything was already covered, say so and ask about the next steps.`,
    ['Write your questions in a notebook and bring it with you.']),
];

questions.push(...allInterviewQuestions);

const replace = process.argv.includes('--replace');
await connectDB();
let order = 0;
for (const q of questions) {
  const slug = slugify(q.question).slice(0, 90);
  order += 1;
  const exists = await InterviewQuestion.exists({ slug });
  if (exists && !replace) {
    // keep the admin's edits; only add the course link to questions that have none yet
    if (q.learnCourse) await InterviewQuestion.updateOne({ slug, $or: [{ learnCourse: { $exists: false } }, { learnCourse: '' }] }, { $set: { learnCourse: q.learnCourse, learnLesson: q.learnLesson || '' } });
    console.log(`skip   ${slug}`); continue;
  }
  await InterviewQuestion.findOneAndUpdate({ slug }, { ...q, slug, order, published: true, modifiedAt: new Date() }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
  console.log(`${exists ? 'reset ' : 'added '} ${slug}`);
}
await mongoose.disconnect();
