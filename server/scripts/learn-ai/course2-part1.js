import { P, H, L, O, N, C, F, dl, lesson } from './helpers.js';

const LAB = 'claude-api-tool-use';
const S1 = 'Getting started with Claude';

const DOCS = N('Model names, features and prices change often. Before you ship anything, check the current Anthropic documentation at docs.anthropic.com. In this course the model name lives in one place (the .env file), so changing it is easy.');

export const lessons = [
  // ------------------------------------------------------------------ 1
  lesson(S1, 'what-is-anthropic-and-claude', 'What Is Anthropic and Claude?', 'Learn what Claude and the Claude API are, how to pick a model, and build the first screen of your Angular AI Lab with a Node server.', '14 min read', [
    P('Welcome to the Claude API course. In this course you will build one real project, step by step: an **Angular AI Lab**. It is a small web app with a Node.js server behind it. In every lesson you read an easy explanation, and at the end you get one task. You build the task yourself, and then you can download the full solution and compare it with your work.'),
    P('By the end of the course your AI Lab will chat with Claude, stream answers word by word, read PDFs, call tools, and compare a resume with a job post. These are the same building blocks used in real AI products. In this first lesson we start with the basics: what Claude is, how people use it, how to choose a model, and how the pieces of your project fit together.'),

    H('What is Anthropic, and what is Claude?'),
    P('Anthropic is a company that builds AI systems and does research on AI safety. **Claude** is the name of the AI assistant that Anthropic makes. Claude is a **large language model**, or LLM. You give it some text, and it writes text back. It can answer questions, summarise a long document, rewrite a resume bullet point, explain code, and much more.'),
    P('Think of Claude as a very well-read assistant who can write and reason in many languages. It is not a person, and it is not a search engine. It does not look things up on the internet by itself. It writes the answer based on what it learned during training and on the text you give it in your request. That is why the quality of your request matters so much, and why this course spends a lot of time on how to write good requests.'),

    H('Two ways to use Claude'),
    P('There are two main doors into Claude, and beginners often mix them up.'),
    L('**Claude.ai and the Claude apps.** This is a chat website and apps for phone and desktop. You type, Claude answers. It is made for people to use directly. It has its own plans and features.', '**The Claude API.** This is a service for programmers. Your code sends a request over the internet, and Claude sends an answer back. You use it to put Claude inside your own product, for example inside a resume builder.'),
    P('An easy way to remember the difference: Claude.ai is like eating at a restaurant. The API is like buying from the restaurant\'s kitchen to sell inside your own shop. Both use the same kitchen, but you pay and manage them separately. A paid plan for Claude.ai does not include API credits. API usage is billed by the amount you use, through the Anthropic Console, which is the website where you create API keys and see your usage.'),

    H('How a request to the API looks'),
    P('When your program talks to Claude, it sends a small package of information and gets a package back. The package you send contains three main things: which **model** to use, a **limit** on how long the answer can be, and the **messages**, which hold your question. The answer package contains Claude\'s text and some numbers that tell you how much was used. You will see real code for this in the next lesson. For now, remember the picture: a question goes in, an answer comes out, and everything is counted.'),
    P('Everything is counted in **tokens**. A token is a small piece of text, about a word or a part of a word. You pay for the tokens you send and the tokens Claude writes. We will study tokens in detail in lesson 3.'),

    H('The Claude model family'),
    P('Claude is not one single model. It is a family of models, and each one is a different trade-off between three things: how smart it is, how fast it replies, and how much it costs. This is just like vehicles. A big truck can carry a lot but uses more fuel and is slower in the city. A small scooter is quick and cheap but cannot carry much. You pick the vehicle that fits the job.'),
    L('**Larger, more capable models** are best for hard work: long reasoning, difficult coding, careful analysis. They cost more and reply more slowly.', '**Smaller, faster models** are best for simple, repeated work: sorting messages into categories, pulling a name and a phone number out of text, writing a short reply. They are cheaper and quicker.', '**Middle models** sit in between and are a good first choice for many products.'),
    P('Anthropic releases new versions regularly and retires old ones on a published schedule. This means you should never scatter a model name all over your code. Put it in one setting, like we do in the lab with the CLAUDE_MODEL value in the .env file. When a new version arrives, you change one line.'),

    H('How to choose a model without guessing'),
    P('Beginners often ask, "Which model is the best?" That is the wrong question. The right question is, "Which model is good enough for my task at the lowest cost and delay?" Here is a method that works for any project.'),
    O('Write down 20 or more real examples of your task. For a resume tool, collect 20 real bullet points and what a good rewrite looks like.', 'Run all the examples on a smaller model first.', 'Look at the answers. If they are good enough, stop. You are done, and you saved money.', 'If some answers are weak, try the same examples on a larger model and compare.', 'Decide for each feature separately. A simple feature can use a small model while a hard feature uses a larger one.'),
    P('Notice that the decision uses your own examples, not opinions from the internet. A model that is great on a public test can still be poor on your special kind of task, and the other way around.'),

    H('The big picture of your AI Lab'),
    P('Before we build, look at how the pieces connect. This picture stays the same for the whole course.'),
    O('The **Angular app** runs in the user\'s browser. It shows pages, buttons and forms.', 'The Angular app sends a request to **your Node.js server**.', 'Your server adds the secret **API key** and calls **Claude**.', 'Claude answers your server, your server cleans the answer, and sends it to Angular.'),
    P('Why not call Claude directly from Angular? Because anything that runs in the browser can be read by anyone. If you put your API key in Angular code, a stranger can open the browser tools, copy the key, and spend your money. The key must live only on your server. This is the number one rule of using any paid API, and the lab is built around it. Your server is also the place where you will check inputs, limit how often someone can call, and handle errors, so the browser never gets raw error details.'),
    P('Another small rule: keep the key out of your source code. We put it in a file called .env, and we add that file to .gitignore so it never goes to GitHub. In this lesson you do not need a key yet. Your first server only reports whether a key is present. You will make the first real request in lesson 2.'),
    DOCS,

    H('Your task: set up the AI Lab and build the Models page'),
    P('Now it is your turn. In this task you will create the project and build a first useful screen: a **Models page** where a user answers three simple questions and gets a suggestion of which kind of model to start with. The page also asks your server if it is running and if an API key has been found.'),
    P('**What you will build**'),
    L('An Angular project called ai-lab.', 'A small Node.js server in a folder called server, with one route: GET /api/health.', 'A proxy setting so Angular can call /api during development.', 'A Models page in Angular with a task selector, a volume selector, a "speed matters" checkbox, and a live suggestion.'),
    P('**Steps**'),
    O('Make sure Node.js 20 or newer is installed. Create the Angular project: run npx @angular/cli@20 new ai-lab --routing --style=css --ssr=false, then go into the folder. (This course uses Angular 20 with standalone components and signals.)', 'Install the server tools: npm install express dotenv @anthropic-ai/sdk.', 'Create server/package.json containing { "type": "module" } so the server can use import statements.', 'Create server/claude.js. It reads CLAUDE_MODEL from the environment and creates the Claude client. Create server/index.js that starts Express and loads every file in server/routes.', 'Create server/routes/health.js with a GET /health route that returns ok, the model name, and whether an API key exists (true or false, never the key itself).', 'Create proxy.conf.json that sends /api to http://localhost:3000, and change the start script in package.json to ng serve --proxy-config proxy.conf.json.', 'In Angular, add provideHttpClient() to app.config.ts. Create a page component called ModelsPage with the three questions, a suggestion function and a call to /api/health. Add it to your routes.', 'Copy .env.example to .env. Run the server with node server/index.js and Angular with npm start. Open http://localhost:4200/models.'),
    P('**Hints**'),
    L('The suggestion can be simple if-statements: hard tasks (reasoning, coding) with low volume suggest a larger model; simple tasks with high volume or a need for speed suggest a smaller model; everything else suggests a middle model.', 'Use a signal for the health result, and show three states: checking, running, and cannot reach the server.', 'If Angular cannot reach the server, check that both programs are running and that proxy.conf.json is used by npm start.'),
    P('**You know it works when** the Models page shows "Server is running" with your model name, the suggestion text changes when you change the selectors, and the page shows a clear message if you stop the server.'),
    P('Try the task on your own first. Even if you get stuck, the effort teaches you much more than copying. When you are ready, compare with the solution below.'),

    H('Solution'),
    P('The solution zip contains the complete project after lesson 1: the Angular config files, the styles, the server skeleton and the Models page. After you unzip it, run npm install, copy .env.example to .env, then start the server and Angular as described in the README inside the zip. Here are the two most important files.'),
    P('**server/routes/health.js** (the API route):'),
    F(LAB, 'steps/01/server/routes/health.js'),
    P('**src/app/pages/models.ts** (the Angular page):'),
    F(LAB, 'steps/01/src/app/pages/models.ts'),
    P(`[Download the lesson 1 solution (zip)](${dl(LAB, 1)})`),
    N('Notice that the page never contains an API key, and the health route only says whether a key exists. This habit will protect you in every later lesson.'),

    H('What you learned'),
    L('Claude is a family of models from Anthropic. You use it in an app through the Claude API.', 'The API is billed by usage, separate from Claude.ai plans.', 'Choose a model by testing your own examples, from small to large.', 'The key stays on the server. Angular talks to your server, and your server talks to Claude.'),
    P('In the next lesson you will create an API key, store it safely, and send your first real message to Claude from the AI Lab.'),
  ], [
    { q: 'Is the Claude API free?', a: 'API usage is paid by tokens. Check the Anthropic Console and pricing page for current terms, including any free credits for new accounts.' },
    { q: 'Why does my Angular app need a Node server?', a: 'Because the API key must stay secret. Code in the browser can be read by anyone, so the server holds the key and calls Claude for you.' },
    { q: 'Which Claude model should I pick?', a: 'Test your own examples. Start with a smaller, faster model and move up only where the answers are not good enough.' },
  ], 'what is claude, anthropic claude models, claude api angular, claude api vs claude.ai, angular node ai project'),

  // ------------------------------------------------------------------ 2
  lesson(S1, 'set-up-claude-api-key-node', 'Set Up the Claude API in Node.js', 'Create an API key, keep it safe, install the SDK and send your first request to Claude from an Angular app through a Node server.', '15 min read', [
    P('In lesson 1 you built the skeleton of the AI Lab. Now we bring it to life. In this lesson you will get an API key, store it the safe way, and send your first real question to Claude. At the end, a user will type a question in your Angular page and see Claude\'s answer.'),

    H('Step 1: Get an API key'),
    P('An **API key** is a long secret text that proves a request comes from your account. It works like the key to your shop: whoever holds it can use your account and spend your money. To get one, create an account in the Anthropic Console, add a payment method or credits as required, and create a key. The console shows the key only once. Copy it and keep it somewhere safe right away, because you cannot view it again later. If you lose it, you simply create a new one.'),
    P('Create separate keys for development and for production. If a development key leaks, you can delete it without breaking your live site. Give each key a clear name such as "ai-lab-dev" so you remember what it is for.'),

    H('Step 2: Keep the key secret'),
    P('Most key leaks happen by accident. Someone puts a key in the source code, pushes the code to GitHub, and bots find it within minutes. Follow these simple rules every time.'),
    L('Store the key in a file called **.env** on the server. The file has lines like ANTHROPIC_API_KEY=your-key-here.', 'Add .env to your .gitignore file so Git never uploads it. Commit a file called .env.example instead, with the names but no real values.', 'Never put the key in Angular code or in any file that goes to the browser.', 'If a key ever appears in a public place, delete it in the console and create a new one immediately.', 'On a real server (such as your VPS), set the key as an environment variable, not in a file inside the project folder.'),
    P('The AI Lab already has these protections. Look at server/index.js from lesson 1: the first line imports dotenv, which reads the .env file and puts its values into process.env, where the rest of the server can use them.'),

    H('Step 3: The SDK'),
    P('You could call the Claude API with plain HTTP requests, but Anthropic provides an **SDK**, a ready-made library, for JavaScript and TypeScript. It is called @anthropic-ai/sdk. It handles the details for you: the right web address, the headers, the formatting of messages, and even some automatic retries when the network has a small problem. In the AI Lab it is already listed in package.json, so npm install gets it for you.'),
    P('Creating the client takes one line: new Anthropic(). It reads the key from the ANTHROPIC_API_KEY environment variable by itself. That is why our file server/claude.js stays so small.'),

    H('Step 4: Your first message'),
    P('Here is the heart of every Claude request, using the Messages API.'),
    C('javascript', `const reply = await client.messages.create({
  model: MODEL,
  max_tokens: 500,
  messages: [{ role: 'user', content: 'Give me three tips for a fresher\\'s resume.' }],
});

console.log(reply.content[0].text);`),
    P('Let us read it slowly, because you will write this many times.'),
    L('**model** says which Claude model to use. We take it from the .env file.', '**max_tokens** is the longest answer you accept, counted in tokens. It is required. It is a ceiling, not a target, and it protects your bill: even if Claude wants to write a very long answer, it stops at this limit.', '**messages** is a list. Each message has a **role** and some **content**. The role "user" means the message comes from the person asking. Here we send one message.'),
    P('The reply is an object. Its **content** is a list of blocks, because an answer can contain more than text (later you will see tool requests too). For a simple answer there is one text block, and its text is in reply.content[0].text. To be safe in real code, we join all the text blocks together. That is what the small helper textOf() in server/claude.js does. The reply also has **usage**, which tells you how many tokens went in and came out, and **stop_reason**, which tells you why Claude stopped (for example, it finished, or it hit your max_tokens limit).'),

    H('Check what comes from the browser'),
    P('Your server is a front door. Anyone on the internet can send anything to it, so check every input. In our route we do three small things. We turn the question into text, trim the spaces, and cut it to 2,000 characters so nobody can send a book and make you pay for it. If the question is empty, we answer with a clear 400 error that says "Please type a question". Good validation is cheap and prevents expensive surprises.'),

    H('Show a friendly error'),
    P('Many things can go wrong: the key is missing, the internet is down, Claude is busy. In lesson 1 we added one error handler at the bottom of server/index.js. It writes the full error to the server log for you, but sends only a short, safe message to the browser. Never show raw error text to users. It can contain details that help attackers and it confuses normal people. In Angular, our small helper errorText() in util.ts reads that safe message and shows it.'),

    H('How Angular sends the question'),
    P('On the Angular side we use **HttpClient**, the built-in tool for talking to servers. The page keeps its state in **signals**: loading, error and reply. A signal is a small box that holds a value. When the value changes, Angular updates the screen by itself. The flow is simple. When the user presses Ask, the page sets loading to true, posts the question to /api/ask, waits for the answer, stores it in the reply signal, and sets loading back to false. The finally block makes sure loading is turned off even if something fails.'),
    DOCS,

    H('Your task: build the Ask page'),
    P('Add a page where a user types a question and gets Claude\'s answer, with a loading state and a friendly error message.'),
    P('**What you will build**'),
    L('A POST /api/ask route on the server that validates the question, calls Claude, and returns the answer text, the token usage, and the stop reason.', 'An Ask page in Angular with a text area, an Ask button that is disabled while loading, the answer, and the token usage under it.', 'A shared errorText() helper that turns any HTTP error into one friendly sentence.'),
    P('**Steps**'),
    O('Start from your lesson 1 project, or download the lesson 1 solution.', 'Create your API key and put it into .env as ANTHROPIC_API_KEY. Restart the server so it reads the file.', 'Create server/routes/ask.js with the POST /ask route. Validate the question (not empty, at most 2,000 characters). Call client.messages.create with max_tokens 500.', 'Return JSON with text, usage and stopReason.', 'Create src/app/util.ts with errorText(). It should return the server\'s message if it exists, or a general sentence if not.', 'Create AskPage with signals for loading, error and reply. Add it to the routes and to the menu.', 'Try a normal question. Then try an empty question, then stop the server and press Ask again, and see that the error is friendly.'),
    P('**Hints**'),
    L('Use firstValueFrom(this.http.post(...)) to use async and await with HttpClient.', 'Show the usage like "Used 20 input and 12 output tokens" so you start to notice how short answers are cheap.', 'If you get an authentication error, check that the key is correct, that you restarted the server, and that your account has credits.'),
    P('**You know it works when** a real answer appears, the button shows "Thinking..." while waiting, an empty question gives a clear message, and no key or raw error text ever appears in the browser.'),

    H('Solution'),
    P('The lesson 2 zip is the lesson 1 project plus the files below. The server route:'),
    F(LAB, 'steps/02/server/routes/ask.js'),
    P('The Angular page:'),
    F(LAB, 'steps/02/src/app/pages/ask.ts'),
    P('The shared helper (it was added in the base files, so it is already in the zip):'),
    F(LAB, 'base/src/app/util.ts'),
    P(`[Download the lesson 2 solution (zip)](${dl(LAB, 2)})`),
    N('Never paste your real key into a lesson, a chat or a screenshot. If you do by mistake, delete that key in the console and make a new one.'),

    H('What you learned'),
    L('An API key is a secret. Keep it in .env on the server, and keep .env out of Git.', 'The Messages API takes a model, max_tokens and a list of messages, and returns content blocks, usage and a stop reason.', 'Validate every input and show friendly errors; never show raw server errors.', 'Angular signals hold loading, error and result state in a clean way.'),
    P('Next, lesson 3 shows how tokens are counted, how to estimate cost, and how to protect your budget.'),
  ], [
    { q: 'Can I call the Claude API directly from Angular?', a: 'No. Anyone could read your key in the browser. Call it from your server and let Angular talk to your server.' },
    { q: 'What if I get an authentication error?', a: 'Check that the key is correct, that the .env file is loaded where the server runs, that you restarted the server after changing it, and that your account has credits.' },
    { q: 'Why is max_tokens required?', a: 'It sets a hard limit on how long the answer can be. It protects you from very long, expensive replies.' },
  ], 'claude api key, anthropic sdk node.js, first claude api request, angular call claude api, keep api key secret'),

  // ------------------------------------------------------------------ 3
  lesson(S1, 'claude-api-pricing-limits-tokens', 'Claude API Tokens, Pricing and Rate Limits', 'Understand tokens, count them before you send, estimate cost in your Angular app, and handle rate limits and budgets.', '15 min read', [
    P('Every request to the Claude API costs a little money, and the cost depends on tokens. If you understand tokens, you can predict your bill, avoid surprises and design features that are cheap to run. This lesson explains tokens in simple words and then adds a **Tokens page** to your AI Lab that counts tokens and shows the cost of each request.'),

    H('What is a token?'),
    P('Claude does not read text letter by letter or word by word. It first cuts your text into small pieces called **tokens**. A token can be a short word, a piece of a long word, a number or a punctuation mark. As a rough guide for English, one token is a bit less than one word, so 100 words are around 130 tokens. Other languages and special text, like code or unusual names, often use more tokens for the same length.'),
    P('You do not need to count by hand. The API tells you exactly how many tokens each request used, and it can even count the tokens of a text before you send it.'),

    H('Input tokens and output tokens'),
    P('Every request has two sides, and they are priced separately.'),
    L('**Input tokens** are everything you send: the system prompt, the whole chat history, any documents, and the definitions of tools. Even if the user types one short line, the history behind it may be long.', '**Output tokens** are what Claude writes back. They usually cost more per token than input tokens, because writing is more work than reading.'),
    P('Think of a tailor. Reading your measurements (input) is quick. Cutting and sewing the cloth (output) takes more effort, so it costs more. This is why a very long answer is expensive, and why we use max_tokens to set a ceiling.'),

    H('Where does the price come from?'),
    P('Anthropic publishes a price for each model, usually per million tokens, with one price for input and one for output. Prices change, and different models have different prices, so you should always copy the current numbers from the official pricing page. In the AI Lab we do not write any price into the code. You put your own numbers into the .env file (PRICE_INPUT_PER_MTOK and PRICE_OUTPUT_PER_MTOK). Then the cost formula is easy:'),
    P('cost = (input tokens ÷ 1,000,000 × input price) + (output tokens ÷ 1,000,000 × output price)'),
    P('For example, if a request used 2,000 input tokens and 500 output tokens, you work out the input part and the output part separately, and add them. A single request is usually a tiny amount. The danger is volume: a thousand users making ten requests each every day adds up quickly. That is why we track usage from day one.'),

    H('Count tokens before you send'),
    P('Sometimes you want to know the size of a request before paying for it. For example, you might check whether a long resume fits, or warn a user that a document is too big. The API has a token counting feature for this. It does not create an answer, so there is no output cost.'),
    C('javascript', `const result = await client.messages.countTokens({
  model: MODEL,
  messages: [{ role: 'user', content: longText }],
});
console.log(result.input_tokens);`),

    H('Track usage and set budgets'),
    P('Every answer includes a **usage** object. Good products record it. A simple habit is to log, for every request: which feature made it, which user made it, the input tokens, the output tokens, and the time. With this log you can answer important questions later. Which feature costs the most? Which user is making unusual numbers of requests? Did the new prompt we deployed yesterday double our cost?'),
    L('Show usage in an admin dashboard so you see it every day.', 'Give each user or plan a quota, for example a number of AI actions per day.', 'Set an alert when the daily spending jumps.', 'Where the provider allows it, set a monthly spending cap in the console as a safety net.'),

    H('Rate limits'),
    P('The API also limits how fast you can use it. These **rate limits** are measured in requests per minute and tokens per minute. If you go over, the API answers with an error, usually status 429, which means "too many requests". You should not panic or retry instantly in a loop. The right reaction is to wait a short time and try again, and to design your product so that a sudden crowd does not hit the limit all at once. Lesson 6 covers retries properly. For now, know that limits exist, that they depend on your account, and that they can be raised as you grow.'),

    H('Ways to spend less'),
    L('Use the smallest model that passes your tests (lesson 1).', 'Keep prompts short. Remove old chat messages you no longer need.', 'Set a sensible max_tokens for each feature.', 'Use prompt caching for long text that repeats (lesson 7).', 'Use batch processing for work that can wait, such as scoring thousands of stored resumes overnight.', 'Do not call the API for something plain code can do. Counting words, checking an email format or removing spaces needs no AI.'),
    DOCS,

    H('Your task: build the Tokens page'),
    P('Create a page that counts the tokens of any text, sends it to Claude, and keeps a usage log with the cost of each call and a running total.'),
    P('**What you will build**'),
    L('A POST /api/count route that returns the input token count using client.messages.countTokens.', 'A GET /api/pricing route that returns the prices from .env (or nulls if you have not set them).', 'A Tokens page with two buttons, "Count input tokens" and "Send to Claude", and a usage table with a total.'),
    P('**Steps**'),
    O('Start from your lesson 2 project, or download the lesson 2 solution.', 'Add PRICE_INPUT_PER_MTOK and PRICE_OUTPUT_PER_MTOK to .env. Copy the current numbers from Anthropic\'s pricing page for your model. Restart the server.', 'Create server/routes/count.js with the two routes. Limit the text to 20,000 characters.', 'Create TokensPage. On "Count", call /api/count and show the number. On "Send", call /api/ask (from lesson 2), and add the returned usage to a signal that holds a list.', 'Write a cost() method that uses the prices from /api/pricing. If the prices are missing, show a hint instead of a number.', 'Show a table with one row per call and a total. Try a short text and a long text and compare.'),
    P('**Hints**'),
    L('Use signal<Usage[]>([]) and calls.update(list => [...list, usage]) to add rows.', 'Divide by 1,000,000 before multiplying by the price per million.', 'Show the cost with six decimals, because single requests are tiny.'),
    P('**You know it works when** the token count appears before sending, each real call adds a row with input and output tokens, and the total grows as you send more. As a bonus, try adding a "daily budget" field that turns the total red when you pass it.'),

    H('Solution'),
    P('The server routes:'),
    F(LAB, 'steps/03/server/routes/count.js'),
    P('The Angular page:'),
    F(LAB, 'steps/03/src/app/pages/tokens.ts'),
    P(`[Download the lesson 3 solution (zip)](${dl(LAB, 3)})`),
    N('The prices are deliberately not in the code. Prices change, so keep them in a setting that you can update without editing code.'),

    H('What you learned'),
    L('Text is split into tokens. You pay for input tokens and output tokens, at different prices.', 'countTokens tells you the size of a request before you send it.', 'The usage object lets you log cost per request and track spending.', 'Rate limits exist; handle them with patience and good design, not with instant retries.'),
    P('In lesson 4 we move from one question to a real conversation with memory.'),
  ], [
    { q: 'Why was my bill higher than I expected?', a: 'Common causes are long chat history sent on every call, large documents, very long answers and retries. Log the usage of every request so you can see which feature is responsible.' },
    { q: 'What does a 429 error mean?', a: 'You hit a rate limit. Wait a little and try again with increasing delays, and design your app so that traffic is spread out.' },
    { q: 'Do I pay for counting tokens?', a: 'Counting tokens does not generate an answer, so there is no output cost. Check the current documentation for any limits on the counting feature.' },
  ], 'claude api pricing, token counting, claude rate limits, estimate llm cost angular, usage tracking'),
];
