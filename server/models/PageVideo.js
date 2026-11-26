import mongoose from "mongoose";

// A YouTube video shown near the bottom of one public page (matched by its address, for example /cv-builder).
// Admin > Videos manages these. Nothing shows until "Show on the page" is on.
const PageVideoSchema = new mongoose.Schema({
    path: { type: String, required: true, trim: true, lowercase: true, maxlength: 200, index: true },
    youtubeId: { type: String, required: true, trim: true, match: /^[A-Za-z0-9_-]{11}$/ },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 300 },
    uploadDate: { type: Date, required: true },
    durationSec: { type: Number, min: 0, max: 86400, default: 0 },     // optional, used in the video markup when set
    visible: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("PageVideo", PageVideoSchema);
