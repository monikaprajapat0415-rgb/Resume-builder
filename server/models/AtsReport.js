import mongoose from "mongoose";

// A finished ATS report, so the user can re-open it later without using another check.
const AtsReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    email: { type: String, lowercase: true, trim: true },
    fileName: { type: String },
    score: { type: Number },
    report: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.model("AtsReport", AtsReportSchema);
