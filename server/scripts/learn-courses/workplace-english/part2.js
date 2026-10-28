import { P, H, L, O, N, C, task, check, faq, n, A, les } from '../kit.js';

const S2 = 'Emails and Messages';
const S3 = 'Speaking and Listening';

export const lessons = [
  // ---------------------------------------------------------------- 8
  les(S2, 'reports-notes-and-meeting-minutes', 'Short Reports, Notes and Meeting Minutes in Plain English', 'Write Reports, Notes and Meeting Minutes',
    'Write short work reports, daily updates and meeting minutes in plain English, with a clear structure, bullet points and action lists that people actually read.', [
    P("Not all work writing is an email. You will also write daily updates, short reports, shift handovers, incident reports and notes of meetings. People who write these clearly are noticed, because many workplaces suffer from unclear, long or missing records. The good news is that useful workplace documents are short and follow simple patterns. In this lesson you learn these patterns and the plain English style that makes them easy to read."),
    H("Plain English rules"),
    L("**Use short sentences.** Aim for 15 to 20 words. One idea in each sentence.", "**Use simple words.** Use use instead of utilise, help instead of facilitate, start instead of commence, and about instead of in relation to.", "**Use active sentences.** The team finished the report is clearer than The report was finished by the team. Use passive only when the doer is unknown or unimportant.", "**Be specific.** Write 12 boxes were damaged, not several boxes were damaged. Do not invent numbers. If you do not know a number, say so.", "**Use headings and lists.** They help readers find what they need quickly.", "**Put the conclusion or the main message first,** and the details after it."),
    H("A daily or weekly update"),
    P("A short update tells your manager what is done, what is next and what needs help. Three headings are enough."),
    C('text', `Weekly update: 10 to 14 June (Rohan Mehta)

Done
- Sent 42 invoices; 3 are waiting for customer approval.
- Updated the supplier list with new bank details.

Next week
- Prepare the month-end report (due Friday 21 June).
- Train the new assistant on the stock sheet.

Problems / help needed
- The stock system was slow on Tuesday and Wednesday. I need IT to check it.`),
    P("Notice the style: short lines, facts and clear tasks. There are no long explanations. Managers read these quickly, and they will ask if they need more detail."),
    H("A shift handover note"),
    P("In factories, warehouses, hospitals, security and service work, a handover note tells the next shift what they need to know. It must be clear, correct and short."),
    C('text', `Handover: night shift to morning shift, 12 June

Machines
- Machine 3: stopped at 2 am, blade needs changing. Not yet fixed.
- Machines 1, 2 and 4: running normally.

Stock
- Low: packing tape (2 rolls left). Ordered, due tomorrow.

Safety
- Wet floor near loading bay. Sign placed. Please check again at 7 am.

Message from manager
- Visitors from the customer are coming at 10 am.`),
    L("Use the same headings every day, so readers know where to look.", "Write what happened, what is still open, and who must act.", "Add the time and the date. Add your name."),
    H("An incident report"),
    P("An incident report records what happened when there was an accident, an injury, a theft, damage or a serious problem. It must be factual, not emotional or full of opinions. Include these points."),
    O("**When and where:** date, time, exact place.", "**Who:** names of the people involved or who saw it. Follow your company rules for personal data.", "**What happened:** in order, in simple sentences, only facts. Not who is to blame.", "**Action taken:** first aid, who was told, what was done.", "**What happens next:** who will look into it, and what will be done to prevent it."),
    C('text', `Incident report: 12 June, 3:20 pm, loading bay

A pallet of boxes fell from the forklift when it turned. No one was
hit. Two boxes were damaged (about 20 items). The driver, Samuel
Adeyemi, stopped the forklift and told the supervisor at once.

Action: the area was closed and cleaned. The load was checked.
Next: the supervisor will check the forklift and the pallet wrapping,
and the team will have a short safety talk on Friday.`),
    N("Write only facts you saw or know. If you think something, say I think. Do not guess or blame in a formal report. Keep a copy, and follow your company's reporting rules, including privacy rules."),
    H("A short report"),
    P("For a longer piece, such as a project update or a recommendation, use this simple structure."),
    O("**Title and date.**", "**Summary.** The main result or recommendation in two or three sentences.", "**Background.** Why this report was written.", "**What we found.** The main facts, with bullet points or a small table.", "**Recommendation or next steps.** What should be done, by whom and by when."),
    P("Writing the summary last, after you know the full story, is easier. But it appears first in the report. Many busy readers will read only the summary."),
    H("Meeting minutes"),
    P("Minutes are a short written record of a meeting. They help people remember what was agreed. The most important part is the **action list**: who will do what by when."),
    C('text', `Minutes: Team meeting, Thursday 13 June, 10 am
Present: Rohan, Anita, Daniel, Meena (chair)
Apologies: Grace

1. Month-end report
   - The report is due Friday 21 June.
   - Anita will send the sales figures by Monday.

2. New stock system
   - The training will be on 20 June at 2 pm.
   - Daniel will book the room.

Actions
- Anita: send sales figures (Monday 17 June)
- Daniel: book the training room (Friday 14 June)
- Rohan: write the report draft (Wednesday 19 June)

Next meeting: Thursday 20 June, 10 am`),
    L("Send the minutes within a day or two, while people remember.", "Use neutral words. Write the decisions, not every comment.", "Put the action list at the top or bottom, clearly.", "Use the same layout every time."),
    H("Useful phrases"),
    C('text', `It was agreed that...        The team decided to...
The main points were...      The next step is...
X will check the figures by Friday.
We still need more information about...
Because of the delay, the date has moved to 20 June.
The result was lower than expected.   (not: very bad)`),
    H("Edit your writing"),
    O("Delete words that do not add meaning (very, really, basically, in order to can often be to).", "Cut long sentences in two.", "Replace long or rare words with simple ones.", "Check numbers, dates and names.", "Read it as if you were the busy reader. Can they find the main point in ten seconds?"),
    ...task("Write a weekly update with three headings: Done, Next week, Help needed.", "Write a handover note for a real or imagined shift.", "Take notes in a meeting or video you watch, and turn them into minutes with an action list.", "Take a long paragraph you wrote before, and rewrite it in plain English with half the words."),
    ...check("Your update fits on half a page, with facts and no long explanations.", "The minutes have a clear action list with names and dates.", "No sentence is longer than about 25 words."),
  ], A('From notes to a clear record', [
    n('notes', 'Rough notes', 'facts, names, dates', 0, 0, 'data'), n('struct', 'Structure', 'headings, lists', 1, 0, 'tool'),
    n('plain', 'Plain English', 'short, simple, active', 2, 0, 'app'), n('read', 'Easy to read', 'main point in 10 seconds', 3, 0, 'out'),
  ], [
    { say: 'Start with rough notes: what happened, who, when and what must be done.', on: ['notes'] },
    { say: 'Put them in a simple structure with headings and bullet points.', flow: ['notes>struct:organise'] },
    { say: 'Rewrite in plain English: short sentences, simple words and active verbs.', flow: ['struct>plain:edit'] },
    { say: 'Check that a busy reader can find the main point and the actions in ten seconds.', flow: ['plain>read:check'] },
  ]), [
    faq('What should meeting minutes include?', 'The date, who was present, the decisions made and an action list with who will do what by when. Keep it short and send it within a day or two.'),
    faq('What does plain English mean?', 'Writing that is easy to understand: short sentences, simple words, active verbs, specific facts and a clear structure with the main point first.'),
  ]),

  // ---------------------------------------------------------------- 9
  les(S3, 'phone-calls-and-voicemail-english', 'Phone Calls in English: Answering, Spelling Names and Leaving Messages', 'Phone Calls in English at Work',
    'Answer and make work phone calls with confidence: greetings, asking someone to repeat, spelling names and numbers, taking messages and leaving voicemail.', [
    P("Many people find phone calls harder than writing. You cannot see the other person's face, the line may be bad, and people speak fast. But phone calls are part of many jobs, from offices and shops to call centres, hotels, hospitals and logistics. The good news is that phone calls follow a pattern, and a small set of phrases will carry you through most of them. This lesson gives you those phrases and tips for the difficult moments."),
    H("Answering a call"),
    C('text', `Company:  Good morning, Bright Office Supplies. Priya speaking.
          How can I help you?
Direct:   Hello, this is Rohan Mehta. How can I help?
Asking:   May I ask who is calling?
          Could I have your name, please?`),
    P("Say the greeting, the company or department and your name. Speak a little slower than normal, and smile as you speak, because it makes your voice sound friendlier. Keep a pen and paper next to the phone."),
    H("Making a call"),
    C('text', `Hello, this is Rohan Mehta from Bright Office Supplies.
I am calling about order 5521.
Could I speak to Mr Khan, please?
Is this a good time to talk?`),
    L("Say who you are, and why you are calling, early.", "Prepare notes with the main points and numbers before you call.", "Ask if it is a good time, if the call was not planned."),
    H("Asking someone to repeat or slow down"),
    C('text', `Sorry, could you say that again, please?
Could you speak a little more slowly?
I am sorry, the line is not clear. Could you repeat that?
Could you spell that for me, please?
Let me check I understand. You said the delivery is on Friday, is that right?
Would you mind sending that to me in an email?`),
    P("It is always better to ask than to guess. People do not mind repeating. Checking by repeating information back (Let me check...) prevents mistakes with numbers, dates and addresses."),
    H("Spelling names and email addresses"),
    P("Spelling on the phone is a common problem, because many letters sound alike: B, D, P, T, V; M and N; F and S. People use a spelling alphabet. The international one is below. You can also use easy words you invent, such as B for Banana, as long as the other person understands."),
    C('text', `A  Alpha      B  Bravo      C  Charlie    D  Delta     E  Echo
F  Foxtrot    G  Golf       H  Hotel      I  India     J  Juliet
K  Kilo       L  Lima       M  Mike       N  November  O  Oscar
P  Papa       Q  Quebec     R  Romeo      S  Sierra    T  Tango
U  Uniform    V  Victor     W  Whiskey    X  X-ray     Y  Yankee
Z  Zulu`),
    C('text', `My name is Okafor. That is O, K, A, F, O, R.
My email is r.mehta at brightoffice dot com.
(Say: R, dot, M, E, H, T, A, at, brightoffice, dot, com.)
The symbol @ is said at. The symbol _ is underscore. The symbol - is dash or hyphen.`),
    H("Numbers, dates and times"),
    L("Say phone numbers digit by digit, in small groups, with a pause: nine, eight, seven (pause) six, five, four.", "For 0, you can say zero or oh. In British English, double five means 55.", "Teen numbers and tens sound alike: 13 (thirteen) and 30 (thirty). Stress the end of 13 and the start of 30, or say the digits: one three and three zero.", "Say dates clearly: the fourteenth of June, or June fourteenth. Check which one the other person means, because dd/mm and mm/dd are used differently.", "Say times with am or pm, or the 24-hour clock, and the time zone if needed: three pm Indian time."),
    H("Taking a message"),
    C('text', `I am sorry, Mr Khan is not available at the moment. Can I take
a message?
Could I have your name and phone number, please?
What is this about?
I will give him your message. He will call you back today.
Let me read that back to you: Ms Okafor, 98765 43210, please call about
the invoice. Is that correct?`),
    P("Write down the caller's name (spelled), the company, the number, the message, the date and time of the call and your name. Read it back. Then pass it on. Missing messages cause lost customers."),
    H("Putting someone on hold or transferring"),
    C('text', `Could you hold for a moment, please? I will check.
Thank you for waiting. I am sorry to keep you waiting.
I will put you through to the accounts department.
I am transferring your call. Please stay on the line.`),
    P("Do not leave people on hold for long without telling them. If it will take a while, offer to call back."),
    H("Leaving a voicemail"),
    P("Keep it short, clear and complete. Say who you are, why you are calling, what you need and your number, slowly. Say the number twice."),
    C('text', `Hello Mr Khan, this is Rohan Mehta from Bright Office Supplies,
calling at about 10:30 on Thursday. I am calling about order 5521.
Could you please call me back on 98765 43210? I repeat, 98765 43210.
I am available until 5 pm today. Thank you. Goodbye.`),
    H("Ending the call"),
    C('text', `Is there anything else I can help you with?
Thank you for calling.
Thank you for your time. Have a good day.
I will send you an email to confirm.`),
    H("Difficult situations"),
    L("**You do not understand.** Say so. Ask to repeat, or ask for an email. Never say yes when you did not understand.", "**The caller is angry.** Stay calm, speak slowly, listen without interrupting, say Sorry about that, and say what you can do (see the customer service lesson).", "**Bad connection.** Say the line is not clear, offer to call back or to move to a message.", "**A fast speaker.** Ask them to slow down. It is polite and common.", "**An unfamiliar accent.** Listen for key words, repeat what you understood, and ask again. Accents differ everywhere, and the speaker would rather repeat than be misunderstood."),
    N("Practise with a friend by phone, or record yourself saying your greeting, a spelled name and a voicemail. Listening to yourself helps you hear if you are clear and not too fast."),
    ...task("Write your own phone greeting for your job.", "Spell your full name and email address using the spelling alphabet, aloud, to a friend. Ask them to write it down and check.", "Practise a phone number and a date, aloud, until you can say them clearly.", "Record a voicemail message with your name, reason and phone number (said twice)."),
    ...check("Your friend wrote down your name and email correctly.", "Your voicemail includes who, why, number twice and time available.", "You can ask someone to repeat or slow down politely, in two different ways."),
  ], A('A clear phone call', [
    n('greet', 'Greet', 'company, name, offer help', 0, 0, 'user'), n('listen', 'Listen and check', 'repeat names and numbers', 1, 0, 'check'),
    n('act', 'Help or take a message', 'who, number, message', 2, 0, 'app'), n('end', 'End politely', 'anything else? thank you', 3, 0, 'out'),
  ], [
    { say: 'Answer with a greeting, the company or department, and your name. Speak slowly and smile.', on: ['greet'] },
    { say: 'Listen carefully. Ask the caller to repeat or spell, and check names and numbers back.', flow: ['greet>listen:then'] },
    { say: 'Help the caller, or take a message with name, number, reason and the time of the call.', flow: ['listen>act:then'] },
    { say: 'End by asking if there is anything else, thank the caller, and say goodbye.', flow: ['act>end:then'] },
  ]), [
    faq('How do I spell my name clearly on the phone?', 'Use the spelling alphabet, such as A for Alpha and B for Bravo, or simple words everyone knows. Say each letter slowly and ask the other person to read it back.'),
    faq('What should I do if I do not understand what the caller said?', 'Say so politely and ask them to repeat, speak slowly or spell it. Repeat the key points back to check. Never guess about numbers, dates or names.'),
  ]),

  // ---------------------------------------------------------------- 10
  les(S3, 'speak-up-in-meetings', 'Speak Up in Meetings: Agree, Disagree and Ask Questions', 'Speak Up in Meetings in English',
    'Join meetings with confidence: phrases to give an opinion, agree, disagree politely, ask questions, interrupt and summarise, plus online tips.', [
    P("Meetings can be uncomfortable when English is not your first language. People speak fast, jokes fly by, and by the time you have prepared your sentence, the topic has moved on. Many capable people stay silent in meetings, and then others think they have nothing to say. You can change this with some preparation and a few phrases that you can use at the right moment. You do not need to speak a lot. A few clear, useful contributions are better than many unclear ones."),
    H("Prepare before the meeting"),
    O("**Read the agenda.** Know what will be discussed. If there is no agenda, ask for one, or ask the organiser what the topics are.", "**Prepare one or two points** you want to make, and write them in short sentences. Say them aloud once.", "**Prepare one question.** A good question is a contribution.", "**Know your numbers.** If you report progress, have the facts ready.", "**Test your technology** for an online meeting."),
    H("Giving your opinion"),
    C('text', `I think we should start with the smaller customers.
In my opinion, this is the better option.
From my experience, it takes about two weeks.
I would suggest that we check the numbers first.
One idea could be to ask the supplier for a discount.
My concern is that the deadline is too close.`),
    H("Agreeing"),
    C('text', `I agree with Meena.
That is a good point.
Yes, I think that is right.
I see what you mean, and I would add that...
Exactly. That is what I found as well.`),
    H("Disagreeing politely"),
    P("In English meetings, disagreement is normal, but it should be polite, and it is about ideas, not the person. Start by recognising the other person's idea, then give your different view and your reason."),
    C('text', `I see your point, but I am not sure that will work, because...
I understand, however I have a different view.
That is one option. Another way could be...
Can I ask what the numbers are based on?
I am not sure I agree. In my experience...
Could we also consider the cost?`),
    L("Avoid You are wrong. Use I see it differently.", "Give a reason or a fact.", "Offer an alternative when you can, so you are helping, not only blocking.", "Keep a calm voice."),
    H("Asking questions"),
    C('text', `Could you explain that a little more?
What do you mean by the new process?
Sorry, I did not understand. Could you give an example?
Could you repeat the deadline, please?
What is the next step?
Who will do this, and by when?
Just to check, are we saying that the delivery is on Friday?`),
    P("A question that checks understanding is useful for everyone, because others may also be confused. People will thank you for it."),
    H("Interrupting politely"),
    C('text', `Sorry to interrupt, can I add something?
May I say something here?
Could I just come in on that point?
Excuse me, may I ask a quick question?
Sorry, could we go back to the cost for a moment?`),
    P("In some meetings, people interrupt a lot, and you may feel you never get a chance. Wait for a small pause, lean forward or raise your hand (in person or on video), and say Could I add something? Or write a note in the meeting chat and ask the chair to give you the floor. In a more formal meeting, wait for the chair to invite you."),
    H("When you do not catch what was said"),
    C('text', `Sorry, could you say that again?
I missed the last part. Could you repeat it?
Could you put that in the chat, please?
Could we go over the timeline again?`),
    H("Report your progress"),
    C('text', `The report is almost ready. I will finish it by Wednesday.
I have completed three out of five tasks.
I am waiting for the figures from Anita.
There is a problem with the delivery. I need help from the supplier.
No problems from my side. I will send the update tomorrow.`),
    H("Summarise and confirm"),
    P("Near the end of the meeting, a short summary shows leadership and helps everyone. If nobody else summarises, you can."),
    C('text', `So, to summarise: we agreed to move the deadline to 28 June.
Anita will send the figures by Monday, and I will write the draft.
Is that correct?

Just to make sure I understand, my next step is to call the supplier
and confirm the date. Is that right?`),
    H("Online meetings"),
    L("Join early. Mute your microphone when you are not speaking, and unmute when you speak.", "Use the raise hand button or chat if there is a lot of talking.", "Turn on your camera if the team does, in a tidy place with good light.", "Speak a little more slowly than normal, because of delays and poor sound.", "If your connection is bad, say so, and use chat to share your point.", "Do not do other work or look at other screens during the meeting."),
    N("If you are nervous, make your first contribution early, even if it is small, such as a short question or a comment that you agree. The first contribution is the hardest. After that, speaking becomes easier."),
    ...task("Choose a meeting you have next week. Write one opinion, one question and one progress update in short sentences.", "Practise saying three phrases for disagreeing politely, with a friend, with different topics.", "After a meeting or a video, write a three-sentence summary of the decisions and who will do what."),
    ...check("You have one opinion, one question and one update ready, and you can say them without reading.", "You can disagree without saying you are wrong.", "Your summary names the people, the tasks and the dates."),
  ], A('Contribute in a meeting', [
    n('prep', 'Prepare', 'agenda, one point, one question', 0, 0, 'data'), n('say', 'Speak early', 'opinion or question', 1, 0, 'user'),
    n('resp', 'Respond politely', 'agree or disagree with reasons', 2, 0, 'app'), n('sum', 'Summarise', 'decisions and actions', 3, 0, 'out'),
  ], [
    { say: 'Before the meeting, read the agenda and prepare one point and one question.', on: ['prep'] },
    { say: 'Speak early, even briefly. The first contribution is the hardest.', flow: ['prep>say:contribute'] },
    { say: 'Respond to others politely. Agree, or disagree with a reason and an alternative.', flow: ['say>resp:discuss'] },
    { say: 'Near the end, summarise what was decided and who will do what by when.', flow: ['resp>sum:finish'] },
  ]), [
    faq('How can I disagree in a meeting without being rude?', 'Acknowledge the idea first, then say your different view with a reason, for example I see your point, but I am concerned that... Offer an alternative when you can.'),
    faq('What if people speak too fast in meetings?', 'Ask politely: Could you say that again, please? or Could you put that in the chat? It is common, and others are usually glad you asked.'),
  ]),

  // ---------------------------------------------------------------- 11
  les(S3, 'understand-accents-and-listen-better', 'Listening Skills: Understand Fast Speech and Different Accents', 'Improve Your English Listening at Work',
    'Understand fast speakers and unfamiliar accents at work with practical listening strategies, clarifying phrases and daily practice you can do for free.', [
    P("Many learners say: I can read and write English well, but I cannot understand people when they speak. This is very common. Reading gives you time to think. Speech is fast, words join together, and different people have different accents. The good news is that listening is a skill that improves with regular practice, and there are strategies that help you in the meantime. This lesson explains why listening is hard and gives you tools for the workplace."),
    H("Why speech is hard to understand"),
    L("**Words run together.** In natural speech people say What do you want to do? as Whaddya wanna do? and Did you eat? as Jeet?. This is called connected speech.", "**Stress and rhythm.** English stresses the important words and says the others quickly and weakly. Because of this, small words like to, of and a nearly disappear.", "**Accents.** English is spoken differently in India, Nigeria, Kenya, South Africa, the UK, Canada, the United States, Australia and everywhere else. The sounds, the rhythm and some words differ. No accent is wrong.", "**Speed and nerves.** If you are afraid of not understanding, your brain works harder, and you understand less.", "**Unknown words and idioms.** A phrase such as touch base or ballpark figure does not make sense word by word."),
    H("Strategies while listening"),
    O("**Listen for key words.** You do not need every word. Numbers, names, dates, verbs and nouns carry the meaning. Focus on these.", "**Use the context.** The topic of the meeting or call helps you guess what the speaker means.", "**Do not stop at one unknown word.** If you stop to think about a word, you miss the next sentence. Note it and keep listening, then ask later.", "**Watch the speaker.** On video or in person, faces and hands help.", "**Write the key points.** Notes help memory, and you can check them at the end.", "**Check what you heard.** Say it back in your own words."),
    H("Phrases to clarify"),
    C('text', `Sorry, I did not catch that. Could you say it again?
Could you speak a little slower, please?
Do you mean that the deadline is Friday?
So, if I understand correctly, you want the report by Friday. Is that right?
What does touch base mean?
Could you write that down or send it to me by email?
Could you give me an example?`),
    P("Repeating back what you understood is one of the most powerful tools. It checks understanding, shows that you were listening and gives the speaker the chance to correct it."),
    H("Common spoken phrases at work"),
    P("Native and fluent speakers use many informal phrases in meetings. Learn the common ones."),
    C('text', `touch base            = make contact, have a short talk
get back to you       = reply later
on the same page      = understand and agree
heads up              = a warning or early notice
loop you in           = include you in the messages
bandwidth             = time and energy to do more work
deadline is tight     = there is little time
ballpark figure       = a rough number
by the end of play / EOD = by the end of the working day
action item           = a task from a meeting
ASAP                  = as soon as possible
FYI                   = for your information`),
    P("If you hear a phrase you do not know, ask: What does that mean? Most people are happy to explain. You can also search for the meaning later."),
    H("Understand accents"),
    P("The more you hear an accent, the easier it becomes. You do not need to be afraid of accents. Here is a way to improve."),
    L("Listen to English from several countries: news, talks and podcasts from the UK, Canada, India, Nigeria, Kenya, the United States and others.", "When you work with someone, notice which sounds they use differently. Most differences follow patterns.", "Do not feel shy about asking someone to repeat. People with strong accents are used to it.", "Remember that others also find your accent new. Speak clearly and a bit slowly, and you will be understood."),
    H("A daily listening routine"),
    P("Fifteen to twenty minutes a day, for a few months, works better than a long session once a week."),
    O("**Choose material you enjoy and mostly understand.** News in slow English, short talks, workplace videos, interviews or podcasts. Videos with subtitles help.", "**First listening:** listen once without subtitles for the general idea.", "**Second listening:** listen again in short pieces, and write the words you hear.", "**Check:** read the subtitles or transcript, and see what you missed. Notice words that were hard because of connected speech.", "**Repeat aloud:** say a few sentences, copying the speaker's rhythm. This is called shadowing, and it improves both listening and speaking.", "**Keep a small list** of new words and phrases, and use them in your own sentences."),
    N("Free tools are enough: many news sites, public broadcasters, video platforms and podcast apps offer English listening with subtitles or transcripts. You do not need to pay for a course to practise daily."),
    H("In your workplace"),
    L("Ask colleagues to send important instructions in writing as well.", "In meetings, ask for the agenda and notes beforehand if you can.", "Record a meeting only if it is allowed, and tell people. Some workplaces permit this. Others do not.", "If you work in a call centre, ask for calls to be reviewed with a supervisor who can help you improve.", "Take time. After a few months of regular practice, you will notice that people seem to speak more slowly. They have not changed. You have."),
    ...task("Choose a short video or podcast. Listen once for the main idea. Listen again in parts and write down 5 key words. Then check the transcript.", "Shadow one minute of speech three times, copying the rhythm.", "Write five clarifying phrases you will use in your next meeting or call, and use at least two.", "Make a list of five workplace phrases you heard this week, with the meaning."),
    ...check("You can say what the speaker's main point was, and name at least three key facts.", "You used a clarifying phrase at work without feeling embarrassed.", "You have a 15-minute listening routine for the next week."),
  ], A('Listen for meaning', [
    n('hear', 'Fast speech', 'words run together', 0, 0, 'data'), n('key', 'Catch key words', 'numbers, names, verbs', 1, 0, 'user'),
    n('chk', 'Check by repeating', 'so you mean Friday?', 2, 0, 'check'), n('grow', 'Practise daily', '15 minutes, shadowing', 3, 0, 'out'),
  ], [
    { say: 'Natural speech is fast and words run together, so you will not catch every word.', on: ['hear'] },
    { say: 'Focus on the key words, such as numbers, names, dates and main verbs, and use the context.', flow: ['hear>key:focus'] },
    { say: 'Check by repeating what you understood: So you need it by Friday, is that right?', flow: ['key>chk:confirm'] },
    { say: 'Practise for 15 minutes a day with subtitles and shadowing. Listening improves steadily.', flow: ['chk>grow:practise'] },
  ]), [
    faq('Why can I read English well but not understand people who speak it?', 'Speech is faster, words join together and accents differ. Listening is a separate skill that improves with daily practice, such as listening with subtitles and shadowing.'),
    faq('Is it rude to ask someone to repeat themselves?', 'No. It is normal and polite. Most people would rather repeat than have a misunderstanding.'),
  ]),

  // ---------------------------------------------------------------- 12
  les(S3, 'presentations-and-explaining-your-work', 'Presentations and Explaining Your Work in English', 'Presentations and Explaining Your Work',
    'Plan and give a short presentation or explain your work: a simple structure, signposting phrases, clear slides, and handling nerves and questions.', [
    P("At some point in your career, you will need to explain something to a group: show a result, introduce a plan, train a new colleague, or present a project to a manager. For many people, speaking in front of others is the most stressful part of work, and doing it in a second language adds more pressure. But a short, simple presentation is a skill that anyone can learn. This lesson gives you a structure, phrases and habits that make it manageable."),
    H("Start with the audience and the message"),
    P("Before you write anything, answer three questions."),
    O("**Who is listening?** Managers, colleagues, customers, new staff? What do they know already?", "**What is the one message** you want them to remember? If they remember only one thing, what should it be?", "**What do you want them to do** afterwards? Approve a plan, give feedback, change a habit?"),
    P("If you cannot say the main message in one sentence, you are not ready yet. Example: This quarter our delivery time improved from five days to three, and I recommend we keep the new process."),
    H("A simple structure"),
    C('text', `1. Opening       Greet. Say who you are and the topic. (30 seconds)
2. Preview       Say the 3 points you will cover.
3. Main part     Point 1, Point 2, Point 3, each with a fact or example.
4. Summary       Repeat the main message in one sentence.
5. Ending        Say thank you and invite questions.`),
    P("An old rule helps: tell them what you will say, say it, and then tell them what you said. It sounds repetitive on paper, but listeners like it, especially when they listen in a second language, because it helps them follow."),
    H("Signposting phrases"),
    P("Signposts tell the audience where you are. They are very useful for non-native speakers because they give you a fixed sentence to say when you move to the next point."),
    C('text', `Opening:     Good morning, everyone. Thank you for coming.
             My name is Rohan, and today I will talk about our new
             delivery process.
Preview:     I will cover three things: what we changed, the results,
             and the next steps.
Moving on:   Let us move on to the results.
             Now I would like to talk about...
Example:     For example, last month we...
Emphasis:    The most important point is...
Summary:     To summarise, our delivery time is now three days.
Closing:     Thank you for listening. I am happy to answer questions.`),
    H("Slides that help, not hurt"),
    L("**One idea per slide.** A short title that says the point.", "**Few words.** Aim for no more than six lines, with large text. If your audience has to read a lot, they stop listening to you.", "**Use pictures, charts and numbers** instead of long sentences. A chart helps more than a table of numbers.", "**Do not read the slide.** Say it in your own words, add the story or the reason. The slide is the outline, you are the explanation.", "**Use a simple, clean design** with two or three colours and strong contrast.", "**Check spelling,** and check how it looks on the screen in the room."),
    H("Explain a chart or a number"),
    C('text', `This chart shows our delivery time by month.
As you can see, it dropped from five days in March to three in June.
The main reason is the new packing process.
This means customers receive their orders two days earlier.`),
    P("Four steps: introduce the chart, point out the key fact, give the reason, and say what it means. This pattern can be used for any chart or table."),
    H("Explain a process or your job"),
    P("Use order words: first, next, then, after that, finally. Keep each step short. Use examples."),
    C('text', `First, the customer sends an order by email.
Next, I check the stock in the system.
Then I prepare the invoice and send it to the customer.
After that, the warehouse packs the goods.
Finally, the driver delivers them and the customer signs.`),
    H("Handle nerves"),
    L("**Prepare and practise aloud,** at least three times, ideally with a friend or in front of a mirror. Time yourself.", "**Learn your opening by heart,** the first 30 seconds. A good start calms you.", "**Breathe slowly** before you begin, and drink water.", "**Speak slowly.** Nerves make us rush. A pause is not a failure. It gives people time to understand.", "**Use short notes,** with key words, not full sentences. Do not read a script.", "**Look at friendly faces,** and at different people in the room. Keep eye contact for a few seconds with each.", "**Remember that listeners want you to do well.** Most people are kind, and they are thinking about their own work, not your mistakes."),
    H("Pronunciation and clarity"),
    L("Slow down and stress the important words.", "Practise the key words and names that you find hard. Check them in an online dictionary that has audio.", "If you make a mistake, carry on. Do not apologise again and again.", "Pause between sections."),
    H("Questions from the audience"),
    C('text', `Thank you for your question.
Could you repeat the question, please?
That is a good question. I do not have the exact figure now, but I will
find out and send it to you.
Does that answer your question?
We have time for one more question.`),
    P("If you do not know an answer, say so honestly and promise to follow up. It is better than a wrong answer. If a question is unclear, ask for it to be repeated, or repeat it in your own words: So you are asking about the cost?."),
    N("Practice makes it easier. Start with small groups, such as team meetings and training for colleagues, before bigger presentations. Each short talk builds confidence."),
    ...task("Plan a three-minute presentation about your job or a recent project. Write the main message in one sentence, three points, and the summary.", "Write your opening and your closing and say them aloud five times.", "Explain a chart or a simple process using the four steps and the order words.", "Practise the talk in front of a friend and ask for one thing to improve."),
    ...check("Your talk is about three minutes and has a clear message, three points and a summary.", "Your slides have few words and one idea each.", "You have a prepared answer to the question, I do not know."),
  ], A('A simple presentation', [
    n('open', 'Opening', 'greet, topic, preview', 0, 0, 'user'), n('main', 'Three points', 'each with a fact', 1, 0, 'app'),
    n('sum', 'Summary', 'the one main message', 2, 0, 'check'), n('qa', 'Questions', 'thank you, invite questions', 3, 0, 'out'),
  ], [
    { say: 'Open with a greeting, the topic and a preview of your three points.', on: ['open'] },
    { say: 'Cover three points, each with a fact or example. Use signposts such as Now let us move on to...', flow: ['open>main:then'] },
    { say: 'Summarise the main message in one sentence.', flow: ['main>sum:then'] },
    { say: 'Thank the audience and invite questions. If you do not know an answer, say so and promise to follow up.', flow: ['sum>qa:then'] },
  ]), [
    faq('How can I reduce nerves before a presentation in English?', 'Prepare and practise aloud several times, learn your opening, speak slowly, breathe, and use short notes instead of a script. Start with small groups to build confidence.'),
    faq('How many words should a slide have?', 'As few as possible, one idea per slide and no more than about six short lines. Use charts and pictures, and explain in your own words.'),
  ]),
];
