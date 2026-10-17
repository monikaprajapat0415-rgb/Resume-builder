import { Router } from 'express';
import { client, MODEL, textOf } from '../claude.js';
import { tools, runTool } from '../tools.js';

const router = Router();
const MAX_TURNS = 5; // never let the loop run forever

// POST /api/agent  { message }  ->  { text, trace }
router.post('/agent', async (req, res) => {
  const message = String(req.body?.message || '').trim().slice(0, 6000);
  if (!message) return res.status(400).json({ error: { message: 'Please type a message.' } });

  const messages = [{ role: 'user', content: message }];
  const trace = []; // a record of every tool call, shown in the Angular page

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    const reply = await client.messages.create({ model: MODEL, max_tokens: 800, tools, messages });
    messages.push({ role: 'assistant', content: reply.content });

    // No tool requested: this is the final answer.
    if (reply.stop_reason !== 'tool_use') {
      return res.json({ text: textOf(reply), trace, turns: turn });
    }

    // Run every tool Claude asked for and send back one result for each.
    const results = [];
    for (const block of reply.content) {
      if (block.type !== 'tool_use') continue;
      let output;
      let isError = false;
      try {
        output = runTool(block.name, block.input);
      } catch (e) {
        output = { error: e.message };
        isError = true;
      }
      trace.push({ tool: block.name, input: block.input, output, isError });
      results.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(output), ...(isError ? { is_error: true } : {}) });
    }
    messages.push({ role: 'user', content: results });
  }

  res.json({ text: 'Stopped: too many steps. Please try a simpler request.', trace, turns: MAX_TURNS });
});

export default router;
