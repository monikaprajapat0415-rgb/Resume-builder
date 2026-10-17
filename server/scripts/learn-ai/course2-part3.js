import { P, H, L, O, N, C, F, dl, lesson } from './helpers.js';

const LAB = 'claude-api-tool-use';
const S3 = 'Advanced API features';
const S4 = 'Tool use';

const DOCS = N('Model names, features, limits and prices change often. Check the current Anthropic documentation at docs.anthropic.com before you ship.');

export const lessons = [
  // ------------------------------------------------------------------ 7
  lesson(S3, 'prompt-caching-and-batch-processing', 'Prompt Caching and Batch Processing', 'Cut cost and delay for repeated prompts with prompt caching, learn when to use the batch API, and add a cache dashboard to your Angular AI Lab.', '15 min read', [
    P('Imagine you run a resume review service. Every review starts with the same long set of rules: how to write a summary, how to word bullet points, what to avoid. Only the resume changes. If you send those rules again and again for every user, you pay to process the same text every time. **Prompt caching** is a feature that fixes exactly this. In this lesson you will learn how it works, and you will build a page that shows it working.'),

    H('The problem: the same text, again and again'),
    P('Remember from lesson 3 that you pay for every input token. A long system prompt of a thousand words might be fine once, but if one hundred users run a review in an hour, you send and pay for that long text one hundred times, even though it never changed. It also takes Claude a little time to read it each time. This wastes both money and seconds.'),
    P('Think of a teacher who must explain the same classroom rules to every new student. Instead of reading the full rulebook out loud each time, the teacher could keep a copy that every student can look at. Caching is like that copy.'),

    H('How prompt caching works'),
    P('With prompt caching, you tell the API: "this first part of my prompt will not change, so please remember it." The first time, Claude processes that part and stores it for a short time. This first call is called a **cache write**. On later calls that start with exactly the same text, Claude reads it from storage instead of processing it again. This is a **cache read**. Cache reads are cheaper than normal input tokens and are usually faster. Cache writes can cost a little more than normal input, so caching pays off when the same prefix is used several times. The exact price rules are in the official documentation.'),
    P('You mark the part to cache with a small setting called **cache_control**. Here is how our lab does it.'),
    C('javascript', `const reply = await client.messages.create({
  model: MODEL,
  max_tokens: 500,
  // stable text FIRST, marked for caching
  system: [{ type: 'text', text: RULES, cache_control: { type: 'ephemeral' } }],
  // changing text LAST
  messages: [{ role: 'user', content: '<resume>' + resume + '</resume> Review this resume.' }],
});`),
    P('Notice that "system" is now a list of blocks instead of a plain string. That is how you attach the cache_control setting to a block. The word "ephemeral" means the cache lasts only a short time. If nobody uses it for a few minutes, it expires, and the next call writes it again. Busy features keep refreshing it, so they enjoy cache reads all day.'),

    H('The most important rule: stable first, changing last'),
    P('Caching works on the **beginning** of your prompt. The cache is used only when the start of the new request is exactly the same as the cached start. So you must put the parts that never change at the beginning, and the parts that change at the end. A common mistake is to put the user\'s name or the current date at the top of the system prompt. Because that text differs every time, nothing matches, and the cache is never used. Keep the top clean and stable. Put anything that changes, like the user\'s resume, after it.'),

    H('Minimum size and other limits'),
    P('Caching is meant for large, repeated text, so there is a **minimum size** for the cached part. If your text is too short, the cache setting is simply ignored, and you will see zero cache tokens. That is not an error, it just means there was nothing worth caching. The minimum can differ between models, so check the documentation. In our lab, the file server/data/resume-rules.txt contains about a thousand words of useful resume-review rules. If you still see zeros, make the rules text longer. You should also know that the cache is kept for a short time and that only exact matches count: changing even one character in the cached part creates a new cache entry.'),

    H('Reading the numbers'),
    P('The usage object tells you what happened. Besides the normal input and output tokens, it can include two extra numbers.'),
    L('**cache_creation_input_tokens**: how many tokens were written to the cache in this call.', '**cache_read_input_tokens**: how many tokens were read from the cache in this call.'),
    P('Your first call should show a cache write and your second call, within a few minutes, should show a cache read of the same size. If both stay zero, check the minimum size and the order of your prompt. Showing these numbers on a dashboard is the best way to be sure that your caching works. You should log them in a real product, so you can see how much you save.'),

    H('Batch processing: when the answer can wait'),
    P('Caching is for requests that users are waiting for. Another feature, the **Message Batches API**, is for work that can wait. You submit a large group of requests at once, and Anthropic processes them in the background. You collect the results later, usually at a lower price than normal requests. The answers are not instant: a batch finishes within a time window, not in a second.'),
    P('Good uses for batches are tasks with many items and no hurry: scoring ten thousand stored resumes overnight, writing descriptions for a whole catalogue, or running a big test of a new prompt. A bad use is anything a person is waiting for on screen. You can combine batches and caching, because both reduce cost in different ways.'),
    L('Same long prefix, many live requests: **prompt caching**.', 'Many independent jobs, no hurry: **batches**.', 'Both together: possible, for large offline jobs with a shared long prefix.'),
    P('We will practise caching in the lab, because it works with the normal request you already know. Batches use a separate set of endpoints and a "submit, wait, collect" workflow, which you can add to your own project later using the documentation.'),

    H('Caching is not magic'),
    P('Before you rely on caching, test it. Measure the input token counts with and without it, and check the cost. Caching will not help a feature that is called only once a day, or where every prompt is different. For such cases, shorter prompts and a smaller model are better ways to save money.'),
    DOCS,

    H('Your task: build the Caching page'),
    P('Add a page that reviews a resume using a long, cached rules prompt, and shows a table of token usage including cache writes and cache reads for each call.'),
    P('**What you will build**'),
    L('A data file server/data/resume-rules.txt with at least a thousand words of review rules (the zip has a ready-made one; try writing your own version first).', 'A POST /api/cached route that sends the rules as a cached system block and the resume as the user message.', 'A Caching page with a resume text box, a "Review resume" button and a table with columns for normal input, cache write, cache read and output.'),
    P('**Steps**'),
    O('Start from your lesson 6 project, or download the lesson 6 solution.', 'Write the rules text. Include clear rules about honesty, structure, the summary, bullet points and the format of the answer.', 'Read the file once when the server starts (fs.readFileSync) and keep it in a constant. Do not read it again for every request.', 'Create the route. Put the rules in a system block with cache_control. Wrap the resume in <resume> tags in the user message.', 'Return the usage in a simple shape: input, output, cacheWrite and cacheRead (use 0 when a value is missing).', 'In Angular, append each response\'s usage to a list and show it as a table. Highlight non-zero cache values in green.', 'Press the button twice, quickly. Check that the first call has a cache write and the second a cache read. Then wait several minutes and try again to see the cache expire.'),
    P('**Hints**'),
    L('The usage fields may be missing when caching is not used, so use "?? 0".', 'If the numbers are always zero, check that the rules text is long enough and that nothing at the top of the prompt changes between calls.', 'Do not cache the resume. It is different every time.'),
    P('**You know it works when** the second call shows a large cache read and a small normal input count, and when you can explain in one sentence why putting the resume first would break the cache.'),

    H('Solution'),
    P('The route (the rules file is in the zip, in server/data):'),
    F(LAB, 'steps/07/server/routes/cached.js'),
    P('The Angular page:'),
    F(LAB, 'steps/07/src/app/pages/caching.ts'),
    P(`[Download the lesson 7 solution (zip)](${dl(LAB, 7)})`),

    H('What you learned'),
    L('Prompt caching reuses a repeated start of your prompt, so repeated calls are cheaper and often faster.', 'Put stable text first and changing text last, and make the cached part long enough.', 'Check cache_creation_input_tokens and cache_read_input_tokens to confirm it works.', 'Use the Batches API for large jobs that can wait.'),
    P('In lesson 8 Claude learns to read PDFs and images.'),
  ], [
    { q: 'Where should cached text go in the prompt?', a: 'At the start. The cache matches the beginning of the prompt, so put the part that never changes first and the changing part last.' },
    { q: 'Why are my cache numbers always zero?', a: 'The cached part may be below the minimum size, something at the start of the prompt may change on every call, or the cache expired. Check the documentation for the minimum size of your model.' },
    { q: 'Can users wait for a batch result?', a: 'Not usually. Batches finish within a time window, not instantly, so use them for background work.' },
  ], 'claude prompt caching, cache_control ephemeral, message batches api, reduce claude cost, angular ai dashboard'),

  // ------------------------------------------------------------------ 8
  lesson(S3, 'claude-vision-pdf-documents', 'Images, PDFs and Documents with Claude', 'Send PDFs and images to Claude, extract structured data from a resume file, handle uploads safely in Node and build an upload page in Angular.', '15 min read', [
    P('So far Claude has only read text that you typed. But real resumes arrive as PDF files, and people take photos of certificates and forms with their phones. Claude can read these too. In this lesson you add a **Documents page** to your AI Lab: the user uploads a resume file, and Claude finds the name, the skills and the jobs in it.'),

    H('What Claude can read'),
    P('Claude understands more than plain text. You can give it:'),
    L('**Images**, such as a photo of a certificate, a screenshot or a scanned page (PNG, JPEG and WebP are common).', '**PDF files**, including their text and their pictures and tables.'),
    P('This is useful for many jobs: reading a resume from a PDF, pulling the numbers out of an invoice, describing a chart, or checking how a resume looks. Because it reads the picture of the page as well as its text, it can often manage layouts that simple text extraction breaks on, such as tables and columns.'),

    H('How you send a file'),
    P('A message\'s content does not have to be one piece of text. It can be a **list of blocks**: some files and some text. Files are sent as **base64**, which is a way of writing a file\'s bytes as plain text so that it can travel inside JSON. In Node, you read the file into a buffer and call buffer.toString("base64").'),
    C('javascript', `const data = fileBuffer.toString('base64');

const reply = await client.messages.create({
  model: MODEL,
  max_tokens: 1000,
  messages: [{
    role: 'user',
    content: [
      { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } },
      { type: 'text', text: 'List the job titles and companies in this resume as JSON.' },
    ],
  }],
});`),
    P('For an image, the block type is "image" and the media type is image/png, image/jpeg or image/webp. The text block comes after the file and tells Claude what to do with it. This is a good habit: the file first, the question after it.'),

    H('Asking for JSON'),
    P('Our page needs data it can show as a list, not a paragraph. So we ask Claude to reply with JSON only and we describe the exact shape: a name, a list of skills, and a list of jobs with title and company. We also say "use null when unknown" and "do not invent anything". This last sentence matters a lot for resumes. Without it, a model may try to be helpful and fill a gap with a guess, and a made-up job title on a resume is a serious problem.'),
    P('Even with a good prompt, models sometimes wrap JSON in a code fence, or add a friendly sentence before it. Our server strips code fences and then parses the result. Then it checks the data against a **zod** schema, a small description of what valid data looks like: a name that is a string or null, skills that are a list of strings, and jobs that are a list of objects. If the check fails, we send a friendly error. We never pass unchecked model output to the browser or the database.'),

    H('Handling uploads safely'),
    P('A file upload is a risky door into your server, so be careful. In Express we use a library called **multer** to read the upload. These are the safety rules we follow.'),
    L('**Memory only.** We keep the file in memory and never write it to disk, so there is nothing to clean up and nothing to leak. In your real product, decide how long you keep user files, and tell the users.', '**Limit the size.** We accept 5 MB at most. A big file costs more tokens and can be used to attack your server. We turn the multer "too large" error into a clear 413 message.', '**Allow only the types you expect.** PDF, PNG, JPEG and WebP only. Do not trust the file name or the type sent by the browser alone. For a PDF we also check that the file really starts with the characters "%PDF".', '**One file at a time.** We set the maximum number of files to one.'),

    H('Privacy comes first'),
    P('A resume contains personal data: a name, a phone number, an address. When you send it to an AI service, you are sharing that data, so treat it carefully. Send only what you need. Tell users in plain words what happens to their file. Check the data-retention terms of your AI provider and follow the privacy laws that apply to your users. Never write the content of a user\'s file into your logs. In the lab page we show a short privacy reminder next to the upload button, and you should do the same in a real product.'),

    H('Limits and quality'),
    P('Files and images count as input tokens, so a long PDF costs more than a short text. There are limits on file size and on the number of pages, which you can find in the documentation. Scans with low quality, handwriting or very small text can be read wrongly. For anything important, show the extracted data to the user so they can correct it, rather than trusting it blindly. This "show and confirm" step is an easy way to catch mistakes.'),

    H('The Angular side'),
    P('In Angular, a file input gives you a File object when the user picks a file. To upload it, you create a **FormData** object, append the file to it, and post it with HttpClient. Do not set the content type header yourself; the browser adds the correct multipart header with a boundary automatically. After the answer arrives, store it in a signal and show the name, the skills as small chips and the jobs as a list.'),
    DOCS,

    H('Your task: build the Documents page'),
    P('Let a user upload a resume PDF or photo, and show what Claude found in it.'),
    P('**What you will build**'),
    L('A POST /api/read-document route that accepts one file, checks it, sends it to Claude, validates the JSON answer and returns it.', 'A Documents page with a file input, a Read button, a privacy note, and a result view (name, skills, jobs).'),
    P('**Steps**'),
    O('Start from your lesson 7 project, or download the lesson 7 solution.', 'Use multer with memory storage, a 5 MB limit and one file. Write a small wrapper that converts multer errors into friendly 413 and 400 messages.', 'Check the type: a PDF must have the PDF header; images must be PNG, JPEG or WebP. Reject everything else with 400.', 'Build the file block (document or image) and the text block, and call Claude with max_tokens 1000.', 'Strip code fences, parse the JSON and validate it with zod. On failure return 422 with a friendly message.', 'In Angular, build the page with FormData. Show the result as a name, chips and a list.', 'Test with a real PDF, with a photo of a resume, with a text file (it should be rejected) and with a file bigger than 5 MB.'),
    P('**Hints**'),
    L('Use upload.single("file") and read the file from req.file.', 'Do not set Content-Type yourself when sending FormData.', 'Keep the prompt strict: "JSON only, use null when unknown, do not invent anything".'),
    P('**You know it works when** a clear resume gives a correct list, a bad file gives a friendly error, and the server never stores the file.'),

    H('Solution'),
    P('The route:'),
    F(LAB, 'steps/08/server/routes/documents.js'),
    P('The Angular page:'),
    F(LAB, 'steps/08/src/app/pages/documents.ts'),
    P(`[Download the lesson 8 solution (zip)](${dl(LAB, 8)})`),

    H('What you learned'),
    L('Claude can read PDFs and images. Send them as blocks, with your question after the file.', 'Ask for JSON, strip code fences, then validate with a schema before using the data.', 'Make uploads safe: memory only, a size limit, allowed types and a real-file check.', 'Treat user files as personal data and say what you do with them.'),
    P('Lesson 9 is the big one: tool use, where Claude can ask your server to run functions.'),
  ], [
    { q: 'Can Claude read scanned PDFs?', a: 'It can often read text in images, but the quality depends on the scan. Always let the user check important extracted data.' },
    { q: 'Is it safe to send resumes to an AI API?', a: 'Treat them as personal data. Send only what you need, protect the data in transit and storage, follow your privacy policy and local law, and check the provider\'s data-retention terms.' },
    { q: 'Why validate JSON that Claude produced?', a: 'Because models can add extra text, skip a field or use a wrong type. Validation stops bad data from reaching your page or database.' },
  ], 'claude pdf api, claude vision image, resume parsing ai, angular file upload, multer node upload'),

  // ------------------------------------------------------------------ 9
  lesson(S4, 'claude-tool-use-explained', 'Claude Tool Use: How It Works', 'Learn how Claude calls your functions: tool definitions, the request and result loop, and build an Angular page that shows every tool call Claude makes.', '17 min read', [
    P('Until now Claude could only talk. It could not check a number in your database, count words exactly, or save a note. **Tool use** (also called function calling) changes that. You describe some functions to Claude, and when it needs one, it asks your server to run it. This is the idea behind almost every "AI assistant that can do things". In this lesson you will build it and watch every step in your Angular page.'),

    H('The idea in one picture'),
    P('Imagine a manager (Claude) sitting in an office with a helper (your server). The manager cannot leave the office. When the manager needs a fact, like how many words are in a document, the manager writes a note: "Please run the function count_words on this text." The helper does the job and brings back the result. The manager then reads the result and continues. Importantly, the manager never does the work itself. **Claude never runs your function. Your code does.**'),
    P('This is a big safety point. Claude only asks. Your code decides whether to do it, checks the request, and does the work. You are always in control.'),

    H('The flow, step by step'),
    O('You send the user\'s message **and a list of tools** that Claude may use.', 'Claude thinks. If it can answer directly, it answers and the story ends. If it needs a tool, it replies with a **tool_use** block: the tool\'s name, the input it wants to give, and a unique id. The stop reason of this reply is "tool_use".', 'Your code reads the request, runs the function and gets a result.', 'You send the result back in a new user message, as a **tool_result** block that carries the same id.', 'Claude reads the result and writes the final answer. Or it asks for another tool, and the loop continues.'),
    P('Because this is a loop, there can be several rounds. A user might ask a question that needs two tools, and Claude may ask for them one after the other, or both at once in the same reply.'),

    H('Describing a tool'),
    P('Each tool has three parts. A **name**, a **description** and an **input schema**, which is a JSON Schema that says which inputs the tool takes. Here is one from our lab.'),
    C('javascript', `{
  name: 'get_job_keywords',
  description: 'Find the most frequent skills and keywords in a job description. Use this when the user pastes a job post and wants keywords for their resume.',
  input_schema: {
    type: 'object',
    properties: {
      job_text: { type: 'string', description: 'The full job description text' },
      max_keywords: { type: 'integer', description: 'How many keywords to return (default 8)' },
    },
    required: ['job_text'],
  },
}`),
    P('The **description** is the most important part. Claude uses it to decide when to use the tool. A vague description like "does job things" leads to wrong choices. A good description says what the tool does and when to use it. Also describe each input in plain words, as we did for job_text and max_keywords. Think of it as writing a short manual for a new colleague who cannot ask you questions.'),
    P('Good tool design is simple: one clear job per tool, a precise name like get_job_keywords instead of do_stuff, small clear inputs, and results that contain only what Claude needs.'),

    H('The loop in code'),
    P('Here is the heart of the lab\'s agent route. Read it slowly.'),
    C('javascript', `const messages = [{ role: 'user', content: message }];

for (let turn = 1; turn <= MAX_TURNS; turn++) {
  const reply = await client.messages.create({ model: MODEL, max_tokens: 800, tools, messages });
  messages.push({ role: 'assistant', content: reply.content });

  if (reply.stop_reason !== 'tool_use') return finalAnswer(reply);

  const results = [];
  for (const block of reply.content) {
    if (block.type !== 'tool_use') continue;
    const output = runTool(block.name, block.input);          // YOUR code runs here
    results.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(output) });
  }
  messages.push({ role: 'user', content: results });
}`),
    P('Four things deserve attention.'),
    L('We add **Claude\'s whole reply** (not only its text) to the history, because the tool_use blocks must be present when we send the results.', 'We send back **one tool_result for every tool_use**, and each carries the matching tool_use_id.', 'A reply may contain **several tool_use blocks** at once. Run them all and send all the results together in one user message.', 'We set **MAX_TURNS**. Without a limit, a confused model could loop for a long time and run up your bill. Five or six turns is plenty for simple tasks.'),

    H('When a tool fails'),
    P('Tools can fail: the input is wrong, a service is down, a record is missing. Do not crash. Catch the error and send it back as a tool result with is_error set to true and a short message. Claude can often recover: it may fix the input and try again, or explain the problem to the user in a friendly way. A crashed request helps nobody.'),

    H('Showing the trace in Angular'),
    P('Because you are the one running the tools, you can record each call. In our route we build a **trace**: a list with the tool name, the input, the output and whether it was an error. We return it with the final answer. The Angular page shows the answer and below it a numbered list of the tool calls. Seeing this trace is the best way to understand tool use, and it is also what you would show an administrator when debugging a real product. A user rarely needs to see it, but a developer always does.'),

    H('Tool results are data'),
    P('A small warning for later lessons: a tool result can contain text from the outside world, like a web page. Treat it as data, never as an instruction. We study this danger (prompt injection) in the next lesson.'),
    DOCS,

    H('Your task: build the Tools page'),
    P('Give Claude two small tools and show every call it makes in an Angular page.'),
    P('**What you will build**'),
    L('server/tools.js with two tool definitions (get_job_keywords and count_words) and a runTool() function.', 'A POST /api/agent route with the loop, a MAX_TURNS limit, error handling and a trace.', 'A Tools page with a text area prefilled with a job post, a Run button, the answer and the list of tool calls.'),
    P('**Steps**'),
    O('Start from your lesson 8 project, or download the lesson 8 solution.', 'Write the two tool definitions with clear descriptions. Write the handlers: for keywords, lower-case the text, split it into words, remove common small words, count and sort; for count_words, split on spaces.', 'Create the route with the loop. Push the assistant reply into messages. Run every tool_use. Send one tool_result per tool_use.', 'Wrap runTool in try/catch. On error, set is_error and send the message.', 'Keep the trace and return it together with the answer text.', 'In Angular, show the answer and the numbered trace with input and output for each call.', 'Ask a question that needs both tools. Then ask a question that needs none. Then see what happens when you set MAX_TURNS to 1.'),
    P('**Hints**'),
    L('Use JSON.stringify(output) for the content of the tool_result.', 'The assistant message must contain the full reply.content, not just the text.', 'To test the error path, make a tool throw an error on purpose and see how Claude explains it.'),
    P('**You know it works when** Claude answers with real keywords from the text, the trace shows each tool call in order, and a question that needs no tool gets an answer with an empty trace.'),

    H('Solution'),
    P('The tools:'),
    F(LAB, 'steps/09/server/tools.js'),
    P('The route with the loop:'),
    F(LAB, 'steps/09/server/routes/agent.js'),
    P('The Angular page:'),
    F(LAB, 'steps/09/src/app/pages/agent.ts'),
    P(`[Download the lesson 9 solution (zip)](${dl(LAB, 9)})`),

    H('What you learned'),
    L('Claude asks for tools; your code runs them. Claude never executes anything itself.', 'The loop: send tools, receive tool_use, run, send tool_result, repeat until a final answer.', 'Good descriptions and small clear inputs make tools work well.', 'Limit the turns, handle errors with is_error, and keep a trace for debugging.'),
    P('In lesson 10 we make tools safe: validation, ownership checks and human approval.'),
  ], [
    { q: 'Does Claude execute my function?', a: 'No. Claude returns the tool name and the input, and your code decides whether and how to run it.' },
    { q: 'Can Claude call several tools at once?', a: 'Yes. One reply can contain several tool_use blocks. Return one tool_result for each, matched by the tool_use_id.' },
    { q: 'Why set a maximum number of turns?', a: 'To stop a confused model from looping and spending a lot of tokens. A small limit also keeps your server responsive.' },
  ], 'claude tool use, function calling claude, tool_use tool_result, angular ai agent, anthropic tools node'),
];
