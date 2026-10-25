import mongoose from 'mongoose';

export const STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected'];

const jobSchema = new mongoose.Schema(
  {
    // A reference: this job belongs to one User. We store only that user's _id.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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

// Every query now starts with "this user's jobs", so the indexes start with user too.
jobSchema.index({ user: 1, createdAt: -1 });
jobSchema.index({ user: 1, status: 1, createdAt: -1 });

jobSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { delete ret._id; delete ret.user; return ret; },
});

export default mongoose.model('Job', jobSchema);
