import mongoose from "mongoose";

// One place we pull job listings from: a company's public applicant-tracking board
// (Greenhouse / Lever / Ashby) or a job-feed API (Arbeitnow, Adzuna).
const JobSourceSchema = new mongoose.Schema({
    type: { type: String, enum: ['greenhouse', 'lever', 'ashby', 'arbeitnow', 'adzuna'], required: true },
    company: { type: String, trim: true, maxlength: 100, default: '' },   // display name (feeds that list many companies leave it empty)
    token: { type: String, trim: true, maxlength: 80, default: '' },      // board slug (greenhouse/lever/ashby) or 2-letter country (adzuna)
    query: { type: String, trim: true, maxlength: 80, default: '' },      // optional search words (adzuna) / keyword filter (arbeitnow)
    enabled: { type: Boolean, default: true },
    lastRunAt: { type: Date },
    lastStatus: { type: String, enum: ['ok', 'error'] },
    lastError: { type: String, default: '' },
    lastCount: { type: Number, default: 0 },
}, { timestamps: true });

JobSourceSchema.index({ type: 1, token: 1, query: 1 }, { unique: true });

export default mongoose.model("JobSource", JobSourceSchema);
