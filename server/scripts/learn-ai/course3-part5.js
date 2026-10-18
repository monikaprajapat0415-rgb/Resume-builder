import { P, H, L, O, N, C, F, lesson } from './helpers.js';

const LAB = 'claude-api-tool-use';
const S4 = 'Evaluation, safety and production';

const BUILD = N("The solution zip contains the whole AI Lab up to this lesson. Unzip it, run npm install, copy .env.example to .env, add your Anthropic API key, then run npm run server and npm start in two terminals. Laws, prices, models and tools change, so check current sources before you rely on anything in this lesson.");

export const lessons = [
  // ------------------------------------------------------------------ 22
  lesson(S4, 'evaluating-llm-applications', 'Evaluating LLM Applications: Test Sets, Metrics and AI Judges', 'Learn to test an AI app like any other software: build a golden question set, measure retrieval and answers, use an AI judge carefully, and find and fix a real failure.', '', [
    P("Here is a story that happens to almost every team. You build a RAG bot. You try five questions, they all work, and you feel good. Next week you improve the prompt for one problem. A month later a user tells you the bot gives a wrong answer about something that worked before. You have no idea when it broke, because you never wrote anything down."),
    P("Normal software has tests. You change a function, you run the tests, and you see if something broke. AI apps need the same habit, but the answers are text, not numbers, so testing takes a little more thought. In this lesson you build an **evaluation set** for your RAG bot, run it with one click, and use it to find and fix a real failure in the lab."),

    H("Why “it seems to work” is not enough"),
    L("**Models are not predictable in the small.** A tiny change in the prompt, the model version or the chunk size can improve one question and break another.", "**You see only the questions you try.** A test set remembers questions that you would forget.", "**Opinions are cheap.** “It feels better” is not evidence. A number that goes from 7 of 10 to 9 of 10 is.", "**Models change under you.** Providers retire old model versions and release new ones. Evaluation tells you whether your app still works after a switch."),

    H("Step 1: write a golden set"),
    P("A **golden set** is a list of questions where you know what a good answer looks like. Start small: ten to thirty questions is enough to begin, and you can grow it. Where do the questions come from? The best source is **real user questions**. If you do not have users yet, write the questions people would really ask, in their own words, including messy wording and spelling mistakes."),
    P("Include different kinds of cases:"),
    L("**Easy questions** that the documents answer directly.", "**Paraphrased questions** that use different words from the document. These test retrieval.", "**Questions with no answer** in your documents. The right behaviour is “I don't have that in my notes.” These test honesty.", "**Tricky questions**, like a user who tries to make the bot ignore its rules."),
    P("For each question, write down what you expect. Not the whole perfect sentence, but the **facts that must appear** (for example “two pages”), things that must **not** appear, and which document should be found. Here is the start of the lab's set:"),
    F(LAB, 'steps/22/server/evals/cases.json'),

    H("Step 2: measure retrieval and answers separately"),
    P("A RAG answer can fail in two different places, and it is very useful to know which. If the right document was never found, the problem is retrieval. If it was found but the answer is still wrong, the problem is generation."),
    L("**Hit rate** (or recall at k): in what share of the questions did the right document appear in the top 4 results?", "**MRR** (mean reciprocal rank): for each question, take 1 divided by the position of the right document (1 for first place, 0.5 for second, 0.33 for third) and average. It tells you how near the top the right document usually is.", "**Answer checks:** does the answer contain the required facts, and avoid the forbidden ones?", "**Faithfulness:** is every claim in the answer supported by the sources?"),
    P("The first two cost nothing, because they do not call the model. You can run them after every change to chunking or search. The last two use the model, so they cost a little and run more slowly. That is why the lab's page has two buttons: a free retrieval run and a full run."),

    H("AI as a judge, and its limits"),
    P("Checking “is this answer supported by these sources?” with simple code is hard. So many teams ask **another model call** to act as a judge. In the lab, the judge gets the question, the answer and the sources, and returns `faithful` true or false and a short reason through a forced tool call, so the result is structured."),
    P("This is useful but not perfect. Keep these cautions in mind:"),
    L("**Judges make mistakes.** They are often too kind. Read some of their verdicts yourself, especially the passes.", "**Give strict instructions.** Our judge is told to say faithful only if every claim is supported.", "**Do not let a model grade itself without care.** If you can, use a different or stronger model as the judge.", "**Prefer simple checks where they are enough.** A required phrase is a clear, free, repeatable test. Use the judge only for what code cannot check."),
    F(LAB, 'steps/22/server/routes/evals.js'),
    P("To make the evaluation reuse the same pipeline as the real route, we moved the whole question-to-answer process into a function. This refactor matters: **test the same code that users run**, not a copy of it."),
    F(LAB, 'steps/22/server/rag/answer.js'),

    H("Finding a real failure"),
    P("Now the useful part. Run the retrieval check against the **earlier** version of the documents, where the first paragraph of resume-basics.md says “A good resume is one or two pages and tells a recruiter…”. The case named `length` asks, “How long should my resume be?” The document says “pages”, not “long”. Keyword search finds no match for “long”, and the right document does not appear in the top results. The result is 9 of 10, and the failing row shows rank `-`: the right document was not found."),
    P("Because you measured retrieval separately, you know the fix is not in the prompt. It is in the content. The fix in the lab is to change the sentence to “A good resume is one or two pages long.” Now the word “long” is there, the search finds it, and the set passes 10 of 10. Sometimes the best retrieval improvement is not a smarter algorithm, but a clearer document."),
    N("If you start from the solution zip, the document is already fixed, so all ten cases pass. To see the failure yourself, remove the word “long” from the first sentence of server/rag/docs/resume-basics.md, restart the server and run the check again."),
    P("Other fixes you could try for a failure like this: write a short alternative question into the document (an FAQ style), let a model rewrite the user's question into a few search queries before retrieving, or use a real embedding model that knows that “long” and “pages” are related. Your test set tells you which fix works."),

    H("Habits that make evaluation useful"),
    L("**Run it after every change** to the prompt, chunking, search settings or model. A ten-question run is quick.", "**Keep results over time.** Save the pass rate with a date and a note about what you changed.", "**Add every real bug.** When a user finds a failure, add that question to the set before you fix it. It can never come back unnoticed.", "**Watch for overfitting.** If you tune the prompt until your ten questions pass, you may have taught it only those ten. Keep a few questions aside that you never tune on.", "**Look at failures with your eyes.** A number tells you that something broke. Reading the answer tells you why."),
    BUILD,

    H("Your task: build the evaluation page"),
    P("Write a set of ten questions for the help-center bot, a runner that scores retrieval and answers, and a page to run it."),
    P("**What you will build**"),
    L("server/evals/cases.json with ten cases: question, expected source file, required phrases and forbidden phrases.", "server/rag/answer.js, the whole RAG pipeline as one function that the route and the evaluation share.", "A route POST /api/evals/run with a retrieval mode (free) and a full mode (uses Claude and a judge).", "An Angular Evals page with the two buttons, a summary and a table of results with details."),
    P("**Steps**"),
    O("Write ten cases. Include at least six easy questions, one paraphrased question, one question that your documents cannot answer and one question that tries to make the bot break its rules.", "Move the retrieve, prompt, call and citation-check steps from the route into answerQuestion in answer.js. Make the route call this function.", "Write the retrieval check. For each case, run retrieve, find the position of the expected source, and compute the hit rate and the MRR.", "Write the full check. Call answerQuestion, check the required and forbidden phrases, and call a judge with a forced tool that returns faithful and a reason. A case passes only when all checks pass.", "Build the page. Show the summary and a row for each case with the rank, the verdict and, in full mode, the answer, the missing phrases and the judge's reason.", "Break something on purpose, for example by setting the similarity threshold to 0.5 or the chunk size to 400. Run the check and note which cases fail and why. Then fix it."),
    P("**Hints**"),
    L("A case with no expected source should not count in the hit rate.", "Run the full check one case at a time to keep within rate limits.", "Do not put secrets or real user data in your test set."),
    P("**You know it works when** the retrieval run finishes without calling the model, the full run shows a judge verdict for every case, changing a setting visibly changes the pass rate, and you can explain the reason for each failure."),

    H("Solution"),
    P("You have seen the cases, the route and answer.js above. This is the Angular page:"),
    F(LAB, 'steps/22/src/app/pages/evals.ts'),
    N("In a team project, run this check automatically before every release, in a CI pipeline, and block the release if the pass rate drops. That turns your evaluation into a safety net."),

    H("What you learned"),
    L("A golden set of real, varied questions turns “it seems to work” into a number.", "Measure retrieval (hit rate, MRR) separately from generation (required phrases, faithfulness).", "An AI judge is useful for what code cannot check, but it makes mistakes, so read some of its verdicts.", "Add every real bug to the set, run it after every change, and test the same code that users run."),
    P("In the next lesson you will look at safety, privacy and responsible use: what to remove before data leaves your server, and how to avoid harming users."),
  ], [
    { q: 'How many test questions do I need?', a: 'Start with ten to thirty real or realistic questions. A small set that you actually run is much more useful than a big set that you never run. Grow it with every real bug.' },
    { q: 'What is MRR in retrieval?', a: 'Mean reciprocal rank. For each question, take 1 divided by the position of the first correct result and average over all questions. A higher value means the right document tends to appear nearer the top.' },
    { q: 'Can I trust an AI judge?', a: 'Use it with care. Judges can be too kind and can make mistakes. Give strict instructions, read a sample of the verdicts, and prefer simple code checks where they are enough.' },
    { q: 'How often should I run my evaluation?', a: 'After every change to the prompt, the documents, chunking, search settings or model, and automatically before each release.' },
  ], 'evaluate llm application, rag evaluation, llm as a judge, golden dataset, hit rate mrr'),

  // ------------------------------------------------------------------ 23
  lesson(S4, 'ai-safety-privacy-and-responsible-ai', 'AI Safety, Privacy and Responsible Use', 'Learn how to reduce hallucinations, protect personal data by redacting it before it reaches an AI provider, and think about fairness, consent and the law when AI touches people\'s careers.', '', [
    P("A resume contains some of the most personal information a person has: name, phone number, address, work history, sometimes identity numbers. When you build an AI feature on top of that data, you take on a duty. A mistake is not only a bug. It can expose someone's identity, unfairly reject a candidate or mislead a person who trusts your answer."),
    P("This lesson is practical. You will learn the main risks, build a **redaction** layer that removes personal data before it leaves your server, and learn a set of habits for responsible products. This is not legal advice. Laws differ by country and change, so for a real product, ask a qualified professional."),

    H("Risk 1: wrong answers that sound right"),
    P("Hallucination is the most visible risk. The model produces a smooth answer that is not true. You cannot reduce it to zero, but you can reduce it a lot with layers:"),
    L("**Ground the answer.** Use RAG and tell the model to answer only from the sources (lessons 13 and 16).", "**Allow “I don't know”.** A bot that admits when it does not know is safer than one that always answers.", "**Cite and verify.** Numbered citations that your code checks.", "**Test.** An evaluation set with questions that have no answer (lesson 22).", "**Show uncertainty.** For high-stakes advice, say plainly that the user should verify with a professional or the original source.", "**Keep a human in the loop** for decisions that matter, like rejecting a job applicant."),

    H("Risk 2: personal data leaving your system"),
    P("When you call an AI provider, your text travels to their servers. For a resume, that text may contain an email address, a phone number, a home address and ID numbers. Ask yourself a simple question about every piece of data: **does the model need this to do the job?** Almost never does it need the phone number to summarise a work history."),
    P("The best protection is **data minimisation**: do not send what you do not need. The technique is called **redaction**. Before the text leaves your server, you replace personal data with placeholders like [EMAIL_1]. The model works with the placeholders. When the answer comes back, your server puts the real values back, only for the user who owns them. The model never saw the real values."),
    F(LAB, 'steps/23/server/privacy.js'),
    P("Let us look at the details, because they teach a lot."),
    L("**Order matters.** Longer and more specific patterns run first. A card number is checked before a phone number, otherwise part of a card number could be caught as a phone number.", "**Checksums reduce false alarms.** A 16-digit number is only treated as a card number if it passes the **Luhn check**, the checksum that real card numbers pass. A random 16-digit order number is left alone.", "**Do not cut a number in half.** The patterns use lookbehind and lookahead (`(?<!\\d[ -]?)` and `(?![ -]?\\d)`) so that they only match a whole number, not a part of a longer one.", "**Indian identity numbers.** The lab recognises the PAN format (five letters, four digits, one letter) and 12-digit Aadhaar-style numbers. Add the patterns that matter for your users and countries."),
    N("Redaction with patterns is a first line of defence, not a guarantee. It will miss names, addresses and unusual formats. A real system adds more layers: tell users not to paste secrets, use a stronger detector for names and addresses, and choose providers whose data terms you have read."),

    H("Check your provider and your promises"),
    L("**Read the provider's data terms.** Do they keep your data? For how long? Is it used to train models? Business and API terms often differ from consumer apps, so read the ones that apply to you.", "**Match your privacy policy to reality.** Do not say “we never share your data” if your text goes to an AI provider. Tell users that AI tools send their text to a provider.", "**Keep as little as you can.** Do not store prompts and answers forever. Set a retention time and delete after it.", "**Do not log personal data.** Log counts and timings, not the user's text.", "**Let users delete.** When a user deletes an account, delete the resume text, the vectors and any memory the AI saved."),

    H("Risk 3: unfairness"),
    P("AI that helps with hiring touches people's livelihoods, so fairness is not optional. Models learn from human writing, and that writing contains bias. A model that scores resumes might favour certain names, schools, genders, ages or places without anyone intending it."),
    L("**Do not use sensitive traits** (gender, age, religion, caste, marital status, health) as inputs for scoring or ranking. Redact them if the task does not need them.", "**Test for differences.** Run the same resume with different names or details and see whether the output changes in a way it should not.", "**Keep a person in charge** of decisions that affect people. Use AI to help, explain and suggest, not to silently reject.", "**Be able to explain.** Show why a score or suggestion was given, for example which skills matched."),
    P("Also keep in mind the law. Many countries have data protection rules, for example the GDPR in Europe and the Digital Personal Data Protection Act, 2023 in India, and some rules treat AI used in hiring as a higher-risk activity (the EU AI Act is an example). The details change, so check the current rules and take professional advice before you launch a product that makes or influences hiring decisions."),

    H("Risk 4: misuse and unsafe content"),
    P("If your app lets users type anything, someone will try to misuse it: to make the model write harmful content, to reveal its instructions, or to send spam. Defend with layers: a clear system prompt, input length limits, rate limits per user, output checks for your use case, and a way to report problems. Also remember lesson 21: never let model output trigger a risky action without a rule in code."),

    H("A short checklist before you launch an AI feature"),
    O("What data goes to the model? Is each field necessary? Redact the rest.", "Where does that data go? Have you read the provider's terms and updated your privacy policy?", "How long do you keep prompts, answers and memory? Can users delete them?", "What is the worst wrong answer? Is there a human check for high-stakes cases?", "Have you tested questions with no answer, injection attempts and sensitive data?", "Could the feature treat groups of people unfairly? How would you notice?", "What will you do when something goes wrong? Who can switch the feature off?"),
    BUILD,

    H("Your task: build the privacy page"),
    P("Build a redaction function, a free preview endpoint and a summary endpoint that never sends personal data to the model."),
    P("**What you will build**"),
    L("server/privacy.js with a redact function (rules for email, PAN, card, Aadhaar-style and phone numbers) and a restore function.", "Routes POST /api/privacy/preview (no AI call) and POST /api/privacy/summarise (redacts, calls Claude, restores).", "An Angular page that shows exactly what the model would see and which types of data were found."),
    P("**Steps**"),
    O("Write the rules in a list. Each rule has a type, a regular expression and an optional check function. Put the card rule before the Aadhaar and phone rules and add the Luhn check.", "Write redact. For each rule, replace each match with a token like [EMAIL_1]. Keep a map from token to real value and count each type.", "Write restore. Replace every token in a text with its real value.", "Write the preview route. Cut the text to 8,000 characters and return the redacted text and the found types.", "Write the summarise route. Redact first, send only the redacted text, then restore the values in the answer. Return the text that was sent so that the page can show it.", "Test with a resume that has an email, a phone number, a PAN, an Aadhaar-style number and a card number. Also test numbers that must be left alone, like years and a 16-digit number that is not a card."),
    P("**Hints**"),
    L("Never print or log the map of real values.", "Keep the lookbehind and lookahead in the number patterns so that numbers are not cut in half.", "Make the page show the redacted text next to the summary so a user can see what was protected."),
    P("**You know it works when** the preview shows placeholders instead of personal data, the model never receives the real values, the summary contains the real email again for the user, and ordinary numbers like years are untouched."),

    H("Solution"),
    P("You have read privacy.js above. Here are the route and the Angular page."),
    F(LAB, 'steps/23/server/routes/privacy.js'),
    F(LAB, 'steps/23/src/app/pages/privacy.ts'),
    N("The sample resume in the page uses made-up values. Never paste real personal data into a test tool, a ticket or a chat with someone else."),

    H("What you learned"),
    L("Reduce hallucinations in layers: grounding, “I don't know”, citations, tests and human review.", "Minimise data: redact personal data before it reaches an AI provider, and restore it only for the owner.", "Read your provider's terms, keep your privacy policy true, keep data only as long as needed and let users delete it.", "Treat fairness and law as design requirements, especially when AI touches hiring."),
    P("In the last technical lesson you will make your AI feature reliable and affordable in production."),
  ], [
    { q: 'How do I stop personal data from reaching an AI provider?', a: 'Redact it on your server before the call. Replace emails, phone numbers and ID numbers with placeholders, send only the redacted text and put the real values back in the answer for the user. Also read the provider\'s data terms.' },
    { q: 'What is the Luhn check?', a: 'It is a checksum that valid payment card numbers pass. Using it lets you tell a real card number from a random long number, so you redact fewer false matches.' },
    { q: 'Can AI be used for hiring decisions?', a: 'It can help, but it is risky. Avoid using sensitive traits, test for unfair differences, keep a person responsible for decisions, and check the laws that apply in your country. This is not legal advice.' },
    { q: 'Is redaction with regular expressions enough?', a: 'It is a good first layer, but it misses names, addresses and unusual formats. Combine it with user guidance, stronger detection where needed and careful choice of providers.' },
  ], 'ai privacy redact pii, ai safety, responsible ai, llm hallucination mitigation, ai hiring bias'),

  // ------------------------------------------------------------------ 24
  lesson(S4, 'running-ai-in-production', 'Running AI in Production: Cost, Reliability and Monitoring', 'Make an AI feature fast, affordable and dependable: cache repeated questions, rate limit users, set timeouts, fall back gracefully, and measure tokens, speed and cost.', '', [
    P("A demo works on your laptop for one person. A product has to work for thousands of people, at any hour, without a surprise bill. The model API is a remote service that costs money for every call, sometimes takes many seconds, and sometimes fails. Production is the work of making that acceptable."),
    P("In this lesson you add five production basics to your AI Lab: a **cache**, a **rate limit**, a **timeout**, a **fallback** and **metrics**. None of them is complicated. Together they are the difference between a toy and a service you can run."),

    H("What does an AI feature cost?"),
    P("API providers charge by **tokens**: a price for input tokens (what you send) and a price for output tokens (what the model writes), usually per million tokens. Output tokens often cost more than input tokens. A call that sends 1,500 tokens of context and gets 200 tokens back costs a small amount, but multiply it by 100,000 calls a month and it is a real number."),
    P("To estimate your cost, you need four numbers: calls per day, input tokens per call, output tokens per call and the current price. Write them down before you launch. Prices and models change, so always read the provider's pricing page for the current values. In the lab the prices are set in the .env file, so the page can show an estimate."),
    P("Ways to spend less without hurting quality:"),
    L("**Cache.** If many users ask the same question, answer it once.", "**Send less.** Three good chunks instead of ten. A shorter system prompt.", "**Limit the output.** Set a sensible max_tokens and ask for short answers.", "**Use a smaller model** for easy steps, and a larger one only where needed. Your evaluation set (lesson 22) tells you if the cheaper model is good enough.", "**Use prompt caching** for a long, repeated prefix, as in the Claude API course.", "**Stop wasteful loops** with step limits and token budgets (lesson 17)."),

    H("The cache"),
    P("A cache stores the answer to a question for a while. When the same question comes again, you return the stored answer immediately. It costs no tokens and takes a few milliseconds."),
    L("**Normalise the key.** Make the question lower case and collapse spaces, so “How do I...” and “  how do I...” count as the same.", "**Set an expiry.** Our cache keeps answers for 10 minutes. If your documents change often, use a shorter time or clear the cache when they change.", "**Set a size limit.** A cache that grows forever is a memory leak. Ours keeps at most 200 entries and drops the oldest.", "**Be careful with personal answers.** Only cache answers that are the same for everyone. Never cache an answer that depends on one user's private data under a shared key."),

    H("The rate limit"),
    P("Without a limit, one user (or one bug, or one attacker) can send thousands of requests and burn your budget in an hour. A **rate limit** allows each client a fixed number of requests per time window. Ours allows 10 per minute for each IP address. When the limit is passed we return status 429 with a `Retry-After` header that says how many seconds to wait. The Angular page shows the friendly message."),
    P("In a real product you would limit by **signed-in user** as well as by IP, set a daily cost limit for each user, and keep the counters in a shared store like Redis when you run more than one server. Our in-memory version is correct for one process and good for learning."),

    H("Timeouts, retries and fallbacks"),
    P("Remote services fail. They return errors, they slow down, or they hang. Plan for it:"),
    L("**Timeout.** Never wait forever. We pass `timeout: 15000` so a call is cancelled after 15 seconds. A slow answer is often worse than a clear fallback.", "**Limited retries.** A short retry helps with temporary errors, but too many retries make an outage worse. We allow one.", "**Fallback.** If the AI fails, show something useful instead of an error page. Our route returns the best passages from the search with a note, “The AI assistant is busy right now. These are the most relevant notes.” The search part works even when the model does not."),
    P("A fallback is a product decision. Ask: if the AI is down for an hour, what is the most helpful thing we can still show? For a resume tool it might be saved templates or a checklist."),

    H("Metrics and logs"),
    P("You cannot manage what you cannot see. Our small `ops.js` records, for each request: how long it took, how many tokens it used, whether it came from the cache, whether it fell back and whether there was an error. From these it calculates the number of requests, the cache hit rate, the average time, the total tokens and the estimated cost, and the page shows them."),
    P("Two rules about logs. First, **log numbers, not text**. A log file full of user questions is a privacy risk (lesson 23). Second, decide in advance what you will alert on: a rise in errors, a drop in the cache hit rate, a sudden jump in tokens or cost. In a larger system you would send these numbers to a monitoring tool and set alerts, but the habit starts with counting."),
    F(LAB, 'steps/24/server/ops.js'),
    F(LAB, 'steps/24/server/rag/answer.js'),
    F(LAB, 'steps/24/server/routes/ops.js'),

    H("Other things to plan"),
    L("**Secrets.** Keep API keys in environment variables or a secret manager, never in code or in the browser. Rotate a key if it ever leaks.", "**Streaming.** For long answers, stream the text so users see progress (as in the Claude API course).", "**Queues.** For slow jobs, such as processing a large PDF, put the work in a queue and show progress, rather than holding a web request open.", "**Prompt versions.** Keep prompts in version control and record which version produced which result.", "**Model changes.** Models are retired on a schedule. Keep the model name in one setting and run your evaluation set before you switch.", "**Release checks.** Run the evaluation set automatically before each release.", "**A kill switch.** A setting that turns the AI feature off quickly when something goes wrong."),
    BUILD,

    H("Your task: add production basics"),
    P("Add a cache, a rate limit, a timeout, a fallback and metrics to the question-answering route, and a page that shows what they do."),
    P("**What you will build**"),
    L("server/ops.js with a cache (with expiry and a size limit), a rate limit middleware and metrics with a usage log.", "An updated server/rag/answer.js that accepts a timeout and returns token usage.", "A route POST /api/ops/ask that uses all five, and GET /api/ops/metrics.", "An Angular Ops page that shows the answer, whether it was cached or a fallback, and the server metrics."),
    P("**Steps**"),
    O("Write the cache with a Map. Each entry has a value and an expiry time. Return nothing when the entry has expired and remove the oldest entry when you pass 200.", "Write the rate limit as an Express middleware. Count requests per IP in a time window. After the limit, return 429 with a Retry-After header.", "Change answerQuestion to pass a timeout and one retry to the SDK call, and return the token usage in the result.", "Write the route. Check the cache first. Otherwise call answerQuestion inside try/catch. On failure, record the failure and return the best passages as a fallback.", "Write record and metrics. Count requests, cache hits, fallbacks, errors, tokens and time. Append one line of numbers (no text) to a log file. Calculate the estimated cost from the prices in .env.", "Build the page. Ask the same question twice and check that the second is cached. Send more than ten questions in a minute and check the 429 message. Stop the AI (use a wrong key) and check the fallback."),
    P("**Hints**"),
    L("Normalise the cache key before you look it up.", "Write the log in a try/catch. Logging must never break a request.", "Store generated files like the usage log in a folder that is not committed, such as server/runtime."),
    P("**You know it works when** a repeated question is served from the cache with no tokens, the eleventh request in a minute gets a 429 with a wait time, a failed AI call returns passages and a clear message instead of an error, and the metrics change as you use the page."),

    H("Solution"),
    P("You have read ops.js, answer.js and the route above. This is the Angular page."),
    F(LAB, 'steps/24/src/app/pages/ops.ts'),
    N("Set PRICE_INPUT_PER_MTOK and PRICE_OUTPUT_PER_MTOK in your .env file from the provider's current pricing page to see an estimated cost on the page. Without them the page tells you to set them."),

    H("What you learned"),
    L("Cost is calls times tokens times price. Estimate it before you launch and cut it with caching, smaller prompts and the right model.", "A cache saves money and time, a rate limit protects your budget, and a timeout and fallback keep the feature useful when the AI is slow or down.", "Measure requests, speed, tokens, cache hits, errors and cost. Log numbers, not user text.", "Keep secrets safe, keep prompts versioned and run your evaluation set before each release."),
    P("You now have all the pieces. In the final lesson you plan what to learn next and choose a project to build."),
  ], [
    { q: 'How do I reduce the cost of an AI feature?', a: 'Cache repeated questions, send fewer and shorter tokens, limit the output length, use a smaller model where it is good enough, use prompt caching for long repeated prefixes and stop wasteful loops with limits.' },
    { q: 'What should an AI app do when the AI provider is down?', a: 'Show something useful instead of an error, for example the best search results, saved content or a clear message. Use timeouts so that users are not left waiting.' },
    { q: 'Why log numbers instead of text?', a: 'Logs that contain user questions can expose personal data. Numbers like time, tokens and errors are enough to monitor the system without that risk.' },
    { q: 'What should I monitor?', a: 'Request count, error rate, average and slow response times, token use, cache hit rate and cost. Set alerts for sudden jumps.' },
  ], 'ai in production, llm cost optimization, llm caching, rate limiting node.js, llm monitoring'),

  // ------------------------------------------------------------------ 25
  lesson(S4, 'ai-learning-roadmap-and-projects', 'Your AI Learning Roadmap and Project Ideas', 'Review what you have built, plan your next steps, choose a portfolio project and write a project plan with data, design, safety, evaluation and cost before you write code.', '', [
    P("You have come a long way. In the first course you learned how models work and how to write prompts. In the second you built an Angular and Node app that talks to Claude: chat, streaming, caching, PDFs, tools and structured output. In this course you added your own data with RAG, built agents, connected tools through MCP, tested your work, protected personal data and made it ready for production."),
    P("This last lesson is different. There is no new technology. Instead, you will look back at the skills you have, see how they fit together, plan what to learn next, and choose a project that proves your skills to an employer or a client. The task is to write a **project plan**. Planning well is a skill, and it saves weeks."),

    H("What you can do now"),
    P("Look at the list of pages in your AI Lab. Each one is a skill you can explain and repeat:"),
    L("Call a model from a server and keep the key secret, handle errors and stream replies.", "Control cost with caching, limits and token counting.", "Get reliable JSON out of a model and validate it.", "Chunk, embed and search documents, with keywords, vectors or both.", "Answer from your own data with citations that the server checks.", "Build agents with tools, memory, step limits and token budgets.", "Build and use an MCP server, with permissions, approval and defence against prompt injection.", "Test an AI app with a golden set, protect personal data and run the feature in production."),
    P("This is a real set of skills. Many people can write a prompt. Fewer can build a system that is tested, safe and affordable. That second group is who companies look for."),

    H("The big picture"),
    P("Every AI product you will meet is made of the same few parts, arranged differently:"),
    O("**A model** that reads and writes text (or images, audio).", "**Context** that you give it: instructions, examples and retrieved data.", "**Tools** that let it act: search, read, write, call services.", "**A loop or a workflow** that connects the steps.", "**Guardrails**: validation, permissions, approval, limits and privacy.", "**Measurement**: tests, metrics and logs.", "**An interface** that makes it useful for a person."),
    P("When you look at a new AI product, try to name each part. You will start to see how it works, where it may fail and how you could build something like it."),

    H("What to learn next"),
    P("Choose by what you want to do. Here is a map, not a rule."),
    L("**If you want to build products:** deepen your web skills (authentication, databases, queues, deployment), and learn to build good user interfaces for AI features: streaming, progress, editing, undo and clear explanations.", "**If you want to improve quality:** learn evaluation in depth: bigger test sets, human review, A/B tests and regression suites. Learn more about retrieval: better chunking, real embedding models, rerankers and query rewriting.", "**If you want to build agents:** study the Claude Agent SDK and other frameworks, long-running tasks, sandboxes for running code, and observability tools that trace each step.", "**If you want to work with models:** learn the basics of fine-tuning, when it is worth it, and how to prepare data. Learn about open models you can run yourself and the trade-offs of size, speed and cost.", "**If you care about safety and governance:** read the provider's usage policies, study privacy law in your market, and learn red-teaming, which means attacking your own app to find weaknesses."),
    P("Whatever you choose, keep two habits. First, **read the current documentation** of every tool and model you use. This field changes every few months. Second, **build small things often**. Reading creates the feeling of knowing. Building creates the skill."),

    H("Five project ideas for your portfolio"),
    P("A good portfolio project is small enough to finish, real enough to be useful and shows the skills employers want. Here are five. For each, the main skills are listed."),
    O("**A help-center bot for a small business.** Load a business's FAQ, build RAG with hybrid search, cited answers and an evaluation set of 20 questions. Skills: RAG, citations, evaluation, refusal.", "**A resume reviewer.** Take a resume and a job post, return structured JSON with matched and missing skills and honest suggestions, and a page that explains every suggestion. Redact personal data first. Skills: structured output, privacy, prompt design.", "**A job-post summariser with caching.** Summarise job posts into five bullet points, cache repeated posts, rate limit users, and show cost per request. Skills: production basics, metrics.", "**A notes assistant with MCP.** An MCP server for your own notes with read, write and delete tools, a policy layer and approval for writes. Skills: MCP, security, human in the loop.", "**A study helper.** Load your course notes, answer questions with citations, and create a quiz from a chosen chapter. Skills: RAG, structured output, user interface."),
    P("Whichever you choose, finish it, publish it with a clear README, add a short video or screenshots and write what you would do differently. Employers read that last part carefully, because it shows judgement."),

    H("Plan before you build"),
    P("The most useful thing you can do before writing code is to answer a few questions in writing. The plan template in the lab has seven sections:"),
    O("**The problem.** Who has it, what do they do today, and what would better look like in one sentence?", "**The data.** What documents or records will the AI use? Who owns them? Do they contain personal data? How will you keep them up to date?", "**The design.** Do you need only a prompt, structured output, RAG, tools or MCP, or an agent loop? Choose the simplest one that can work.", "**Safety.** Which tool needs approval? Which text is untrusted? Which data is removed before it leaves your server? What does the app say when the AI is wrong or down?", "**Evaluation.** Write ten test questions and the answers or sources you expect, and say how you will run them after every change.", "**Cost and operations.** Estimate calls per day, tokens per call and monthly cost. Plan the cache, rate limit, timeout, fallback and metrics.", "**The first milestone.** What can a real user try within two weeks?"),
    F(LAB, 'steps/25/docs/capstone-plan.md'),
    P("Writing this takes about an hour, and it will save you days. Most failed AI projects fail because the problem or the data was unclear, not because the code was hard."),

    H("The capstone checklist page"),
    P("The last page in your lab is a checklist of the skills in this course, with a link to the page that practises each one. Tick a skill only when you could do it again without looking at the lesson. Your ticks are saved in the browser, so they are still there tomorrow. If storage is blocked, the page still works, it just does not remember. That is a good habit too: features should degrade, not break."),
    BUILD,

    H("Your task: write your project plan and finish the lab"),
    P("Choose one project idea (or your own) and write the plan. Then add the capstone page to your lab."),
    P("**What you will build**"),
    L("A file docs/capstone-plan.md, filled in for your chosen project.", "An Angular Capstone page with a checklist of the skills, links to the pages that practise them, a progress bar and saved ticks.", "A short list of your next three learning goals."),
    P("**Steps**"),
    O("Choose your project. Write one sentence about the problem and one sentence about who has it.", "Copy the plan template and answer all seven sections. Be specific: write real numbers for the cost estimate and real questions for the test set.", "Write ten test questions for your project and the answer or source you expect for each one.", "Build the Capstone page. Keep the list of skills in an array. Save the ticked ids in localStorage inside try/catch.", "Show a progress bar from the number of ticked skills.", "Tick only the skills you are sure about. Choose your three weakest and write a plan to practise each one this week."),
    P("**Hints**"),
    L("Link each skill to its lab page with routerLink.", "Filter the saved ids against the known list, in case the list changes later.", "If a section of the plan is hard to fill in, that is where the project is riskiest. Spend time there first."),
    P("**You know it works when** your plan answers all seven sections with specific details, the checklist remembers your ticks after a refresh, and the page still works when browser storage is blocked."),

    H("Solution"),
    P("The plan template was shown above. This is the Angular page:"),
    F(LAB, 'steps/25/src/app/pages/capstone.ts'),
    N("The solution zip for this lesson is the complete AI Lab with every page from both courses. Keep it as a reference project, and use it as the starting point for your own."),

    H("What you learned"),
    L("You can build, test, protect and run an AI feature end to end.", "Every AI product is a model, context, tools, a loop or workflow, guardrails, measurement and an interface.", "A written plan, with data, safety, evaluation and cost, saves more time than any trick.", "The way to keep the skill is to read current documentation and build small things often."),
    P("Congratulations on finishing the course. Pick your project, write the plan, and start building. If you publish it, you now have something real to show."),
  ], [
    { q: 'What should I learn after this course?', a: 'It depends on your goal. For products, deepen your web and interface skills. For quality, learn evaluation and retrieval in more depth. For agents, study agent frameworks and observability. For safety, learn privacy law and red-teaming.' },
    { q: 'What makes a good AI portfolio project?', a: 'It solves a real problem, is small enough to finish, shows evaluation, safety and cost thinking, and comes with a clear README and examples of what it can and cannot do.' },
    { q: 'Do I need to learn fine-tuning?', a: 'Not at the beginning. Most products start with prompting and RAG. Fine-tuning is worth learning when you have a clear need, such as a very consistent style or format, and enough good data.' },
    { q: 'How do I keep up with changes in AI?', a: 'Read the current documentation of the tools you use, follow the provider\'s release notes, and keep a small evaluation set so you can test a new model quickly.' },
  ], 'ai learning roadmap, ai project ideas, ai portfolio projects, learn generative ai, rag agents mcp roadmap'),
];
