const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'workplace-english-course';
export const quizzes = {
  'workplace-english-tone-and-politeness': [
    Q('Which is better in workplace writing?', ['Short words and short sentences', 'Long, rare words', 'Very long sentences'], 0),
    Q('You are unsure how formal to be. What does the lesson suggest?', ['Choose neutral and watch how others write to you', 'Always be very formal', 'Always be very casual'], 0),
    Q('About how long should a sentence be?', ['About 15 to 20 words', 'About 60 words', 'About 3 words'], 0),
  ],
  'introduce-yourself-and-small-talk': [
    Q('How do you normally answer "How are you?"', ['Briefly, such as "Good, thanks. How about you?"', 'With a long description of your health', 'Not at all'], 0, 'It is more a greeting than a real question.'),
    Q('What should you include when you introduce yourself?', ['Your name, your role and one friendly detail', 'Your salary', 'Your full life story'], 0),
    Q('Which is a safe small-talk topic?', ['The weather or the journey', 'Your colleague\'s salary', 'Religion and politics'], 0),
  ],
  'clear-sentences-and-common-english-mistakes': [
    Q('Which sentence is correct?', ['She works in finance.', 'She work in finance.', 'She working in finance.'], 0, 'Add s to the verb after he, she and it.'),
    Q('When do you use the present perfect (have / has + past form)?', ['For experience or a past action with a result now, without a specific time', 'For something finished at a definite past time', 'For future plans'], 0),
    Q('Which verbs are normally NOT used with -ing?', ['Verbs of state, such as know, need and want', 'Verbs of movement', 'All verbs'], 0),
  ],
  'email-structure-subject-greeting-closing': [
    Q('What makes a good subject line?', ['Specific, short and tells the reader what it is about', 'All capital letters with exclamation marks', 'Empty'], 0),
    Q('What should the opening line do?', ['Say in one sentence why you are writing', 'Tell your life story', 'Apologise'], 0),
    Q('If you ask several things in one email, what helps?', ['A numbered list so the reader can answer each one', 'One long paragraph', 'Separate emails every minute'], 0),
  ],
  'requests-replies-and-follow-up-emails': [
    Q('Why give a reason and a deadline in a request?', ['A request with a reason is more likely to be accepted, and a deadline helps planning', 'It makes the email longer', 'It is a legal rule'], 0),
    Q('A message arrives and you cannot answer yet. What should you do?', ['Acknowledge it quickly and say when you will reply', 'Say nothing', 'Delete it'], 0),
    Q('When should you attach the file?', ['Before writing the final line, so you do not forget', 'Never', 'After sending'], 0),
  ],
  'apologies-complaints-and-saying-no-politely': [
    Q('Which is a part of a good apology?', ['Saying what happened and how you will fix it', 'Blaming others', 'Making long excuses'], 0),
    Q('A polite complaint should be…', ['Calm, factual and clear about what you want', 'Angry and in capitals', 'Full of threats'], 0),
    Q('What pattern does the lesson give for saying no?', ['Thank, say no clearly, give a short reason, offer an alternative', 'Say nothing and ignore it', 'Say yes and not do it'], 0),
  ],
  'chat-messages-teams-whatsapp-etiquette': [
    Q('You want to ask a colleague a question on chat. What is better than sending just "Hi"?', ['Put the question in the first message', 'Send "Hi" and wait', 'Send ten messages'], 0),
    Q('A thumbs-up or short "Thanks" in chat is useful because…', ['It lets the sender know you saw the message', 'It ends the project', 'It is required by law'], 0),
    Q('When is email better than chat?', ['For formal messages and anything that needs a record', 'For a quick question', 'For jokes'], 0),
  ],
  'reports-notes-and-meeting-minutes': [
    Q('Which is the plain English choice?', ['use', 'utilise', 'facilitate usage of'], 0),
    Q('An incident report should be…', ['Factual, not emotional or full of opinions', 'Full of opinions', 'Only the names'], 0),
    Q('What does a shift handover note tell the next shift?', ['What happened, what is still open, and who must act', 'Only the weather', 'Nothing'], 0),
  ],
  'phone-calls-and-voicemail-english': [
    Q('Why do people spell names with a spelling alphabet on the phone?', ['Many letters sound alike, such as B, D, P, T and V', 'It is a legal rule', 'It is faster'], 0),
    Q('How should you say a phone number?', ['Digit by digit, in small groups, with a pause', 'As one long number quickly', 'Only the last three digits'], 0),
    Q('What is better when you did not catch something?', ['Ask the person to repeat or slow down', 'Guess', 'Hang up'], 0),
  ],
  'speak-up-in-meetings': [
    Q('How can you prepare before a meeting?', ['Read the agenda and prepare one or two points and a question', 'Skip the agenda', 'Learn a speech by heart'], 0),
    Q('Which is a polite way to disagree?', ['"I see it differently, and here is why."', '"You are wrong."', 'Staying silent and complaining later'], 0),
    Q('Why is a short summary at the end of a meeting useful?', ['It shows leadership and helps everyone confirm what was agreed', 'It makes the meeting longer', 'It is never useful'], 0),
  ],
  'understand-accents-and-listen-better': [
    Q('Why is speech harder to understand than writing?', ['Words run together and people speak fast with different accents', 'Speech has no words', 'Reading is always harder'], 0),
    Q('What helps you follow a fast speaker?', ['Listen for key words like numbers, names and verbs and use the context', 'Understand every single word', 'Stop at the first unknown word'], 0),
    Q('Why repeat back what you understood?', ['It checks understanding and lets the speaker correct you', 'It annoys people', 'It saves time always'], 0),
  ],
  'presentations-and-explaining-your-work': [
    Q('What should you decide first when preparing a presentation?', ['Who is listening and the one message you want them to remember', 'Which colours to use', 'How many slides'], 0),
    Q('How many ideas should one slide have?', ['One', 'Ten', 'As many as fit'], 0),
    Q('What do signposting phrases do?', ['Tell the audience where you are in the talk', 'Hide your notes', 'End the talk'], 0),
  ],
  'customer-service-english': [
    Q('What does the first L in LEAP stand for?', ['Listen', 'Leave', 'Laugh'], 0),
    Q('What should you do when you apologise to a customer?', ['Apologise once clearly, then move to the solution', 'Blame a colleague', 'Apologise many times with no action'], 0),
    Q('What should you promise to a customer?', ['Only what you can really do, on time', 'Anything to end the call', 'Nothing ever'], 0),
  ],
  'feedback-teamwork-and-your-manager': [
    Q('Someone gives you feedback. What should you do first?', ['Listen to the end before defending yourself', 'Argue at once', 'Ignore it'], 0),
    Q('When should you tell your manager about a problem or delay?', ['Early', 'As late as possible', 'Never'], 0),
    Q('Which feedback is better?', ['"The report had mistakes."', '"You are careless."', '"You are bad."'], 0, 'Talk about actions, not about the person\'s character.'),
  ],
  'improve-your-english-every-day-plan': [
    Q('What kind of practice does the lesson favour?', ['Small steady practice every day', 'One long session a year', 'Only memorising grammar rules'], 0),
    Q('Which is a good way to build a habit?', ['Fix a small daily time and keep a record', 'Wait until you feel ready', 'Study only before exams'], 0),
    Q('When reading, how should you deal with new words?', ['Guess from context and look up only words that appear again and again', 'Look up every single word', 'Skip reading'], 0),
  ],
};
