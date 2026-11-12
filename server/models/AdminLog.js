import mongoose from "mongoose";

// One row per change an admin makes. Rows delete themselves after a year (TTL index).
const AdminLogSchema = new mongoose.Schema({
    at: { type: Date, default: Date.now, index: true },
    adminId: { type: String, default: '' },
    adminEmail: { type: String, default: '', index: true },
    action: { type: String, default: '' },    // short plain label, e.g. "Changed a user's plan"
    method: { type: String, default: '' },    // POST, PUT, PATCH, DELETE, or SYSTEM for the payment webhook
    path: { type: String, default: '' },      // the route that was called, ids included
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }, // safe fields only (see utils/adminAudit.js)
}, { versionKey: false });
AdminLogSchema.index({ at: 1 }, { expireAfterSeconds: 365 * 86400 });

export default mongoose.models.AdminLog || mongoose.model("AdminLog", AdminLogSchema);
