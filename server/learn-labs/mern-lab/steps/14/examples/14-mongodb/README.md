# Lesson 14: set up MongoDB

Pick one:

**A. MongoDB Atlas (free cloud database, nothing to install)**
1. Create an account at mongodb.com/atlas and make a free (M0) cluster.
2. Database Access: add a user with a password. Network Access: allow your current IP address.
3. Connect > Drivers: copy the connection string. It looks like `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/job_tracker`.

**B. MongoDB Community Edition on your computer**
1. Install it from mongodb.com/try/download/community and start the service.
2. Your connection string is `mongodb://127.0.0.1:27017/job_tracker`.

Then try the shell script: `mongosh "<connection string>" examples/14-mongodb/queries.mongosh.js`.
