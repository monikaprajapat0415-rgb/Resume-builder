import mongoose from "mongoose";

// A reader's answer to an interview question. Held for admin approval; the author's identity is never shown
// publicly beyond `displayName` (first name + initial, or "Anonymous").
const InterviewAnswerSchema = new mongoose.Schema({
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewQuestion', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true },
    displayName: { type: String, default: 'Anonymous' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    reports: { type: [mongoose.Schema.Types.ObjectId], default: [] },   // users who flagged it
    adminNote: { type: String, default: '' },
}, { timestamps: true });
InterviewAnswerSchema.index({ question: 1, user: 1 }, { unique: true });

export default mongoose.model("InterviewAnswer", InterviewAnswerSchema);
