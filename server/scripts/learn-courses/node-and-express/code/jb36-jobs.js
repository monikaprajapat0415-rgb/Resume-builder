// A tiny in-memory job queue to teach the ideas: producers add jobs, a worker takes them one by one,
// failed jobs are retried with a delay, and the web request does not wait for the slow work.
export function createQueue({ handler, maxAttempts = 3, retryDelayMs = 10 }) {
  const waiting = [];
  const results = { done: 0, failed: [] };
  let running = false;

  async function run() {
    if (running) return;
    running = true;
    while (waiting.length) {
      const job = waiting.shift();
      try {
        await handler(job.data);
        results.done += 1;
      } catch (error) {
        job.attempts += 1;
        if (job.attempts >= maxAttempts) results.failed.push({ data: job.data, error: error.message });   // "dead letter"
        else { await new Promise((r) => setTimeout(r, retryDelayMs * job.attempts)); waiting.push(job); }
      }
    }
    running = false;
  }

  return {
    results,
    add(data) { waiting.push({ data, attempts: 0 }); queueMicrotask(run); },      // returns at once
    async idle() { while (running || waiting.length) await new Promise((r) => setTimeout(r, 5)); },
  };
}

// A cron-style schedule in plain Node: run something every N ms and stop cleanly.
export function every(ms, task) {
  const timer = setInterval(task, ms);
  timer.unref();                 // does not keep the process alive by itself
  return () => clearInterval(timer);
}
