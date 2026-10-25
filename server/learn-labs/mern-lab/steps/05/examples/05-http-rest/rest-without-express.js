// Lesson 5: HTTP and REST with only Node.js, so you can see what Express will do for you later.
// Run:  node examples/05-http-rest/rest-without-express.js   then in a second terminal:
//   curl -i http://localhost:3000/api/jobs
//   curl -i -X POST http://localhost:3000/api/jobs -H "Content-Type: application/json" -d '{"company":"Acme","role":"Clerk"}'
//   curl -i http://localhost:3000/api/jobs/1
//   curl -i -X DELETE http://localhost:3000/api/jobs/1
import http from 'node:http';

let nextId = 2;
const jobs = [{ id: 1, company: 'Northwind Bank', role: 'Teller' }];

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body === undefined ? '' : JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { resolve(null); } });
  });

http.createServer(async (req, res) => {
  const [path] = req.url.split('?');
  const match = /^\/api\/jobs\/(\d+)$/.exec(path);

  if (req.method === 'GET' && path === '/api/jobs') return send(res, 200, jobs);                       // 200 OK
  if (req.method === 'POST' && path === '/api/jobs') {
    const body = await readBody(req);
    if (!body || !body.company || !body.role) return send(res, 400, { message: 'company and role are required' }); // 400 Bad Request
    const job = { id: nextId++, company: body.company, role: body.role };
    jobs.push(job);
    return send(res, 201, job);                                                                          // 201 Created
  }
  if (match && req.method === 'GET') {
    const job = jobs.find((j) => j.id === Number(match[1]));
    return job ? send(res, 200, job) : send(res, 404, { message: 'Job not found' });                     // 404 Not Found
  }
  if (match && req.method === 'DELETE') {
    const i = jobs.findIndex((j) => j.id === Number(match[1]));
    if (i === -1) return send(res, 404, { message: 'Job not found' });
    jobs.splice(i, 1);
    return send(res, 204);                                                                               // 204 No Content
  }
  send(res, 404, { message: 'No such route' });
}).listen(3000, () => console.log('REST demo on http://localhost:3000'));
