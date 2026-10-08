import mongoose from "mongoose";

// One collection for both blog and product categories; `type` keeps them apart so
// the same name ("Guides") can exist in each without clashing.
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    type: { type: String, enum: ['blog', 'product'], required: true },
    description: { type: String, default: '' },
}, { timestamps: true });

CategorySchema.index({ type: 1, slug: 1 }, { unique: true });

export default mongoose.model("Category", CategorySchema);
