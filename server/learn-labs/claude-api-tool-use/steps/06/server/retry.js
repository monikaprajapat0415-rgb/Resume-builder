// Retry only the errors that can go away by themselves.
export const isRetryable = (e) =>
  e?.status === 429 || e?.status >= 500 || e?.name === 'APIConnectionError' || e?.name === 'APIConnectionTimeoutError';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Run fn(). If it fails with a retryable error, wait and try again.
// Waits grow each time (exponential backoff) with a little randomness (jitter).
export async function withRetry(fn, { tries = 3, baseMs = 500 } = {}) {
  let attempts = 0;
  for (;;) {
    attempts += 1;
    try {
      return { value: await fn(attempts), attempts };
    } catch (e) {
      if (!isRetryable(e) || attempts >= tries) {
        e.attempts = attempts;
        throw e;
      }
      await sleep(baseMs * 2 ** (attempts - 1) + Math.random() * 200);
    }
  }
}
