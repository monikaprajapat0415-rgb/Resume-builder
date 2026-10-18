import { Router } from 'express';
import { z } from 'zod';
import { client, MODEL, textOf } from '../claude.js';
import { runAgent } from '../agents.js';
import { retrieve } from '../rag/hybrid.js';

const router = Router();

// Each worker has ONE job, its own system prompt and only the tools it needs.
const searchTool = {
  name: 'search_docs',
  description: 'Search the help-center documents. Returns the best matching passages.',
  input_schema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
};
const searchHandlers = { search_docs: ({ query }) => ({ passages: retrieve(String(query), { mode: 'hybrid', k: 3 }).map((p) => ({ source: p.source, text: p.text })) }) };

// Ask the model to return structured data by forcing it to call one tool.
async function structured(system, user, name, schema, description) {
  const reply = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    system,
    tools: [{ name, description, input_schema: schema }],
    tool_choice: { type: 'tool', name },
    messages: [{ role: 'user', content: user }],
  });
  const block = reply.content.find((b) => b.type === 'tool_use');
  return { data: block?.input, usage: reply.usage };
}

const PlanSchema = z.object({ questions: z.array(z.string().min(5)).min(1).max(3) });
const ReviewSchema = z.object({ approved: z.boolean(), problems: z.array(z.string()).max(5) });

const add = (total, u = {}) => {
  total.input += u.input_tokens ?? u.input ?? 0;
  total.output += u.output_tokens ?? u.output ?? 0;
};

// POST /api/team  { topic }  ->  { plan, research, draft, review, final, usage }
router.post('/team', async (req, res) => {
  const topic = String(req.body?.topic || '').trim().slice(0, 300);
  if (!topic) return res.status(400).json({ error: { message: 'Please type a topic.' } });
  const usage = { input: 0, output: 0 };

  // 1. Supervisor: break the topic into research questions.
  const planned = await structured(
    'You are a supervisor. Break the topic into at most 3 short research questions that the help-center documents could answer.',
    topic, 'submit_plan',
    { type: 'object', properties: { questions: { type: 'array', items: { type: 'string' }, maxItems: 3 } }, required: ['questions'] },
    'Submit the research questions.',
  );
  add(usage, planned.usage);
  const plan = PlanSchema.safeParse(planned.data);
  if (!plan.success) return res.status(502).json({ error: { message: 'The planner did not return a usable plan. Please try again.' } });

  // 2. Researchers: one worker per question, running at the same time.
  const research = await Promise.all(plan.data.questions.map(async (q) => {
    const r = await runAgent({
      system: 'You are a researcher. Use search_docs, then write 2-4 bullet points that answer the question using ONLY what the search returned. Name the source file in brackets after each bullet.',
      user: q, tools: [searchTool], handlers: searchHandlers, maxTurns: 3, maxReplyTokens: 400,
    });
    add(usage, r.usage);
    return { question: q, notes: r.text };
  }));
  const notes = research.map((r) => `## ${r.question}\n${r.notes}`).join('\n\n');

  // 3. Writer: turns the notes into a short guide. It never sees the documents, only the notes.
  const write = async (extra = '') => {
    const reply = await client.messages.create({
      model: MODEL, max_tokens: 700,
      system: 'You are a writer. Write a short, friendly guide (under 200 words) using ONLY the notes. Do not add facts that are not in the notes.',
      messages: [{ role: 'user', content: `Topic: ${topic}\n\n<notes>\n${notes}\n</notes>${extra}` }],
    });
    add(usage, reply.usage);
    return textOf(reply);
  };
  const draft = await write();

  // 4. Reviewer: checks the draft against the notes.
  const reviewed = await structured(
    'You are a strict reviewer. Compare the draft with the notes. Approve only if every claim in the draft is supported by the notes.',
    `<notes>\n${notes}\n</notes>\n\n<draft>\n${draft}\n</draft>`, 'submit_review',
    { type: 'object', properties: { approved: { type: 'boolean' }, problems: { type: 'array', items: { type: 'string' } } }, required: ['approved', 'problems'] },
    'Submit the review.',
  );
  add(usage, reviewed.usage);
  const review = ReviewSchema.safeParse(reviewed.data);
  const verdict = review.success ? review.data : { approved: false, problems: ['The reviewer returned an unusable answer.'] };

  // 5. One revision at most. Loops between agents must always have a limit.
  const final = verdict.approved ? draft : await write(`\n\nA reviewer found these problems. Fix them:\n- ${verdict.problems.join('\n- ')}`);

  res.json({ plan: plan.data.questions, research, draft, review: verdict, final, revised: !verdict.approved, usage });
});

export default router;
