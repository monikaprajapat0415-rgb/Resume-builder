import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// One user has many posts: store the user's id in each post (a reference).
const userSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, lowercase: true, unique: true },
});

const postSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String, lowercase: true, trim: true }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true },
);

// Indexes make the queries you run often fast. Match them to your real queries.
postSchema.index({ author: 1, createdAt: -1 });             // "my posts, newest first"
postSchema.index({ status: 1, tags: 1 });                   // "published posts with this tag"
postSchema.index({ title: 'text', body: 'text' });          // text search

export const User = model('User', userSchema);
export const Post = model('Post', postSchema);

// With a database connection you would write:
//   const post = await Post.findById(id).populate('author', 'name email');   // replaces the id by the user
//   const mine = await Post.find({ author: userId }).sort({ createdAt: -1 }).limit(10).lean();
