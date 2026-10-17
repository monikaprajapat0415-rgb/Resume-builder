import { P, H, L, O, N, C, lesson } from './helpers.js';

export const course = {
  title: 'RAG, AI Agents & MCP',
  slug: 'rag-ai-agents-mcp',
  summary: 'Go from prompts to real AI products: retrieval-augmented generation, vector search, agents, the Model Context Protocol, evaluation and safety.',
  description: 'An advanced AI course: RAG with embeddings and vector databases, AI agents, the Model Context Protocol (MCP), evaluation and safe production use.',
  level: 'Advanced',
  topic: 'AI',
  badge: 'RAG',
  tags: ['rag', 'ai agents', 'mcp', 'vector database', 'llm evaluation'],
  order: 22,
  published: true,
  metaTitle: 'RAG, AI Agents & MCP: Free Advanced AI Course',
  keywords: 'rag tutorial, ai agents course, model context protocol, vector database, llm evaluation',
};

const S1 = 'Retrieval-Augmented Generation (RAG)';
const S2 = 'AI agents';
const S3 = 'Model Context Protocol (MCP)';
const S4 = 'Evaluation, safety and production';

const CHECK = N('Libraries and services in this area change quickly. Check current documentation, licences and maintenance status before choosing one.');

export const lessons = [
  lesson(S1, 'what-is-rag', 'What Is RAG (Retrieval-Augmented Generation)?', 'Why models need your data, how RAG works end to end, and when to use it instead of fine-tuning.', '7 min read', [
    P('A language model only knows what it saw in training. It does not know your company policies, yesterday\'s news or a user\'s uploaded files. **Retrieval-Augmented Generation (RAG)** fixes that: before asking the model, you **retrieve** the relevant pieces of your own data and put them in the prompt.'),
    H('The RAG pipeline'),
    O('**Ingest**: load documents (PDF, DOCX, HTML, text) and clean them.', '**Chunk**: split them into pieces of a useful size.', '**Embed**: turn each chunk into a vector.', '**Store**: save vectors and metadata in a vector database.', '**Retrieve**: embed the question and find the closest chunks.', '**Generate**: give the question and those chunks to the model and ask it to answer using only them.'),
    H('RAG versus fine-tuning'),
    L('**RAG** adds knowledge at question time. Easy to update, can show sources, good for facts that change.', '**Fine-tuning** changes the model\'s behaviour or style using examples. Not a good way to teach it a body of facts.', 'Many products use RAG first and consider fine-tuning only if prompts and retrieval are not enough.'),
    H('Why it helps'),
    L('Fewer hallucinations, because the answer is grounded in supplied text.', 'Answers can cite their sources.', 'Private data stays in your control.', 'You update knowledge by updating documents, not retraining.'),
    H('Where it can go wrong'),
    L('The right passage was not retrieved, so the model has nothing to ground on.', 'Chunks cut an idea in half.', 'The model ignores the passages or mixes in its own memory.'),
    P('The next lessons deal with each of these. For a resume product, RAG could retrieve guidance and examples for a job family before the model rewrites a section.'),
  ], [
    { q: 'Is RAG better than fine-tuning?', a: 'They solve different problems. RAG is better for giving a model facts and sources. Fine-tuning is better for consistent style or format.' },
    { q: 'Does RAG remove hallucinations?', a: 'It reduces them but does not remove them. You still need to tell the model to answer only from the sources and to say when they do not contain the answer.' },
  ], 'what is rag, retrieval augmented generation, rag vs fine-tuning, rag architecture'),

  lesson(S1, 'chunking-embeddings-vector-search', 'Chunking, Embeddings and Vector Search', 'Split documents well, create embeddings, and retrieve by meaning using cosine similarity.', '8 min read', [
    P('Retrieval quality decides RAG quality. Three choices matter most: how you chunk, which embedding model you use and how you search.'),
    H('Parsing and cleaning'),
    P('Garbage in, garbage out. Extract text properly from PDFs and DOCX files, remove headers, footers and page numbers, and keep headings, because they carry meaning. Tables and scanned pages need extra care.'),
    H('Chunking'),
    L('**Chunk size**: too small loses context, too big dilutes the match and wastes tokens. A few hundred words is a common starting point, then tune it on your own questions.', '**Overlap**: repeat a little text between neighbouring chunks so ideas are not cut in half.', 'Split on natural boundaries, such as headings and paragraphs, when you can.', 'Store **metadata**: source, title, section, date, language, access rights.'),
    H('Embeddings'),
    P('An embedding model turns text into a vector. Texts with similar meaning land near each other. Use the same embedding model for documents and questions, and remember that changing the model means re-embedding everything.'),
    H('Similarity search'),
    P('To retrieve, embed the question and find the closest chunk vectors, usually by **cosine similarity**. Return the **top-k** chunks (for example the 3 to 8 best).'),
    C('javascript', `function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] ** 2; nb += b[i] ** 2; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

const ranked = chunks
  .map((c) => ({ ...c, score: cosine(queryVector, c.vector) }))
  .sort((x, y) => y.score - x.score)
  .slice(0, 5);`),
    P('A plain loop like this is fine for a few thousand chunks. For more, use a vector database with an index.'),
    H('Build the prompt'),
    C('text', `Answer the question using only the sources below. If the sources do not contain the answer, say so.
Cite the source number like [1].

<sources>
[1] {{chunk 1}}
[2] {{chunk 2}}
</sources>

Question: {{question}}`),
    CHECK,
  ], [
    { q: 'How big should a chunk be?', a: 'There is no single best size. Start with a few hundred words with some overlap, then measure retrieval on your own questions and adjust.' },
    { q: 'Can I use a different embedding model for the question and the documents?', a: 'No. Use the same model for both, or the vectors will not be comparable.' },
  ], 'rag chunking, embeddings, cosine similarity search, top-k retrieval, rag prompt'),

  lesson(S1, 'vector-databases-explained', 'Vector Databases: pgvector, Pinecone, Qdrant, Chroma', 'What a vector database does, the main options, and how to choose one for your stack.', '7 min read', [
    P('A **vector database** stores vectors and finds the nearest ones quickly, using an **index** instead of comparing against everything.'),
    H('What to look for'),
    L('Search speed and accuracy at your data size.', 'Metadata filtering (for example only this user\'s documents, or only English).', 'Updates and deletes without rebuilding everything.', 'Security and access control, especially for private data.', 'Cost and how much you must operate yourself.'),
    H('Common options'),
    L('**PostgreSQL with pgvector**: adds vector search to a database you may already run. Good when you want one system.', '**MongoDB vector search**: available on MongoDB Atlas, handy if your data is already in Mongo. Check support if you use another Mongo-compatible server.', '**Pinecone**: a managed service, little to operate.', '**Qdrant** and **Weaviate**: open-source engines that you can self-host or use as a service.', '**Chroma**: simple and popular for prototypes and local work.'),
    H('Distance metrics'),
    P('Cosine similarity, dot product and Euclidean distance are the common choices. Use the one your embedding model recommends.'),
    H('Security and privacy'),
    L('Filter by user or tenant on every query, so people only retrieve their own documents.', 'Encrypt data and restrict access to the database.', 'Support deletion: if a user deletes a document, delete its vectors too.'),
    H('Start simple'),
    P('For a small project, store vectors beside your existing records and compute similarity in code, or use the vector features of the database you already have. Move to a dedicated engine when scale or speed demands it.'),
    CHECK,
  ], [
    { q: 'Do I need a separate vector database?', a: 'Not always. If your current database supports vector search and your data is modest, start there. Add a dedicated one when you need more scale or features.' },
    { q: 'How do I keep one user\'s data from appearing for another?', a: 'Store a user or tenant id with every chunk and filter on it in every query. Test it with accounts that should not see each other\'s data.' },
  ], 'vector database comparison, pgvector, pinecone vs qdrant, mongodb vector search, chroma'),

  lesson(S1, 'advanced-rag-and-evaluation', 'Advanced RAG: Hybrid Search, Reranking and Citations', 'Improve retrieval with keyword plus semantic search, reranking, query rewriting and source attribution.', '8 min read', [
    P('Basic RAG works for demos. Real data needs more.'),
    H('Hybrid search'),
    P('Semantic search finds meaning but can miss exact terms such as product codes or names. Keyword search (BM25) finds exact words but misses paraphrases. **Hybrid search** runs both and merges the results.'),
    H('Reranking'),
    P('First retrieve a generous set (say 20 chunks), then use a **reranking** model to score each against the question and keep the best few. It is slower but often noticeably more accurate.'),
    H('Query rewriting and expansion'),
    L('Rewrite a follow-up like "and for the UK?" into a complete question using the chat history.', 'Generate several versions of the question and combine the results (multi-query).', 'Ask the model to extract filters, such as country or date, from the question.'),
    H('Better chunk structure'),
    L('**Parent-child retrieval**: search small chunks, but give the model the larger parent section.', '**Contextual retrieval**: add a short description of where a chunk comes from before embedding it.', '**Metadata filters** narrow the search before ranking.'),
    H('Citations'),
    P('Number the retrieved chunks, ask the model to cite them, then check in code that every cited number exists. Show the source to the user so they can verify.'),
    H('Measure retrieval'),
    L('Build a test set of questions with the passage that should answer each.', '**Recall@k**: how often the right chunk is in the top k.', '**Precision**: how many retrieved chunks were actually useful.', 'Also test **faithfulness**: is the answer supported by the retrieved text?'),
    P('Change one thing at a time (chunk size, k, reranker) and keep what the numbers prove.'),
  ], [
    { q: 'When do I need a reranker?', a: 'When the right chunk is usually in your top 20 but not in your top 3. A reranker reorders results more precisely.' },
    { q: 'How do I know my RAG is working?', a: 'Test it with real questions and expected sources. Measure retrieval recall and whether answers stay faithful to the retrieved text.' },
  ], 'advanced rag, hybrid search bm25, reranking, rag citations, rag evaluation'),

  lesson(S2, 'ai-agents-explained', 'AI Agents Explained', 'The difference between workflows and agents, the agent loop, memory, planning and typical failure modes.', '8 min read', [
    P('An **AI agent** is a system where a model decides what to do next, uses tools, looks at the result and continues until the task is done. A **workflow** follows steps you wrote in advance, with the model filling in parts. Many useful products are workflows, and that is a good thing: they are cheaper, faster and more predictable.'),
    H('The agent loop'),
    O('The model gets a goal and the available tools.', 'It decides on an action (call a tool or answer).', 'Your code runs the action and returns the observation.', 'The model plans the next step.', 'It stops when the goal is met, or when a limit is hit.'),
    P('This is the same tool-use loop from the Claude API course, run for as many turns as the task needs.'),
    H('Memory'),
    L('**Short-term memory**: the conversation and recent tool results in the context.', '**Long-term memory**: facts stored outside the model (a database or vector store) and retrieved when needed.'),
    H('Planning and decomposition'),
    P('Complex tasks work better when broken into sub-tasks. The agent can write a plan, execute steps and revise it as results arrive.'),
    H('When to use an agent'),
    L('Use a plain prompt when one call is enough.', 'Use a workflow when the steps are known.', 'Use an agent when the steps depend on what is found along the way, such as research or debugging.'),
    H('Failure modes'),
    L('Looping or wandering: always set a maximum number of steps and a cost budget.', 'Wrong tool or wrong arguments: validate and give clear errors.', 'Compounding errors: a small mistake early spoils later steps.', 'Overreach: acting beyond what the user wanted. Use approvals for sensitive actions.'),
    H('Human in the loop'),
    P('For anything with real-world effects, let a person review the plan or approve key actions.'),
  ], [
    { q: 'Do I need an agent framework?', a: 'Not to start. A simple loop around the model API is enough for many cases. Consider frameworks when you need checkpoints, graphs or multi-agent features.' },
    { q: 'Are agents always better than workflows?', a: 'No. Workflows are simpler and more reliable when the steps are known. Use agents only when the path cannot be planned in advance.' },
  ], 'ai agents explained, agent loop, workflow vs agent, agent memory, ai agent failure modes'),

  lesson(S2, 'multi-agent-systems-and-frameworks', 'Multi-Agent Systems, Frameworks and the Claude Agent SDK', 'Supervisor and worker patterns, handoffs, checkpoints, tracing, and how to choose between frameworks and custom code.', '7 min read', [
    P('A **multi-agent system** uses several model-driven components with different jobs, for example a planner, a researcher and a writer.'),
    H('Common patterns'),
    L('**Supervisor and workers**: one agent splits the task and hands pieces to specialists, then combines the results.', '**Handoffs**: an agent passes the conversation to another that is better suited.', '**Parallel agents**: independent sub-tasks run at the same time to save time.', '**Reviewer**: a second agent checks the first one\'s work.'),
    P('More agents mean more cost, more latency and more ways to fail, so add them only when one agent clearly cannot do the job.'),
    H('Reliability tools'),
    L('**Checkpointing** saves state so a long task can resume after a failure.', '**Retries and recovery** handle tool and network errors.', '**Guardrails and permission boundaries** limit what each agent may do.', '**Tracing** records every step, tool call and token count so you can debug.', '**Evaluation** replays test tasks and checks the whole trajectory, not only the final answer.'),
    H('Frameworks and SDKs'),
    L('**Claude Agent SDK** and Anthropic tool-use patterns for building agents on Claude.', '**LangChain and LangGraph**: general toolkits, with LangGraph modelling agents as graphs of steps.', '**LlamaIndex**: strong for data and retrieval.', 'A **plain code loop** with no framework is often the clearest choice.'),
    H('How to choose'),
    O('Build the simplest working version in plain code.', 'Note the real pain points (state, retries, tracing).', 'Adopt a framework only where it removes that pain.', 'Check its maintenance status and licence first.'),
    CHECK,
  ], [
    { q: 'When do I need more than one agent?', a: 'When tasks are clearly separable, need different tools or permissions, or benefit from independent review. Otherwise one agent is simpler.' },
    { q: 'What should I log for agents?', a: 'Every model call, tool call and result, the number of tokens and cost, plus the final outcome, so you can replay and debug failures.' },
  ], 'multi-agent systems, langgraph, claude agent sdk, agent orchestration, agent tracing'),

  lesson(S3, 'what-is-mcp-model-context-protocol', 'What Is MCP (Model Context Protocol)?', 'What MCP is, how hosts, clients and servers fit together, and what tools, resources and prompts mean.', '7 min read', [
    P('Every AI app needed its own custom code to connect to calendars, databases and files. The **Model Context Protocol (MCP)** is an open standard that defines one common way for AI applications to connect to external tools and data.'),
    H('The three roles'),
    L('**Host**: the AI application the user works in (for example a desktop assistant or an IDE).', '**Client**: the part of the host that keeps one connection to a server.', '**Server**: a program that exposes capabilities, such as your database or your resume API.'),
    H('What a server can offer'),
    L('**Tools**: actions the model can request, like "search_jobs" or "create_cv".', '**Resources**: data the app can read, like a file or a record.', '**Prompts**: reusable prompt templates the user can pick.'),
    P('Servers can also ask the host for a model completion (**sampling**) and learn which folders they may use (**roots**), depending on what the host supports.'),
    H('How it communicates'),
    P('MCP messages use **JSON-RPC**. Two transports are common: **stdio** for a server running locally as a child process, and **Streamable HTTP** for remote servers.'),
    H('Why it matters'),
    L('Write an integration once and use it from many AI apps.', 'Users keep control, because tools can require consent.', 'It separates your data and permissions from the model.'),
    P('MCP is not the same as a normal API. A REST API is for programs you write. An MCP server describes itself to an AI client, so the model can discover what is available and use it.'),
    N('The specification evolves. Read the official site, modelcontextprotocol.io, for the current version.'),
  ], [
    { q: 'Is MCP only for Claude?', a: 'No. It is an open protocol, and a growing number of AI applications support it, so one server can work with several clients.' },
    { q: 'What is the difference between an MCP tool and a resource?', a: 'A tool performs an action when the model asks. A resource is data the application can read, like a document.' },
  ], 'what is mcp, model context protocol, mcp host client server, mcp tools resources prompts'),

  lesson(S3, 'build-an-mcp-server-node', 'Build an MCP Server in Node.js', 'A small MCP server with one tool, how to test it with the MCP Inspector and how to connect it to a client.', '7 min read', [
    P('Here is the smallest useful MCP server: one tool that checks a resume for missing sections. Treat the code as a sketch of the idea, because the SDK is updated often; compare with the official TypeScript SDK documentation.'),
    H('Install'),
    C('bash', `npm install @modelcontextprotocol/sdk zod`),
    H('The server'),
    C('javascript', `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "resume-tools", version: "1.0.0" });

server.tool(
  "check_sections",
  "Check which standard resume sections are present in the given text.",
  { text: z.string().max(20000) },
  async ({ text }) => {
    const wanted = ["summary", "experience", "education", "skills"];
    const missing = wanted.filter((s) => !text.toLowerCase().includes(s));
    return { content: [{ type: "text", text: missing.length ? "Missing: " + missing.join(", ") : "All sections found" }] };
  }
);

await server.connect(new StdioServerTransport());`),
    P('Note that logs must not go to standard output with the stdio transport, because it carries the protocol messages. Write logs to standard error.'),
    H('Test it'),
    P('Use the **MCP Inspector** to list the tools, call them and see the raw messages before connecting a real assistant.'),
    C('bash', `npx @modelcontextprotocol/inspector node server.js`),
    H('Connect it'),
    P('Add the server to the configuration of an MCP-capable client, giving the command that starts it. For a remote server you would use the Streamable HTTP transport and add authentication.'),
    H('Good practice'),
    L('Validate all inputs, as with any tool.', 'Expose only the tools you need.', 'Return clear errors.', 'Add logging and tests.'),
  ], [
    { q: 'Why does my stdio MCP server break when I use console.log?', a: 'Standard output carries the protocol messages, so extra text corrupts them. Log to standard error instead.' },
    { q: 'How do I debug a server?', a: 'Use the MCP Inspector to call tools directly and inspect requests and responses.' },
  ], 'build mcp server node, mcp typescript sdk, mcp inspector, stdio transport'),

  lesson(S3, 'mcp-security-and-integration', 'MCP Security: Permissions, Consent and Prompt Injection', 'How to connect AI to tools safely: least privilege, OAuth, consent and treating tool output as untrusted.', '6 min read', [
    P('An MCP server gives a model reach into real systems. The same power makes security important.'),
    H('Least privilege'),
    L('Give each server read-only access unless it truly needs to write.', 'Expose a small set of tools, and use allowlists for which tools an assistant may call.', 'Return only the data needed (data minimisation), not whole records.'),
    H('Consent and approval'),
    P('The user should see and approve sensitive actions. Do not let a tool silently send messages, spend money or delete data.'),
    H('Authentication and authorisation'),
    L('Remote servers should use proper authentication, commonly **OAuth**, with short-lived access tokens.', 'Check on every call what that user is allowed to do. Do not rely on the model to decide.', 'Never put secrets in tool descriptions or results.'),
    H('Untrusted output and prompt injection'),
    P('A tool result may contain text written by someone else: a web page, an email, a support ticket. That text can contain instructions meant for the model. Treat all tool output as data. Do not let it expand permissions, and be careful when one server\'s data could trigger actions in another server.'),
    H('Only install trusted servers'),
    P('A third-party server runs with whatever access you give it. Review the source, the permissions it requests and who maintains it.'),
    H('Test and monitor'),
    L('Write tests for refusals and for malicious input.', 'Log calls with user, tool, arguments and result status.', 'Keep an eye on protocol version compatibility when updating.'),
  ], [
    { q: 'Can an MCP tool result be an attack?', a: 'Yes. If it contains text from an untrusted source, that text may try to instruct the model. Treat results as data and require approval for risky actions.' },
    { q: 'Should the model decide who is allowed to do what?', a: 'No. Enforce permissions in your server code on every call, whatever the model asks for.' },
  ], 'mcp security, prompt injection mcp, oauth mcp server, least privilege ai tools'),

  lesson(S4, 'evaluating-llm-applications', 'Evaluating LLM Applications', 'Build evaluation datasets, measure correctness and faithfulness, use LLM-as-a-judge carefully and catch regressions.', '8 min read', [
    P('You cannot improve what you do not measure. AI features need tests just like code, but the answers are not exact, so the tests look different.'),
    H('Start with a dataset'),
    L('Collect real inputs and write the expected output or a checklist for each.', 'Include easy, hard, and adversarial cases.', 'Keep a **golden set** that you do not tune on, to avoid fooling yourself.', 'Add every bug you find as a new case.'),
    H('What to measure'),
    L('**Correctness**: is the answer right?', '**Relevance**: does it address the question?', '**Faithfulness / groundedness**: is every claim supported by the provided sources?', '**Format**: does it match the schema?', '**Retrieval** (for RAG): precision, recall and F1.', '**Latency and cost** per request.'),
    H('Ways to score'),
    L('**Code checks**: exact match, schema validation, regular expressions. Cheap and reliable when possible.', '**LLM-as-a-judge**: another model grades the output against a rubric. Fast, but it has biases (for example liking longer answers), so check it against human grades.', '**Human review**: slowest, best for subjective quality.', '**Pairwise comparison**: show two outputs and pick the better one, often easier than absolute scores.'),
    H('Regression testing'),
    P('Run the full set on every change to a prompt, model or retrieval setting. If one metric improves and another drops, you will see it.'),
    H('Agents'),
    P('Evaluate the **trajectory**: did it choose the right tools, in a sensible order, within its budget, as well as the final result.'),
    H('Benchmarks'),
    P('Public benchmarks do not predict how a model does on your task. Use them only as a rough guide, then test your own cases.'),
    CHECK,
  ], [
    { q: 'How many test cases do I need?', a: 'Start with a few dozen representative ones and keep growing the set with every failure you find.' },
    { q: 'Can I trust an LLM to grade answers?', a: 'It is useful but biased. Calibrate it on a sample graded by people, and use code checks wherever they can do the job.' },
  ], 'llm evaluation, rag metrics, llm as a judge, regression testing prompts'),

  lesson(S4, 'ai-safety-privacy-and-responsible-ai', 'AI Safety, Privacy and Responsible Use', 'Hallucination mitigation, PII protection, bias, moderation, human review and how Anthropic approaches safety.', '8 min read', [
    P('Shipping AI means taking responsibility for what it produces and what data it touches. This matters most in sensitive areas such as hiring.'),
    H('Reduce hallucinations'),
    L('Ground answers in supplied sources and require citations.', 'Allow "I do not know" as a valid answer.', 'Verify facts with code or tools where possible.', 'Keep a person in charge of high-stakes decisions.'),
    H('Protect personal data'),
    L('Send the model the minimum data needed. Redact names, phone numbers and IDs where they are not required (PII redaction).', 'Know your provider\'s data retention and training terms, and tell users how their data is used.', 'Set retention limits and let users delete their data.', 'Keep access logs for audit.'),
    H('Bias and fairness'),
    P('Models can reflect biases in their training data. For hiring-related features, avoid using protected traits, test outputs across different groups of people, and never use an AI score as the only reason for a decision about a person.'),
    H('Content safety'),
    L('Moderate inputs and outputs for your context.', 'Add rate limits and abuse monitoring.', 'Give users a way to report problems.'),
    H('Copyright and provenance'),
    P('Know where your data comes from and whether you may use it. Do not present generated text as a source it did not come from.'),
    H('How Anthropic approaches safety'),
    P('Anthropic publishes research and policies on safety. Ideas you will see in its documentation include **Constitutional AI** (training a model to follow a written set of principles), safety evaluations, red-teaming, interpretability research and a Responsible Scaling Policy. Models also refuse some requests by design, and you should handle refusals gracefully in your UI.'),
    N('Safety is a trade-off with usefulness. Define what your product must never do, test it, and keep monitoring after launch.'),
  ], [
    { q: 'Is it safe to send personal data to an AI API?', a: 'Only if you need to, and with care. Minimise and redact data, read the provider\'s data terms and follow your privacy policy and local law.' },
    { q: 'Can AI make hiring decisions?', a: 'It can assist, but people should make the decision. Test for bias and keep a human review step for anything that affects a person\'s opportunities.' },
  ], 'ai safety, pii redaction, responsible ai, hallucination mitigation, constitutional ai'),

  lesson(S4, 'running-ai-in-production', 'Running AI in Production: Cost, Reliability and Monitoring', 'Architecture and operations for AI features: provider abstraction, caching, quotas, tracing, fallbacks and incident response.', '8 min read', [
    P('A demo works once. A product works every day, for many users, within a budget.'),
    H('Architecture'),
    L('Keep AI calls on the **server**; the front end only talks to your API.', 'Put the model behind a **provider abstraction** so you can change model or vendor without rewriting features.', 'Store prompts in files with versions.', 'Use background jobs and queues for slow work, and stream results where users wait.', 'Keep conversation and session data in your database.'),
    H('Control cost'),
    L('Log tokens and cost for each request, user and feature.', 'Set per-user quotas and plan limits.', 'Cache repeated answers and use prompt caching for repeated prefixes.', '**Model routing**: send easy tasks to a small model and hard tasks to a larger one.'),
    H('Reliability'),
    L('Retries with exponential backoff and timeouts.', 'Circuit breakers to stop calling a failing service.', 'A fallback model or provider for critical features.', 'Concurrency limits so a spike does not exhaust rate limits.'),
    H('Monitor'),
    L('Latency (including time to first token), error rates and token usage.', 'Quality signals: user feedback, thumbs up or down, and sample reviews.', 'Alerts for sudden cost or error spikes.'),
    H('Ship safely'),
    L('Test prompts and models with your evaluation set before release.', 'Roll out to a small share of users first and run A/B tests.', 'Watch model deprecation notices and plan migrations.', 'Keep secrets in a secrets manager, never in code.'),
    H('Incident response'),
    P('Decide in advance how you will turn an AI feature off (a feature flag), who is told and how you will communicate with users.'),
  ], [
    { q: 'How do I stop one user running up my AI bill?', a: 'Use per-user quotas and rate limits, track usage per user, and set a hard spending cap with your provider where possible.' },
    { q: 'Should I depend on a single AI provider?', a: 'For important features, design so that you can switch or fall back to another model. It protects you from outages, price changes and deprecations.' },
  ], 'ai in production, llm cost control, model routing, llm monitoring, ai architecture'),

  lesson(S4, 'ai-learning-roadmap-and-projects', 'Your AI Learning Roadmap and Project Ideas', 'A suggested order for learning generative AI, and five projects, including a resume and ATS tool, to build a portfolio.', '6 min read', [
    P('Here is a practical path through this and the earlier courses. The time estimates are rough and assume steady study; they will be shorter if you already know JavaScript or Python.'),
    H('Suggested order'),
    O('**Foundations** (2 to 4 weeks): programming, machine learning and LLM basics. Start with [Generative AI & LLM Fundamentals](/learn/generative-ai-llm-fundamentals).', '**Prompting and the Claude API** (1 to 2 weeks): see [Claude API & Tool Use](/learn/claude-api-tool-use).', '**Structured outputs and tool use** (1 to 2 weeks).', '**Embeddings, vector databases and RAG** (2 to 4 weeks).', '**Agents and MCP** (2 to 4 weeks).', '**Evaluation, safety and deployment** (2 to 3 weeks).', '**A portfolio project** (3 to 6 weeks).'),
    H('Five projects'),
    O('**Chatbot**: a streaming chat app with a system prompt, history, error handling and token tracking.', '**Document Q&A with RAG**: upload files, chunk, embed, retrieve and answer with citations.', '**Tool-using agent**: give a model safe tools, validate arguments and evaluate task completion.', '**Resume upgrade tool**: generate resume text, match it to a job description, return structured resume JSON, give ATS-style feedback and export a clean PDF. Try our [ATS checker](/features/ats-checker) and [job matcher](/resume-job-description-matcher) to see what such tools produce.', '**MCP assistant**: build an MCP server with a few controlled tools and connect it to an AI client.'),
    H('Choosing a model for your own product'),
    P('Before switching providers, run the same test set on each candidate and compare resume quality, accuracy, latency and cost. The numbers from your own cases decide, not general rankings.'),
    H('Habits that make you better'),
    L('Build small things often and put them on GitHub.', 'Write down what failed and why.', 'Read the official documentation, because features change.', 'Keep evaluation and safety in every project from day one.'),
    P('Building something you can show helps with job applications. When you are ready, build your resume with [Prime Resume AI](/app) and look for roles in our [jobs section](/jobs).'),
  ], [
    { q: 'How long does it take to learn generative AI development?', a: 'If you can already program, a few months of steady practice is enough to build useful products. Depth in each area takes longer.' },
    { q: 'What is the best first project?', a: 'A streaming chatbot or a document Q&A app. Both teach the API, prompts, retrieval and error handling in one project.' },
  ], 'generative ai roadmap, ai projects for portfolio, learn claude api, ai developer roadmap'),
];
