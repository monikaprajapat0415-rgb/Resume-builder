// pm2 start ecosystem.config.cjs --env production
module.exports = {
  apps: [
    {
      name: 'api',
      script: './src/server.js',
      instances: 'max',            // one copy per CPU core, using cluster mode
      exec_mode: 'cluster',
      max_memory_restart: '300M',  // restart a copy that leaks memory
      env: { NODE_ENV: 'development', PORT: 3000 },
      env_production: { NODE_ENV: 'production', PORT: 3000 },
      kill_timeout: 10000,         // give open requests time to finish
      listen_timeout: 8000,
    },
  ],
};
