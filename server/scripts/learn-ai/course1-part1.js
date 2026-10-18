import { P, H, L, O, N, C, F, lesson } from './helpers.js';

const LAB = 'genai-basics-lab';
const S1 = 'AI and machine learning basics';

const BUILD = N("Every lesson in this course has a small hands-on exercise in the GenAI Basics Lab, an Angular app that runs completely in your browser. You do not need an API key, an account or a server. Install Node.js 20 or newer, unzip the solution zip for the lesson, run npm install, then npm start and open http://localhost:4200. The zip for each lesson contains the whole lab up to that lesson, so you can start from any lesson. The models in these exercises are tiny teaching models. They show how the ideas work, but they are not real language models.");

export const lessons = [
  // ------------------------------------------------------------------ 1
  lesson(S1, 'what-is-artificial-intelligence', 'What Is Artificial Intelligence?', 'A plain explanation of AI, how it differs from machine learning and deep learning, and a hands-on exercise that compares a rule-based filter with one that learns from examples.', '', [
    P("Artificial intelligence, or AI, is software that does tasks we normally think need human judgement. Recognising a face in a photo, translating a sentence, recommending a job, spotting a fake message, or writing a paragraph are all examples. AI is not one single technology. It is a broad label that covers many different techniques, some very old and some very new. In this first lesson you will learn what the main words mean, see the difference between a program that follows rules and a program that learns, and build a small example of both so that you can see the difference with your own eyes."),
    P("You do not need any maths or programming knowledge to follow the ideas. If you can read a short piece of TypeScript code you will get more from the exercise, but the explanations are written in easy English, and every idea comes with an example from everyday life or from job hunting."),

    H("AI, machine learning and deep learning"),
    P("You will see three terms again and again: AI, machine learning and deep learning. They are nested, like a set of boxes. **AI** is the biggest box: any software that appears to show intelligent behaviour. **Machine learning**, often shortened to ML, is a smaller box inside it. In machine learning the program is not given the rules. Instead it is shown many examples, and it works out a pattern by itself. **Deep learning** is a still smaller box inside machine learning. It uses neural networks with many layers, and it is the technology behind most of the AI news you read today, including chat assistants such as Claude."),
    P("A simple way to remember the difference is to think about how you would teach a new person to spot a fake job message. You could write a list of rules on a card: “If the message asks for money before the job starts, it is fake.” That is the **rule-based** way. Or you could show the person two hundred real messages and two hundred fake ones, and let them develop a feeling for the difference without writing any rules down. That is the **learning** way. Both can work. They fail in different ways, and a good engineer knows when to use each."),

    H("Rule-based systems"),
    P("A rule-based system is a program where a human writes the logic. A resume checker that says “this resume has no email address” is a rule-based system. A rule is easy to read, easy to explain and easy to fix. If a user asks, “Why was my message flagged?”, you can point to the exact rule. Rule-based systems are also very predictable. The same input always gives the same output."),
    P("The weakness is that rules only cover what the writer thought of. Scammers change their words every week. If your rule looks for the phrase “registration fee”, a scammer will write “processing charge” instead, and your rule sees nothing. To keep up you must keep adding rules by hand, and the list gets long and hard to manage."),

    H("Learning systems"),
    P("A learning system works in the opposite way. You give it examples that are already labelled, such as “this message is a scam” and “this message is normal”. The program counts and measures things in those examples and builds a small mathematical model. When a new message arrives, the model uses what it learned to guess. Nobody wrote a rule about “processing charge”. But if the word “charge” appeared often in scam examples and rarely in normal ones, the model will lean towards “scam” whenever it sees that word."),
    P("This is powerful because the model can notice patterns that a person did not think of. It is also risky, for three reasons. First, the model is only as good as its examples. If your examples are few, old or one-sided, the model will be poor or unfair. Second, it is harder to explain: the answer comes from many small numbers rather than one clear rule. Third, it can be wrong with confidence. A learning system will happily give an answer even for a message that looks nothing like its examples."),

    H("Narrow AI and general AI"),
    P("Every AI product you can use today is **narrow AI**. It is very good at a limited set of tasks and useless outside them. A resume parser does not drive a car, and a chess engine cannot write a cover letter. Even large language models, which can do many different language tasks, are still narrow in an important way: they work with text and patterns in text, and they have no goals of their own. **General AI**, a system that can do any intellectual task a person can do, is a research goal. It is not a product you can buy or a thing you need to worry about when you build today’s apps."),

    H("Where you already meet AI"),
    L("**Spam filters** decide which emails go to the junk folder. Most use a learning method.", "**Search and recommendations** decide which jobs, videos or products you see first.", "**Speech to text** on your phone turns your voice into words.", "**Applicant tracking systems (ATS)** read resumes, pull out skills and rank candidates. Some use rules, some use learning, and many use both.", "**Chat assistants** such as Claude write, summarise and explain in plain language."),

    H("What AI cannot do well"),
    P("Knowing the limits is as useful as knowing the strengths. AI systems learn from data, so poor data gives poor results. If a hiring model learned from past decisions that were unfair, it will copy the unfairness. AI can be confidently wrong. It does not understand the world the way people do. And for decisions that matter, such as hiring, health or money, a person should check the result. Keep one habit from this lesson for the whole course: whenever you read about an AI feature, ask two questions. What data did it learn from? And what happens when it is wrong?"),
    BUILD,

    H("Your task: rules against learning"),
    P("In this task you will build the first page of the lab. It lets you type a job message and see two verdicts side by side: one from a few hand-written rules, and one from a small model that learns from labelled examples."),
    P("**What you will build**"),
    L("A list of 14 example messages, each marked as a scam or as normal.", "Four hand-written rules, for example “asks you to pay first” and “pushes you to hurry”.", "A small learning model called naive Bayes. It counts how often each word appears in scam and in normal examples, and turns those counts into a score.", "An Angular page with a text box, two result cards, and buttons to add your own examples."),
    P("**Steps**"),
    O("Create src/app/lib/spam.ts. Define the type Example with a text and a spam flag, and write the 14 starting examples (7 scam, 7 normal). Use realistic messages: scam ones mention fees, OTP codes or guaranteed income, and normal ones mention interviews and documents.", "Write the rules as a list of objects, each with a name and a test function that checks the text with a regular expression. Write ruleVerdict, which runs all rules and returns the names of the rules that fired.", "Write the NaiveBayes class. In the constructor, count for every word how many scam and how many normal examples contain it. Write weight(word) so that a positive number pushes towards scam and a negative number pushes towards normal. Add one to every count so that a word never seen in one group does not give a zero.", "Write classify(text). Add the weights of the known words in the message to a starting value (the prior) and turn the total into a probability between 0 and 1 with the formula 1 / (1 + e^-x).", "Create the page in src/app/pages/spam.ts. Show the message box, both verdicts, the rules that fired, and the words that pushed the learned verdict the most. Add buttons to add the current message as a scam example or as a normal example, and rebuild the model each time.", "Add the route spam and a menu link in app.routes.ts and the menu."),
    P("**Hints**"),
    L("Make the words lower case and count each word once per message. Otherwise a long message with a repeated word gets too much influence.", "Use Set to remove repeated words from a message.", "Keep the logic in lib/spam.ts, with no Angular code, so that you can test it on its own.", "Try a clever scam sentence that uses none of your rule words. Then add it as an example and see what changes."),
    P("**You know it works when** the rules flag “Pay a registration fee today” but miss “Send a processing charge today”, the learned model gives a high scam probability to a sentence it never saw but which uses scam-like words, and adding your own example changes the learned verdict but not the rules."),
    P("Try to build it yourself first. Struggling with the first version is where the understanding grows. Then compare with the solution below."),

    H("Solution"),
    P("The solution zip contains the whole lab after this lesson. These are the new files. First the logic, with the examples, the rules and the learning model:"),
    F(LAB, 'steps/01/src/app/lib/spam.ts'),
    P("Then the page that shows both verdicts:"),
    F(LAB, 'steps/01/src/app/pages/spam.ts'),
    N("Look at how classify works. It does not match any phrase. It adds one small number for every known word. This idea, many small pieces of evidence added together, appears again and again in AI, including inside large language models."),

    H("What you learned"),
    L("AI is a broad label. Machine learning is the part where programs learn patterns from examples. Deep learning is machine learning with many-layered neural networks.", "A rule-based system is predictable and easy to explain, but it only covers what a person thought of.", "A learning system can notice patterns nobody wrote down, but it depends on its examples and is harder to explain.", "Today’s AI is narrow. It does limited tasks well and needs human checking when the stakes are high."),
    P("In the next lesson you will meet the small set of maths ideas that sit behind almost everything in AI: vectors, similarity, averages, probabilities and learning by small steps."),
  ], [
    { q: 'Is machine learning the same as AI?', a: 'No. Machine learning is one approach inside AI, where programs learn patterns from data. AI also includes older rule-based methods.' },
    { q: 'Do I need advanced maths to start learning AI?', a: 'Not to use and build with AI tools. A few basic ideas, such as averages and similarity, help you understand how models work. The next lesson covers them with simple examples.' },
    { q: 'Should I use rules or learning for my own project?', a: 'Use rules when the logic is clear, must be explained, or must never change, for example a legal check. Use learning when the patterns are too many or too fuzzy to write down. Many real systems combine both.' },
    { q: 'Is the naive Bayes model in this lesson a real AI?', a: 'Yes, it is a real and still widely used machine learning method, especially for spam filtering. It is simple, which makes it a good first example. Large language models are far bigger and work differently.' },
  ], 'what is artificial intelligence, ai vs machine learning vs deep learning, narrow ai, rule based vs machine learning, naive bayes spam filter'),

  // ------------------------------------------------------------------ 2
  lesson(S1, 'math-and-statistics-for-ai', 'Maths and Statistics You Need for AI', 'The small set of maths ideas behind AI: vectors, similarity, averages, probability and learning by small steps, explained in easy English with a hands-on page.', '', [
    P("Many people think AI needs advanced maths and stop before they start. The truth is kinder. To use and build with AI tools you need only a handful of ideas, and each one can be explained with a picture or a small example. In this lesson you will learn five of them: vectors, similarity, averages and spread, probability, and learning by taking small steps downhill. At the end you will build a page in the lab where you can play with each idea and see the numbers change."),
    P("If maths felt hard at school, relax. We use no hard formulas. Every formula in this lesson is only a few symbols, and the code in the lab does all the calculation for you. What matters is the meaning behind the numbers."),

    H("Idea 1: a vector is a list of numbers"),
    P("A **vector** is just a list of numbers in a fixed order. A person’s profile can be a vector: [years of experience, number of skills, expected salary]. Someone with 3 years, 5 skills and a 40 thousand salary is the vector [3, 5, 40]. Once things are lists of numbers, a computer can compare, add and measure them."),
    P("This idea is everywhere in AI. When a model reads a word or a sentence, it first turns it into a long vector, sometimes with thousands of numbers. We call that an **embedding**, and you will meet it again in later courses. For now, remember this: AI does not see words or pictures. It sees lists of numbers."),

    H("Idea 2: similarity, or how close are two vectors?"),
    P("If two things are lists of numbers, we can ask how similar they are. One popular answer is **cosine similarity**. Imagine each vector as an arrow starting from the same point. If two arrows point in nearly the same direction, the things are similar. If they point in completely different directions, they are not. Cosine similarity gives a number from -1 to 1. A value close to 1 means the arrows point the same way. A value near 0 means they are unrelated. A value close to -1 means they point in opposite ways."),
    P("Example: take A = [1, 2, 3] and B = [2, 4, 6]. B is just A doubled, so the arrows point in exactly the same direction and the similarity is 1. Now take A = [1, 0] and B = [0, 1]. They point at right angles, and the similarity is 0. Notice that cosine similarity ignores length and cares only about direction. That is useful for text, because a long document and a short document about the same topic should still count as similar."),
    P("The calculation uses two small helpers. The **dot product** multiplies the numbers in the same positions and adds the results: for [1, 2, 3] and [2, 4, 6] it is 1×2 + 2×4 + 3×6 = 28. The **norm** is the length of an arrow: the square root of the vector’s dot product with itself. Cosine similarity is the dot product divided by the two lengths multiplied together."),

    H("Idea 3: averages and spread"),
    P("The **mean** is the average: add the numbers and divide by how many there are. If five candidates ask for 20, 22, 25, 24 and 60 thousand, the mean is 30.2 thousand. But look: four of the five asked for 25 or less. One large number pulled the average up. This is why you should always check the **spread** as well as the mean."),
    P("The **standard deviation** measures spread. A small value means the numbers are close together. A large value means they are scattered. In AI we use the mean and spread constantly: to check whether data looks normal, to scale numbers so that big ones do not dominate, and to measure how stable a result is. If a model’s accuracy is 90 percent on one test and 70 percent on another, a high spread tells you that you cannot trust a single number."),

    H("Idea 4: probability and softmax"),
    P("**Probability** is a number between 0 and 1 that tells you how likely something is. 0 means it never happens, 1 means it always does, and 0.25 means one time in four. The probabilities of all possible outcomes must add up to 1."),
    P("Models usually do not start with probabilities. They start with raw **scores**, which can be any number, positive or negative. To turn scores into probabilities we use a function called **softmax**. It makes every score positive (by using the exponential), then divides each by the total so that everything adds up to 1. A higher score always gets a higher probability, and the gap grows quickly. With the scores [2, 1, 0] the probabilities are about 0.66, 0.24 and 0.09."),
    P("Softmax matters because language models choose the next word with it. For every possible next token, the model produces a score, and softmax turns the scores into probabilities. Lesson 6 shows how settings like temperature change this step."),

    H("Idea 5: learning is walking downhill"),
    P("How does a model learn? Picture yourself standing on a hill in thick fog. You cannot see the valley, but you can feel the slope under your feet. A simple plan works: take a small step in the direction that goes downhill, feel the slope again, and repeat. After many steps you reach the bottom."),
    P("In machine learning, the “height” of the hill is the **error**, how wrong the model is. The “position” is the model’s set of numbers, called **weights** or **parameters**. The **gradient** is the slope: it tells the model which way to change each weight to reduce the error. The **learning rate** is the size of your step. If the steps are too small, learning takes forever. If they are too big, you jump over the valley and may never settle. Training a large language model is this same idea repeated billions of times, with billions of weights."),
    BUILD,

    H("Your task: a playground for the five ideas"),
    P("Build a page called Maths that lets you play with each idea. You will write four small functions and one page that uses them."),
    P("**What you will build**"),
    L("Functions for the dot product, the norm and cosine similarity, plus the mean and the standard deviation.", "A softmax function that turns any list of scores into probabilities that add up to 1.", "A gradient step function that moves a number downhill on a simple curve, so you can watch it converge.", "An Angular page with four small cards: vectors, averages, softmax and learning."),
    P("**Steps**"),
    O("Create src/app/lib/math.ts. Write parseVector, which turns a text like “1, 2, 3” into [1, 2, 3] and ignores anything that is not a number.", "Write dot, norm and cosine. In cosine, return 0 when either vector has length 0 so that you never divide by zero.", "Write mean and stdDev. For the standard deviation, take the average of the squared distances from the mean, then the square root.", "Write softmax. Subtract the largest score from every score first. This does not change the result, but it keeps the exponentials from becoming huge numbers.", "Write gradientSteps(start, target, rate, steps) for the curve y = (x - target)². The slope at x is 2 × (x - target). Move x by -rate × slope at every step and keep the path.", "Build src/app/pages/vectors.ts with inputs for two vectors, a list of numbers, a list of scores, and sliders for the target and the step size. Show the results and the path of the learning steps."),
    P("**Hints**"),
    L("For two vectors of different length, treat missing numbers as 0.", "Try the scores [2, 1, 0] and then [20, 10, 0]. Watch how the biggest score takes almost everything.", "Try a step size of 0.1, then 0.9, then 1.1. At 1.1 the walk jumps further away each time. This is called divergence.", "Add an extreme number such as 500 to your list of salaries and watch the mean move more than the middle value does."),
    P("**You know it works when** cosine of [1, 2, 3] and [2, 4, 6] shows 1, softmax of any list adds up to 1, the standard deviation of identical numbers is 0, and the learning path reaches the target with a small step size but blows up with a very large one."),

    H("Solution"),
    P("These are the new files in the solution zip. First the maths functions. Each one is only a few lines:"),
    F(LAB, 'steps/02/src/app/lib/math.ts'),
    P("Then the page that lets you play with them:"),
    F(LAB, 'steps/02/src/app/pages/vectors.ts'),
    N("Notice that gradientSteps is a real training loop in miniature: compute the slope, take a small step, repeat. The only difference from a large model is the number of weights."),

    H("What you learned"),
    L("A vector is a list of numbers. AI turns words, pictures and people into vectors.", "Cosine similarity measures how close the direction of two vectors is, from -1 to 1.", "The mean is the average; the standard deviation shows how scattered the numbers are. Always look at both.", "Softmax turns raw scores into probabilities that add up to 1.", "Learning means taking small steps downhill on an error curve. The learning rate is the step size."),
    P("In the next lesson you will use these ideas to train a model that learns from labelled examples, and you will see how it can fail by memorising instead of learning."),
  ], [
    { q: 'Do I need to know calculus to understand AI?', a: 'To build apps with AI tools, no. Calculus explains how the slope (gradient) is calculated, but the libraries do that for you. The idea of taking small steps downhill is enough to start.' },
    { q: 'What is the difference between a vector and an embedding?', a: 'A vector is any list of numbers. An embedding is a vector produced by a model to represent the meaning of a word, a sentence or an image, so that similar things get similar vectors.' },
    { q: 'Why does softmax subtract the largest score first?', a: 'It keeps the numbers small and stable. Without it, a score of 1000 would make the exponential too large for a computer to handle. The final probabilities are the same either way.' },
    { q: 'What is a good learning rate?', a: 'There is no single answer. Too small is slow and too large is unstable. People try a few values, watch the error, and pick one where the error goes down smoothly. Many tools adjust the rate automatically.' },
  ], 'maths for ai, vectors and cosine similarity, softmax explained, standard deviation, gradient descent for beginners'),

  // ------------------------------------------------------------------ 3
  lesson(S1, 'machine-learning-basics', 'Machine Learning Basics', 'Learn supervised, unsupervised and reinforcement learning, why we split data into training and test sets, what overfitting is, and build a k-nearest-neighbours classifier.', '', [
    P("Machine learning, or ML, is the part of AI where a program learns from data instead of following rules written by a person. You met the idea in lesson 1. In this lesson we go one level deeper: the main types of learning, the basic steps of a machine learning project, and the most important warning in the whole field, overfitting. You will build a small classifier that decides whether a candidate should be shortlisted, and you will watch it succeed and fail in a way that mirrors real projects."),

    H("Three ways a machine can learn"),
    P("**Supervised learning** is learning from labelled examples. Each example comes with the right answer: this resume was shortlisted, this one was not; this email is spam, this one is not. The model learns to predict the label for new examples. Most business uses of ML are supervised: price prediction, spam filters, document classification, and so on."),
    P("**Unsupervised learning** has no labels. You give the model data and ask it to find structure. A typical use is clustering: grouping customers or job postings into sets of similar items, without anyone saying what the groups should be. Another is finding unusual items that do not fit any group."),
    P("**Reinforcement learning** learns by trying things and receiving rewards or penalties. A game-playing program wins or loses and adjusts. This method is also used to refine chat assistants: people rate answers, and the model is nudged towards answers that people prefer."),
    P("Large language models use a mix. Their first stage, predicting the next word in huge amounts of text, is often called self-supervised: the text itself supplies the answers, so no one has to label anything. You will learn more about this in lessons 5 and 6."),

    H("The steps of a supervised project"),
    O("**Collect data.** Gather examples with correct labels. This is usually the hardest and most expensive step.", "**Clean and prepare.** Fix errors, remove duplicates, turn text into numbers, and scale the numbers.", "**Split.** Keep some examples hidden for testing. More on this below.", "**Train.** Let the model learn from the training part.", "**Evaluate.** Check the model on the test part, which it has never seen.", "**Use and watch.** Put the model to work and keep checking it, because the real world changes."),

    H("Train and test: the most important habit"),
    P("Imagine a student who gets the exam questions in advance and memorises the answers. Their exam score will be perfect, but it tells you nothing about what they understand. Machine learning has the same problem. If you test a model on the same examples it learned from, the score is meaningless."),
    P("So we split the data. The larger part is the **training set**, used for learning. The smaller part, often 20 to 30 percent, is the **test set**. The model never sees it while learning. The score on the test set is an honest estimate of how the model will do on new data."),

    H("Overfitting and underfitting"),
    P("**Overfitting** happens when a model learns the training examples too closely, including their accidents and noise, and then does poorly on new data. The sign is a big gap: very high accuracy on the training set and much lower accuracy on the test set. **Underfitting** is the opposite: the model is too simple to catch the real pattern, and it does poorly on both sets."),
    P("Think about a resume screening model trained on only 30 past hires. If three of the shortlisted people happened to have the same hobby, a model that fits too closely might decide the hobby matters. On new candidates it would be wrong in odd ways. More data, simpler models and honest testing are the usual cures."),

    H("Measuring the result: accuracy, precision and recall"),
    P("The simplest measure is **accuracy**: the share of predictions that are correct. But accuracy can mislead. If only 5 percent of candidates are a good match, a lazy model that says “no” every time is 95 percent accurate and totally useless. So we look at a table called the **confusion matrix**, which counts four outcomes: true positives (said yes, correctly), false positives (said yes, wrongly), true negatives (said no, correctly) and false negatives (said no, wrongly)."),
    L("**Precision** answers: of everyone the model said yes to, how many were really yes? It matters when a false alarm is costly.", "**Recall** answers: of everyone who was really yes, how many did the model find? It matters when missing a good case is costly."),
    P("In a hiring tool, low recall means good candidates are rejected without anyone noticing. That is why human review of rejected cases matters."),

    H("A simple model: k nearest neighbours"),
    P("The model in this lesson is **k-nearest neighbours**, or k-NN. It is one of the simplest ML methods. To judge a new candidate, find the k training examples that are closest to them (using a distance, like in lesson 2), and let those neighbours vote. If most of the neighbours were shortlisted, predict “shortlisted”. The number k is a setting you choose. With k = 1 the model copies its single nearest neighbour, which follows every accident in the data and overfits easily. With a very large k the model averages too much and underfits. A medium k often works best, and the test set helps you find it."),
    BUILD,

    H("Your task: a shortlisting classifier"),
    P("You will build a page that generates a fake set of candidates, splits them into training and test sets, classifies with k-NN, and shows accuracy, precision, recall and the confusion matrix. You will use sliders for k, the test share and the amount of noise."),
    P("**What you will build**"),
    L("A seeded random number generator, so that the same seed always gives the same data. This makes experiments repeatable.", "A function makeData that creates candidates with years of experience and a skills score. A candidate is shortlisted when a mix of the two is high, but noise flips some labels.", "A split function that shuffles and divides the data.", "A predict function for k-NN and an evaluate function that returns the confusion matrix, accuracy, precision and recall.", "A page with sliders and results for the training and the test data."),
    P("**Steps**"),
    O("Write lib/rng.ts with makeRng(seed), which returns a function that gives a new number between 0 and 1 on each call, and shuffle(items, rng).", "Write lib/knn.ts. In makeData, create the requested number of people with random years (0 to 15) and skills (0 to 10). Decide the label from a simple formula, then flip it with a probability equal to the noise setting.", "Write split(data, testShare, seed) that shuffles a copy and returns the train and test arrays.", "Write predict(train, who, k): measure the distance to every training example, sort, take the k nearest and vote.", "Write evaluate(train, test, k) that counts tp, fp, tn and fn and calculates accuracy, precision and recall. Avoid dividing by zero.", "Build the page. Show the accuracy on the training data and on the test data side by side."),
    P("**Hints**"),
    L("When you test on the training data with k = 1, accuracy is 100 percent or very close to it, because each point’s nearest neighbour is itself. This is a good way to see why a separate test set matters.", "Set the noise to a high value. The test accuracy falls, and the gap between train and test grows with small k.", "Use an odd k to avoid tied votes.", "Change only one slider at a time, so you can see the cause of each change."),
    P("**You know it works when** the training accuracy with k = 1 is 100 percent (or very close) while the test accuracy is clearly lower, a medium k closes the gap between training and test scores (the test score is not always higher, since small test sets are noisy), and changing the seed gives a different but similar picture."),

    H("Solution"),
    P("The random generator and the shuffle:"),
    F(LAB, 'steps/03/src/app/lib/rng.ts'),
    P("The data, the split, the k-NN prediction and the evaluation:"),
    F(LAB, 'steps/03/src/app/lib/knn.ts'),
    P("And the page with the sliders:"),
    F(LAB, 'steps/03/src/app/pages/classifier.ts'),
    N("The confusion matrix is more honest than accuracy alone. Always ask which kind of mistake the model makes, not just how many."),

    H("What you learned"),
    L("Supervised learning uses labelled examples, unsupervised learning finds structure without labels, and reinforcement learning uses rewards.", "Always keep a test set that the model never sees during training.", "Overfitting means memorising the training data, and shows as a gap between training and test scores.", "Accuracy can hide problems. Precision, recall and the confusion matrix tell you which mistakes happen.", "k-NN predicts by letting the nearest examples vote, and k controls how closely it follows the data."),
    P("In the next lesson you will move from simple models to neural networks, and see how layers of tiny units can learn something that a single layer cannot."),
  ], [
    { q: 'What is the difference between supervised and unsupervised learning?', a: 'Supervised learning uses examples with correct answers (labels) and learns to predict them. Unsupervised learning has no labels and looks for structure, such as groups of similar items.' },
    { q: 'How much data do I need for machine learning?', a: 'It depends on the task. Simple patterns with few features can work with hundreds of examples. Complex tasks like language need millions. More important than the amount is that the data is correct and similar to what the model will meet in real use.' },
    { q: 'How can I tell that a model is overfitting?', a: 'Compare the score on the training data with the score on the test data. A high training score and a much lower test score is the classic sign.' },
    { q: 'Is a high accuracy always good?', a: 'No. If one class is rare, a model that always predicts the common class has high accuracy and no value. Check precision, recall and the confusion matrix.' },
  ], 'machine learning basics, supervised vs unsupervised learning, overfitting explained, train test split, k nearest neighbours tutorial, confusion matrix precision recall'),

  // ------------------------------------------------------------------ 4
  lesson(S1, 'deep-learning-and-transformers', 'Deep Learning and Transformers', 'Understand neural networks, layers and training, learn the idea of attention and the transformer, and train a small neural network in your browser.', '', [
    P("Deep learning is the technology behind modern image recognition, speech recognition and large language models. The name sounds mysterious, but the core idea is small. A neural network is a chain of simple calculations, repeated in layers, with numbers that are adjusted by learning. In this lesson you will learn what a neuron is, why layers matter, how training works, and what a transformer is. Then you will train a real neural network in your browser and watch it learn a problem that a simple model cannot solve."),

    H("A neuron is a small calculator"),
    P("An artificial **neuron** does three things. It takes several input numbers. It multiplies each input by a **weight** (a number that says how important that input is) and adds the results together with one extra number called the **bias**. Then it passes the total through an **activation function**, a small curve that squeezes the result into a useful range. A common choice is the sigmoid, which turns any number into a value between 0 and 1."),
    P("Example: a neuron that guesses whether a candidate is a good match takes two inputs, years of experience and number of relevant skills. If its weights are 0.4 and 0.8, a person with 3 years and 5 skills gives 0.4×3 + 0.8×5 = 5.2, plus a bias. A large positive total gives an output near 1, which we read as “likely a match”."),

    H("Why we need layers"),
    P("One neuron can only draw a straight line between two groups. Some problems cannot be split by a straight line. The classic example is **XOR**, short for “exclusive or”: the answer is 1 when exactly one of two inputs is 1, but 0 when both are 0 or both are 1. In words: “one or the other, but not both”. If you plot the four cases, no single straight line puts the two 1 answers on one side and the two 0 answers on the other."),
    P("The fix is to add a **hidden layer**: a middle row of neurons between the inputs and the output. Each hidden neuron makes its own simple judgement. The output neuron then combines their judgements. Together they can draw curves and corners that one neuron cannot. A network with many hidden layers is called a **deep** network, which is where the name deep learning comes from. Each layer learns something a bit more abstract than the layer before: in an image model, the first layers find edges, the next find shapes, and the later ones find faces or objects."),

    H("How a network trains"),
    P("A new network starts with random weights, so its answers are nonsense. Training repeats four steps many times:"),
    O("**Forward pass.** Give the network an example and let it calculate an answer.", "**Compare.** Measure the error between its answer and the right answer.", "**Backward pass.** Use a method called **backpropagation** to work out how much each weight contributed to the error. This is the gradient from lesson 2, found for every weight.", "**Update.** Move each weight a small step in the direction that reduces the error, using the learning rate."),
    P("One full pass over all training examples is called an **epoch**. After many epochs, the error falls and the network’s answers get close to the targets. You will see this in the lab: the error bars get shorter as training goes on."),
    P("Neural networks need a lot of calculation, which is why graphics processors (GPUs) became important. They do thousands of small multiplications at the same time."),

    H("From networks to transformers"),
    P("Before 2017, most language models read text one word at a time, in order, and kept a small memory of what came before. They were slow to train and forgot the start of long sentences. In 2017 researchers at Google published a paper called “Attention Is All You Need” that introduced the **transformer**, the design behind almost every large language model today."),
    P("The key idea is **attention**. When the model processes a word, attention lets it look at all the other words in the text and decide which ones matter for understanding this one. Take the sentence: “The candidate sent the resume to the manager because **she** liked the profile.” To understand “she”, the model must connect it to the right person. Attention gives each word a way to ask, “Which other words should I pay attention to?” and to collect information from them, weighted by importance."),
    P("Attention has two big advantages. It can connect words that are far apart, so long sentences are not forgotten. And all the words can be processed at the same time instead of one by one, which fits GPUs very well and made it possible to train on enormous amounts of text. A transformer stacks many layers of attention, each followed by a small neural network. Lesson 7 explains this stack in more detail."),
    P("A final point to remember: a transformer does not store facts in a database. Its knowledge is spread across billions of weights, adjusted during training. That is why it can write fluent text and also why it can be wrong without warning."),
    BUILD,

    H("Your task: train a neural network on XOR"),
    P("You will write a small neural network from scratch, with no libraries, and train it on the XOR problem. A page lets you choose the number of hidden units and training rounds, press a button, and see the answers and the error over time."),
    P("**What you will build**"),
    L("A network type with weights and biases for a hidden layer and one output unit.", "Functions to create a network with seeded random weights, run a forward pass and make a prediction.", "A train function that does backpropagation for every example and updates the weights.", "A page showing the four XOR cases, the network’s answer for each, and a bar for the error at several checkpoints."),
    P("**Steps**"),
    O("Create lib/nn.ts. Define sigmoid and its slope. Define the Net type: sizes plus arrays w and b for weights and biases.", "Write createNet(hidden, seed) with small random starting weights, using makeRng from lesson 3.", "Write forward(net, input) that returns the output of every layer, so training can reuse them.", "Write train(net, data, epochs, rate). For each example run forward, compute the error at the output, push it back through the hidden layer, and update every weight and bias a little.", "Record the average error every so often and return those checkpoints.", "Define the XOR data: four inputs with targets 0, 1, 1 and 0.", "Build the page with two sliders and a Train button. Yield to the browser between rounds so the page does not freeze."),
    P("**Hints**"),
    L("Try one hidden unit and notice that the network cannot learn XOR. Try four and it succeeds almost every time.", "A very high learning rate can make the error jump around instead of falling.", "Training from a different seed can end in a different final error. Neural networks depend on their starting point.", "Print the output for each of the four cases. You want numbers close to 0 and 1, not exactly 0 and 1."),
    P("**You know it works when** a network with four hidden units reaches a final error below 0.01 and gives answers near 0, 1, 1 and 0, while a network with one hidden unit stays stuck."),

    H("Solution"),
    P("The network, with the forward pass and the training loop:"),
    F(LAB, 'steps/04/src/app/lib/nn.ts'),
    P("And the page that trains it and shows the results:"),
    F(LAB, 'steps/04/src/app/pages/neural.ts'),
    N("This network has around a dozen numbers. GPT-class models have hundreds of billions. The idea in your code is the same idea, scaled up enormously."),

    H("What you learned"),
    L("A neuron multiplies inputs by weights, adds a bias and applies an activation function.", "Hidden layers let a network solve problems that a single neuron cannot, such as XOR.", "Training repeats forward pass, error, backpropagation and a small weight update, over many epochs.", "A transformer uses attention to let every word look at the other words, and it can be trained in parallel on huge text collections."),
    P("In the next lesson you will move from learning in general to generative AI: systems that produce new text, images and more."),
  ], [
    { q: 'What is the difference between deep learning and machine learning?', a: 'Deep learning is a kind of machine learning that uses neural networks with many layers. Other machine learning methods, such as k-NN or decision trees, are not deep learning.' },
    { q: 'What does attention do in a transformer?', a: 'Attention lets the model compare each word with every other word in the text and decide which ones are most useful for understanding it. This helps it handle long sentences and connect words that are far apart.' },
    { q: 'Why do neural networks need GPUs?', a: 'Training means a huge number of multiplications that can run at the same time. GPUs are built to do many such calculations in parallel, so they are much faster than ordinary processors for this work.' },
    { q: 'Can a neural network explain its decisions?', a: 'Not easily. The answer comes from many weights working together, so there is no single rule to point to. Researchers work on explanation methods, but for important decisions a human check is still needed.' },
  ], 'deep learning for beginners, what is a neural network, transformer and attention explained, backpropagation, xor neural network'),
];
