// Calls your running API and checks the answers. Start the server (npm run dev), then:  npm run smoke
const base = process.env.API_URL || 'http://localhost:5000/api';
let failed = 0;
const check = (name, ok, extra = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  ' + extra}`);
};
const call = async (method, path, body, token) => {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  return { status: res.status, data: text ? JSON.parse(text) : null };
};

const stamp = Date.now();
let r = await call('GET', '/health');
check('health answers 200', r.status === 200 && r.data.ok === true);

r = await call('GET', '/jobs');
check('jobs without a token answer 401', r.status === 401, JSON.stringify(r));

r = await call('POST', '/auth/register', { name: 'Ana', email: `ana-${stamp}@example.com`, password: 'short' });
check('short password answers 400', r.status === 400 && r.data.details?.password, JSON.stringify(r));

r = await call('POST', '/auth/register', { name: 'Ana', email: `ana-${stamp}@example.com`, password: 'Password123' });
check('register answers 201 with a token and no hash', r.status === 201 && r.data.token && !JSON.stringify(r.data).includes('passwordHash'), JSON.stringify(r));
const ana = r.data?.token;

r = await call('POST', '/auth/register', { name: 'Ana', email: `ana-${stamp}@example.com`, password: 'Password123' });
check('same email again answers 409', r.status === 409, JSON.stringify(r));

r = await call('POST', '/auth/login', { email: `ana-${stamp}@example.com`, password: 'wrong-password' });
check('wrong password answers 401', r.status === 401, JSON.stringify(r));

r = await call('POST', '/auth/login', { email: `ana-${stamp}@example.com`, password: 'Password123' });
check('login answers 200 with a token', r.status === 200 && r.data.token, JSON.stringify(r));

r = await call('GET', '/auth/me', null, ana);
check('me returns the signed-in user', r.status === 200 && r.data.user.name === 'Ana', JSON.stringify(r));

r = await call('POST', '/jobs', { company: 'Smoke Test Ltd', role: 'Tester' }, ana);
check('create answers 201', r.status === 201 && r.data.status === 'saved', JSON.stringify(r));
const id = r.data?.id;

r = await call('POST', '/jobs', { company: '', status: 'maybe' }, ana);
check('bad body answers 400 with details', r.status === 400 && r.data.details?.company && r.data.details?.status, JSON.stringify(r));

r = await call('GET', '/jobs?q=smoke', null, ana);
check('search finds it', r.status === 200 && r.data.total === 1 && r.data.items[0].id === id, JSON.stringify(r));

r = await call('PUT', `/jobs/${id}`, { status: 'interview' }, ana);
check('update changes the status', r.status === 200 && r.data.status === 'interview', JSON.stringify(r));

r = await call('GET', '/jobs/stats', null, ana);
check('stats count it', r.status === 200 && r.data.byStatus.interview === 1 && r.data.total === 1, JSON.stringify(r));

// a second person must not see Ana's job
r = await call('POST', '/auth/register', { name: 'Ben', email: `ben-${stamp}@example.com`, password: 'Password123' });
const ben = r.data?.token;
r = await call('GET', `/jobs/${id}`, null, ben);
check("another user cannot read Ana's job (404)", r.status === 404, JSON.stringify(r));
r = await call('DELETE', `/jobs/${id}`, null, ben);
check("another user cannot delete Ana's job (404)", r.status === 404, JSON.stringify(r));

r = await call('DELETE', `/jobs/${id}`, null, ana);
check('owner can delete (204)', r.status === 204, JSON.stringify(r));
r = await call('GET', `/jobs/${id}`, null, ana);
check('deleted job answers 404', r.status === 404, JSON.stringify(r));

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
