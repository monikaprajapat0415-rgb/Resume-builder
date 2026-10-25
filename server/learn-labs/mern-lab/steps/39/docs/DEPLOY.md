# Deploying the Job Tracker to a VPS

You need: a small Linux server (Ubuntu), a domain name pointing at its IP address, and a MongoDB Atlas cluster.

## One time

1. Create a non-root user, enable the firewall (`ufw allow OpenSSH`, `ufw allow 'Nginx Full'`, `ufw enable`) and update the system.
2. Install Node.js 20+, nginx, git, certbot and pm2 (`npm install -g pm2`).
3. In Atlas: Network Access must allow your server's IP address. Create a database user that can read and write only the `job_tracker` database.
4. `git clone` your repository to `/var/www/job-tracker`.
5. `cp server/.env.production.example server/.env` and fill in every value. Then `chmod 600 server/.env`.
6. Copy `deploy/nginx.conf` into `/etc/nginx/sites-available/`, change the domain, link it into `sites-enabled`, run `sudo nginx -t` and reload nginx.
7. `sudo certbot --nginx -d your-domain` for HTTPS.
8. `pm2 startup` and run the command it prints, so the app starts after a reboot.

## Every release

`bash deploy/deploy.sh`

It pulls the code, installs packages, builds the React app, syncs MongoDB indexes, reloads pm2 and checks `/api/health`.

## If something is wrong

| Symptom | Look at |
|---|---|
| 502 Bad Gateway | `pm2 logs job-tracker`: the app is not running or the port is not 5000 |
| App starts then exits | the first log line: usually a missing variable in `.env` or Atlas refusing your IP |
| Login works but you are signed out at once | `TRUST_PROXY=1` missing or `JWT_SECRET` changed |
| Upload answers 413 | `client_max_body_size` in nginx |
| Page refresh shows JSON "No route" | the React build is missing: run `npm run build --prefix client` |

## Backups

Turn on Atlas backups (or run `mongodump` on a schedule) and copy `server/uploads/` somewhere safe. Uploaded files are not in MongoDB.
