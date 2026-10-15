import mongoose from "mongoose";

// A job seeker's "open to work" profile. Approved companies only ever see the anonymous fields
// (no name, email, phone). Contact details are shared only when the seeker accepts a request.
const TalentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    publicId: { type: String, required: true, unique: true },                 // e.g. "T-7K2M9QXA", the only identifier companies see
    available: { type: Boolean, default: true, index: true },                 // the "available to work" switch
    category: { type: String, enum: ['corporate', 'factory', 'skilled_trade', 'daily_wage'], default: 'corporate', index: true },
    headline: { type: String, required: true, maxlength: 100, trim: true },   // the job or trade, e.g. "Electrician" or "Full Stack Developer"
    country: { type: String, default: 'IN', maxlength: 3, index: true },      // ISO code, see utils/workTaxonomy.js
    level: { type: String, enum: ['fresher', 'junior', 'mid', 'senior', 'lead'], default: 'fresher' },
    experienceYears: { type: Number, min: 0, max: 50, default: 0 },
    skills: { type: [String], default: [] },
    location: { type: String, default: '', maxlength: 100, trim: true },
    remote: { type: Boolean, default: false },
    relocate: { type: Boolean, default: false },
    jobTypes: { type: [String], default: [] },                                // full-time, part-time, contract, internship
    expectedSalary: { type: String, default: '', maxlength: 60, trim: true },   // older free-text field, kept for existing profiles
    payAmount: { type: Number, min: 0, max: 1e9 },                              // what the worker expects, in `currency` per `payPer`
    payPer: { type: String, enum: ['day', 'hour', 'week', 'month', 'year', ''], default: '' },
    currency: { type: String, default: '', maxlength: 3 },
    availability: { type: String, enum: ['now', 'week', 'month', ''], default: '' },
    willingToTravel: { type: Boolean, default: false },                         // will travel to a site / other city
    ownTools: { type: Boolean, default: false },
    languages: { type: [String], default: [] },
    certifications: { type: [String], default: [] },                            // licences / tickets, self-declared
    workRight: { type: String, enum: ['yes', 'need_sponsorship', ''], default: '' },   // self-declared right to work in `country`
    noticePeriod: { type: String, default: '', maxlength: 40, trim: true },   // "Immediate", "30 days"...
    summary: { type: String, default: '', maxlength: 600, trim: true },
    phone: { type: String, default: '', maxlength: 30, trim: true },          // shared only on accept, and only if the seeker wants to
    reminders: { type: Boolean, default: true },                              // email me a reminder about unanswered requests
    blockedEmployers: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    lastActiveAt: { type: Date, default: Date.now },
}, { timestamps: true });

TalentSchema.index({ available: 1, updatedAt: -1 });

export default mongoose.model("TalentProfile", TalentSchema);
