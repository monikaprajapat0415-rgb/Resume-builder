// pm2 keeps the server running, restarts it if it crashes, and starts it again after a reboot.
//   pm2 start deploy/ecosystem.config.cjs --env production
//   pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: 'job-tracker',
      cwd: './server',
      script: 'index.js',
      instances: 1,            // one is plenty for a small app. Several need the "cluster" mode and no in-memory state.
      max_memory_restart: '300M',
      kill_timeout: 12000,     // a little longer than our 10 second graceful shutdown
      env: { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production', TRUST_PROXY: '1' },
    },
  ],
};
