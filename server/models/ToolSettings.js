import mongoose from "mongoose";

// One document of on/off switches for the free tools, edited at Admin > Free tools.
const ToolSettingsSchema = new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    imageEnhancer: { type: Boolean, default: true },   // the Image Enhancer (/products/image-enhancer)
}, { timestamps: true });

export default mongoose.model("ToolSettings", ToolSettingsSchema);
