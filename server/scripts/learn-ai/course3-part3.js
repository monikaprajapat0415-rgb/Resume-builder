import { P, H, L, O, N, C, F, lesson } from './helpers.js';

const LAB = 'claude-api-tool-use';
const S2 = 'AI agents';
const S3 = 'Model Context Protocol (MCP)';

const BUILD = N("The solution zip contains the whole AI Lab up to this lesson. Unzip it, run npm install, copy .env.example to .env, add your Anthropic API key, then run npm run server and npm start in two terminals. Libraries, frameworks and protocols in this area change quickly, so check current documentation before you rely on them.");

export const lessons = [
  // ------------------------------------------------------------------ 17
  lesson(S2, 'ai-agents-explained', 'AI Agents Explained: Loops, Tools, Memory and Limits', 'Understand the difference between a workflow and an agent, build the agent loop with a step limit and a token budget, and give the agent memory that lasts between conversations.', '', [
    P("The word “agent” is used for almost everything in AI today, so it helps to start with a plain definition. An **AI agent** is a program where a language model decides what to do next, uses tools to do it, looks at the result, and repeats until the goal is reached. The key words are “decides” and “repeats”. A single question and answer is not an agent. A loop in which the model chooses the steps is."),
    P("In lesson 9 of the Claude API course you already built the core of this: Claude asked for a tool, your code ran it, and you sent back the result. In this lesson you turn that into a reusable, safe agent with limits and memory. You will also learn when you should not use an agent at all, which is just as important."),

    H("Workflow or agent?"),
    P("There are two ways to build a multi-step AI feature, and the difference matters for cost, speed and safety."),
    L("**A workflow** is a fixed path that you write. For example: step 1 extract the skills from the resume, step 2 extract the skills from the job post, step 3 compare, step 4 write advice. The model does the work inside each step, but your code decides the order. A workflow is predictable, cheap, and easy to test.", "**An agent** chooses its own path. You give it a goal and tools, and the model decides which tool to call, in what order, and when to stop. An agent is flexible, but it is harder to predict, can take many steps, and can go wrong in new ways."),
    P("Here is an everyday comparison. A workflow is a recipe: always the same steps, in the same order. An agent is a cook who looks in the fridge and decides what to make. The cook can handle surprises, but you cannot know the exact dinner in advance, and sometimes the cook wastes food."),
    P("The practical rule is: **use the simplest thing that works.** If you can write the steps down, write a workflow. Use an agent only when the number or order of steps depends on what is found along the way, for example when answering a question may need one search or five searches."),

    H("The agent loop"),
    P("Every agent, in every framework, is built on the same small loop:"),
    O("Send the goal, the tool descriptions and the conversation so far to the model.", "If the model answers with plain text, that is the final answer. Stop.", "If the model asks for tools, run them in your code and collect the results.", "Add the model's request and your results to the conversation.", "Go back to step 1."),
    P("That is all. Frameworks add features around this loop, but the loop is the engine. Look at how short the loop is in our lab. It is a function called `runAgent`, and we will reuse it in the next lesson:"),
    F(LAB, 'steps/17/server/agents.js'),

    H("Limits: the part that keeps you safe"),
    P("An agent without limits is like a taxi with the meter off and no destination. It might drive in circles while you pay. Our loop has three limits, and each one protects against a real failure."),
    L("**A step limit (`maxTurns`).** The model might keep calling tools forever, for example if a search keeps returning nothing useful. After six model calls we stop.", "**A token budget (`maxTokens`).** Each loop sends the whole conversation again, so the cost grows with every step. If the total tokens pass the budget, we stop and say so.", "**A reply limit (`maxReplyTokens`).** Each model call has a maximum length, so no single step can write a huge text."),
    P("When a limit is hit, the function returns a clear `stopReason`: done, max_turns or budget. The page shows it. A user who sees “stopped because: budget” understands what happened. A user who sees a spinner forever does not."),
    P("Also notice what happens when a tool fails. We do not crash the loop. We catch the error, put `{ error: ... }` into the result and mark it `is_error`. The model reads the error and can try something else. This makes agents more robust than plain code, because the model is a flexible error handler."),

    H("Tools: keep them small and clear"),
    P("The model chooses tools by reading their **descriptions**. A vague description gives wrong choices. Write each description like instructions for a new colleague: what the tool does, when to use it, and what it returns. Give each tool one clear job. In this lab the agent has two tools:"),
    L("`search_docs` searches our help-center documents with the hybrid search from lesson 16. It is read-only, so it is safe.", "`remember` saves one short fact about the user. It changes state, so we limit it: at most 20 facts, with a short length for each."),
    P("Whenever you add a tool that changes something (sends an email, writes a file, deletes a record), think about what the worst case is if the model calls it at the wrong time with the wrong input. Lesson 21 shows how to put a human in the loop for such tools."),

    H("Memory: two kinds"),
    P("A model has no memory between requests. Everything it “remembers” must be sent again. When people say an agent has memory, they usually mean one of two things:"),
    L("**Short-term memory** is the conversation so far. It lives inside the loop as the `messages` list. It disappears when the run ends, unless you save it.", "**Long-term memory** is information kept between runs: the user's job title, their city, their preferences. You store it outside the model (in a database, a file, or a vector store) and put the relevant part into the system prompt of the next run."),
    P("In our route, the `remember` tool writes facts to a Map per session, and the next run puts those facts into the system prompt under “Facts you already know about this user”. Try it: say “I am a delivery driver in Pune. Remember that.” Then start a new request and ask what to put on your resume. The agent knows your job without being told again."),
    P("Be careful with memory. Store only what is useful, let users see and delete it (our page has a Forget button), and never store secrets. Also remember that memory can be wrong or can be poisoned: if a malicious document tells the agent to “remember” something false, you have saved a lie. Treat saved facts as data with limits, and validate them."),

    H("Where agents fail"),
    L("**Loops.** The model repeats the same tool call. A step limit stops this.", "**Wrong tool or wrong input.** Better descriptions and strict input checks help.", "**Too many tools.** With twenty tools, the model gets confused. Start with a few.", "**Plan drift.** On long tasks the model forgets the original goal. Repeat the goal in the system prompt.", "**Cost surprises.** Every step repeats the history. Watch the usage numbers.", "**False confidence.** The final answer can sound sure even when a tool failed. Show the trace so a person can check."),
    BUILD,

    H("Your task: build an agent with limits and memory"),
    P("Build an agent that answers career questions using the document search, remembers facts about the user, and always stops safely."),
    P("**What you will build**"),
    L("server/agents.js with a reusable runAgent function that has a step limit, a token budget and a stop reason.", "server/routes/agent-loop.js with two tools, search_docs and remember, and per-session memory.", "An Angular page that shows the final answer, the stop reason, the token total, a trace of every tool call with its time, and the saved memory."),
    P("**Steps**"),
    O("Write runAgent. It takes a system prompt, a user goal, tools, handlers and limits. Loop up to maxTurns. After each model call add the usage to a total.", "In the loop, if the reply is not a tool request, return the text with stopReason done. Otherwise run each requested handler inside try/catch and send back every result, marking failures with is_error.", "After running tools, check the token total. If it is above the budget, return stopReason budget. If the loop ends by itself, return max_turns.", "Write the route. Keep a Map of memory by session id. Build the system prompt with the known facts. Add the two tools. Limit the memory to 20 facts.", "Write a DELETE route that clears a session's memory.", "Build the page. Create a random session id when the page loads. Show the trace and memory. Test with a goal that needs a search, a goal that needs no tool, and a goal that tells the agent a fact to remember."),
    P("**Hints**"),
    L("The tool_result for every tool_use must be sent back in the same user message, in the same order. Missing one causes an API error.", "Cut tool outputs to a safe size before sending them back.", "To test the limits, set maxTurns to 1 temporarily and check that the stop reason changes."),
    P("**You know it works when** the trace shows each tool call with its time, the memory shows the saved fact, a second run in the same session already knows the fact, a different session does not, and lowering the limits produces a clear stop reason."),

    H("Solution"),
    P("You have seen agents.js above. Here are the route and the Angular page."),
    F(LAB, 'steps/17/server/routes/agent-loop.js'),
    F(LAB, 'steps/17/src/app/pages/agent-loop.ts'),
    N("In production, the memory Map would be a database table keyed by the signed-in user, not a session id the browser makes up. The browser must never choose whose memory to read."),

    H("What you learned"),
    L("An agent is a model in a loop that chooses tools. A workflow is a fixed path. Prefer the simplest one that works.", "Every agent needs limits: steps, tokens and reply length, and a clear reason for stopping.", "Tool errors should go back to the model as results so that it can recover.", "Memory is short-term (the conversation) or long-term (saved outside the model). Store little, validate it, and let users delete it."),
    P("In the next lesson you will split work between several specialised agents and learn when that helps and when it only adds cost."),
  ], [
    { q: 'What is the difference between an AI agent and a chatbot?', a: 'A chatbot answers one message at a time. An agent works toward a goal by choosing tools, running them, reading the results and repeating until it is done.' },
    { q: 'When should I use a workflow instead of an agent?', a: 'Whenever you can write the steps down in advance. Workflows are cheaper, faster and easier to test. Use an agent when the steps depend on what is found along the way.' },
    { q: 'How do I stop an agent from running forever?', a: 'Set a maximum number of steps and a token budget, and return a clear stop reason when either is reached.' },
    { q: 'Does an AI agent have memory?', a: 'Not by itself. Short-term memory is the conversation you send each time. Long-term memory is information you save and add to later prompts.' },
  ], 'ai agents explained, ai agent loop, workflow vs agent, agent memory, build ai agent node.js'),

  // ------------------------------------------------------------------ 18
  lesson(S2, 'multi-agent-systems-and-frameworks', 'Multi-Agent Systems, Frameworks and the Claude Agent SDK', 'Learn when several specialised agents help, build a supervisor, researchers, writer and reviewer team with hand-offs and a revision limit, and see how frameworks fit around the same ideas.', '', [
    P("One agent with many tools can become confused, slow and hard to debug. A natural idea is to split the work like a small company: one person plans, others research, one writes, one checks. That idea is a **multi-agent system**. It can work very well, and it can also be an expensive way to make a simple problem complicated. In this lesson you will learn both sides, then build a small team in your AI Lab and see every hand-off."),

    H("What a multi-agent system really is"),
    P("Despite the grand name, a multi-agent system is usually just several separate model calls, each with its **own system prompt**, its **own tools** and its **own job**, connected by code. Agent A produces something, your code passes it to agent B, and so on. There is no magic. There is no hidden shared brain. Each agent only knows what you hand to it."),
    P("That last point is the real benefit. When you give one agent a smaller, focused job, you get:"),
    L("**Clearer prompts.** A prompt that says “you are a reviewer; check each claim against the notes” is much easier to get right than one prompt that says “research, write and check”.", "**Fewer tools per agent.** A researcher needs search. A writer needs none. Fewer tools mean fewer wrong choices.", "**Safer permissions.** The agent that reads untrusted web pages does not need the tool that sends email.", "**Easier testing.** You can test each agent alone with its own examples."),

    H("The costs nobody mentions in the demo"),
    L("**More calls, more tokens, more money.** A team of four agents can use five to ten times the tokens of one call.", "**More delay.** Steps that depend on each other run one after the other.", "**More ways to fail.** If the researcher gives bad notes, the writer builds on them with confidence. Errors travel down the line.", "**Harder debugging.** When the final answer is wrong, you must find which agent caused it."),
    P("So the advice is the same as in the last lesson: begin with a single model call, then a workflow, then one agent, and add more agents only when you can show that the simpler design is not good enough. A good reason to split is a clear need for different tools, different permissions, or a separate check."),

    H("Common patterns"),
    L("**Supervisor and workers.** A supervisor breaks the task into parts and sends each part to a worker. This is what we build.", "**Pipeline.** Agents run in a fixed order: draft, then edit, then format.", "**Writer and reviewer.** One agent produces, another checks against rules or sources and asks for fixes. This pattern catches many mistakes, as long as the reviewer sees the sources and not only the draft.", "**Parallel workers.** Several agents handle independent parts at the same time, then their results are merged. This saves time."),

    H("Our team in the lab"),
    P("The team in the lab handles a topic like “How to prepare a resume and an interview for a first job”. It has five stages:"),
    O("**Supervisor.** Breaks the topic into at most three short research questions. It returns them through a forced tool call, so the answer is structured data and not loose text.", "**Researchers.** One worker for each question, all running at the same time with `Promise.all`. Each worker may call `search_docs` and writes two to four bullet points with the source file named.", "**Writer.** Gets only the notes, not the documents. It writes a short guide using only the notes.", "**Reviewer.** Compares the draft with the notes and returns `approved` and a list of problems, again as structured data.", "**Revision, once.** If the reviewer finds problems, the writer revises one time. We never loop forever between agents."),
    P("Notice three design choices. The agents communicate through small, structured **hand-offs** (a list of questions, a text of notes, a verdict), not through the whole conversation. The structured outputs are checked with a schema (we use zod), and if a result is unusable the route returns a clear error instead of passing nonsense on. And the loop between writer and reviewer has a hard limit of one revision."),
    F(LAB, 'steps/18/server/routes/team.js'),
    P("The `structured` helper forces the model to call one tool, and reads the tool's input as the result. This is one of the most reliable ways to get JSON from a model. The tool's schema tells the model the shape, and zod checks it again on your side."),

    H("Frameworks and the Claude Agent SDK"),
    P("You do not have to write all of this yourself. There are frameworks that handle the loop, tools, hand-offs and state. Anthropic provides the **Claude Agent SDK**, which gives you the same agent loop and tools that power Claude Code, for building your own agents. Other popular options include LangGraph, the OpenAI Agents SDK and several others. Frameworks change fast, so check each project's current documentation, maintenance and licence before you choose."),
    P("How should you choose? Consider what the framework gives you: built-in tools like file access and shell, permission controls, session handling, and tracing. Consider what it costs you: a new vocabulary, more code that you do not control, and upgrades that may break things. A good test is to ask “could I explain what this framework does in a loop and a few functions?” After this lesson you can. That is why we built it by hand first. When you move to a framework, you will know what is happening underneath, and you will debug much faster."),
    BUILD,

    H("Your task: build the agent team"),
    P("Build the supervisor-and-workers team and make every hand-off visible in the page."),
    P("**What you will build**"),
    L("A route POST /api/team that takes a topic and returns the plan, research notes, draft, review, final text, whether it was revised, and the total token usage.", "A helper that forces a structured answer with a tool call, and zod schemas that check the plan and the review.", "An Angular page that shows the final guide first and then every stage: plan, notes, draft and review."),
    P("**Steps**"),
    O("Write the structured helper: one tool, tool_choice set to that tool, and return the tool_use input.", "Write the supervisor call and check the plan with a zod schema. If the plan is invalid, return a 502 with a friendly message.", "Run one researcher per question with Promise.all. Each researcher is a runAgent call with only the search tool and a maxTurns of 3.", "Write the writer as a function that takes optional extra instructions. Give it only the notes.", "Write the reviewer with a forced tool call and a zod check. If its answer is unusable, treat the draft as not approved.", "If the review is not approved, call the writer once more with the problems listed. Add up the tokens used by all agents. Build the page and test one run that is approved and one run where the reviewer asks for a revision."),
    P("**Hints**"),
    L("Give the writer only the notes. If it can see the documents, it may add facts that the reviewer cannot check.", "Add the token usage of every call to one total so you can see what a team costs.", "To test the revision path, make your fake or mock model reject the first draft once."),
    P("**You know it works when** one request shows five clear stages, the researchers run side by side, an unusable plan or review is handled without a crash, a rejected draft is revised exactly once, and the page shows the total tokens."),

    H("Solution"),
    P("You have read team.js above. This is the Angular page."),
    F(LAB, 'steps/18/src/app/pages/team.ts'),
    N("Compare the token total of the team with a single call that answers the same topic. Writing this number down is the best way to learn whether a team is worth its cost for your use case."),

    H("What you learned"),
    L("A multi-agent system is several focused model calls, each with its own prompt and tools, connected by your code.", "It can give clearer prompts, safer permissions and easier testing, at the price of more tokens, delay and failure points.", "Pass small, structured hand-offs and validate them. Put a hard limit on every loop between agents.", "Frameworks and the Claude Agent SDK wrap these ideas. Knowing the loop first makes any framework easier to judge."),
    P("In the next three lessons we look at a different problem: how an AI app talks to the outside world in a standard way, using the Model Context Protocol."),
  ], [
    { q: 'Are multi-agent systems better than a single agent?', a: 'Not automatically. They can give focused prompts and safer permissions, but they cost more and fail in more ways. Start simple and split only when you can show a need.' },
    { q: 'How do agents talk to each other?', a: 'Usually through your code. One agent produces an output, your code validates it, and passes it to the next agent as input. There is no hidden shared memory.' },
    { q: 'What is the Claude Agent SDK?', a: 'A toolkit from Anthropic that provides an agent loop, built-in tools and permission controls so you can build your own agents. Check the current documentation for details and supported languages.' },
    { q: 'How do I stop agents from arguing forever?', a: 'Give every loop a hard limit, for example one revision, and decide in advance what happens when the limit is reached.' },
  ], 'multi agent system, ai agent team, supervisor worker agents, claude agent sdk, langgraph vs agent sdk'),
];
