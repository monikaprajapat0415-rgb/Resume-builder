import mongoose from "mongoose";

// A review of an employer by a current or former employee/candidate. Held for admin approval.
const CompanyReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    companySlug: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    pros: { type: String, default: '' },
    cons: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    employment: { type: String, enum: ['current', 'former', 'candidate'], default: 'former' },
    displayName: { type: String, default: 'Anonymous' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    reports: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    adminNote: { type: String, default: '' },
}, { timestamps: true });
CompanyReviewSchema.index({ companySlug: 1, user: 1 }, { unique: true });

export default mongoose.model("CompanyReview", CompanyReviewSchema);
