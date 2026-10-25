#!/usr/bin/env bash
# Run on the server from the project folder:  bash deploy/deploy.sh
set -euo pipefail

git pull --ff-only
npm install --prefix server --omit=dev
npm install --prefix client            # the build needs the dev tools (Vite)
npm run build --prefix client
(cd server && node scripts/sync-indexes.js)
pm2 startOrReload deploy/ecosystem.config.cjs --env production
pm2 save
curl -fsS http://127.0.0.1:5000/api/health && echo "  <- healthy"
