import mongoose from "mongoose";

// Real customer reviews and "trusted by" clients shown on the home page. Only items an admin has
// published (and, for reviews, confirmed permission for) are ever shown to visitors.
const TrustItemSchema = new mongoose.Schema({
    kind: { type: String, enum: ['review', 'client'], required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },      // person (review) or company (client)
    role: { type: String, trim: true, maxlength: 80, default: '' },          // review: job title
    company: { type: String, trim: true, maxlength: 80, default: '' },       // review: employer or company
    location: { type: String, trim: true, maxlength: 60, default: '' },
    quote: { type: String, trim: true, maxlength: 500, default: '' },        // review text
    rating: { type: Number, min: 0, max: 5, default: 0 },                    // 0 = no stars shown
    logoUrl: { type: String, trim: true, maxlength: 500, default: '' },      // client logo or reviewer photo
    url: { type: String, trim: true, maxlength: 500, default: '' },          // client website (optional)
    reviewerType: { type: String, enum: ['job seeker', 'employer', 'client'], default: 'job seeker' },
    permission: { type: Boolean, default: false },                           // admin confirms they may show this publicly
    proof: { type: String, trim: true, maxlength: 300, default: '' },        // private note: where it came from (never shown)
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("TrustItem", TrustItemSchema);
