import mongoose from "mongoose";

// Page views per page per day (for "top pages"). Rows clean themselves up after 90 days.
const VisitPageSchema = new mongoose.Schema({
    day: { type: String, required: true },   // YYYY-MM-DD (IST)
    path: { type: String, required: true },  // e.g. /learn/sql-for-beginners (no query string)
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 },
});
VisitPageSchema.index({ day: 1, path: 1 }, { unique: true });

export default mongoose.model("VisitPage", VisitPageSchema);
