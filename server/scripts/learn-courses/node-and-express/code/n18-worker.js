import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';

function fib(n) {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

if (isMainThread) {
  // Run slow, CPU-heavy work in separate threads so the main thread stays free.
  const run = (n) =>
    new Promise((resolve, reject) => {
      const worker = new Worker(new URL(import.meta.url), { workerData: n });
      worker.once('message', resolve);
      worker.once('error', reject);
    });

  const results = await Promise.all([run(30), run(31), run(32)]);
  console.log('Results:', results);
} else {
  parentPort.postMessage(fib(workerData));
}
