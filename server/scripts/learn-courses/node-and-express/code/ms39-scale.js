// Scaling out in miniature: several copies of a small service behind a round-robin balancer that
// skips copies that fail their health check. nginx and cloud load balancers do the same job.
import http from 'node:http';

export function startService(name) {
  let healthy = true;
  const server = http.createServer((req, res) => {
    if (req.url === '/health') { res.statusCode = healthy ? 200 : 503; return res.end(); }
    res.end(`answered by ${name}`);
  });
  return new Promise((resolve) => server.listen(0, () => resolve({ name, server, port: server.address().port, setHealthy: (v) => { healthy = v; } })));
}

export function createBalancer(targets) {
  let index = 0;
  const isHealthy = (target) => new Promise((resolve) => {
    http.get({ port: target.port, path: '/health' }, (res) => { res.resume(); resolve(res.statusCode === 200); }).on('error', () => resolve(false));
  });
  return {
    async forward() {
      for (let tries = 0; tries < targets.length; tries++) {
        const target = targets[index++ % targets.length];
        if (!(await isHealthy(target))) continue;
        return new Promise((resolve, reject) => {
          http.get({ port: target.port, path: '/' }, (res) => { let body = ''; res.on('data', (c) => (body += c)); res.on('end', () => resolve(body)); }).on('error', reject);
        });
      }
      throw new Error('No healthy service');
    },
  };
}
