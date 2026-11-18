import mongoose from "mongoose";

// One row per saved change to a settings screen (Ads, Sign-up prompt, Homepage text and theme). Only the fields that
// changed are kept, old and new, so an admin can see what happened and restore the old values. Rows expire after 180 days.
const SettingsHistorySchema = new mongoose.Schema({
    key: { type: String, required: true, index: true },   // 'ads' | 'nudge' | 'site'
    at: { type: Date, default: Date.now, index: true },
    adminEmail: { type: String, default: '' },
    before: { type: mongoose.Schema.Types.Mixed, default: {} },
    after: { type: mongoose.Schema.Types.Mixed, default: {} },
    restoredFrom: { type: Boolean, default: false },       // this row is itself a restore
}, { versionKey: false });
SettingsHistorySchema.index({ at: 1 }, { expireAfterSeconds: 180 * 86400 });

export default mongoose.models.SettingsHistory || mongoose.model("SettingsHistory", SettingsHistorySchema);
