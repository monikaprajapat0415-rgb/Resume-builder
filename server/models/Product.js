import mongoose from "mongoose";

// Same block shape as blog posts so the admin can reuse one content editor.
const BlockSchema = new mongoose.Schema({
    type: { type: String, enum: ['heading', 'paragraph', 'list'], required: true },
    text: { type: String },
    items: { type: [String], default: undefined },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },          // meta description / card text
    keywords: { type: String, default: '' },
    content: { type: [BlockSchema], default: [] },        // long description
    features: { type: [String], default: [] },
    images: { type: [String], default: [] },              // first image is the cover
    category: { type: String, default: '' },              // Category.slug (type: product)
    price: { type: Number, default: 0, min: 0 },
    compareAtPrice: { type: Number, default: 0, min: 0 }, // struck-through "was" price
    currency: { type: String, default: 'INR' },
    // Where the "Buy" button sends people (Razorpay/Stripe payment link, Gumroad,
    // Amazon, WhatsApp, a mailto:, ...). Checkout itself happens there.
    buyUrl: { type: String, default: '' },
    buttonLabel: { type: String, default: 'Buy now' },
    stockStatus: { type: String, enum: ['in_stock', 'out_of_stock', 'coming_soon'], default: 'in_stock' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },                 // "Buy" button clicks
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
