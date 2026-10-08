import mongoose from "mongoose";

// One document per edited text. Anything not stored here falls back to the default
// in utils/siteContentDefaults.js, so the site always has complete text.
const SiteContentSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model("SiteContent", SiteContentSchema);
