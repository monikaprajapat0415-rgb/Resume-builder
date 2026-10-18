// A prompt chain: the output of one step becomes the input of the next.
// Each step is a small, focused prompt. That is easier to write, test and fix than one giant prompt.

export type Step = { name: string; template: string };
export type StepResult = { name: string; prompt: string; output: string };

// A "model" is just a function from a prompt to text. Here is a fake one that works offline,
// so you can study the chain itself. To use a real model, replace it with a function that calls your server.
export type Model = (prompt: string) => string;

const SKILLS = ['zendesk', 'excel', 'tally', 'welding', 'forklift', 'sql', 'python', 'billing', 'driving', 'customer service', 'inventory', 'safety training'];

// The fake model reads the first line ("TASK: ...") and does a tiny, predictable version of that task.
export const mockModel: Model = (prompt) => {
  const task = /^TASK:\s*(\w+)/m.exec(prompt)?.[1] ?? '';
  const body = prompt.split('\n').slice(1).join('\n').trim();
  switch (task) {
    case 'extract_skills': {
      const found = SKILLS.filter((s) => body.toLowerCase().includes(s));
      return found.length ? found.join(', ') : 'none found';
    }
    case 'summarise':
      return (body.split(/(?<=[.!?])\s+/)[0] ?? '').slice(0, 140);
    case 'critique':
      return body.split(/\s+/).length > 20 ? 'PROBLEM: too long, keep it under 20 words.' : 'OK';
    case 'rewrite':
      return body.replace(/^Responsible for/i, 'Managed').replace(/\s+/g, ' ');
    default:
      return `(mock model: unknown task "${task}")`;
  }
};

// Replace {{input}} (the original text), {{prev}} (the previous output) and {{stepName}} (any earlier output).
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
}

export function runChain(steps: Step[], input: string, model: Model): StepResult[] {
  const vars: Record<string, string> = { input, prev: input };
  const results: StepResult[] = [];
  for (const step of steps) {
    const prompt = fill(step.template, vars);
    const output = model(prompt);
    results.push({ name: step.name, prompt, output });
    vars[step.name] = output;
    vars['prev'] = output;
  }
  return results;
}
