// Tools are plain functions that YOUR code runs. Claude only asks for them.

const STOP = new Set('the a an and or of to in for with on at by is are be as we you our your will can from this that it their they them have has not but if'.split(' '));

export const tools = [
  {
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
  },
  {
    name: 'count_words',
    description: 'Count the words in a piece of text. Use it when the user asks how long a text is.',
    input_schema: {
      type: 'object',
      properties: { text: { type: 'string', description: 'The text to count' } },
      required: ['text'],
    },
  },
];

const handlers = {
  get_job_keywords({ job_text, max_keywords = 8 }) {
    const counts = new Map();
    for (const word of String(job_text).toLowerCase().match(/[a-z][a-z+#.]{2,}/g) || []) {
      if (!STOP.has(word)) counts.set(word, (counts.get(word) || 0) + 1);
    }
    const top = [...counts].sort((a, b) => b[1] - a[1]).slice(0, Math.min(Number(max_keywords) || 8, 20));
    return { keywords: top.map(([word, times]) => ({ word, times })) };
  },
  count_words({ text }) {
    return { words: String(text).trim().split(/\s+/).filter(Boolean).length };
  },
};

export function runTool(name, input) {
  const fn = handlers[name];
  if (!fn) throw new Error(`Unknown tool: ${name}`);
  return fn(input || {});
}
