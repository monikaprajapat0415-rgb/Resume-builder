// A tiny script that calls your running API and checks the answers.
// Start the server first (npm run dev), then in another terminal:  npm run smoke
const base = process.env.API_URL || 'http://localhost:5000/api';
let failed = 0;

const check = (name, ok, extra = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  ' + extra}`);
};
const call = async (method, path, body) => {
  const res = await fetch(base + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, data: text ? JSON.parse(text) : null };
};

let r = await call('GET', '/health');
check('health answers 200', r.status === 200 && r.data.ok === true);

r = await call('POST', '/jobs', { company: 'Smoke Test Ltd', role: 'Tester' });
check('create answers 201', r.status === 201, JSON.stringify(r));
const id = r.data?.id ?? r.data?._id;

r = await call('POST', '/jobs', { company: '', status: 'maybe' });
check('bad body answers 400 with details', r.status === 400 && r.data.details?.company && r.data.details?.status, JSON.stringify(r));

r = await call('GET', `/jobs/${id}`);
check('read it back', r.status === 200 && r.data.company === 'Smoke Test Ltd', JSON.stringify(r));

r = await call('PUT', `/jobs/${id}`, { status: 'interview' });
check('update changes the status', r.status === 200 && r.data.status === 'interview', JSON.stringify(r));

r = await call('DELETE', `/jobs/${id}`);
check('delete answers 204', r.status === 204, JSON.stringify(r));

r = await call('GET', `/jobs/${id}`);
check('deleted job answers 404', r.status === 404, JSON.stringify(r));

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
