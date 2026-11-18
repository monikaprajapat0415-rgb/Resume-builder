import mongoose from "mongoose";

// A checklist of Search Console issues the admin is working through. Entered by hand: nothing here reads Search Console.
const SeoIssueSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 140 },   // e.g. "Alternate page with proper canonical tag"
    count: { type: Number, default: 0, min: 0 },                           // pages affected, as Search Console shows
    status: { type: String, enum: ['open', 'fixing', 'validating', 'fixed', 'ignore'], default: 'open' },
    note: { type: String, default: '', maxlength: 600 },
    examples: { type: [String], default: [] },                             // a few example URLs (paths)
    checkedAt: { type: Date, default: Date.now },                          // when the count was last read from Search Console
}, { timestamps: true });

export default mongoose.models.SeoIssue || mongoose.model("SeoIssue", SeoIssueSchema);
