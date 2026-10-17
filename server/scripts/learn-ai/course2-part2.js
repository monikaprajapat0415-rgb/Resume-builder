import { P, H, L, O, N, C, F, dl, lesson } from './helpers.js';

const LAB = 'claude-api-tool-use';
const S2 = 'The Messages API';

const DOCS = N('Model names, features and prices change often. Check the current Anthropic documentation at docs.anthropic.com before you ship.');

export const lessons = [
  // ------------------------------------------------------------------ 4
  lesson(S2, 'claude-messages-api-explained', 'The Messages API Explained', 'Learn system prompts, user and assistant messages and multi-turn chat, then build a chat page with memory in Angular.', '15 min read', [
    P('Until now every request had one question and one answer. Real chat is different: the user asks, Claude answers, the user asks a follow-up, and Claude must understand the follow-up in light of what was said before. This lesson explains how that works in the Messages API and adds a **Chat page** with memory to your AI Lab.'),

    H('The most important fact: Claude has no memory'),
    P('Many beginners think Claude remembers earlier requests, the way a person remembers a phone call from yesterday. It does not. Every call to the API is a fresh start. Claude only knows what you put into that one request.'),
    P('Imagine a helper who forgets everything the moment you walk out of the room. To continue a conversation, you must walk in and say, "Here is everything we said so far, and here is my new question." That is exactly what you do in the Messages API. You keep the conversation on your side, and you send the whole conversation again each time. This is the single most important idea in this lesson.'),

    H('The parts of a request'),
    P('A request to the Messages API has a few key fields. You already met some of them.'),
    L('**model**: which Claude model answers.', '**max_tokens**: the longest answer you accept. It is required.', '**system**: instructions that apply to the whole conversation. This is where you describe who Claude should be and what rules it must follow.', '**messages**: the list of messages so far, in order.'),
    P('Here is a complete request with a system prompt:'),
    C('javascript', `const reply = await client.messages.create({
  model: MODEL,
  max_tokens: 600,
  system: 'You are a careful career coach. Keep answers short and never invent facts about the user.',
  messages: [
    { role: 'user', content: 'I drove a forklift for 4 years. How do I write that on my CV?' },
  ],
});`),

    H('The system prompt'),
    P('The **system prompt** is like the instructions you give a new employee on the first day: "You work at a resume service. Be polite. Never promise a job. Keep answers under 100 words." The user does not type it and does not usually see it. Claude follows it for the whole conversation. Put stable things here: the role, the tone, the rules, the format of answers. Keep the changing things, like the user\'s question and their resume text, in the messages.'),
    P('One detail beginners miss: in this API the system prompt is its own field called **system**. It is not a message inside the messages list.'),

    H('User and assistant messages'),
    P('Inside the messages list, each message has a **role**. There are two roles you use.'),
    L('**user**: what the person said.', '**assistant**: what Claude said earlier.'),
    P('The roles should alternate: user, assistant, user, assistant, and so on. The first message must come from the user, and the last message should be from the user too, because it is the question Claude must answer now. When Claude answers, you take its text and add it to the list as an assistant message. Then the next user message is added after it. That is how the history grows.'),
    C('javascript', `// after Claude answered:
history.push({ role: 'assistant', content: reply.text });
// the user asks a follow-up:
history.push({ role: 'user', content: 'Make it shorter.' });
// send the WHOLE history again:
await client.messages.create({ model: MODEL, max_tokens: 600, system, messages: history });`),
    P('When Claude sees "Make it shorter", it understands what "it" means because the earlier answer is in the history.'),

    H('History grows, so cost grows'),
    P('Because you send the whole conversation every time, each new turn is a bit more expensive than the last. After thirty turns, you may be sending a very long history for a one-line question. There is also a limit to how much text Claude can handle in one request, called the **context window**. Good products manage the history. The common methods are to keep only the last N messages, to summarise old messages into one short note, and to remove messages that are no longer useful. In the AI Lab we use the simplest method: the user chooses how many recent messages to send.'),

    H('Clean the history on the server'),
    P('The history comes from the browser, and anything from the browser can be wrong or evil. A user could send a message with a made-up role, a giant text, or a thousand messages. So the server cleans it before use. Our helper cleanMessages() keeps only user and assistant roles, accepts only text, cuts each message to 4,000 characters, keeps the last 20 messages, and removes any assistant messages at the start so the list begins with a user message. It is a small function that prevents many problems.'),

    H('Reading the answer properly'),
    P('Besides the text, the reply has two useful fields. **usage** gives the token counts. **stop_reason** tells you why Claude stopped writing. The normal value means Claude finished its thought. A different value means it hit your max_tokens limit, so the answer was cut off. You should check this. If the answer was cut off, show a note such as "The reply was cut off. Ask Claude to continue." A cut-off answer that looks complete is a bad surprise for users.'),

    H('Parameters that change the style'),
    P('You can also pass settings such as temperature, which controls how random the answer is. Low values give steadier, more repeatable answers, which is good for extraction and classification. Higher values give more variety, which is nice for brainstorming. Not every model supports every setting, so check the documentation for the model you use. A different tool is **stop sequences**: pieces of text that, when Claude writes them, end the answer. They are useful in special formats.'),
    DOCS,

    H('Your task: build the Chat page'),
    P('Create a chat page that remembers the conversation, lets the user edit the system prompt, and lets the user choose how many recent messages to send.'),
    P('**What you will build**'),
    L('server/messages.js with cleanMessages() and lastIsUser().', 'A POST /api/chat route that accepts a system prompt and a messages list and returns the answer, usage and stop reason.', 'A Chat page with a system prompt box, a "messages to send" selector, the conversation, a message box, and a Clear button.'),
    P('**Steps**'),
    O('Start from your lesson 3 project, or download the lesson 3 solution.', 'Write cleanMessages(): filter roles, check text, cut length, keep the last 20, and make the first message a user message.', 'Create server/routes/chat.js. Return 400 if the last message is not from the user. Add the system field only when the prompt is not empty.', 'In Angular, keep the history in a signal. When the user sends a message, add it to the history, send the last N messages, and then add Claude\'s answer to the history.', 'Show a warning when stopReason is "max_tokens".', 'Test it: tell Claude your name in message one, and ask "What is my name?" in message two. Then set the selector to send fewer messages and see what happens when the name falls outside the window.'),
    P('**Hints**'),
    L('Use history.update(h => [...h, newMessage]) so the signal changes.', 'The last test is a great way to feel how context works. When the message with your name is no longer sent, Claude cannot know it.', 'Never put the system prompt inside the messages list.'),
    P('**You know it works when** follow-up questions make sense, the Clear button starts a fresh chat, and changing the system prompt visibly changes the tone of Claude\'s answers.'),

    H('Solution'),
    P('The message-cleaning helper:'),
    F(LAB, 'steps/04/server/messages.js'),
    P('The chat route:'),
    F(LAB, 'steps/04/server/routes/chat.js'),
    P('The Angular page:'),
    F(LAB, 'steps/04/src/app/pages/chat.ts'),
    P(`[Download the lesson 4 solution (zip)](${dl(LAB, 4)})`),

    H('What you learned'),
    L('Claude has no memory. You send the whole conversation each time.', 'The system prompt holds the rules; messages hold the conversation. Roles are user and assistant.', 'Long histories cost more, so trim or summarise them.', 'Always clean the history on the server and check stop_reason.'),
    P('In lesson 5 we make the chat feel fast by streaming the answer word by word.'),
  ], [
    { q: 'Does Claude remember my previous API calls?', a: 'No. Each call is independent. You must send the conversation history with every request.' },
    { q: 'Where do I put my instructions, in the system prompt or in a user message?', a: 'Put stable rules, role and tone in the system prompt. Put the changing request and the data in the user message.' },
    { q: 'Why check stop_reason?', a: 'It tells you whether Claude finished or was cut off by your max_tokens limit. A cut-off answer can look complete but be missing the end.' },
  ], 'claude messages api, system prompt claude, multi turn chat api, angular chat claude, claude conversation history'),

  // ------------------------------------------------------------------ 5
  lesson(S2, 'stream-claude-responses', 'Streaming Claude Responses to the Browser', 'Show Claude\'s answer word by word using streaming, with Server-Sent Events in Node and a fetch reader in Angular, including a Stop button.', '16 min read', [
    P('Have you used a chat assistant where the words appear one after another while it is still writing? That is **streaming**. In this lesson you will add it to your AI Lab. It makes your app feel fast, even when the full answer takes ten seconds to write.'),

    H('Why streaming matters'),
    P('Without streaming, the user presses the button and stares at a spinner until the whole answer is ready. For a long answer this can feel like a broken app. With streaming, the first words appear in a second or two and the user starts reading right away. The total time is the same, but the waiting feels much shorter. Think of the difference between waiting for a full meal to be cooked before you get anything, and getting the first dish as soon as it is ready.'),
    P('Streaming does not make the answer cheaper or smarter. The token cost is exactly the same. It only improves the experience.'),

    H('Streaming with the SDK'),
    P('The SDK makes streaming easy. Instead of messages.create, you call messages.stream. You can then listen for the "text" event, which fires every time a new piece of text arrives, and wait for the final complete message.'),
    C('javascript', `const stream = client.messages.stream({
  model: MODEL,
  max_tokens: 600,
  messages: [{ role: 'user', content: 'Write a short summary for a welder.' }],
});

stream.on('text', (piece) => process.stdout.write(piece));
const final = await stream.finalMessage();   // resolves when the answer is complete
console.log(final.usage);`),
    P('Under the hood, the API sends many small events (the start of the message, pieces of text, the end with the final token counts). The SDK reads them for you and gives you friendly events.'),

    H('Passing the stream to the browser: Server-Sent Events'),
    P('Your server has the stream, but the browser is waiting for it. How do you pass the pieces along? The simple, popular way is **Server-Sent Events**, or SSE. It is a one-way stream from server to browser over a normal HTTP connection. The server sets a special content type, "text/event-stream", and then writes small messages in a simple format:'),
    C('text', `event: text
data: "Hello"

event: text
data: " world"

event: done
data: {"usage":{...}}
`),
    P('Each message has an event name and some data, and a blank line ends it. Our server sends three kinds: **text** (a piece of the answer), **done** (the answer is finished, with the usage) and **error** (something went wrong).'),
    P('A few details make streaming work properly on a real server.'),
    L('Send the header **X-Accel-Buffering: no**. Some web servers, such as nginx, hold back the response to send it in big chunks. This header tells nginx not to, so the words arrive immediately.', 'Call res.flushHeaders() so the browser knows the stream has started.', 'Listen for the response closing. If the user closes the page or presses Stop, call stream.abort(). This stops the request to Claude, and you stop paying for words nobody will read.', 'Handle errors that happen in the middle. You have already sent a 200 status, so you cannot change it. Send an "error" event instead.'),
    N('A common mistake is to listen to the request\'s close event to detect that the user left. In modern Node the request can report "close" as soon as its body has been read, which would cancel every stream immediately. Listen to the response\'s close event instead, and check that the response has not already ended.'),

    H('Reading the stream in Angular'),
    P('The built-in HttpClient is not the best tool for streaming. For this job we use the browser\'s **fetch** function, which gives us a body we can read piece by piece. The idea has four steps.'),
    O('Send the request with fetch and an AbortController, so we can cancel it.', 'Get a reader from response.body.getReader().', 'Loop: read a chunk of bytes, turn it into text with a TextDecoder, and add it to a buffer.', 'Split the buffer on blank lines. Each complete part is one event. Keep the incomplete rest in the buffer for the next round.'),
    P('The last step is the tricky one. A chunk of data can end in the middle of an event, so you must never assume that one chunk equals one event. That is why we keep a buffer and only process complete events.'),
    P('For each event, we look at its name. A text event adds the piece to the output signal, and because the signal changes, Angular redraws the text each time. A done event shows the final usage. An error event shows a message.'),

    H('The Stop button'),
    P('A good streaming screen lets the user stop. In Angular we keep the AbortController, and the Stop button calls controller.abort(). The fetch is cancelled, the browser closes the connection, and our server notices the closed response and aborts the call to Claude. Users like this control, and it saves tokens. Remember to treat the resulting AbortError as normal, not as an error to show.'),

    H('Streaming and structured results'),
    P('Streaming is perfect for text that a person reads. It is not a good fit when your code needs a complete JSON result, because you cannot use half of a JSON object. In that case, either do not stream, or stream to the screen and validate the final complete answer when the stream ends.'),
    DOCS,

    H('Your task: build the Stream page'),
    P('Build a page where the answer appears word by word, with Start and Stop buttons.'),
    P('**What you will build**'),
    L('A POST /api/chat/stream route that sends Server-Sent Events: text, done and error.', 'A Stream page in Angular that reads the stream with fetch and shows the text as it grows.', 'A Stop button that cancels both the browser request and the call to Claude.'),
    P('**Steps**'),
    O('Start from your lesson 4 project, or download the lesson 4 solution.', 'Create server/routes/stream.js. Reuse cleanMessages(). Set the SSE headers and call flushHeaders().', 'Create the stream with client.messages.stream, forward each "text" event, and send "done" with usage at the end.', 'Add res.on("close") to abort the stream if the response is closed before it finished.', 'In Angular, build the page with signals for output, running, error and info. Write the reading loop with a buffer.', 'Test it: press Start and watch the words arrive. Press Start again and press Stop in the middle. Check the server log or the usage in your console to confirm that the request stopped.'),
    P('**Hints**'),
    L('Split the buffer with buffer.split("\\n\\n") and keep the last piece.', 'Parse an event with two small regular expressions: one for the line that starts with "event: " and one for "data: ".', 'The data is JSON, so use JSON.parse. Text pieces are JSON strings, so spaces at the start of a piece are kept.'),
    P('**You know it works when** words appear gradually, Stop ends the answer at once, and an error in the middle shows a message instead of breaking the page.'),

    H('Solution'),
    P('The server route:'),
    F(LAB, 'steps/05/server/routes/stream.js'),
    P('The Angular page:'),
    F(LAB, 'steps/05/src/app/pages/stream.ts'),
    P(`[Download the lesson 5 solution (zip)](${dl(LAB, 5)})`),
    N('If you put the server behind nginx, streaming only works smoothly when the proxy does not buffer. The X-Accel-Buffering header handles that for nginx. If your words still arrive all at once, check for compression or buffering in your proxy.'),

    H('What you learned'),
    L('Streaming shows words as they are written. It improves the feeling of speed, not the cost.', 'Server-Sent Events send text, done and error messages from server to browser.', 'In Angular, read the stream with fetch, keep a buffer, and split on blank lines.', 'Always let the user stop, and abort the Claude request when the response closes.'),
    P('Lesson 6 makes your app reliable when things go wrong: errors, retries and timeouts.'),
  ], [
    { q: 'Does streaming make the answer cheaper?', a: 'No. The token cost is the same. Streaming only improves how fast the first words appear.' },
    { q: 'Why does my streamed answer arrive all at once?', a: 'A proxy or compression layer is probably buffering it. Turn off buffering for that route, for example with the X-Accel-Buffering header for nginx.' },
    { q: 'Can I use Angular HttpClient for streaming?', a: 'It is possible with special options, but the browser fetch function with a stream reader is simpler and gives you direct control, including cancelling.' },
  ], 'claude streaming, server sent events express, angular fetch stream, stream llm response, abort controller'),

  // ------------------------------------------------------------------ 6
  lesson(S2, 'claude-error-handling-retries', 'Error Handling, Retries and Timeouts', 'Make your Claude integration reliable: understand API errors, retry with exponential backoff, set timeouts and show friendly messages in Angular.', '15 min read', [
    P('A demo works when everything goes right. A real product must also work when things go wrong, and in the real world they do go wrong: the network drops for a second, the service is busy, you hit a rate limit. In this lesson you learn to handle these problems calmly, so that a short problem does not become an angry user.'),

    H('Why AI features fail'),
    P('Calls to an AI service are slower and heavier than normal database calls, so more can go wrong. These are the usual problems.'),
    L('**Your request is wrong.** A parameter is invalid, the text is too long, or the history is not valid. The API replies with a 400-level error.', '**Your key is wrong.** A missing or invalid key gives 401, and a missing permission gives 403.', '**You are going too fast.** You exceeded a rate limit. The error status is 429.', '**The service has a temporary problem.** A 500-level error, or an "overloaded" message, means the problem is on the provider\'s side and will probably pass.', '**The network has a problem.** The connection drops or times out.'),

    H('The golden rule: retry only what can heal'),
    P('Not all errors deserve a retry. Ask yourself: if I send exactly the same request again, could it succeed? If your request is invalid, the answer is no. It will fail again, and again, and waste time. If the service was just busy, the answer is yes. So:'),
    L('**Do retry:** 429, 500-level errors, connection problems, timeouts.', '**Do not retry:** 400 (fix the request), 401 and 403 (fix the key or permission).'),
    P('This small decision is one function in our lab, isRetryable().'),

    H('Exponential backoff with jitter'),
    P('When you do retry, do not retry instantly. If thousands of users all retry at the same moment, they overload the service again, and nothing improves. The standard solution is **exponential backoff**: wait a short time before the first retry, then twice as long before the second, then twice as long again. For example, wait 0.5 seconds, then 1 second, then 2 seconds.'),
    P('Add **jitter**, a small random extra delay. Without it, all your clients that failed together would retry together in a neat wave. With a little randomness, the retries spread out. The formula is easy: wait = base × 2 to the power of (attempt − 1), plus a random amount.'),
    P('Also set a **maximum number of tries**, such as three. Retrying forever just hides a real outage.'),

    H('The SDK already retries'),
    P('The official SDK retries a few kinds of errors by itself a couple of times, using a similar backoff. That is helpful in production. In this lesson we turn that off for one client (maxRetries: 0) so that you can see and control your own retry logic and learn how it works. In your real product you can choose either. Using the built-in retries is simpler, and writing your own gives you more control, for example to log each attempt.'),

    H('Timeouts and cancellation'),
    P('A request that never finishes is also a failure. Always set a **timeout**, a maximum time you are willing to wait. After that time, you stop waiting and handle it as an error. In the lab we give the client a 20-second timeout. On the user\'s side, give them a **Cancel** button. In Angular, if you subscribe to an HttpClient call, calling unsubscribe() on the subscription tells the browser to drop the request.'),

    H('Friendly messages, safe details'),
    P('When a request finally fails, the user needs a short, calm message and a clear next step, for example: "The AI service is busy right now. You can try again." Do not show raw error text. It can reveal internal details, and it means nothing to normal people. Write the full details to your server log, including the status code and a request id, so that you can investigate later. Tell the browser whether the error is **retryable**, so the page can show a "Try again" button only when it makes sense.'),

    H('Graceful degradation'),
    P('For important features, plan what happens when the AI is not available. Can the user continue without it? A resume builder should still let people edit and download their resume if the AI suggestion button fails. Some teams add a **circuit breaker**: after several failures in a row, stop calling the service for a short time instead of piling more requests on it. Others keep a second model or provider as a backup. You do not need all of these on day one, but you should decide on purpose, not by accident.'),

    H('Testing errors without waiting for a real outage'),
    P('You cannot wait for a real failure to test your error screen. In the lab, the route accepts a "simulate" setting with three fake modes. In **flaky** mode, the first two attempts fail with a 429 and the third succeeds, so you can watch the retry work. In **down** mode, every attempt fails with a 503, so you see the final error. In **bad** mode, the request fails with a 400, which is never retried. Adding such test switches to a development tool is a great habit, as long as you do not leave them active for real users in production.'),
    DOCS,

    H('Your task: build the Reliable page'),
    P('Add a retry helper on the server and a page that shows retries, errors, a "Try again" button and a Cancel button.'),
    P('**What you will build**'),
    L('server/retry.js with isRetryable() and withRetry().', 'A POST /api/reliable-ask route that uses a client with maxRetries 0 and a 20-second timeout, supports the three fake modes, and returns the number of attempts.', 'A Reliable page that shows the answer or the error, the number of attempts, a Try again button only for retryable errors, and a Cancel button.'),
    P('**Steps**'),
    O('Start from your lesson 5 project, or download the lesson 5 solution.', 'Write isRetryable() (429, 500 and above, connection errors) and withRetry() with three tries, doubling waits and jitter. Return both the value and the number of attempts.', 'Create the route. Inside the function you pass to withRetry, throw fake errors in the three modes, otherwise call Claude.', 'In the catch block, log the details, then reply with a friendly message, the retryable flag and the attempts.', 'In Angular, use this.http.post(...).subscribe(...) and keep the subscription so Cancel can unsubscribe.', 'Test all three modes, and test Cancel while a request is running.'),
    P('**Hints**'),
    L('Remember to wait only between attempts, not after the last one.', 'Store the number of attempts on the error object so the route can report it.', 'Choose the HTTP status of your reply from the error, for example 503 for a service problem, and 400 for a bad request.'),
    P('**You know it works when** flaky mode succeeds after 3 attempts, down mode shows a friendly error with a Try again button, bad mode shows an error without that button, and Cancel stops a running request.'),

    H('Solution'),
    P('The retry helper:'),
    F(LAB, 'steps/06/server/retry.js'),
    P('The route:'),
    F(LAB, 'steps/06/server/routes/reliable.js'),
    P('The Angular page:'),
    F(LAB, 'steps/06/src/app/pages/reliable.ts'),
    P(`[Download the lesson 6 solution (zip)](${dl(LAB, 6)})`),

    H('What you learned'),
    L('Retry only errors that can heal: 429, server errors and connection problems.', 'Use exponential backoff with jitter, and a maximum number of tries.', 'Set timeouts, allow cancelling, and show friendly messages while logging the details.', 'Test failures on purpose with fake error modes.'),
    P('In lesson 7 we look at a way to make repeated requests cheaper and faster: prompt caching.'),
  ], [
    { q: 'Should I retry a 400 error?', a: 'No. A 400 means the request itself is wrong, so fix the request instead of retrying.' },
    { q: 'What is exponential backoff?', a: 'Waiting longer after each failed attempt, for example 0.5 seconds, then 1, then 2, usually with a little randomness, so you do not overload the service again.' },
    { q: 'Should I write my own retries or use the SDK ones?', a: 'The SDK retries some errors for you and is a good default. Write your own when you need extra control, such as logging every attempt or custom rules.' },
  ], 'claude api errors, retry exponential backoff, rate limit 429 handling, angular error handling http, llm reliability'),
];
