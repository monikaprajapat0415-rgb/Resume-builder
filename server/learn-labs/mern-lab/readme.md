# MERN Job Tracker: solution after lesson {{n}} of {{total}}

A small full stack app you build lesson by lesson: **M**ongoDB, **E**xpress, **R**eact and **N**ode.js. People use it to track the jobs they apply for.

This zip holds everything from lesson 1 up to lesson {{n}}. Files from later lessons do not exist yet.

## What is where

- `examples/` : small stand-alone scripts that go with the early lessons. Run them with `node examples/<folder>/<file>.js`.
- `server/` : the Express API (from lesson 8). Run `cd server && npm install && npm run dev`.
- `client/` : the React app (from lesson 25). Run `cd client && npm install && npm run dev`.
- `package.json` in this folder (from lesson 6) has shortcuts: `npm run setup` installs both apps, `npm run dev` starts both together.

## Needs

- Node.js 20 or newer (check with `node -v`).
- A MongoDB database from lesson 14 onwards: a free MongoDB Atlas cluster, or MongoDB Community Edition on your own computer. Put its address in `server/.env` (copy `server/.env.example`). Never commit `.env`.

Library versions move on. If a command fails after a fresh install, read the library's release notes before you change code.
