# Before you call it finished

## Security
- [ ] `.env` is in `.gitignore` and was never committed (check with `git log --all -- server/.env`)
- [ ] `JWT_SECRET` is long, random and different from development
- [ ] Every private route uses `protect`, and every query includes the signed-in user's id
- [ ] Passwords are hashed; the hash is never returned
- [ ] Uploads: type, size and file signature are checked, names are random
- [ ] Rate limit on sign-in and sign-up; helmet on; CORS lists only your own site

## Quality
- [ ] `npm test` passes in `server/`
- [ ] The app works on a phone-sized screen and with the keyboard only
- [ ] Empty, loading and error states exist for every list and form

## Production
- [ ] HTTPS works and HTTP redirects to it
- [ ] `/api/health` is watched by an uptime monitor
- [ ] Database backups are on and you have restored one at least once
- [ ] Logs are readable with `pm2 logs`, and contain no passwords or tokens
