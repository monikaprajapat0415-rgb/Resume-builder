import mongoose from "mongoose";

// One job the signed-in user is tracking on their private board (Applications in the dashboard).
// Only the owner can read or change a card. Admin > Free tools switches the board on or off and sets the cards-per-user limit.
export const TRACKER_STATUSES = ['saved', 'applied', 'interview', 'offer', 'closed'];

const JobApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    jobUrl: { type: String, trim: true, maxlength: 500, default: "" },
    location: { type: String, trim: true, maxlength: 120, default: "" },
    status: { type: String, enum: TRACKER_STATUSES, default: "applied", index: true },
    appliedOn: { type: Date, default: null },
    followUpOn: { type: Date, default: null },     // the reminder: the board marks the card Due on and after this day
    notes: { type: String, trim: true, maxlength: 2000, default: "" },
}, { timestamps: true });

JobApplicationSchema.index({ userId: 1, status: 1, updatedAt: -1 });

export default mongoose.model("JobApplication", JobApplicationSchema);
