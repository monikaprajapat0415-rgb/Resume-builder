// Making a model's answer safe to use in code: find the JSON, check it against a schema, and if it is wrong,
// build a short "repair" message that tells the model exactly what to fix.

export type Schema =
  | { type: 'string'; minLength?: number; maxLength?: number; enum?: string[] }
  | { type: 'number'; min?: number; max?: number; integer?: boolean }
  | { type: 'boolean' }
  | { type: 'array'; items: Schema; maxItems?: number }
  | { type: 'object'; properties: Record<string, Schema>; required?: string[] };

// Models often wrap JSON in text or code fences. Take the first complete {...} or [...] block.
export function extractJson(text: string): unknown {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  const candidate = fenced ? fenced[1]! : text;
  const start = candidate.search(/[{[]/);
  if (start < 0) throw new Error('No JSON found in the answer.');
  const open = candidate[start]!;
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i]!;
    if (inString) {
      if (ch === '\\') i++;
      else if (ch === '"') inString = false;
    } else if (ch === '"') inString = true;
    else if (ch === open) depth++;
    else if (ch === close && --depth === 0) return JSON.parse(candidate.slice(start, i + 1));
  }
  throw new Error('The JSON is not complete (a bracket is missing).');
}

export function validate(value: unknown, schema: Schema, path = 'answer'): string[] {
  const errors: string[] = [];
  switch (schema.type) {
    case 'string':
      if (typeof value !== 'string') return [`${path} must be a string`];
      if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path} must have at least ${schema.minLength} characters`);
      if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push(`${path} must have at most ${schema.maxLength} characters`);
      if (schema.enum && !schema.enum.includes(value)) errors.push(`${path} must be one of: ${schema.enum.join(', ')}`);
      return errors;
    case 'number':
      if (typeof value !== 'number' || !Number.isFinite(value)) return [`${path} must be a number`];
      if (schema.integer && !Number.isInteger(value)) errors.push(`${path} must be a whole number`);
      if (schema.min !== undefined && value < schema.min) errors.push(`${path} must be at least ${schema.min}`);
      if (schema.max !== undefined && value > schema.max) errors.push(`${path} must be at most ${schema.max}`);
      return errors;
    case 'boolean':
      return typeof value === 'boolean' ? [] : [`${path} must be true or false`];
    case 'array':
      if (!Array.isArray(value)) return [`${path} must be a list`];
      if (schema.maxItems !== undefined && value.length > schema.maxItems) errors.push(`${path} must have at most ${schema.maxItems} items`);
      value.forEach((v, i) => errors.push(...validate(v, schema.items, `${path}[${i}]`)));
      return errors;
    case 'object': {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) return [`${path} must be an object`];
      const obj = value as Record<string, unknown>;
      for (const key of schema.required ?? []) if (!(key in obj)) errors.push(`${path}.${key} is missing`);
      for (const [key, sub] of Object.entries(schema.properties)) if (key in obj) errors.push(...validate(obj[key], sub, `${path}.${key}`));
      return errors;
    }
  }
}

export type Attempt = { raw: string; parsed?: unknown; errors: string[] };

// Check every attempt in order. In a real app each failed attempt would send the repair message to the model
// and wait for the next answer. Here the attempts are given, so you can see the whole loop.
export function checkAttempts(raws: string[], schema: Schema): { attempts: Attempt[]; repairs: string[]; ok: boolean } {
  const attempts: Attempt[] = [];
  const repairs: string[] = [];
  let ok = false;
  for (const raw of raws) {
    try {
      const parsed = extractJson(raw);
      const errors = validate(parsed, schema);
      attempts.push({ raw, parsed, errors });
      if (!errors.length) { ok = true; break; }
      repairs.push(`Your JSON had these problems:\n- ${errors.join('\n- ')}\nReturn the corrected JSON only.`);
    } catch (e) {
      const message = (e as Error).message;
      attempts.push({ raw, errors: [message] });
      repairs.push(`Your answer could not be read: ${message}\nReturn valid JSON only.`);
    }
  }
  return { attempts, repairs, ok };
}

// The schema used in the page: a resume match report.
export const MATCH_SCHEMA: Schema = {
  type: 'object',
  required: ['score', 'verdict', 'missing_skills'],
  properties: {
    score: { type: 'number', min: 0, max: 100, integer: true },
    verdict: { type: 'string', enum: ['strong', 'partial', 'weak'] },
    missing_skills: { type: 'array', items: { type: 'string', maxLength: 40 }, maxItems: 8 },
  },
};
