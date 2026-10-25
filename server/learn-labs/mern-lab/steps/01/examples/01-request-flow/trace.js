// Lesson 1: follow one request through a full stack app, using only Node.js (no libraries).
// Run it:  node examples/01-request-flow/trace.js
//
// The three players are the same ones a MERN app has:
//   browser  -> asks for data      (React runs here)
//   server   -> receives the call  (Node.js + Express run here)
//   database -> keeps the data     (MongoDB runs here; we fake it with an array)
import http from 'node:http';

const database = [
  { id: 1, company: 'Acme Logistics', role: 'Dispatcher', status: 'applied' },
  { id: 2, company: 'Northwind Bank', role: 'Teller', status: 'interview' },
];

const log = (who, what) => console.log(`[${who.padEnd(8)}] ${what}`);

const server = http.createServer((req, res) => {
  log('server', `received ${req.method} ${req.url}`);
  if (req.method === 'GET' && req.url === '/api/jobs') {
    log('server', 'asking the database for all jobs');
    const jobs = database; // in a real app this is a MongoDB query
    log('database', `found ${jobs.length} documents`);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(jobs));
    log('server', 'sent the jobs back as JSON');
    return;
  }
  res.statusCode = 404;
  res.end('Not found');
});

server.listen(0, async () => {
  const { port } = server.address();
  log('browser', `calling GET http://localhost:${port}/api/jobs`);
  const response = await fetch(`http://localhost:${port}/api/jobs`);
  const jobs = await response.json();
  log('browser', `got status ${response.status} and ${jobs.length} jobs`);
  for (const job of jobs) log('browser', `draw a card: ${job.role} at ${job.company} (${job.status})`);
  server.close();
});
