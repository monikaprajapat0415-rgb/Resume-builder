import mongoose from 'mongoose';

export const STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected'];

const jobSchema = new mongoose.Schema(
  {
    company: { type: String, required: [true, 'company is required'], trim: true, maxlength: 120 },
    role: { type: String, required: [true, 'role is required'], trim: true, maxlength: 120 },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    status: { type: String, enum: { values: STATUSES, message: 'status must be one of: ' + STATUSES.join(', ') }, default: 'saved' },
    salaryNote: { type: String, trim: true, maxlength: 120, default: '' },
    notes: { type: String, trim: true, maxlength: 2000, default: '' },
    appliedOn: { type: Date },
  },
  { timestamps: true },
);

// Indexes make the common questions fast: "newest first" and "only this status, newest first".
jobSchema.index({ createdAt: -1 });
jobSchema.index({ status: 1, createdAt: -1 });

jobSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { delete ret._id; return ret; },
});

export default mongoose.model('Job', jobSchema);
