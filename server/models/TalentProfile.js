import mongoose from "mongoose";

// A job seeker's "open to work" profile. Approved companies only ever see the anonymous fields
// (no name, email, phone). Contact details are shared only when the seeker accepts a request.
const TalentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    publicId: { type: String, required: true, unique: true },                 // e.g. "T-7K2M9QXA", the only identifier companies see
    available: { type: Boolean, default: true, index: true },                 // the "available to work" switch
    headline: { type: String, required: true, maxlength: 100, trim: true },   // e.g. "Full Stack Developer"
    level: { type: String, enum: ['fresher', 'junior', 'mid', 'senior', 'lead'], default: 'fresher' },
    experienceYears: { type: Number, min: 0, max: 50, default: 0 },
    skills: { type: [String], default: [] },
    location: { type: String, default: '', maxlength: 100, trim: true },
    remote: { type: Boolean, default: false },
    relocate: { type: Boolean, default: false },
    jobTypes: { type: [String], default: [] },                                // full-time, part-time, contract, internship
    expectedSalary: { type: String, default: '', maxlength: 60, trim: true },
    noticePeriod: { type: String, default: '', maxlength: 40, trim: true },   // "Immediate", "30 days"...
    summary: { type: String, default: '', maxlength: 600, trim: true },
    phone: { type: String, default: '', maxlength: 30, trim: true },          // shared only on accept, and only if the seeker wants to
    blockedEmployers: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    lastActiveAt: { type: Date, default: Date.now },
}, { timestamps: true });

TalentSchema.index({ available: 1, updatedAt: -1 });

export default mongoose.model("TalentProfile", TalentSchema);
