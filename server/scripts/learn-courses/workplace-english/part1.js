import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S1 = 'Foundations';
const S2 = 'Emails and Messages';

export const lessons = [
  // ---------------------------------------------------------------- 1
  les(S1, 'workplace-english-tone-and-politeness', 'Workplace English: Tone, Politeness and Simple Words', 'Workplace English: Tone and Politeness',
    'Learn the tone of English at work: when to be formal or friendly, how to ask politely, and why simple, clear words beat long, difficult ones.', [
    P("This course is for people who use English at work as a second or third language, or who want their workplace English to be clearer and more confident. You do not need perfect grammar or an accent like a film actor. Millions of people around the world work in English, and most of them are not native speakers. What matters at work is being **clear**, **polite** and **easy to understand**. This first lesson gives you the foundation: the tone of workplace English and the habit of choosing simple words."),
    N("A note on English: there are many correct kinds, including Indian, British, American, Canadian, Nigerian, Kenyan and South African English. Spelling and some words differ. This course uses simple, widely understood English, and points out differences when they matter. Follow the style your workplace uses, and be consistent."),
    H("Clear beats fancy"),
    P("Many learners think that long, rare words sound intelligent. At work the opposite is true. The best workplace writers use short words and short sentences, because busy people read fast and many readers are also working in a second language. Compare these pairs."),
    C('text', `Fancy:   We would like to ascertain whether you can facilitate the
         procurement of the requisite documentation.
Clear:   Can you please get the documents we need?

Fancy:   Kindly revert at the earliest.
Clear:   Please reply by Friday.

Fancy:   I am writing with regard to the aforementioned matter.
Clear:   I am writing about the invoice.`),
    P("The clear versions are not rude or childish. They are professional. A useful rule: write the way you would speak to a respected colleague, but a little more carefully. Aim for sentences of about 15 to 20 words. If a sentence is long, split it into two."),
    H("Formal and informal"),
    P("English has levels of formality. You choose the level by looking at who you are speaking to and what the situation is."),
    L("**Formal.** For people you do not know, senior managers, customers, official letters and first emails. Use full sentences, polite phrases, and no slang. Example: Dear Mr Khan, I would like to ask about the delivery date.", "**Neutral.** For most workplace messages. Friendly and polite, but not stiff. Example: Hi Priya, could you send me the report by Friday?", "**Informal.** For close colleagues and quick chats. Short, relaxed, perhaps with common spoken forms. Example: Hi Sam, got a minute?"),
    P("When you are unsure, choose **neutral**, and watch how others write to you. If your manager writes Hi and your first name, you can do the same. If someone writes Dear and Mr, answer in the same style. Mirroring the style of the other person is a safe habit."),
    H("The power of please, thank you and could"),
    P("In English, politeness is mostly in the small words and in the way you ask. Commands sound hard. Questions with could or would sound polite."),
    C('text', `Too direct:  Send me the file.
Polite:      Could you send me the file, please?
More polite: Would it be possible to send me the file today?

Too direct:  I want a day off.
Polite:      I would like to take a day off on Friday. Is that all right?`),
    L("Say **please** when you ask, and **thank you** when you receive help. Do not say it only once. A short thanks at the end of a message is normal.", "**Could you** and **Would you** are polite and very common for requests.", "**I would like** is more polite than **I want**.", "**Sorry** is for small mistakes or to get attention: Sorry, could you repeat that? **Apologise** more strongly for real errors (lesson 6)."),
    H("Soften a message"),
    P("Direct statements can sound hard in English, especially disagreement or bad news. Softening phrases make your message gentler without hiding your meaning."),
    C('text', `Hard:   You are wrong.
Softer: I see it a little differently. Can we check the numbers?

Hard:   This will not work.
Softer: I am not sure this will work. Could we try another way?

Hard:   You did not send it.
Softer: I do not think I have received it yet. Could you check?`),
    P("Useful softening words: **perhaps**, **maybe**, **a little**, **I think**, **I am not sure**, **it seems**. Use them in moderation. Too many make you sound unsure."),
    H("Say the main thing first"),
    P("In many workplaces, especially in the UK, Canada and the United States, people like the main point at the beginning. In some cultures, people give long background first, and then the request. When you write to a busy reader, start with what you need or what you want them to know. Then give the details."),
    C('text', `Less clear: Last week we had a meeting and discussed the project, and
            many things were talked about, so after that I checked
            the schedule and found a problem. Could you help?

Clearer:    Could you help me with the project schedule? I found a
            problem after last week's meeting. The delivery date
            is before the approval date.`),
    H("Respect and titles"),
    L("Use **Mr**, **Ms** or **Dr** with a family name when you are unsure: Dear Ms Okafor. Ms works for any woman, without saying if she is married.", "Use first names if the other person uses yours. In many modern workplaces first names are normal, even for senior managers.", "In some places, titles such as Sir or Madam are common and respectful. In others they sound old-fashioned or odd. Follow what you hear.", "Spell names correctly. If you are not sure, ask or check an email signature."),
    H("Words to avoid or use carefully"),
    L("Slang and jokes that depend on culture. They may not be understood.", "Very strong words, such as urgent or immediately, unless it really is urgent.", "Words about age, religion, gender, race or disability that could offend. Choose neutral words.", "Local words that may not travel. For example, prepone is used in India but is not understood in many other places. If you work with people in other countries, use common words: move earlier."),
    ...task("Rewrite these three messages to be clearer and more polite: Send the report today. / I want the answer now. / Kindly revert at the earliest.", "Take one long email or message you wrote, and split every sentence longer than 25 words.", "Write the same request in a formal, a neutral and an informal version for a colleague, a manager and a customer."),
    ...check("Your rewrites use please, could or would, and keep each sentence short.", "You can explain the difference between formal, neutral and informal.", "Your messages put the main point near the start."),
  ], A('Make your message clear and polite', [
    n('think', 'Know the reader', 'manager, customer, friend', 0, 0, 'user'), n('level', 'Choose the tone', 'formal, neutral, informal', 1, 0, 'tool'),
    n('words', 'Simple words', 'short, clear sentences', 2, 0, 'app'), n('polite', 'Polite and clear', 'main point first', 3, 0, 'out'),
  ], [
    { say: 'First think about who will read or hear your message.', on: ['think'] },
    { say: 'Choose a tone: formal for new contacts, neutral for most work, informal for close colleagues.', flow: ['think>level:choose'] },
    { say: 'Use short, simple words and sentences, and put the main point first.', flow: ['level>words:write'] },
    { say: 'Add please, could and thank you. The message is clear, polite and easy to understand.', flow: ['words>polite:finish'] },
  ]), [
    faq('Do I need perfect English to work in an English-speaking company?', 'No. Clear, polite and understandable English is what matters. Many successful workers use English as a second language and keep improving with practice.'),
    faq('Is it rude to write short sentences?', 'No. Short, clear sentences are professional and easier for busy readers, especially those who read English as a second language.'),
  ]),

  // ---------------------------------------------------------------- 2
  les(S1, 'introduce-yourself-and-small-talk', 'Introduce Yourself and Make Small Talk at Work', 'Introduce Yourself and Small Talk at Work',
    'Greet people, introduce yourself and others, and make friendly small talk in the first days at a new job. Includes useful phrases and sample conversations.', [
    P("The first week at a new job, or the first minute in a meeting, you need to say who you are. Many learners know the grammar well, but feel nervous speaking. This lesson gives you ready phrases for introductions and for small talk, the light, friendly conversation that builds good working relationships. Small talk may feel unimportant, but in many workplaces it is how trust starts."),
    H("Greetings"),
    C('text', `Time of day       Greeting
Morning           Good morning.
Afternoon         Good afternoon.
Evening           Good evening.
Any time, friendly  Hello. / Hi.
Meeting someone   Nice to meet you. / Pleased to meet you.
Asking about the other person   How are you? / How is your day going?`),
    P("A common habit in English is that **How are you?** is a greeting more than a real question. The normal answer is short: **I am fine, thank you. And you?** or **Good, thanks. How about you?** You do not need to describe your health. Smile and give a short answer."),
    H("Introduce yourself"),
    P("Keep it short, and give your name, your role and one friendly detail."),
    C('text', `Hello, I am Meena Iyer. I joined the accounts team this week.
Nice to meet you.

Hi, my name is Tunde. I work in the warehouse, on the evening shift.

Good morning, I am Grace Wanjiru from the sales team. I am
responsible for customers in the north.`),
    L("**My name is...** or **I am...** Both are fine. Say your name clearly. If your name is hard for others, say it slowly and spell it if needed.", "**I work in / I work as...** I work in logistics. I work as a technician.", "**I joined this week / last month / in March.**", "**I am responsible for...** or **I look after...** to describe your tasks.", "**I am from...** if you want to say where you come from."),
    H("Introduce another person"),
    C('text', `Priya, this is Daniel. Daniel, this is Priya.
Daniel works in IT. Priya is in HR.

Let me introduce you to my colleague, Hassan.
Have you met Aisha? She is our new designer.`),
    P("When you introduce two people, say the name of the more senior or older person first in formal situations, or just say both. Add a small fact so the two have something to talk about."),
    H("Handshakes and greetings"),
    P("Customs differ. In many workplaces a handshake is normal at a first meeting. In others people nod, say hello with a hand on the chest, or avoid touching. Some people prefer not to shake hands for personal or religious reasons. Watch what others do, and follow the lead of the other person. A smile and a clear greeting always work."),
    H("Remember and use names"),
    P("People like to hear their own name. After you are introduced, use the name in the conversation: Nice to meet you, Daniel. If you forget a name, it is fine to say: I am sorry, could you tell me your name again? That is much better than guessing."),
    H("Small talk: safe topics"),
    L("**Work and the day.** How is your day going? Busy morning?", "**The journey.** Did you have a good trip? How was the traffic?", "**Weather.** It is very hot today, is it not? (This is a very common, easy topic.)", "**Food and breaks.** Have you had lunch? Do you know a good place nearby?", "**The weekend.** Did you have a good weekend? Any plans for the weekend?", "**Sports, events and festivals,** if you know they are of interest to the other person.", "**The company and place.** How long have you worked here? What do you like about this city?"),
    H("Topics to be careful with"),
    P("At work it is best to avoid topics that can offend or make people uncomfortable, at least until you know the person well. These include religion, politics, salary and personal money, age, weight and appearance, family problems, health details and any joke that makes fun of a group of people. Questions that seem friendly in one culture can feel too personal in another. For example, asking someone about marriage or children is normal in some places and private in others. Follow the other person's lead."),
    H("Keep a conversation going"),
    P("A good small talk habit is: **answer, then ask back**. If someone asks, Did you have a good weekend?, do not only say Yes. Add one detail and ask a question."),
    C('text', `A: Did you have a good weekend?
B: Yes, thank you. I visited my family. How about you?
A: I stayed at home and watched a cricket match. Did you go far?
B: No, just to my parents' house in the next town.`),
    P("Use **open questions** that cannot be answered with Yes or No, starting with what, how or where. How do you find the new office? is better than Do you like the office?."),
    H("End a conversation politely"),
    C('text', `It was nice talking to you.
I should get back to work. See you later.
Good to meet you. I hope we can talk again soon.
Excuse me, I need to take a call.`),
    H("When you do not understand"),
    C('text', `Sorry, could you say that again, please?
Could you speak a little more slowly?
Sorry, I did not catch that.
What does that word mean?`),
    P("Asking is not a weakness. It shows that you want to understand, and it saves mistakes later. Lesson 11 covers listening in more detail."),
    ...task("Write and say aloud your introduction in three versions: for a new team, for a customer and for a friendly colleague.", "Prepare three small talk questions and three answers about your weekend, your journey and your day.", "Practise an end-of-conversation phrase and a phrase for asking someone to repeat."),
    ...check("Your introduction is under 20 seconds and includes your name, your role and one friendly detail.", "You can answer a small talk question and ask one back.", "You know at least three topics to avoid at work until you know people well."),
  ], A('A friendly first conversation', [
    n('greet', 'Greet', 'good morning, hello', 0, 0, 'user'), n('intro', 'Introduce yourself', 'name, role, detail', 1, 0, 'app'),
    n('talk', 'Small talk', 'answer, then ask back', 2, 0, 'tool'), n('end', 'End politely', 'nice talking to you', 3, 0, 'out'),
  ], [
    { say: 'Start with a greeting that fits the time of day, and a smile.', on: ['greet'] },
    { say: 'Say your name, your role and one friendly detail.', flow: ['greet>intro:then'] },
    { say: 'Make small talk about safe topics. Answer the question, then ask one back.', flow: ['intro>talk:then'] },
    { say: 'End politely, for example: It was nice talking to you. See you later.', flow: ['talk>end:then'] },
  ]), [
    faq('What should I answer when someone says How are you?', 'A short, positive answer such as I am fine, thank you. And you? is normal. It is a greeting more than a real question.'),
    faq('What topics should I avoid in small talk at work?', 'Avoid religion, politics, salary, age, appearance, health details and jokes about groups of people, until you know the person well. Safe topics are work, the journey, the weather and food.'),
  ]),

  // ---------------------------------------------------------------- 3
  les(S1, 'clear-sentences-and-common-english-mistakes', 'Clear Sentences and Common English Mistakes at Work', 'Common English Mistakes at Work',
    'Fix the mistakes that many workplace English learners make: verbs, articles, prepositions, plurals and word order. Short rules with before and after examples.', [
    P("Grammar does not have to be perfect, but a few common mistakes can make your English harder to understand or sound less professional. The good news is that most learners make the same few mistakes again and again. If you fix these, your English improves a lot. This lesson goes through the most common ones with simple rules and examples. Read the wrong and the correct version aloud, because your ear will learn the right pattern."),
    H("1. Simple present and present continuous"),
    P("Use the **simple present** for habits and facts. Use the **present continuous** (am, is or are plus verb with ing) for something happening now or around now."),
    C('text', `Habit:   I work in the accounts department.   (not: I am working in...)
Now:     I am working on the report today.
Fact:    The office opens at 9.
Wrong:   I am having a laptop.      Correct: I have a laptop.
Wrong:   I am knowing the answer.   Correct: I know the answer.`),
    P("Verbs of state, such as have (own), know, like, want, need, understand and believe, are normally not used with ing."),
    H("2. Past simple and present perfect"),
    P("Use the **past simple** for something finished at a definite time in the past. Use the **present perfect** (have or has plus past form) for experience, or a past action with a result now, without a specific time."),
    C('text', `Past simple:   I sent the email yesterday.
Present perfect: I have sent the email. (It is done now.)
Experience:    I have worked in a call centre.
With since/for: I have worked here since 2022. / for two years.

Wrong:   I am working here since 2022.
Correct: I have worked here since 2022.   (or: I have been working here)
Wrong:   I have sent it yesterday.
Correct: I sent it yesterday.`),
    H("3. Subject and verb agreement"),
    C('text', `Wrong:   The manager are coming.       Correct: The manager is coming.
Wrong:   He do not know.              Correct: He does not know.
Wrong:   My colleagues is helpful.    Correct: My colleagues are helpful.
Wrong:   She work on weekends.        Correct: She works on weekends.`),
    P("In the simple present, add **s** to the verb after he, she and it: he works, she goes, it opens. After I, you, we and they, there is no s."),
    H("4. Articles: a, an, the"),
    P("Articles are difficult, especially if your first language does not have them. Basic rules:"),
    L("Use **a** or **an** for one of many, when you mention it first or it is any one: I need a laptop. (**an** before a vowel sound: an email, an hour.)", "Use **the** when both people know which one: Please send me the report. (the one we talked about).", "Use **no article** for general plural or uncountable things: I like coffee. Customers need support. Information is important."),
    C('text', `Wrong:   I sent report yesterday.     Correct: I sent the report yesterday.
Wrong:   She is engineer.              Correct: She is an engineer.
Wrong:   I need an information.        Correct: I need some information.`),
    H("5. Uncountable nouns"),
    P("Some nouns are not counted in English, so they have no plural and take no a or an. The common ones at work: information, advice, news, equipment, furniture, work, feedback, luggage, software, staff (as a group), traffic and money."),
    C('text', `Wrong:   informations, advices, equipments, feedbacks
Correct: information, advice, equipment, feedback
Use:     a piece of advice, some information, a lot of equipment`),
    H("6. Prepositions"),
    P("Prepositions (in, on, at, to, for, about, with) are hard because they do not follow simple rules. Learn them in phrases."),
    C('text', `Time:   at 5 pm, on Monday, in June, in 2024, by Friday (not later than)
Place:  at the office, in the building, on the second floor
Verbs:  discuss the plan (not: discuss about)
        explain it to me (not: explain me)
        reply to the email
        wait for the answer
        depend on, agree with, interested in, good at, responsible for
        arrive at the office (small place) / arrive in Mumbai (city)
        in time (early enough) vs on time (at the exact time)`),
    H("7. Question and word order"),
    P("In a normal English statement the order is subject, verb, object. In questions, the helper verb goes before the subject."),
    C('text', `Statement:  You can send it today.
Question:   Can you send it today?
Wrong:      When you will send it?     Correct: When will you send it?
Wrong:      What you need?             Correct: What do you need?
Indirect:   Could you tell me when the meeting starts?  (not: when does the meeting start)`),
    H("8. Said, told, asked"),
    C('text', `He said that the meeting was cancelled.
He told me that the meeting was cancelled.   (told needs a person)
He asked me to send the file.
Wrong: He said me that...      Correct: He told me that...`),
    H("9. Common word confusions"),
    L("**Also, too, as well:** I also need a pen. I need a pen too. I need a pen as well. Do not put too at the start of a sentence in this meaning.", "**Make and do:** make a mistake, make a decision, make a call. Do a job, do your best, do research.", "**Take and bring:** bring it here (to the speaker), take it there (away from the speaker).", "**Borrow and lend:** I borrow from you. You lend to me. Can I borrow your pen? Can you lend me your pen?", "**Say and tell:** say something, tell someone something.", "**Listen to and hear:** I listen to music. I hear a noise.", "**Since and for:** since 2022 (a point in time). For two years (a length of time).", "**Fewer and less:** fewer errors (countable), less time (uncountable)."),
    H("10. Words that sound formal but are used in unusual ways"),
    P("Some phrases that are common in your region may confuse others. Examples: do the needful, kindly revert, prepone, out of station, ex-colleague for a former colleague (ex- is fine in other places, but former colleague is more neutral). These are normal in some places and not in others. In international or mixed teams, use more widely understood versions, such as please take the necessary action, please reply, move earlier, away from the office."),
    N("Do not try to fix everything at once. Choose the two or three mistakes that you make most. Check for them every time you write, for one week. Then choose the next ones. This steady method works better than studying all the rules in one night."),
    H("A simple checking routine"),
    O("Read your message slowly, out loud if you can, or use the speak or read aloud option on your computer.", "Check the verbs: present, past, and the s after he or she.", "Check articles before nouns: a, an, the.", "Check prepositions in the common phrases.", "Use a spelling checker, and also read carefully. A checker will not catch a correct word in the wrong place, such as their and there."),
    ...task("Correct these sentences: She do not know the answer. / I am working here since 2020. / Please send me informations. / Can you explain me the process? / What you want to do?", "Write your own five sentences about your work using the present simple, past simple and present perfect.", "Choose your two most frequent mistakes and write a note to remind yourself to check them in each email this week."),
    ...check("Your corrected sentences are: She does not know the answer. / I have worked here since 2020. / Please send me information. / Can you explain the process to me? / What do you want to do?", "You can explain when to use the present simple and the present continuous.", "You have a list of the two or three mistakes to watch for."),
  ], A('Check, fix, repeat', [
    n('write', 'Write your message', 'in simple words', 0, 0, 'user'), n('verbs', 'Check verbs', 'tense, he works', 1, 0, 'check'),
    n('small', 'Check small words', 'a, the, in, on', 2, 0, 'check'), n('send', 'Read aloud, then send', 'clear and correct', 3, 0, 'out'),
  ], [
    { say: 'Write your message in simple words first.', on: ['write'] },
    { say: 'Check the verbs: the right tense and the s after he, she or it.', flow: ['write>verbs:check'] },
    { say: 'Check the small words: articles such as a and the, and prepositions such as in, on and at.', flow: ['verbs>small:check'] },
    { say: 'Read it aloud, fix what sounds wrong, and then send it.', flow: ['small>send:finish'] },
  ]), [
    faq('What are the most common English mistakes at work?', 'Many learners confuse tenses, forget the s after he or she, miss articles, use the wrong prepositions and add s to uncountable nouns such as information and advice.'),
    faq('Is it better to learn all grammar rules first?', 'No. Choose the two or three mistakes you make most, check for them in every message, and then move on to the next ones.'),
  ]),

  // ---------------------------------------------------------------- 4
  les(S2, 'email-structure-subject-greeting-closing', 'Write a Professional Email: Subject, Greeting, Body and Closing', 'How to Write a Professional Email',
    'Learn the five parts of a clear work email: subject line, polite opening, short body, clear closing and signature. Sample emails included.', [
    P("Email is still the main way of writing at work. A good email saves time. A confusing one creates more emails, delays and misunderstandings. The good news is that a professional email has a simple structure that you can learn once and use for the rest of your career. This lesson shows the five parts, with examples you can copy and change."),
    H("The five parts"),
    O("**Subject line.** A short title that says what the email is about.", "**Greeting.** Dear or Hello, plus a name.", "**Opening line.** Why you are writing, in one sentence.", "**Body.** The details, in short paragraphs or a list.", "**Closing and signature.** What you want next, a polite ending, and your name and contact details."),
    H("1. The subject line"),
    P("Many people decide whether to open an email from the subject alone. A good subject is specific, short (under about 8 words) and tells the reader what to do or what it is about."),
    C('text', `Weak:    Hello         /    Urgent!!!     /    Question
Better:  Invoice 1042: payment confirmation needed
Better:  Meeting on Thursday 10 am: please confirm
Better:  Application for Sales Assistant: Priya Nair
Better:  Request: leave on 14 and 15 June`),
    L("Put the key word first, such as Request, Question, Reminder, Update or Invoice number.", "Do not write in capitals or use many exclamation marks.", "Change the subject when the topic of a long conversation changes."),
    H("2. The greeting"),
    C('text', `Formal, name known:     Dear Mr Sharma,   /   Dear Ms Okafor,
Formal, name unknown:   Dear Sir or Madam,   /   Dear Hiring Manager,
Neutral:                Hello Priya,   /   Hi Priya,
Group:                  Hello everyone,   /   Dear team,
Informal:               Hi Sam,`),
    P("Always check the spelling of the name. If you do not know whether a person is a man or a woman, you can use the full name: Dear Alex Morgan. After the greeting, use a comma. Start the next line with a capital letter."),
    H("3. The opening line"),
    P("Say in one sentence why you are writing."),
    C('text', `I am writing to ask about the delivery of order 5521.
I am writing to confirm our meeting on Thursday.
Thank you for your email of 3 June.
Following our call this morning, I am sending the details.
I hope you are well.   (friendly, optional, for people you know)`),
    H("4. The body"),
    L("One main idea in each paragraph, two to four lines at most.", "If you ask several things, use a numbered list so the reader can answer each one.", "Give the facts the reader needs: dates, numbers, names, order numbers.", "Put the most important information first.", "Mention attachments in the text: I have attached the invoice."),
    C('text', `I need three things from you:
1. The signed contract.
2. A copy of your ID.
3. Your bank details for the payment.

Please send them by Friday 14 June.`),
    H("5. Closing and signature"),
    P("End with what happens next, and thank the reader."),
    C('text', `Please let me know if you need anything else.
I look forward to your reply.
Thank you for your help.

Kind regards,        (neutral and safe)
Best regards,        (friendly)
Yours sincerely,     (formal, when you used the person's name)
Yours faithfully,    (formal, when you used Dear Sir or Madam; mostly British)
Thanks,              (informal)`),
    P("Add a simple signature with your full name, job title, company and phone number. This helps people to know who you are and how to reach you."),
    H("A complete sample email"),
    P("This sample is made up to show the shape. Names and numbers are invented."),
    C('text', `Subject: Request: delivery date for order 5521

Dear Mr Khan,

I am writing to ask about the delivery of order 5521, which we placed
on 3 June. The expected date was 10 June, but we have not received it.

Could you please tell me:
1. Where the order is now.
2. When we can expect delivery.

We need the goods for a customer event on 17 June, so an answer by
Wednesday would be very helpful.

Thank you for your help.

Kind regards,
Rohan Mehta
Purchasing Assistant, Bright Office Supplies
+91 00000 00000`),
    H("Reply, Reply All and CC"),
    L("**Reply** answers only the sender. **Reply All** answers everyone, so use it only when everyone needs your answer. Many people get annoyed by unnecessary Reply All messages.", "**CC** (copy) is for people who should know, but do not need to act. **BCC** (blind copy) hides the names of recipients, which is useful for large mailings where people should not see each other's addresses.", "Do not forward private emails without permission."),
    H("Check before you send"),
    O("Is the subject clear?", "Is the person's name correct?", "Did I include everything: dates, numbers, attachments?", "Is the tone polite?", "Did I read it once, slowly, for spelling and mistakes?", "Is the right person in the To line? Check the address letter by letter."),
    P("A useful habit: write the email first, and add the address last. It stops you from sending an unfinished email by accident."),
    N("Email may be read by others, kept for years and used as evidence. Do not write anything you would not want your manager, a customer or a lawyer to read. Do not send private or sensitive information such as passwords by email."),
    ...task("Write an email to a supplier asking for a delivery update, using the five parts.", "Write five subject lines for different situations: a leave request, a meeting invitation, a payment reminder, a job application, a question to HR.", "Check your email using the six-point list. Read it aloud once."),
    ...check("Your email has a clear subject, a greeting, an opening line, a short body and a closing with your name.", "Your subject lines would make sense if read alone.", "You can explain the difference between CC and BCC."),
  ], A('The five parts of an email', [
    n('subj', 'Subject', 'short and specific', 0, 0, 'data'), n('greet', 'Greeting', 'Dear Mr Khan,', 1, 0, 'user'),
    n('body', 'Opening and body', 'why you write, the details', 2, 0, 'app'), n('close', 'Closing', 'next step, thanks, name', 3, 0, 'out'),
  ], [
    { say: 'Write a short, specific subject line, so the reader knows what the email is about.', on: ['subj'] },
    { say: 'Greet the person by name, in the right level of formality.', flow: ['subj>greet:then'] },
    { say: 'Say why you are writing in one sentence, then give the details in short paragraphs or a list.', flow: ['greet>body:then'] },
    { say: 'Close with the next step and a thank you, then add your name and contact details.', flow: ['body>close:then'] },
  ]), [
    faq('How long should a work email be?', 'As short as possible while still being clear. Many good emails are under 150 words. Use short paragraphs and lists, and put the main point at the start.'),
    faq('Should I use Dear or Hi in an email?', 'Use Dear for formal emails and first contact. Use Hello or Hi when the tone is neutral or friendly. Follow the style of the person you are writing to.'),
  ]),

  // ---------------------------------------------------------------- 5
  les(S2, 'requests-replies-and-follow-up-emails', 'Requests, Replies and Follow-Up Emails: Phrases You Can Use', 'Email Requests, Replies and Follow-Ups',
    'Ready phrases and sample emails to ask for something, reply to a request, confirm a meeting, send a reminder and follow up politely when you get no answer.', [
    P("Most work emails fall into a few types: you ask for something, you reply to a request, you confirm an arrangement, you remind someone, or you follow up when no one answered. If you have good phrases for these, you can write most emails quickly and confidently. This lesson gives you phrases and short samples for each type. Change the names, dates and details to fit your situation, and do not copy long text word for word without thinking."),
    H("Asking for something"),
    C('text', `Could you please send me the report by Friday?
Would it be possible to move the meeting to Thursday?
I would be grateful if you could check this for me.
Please could you let me know when it will be ready?
Can you help me with the access to the system?`),
    P("Give a reason and a deadline when you can. A request with a reason is more likely to be accepted, and a clear deadline helps the other person plan."),
    C('text', `Subject: Request: sales figures for May

Hi Anita,

Could you please send me the sales figures for May? I need them for
the monthly report, which is due to Mr Verma on Friday 14 June.

If you can send them by Wednesday, I will have time to check them.

Thank you,
Rohan`),
    H("Replying to a request"),
    P("Answer clearly, say yes, no or what happens next, and say when. Always answer, even if the answer is that you need more time."),
    C('text', `Yes:      Yes, of course. I will send it by 3 pm today.
Later:    Thank you for your message. I need to check, and I will
          reply by Wednesday.
Need more info:  Could you tell me which month you need?
No:       I am afraid I cannot do that this week, because I am
          working on the audit. Could we do it next Monday?
Done:     I have attached the file. Please let me know if you need
          anything else.`),
    P("Acknowledge messages quickly, even with a short Thank you, I have received this and will reply by Friday. It stops the other person from worrying and sending reminders."),
    H("Confirming a meeting or arrangement"),
    C('text', `Subject: Meeting on Thursday 13 June, 10 am: confirmation

Dear Ms Okafor,

Thank you for your email. I am pleased to confirm our meeting on
Thursday 13 June at 10 am at your office.

I will bring the sample designs. Please let me know if you need
anything else beforehand.

Kind regards,
Daniel Mensah`),
    L("Repeat the date, time and place. It avoids mistakes.", "If you must change something, say it first: Unfortunately, I cannot attend at 10 am. Would 2 pm be possible?", "Time zones matter for international work. Write the zone: 10 am IST, 3 pm GMT. Many calendar tools do this for you."),
    H("Sending an attachment"),
    C('text', `I have attached the signed contract.
Please find attached the invoice for May.
The report is attached. Let me know if you cannot open it.`),
    P("Attach the file before you write the final line. Many people forget. Say what the file is, and use a clear file name, such as `Invoice-1042-May.pdf`."),
    H("Reminders"),
    P("A reminder should be friendly and short. Assume the person was busy, not careless."),
    C('text', `Subject: Reminder: invoice 1042, payment due 14 June

Dear Mr Khan,

I hope you are well. This is a friendly reminder that invoice 1042
is due for payment on 14 June. I have attached a copy for your
convenience.

Please let me know if you have any questions. If you have already
paid, please ignore this message.

Kind regards,
Rohan Mehta`),
    H("Following up when no one replied"),
    P("When you get no answer, wait a reasonable time, usually two to five working days, depending on how urgent it is. Then send a polite follow-up. Reply to your original email so that the history is there."),
    C('text', `Subject: Re: Request: sales figures for May

Hi Anita,

I am following up on my email of 6 June. Could you please send the
May figures by tomorrow? I need to send the report at 5 pm.

Thank you for your help. Please tell me if there is a problem.

Rohan`),
    L("First follow-up: polite, short, with the deadline.", "Second follow-up: shorter, perhaps add your manager in CC if the matter is important and urgent, and say so politely.", "Another channel can help: a short chat message or phone call, if email is ignored.", "Avoid sarcasm, such as As I mentioned in my previous three emails. It damages relationships."),
    H("Thanks and closing a conversation"),
    C('text', `Thank you for your quick reply.
Thanks again for your help with this.
I really appreciate your support.
Thank you, that is all I need for now.`),
    H("Useful connecting words"),
    L("**First, then, after that, finally** to put steps in order.", "**Because, so, therefore** to give reasons and results.", "**However, but, although** to show a contrast.", "**Also, in addition** to add a point.", "**For example, such as** to give examples."),
    N("Think of three categories of phrases: ask, answer, remind. Collect the ones that you like from your colleagues' emails and keep them in a note on your phone or computer. Over time you will have your own phrase bank."),
    ...task("Write an email asking a colleague for a document, with a reason and a deadline.", "Write a reply that says you need more time, and gives a new date.", "Write a polite reminder for something that was due last week.", "Write a follow-up for an email that has had no answer for four working days."),
    ...check("Each email has a clear request or answer and a date.", "Your reminders sound friendly and avoid blame.", "You can use at least five new phrases from this lesson."),
  ], A('Ask, answer, remind', [
    n('ask', 'Ask', 'reason and deadline', 0, 0, 'user'), n('rep', 'Reply', 'yes, no or later, with a date', 1, 0, 'app'),
    n('rem', 'Remind', 'friendly and short', 2, 0, 'tool'), n('fol', 'Follow up', 'after 2 to 5 working days', 3, 0, 'check'),
  ], [
    { say: 'Ask clearly, give a reason, and give a deadline if you can.', on: ['ask'] },
    { say: 'The reader replies quickly, even if only to say when they will answer.', flow: ['ask>rep:answer'] },
    { say: 'If a due date passes, send a short, friendly reminder.', flow: ['rep>rem:if late'] },
    { say: 'If there is still no answer after a few working days, follow up politely, and try another channel if needed.', flow: ['rem>fol:no reply'] },
  ]), [
    faq('How long should I wait before sending a follow-up email?', 'Usually two to five working days, depending on how urgent the matter is. Be polite and short, repeat the deadline, and reply on the same email thread.'),
    faq('How do I say no politely in an email?', 'Thank the person, say that you cannot do it, give a short reason, and offer an alternative if you can, such as another date.'),
  ]),

  // ---------------------------------------------------------------- 6
  les(S2, 'apologies-complaints-and-saying-no-politely', 'Apologies, Complaints and Saying No Politely', 'Apologise, Complain and Say No Politely',
    'Write and say difficult messages with care: apologise for a mistake, make a complaint without anger, refuse a request, and give bad news clearly and kindly.', [
    P("Not every message is easy. You will sometimes make mistakes and need to apologise. You will sometimes have to complain about a late delivery or a wrong invoice. You will sometimes have to say no to a request, or deliver bad news. These moments are where good English matters most, because the wrong tone can hurt a relationship. This lesson gives you a calm structure and exact phrases for each situation."),
    H("Apologising for a mistake"),
    P("A good apology has four parts: say sorry, say what happened in one clear sentence, say how you will fix it, and say how you will prevent it. Do not make long excuses and do not blame others."),
    C('text', `Subject: Apology: error on invoice 1042

Dear Mr Khan,

I am sorry for the mistake on invoice 1042. The quantity was entered
as 50 instead of 15, and so the total was wrong.

I have attached a corrected invoice. Please ignore the earlier one.
To avoid this in future, a second person now checks each invoice
before it is sent.

Thank you for your patience.

Kind regards,
Rohan Mehta`),
    C('text', `Light:   Sorry for the delay in replying.
Normal:  I am sorry for the mistake.
Strong:  I sincerely apologise for the inconvenience this has caused.
Do not:  Sorry, but it was not really my fault... (this cancels the apology)`),
    P("For small things, a short **Sorry about that** is enough. For serious errors, use a stronger phrase and say what you are doing about it. Take responsibility. People forgive mistakes more easily when you are honest and act quickly."),
    H("Making a complaint politely"),
    P("A complaint works better when it is calm, factual and clear about what you want. Anger makes people defensive. Facts make them act."),
    C('text', `Subject: Complaint: order 5521 not delivered

Dear Customer Service Team,

I am writing about order 5521, which I placed on 3 June. The
delivery date was 10 June, but I have not received the goods, and
I have not had a reply to my two earlier emails (6 and 8 June).

I would like to know where the order is, and to receive it by 14 June.
If this is not possible, I would like a full refund.

I would be grateful for a reply by Wednesday.

Yours sincerely,
Rohan Mehta`),
    L("State the facts: the order number, dates, what happened.", "Say what you want: delivery, refund, replacement, correction.", "Give a deadline.", "Keep the tone firm and polite. Avoid insults, capital letters and threats.", "Keep a copy of your messages and receipts.", "If the company does not answer, look for the formal complaints process, a consumer protection office or an ombudsman in your country."),
    H("Saying no"),
    P("Refusing is a normal part of work. The skill is to say no without damaging the relationship. A useful pattern: **thank, say no clearly, give a short reason, offer an alternative**."),
    C('text', `Thank you for asking me to join the project.
Unfortunately, I cannot take it on at the moment, because I am
working on the year-end accounts until 30 June.
I could help in July, or I can suggest a colleague who might have time.

I am afraid that is not possible this week.
I would like to help, but I cannot finish it by Friday.
Unfortunately, we cannot offer a discount on this order.
I understand your request, but I cannot approve it. I will ask my manager.`),
    P("**I am afraid** is a polite way to give bad news, and it does not mean you are afraid. **Unfortunately** also softens bad news. Do not say only No. in writing. It sounds cold. Do not promise something you cannot do just to avoid saying no. It causes more trouble later."),
    H("Giving bad news"),
    C('text', `I am sorry to tell you that the shipment has been delayed by a week.
The delay is caused by a problem at the port. We will send the new
date as soon as we have it.
I understand this causes difficulties, and I will keep you informed.`),
    L("Say it clearly near the start. Do not hide the bad news at the end of a long message.", "Say what is known, and what is not yet known.", "Say what you are doing, and when you will update them.", "Be kind. Show that you understand the effect on the person."),
    H("Disagreeing politely"),
    C('text', `I see your point, but I have a different view.
I am not sure I agree. Could we look at the figures again?
That is a good idea. Another option might be...
I understand, however I am concerned that...`),
    H("Handling a message that makes you angry"),
    O("Do not reply at once. Wait an hour, or until the next day if you can.", "Read it again. Sometimes the tone is less hard than it first seemed.", "Write your reply, then remove any emotional or personal words.", "Ask a trusted colleague to read it if the matter is serious.", "Send it, or talk to the person by phone or in person if the email has become a quarrel."),
    N("If someone treats you with disrespect, harasses you or threatens you at work, you do not have to accept it. Keep records and report it to your manager, HR or the proper authority in your country."),
    ...task("Write a short apology for a late reply, and a longer one for an error on a document.", "Write a polite complaint about a late delivery using the four parts: facts, what you want, deadline, polite tone.", "Write two refusals: one to a colleague who asks for help at a bad time, and one to a customer who asks for a discount.", "Practise saying each one aloud with a calm voice."),
    ...check("Your apology does not blame anyone and says how you will fix it.", "Your complaint states the facts and what you want in a calm voice.", "Your refusals offer an alternative if possible."),
  ], A('Handle a difficult message', [
    n('calm', 'Stay calm', 'wait before replying', 0, 0, 'user'), n('facts', 'State the facts', 'what, when, which order', 1, 0, 'data'),
    n('act', 'Say the action', 'fix, request or alternative', 2, 0, 'app'), n('tone', 'Keep it polite', 'firm, not angry', 3, 0, 'out'),
  ], [
    { say: 'If a message makes you angry or upset, wait before you reply.', on: ['calm'] },
    { say: 'State the facts: what happened, when and which order or document.', flow: ['calm>facts:then'] },
    { say: 'Say the action: how you will fix it, what you want, or what you can offer instead.', flow: ['facts>act:then'] },
    { say: 'Keep the tone firm and polite. A calm message gets a better result than an angry one.', flow: ['act>tone:finish'] },
  ]), [
    faq('How do I apologise professionally at work?', 'Say sorry, explain what happened in one clear sentence, say how you will fix it, and say how you will prevent it. Avoid long excuses and blaming others.'),
    faq('How can I say no without sounding rude?', 'Thank the person, say no clearly, give a short reason and offer an alternative. Phrases such as I am afraid or unfortunately soften the message.'),
  ]),

  // ---------------------------------------------------------------- 7
  les(S2, 'chat-messages-teams-whatsapp-etiquette', 'Chat Messages at Work: Teams, Slack and WhatsApp Etiquette', 'Chat Message Etiquette at Work',
    'Write short, clear work chat messages, use greetings and emojis sensibly, respect working hours and time zones, and know when to use chat, email or a call.', [
    P("Many workplaces now use chat tools: Microsoft Teams, Slack, Google Chat and WhatsApp groups. Chat is fast and informal, but there are still rules. A badly written chat message can be confusing, rude or lost. This lesson shows you how to write short, clear messages, and how to behave in group chats so that you look professional."),
    H("Chat, email or call?"),
    L("**Chat** for quick questions, short updates and friendly contact, when a fast answer is useful.", "**Email** for formal messages, longer explanations, anything that needs a record, and messages to people outside your company.", "**Phone or video call** when the matter is complicated, emotional or urgent, or when messages are going back and forth many times.", "**In person** for sensitive matters such as serious feedback or a personal problem."),
    P("If you are not sure, think about what the other person would prefer. If a reply to a chat message will take a long explanation, a short call may be quicker than 20 messages."),
    H("Write a clear chat message"),
    P("Do not send just Hi and wait. This forces the other person to reply Hi and wait for the question, wasting time. Put the question in the first message."),
    C('text', `Weak:   Hi
        (waiting...)

Better: Hi Priya, do you have the latest sales sheet? I need it for
        the 3 pm meeting.

Weak:   Can you check?
Better: Could you check the invoice for Mr Khan? The total looks wrong
        (5,000 instead of 1,500).`),
    L("Start with a short greeting and the person's name.", "Give the context, the question and the deadline in one message if you can.", "Use short sentences and one topic per message.", "Use a list or separate lines for several points.", "Mention people with @ when you need them to act, and do not mention everyone unless it is really necessary."),
    H("Replies"),
    C('text', `Thanks, got it.
Sure, I will send it in 10 minutes.
I will check and get back to you by 4 pm.
Sorry, I am in a meeting. Can I reply after 3?
Good question. I am not sure. I will ask Dan.`),
    P("Reply even with a quick acknowledgement. A thumbs-up or a short Thanks lets the sender know that you saw it. If you cannot help, say so and suggest someone else."),
    H("Tone in chat"),
    P("Without a voice or face, short messages can sound cold or angry. Add small friendly words (Thanks, please, no problem) and read your message before sending."),
    C('text', `Sounds cold:   Send it.
Friendlier:    Could you send it when you can? Thanks!

Sounds cold:   No.
Friendlier:    Sorry, I cannot do that today. Can we do it tomorrow?`),
    P("Emojis are common in some workplaces and not in others. A smile or a thumbs-up is usually fine with colleagues you know. Avoid them in messages to customers or senior people you do not know, unless they use them first. Do not use many, and avoid ones that can have other meanings. CAPITAL LETTERS look like shouting. Avoid them."),
    H("Group chats and WhatsApp"),
    L("**Check who is in the group** before you write. Do not post anything private or critical about a person in a group.", "**Stay on topic.** Do not share jokes, forwards, religious or political messages in a work group, unless the group is meant for that.", "**Do not send many short messages.** Put your point in one.", "**Respect time.** Avoid messages late at night or on days off, unless it is urgent or the team has agreed to it. Many people mute notifications after work.", "**Use voice messages carefully.** They are hard to search and slower to listen to. Ask before sending a long one.", "**Keep personal and company data safe.** Do not share passwords, customers' private details or confidential files in a personal chat app, unless the company allows it.", "**Do not forward private messages** without permission."),
    H("Time zones and availability"),
    P("When you work with people in other countries, a good time for you may be the middle of the night for them. Check the other person's time before you expect a reply. Write times clearly with the zone: 3 pm IST, 10:30 GMT, 9:30 am EAT (East Africa Time). Set your status (available, busy, away), and tell your team when you are on leave."),
    H("Chat and the record"),
    P("Chat messages can be saved and read later, and they may be seen by managers or lawyers. Be as careful as in email. Do not write angry messages or comments you would not say in person. If something important is decided in chat, send a short email to confirm it."),
    H("Typing quickly but carefully"),
    L("Use a spelling checker, and read the message once.", "Do not use texting short forms such as u, r, pls, thx and gr8 with customers or senior people. Common abbreviations like FYI (for your information), ASAP (as soon as possible), EOD (end of day) and BRB (be right back) are used, but not everyone knows them, so write them out for new colleagues and customers.", "Check the names. A message that goes to the wrong person can cause trouble."),
    ...task("Rewrite these chat messages to be clear and polite: Hi / Send file / Why no reply? / Call me now.", "Write a chat message to a colleague in another time zone asking for a document, with the deadline in their time.", "List three things you will not post in your team's group chat."),
    ...check("Your messages contain the question or request in the first message.", "Your deadlines include the time zone.", "You know when to move from chat to a call."),
  ], A('Choose the right channel', [
    n('q', 'Your message', 'quick or complex?', 0, 0, 'user'), n('chat', 'Chat', 'quick, friendly', 1, 0, 'app'),
    n('mail', 'Email', 'formal, a record', 2, 0, 'tool'), n('call', 'Call', 'complex or urgent', 3, 0, 'out'),
  ], [
    { say: 'Think about what you need to say and who will read it.', on: ['q'] },
    { say: 'Use chat for quick questions and short updates. Put the question in the first message.', flow: ['q>chat:quick'] },
    { say: 'Use email for formal messages, longer explanations and anything that needs a record.', flow: ['chat>mail:longer'] },
    { say: 'Use a call when it is complicated, emotional or urgent, or when messages go back and forth too many times.', flow: ['mail>call:complex'] },
  ]), [
    faq('Is it okay to use emojis in work chat?', 'It depends on the workplace. A smile or thumbs-up is usually fine with colleagues you know. Avoid emojis with customers or senior people unless they use them first, and do not use many.'),
    faq('Should I message colleagues after work hours?', 'Avoid it unless it is urgent or your team has agreed to it. Many people mute notifications after work. Schedule non-urgent messages or send them in the morning.'),
  ]),
];
