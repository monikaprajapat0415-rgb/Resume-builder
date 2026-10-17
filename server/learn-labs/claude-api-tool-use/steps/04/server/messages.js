// Clean the chat history that comes from the browser. Never trust it.
//  - only "user" and "assistant" roles
//  - text only, limited length
//  - keep the last 20 messages
//  - the first message must be from the user, and the last one too
export function cleanMessages(input) {
  if (!Array.isArray(input)) return [];
  let list = input
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }))
    .slice(-20);
  while (list.length && list[0].role !== 'user') list.shift();
  return list;
}

export const lastIsUser = (list) => list.length > 0 && list[list.length - 1].role === 'user';
