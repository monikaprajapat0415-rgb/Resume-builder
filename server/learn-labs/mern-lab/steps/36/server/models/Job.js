import mongoose from 'mongoose';

export const STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected'];

// The attached resume. We keep the file on disk and only its details in MongoDB.
const resumeSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true }, // what the person called it (shown to them)
    storedName: { type: String, required: true },   // random name on disk (never shown, never trusted from the client)
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: [true, 'company is required'], trim: true, maxlength: 120 },
    role: { type: String, required: [true, 'role is required'], trim: true, maxlength: 120 },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    status: { type: String, enum: { values: STATUSES, message: 'status must be one of: ' + STATUSES.join(', ') }, default: 'saved' },
    salaryNote: { type: String, trim: true, maxlength: 120, default: '' },
    notes: { type: String, trim: true, maxlength: 2000, default: '' },
    appliedOn: { type: Date },
    resume: { type: resumeSchema, default: undefined },
  },
  { timestamps: true },
);

jobSchema.index({ user: 1, createdAt: -1 });
jobSchema.index({ user: 1, status: 1, createdAt: -1 });

jobSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.user;
    if (ret.resume) ret.resume = { name: ret.resume.originalName, size: ret.resume.size, uploadedAt: ret.resume.uploadedAt }; // hide storedName
    return ret;
  },
});

export default mongoose.model('Job', jobSchema);
