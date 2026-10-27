import mongoose from "mongoose";

// One document (key "main") holding the paid-plan switch and its wording. The plan is OFF until an admin turns it on,
// so a fresh install or an empty database behaves exactly like a fully free site.
const PlanSettingsSchema = new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    enabled: { type: Boolean, default: false },
    planName: { type: String, default: 'Pro', maxlength: 40 },
    price: { type: Number, default: 0, min: 0, max: 10000000 },
    currency: { type: String, default: 'INR', maxlength: 6 },
    period: { type: String, enum: ['month', 'year', 'once'], default: 'month' },
    tagline: { type: String, default: '', maxlength: 160 },
    features: [{ type: String, maxlength: 100 }],      // what the paid plan includes (shown on /pricing)
    freeFeatures: [{ type: String, maxlength: 100 }],  // what stays free (shown on /pricing)
    paymentLink: { type: String, default: '', maxlength: 500 },   // a payment link made in the admin's own payment provider
    payInstructions: { type: String, default: '', maxlength: 300 }, // e.g. "WhatsApp us at ... after paying"
    // Which features need the paid plan while it is enabled. Everything not ticked stays free.
    gates: {
        ai_writing: { type: Boolean, default: false },   // AI summary and bullet-point help
        cover_letter: { type: Boolean, default: false }, // AI cover letters
        cv_generate: { type: Boolean, default: false },  // AI CV builder
        image_8k: { type: Boolean, default: false },     // image enhancer 8K output
    },
}, { timestamps: true });

export default mongoose.model("PlanSettings", PlanSettingsSchema);
