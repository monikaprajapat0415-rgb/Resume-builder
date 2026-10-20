import mongoose from "mongoose";

// One person's reported pay for a role. Only approved reports count; figures are shown only as a
// min/median/max once enough reports exist. Amounts are never converted between currencies or periods.
const SalaryReportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roleTitle: { type: String, required: true },
    roleSlug: { type: String, required: true, index: true },
    company: { type: String, default: '' },
    country: { type: String, required: true },
    city: { type: String, default: '' },
    level: { type: String, enum: ['fresher', 'junior', 'mid', 'senior', 'lead'], default: 'mid' },
    experienceYears: { type: Number, default: 0, min: 0, max: 50 },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true },
    period: { type: String, enum: ['hour', 'day', 'month', 'year'], required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    reports: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    adminNote: { type: String, default: '' },
}, { timestamps: true });
SalaryReportSchema.index({ roleSlug: 1, country: 1, status: 1 });

export default mongoose.model("SalaryReport", SalaryReportSchema);
