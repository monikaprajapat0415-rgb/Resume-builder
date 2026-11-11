import cluster from 'node:cluster';
import http from 'node:http';

const WORKERS = 2;

if (cluster.isPrimary) {
  // The primary process starts one worker per core you want to use, and restarts any that die.
  let ready = 0;
  for (let i = 0; i < WORKERS; i++) cluster.fork();
  cluster.on('listening', () => {
    ready += 1;
    if (ready === WORKERS) {
      // Ask the shared port twice and see which worker answered.
      const asks = [1, 2, 3, 4].map(() => new Promise((resolve) => {
        http.get('http://127.0.0.1:3199', (res) => {
          let body = '';
          res.on('data', (c) => (body += c));
          res.on('end', () => resolve(body));
        });
      }));
      Promise.all(asks).then((answers) => {
        console.log('Answers came from', new Set(answers).size, 'worker process(es)');
        for (const id in cluster.workers) cluster.workers[id].kill();
        setTimeout(() => process.exit(0), 100);
      });
    }
  });
} else {
  http.createServer((req, res) => res.end('worker ' + process.pid)).listen(3199);
}
