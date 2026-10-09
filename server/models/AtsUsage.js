import mongoose from "mongoose";

// How many ATS checks an email address has used / been granted. Keyed by EMAIL (not
// user id) and kept when an account is deleted, so deleting the account and signing
// up again can't be used to get another free check.
const AtsUsageSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    freeUsed: { type: Number, default: 0 },   // free checks used (limit: FREE_CHECKS)
    credits: { type: Number, default: 0 },    // extra checks granted by an admin
    disabled: { type: Boolean, default: false }, // admin switched the ATS checker off for this person
    totalChecks: { type: Number, default: 0 },
    lastCheckAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("AtsUsage", AtsUsageSchema);
