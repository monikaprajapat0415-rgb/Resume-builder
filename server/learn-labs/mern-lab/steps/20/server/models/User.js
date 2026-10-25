import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], trim: true, maxlength: 80 },
    email: {
      type: String, required: [true, 'email is required'], trim: true, lowercase: true, unique: true, // unique creates an index
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'email is not valid'],
    },
    // select: false = queries do NOT return the hash unless you ask for it with .select('+passwordHash')
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { delete ret._id; delete ret.passwordHash; return ret; },
});

export default mongoose.model('User', userSchema);
