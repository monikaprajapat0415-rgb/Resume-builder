import crypto from 'node:crypto';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Call another service safely: a time limit, a few retries on temporary errors, and clear failures.
export async function fetchJson(url, { retries = 2, timeoutMs = 2000, baseDelayMs = 50, headers } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), headers });
      if (res.ok) return await res.json();
      // 4xx means we did something wrong: retrying will not help, except for 429 (slow down).
      if (res.status < 500 && res.status !== 429) throw Object.assign(new Error(`HTTP ${res.status}`), { fatal: true });
      lastError = new Error(`HTTP ${res.status}`);
    } catch (error) {
      if (error.fatal) throw error;
      lastError = error;
    }
    if (attempt < retries) await sleep(baseDelayMs * 2 ** attempt);   // 50, 100, 200 ...
  }
  throw new Error(`Failed after ${retries + 1} attempts: ${lastError.message}`);
}

// Webhooks: the other service signs the body with a shared secret. Check it before you trust it.
export function sign(rawBody, secret) {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
}

export function verifySignature(rawBody, signature, secret) {
  const expected = Buffer.from(sign(rawBody, secret));
  const given = Buffer.from(String(signature ?? ''));
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);   // constant-time compare
}
