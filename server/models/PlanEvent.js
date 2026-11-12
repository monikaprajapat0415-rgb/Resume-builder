import mongoose from "mongoose";

// One row per payment notice received on /api/plan/webhook. The provider's event id is unique,
// so a notice that is delivered twice can never grant the plan twice.
const PlanEventSchema = new mongoose.Schema({
    eventId: { type: String, required: true, unique: true },
    provider: { type: String, default: 'generic' },
    email: { type: String, default: '' },
    amount: { type: Number, default: 0 },       // as the provider sent it (not converted)
    currency: { type: String, default: '' },
    days: { type: Number, default: 0 },
    lifetime: { type: Boolean, default: false },
    status: { type: String, enum: ['granted', 'unmatched', 'ignored'], default: 'unmatched', index: true },
    userId: { type: String, default: '' },
    note: { type: String, default: '' },
    at: { type: Date, default: Date.now, index: true },
}, { versionKey: false });
PlanEventSchema.index({ at: 1 }, { expireAfterSeconds: 2 * 365 * 86400 });

export default mongoose.models.PlanEvent || mongoose.model("PlanEvent", PlanEventSchema);
