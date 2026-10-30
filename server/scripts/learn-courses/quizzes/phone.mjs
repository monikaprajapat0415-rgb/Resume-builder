const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'phone-job-search-trades-course';
export const quizzes = {
  'your-phone-is-your-job-tool': [
    Q('Which of these should you never give to anyone?', ['Your email password, bank PIN or OTP', 'Your name', 'Your town'], 0, 'An honest employer or job site never asks for them.'),
    Q('Why keep your phone charged and with some balance?', ['A job call you miss may not come again', 'To play games', 'It is a rule'], 0),
    Q('Which email name is better for job hunting?', ['sunil.kumar.electrician', 'cooldude99', 'lovely_gir123'], 0),
  ],
  'know-your-skills-and-write-them-down': [
    Q('Which sounds clearer to an employer?', ['I fix leaks, fit bathrooms and install water tanks. 6 years on houses and shops.', 'I can do plumbing.', 'I do everything.'], 0),
    Q('What kind of facts should you write?', ['Only real facts', 'Facts that sound big, even if not true', 'Nothing'], 0),
    Q('Why list your tools, machines and licences?', ['Employers want to know what you can use', 'It makes the list longer', 'It is not needed'], 0),
  ],
  'make-a-one-page-resume-on-your-phone': [
    Q('How long should the resume be?', ['One page', 'Five pages', 'Ten lines of poetry'], 0),
    Q('Which layout is better?', ['Plain, one column, simple letters', 'Many colours and pictures', 'Tiny text in boxes'], 0),
    Q('What should you check twice?', ['Your phone number and email', 'The paper colour', 'The font name'], 0, 'A wrong number means the employer cannot reach you.'),
  ],
  'photos-of-your-papers-and-privacy': [
    Q('How should you take a photo of a paper?', ['Flat, in good light, from straight above, with all four corners in the picture', 'From the side in the dark', 'Cut off the edges'], 0),
    Q('Someone asks for your ID and bank details before giving you a clear job or written offer. What should you do?', ['Stop. This is a common trick of thieves', 'Send them quickly', 'Send half of them'], 0),
    Q('Why put the pages of one paper into one PDF?', ['It is tidy and easy to send', 'It makes the file bigger', 'It is a rule of phones'], 0),
  ],
  'where-to-look-for-work': [
    Q('What is the best plan to find work?', ['Use several ways at the same time', 'Use only one website', 'Wait at home'], 0),
    Q('A job advert has no company name, no place and no clear work. What is it?', ['A warning sign', 'A great job', 'A government job'], 0),
    Q('Someone promises you a government job if you pay them. What should you do?', ['Do not pay; use official offices or websites', 'Pay quickly', 'Pay half'], 0),
  ],
  'apply-by-phone-messages-and-follow-up': [
    Q('What should a short application message include?', ['Who you are, the job you want, one or two real reasons, and how to reach you', 'Your whole life story', 'A joke'], 0),
    Q('What should an email subject line say?', ['The job and your name, like "Application: Electrician - Sunil Kumar"', 'Hi', 'Urgent!!!'], 0),
    Q('How long should a voice note be, if you use one?', ['Under 30 seconds', 'Ten minutes', 'As long as you like'], 0),
  ],
  'spot-job-scams-and-stay-safe': [
    Q('Which is a warning sign of a scam?', ['They ask you to pay money before you start', 'They give you the company address', 'They offer a written offer'], 0),
    Q('How can you check a company?', ['Search its name and call the number from its official website', 'Trust the message', 'Ask the person who messaged you'], 0),
    Q('You shared your bank details with a scammer. What should you do?', ['Call your bank at once, using the number on your bank card', 'Wait a week', 'Delete the messages'], 0),
  ],
  'prepare-for-the-interview-and-trade-test': [
    Q('When should you arrive?', ['Ten or fifteen minutes early', 'One hour late', 'Exactly on time with no plan'], 0),
    Q('What should you do with your phone in the interview?', ['Keep it on silent', 'Make calls', 'Play music'], 0),
    Q('If you will be late, what should you do?', ['Call or message and say so', 'Say nothing', 'Do not come'], 0),
  ],
  'know-your-rights-pay-and-written-agreements': [
    Q('Why ask for the offer in writing?', ['Many problems start because nothing was clear at the beginning', 'It is a fun thing to do', 'It makes you look rich'], 0),
    Q('What should you do if you cannot read the agreement well?', ['Ask a trusted person to read it with you before you sign', 'Sign it quickly', 'Sign a blank page'], 0),
    Q('If you work extra hours, what is a good habit?', ['Write down the date, start time, end time and breaks', 'Do not note anything', 'Tell no one'], 0),
  ],
  'keep-learning-and-your-seven-day-plan': [
    Q('What does the lesson say about looking for work?', ['Do a little every day; it is a job in itself', 'Do it once a month', 'Wait for a call'], 0),
    Q('If a week goes badly, what is normal?', ['A bad week happens. Rest and talk to someone you trust', 'Quit forever', 'Hide it'], 0),
    Q('Which new skill idea fits many trades?', ['Basic maths for measuring and cost', 'Making slides', 'Poetry'], 0),
  ],
};
