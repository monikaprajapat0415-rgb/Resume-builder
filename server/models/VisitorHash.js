import mongoose from "mongoose";

// Used only to tell whether a visitor was already counted today. It holds a one-way hash that is salted with the
// day, so it cannot be turned back into an IP address or followed from one day to the next. Deleted after 2 days.
const VisitorHashSchema = new mongoose.Schema({
    day: { type: String, required: true },
    h: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 2 },
});
VisitorHashSchema.index({ day: 1, h: 1 }, { unique: true });

export default mongoose.model("VisitorHash", VisitorHashSchema);
