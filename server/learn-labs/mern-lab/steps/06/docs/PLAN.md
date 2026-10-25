# Job Tracker: the plan

## What it does
A signed-in person keeps a list of the jobs they applied for, moves each one through a status
(saved, applied, interview, offer, rejected), adds notes, and sees a few numbers about their search.

## Folders
```
mern-job-tracker/
  package.json        shortcuts that run both apps
  docs/PLAN.md        this file
  server/             Node.js + Express + Mongoose  (the API)
  client/             React + Vite                  (the screens)
```

## API (JSON, all under /api)
| Method | Path              | What it does                         | Signed in? |
|--------|-------------------|--------------------------------------|------------|
| GET    | /api/health       | is the server up                     | no         |
| POST   | /api/auth/register| create an account                    | no         |
| POST   | /api/auth/login   | get a token                          | no         |
| GET    | /api/auth/me      | who am I                             | yes        |
| GET    | /api/jobs         | list my jobs (search, filter, page)  | yes        |
| POST   | /api/jobs         | add a job                            | yes        |
| GET    | /api/jobs/:id     | one job                              | yes        |
| PUT    | /api/jobs/:id     | change a job                         | yes        |
| DELETE | /api/jobs/:id     | remove a job                         | yes        |
| GET    | /api/jobs/stats   | counts per status                    | yes        |

## Data
- **User**: name, email (unique), passwordHash, createdAt
- **Job**: user (who owns it), company, role, location, status, salary note, notes, appliedOn, resumeFile

## Rules we keep
- A person can only ever see and change their own jobs.
- Passwords are never stored as text and never sent back.
- Secrets live in `.env`, never in Git.
