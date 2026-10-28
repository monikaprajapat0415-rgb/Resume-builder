import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S4 = 'People and Career';

export const lessons = [
  // ---------------------------------------------------------------- 13
  les(S4, 'customer-service-english', 'Customer Service English: Helping, Apologising and Staying Calm', 'Customer Service English Phrases',
    'A simple method and phrases for customer service in English: greet, listen, solve, apologise and handle angry customers calmly.', [
    P("Customer service is part of many jobs: shops, restaurants, hotels, banks, call centres, delivery, repair and support teams. Customers may be happy, in a hurry, confused or angry. In every case, they want the same few things: to be heard, to get clear information and to have the problem solved. If you follow a simple method and have the right phrases ready, you can stay calm and professional, even when English is not your first language."),
    H("A simple method: LEAP"),
    O("**Listen.** Let the customer finish. Do not interrupt. Take notes.", "**Empathise.** Show you understand how they feel.", "**Act.** Solve the problem, or explain clearly what you will do.", "**Perform the follow-up.** Check that they are happy, and do what you promised.")
    ,
    P("You can use any similar method. The point is a clear order: listen first, then solve."),
    H("Greeting the customer"),
    C('text', `Good morning, welcome to Sunrise Hotel. How can I help you?
Hello, thank you for calling Fast Fix. My name is Priya.
Hi, can I help you find something?
Please take a seat. I will be with you in a moment.`),
    H("Finding out what the customer needs"),
    C('text', `What can I do for you today?
Could you tell me what happened?
When did you first notice the problem?
Do you have your order number or receipt?
Could I have your name and phone number, please?
Let me check that I understand. The parcel did not arrive, is that right?`),
    P("Repeating the problem back in your own words shows you were listening, and it prevents mistakes."),
    H("Showing empathy"),
    C('text', `I understand. That must be frustrating.
I am sorry to hear that.
Thank you for telling us. I will help you with this.
I can see why you are upset.`),
    P("Empathy is not agreeing that the company is wrong, and it is not taking the blame personally. It is showing the person that you care about their problem."),
    H("Apologising"),
    C('text', `I am sorry for the inconvenience.
I apologise for the delay.
Sorry about that. Let me fix it for you.
I am sorry we did not meet your expectations.`),
    L("Apologise once, clearly, then move to the solution. Many apologies without action sound empty.", "Say what you are sorry about.", "Never blame a colleague or another team in front of the customer."),
    H("Solving the problem"),
    C('text', `Here is what I can do. I can send a replacement today, or I can
give you a refund. Which would you prefer?
I will check with my supervisor and call you back by 3 pm.
It will take about two days. I will send you an email with the details.
I will update you as soon as I have news.`),
    P("Give choices when you can. Promise only what you can really do, and then do it on time. If you do not know, say you will find out, and give a time when you will reply."),
    H("When you cannot say yes"),
    C('text', `I am sorry, but I am not able to do that. What I can do is...
Unfortunately, that is outside our policy. However, I can offer...
I understand your request. I will need to ask my manager.
Let me explain why this is not possible, and what we can do instead.`),
    P("A refusal with a reason and an alternative is much easier to accept than a plain no."),
    H("Angry customers"),
    O("**Stay calm.** The anger is about the problem, not about you. Breathe, and speak slowly and at a low, steady volume.", "**Let them speak.** Do not interrupt or argue. Often anger falls after people have been heard.", "**Show empathy and apologise.** I understand, I am sorry.", "**Ask questions** to find the facts.", "**Move to action.** Say what you will do and when.", "**Do not promise what you cannot do,** and do not make excuses.", "**Get help.** If the customer is abusive, threatens you or you feel unsafe, follow your company's rules and call your supervisor or security. You do not have to accept abuse."),
    H("Chat and email support"),
    C('text', `Hello Ms Okafor, thank you for contacting us. I am sorry that your
order arrived damaged. I have arranged a replacement, and it will be
sent tomorrow. You will receive a tracking number by email. Is there
anything else I can help you with?`),
    L("Greet by name, and thank the customer.", "Answer the question first, then add details.", "Write short sentences, and avoid slang and emojis unless your company style allows them.", "Re-read before sending, especially for spelling and numbers."),
    H("Ending the conversation"),
    C('text', `Is there anything else I can help you with?
Thank you for your patience.
Thank you for calling. Have a good day.
If you have any other questions, please do not hesitate to contact us.`),
    H("Tone and body language"),
    L("Smile, even on the phone. People can hear it.", "In person, keep an open posture, eye contact where it suits the local culture, and a calm voice.", "Use the customer's name, politely.", "Different cultures have different habits about distance, eye contact and politeness. Watch and learn what customers in your area expect."),
    N("Write down your own most common situations (for example: late delivery, wrong item, price question, complaint) and prepare two or three sentences for each. Practise them aloud until they feel natural."),
    ...task("Write a short script for your most common customer situation, using greeting, empathy, solution and ending.", "Role-play an angry customer with a friend, using the LEAP steps. Ask for feedback on your tone.", "Write a reply to a customer complaint by email or chat in under 80 words."),
    ...check("Your script has a greeting, one apology, a clear action and a polite ending.", "Your reply names the problem, gives the next step and a time.", "Your friend says that you sounded calm and clear."),
  ], A('Handle a customer problem', [
    n('listen', 'Listen', 'let them finish', 0, 0, 'user'), n('emp', 'Empathise', 'sorry to hear that', 1, 0, 'check'),
    n('act', 'Act', 'solution and time', 2, 0, 'app'), n('fol', 'Follow up', 'do what you promised', 3, 0, 'out'),
  ], [
    { say: 'Listen without interrupting, and ask questions to understand the problem.', on: ['listen'] },
    { say: 'Show you understand how the customer feels, and apologise once.', flow: ['listen>emp:then'] },
    { say: 'Say clearly what you will do and by when. Give choices if you can.', flow: ['emp>act:then'] },
    { say: 'Follow up and do what you promised. This builds trust.', flow: ['act>fol:then'] },
  ]), [
    faq('How do I stay calm with an angry customer?', 'Breathe, speak slowly, let the customer finish, say you understand and are sorry, then move to what you can do. Remember the anger is about the problem. If you feel unsafe, follow company rules and call a supervisor.'),
    faq('What do I say if I cannot give the customer what they ask for?', 'Explain politely why, and offer what you can do instead, for example: I am sorry, I cannot do that, but I can offer you a replacement.'),
  ]),

  // ---------------------------------------------------------------- 14
  les(S4, 'feedback-teamwork-and-your-manager', 'Feedback, Teamwork and Talking to Your Manager', 'Feedback and Teamwork English at Work',
    'Give and receive feedback, ask your manager for help, report problems early, discuss growth and work well in a multicultural team.', [
    P("Good English at work is not only about grammar. It is also about relationships: how you ask for help, how you receive criticism, how you tell your manager about a problem, and how you work with people from different backgrounds. These conversations can feel difficult in any language. This lesson gives you simple patterns and phrases to make them easier."),
    H("Receiving feedback"),
    P("Feedback is information about how to do better. Even when it is delivered badly, it can contain something useful. Try to stay calm, listen, and ask questions."),
    C('text', `Thank you for telling me.
Could you give me an example?
What would you like me to do differently?
I understand. I will try to improve this by next week.
Could we check again in two weeks?`),
    L("Do not defend yourself straight away. First listen to the end.", "Ask for specific examples. General comments such as not good enough are hard to act on.", "Write the points down.", "If you do not agree, say so politely and give your view later: I see it a little differently. Could we look at the figures together?"),
    H("Giving feedback"),
    P("When you lead a team or train someone, you will give feedback. A simple pattern helps: describe the situation, the behaviour, the effect, and the request."),
    C('text', `Yesterday's report had several mistakes in the totals. This caused a
delay for the finance team. Could you check the formulas before
sending next time? I am happy to help you with this.

Thank you for staying late to finish the order. It helped us deliver
on time, and the customer was very happy.`),
    L("Talk about actions, not about the person's character. The report had mistakes is better than You are careless.", "Say something positive and honest too, not only problems.", "Give feedback soon, and in private for criticism.", "End with support and a next step."),
    H("Asking for help"),
    C('text', `Could you help me with this, please? I am not sure how to start.
Do you have five minutes? I would like your advice on the schedule.
I tried A and B, but they did not work. What would you suggest?
Could you show me how to do it the first time?`),
    P("Say what you have already tried. It shows effort, and it saves time. Asking early is better than staying silent and making a big mistake later."),
    H("Reporting a problem or a delay"),
    P("Managers prefer to hear bad news early. Tell them the problem, the effect, what you have done, and what you need."),
    C('text', `I want to let you know that the supplier is late. The delivery will
come on Friday, not Wednesday. This may delay the customer order.
I have called the supplier and asked for a firm date. Could you
approve a different supplier as a backup?`),
    N("Never hide a problem hoping it will go away. Telling your manager early is a sign of responsibility, not of weakness."),
    H("Saying no or setting limits"),
    C('text', `I would be happy to help, but I have two tasks due today.
Could we do this tomorrow, or could someone else help?
I can finish A or B by Friday, not both. Which is the priority?
I am not able to take this on right now. Can we talk about it?`),
    P("Asking about priorities is very useful. It makes the manager decide, and it makes your workload visible."),
    H("Talking about your career and pay"),
    C('text', `I would like to talk about my development. Could we find a time?
I have completed the training, and I have taken more responsibility
for the monthly report. I would like to discuss my salary.
What skills do I need to develop to move to the next role?
Could you tell me what the goals for the next six months are?`),
    L("Prepare facts: what you achieved, what you learned and what you now do.", "Choose a good time, and ask for a meeting in advance. Do not raise it in a hallway.", "Say what you want, honestly and politely, and listen to the answer.", "Rules about pay differ by company and country, so check your contract and your company's process."),
    H("Working in a multicultural team"),
    L("**Speak clearly and simply.** Avoid idioms and slang that people from other countries may not know.", "**Check understanding.** Ask Does that make sense? and Let me summarise.", "**Be patient** with accents and different English. Everyone is learning.", "**Learn about differences.** Cultures differ in how direct people are, how they use titles, how they show disagreement and how they manage time. Ask and observe instead of assuming.", "**Include everyone.** In meetings, invite quieter people: Meena, what do you think?", "**Be careful with humour.** Jokes often do not travel across cultures."),
    H("Respect and boundaries"),
    L("Everyone deserves respect at work. Harassment, bullying and discrimination are not acceptable, and many countries have laws and company policies against them.", "If you experience or see this, write down what happened (date, place, words, witnesses) and use your company's process, such as your manager, HR, a union or a legal helpline in your country.", "Keep copies of important messages."),
    ...task("Think of one piece of feedback you received. Write how you could respond using three phrases from this lesson.", "Write a message to your manager reporting a real or imagined delay, with the problem, effect, action and request.", "Write a short message asking a colleague for help. Say what you have already tried.", "Prepare three facts for a conversation about your development."),
    ...check("Your delay message has the four parts and is under 80 words.", "Your help request says what you tried.", "You can give feedback about an action without criticising the person."),
  ], A('A good work conversation', [
    n('fact', 'Facts', 'what, when, effect', 0, 0, 'data'), n('say', 'Say it clearly', 'polite and specific', 1, 0, 'user'),
    n('listen', 'Listen', 'ask questions', 2, 0, 'check'), n('next', 'Agree next step', 'who does what by when', 3, 0, 'out'),
  ], [
    { say: 'Prepare the facts: what happened, when and what effect it had.', on: ['fact'] },
    { say: 'Say it clearly and politely, about the action and not the person.', flow: ['fact>say:then'] },
    { say: 'Listen to the answer and ask questions to understand the other side.', flow: ['say>listen:then'] },
    { say: 'Agree the next step: who will do what by when.', flow: ['listen>next:then'] },
  ]), [
    faq('How do I tell my manager about a problem?', 'Tell them early. Say what the problem is, what effect it has, what you have already done and what help you need.'),
    faq('How do I give feedback politely?', 'Describe the specific action and its effect, not the person, say something positive too, and finish with a request and an offer to help.'),
  ]),

  // ---------------------------------------------------------------- 15
  les(S4, 'improve-your-english-every-day-plan', 'A Daily Plan to Keep Improving Your Workplace English', 'Improve Your English Every Day: A Plan',
    'A realistic daily plan to improve work English: reading, listening, speaking and writing habits, a phrase book, free tools and tracking progress.', [
    P("Courses help, but language grows through regular use. People who improve fastest are not always those with the most talent. They are the people who practise a little every day for months. The good news is that you can do this at work and at home with free tools, and the plan below takes only 20 to 40 minutes a day. In this last lesson you build a personal plan that fits your life, your job and your goals."),
    H("Start with your goals"),
    O("**Why do you need English?** For example: to pass an interview, to talk to customers, to write emails, to move to another country, to get a promotion.", "**Which skills matter most?** Speaking, listening, writing, reading? Choose one or two to focus on first.", "**What is your situation?** How much time do you have, and who can you practise with?", "**Set a clear, small target** for 30 days, for example: write five work emails without a template, or speak for two minutes about my job without stopping."),
    H("The four skills in a daily routine"),
    P("A balanced week includes all four skills. A short routine could look like this."),
    C('text', `Listening  10 min  video or podcast with subtitles, then shadow 1 minute
Reading    10 min  a news article, a work document or a graded reader
Writing     5 min  a diary entry or a message you really need to send
Speaking    5 min  say your plan for the day aloud, or record a voice note`),
    P("If you only have ten minutes, do one skill a day and rotate. Short and regular is better than long and rare."),
    H("Listening"),
    L("Use videos, talks and podcasts in English with subtitles or transcripts.", "Choose topics you care about: your job, sport, cooking, technology. You will listen longer.", "Listen once for the main idea, once for details, then read the transcript.", "Shadow: repeat out loud, copying rhythm and stress."),
    H("Reading"),
    L("Read a little every day: news sites, blogs about your profession, manuals, company emails.", "Do not look up every word. Guess from context, and look up only words that appear again and again.", "Keep a list of useful phrases, not only single words, for example make a decision, meet a deadline, follow up."),
    H("Writing"),
    L("Write a few lines every day: a diary, a summary of your day's work, a message to a friend in English.", "Use the plain English rules of this course.", "Check with a free spelling and grammar tool, then think about each suggestion before you accept it. The tool is not always right.", "Ask a colleague or a teacher to look at an important text. Learn from your repeated mistakes."),
    H("Speaking"),
    L("Speak every day, even alone: describe what you are doing, practise your self-introduction, say your plan for tomorrow.", "Record yourself on your phone, and listen. You will hear your progress.", "Find a language partner, a colleague, a friend or an online conversation group, and speak weekly.", "Do not wait until you are perfect. Mistakes are normal, and they are how you learn.", "Practise the situations you really face: meetings, calls, customers, interviews."),
    H("Make a personal phrase book"),
    P("A small notebook or phone note with the phrases you need at work is one of the best tools. Add every new useful phrase with an example. Review it often."),
    C('text', `Phrase                  Meaning / use              My example
follow up              contact again later        I will follow up on Monday.
meet a deadline        finish on time             We must meet the deadline.
could you clarify...   please explain             Could you clarify the date?
I will get back to you reply later                I will get back to you today.`),
    L("Group phrases by situation: emails, calls, meetings, customers.", "Add your own example sentence about your job.", "Say each phrase aloud a few times. Review the list each week."),
    H("Use English at work"),
    L("Offer to write a short email or update in English, and ask a colleague to check it.", "Join a meeting and make one comment each time.", "Change the language of your phone or computer to English.", "Read the English documents of your own profession, such as manuals, safety rules or product pages.", "Find a work friend who speaks English and chat for a few minutes each day."),
    H("Free tools and resources"),
    L("Public broadcasters and news sites with English learning sections.", "Video platforms with subtitles and many English talks.", "Online dictionaries with audio (learner dictionaries explain words in simple English).", "Public libraries often have graded readers and free language apps.", "Free spelling and grammar checkers, used carefully."),
    N("Check the privacy and the cost of any app before using it, and never share work secrets, customer data or passwords with a free online tool."),
    H("Measure your progress"),
    L("Record the same 1-minute talk every month. Compare.", "Keep your writing samples. Notice how many mistakes you make each month.", "Track your habit on a calendar. A chain of days motivates.", "Look for small wins: a call you handled well, an email without corrections, a meeting where you spoke.", "Some people like a test of English, such as IELTS or TOEFL, if they need a certificate for study or immigration. Check what the organisation or country you apply to accepts."),
    H("When progress feels slow"),
    P("Everyone has plateaus, where it seems that nothing improves. This is normal. Your understanding often grows before your speaking does. Keep the routine, change materials when you are bored, and celebrate small steps. After three to six months of regular practice, most people notice a clear difference. How fast you improve depends on your starting level, your time and how much you use the language."),
    H("Your 30-day plan"),
    O("**Week 1:** choose a goal. Start the daily routine. Start the phrase book.", "**Week 2:** add one real use at work, such as an email or a comment in a meeting.", "**Week 3:** find a speaking partner. Record yourself.", "**Week 4:** review your phrase book. Compare your recordings. Set a new goal for the next month."),
    ...task("Write your goal for the next 30 days in one sentence.", "Make a routine of 20 to 40 minutes, with times and days.", "Start your phrase book with ten phrases from this course.", "Record a one-minute talk about your job today. Keep it, and record the same talk again in a month."),
    ...check("Your goal is specific and can be measured.", "Your routine has all four skills in a week.", "You have a recording to compare with later."),
  ], A('Your English routine', [
    n('goal', 'Set a goal', 'small and specific', 0, 0, 'data'), n('daily', 'Practise daily', '20 to 40 minutes', 1, 0, 'user'),
    n('use', 'Use it at work', 'emails, meetings, calls', 2, 0, 'app'), n('track', 'Track progress', 'record and compare', 3, 0, 'check'),
  ], [
    { say: 'Choose a clear, small goal for the next 30 days.', on: ['goal'] },
    { say: 'Practise a little every day: listening, reading, writing and speaking.', flow: ['goal>daily:then'] },
    { say: 'Use your English in real situations at work, and keep a phrase book.', flow: ['daily>use:then'] },
    { say: 'Track your progress with recordings and writing samples, then set the next goal.', flow: ['use>track:then'] },
  ]), [
    faq('How long does it take to improve my English?', 'It depends on your starting level, how much time you practise and how much you use English. Regular practice for a few months usually brings a noticeable difference, but there is no fixed timetable.'),
    faq('What is the best free way to practise every day?', 'Listen to English with subtitles, read short texts about your work, write a few lines, and speak aloud or record yourself. Twenty minutes a day is better than a long session once a week.'),
  ]),
];
