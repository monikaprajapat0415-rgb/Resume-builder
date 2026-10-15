import mongoose from "mongoose";

// A company asking an available job seeker to get in touch.
const ContactRequestSchema = new mongoose.Schema({
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true, index: true },
    talentId: { type: mongoose.Schema.Types.ObjectId, ref: 'TalentProfile', required: true, index: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },           // optional: the role the company wants to talk about
    message: { type: String, required: true, maxlength: 1200, trim: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined', 'withdrawn', 'expired'], default: 'pending', index: true },
    reply: { type: String, default: '', maxlength: 600, trim: true },
    // Filled only when the seeker accepts: exactly what the seeker chose to share.
    sharedContact: { name: String, email: String, phone: String },
    respondedAt: { type: Date },
    remindedAt: { type: Date },                                            // one reminder email to the seeker while the request is unanswered
}, { timestamps: true });

ContactRequestSchema.index({ employerId: 1, talentId: 1, createdAt: -1 });

export default mongoose.model("ContactRequest", ContactRequestSchema);
