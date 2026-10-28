// Returns { value } for good input or { error } with a message for the client.
export function checkTask(body, { partial = false } = {}) {
  if (typeof body !== 'object' || body === null) return { error: 'Send a JSON object' };
  const out = {};
  if ('title' in body || !partial) {
    if (typeof body.title !== 'string' || body.title.trim() === '') return { error: 'title is required' };
    if (body.title.length > 120) return { error: 'title must be 120 characters or fewer' };
    out.title = body.title.trim();
  }
  if ('done' in body) {
    if (typeof body.done !== 'boolean') return { error: 'done must be true or false' };
    out.done = body.done;
  }
  return { value: out };
}
