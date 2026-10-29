import mongoose from "mongoose";

// One row per India-time day: how many page views and how many different visitors. Counts only, nothing personal.
const VisitDaySchema = new mongoose.Schema({
    day: { type: String, required: true, unique: true }, // YYYY-MM-DD (IST)
    views: { type: Number, default: 0 },
    visitors: { type: Number, default: 0 },
});

export default mongoose.model("VisitDay", VisitDaySchema);
