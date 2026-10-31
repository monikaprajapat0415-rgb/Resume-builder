import mongoose from "mongoose";

// One document of on/off switches for the free tools, edited at Admin > Free tools.
const ToolSettingsSchema = new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    imageEnhancer: { type: Boolean, default: true },   // the Image Enhancer (/products/image-enhancer)
    enhancerDailyLimit: { type: Number, default: 10, min: 1, max: 500 }, // free enhancements per signed-in user per day (admins are not limited)
    enhancerMode: { type: String, enum: ['pro', 'standard'], default: 'pro' }, // mode the page starts on
}, { timestamps: true });

export default mongoose.model("ToolSettings", ToolSettingsSchema);
