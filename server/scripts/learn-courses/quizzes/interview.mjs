const Q = (q, options, answer, explain = '') => ({ q, options, answer, explain });
export const course = 'interview-preparation-for-freshers';
export const quizzes = {
  'how-fresher-interviews-work': [
    Q('Do all jobs use the same interview stages?', ['No, the process differs by company, industry and country', 'Yes, always the same five rounds', 'Only big companies interview'], 0),
    Q('What is the screening call mainly testing?', ['Whether you are reachable, clear and basically suitable', 'Your technical depth', 'Your salary'], 0),
    Q('A written or online test usually checks…', ['A basic skill level at scale, often accuracy under time pressure', 'Your hobbies', 'Your family background'], 0),
  ],
  'research-the-company-and-role': [
    Q('What is the best clue to what an employer wants?', ['The job advert', 'The company logo', 'The reception area'], 0),
    Q('What should you do if you lack a skill the advert lists?', ['Be honest and mention something similar you have used and that you learn quickly', 'Claim you have it', 'Avoid the interview'], 0),
    Q('Why copy the advert into a document?', ['So you do not lose it if the link disappears', 'To post it online', 'To change the requirements'], 0),
  ],
  'know-your-resume-and-projects': [
    Q('What is the rule for what to write on your resume?', ['Only write what you can explain', 'Write everything you have heard of', 'Copy skills from the advert'], 0),
    Q('What are the three parts of the project story?', ['The problem, your part, and the result and lesson', 'Title, date and place', 'Tools, cost and team size'], 0),
    Q('You did not measure results in your project. What should you do?', ['Say what you observed instead of inventing a figure', 'Invent a percentage', 'Skip the project'], 0),
  ],
  'tell-me-about-yourself-answer': [
    Q('What structure does the lesson suggest for "Tell me about yourself"?', ['Present, Past, Future', 'Childhood, school, hobbies', 'Strengths, weaknesses, salary'], 0),
    Q('About how long should the answer be?', ['60 to 90 seconds', '10 minutes', '10 seconds'], 0),
    Q('What should you leave out?', ['Your life story and details not connected to the job', 'Your relevant skills', 'Your studies'], 0),
  ],
  'strengths-and-weaknesses-answers': [
    Q('What makes a strength believable?', ['A short real example', 'Using big words', 'Saying it twice'], 0),
    Q('Which weakness answer does the lesson warn against?', ['Clichés like "I am a perfectionist"', 'A real small weakness with progress', 'An honest skill gap you are working on'], 0),
    Q('What are the three parts of a good weakness answer?', ['A real small weakness, what you do about it, and the progress you made', 'A joke, a story and a question', 'Blame, excuse and apology'], 0),
  ],
  'why-this-company-why-hire-you': [
    Q('Why is "I need a job" alone a weak answer to "Why do you want to work here?"', ['It gives the employer no reason to choose you', 'It is a lie', 'It is too short'], 0),
    Q('Is it fine to also need the income?', ['Yes, just do not make it the only reason', 'No, never mention it', 'Only if asked twice'], 0),
    Q('What is the formula for "Why should we hire you?"', ['Need, match and proof', 'Salary, location and age', 'Skills, hobbies and dreams'], 0),
  ],
  'behavioural-questions-star-method': [
    Q('What does STAR stand for?', ['Situation, Task, Action, Result', 'Skill, Time, Answer, Review', 'Story, Team, Aim, Reply'], 0),
    Q('Which part of a STAR answer should be the longest?', ['Action', 'Situation', 'Task'], 0),
    Q('A fresher says "I have no work experience, so I have no stories". What does the lesson say?', ['Stories can come from college, projects, sports, volunteering, family work and part-time jobs', 'That is true, skip behavioural questions', 'Invent a job'], 0),
  ],
  'no-experience-gaps-career-change-questions': [
    Q('How should you answer a hard question like an employment gap?', ['Acknowledge it, give a short honest reason, show what you did, return to the job', 'Argue and defend', 'Change the dates'], 0),
    Q('Should you lie about dates to hide a gap?', ['No, dates are easy to check', 'Yes, if it is small', 'Yes, always'], 0),
    Q('For "you have no experience", what should you do?', ['Do not apologise; say what you do have, such as learning, projects and practice', 'Apologise at length', 'Say you are the best'], 0),
  ],
  'aptitude-and-written-tests': [
    Q('Someone sells leaked test papers or promises a pass for money. What should you do?', ['Do not pay; it is a scam or cheating', 'Buy one to be safe', 'Share it with friends'], 0),
    Q('What does negative marking mean?', ['Points are lost for wrong answers', 'The test is negative', 'You must finish early'], 0),
    Q('Which tells you the real topics of the test?', ['The job advert or invitation, or the recruiter', 'A random website', 'Your friends\' guesses'], 0),
  ],
  'technical-round-preparation': [
    Q('Which is better, according to the lesson?', ['Knowing eight topics deeply', 'Knowing thirty topics by name only', 'Knowing none well'], 0),
    Q('What should you do when you do not know the answer?', ['Say so honestly and think aloud about how you would approach it', 'Guess confidently', 'Stay silent'], 0),
    Q('What is a good test of whether you understand a topic?', ['Explaining it simply to a friend or a younger student', 'Reading it three times', 'Memorising the page'], 0),
  ],
  'group-discussion-and-case-questions': [
    Q('Who usually scores higher in a group discussion?', ['Candidates who make fewer, better points, listen and summarise', 'The one who talks the most', 'The one who interrupts'], 0),
    Q('What should you do in the first minute after the topic is given?', ['Write two or three ideas', 'Start talking immediately', 'Wait for others'], 0),
    Q('How does an example help?', ['It makes your point stronger than a general statement', 'It makes you talk longer', 'It is not needed'], 0),
  ],
  'phone-and-video-interviews': [
    Q('What should you do a day before a video interview?', ['Test your internet, the app and your device', 'Nothing', 'Reinstall your device'], 0),
    Q('Where should the light fall?', ['On your face, not behind you', 'Behind your head', 'In the corner'], 0),
    Q('What background does the lesson suggest?', ['A plain wall or tidy corner', 'A messy room', 'A silly virtual background'], 0),
  ],
  'salary-notice-period-and-your-questions': [
    Q('Before naming a salary, what should you do?', ['Research pay for similar roles in the same city', 'Pick a random number', 'Say any amount'], 0),
    Q('If asked for salary expectations, what is a good answer?', ['A range based on your research', 'A single very high number', 'Refusing to talk'], 0),
    Q('Should you lie about past pay?', ['No', 'Yes, to get more', 'Only in writing'], 0),
  ],
  'interview-day-checklist-and-job-scams': [
    Q('What is the most common avoidable mistake on interview day?', ['Being late', 'Wearing too much black', 'Eating breakfast'], 0),
    Q('Which of these does a real employer NOT do?', ['Ask you to pay a fee to get the job', 'Ask for your CV', 'Tell you the interview time'], 0, 'Fees to get a job are a scam sign. Report it to your local cybercrime service.'),
    Q('What should you do with your phone before you walk in?', ['Silence it', 'Check messages in the waiting room', 'Record the interview'], 0),
  ],
  'after-the-interview-follow-up-and-rejection': [
    Q('When should you send a thank-you message?', ['Within 24 hours', 'After one month', 'Never'], 0),
    Q('What should you do while waiting?', ['Keep applying and keep preparing', 'Stop everything', 'Call every hour'], 0),
    Q('When you get an offer, what should you ask for?', ['The offer in writing with title, pay, hours, location and start date', 'A verbal promise only', 'Nothing'], 0),
  ],
};
