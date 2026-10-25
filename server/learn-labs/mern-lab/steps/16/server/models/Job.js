import mongoose from 'mongoose';

export const STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected'];

// A schema describes the shape of a document and the rules it must follow.
const jobSchema = new mongoose.Schema(
  {
    company: { type: String, required: [true, 'company is required'], trim: true, maxlength: 120 },
    role: { type: String, required: [true, 'role is required'], trim: true, maxlength: 120 },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    status: { type: String, enum: { values: STATUSES, message: 'status must be one of: ' + STATUSES.join(', ') }, default: 'saved' },
    salaryNote: { type: String, trim: true, maxlength: 120, default: '' }, // free text on purpose: pay is written many ways
    notes: { type: String, trim: true, maxlength: 2000, default: '' },
    appliedOn: { type: Date },
  },
  { timestamps: true }, // adds createdAt and updatedAt for free
);

// Send `id` instead of `_id` and hide the internal version field.
jobSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { delete ret._id; return ret; },
});

export default mongoose.model('Job', jobSchema);
