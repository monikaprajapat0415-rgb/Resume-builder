# Where to go next

Each idea below uses only what you already built. Do them in this order.

1. **Interview dates**: add `interviewAt` to the Job model and show upcoming ones first on the dashboard.
2. **Delete my account**: a route that deletes the user, all of their jobs and their uploaded files.
3. **Refresh sign-in**: keep the token in an httpOnly cookie instead of localStorage (this needs `cookie-parser`, `credentials: 'include'` and a CSRF plan).
4. **Password reset by email**: a one-time token with an expiry, sent through an email provider.
5. **Tests for the React app**: Vitest and React Testing Library for `JobForm` and `Filters`.
6. **TypeScript**: convert the server first (the models give you the types), then the client.
7. **Docker**: one Dockerfile for the app and a compose file with MongoDB for local work.
8. **CI**: a GitHub Actions workflow that runs `npm test` and `npm run build` on every push.
