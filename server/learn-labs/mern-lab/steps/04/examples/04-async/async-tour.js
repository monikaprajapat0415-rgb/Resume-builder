// Lesson 4: asynchronous JavaScript.   Run:  node examples/04-async/async-tour.js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 1) A callback: "call me when you are done" (the old style)
setTimeout(() => console.log('callback: 100 ms passed'), 100);

// 2) A promise: a value that arrives later
const loadJob = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => (id > 0 ? resolve({ id, role: 'Teller' }) : reject(new Error('Bad id'))), 50);
  });
loadJob(1).then((job) => console.log('promise:', job.role)).catch((err) => console.log(err.message));

// 3) async / await: the same thing, written like normal top-to-bottom code
async function main() {
  await wait(150);
  try {
    const job = await loadJob(2);
    console.log('await:', job.role);
    await loadJob(0); // this one rejects
  } catch (err) {
    console.log('caught:', err.message); // errors from await are caught with try/catch
  }

  // run things at the same time, wait for all of them
  const [a, b] = await Promise.all([loadJob(3), loadJob(4)]);
  console.log('Promise.all:', a.id, b.id);

  // fetch is built into Node 18+ and into every browser
  const server = (await import('node:http')).createServer((req, res) => res.end(JSON.stringify({ ok: true }))).listen(0);
  const res = await fetch(`http://localhost:${server.address().port}/`);
  console.log('fetch:', res.status, await res.json());
  server.close();
}
main();
