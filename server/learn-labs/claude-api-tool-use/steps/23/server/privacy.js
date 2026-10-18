// Remove personal data from text BEFORE it leaves your server for an AI provider.
// This is a first line of defence. Patterns miss things, so also tell users not to paste secrets.

const luhn = (digits) => {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

// Order matters: longer, more specific patterns run first.
// (?<!\d[ -]?) and (?![ -]?\d) mean "not part of a longer number", so we never cut a number in half.
const RULES = [
  { type: 'EMAIL', re: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi },
  { type: 'PAN', re: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g },
  { type: 'CARD', re: /(?<!\d[ -]?)\d(?:[ -]?\d){12,18}(?![ -]?\d)/g, check: (m) => luhn(m.replace(/\D/g, '')) },
  { type: 'AADHAAR', re: /(?<!\d[ -]?)[2-9]\d{3}[ -]?\d{4}[ -]?\d{4}(?![ -]?\d)/g },
  { type: 'PHONE', re: /(?<!\d[ -]?)(?:\+\d{1,3}[ -]?)?(?:\(?\d{2,5}\)?[ -]?)?\d{3,5}[ -]?\d{4,5}(?![ -]?\d)/g, check: (m) => m.replace(/\D/g, '').length >= 10 },
];

// Returns { text, found, map }. map lets you put the real values back into the reply for the user.
export function redact(input) {
  let text = String(input);
  const map = {};
  const counts = {};
  for (const { type, re, check } of RULES) {
    text = text.replace(re, (m) => {
      if (check && !check(m)) return m;
      counts[type] = (counts[type] || 0) + 1;
      const token = `[${type}_${counts[type]}]`;
      map[token] = m;
      return token;
    });
  }
  return { text, found: Object.entries(counts).map(([type, count]) => ({ type, count })), map };
}

export const restore = (text, map) => Object.entries(map).reduce((t, [token, value]) => t.split(token).join(value), String(text));
