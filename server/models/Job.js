import mongoose from "mongoose";

// A job listing imported from a JobSource. We keep a short plain-text copy of the
// description and always send applicants to the employer's own apply page.
const JobSchema = new mongoose.Schema({
    sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSource', index: true },          // absent for jobs posted by an employer
    sourceType: { type: String, required: true },
    externalId: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true, maxlength: 200 },
    company: { type: String, required: true, maxlength: 150 },
    location: { type: String, default: '', maxlength: 200 },
    country: { type: String, default: '', maxlength: 60 },     // ISO code or name when the feed gives one
    remote: { type: Boolean, default: false },
    employmentType: { type: String, default: '', maxlength: 40 },
    department: { type: String, default: '', maxlength: 120 },
    salary: { type: String, default: '', maxlength: 120 },
    description: { type: String, default: '', maxlength: 20000 },   // plain text; lists use "- " lines
    applyUrl: { type: String, required: true, maxlength: 1000 },
    postedAt: { type: Date },
    lastSeenAt: { type: Date, required: true },
    active: { type: Boolean, default: true, index: true },         // false once the employer removes it
    hidden: { type: Boolean, default: false },                     // admin can hide a listing
    // Jobs posted directly by a company on this site (sourceType 'employer'). Imported jobs are always approved.
    category: { type: String, enum: ['corporate', 'factory', 'skilled_trade', 'daily_wage'], default: 'corporate', index: true },
    payMin: { type: Number, min: 0 }, payMax: { type: Number, min: 0 },
    currency: { type: String, default: '', maxlength: 3 },
    payPer: { type: String, enum: ['day', 'hour', 'week', 'month', 'year', ''], default: '' },
    openings: { type: Number, min: 1, max: 1000 },                  // how many workers are needed
    perks: { type: [String], default: [] },                         // accommodation, food, transport, PPE...
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', index: true },
    reviewStatus: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved', index: true },
    reviewNote: { type: String, default: '', maxlength: 500 },
}, { timestamps: true });

JobSchema.index({ sourceId: 1, externalId: 1 }, { unique: true });
JobSchema.index({ active: 1, hidden: 1, postedAt: -1 });

export default mongoose.model("Job", JobSchema);
