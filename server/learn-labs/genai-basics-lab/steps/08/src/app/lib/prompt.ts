// A prompt is a small document. Writing it in labelled parts makes it easier to improve and to test.

export type PromptParts = {
  role: string;
  task: string;
  context: string;
  rules: string[];
  examples: { input: string; output: string }[];
  format: string;
};

export function buildPrompt(p: PromptParts): string {
  const out: string[] = [];
  if (p.role.trim()) out.push(`You are ${p.role.trim()}.`);
  if (p.task.trim()) out.push(`Task: ${p.task.trim()}`);
  if (p.context.trim()) out.push(`Context:\n<context>\n${p.context.trim()}\n</context>`);
  const rules = p.rules.map((r) => r.trim()).filter(Boolean);
  if (rules.length) out.push(`Rules:\n${rules.map((r) => `- ${r}`).join('\n')}`);
  const ex = p.examples.filter((e) => e.input.trim() && e.output.trim());
  if (ex.length) out.push(`Examples:\n${ex.map((e, i) => `<example n="${i + 1}">\nInput: ${e.input.trim()}\nOutput: ${e.output.trim()}\n</example>`).join('\n')}`);
  if (p.format.trim()) out.push(`Output format: ${p.format.trim()}`);
  return out.join('\n\n');
}

export type Warning = { level: 'tip' | 'problem'; text: string };

const VAGUE = /\b(good|nice|better|great|some|things|stuff|etc|appropriate)\b/i;

// A very simple prompt checker. It cannot judge quality, but it catches common gaps.
export function lint(p: PromptParts): Warning[] {
  const w: Warning[] = [];
  const task = p.task.trim();
  if (!task) w.push({ level: 'problem', text: 'There is no task. Say what the model must do, starting with a verb.' });
  else {
    if (task.split(/\s+/).length < 5) w.push({ level: 'tip', text: 'The task is very short. Add who it is for and what a good result looks like.' });
    if (VAGUE.test(task)) w.push({ level: 'tip', text: 'The task contains vague words (like "good" or "some"). Say exactly what you mean, for example "3 bullet points under 20 words".' });
  }
  if (!p.format.trim()) w.push({ level: 'tip', text: 'No output format. Say how the answer should look: bullets, a table, JSON, a word limit.' });
  if (!p.rules.some((r) => r.trim())) w.push({ level: 'tip', text: 'No rules. Add limits such as "do not invent facts" or "use simple English".' });
  if (p.context.trim() && !/<context>|"""|---/.test(buildPrompt(p))) w.push({ level: 'problem', text: 'Context is not separated from instructions.' });
  if (p.examples.filter((e) => e.input.trim() && e.output.trim()).length === 1) w.push({ level: 'tip', text: 'One example can make the model copy it too closely. Use two or three different ones.' });
  if (buildPrompt(p).length > 6000) w.push({ level: 'problem', text: 'The prompt is very long. Remove what the model does not need.' });
  return w;
}
