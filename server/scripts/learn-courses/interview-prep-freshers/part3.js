import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S3 = 'Tests and Technical Rounds';
const S4 = 'The Day and After';

export const lessons = [
  // ---------------------------------------------------------------- 11
  les(S3, 'group-discussion-and-case-questions', 'Group Discussions and Case Questions', 'Group Discussion and Case Questions Tips',
    'Do well in group discussions and case-style questions: how to start, listen, add value, handle loud people and structure a short problem-solving answer.', [
    P("Some employers, especially large companies and campus drives, put several candidates in one room and give them a topic to discuss. This is a **group discussion**, or GD. Others ask a short business problem, called a **case question** or a guesstimate. Both look at the same things: how you think, how you speak, and how you behave with other people. You do not have to be the loudest person to do well. You have to be clear, respectful and useful."),
    H("What observers watch in a group discussion"),
    L("**Content.** Do your points make sense and show you thought about the topic?", "**Communication.** Is your speech clear, and do you stay on the topic?", "**Listening.** Do you respond to what others say, and not just wait to talk?", "**Teamwork.** Do you include quiet people and help the group reach a point?", "**Behaviour.** Are you calm, polite and confident without being aggressive?"),
    P("Notice that talking the most is not on the list. Candidates who shout and interrupt are usually marked down. Candidates who say fewer, better points, listen and summarise, often score higher."),
    H("Before you speak: take a few moments"),
    P("When the topic is given, use the first minute to write two or three ideas. Think of the topic from several angles, which you can remember with this checklist: **people** (who is affected), **money** (costs and benefits), **society**, **technology**, **time** (short and long term) and **risks**. Even one point from each angle gives you material for the whole discussion."),
    H("A simple plan for the discussion"),
    O("**Start well, if you can.** A good opening gives a short definition or context and one main point. “Social media is used by most young people. I think the key question is how to get its benefits while reducing the harm.” A clear start earns credit. But do not rush if you are not ready. A thoughtful second or third contribution is also fine.", "**Add one new point each time.** Do not repeat what others said. Build on it: “Building on what Ravi said about schools, I'd add that ...”.", "**Use examples.** A real example makes your point stronger than a general claim. Avoid made-up statistics. If you do not know a number, do not invent one.", "**Include others.** If someone has been quiet, say: “We haven't heard from Meena. What do you think?”. It shows leadership.", "**Redirect gently if the group drifts.** “We are talking about cost. Let's return to the main question.”", "**Summarise near the end**, if no one has. Two or three sentences covering the main points the group raised."),
    H("Handling difficult situations"),
    L("**A loud person dominates.** Do not shout back. Wait for a gap and say: “That's a good point. Can I add something?”. Speak calmly and firmly.", "**Someone interrupts you.** Say politely: “Let me finish this point, and then I will hear yours.”", "**You disagree.** Do it respectfully: “I see your point, but I see it differently because ...”. Disagree with ideas, never with people.", "**The discussion is chaos.** Suggest a structure: “Maybe we can discuss advantages first, then disadvantages.”", "**You are nervous.** Take a breath, speak slowly and make your first point short. The first contribution is the hardest. It gets easier after that."),
    H("Topics you may get"),
    P("Topics usually fall into a few groups: current affairs, social issues, business and economy, technology and abstract topics (“Is it better to be a leader or a follower?”). Read news regularly, from more than one source. Form a balanced view on a few big topics, and practise saying one point for and one point against. Stay away from rude or offensive statements on religion, politics or groups of people, and stay calm if others are strong in their views."),
    H("Case questions and guesstimates"),
    P("A case question gives you a small business problem: “A local café's sales have dropped. What would you check?”. A guesstimate asks you to estimate something, such as the number of tea cups sold in your city per day. Nobody expects the exact number. They watch your **structure** and your **reasoning**."),
    P("Use this structure for a problem question."),
    O("**Clarify.** Ask two quick questions to understand: “Over what period did sales drop? Is it all products or only some?”.", "**Structure.** Divide the problem into a few parts and say them: “I'd look at customers, the product, the price, and competitors.”", "**Explore.** Take each part and give a reasonable idea of what you would check, in order of importance.", "**Conclude.** Give a short recommendation and say what you would do first."),
    P("For an estimation, state your assumptions and do the maths aloud."),
    C('text', `Estimate: cups of tea sold daily at street stalls in a town of
200,000 people. (Made-up numbers for practice only.)

- Assume 1 in 4 people drink tea from a stall on a given day: 50,000.
- Assume they have 2 cups on average: 100,000.
- So roughly 100,000 cups a day.
- I would adjust this if I knew the real habits of the town.`),
    P("The answer is not important. The method, the stated assumptions and the readiness to adjust them are what the interviewer wants to see."),
    H("Practising on your own"),
    L("Practise with friends. Pick a topic, set a timer for ten minutes, and have someone observe and give feedback.", "Record yourself discussing a topic alone for two minutes. Check for structure and filler words.", "Read a short news article daily and write two points for, two against.", "Practise a quick structure for case questions on everyday businesses: a shop, a school, a bus service."),
    N("In group discussions, quality beats quantity. Two or three strong, relevant contributions, along with active listening and a closing summary, usually score better than constant talking."),
    ...task("Pick a topic from the news. Write one point from each angle: people, money, society, technology, time and risks.", "Hold a 10-minute practice discussion with two or three friends. Ask them to note who listened well and who added new points.", "Practise a case question aloud using clarify, structure, explore and conclude."),
    ...check("You made at least two new points in the discussion and one summary.", "You invited a quiet person to speak, or used the polite way to join a busy group.", "Your case answer had a clear structure."),
  ], A('A strong group discussion', [
    n('think', 'Think first', 'write 2 or 3 ideas', 0, 0, 'user'), n('say', 'Add new points', 'with examples', 1, 0, 'app'),
    n('listen', 'Listen and include', 'build on others', 2, 0, 'check'), n('sum', 'Summarise', 'main points', 3, 0, 'out'),
  ], [
    { say: 'Take a minute to note two or three ideas from different angles.', on: ['think'] },
    { say: 'Contribute new points, each with a short example, and avoid repeating others.', flow: ['think>say:speak'] },
    { say: 'Listen, build on what others say, and invite quiet people to join.', flow: ['say>listen:respond'] },
    { say: 'Near the end, summarise the main points in two or three sentences.', flow: ['listen>sum:close'] },
  ]), [
    faq('Should I always speak first in a group discussion?', 'Not necessarily. A clear, thoughtful opening can earn credit, but a good second or third contribution is fine. Do not speak first if you would only ramble.'),
    faq('What if I disagree with someone in the group?', 'Disagree with the idea and not the person, politely: I see your point, but I see it differently because... Then give your reason.'),
  ]),

  // ---------------------------------------------------------------- 12
  les(S4, 'phone-and-video-interviews', 'Phone and Video Interviews: Setup, Voice and Body Language', 'Phone and Video Interview Tips',
    'Set up for online and phone interviews: internet, light, sound, camera and background, plus voice and eye contact that make a good first impression.', [
    P("A large share of first interviews now happen by phone or video. They look easy because you are at home, but they have their own problems: a poor connection, echo, a noisy house, a laptop camera that makes people look at the ceiling. The good news is that nearly all of these are fixed with an hour of preparation. This lesson helps you set up properly and shows how to make a strong impression through a screen or a phone."),
    H("Check your technology a day before"),
    O("**Internet.** Test your connection. If it is weak, move closer to the router, ask others at home not to stream or download during your interview, or use mobile data as a backup.", "**The software.** Many interviews use Zoom, Google Meet, Microsoft Teams or similar. Install the app, create an account if needed, and open the link in advance. Check that you can join a test meeting.", "**Charge your device** and plug in the charger. A phone call ends badly when the battery dies.", "**Audio.** Use earphones with a microphone if you have them. They reduce echo and background noise. Do a quick recording to hear how you sound.", "**Camera.** Place it at eye level. A laptop on a stack of books works well. Looking slightly down into a camera is unflattering and hard to look at.", "**A backup plan.** Keep the recruiter's phone number and be ready to switch to a phone call if the video fails."),
    H("Prepare your space"),
    L("**Quiet.** Tell people at home the time. Close the doors and windows. Put a note on the door if needed.", "**Background.** A plain wall or tidy corner is enough. Avoid a messy bed or clutter. Do not use a silly virtual background. A slight blur is fine if the tool offers it.", "**Light.** Face a window or a lamp so the light falls on your face. Do not sit with a bright window behind you, because you will look like a dark shape.", "**Phone settings.** Turn off notifications and silent-mode your other devices.", "**What you need on the table.** A glass of water, a pen, paper, your resume and your prep sheet. Keep notes out of the camera view, or have just a few key words in reach."),
    H("Dress properly"),
    P("Dress as you would for an in-person interview in that workplace, at least from the waist up and preferably fully. Dressing well changes how you feel and sit. Choose plain colours that are not too bright. For a casual workplace, neat and clean is enough."),
    H("Phone interviews"),
    P("In a phone interview the interviewer cannot see you, so your voice carries everything."),
    L("**Stand or sit upright.** Your voice sounds clearer and more confident.", "**Smile when you speak.** You can hear a smile in a voice.", "**Speak a little slower than normal**, and clearly. Mobile networks can distort fast speech.", "**Pause instead of saying “um”.** A short pause sounds thoughtful.", "**Answer in a quiet place with good signal.** Use the same place every time and test it.", "**Take notes** of names and details, and have your resume in front of you."),
    P("If the line is bad, say so politely: “I'm sorry, the line is not clear. Could you repeat that?”. Asking is better than guessing."),
    H("Video interview behaviour"),
    L("**Join 5 to 10 minutes early.** Be on time, never late.", "**Look at the camera when you speak**, not at your own face on the screen. It feels odd, but it looks like eye contact to the other person. Look at the screen when you listen.", "**Sit up with relaxed shoulders.** Keep your hands visible and natural. Move a little as you talk, but not too much.", "**Nod and smile** to show you are listening. Delays can make people hesitate, so wait a second after the question ends before you answer, to avoid talking over them.", "**Do not read from a script.** A few key words are fine. Reading sounds flat and interviewers notice eye movements.", "**Do not eat or look at other screens.**"),
    H("Recorded video interviews"),
    P("Some employers ask you to record answers to set questions on a platform, with no live person. You usually have a short time to prepare and one or two attempts per question. Treat it as a real interview. Read the instructions, test the camera, and practise on the platform if it has a practice question. Use the same structure as in person: a clear answer with an example, within the time limit. It is natural to feel awkward talking to a screen. Imagine you are talking to a friendly person on the other side."),
    H("If something goes wrong"),
    L("**Connection drops:** Rejoin quickly, or call or message the recruiter. Say sorry briefly and carry on.", "**Noise starts:** Say “I'm sorry, there's some noise. One moment.” and mute while it passes, if you can.", "**You freeze on a question:** It is fine to say, “Could I take a moment to think about that?”.", "**Your mind goes blank:** Take a slow breath, sip water, and ask them to repeat the question."),
    P("Interviewers know that technology is not perfect. They notice how calmly you handle a problem."),
    H("Close well"),
    P("At the end, thank the interviewer, say you enjoyed the conversation, and confirm the next steps. Smile and wait for them to end the call. Do not rush to turn off the camera. A short thank-you message the same day is a good habit (lesson 15)."),
    N("Practise once with a friend on the same platform. Ask them to tell you honestly how you look and sound. This single practice run fixes most problems."),
    ...task("Test your internet, camera, microphone and lighting. Record a one-minute answer and watch it back.", "Set up the space: background, light and a place for notes. Take a photo of your setup and fix one thing.", "Do a 10-minute practice interview with a friend on the platform your interview will use."),
    ...check("You can hear yourself clearly and your face is lit and at eye level.", "You know where you will look when you speak.", "You have a backup plan if the video fails."),
  ], A('Set up for a video interview', [
    n('tech', 'Check technology', 'internet, camera, audio', 0, 0, 'tool'), n('space', 'Prepare space', 'quiet, light, background', 1, 0, 'store'),
    n('beh', 'Behave well', 'look at camera, smile', 2, 0, 'user'), n('close', 'Close well', 'thank and confirm steps', 3, 0, 'out'),
  ], [
    { say: 'The day before, test your internet, camera and microphone, and charge your device.', on: ['tech'] },
    { say: 'Prepare a quiet space with light on your face and a tidy background.', flow: ['tech>space:then'] },
    { say: 'During the call, look at the camera, sit upright, speak clearly and listen actively.', flow: ['space>beh:interview'] },
    { say: 'At the end, thank the interviewer and confirm the next steps.', flow: ['beh>close:finish'] },
  ]), [
    faq('Where should I look during a video interview?', 'Look at the camera when you speak, because that looks like eye contact to the other person. Glance at the screen when you listen.'),
    faq('What should I do if my internet fails during an interview?', 'Rejoin quickly or switch to a phone call, and message the recruiter if needed. Apologise briefly and carry on calmly. Keep a backup like mobile data.'),
  ]),

  // ---------------------------------------------------------------- 13
  les(S4, 'salary-notice-period-and-your-questions', 'Salary, Notice Period and Questions to Ask', 'Salary and Questions to Ask in Interviews',
    'Handle salary, notice period and benefits questions honestly, and learn which questions to ask the interviewer. Includes cautions about pay and contracts.', [
    P("Near the end of an interview, practical questions appear: What salary do you expect? When can you join? Do you have any questions for us? Many freshers freeze on these, because nobody taught them. This lesson explains how to handle them calmly. A note: pay and employment rules differ by country and employer. This lesson gives general habits, not legal or financial advice. For legal details in your country, check official government sources or a trusted adviser."),
    H("Expected salary: do some research first"),
    P("The question “What are your salary expectations?” is not a trap, but it needs preparation. If you name a number without knowing the market, you may ask for too little or too much. Research gives you a sensible range."),
    L("Look at pay ranges stated in job adverts for similar roles in the same city. Some countries now require pay ranges in adverts.", "Look at salary pages and reports on this site and others. Remember that each is a limited sample, and that pay changes between cities and company sizes.", "Ask friends, seniors, teachers or people in similar roles what a fresher can reasonably expect.", "Consider your own needs: transport, rent and basic costs. Work out the lowest amount you could accept."),
    P("Pay may be quoted per month, per year or per hour, and in different currencies. Be careful to compare like with like. Check whether a number includes bonuses or allowances, or is before or after tax."),
    H("How to answer"),
    O("**You can ask first.** “Could you tell me the range for this role?” This is polite and often works.", "**If they ask you, give a range**, not one number, based on your research. “Based on my research for similar roles in this city, I'm looking for something in the range of X to Y, and I'm open to discussing it.”", "**If you have no idea,** say so honestly and ask about their budget: “I'd like to understand the full package first. What is the range you have in mind?”", "**Show flexibility** when appropriate. For a first job, learning and a good start matter as well as pay, but do not accept pay below what you can live on."),
    P("Do not lie about your current or past pay. In some countries it is also against the rules for employers to ask for it. If you are asked, you can say that you would rather talk about the pay for this role."),
    H("Notice period and joining date"),
    P("A **notice period** is the time you must give your current employer before leaving. A fresher with no job usually has none and can join soon. If you do have one, state it honestly, check your contract, and say whether it can be shortened by agreement. In India, notice periods of one to three months are common in many companies, while in other countries they may be shorter. Never promise a date you cannot meet."),
    P("If you are still studying, say when your exams finish and when you can start. If you need to relocate, say how long it takes."),
    H("Other practical topics"),
    L("**Working hours, shifts and location.** Be honest about what you can manage, such as travel time or night shifts.", "**Probation or training period.** Ask how long and what pay and rules apply.", "**Bonds or service agreements.** Some employers ask new staff to sign a bond to stay for a period or repay training costs. Read it very carefully before signing. Ask what happens if you leave early. If anything is unclear, ask a trusted person to read it.", "**Documents.** Employers may ask for ID and certificates for verification. Original certificates should not be handed over permanently. Provide copies and show originals for checking. Be careful about any request to give up original documents or pay a deposit."),
    N("A legitimate employer does not charge you money to give you a job. Never pay a fee for a job, a “registration” or an “interview”. See the next lesson for more about scams."),
    H("The question: “Do you have any questions for us?”"),
    P("Always have two or three. Good questions show interest in the work and the team, and they also help you decide if the job is right for you."),
    L("“What would a typical day or week look like in this role?”", "“What are the most important things to achieve in the first three months?”", "“How is a new person trained and supported?”", "“How does the team measure success?”", "“What are the opportunities for learning and growth?”", "“What are the next steps in the process, and when can I expect to hear from you?”"),
    P("Avoid questions you could answer with a quick look at the company website, and avoid asking about leave and perks first. When it comes to the offer, it is fine to ask about them."),
    H("Questions to avoid"),
    L("“What does your company do?” It shows you did not research.", "Questions only about holidays, breaks or how soon you can leave early.", "Anything negative about other staff or the company."),
    H("When you get an offer"),
    P("Ask for the offer in writing, with the job title, pay, hours, start date and any conditions. It is normal to take a day or two to consider it. Thank them and say when you will reply. If you want to ask for a little more, be polite and give a reason, for example: “I'm very happy to join. Based on my research, I was hoping for X. Is there any flexibility?”. The answer may be no. Decide whether the whole offer works for you."),
    ...task("Research the pay range for a role you want in your city. Write a range you would give, and your lowest acceptable amount.", "Write an honest answer about your notice period or start date.", "Write your three best questions to ask the interviewer.", "Look up what an employment contract in your country should include, using an official government website."),
    ...check("Your pay answer uses a researched range and is not a single number guessed.", "You know to read any bond or agreement before signing.", "You have at least three good questions prepared."),
  ], A('Handle the practical questions', [
    n('res', 'Research pay', 'ranges for similar roles', 0, 0, 'data'), n('ans', 'Give a range', 'be flexible, be honest', 1, 0, 'user'),
    n('ask', 'Ask questions', 'about work and training', 2, 0, 'app'), n('off', 'Offer in writing', 'read before accepting', 3, 0, 'out'),
  ], [
    { say: 'Before the interview, research pay ranges for similar roles in your city.', on: ['res'] },
    { say: 'When asked, give a researched range and stay open to discussion.', flow: ['res>ans:range'] },
    { say: 'Ask your own questions about the work, the team and training.', flow: ['ans>ask:then'] },
    { say: 'If an offer comes, ask for it in writing and read it carefully before you accept.', flow: ['ask>off:offer'] },
  ]), [
    faq('Should I give one salary number or a range?', 'A researched range is usually better than one number, because it leaves room to discuss. Base it on similar roles in your city and your own needs.'),
    faq('Is it normal to be asked to sign a bond?', 'Some employers use bonds or service agreements. Read it very carefully, ask what happens if you leave early, and get advice if anything is unclear.'),
  ]),

  // ---------------------------------------------------------------- 14
  les(S4, 'interview-day-checklist-and-job-scams', 'Interview Day Checklist and How to Avoid Job Scams', 'Interview Day Checklist and Job Scams',
    'A practical checklist for the day before and the day of your interview, plus clear signs of fake job offers and what to do if you suspect a scam.', [
    P("The last day before an interview and the interview day itself are full of small decisions: what to wear, how to get there, what to carry, how to feel calm. This lesson gives you a checklist so you do not rely on memory when you are nervous. It also covers something that is sadly necessary for job seekers everywhere: how to avoid fake job offers."),
    H("The day before"),
    O("**Confirm the details.** Place, time, who to ask for, and the phone number. If there is any doubt, send a short polite message or call to confirm.", "**Plan your journey.** Check the route, the transport timetable and the time it takes at that hour. Plan to arrive 15 minutes early, and have a backup plan for delays. If you can, do a trial trip or look at the location on a map.", "**Prepare your clothes.** Clean, ironed, comfortable and appropriate. For most offices and customer jobs, neat formal or smart casual clothes. For a workshop, factory or practical role, clean and sensible clothing, with safety shoes if you have them. Check the fit and try them on.", "**Pack your bag.** See the list below.", "**Review your prep sheet** and practise your main answers once. Do not study all night.", "**Sleep.** Aim for a regular bedtime. Tired people give weaker answers."),
    H("What to carry"),
    L("Several printed copies of your resume, on clean paper.", "Copies of your ID, certificates and mark sheets, and the originals to show if asked.", "A pen and a small notebook.", "Your prep sheet and your questions.", "A reference list, with permission from each person.", "A bottle of water, a handkerchief, and any medicine you need.", "Your phone, on silent, with the employer's number saved.", "Some cash or a card for transport."),
    H("The morning of the interview"),
    L("Eat something light. A shaky stomach and a low-energy brain are not helpful.", "Dress and check yourself in a mirror.", "Leave early. Being late is the most common avoidable mistake.", "Silence your phone before you walk in. Do not look at it in the waiting area.", "On the way, say your first answer to yourself, but do not cram."),
    H("When you arrive"),
    L("Be polite to everyone, from the security guard to the receptionist. They may be asked what they thought of you.", "Greet the interviewer with a smile and a clear “Good morning”. A handshake, if offered, should be firm and brief. In some places or situations other greetings are normal, so follow the lead of the person you meet.", "Sit when invited. Sit upright with your feet on the floor and your bag beside you.", "Listen to the whole question before you begin to answer.", "Speak at a steady pace. Pause when you need to think.", "Keep your answers true, specific and short."),
    H("Calming your nerves"),
    L("Nerves are normal, and a little adrenaline helps. Every candidate has them.", "Breathe in for four counts and out for six, a few times, before you go in.", "Remember that the interviewers want to find a good person. They are not trying to trap you.", "If you make a mistake, correct it calmly and carry on. Nobody expects perfection."),
    H("Job scams: how they work"),
    P("Fake job offers are a serious problem in many countries, and they target people who really need work. Scammers copy real company names, create fake websites and send messages that seem professional. They want your money or your personal information. Learn the warning signs."),
    L("**They ask for money.** A registration fee, training fee, uniform fee, laptop deposit or “security deposit”. Real employers do not charge you to hire you. This is the biggest sign.", "**The offer comes without a real interview.** You get a job offer after a short chat on a messaging app, with no live interview.", "**The pay is too good.** Very high pay for little work or for no skills is a classic trap.", "**They use free email addresses** such as a personal Gmail instead of a company email address, or the email address is slightly different from the real company.", "**They ask for sensitive details early.** Bank account passwords, card numbers, one-time passwords (OTPs) or copies of your ID before you have signed a contract.", "**They pressure you.** “Pay today or lose the job.” Real employers allow time.", "**They ask you to buy equipment** and promise to repay you, or to receive money into your account and move it onwards. This can make you part of a crime.", "**The interview is only by text message** or the interviewer refuses a video or phone call."),
    H("How to check an offer"),
    O("Search the company name and the word “scam” or “fake”, and look for reviews, including on this site's company review pages.", "Find the company's own official website yourself, not through a link in the message. See whether the job is listed on their careers page. Contact them through the details on the official site to check.", "Check that the email address uses the company's real domain.", "Look for a physical address, and compare with a map.", "Ask a trusted person, a teacher or an older relative, to look at the message with you.", "Never send money or share a password, OTP or card details."),
    N("If you have paid or shared something, act quickly: contact your bank at once, change your passwords, and report it to the police or the cybercrime reporting service of your country. Do not feel ashamed. Scammers are skilled and many people are caught."),
    H("Your safety at interviews"),
    L("Tell a family member or friend where you are going, with the address and time.", "Prefer interviews in a company office, or a public place for a first meeting. Be cautious about interviews in private homes or isolated places.", "Trust your feelings. If something feels wrong, you can leave.", "Use a safe route home, particularly after dark."),
    ...task("Make your own checklist from this lesson. Pack your bag and lay out your clothes for your next interview.", "Look at a real job message you have received. Check it against the scam signs.", "Write the address of the cybercrime reporting service in your country, so you know it before you need it."),
    ...check("Your bag is packed with copies of your resume and documents.", "You know your route and have a backup plan.", "You can name at least five signs of a job scam."),
  ], A('Spot a fake job offer', [
    n('msg', 'Job message', 'too good to be true?', 0, 0, 'data'), n('check', 'Check signs', 'fees, free email', 1, 0, 'check'),
    n('site', 'Official site', 'find it yourself', 2, 0, 'tool'), n('safe', 'Decide safely', 'never pay or share OTP', 3, 0, 'out'),
  ], [
    { say: 'A job message arrives. Be careful if it promises high pay for little work.', on: ['msg'] },
    { say: 'Look for scam signs: fees, free email addresses, no real interview or pressure.', flow: ['msg>check:inspect'] },
    { say: 'Find the company website yourself and check that the job and contact details are real.', flow: ['check>site:verify'] },
    { say: 'Never pay money or share passwords or OTPs. If unsure, walk away and ask someone you trust.', flow: ['site>safe:decide'] },
  ]), [
    faq('Do real employers charge a fee for a job?', 'No. A legitimate employer does not charge you to hire you. Requests for registration, training or deposit fees are a major sign of a scam.'),
    faq('What should I do if I paid money to a fake job offer?', 'Contact your bank immediately, change your passwords, keep the messages as evidence and report to the police or the cybercrime reporting service in your country.'),
  ]),

  // ---------------------------------------------------------------- 15
  les(S4, 'after-the-interview-follow-up-and-rejection', 'After the Interview: Follow-Up, Offers and Rejection', 'After the Interview: Follow Up, Rejection',
    'Write a good thank-you message, follow up politely, handle waiting, learn from rejection and keep your search moving. Includes sample messages.', [
    P("The interview ends, you walk out, and then comes the waiting. This part is hard. You replay your answers, wait for a call, and may feel anxious or discouraged. What you do next matters. A short thank-you, a polite follow-up and a calm attitude to rejection help you in this job search and in every later one. This lesson gives you a plan."),
    H("Right after the interview"),
    O("**Write notes the same day.** Note the questions you were asked, what you answered well, what you could improve, and anything new you learned about the role. These notes are valuable for your next interview.", "**Send a thank-you message within 24 hours.** It is polite, it keeps you in mind and gives you a chance to add one point you forgot.", "**Keep records.** Note the date, the people you met and the next steps you were told."),
    H("A sample thank-you email"),
    P("Keep it short, friendly and specific. This sample is made up, so use your own details."),
    C('text', `Subject: Thank you - Junior Accounts Assistant interview

Dear Ms Sharma,

Thank you for taking the time to meet me today. I enjoyed learning
about how your team handles invoices and month-end checks, and it
made me even more interested in the role.

I'd like to add that I have also used Excel pivot tables for my
uncle's shop, which may be useful for the reporting you mentioned.

Please let me know if I can provide anything more. I look forward
to hearing from you.

Kind regards,
Anjali Kulkarni
+91 00000 00000`),
    P("Notice: it thanks the person, mentions something real from the conversation, adds one useful fact, and offers help. It is short. Check the spelling of names. If you have more than one interviewer, send each a short message, or one to the main contact and ask them to pass on your thanks."),
    H("Waiting: how long and what to do"),
    P("The interviewer may have told you when to expect an answer. If they did not, ask at the end: “When might I hear back?”. Then try to be patient. Hiring can be slow, because other candidates are being interviewed and managers are busy."),
    L("Keep applying. Do not stop your search because of one interview, however good it felt.", "Use the time to prepare for the next one, and to learn skills.", "Avoid checking your phone every five minutes. Set times to check, such as morning and evening."),
    H("Following up politely"),
    P("If the date has passed, or a week or two went by without news, a polite follow-up is acceptable. Keep it short and positive."),
    C('text', `Subject: Following up - Junior Accounts Assistant

Dear Ms Sharma,

I hope you are well. I'm writing to ask whether there is any update
on the Junior Accounts Assistant position. I remain very interested
in the role and would be glad to provide anything else you need.

Thank you for your time.

Kind regards,
Anjali Kulkarni`),
    P("Send one follow-up after about a week, and a second after another week or two if you hear nothing. After that, move on. Do not send many messages or call repeatedly. It can harm your chances."),
    H("If you get an offer"),
    L("Say thank you and show you are pleased.", "Ask for the offer in writing with title, pay, hours, location, start date and conditions.", "Read it carefully, including any bond, probation or notice terms. Ask about anything unclear.", "Take a day or two to decide, and tell them when you will answer.", "If you accept, reply in writing. If you decline, do it politely and quickly so they can offer the job to someone else.", "If you have several offers, compare pay, learning, the manager, location, hours and growth."),
    H("If you are rejected"),
    P("Rejection hurts, and nearly everyone gets it, many times. It does not mean you are a poor person or a bad candidate. It often means another candidate matched slightly better, or the company changed plans, or the role was filled from inside. A calm response protects your reputation and your wellbeing."),
    O("**Reply politely.** “Thank you for letting me know. I enjoyed meeting the team. I would be grateful for any feedback, and I'd like to be considered for future roles.”", "**Ask for feedback, once.** Many employers do not give it, but some do, and it is valuable.", "**Review your notes.** What questions were hard? What can you practise?", "**Choose one or two things to improve** and work on them before the next interview.", "**Look after yourself.** Talk to a friend, take a walk, rest. Then restart."),
    N("If rejections make you feel hopeless for a long time, or you feel very low, please talk to someone you trust, such as a family member, a friend, a teacher or a health professional. A job search is stressful, and support helps."),
    H("Keep a simple job search tracker"),
    P("Make a table in a notebook or spreadsheet with these columns."),
    C('text', `Company | Role | Date applied | Stage | Contact | Next step | Result
-------|------|--------------|-------|---------|-----------|-------
...`),
    P("Update it after each step. It stops you forgetting follow-ups and lets you see progress, which is encouraging in a long search."),
    H("The big picture"),
    P("Interviewing is a skill, and like any skill it improves with practice and honest review. Each interview teaches you something. Your first interviews may feel clumsy. By the fifth or tenth you will be calmer and more natural. Keep your resume updated, learn something new every week, and ask for help when you need it. Use the interview questions pages, resume tools and roadmaps on this site to keep practising. We wish you a good start to your career."),
    ...task("Write a thank-you message for your next interview, or for a past one, using the sample as a guide.", "Create your job search tracker with at least five applications.", "Write a polite reply to a rejection, asking for feedback.", "Write three things you will improve before your next interview."),
    ...check("Your thank-you message is under 120 words, specific and error free.", "Your tracker has a next step and date for each live application.", "You have a plan for what you will do if a rejection comes."),
  ], A('After the interview', [
    n('note', 'Write notes', 'same day', 0, 0, 'user'), n('thx', 'Thank-you message', 'within 24 hours', 1, 0, 'app'),
    n('wait', 'Wait and keep applying', 'follow up after a week', 2, 0, 'tool'), n('res', 'Offer or learn', 'read offer, review notes', 3, 0, 'out'),
  ], [
    { say: 'Right after the interview, write notes on what was asked and how you answered.', on: ['note'] },
    { say: 'Send a short, specific thank-you message within a day.', flow: ['note>thx:then'] },
    { say: 'While you wait, keep applying. If there is no news after a week, send one polite follow-up.', flow: ['thx>wait:then'] },
    { say: 'If you get an offer, read it carefully. If not, ask for feedback and use your notes to improve.', flow: ['wait>res:result'] },
  ]), [
    faq('How long should I wait before following up after an interview?', 'If the employer gave a date, wait until it passes. If not, about a week is reasonable. Send one polite message, and another after a week or two at most.'),
    faq('Is it okay to ask for feedback after a rejection?', 'Yes, politely and once. Not every employer will reply, but feedback can help you improve for the next interview.'),
  ]),
];
