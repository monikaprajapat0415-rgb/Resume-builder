// One-off CLI to promote an existing account to admin.
// Usage (from the server/ directory): node scripts/makeAdmin.js someone@example.com
//
// There's no public "become admin" endpoint on purpose - this is the one way in,
// and it requires access to the server itself (or its hosting shell/SSH).

import "dotenv/config";
import connectDB from "../configs/db.js";
import User from "../models/User.js";

const email = process.argv[2];

if (!email) {
    console.log("Usage: node scripts/makeAdmin.js <email>");
    process.exit(1);
}

await connectDB();

const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });

if (!user) {
    console.log(`No account found with email "${email}". Sign up (or log in) with that email first, then run this again.`);
} else {
    console.log(`Done - ${user.email} is now an admin. Log out and back in, then visit /admin/blogs.`);
}

process.exit(0);
