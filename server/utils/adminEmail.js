import User from "../models/User.js";

// The "default admin" is whichever account has the email in the ADMIN_EMAIL env var.
// It's promoted only once its email is verified (Google login counts as verified),
// so nobody can take over admin by registering with that address first.

const adminEmail = () => (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

// Promote a user document in place if it matches ADMIN_EMAIL. Safe to call anywhere.
export const applyAdminEmail = async (user) => {
    const target = adminEmail();
    if (!target || !user || !user.isVerified) return user;
    if (user.email?.toLowerCase() === target && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
    }
    return user;
};

// Run once at server start so an existing account is promoted without needing a login.
export const promoteAdminOnStartup = async () => {
    const target = adminEmail();
    if (!target) return;
    const result = await User.updateOne(
        { email: new RegExp(`^${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'), isVerified: true },
        { role: 'admin' }
    );
    if (result.modifiedCount) console.log(`[admin] promoted ${target} to admin`);
};
